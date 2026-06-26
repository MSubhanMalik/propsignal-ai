import Anthropic from '@anthropic-ai/sdk'
import { StateGraph, Annotation } from '@langchain/langgraph'
import { getMockSearchResults } from '../../src/lib/mock'
import { RESOLVE_PROMPT, EXTRACT_AND_SCORE_PROMPT } from '../../src/lib/prompts'
import { ResolveOutputSchema, ExtractOutputSchema } from '../../src/lib/types'
import type { SearchResult, Signal, Source, AgentStep } from '../../src/lib/types'
import { db } from './supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const USE_MOCK = process.env.USE_MOCK_SEARCH === 'true'

// ─── State ────────────────────────────────────────────────────────────────────

const AgentState = Annotation.Root({
  reportId: Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  projectInput: Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  resolvedName: Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  searchQueries: Annotation<string[]>({ reducer: (_, v) => v, default: () => [] }),
  searchResults: Annotation<SearchResult[]>({ reducer: (_, v) => v, default: () => [] }),
  signals: Annotation<Signal[]>({ reducer: (_, v) => v, default: () => [] }),
  credibilityScore: Annotation<number>({ reducer: (_, v) => v, default: () => 0 }),
  riskLevel: Annotation<string>({ reducer: (_, v) => v, default: () => 'unknown' }),
  summary: Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  sources: Annotation<Source[]>({ reducer: (_, v) => v, default: () => [] }),
  error: Annotation<string | undefined>({ reducer: (_, v) => v, default: () => undefined }),
})

type State = typeof AgentState.State

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function setStep(reportId: string, step: AgentStep) {
  await db.from('reports').update({ current_step: step }).eq('id', reportId)
}

async function llm(system: string, user: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system,
    messages: [{ role: 'user', content: user }],
  })
  const block = msg.content[0]
  return block.type === 'text' ? block.text : ''
}

async function searchWeb(query: string): Promise<SearchResult[]> {
  if (USE_MOCK) return getMockSearchResults(query)

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      max_results: 4,
    }),
  })
  const data = await res.json() as { results: { title: string; url: string; content: string }[] }
  return (data.results ?? []).map(r => ({
    title: r.title,
    url: r.url,
    snippet: r.content.slice(0, 400),
  }))
}

// ─── Nodes ────────────────────────────────────────────────────────────────────

async function resolve(state: State): Promise<Partial<State>> {
  await setStep(state.reportId, 'resolving')

  const raw = await llm(
    RESOLVE_PROMPT,
    `Project/developer query: "${state.projectInput}"`
  )

  const json = JSON.parse(raw.replace(/```json|```/g, '').trim())
  const parsed = ResolveOutputSchema.parse(json)

  return {
    resolvedName: parsed.resolvedName,
    searchQueries: parsed.searchQueries,
  }
}

async function search(state: State): Promise<Partial<State>> {
  await setStep(state.reportId, 'searching')

  // Save queries to searches table
  const allResults: SearchResult[] = []

  for (const query of state.searchQueries) {
    const results = await searchWeb(query)
    allResults.push(...results)

    await db.from('searches').insert({
      report_id: state.reportId,
      query,
      results: results as unknown as Record<string, unknown>[],
    })
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  const deduplicated = allResults.filter(r => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })

  return { searchResults: deduplicated }
}

async function extractAndScore(state: State): Promise<Partial<State>> {
  await setStep(state.reportId, 'extracting')

  const context = state.searchResults
    .map(r => `Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`)
    .join('\n\n---\n\n')

  const raw = await llm(
    EXTRACT_AND_SCORE_PROMPT,
    `Project: ${state.resolvedName}\n\nSearch Results:\n${context}`
  )

  const json = JSON.parse(raw.replace(/```json|```/g, '').trim())
  const parsed = ExtractOutputSchema.parse(json)

  const sources: Source[] = state.searchResults.map(r => ({
    title: r.title,
    url: r.url,
  }))

  return {
    signals: parsed.signals,
    credibilityScore: parsed.credibilityScore,
    riskLevel: parsed.riskLevel,
    summary: parsed.summary,
    sources,
  }
}

async function save(state: State): Promise<Partial<State>> {
  await setStep(state.reportId, 'saving')

  // Insert signals
  if (state.signals.length > 0) {
    await db.from('signals').insert(
      state.signals.map(s => ({ ...s, report_id: state.reportId }))
    )
  }

  // Mark report done
  await db.from('reports').update({
    status: 'done',
    current_step: 'saving',
    resolved_name: state.resolvedName,
    credibility_score: state.credibilityScore,
    risk_level: state.riskLevel,
    summary: state.summary,
    sources: state.sources as unknown as Record<string, unknown>[],
  }).eq('id', state.reportId)

  return {}
}

// ─── Graph ────────────────────────────────────────────────────────────────────

const graph = new StateGraph(AgentState)
  .addNode('resolve', resolve)
  .addNode('search', search)
  .addNode('extractAndScore', extractAndScore)
  .addNode('save', save)
  .addEdge('__start__', 'resolve')
  .addEdge('resolve', 'search')
  .addEdge('search', 'extractAndScore')
  .addEdge('extractAndScore', 'save')
  .addEdge('save', '__end__')
  .compile()

// ─── Run ─────────────────────────────────────────────────────────────────────

export async function runAgent(reportId: string, projectInput: string) {
  try {
    await graph.invoke({ reportId, projectInput })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await db.from('reports').update({ status: 'error', error: msg }).eq('id', reportId)
  }
}
