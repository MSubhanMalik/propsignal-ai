import { Annotation } from '@langchain/langgraph'
import type { SearchResult, Signal, Source } from '@/types'

export const AgentAnnotation = Annotation.Root({
  reportId:         Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  projectInput:     Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  resolvedName:     Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  searchQueries:    Annotation<string[]>({ reducer: (_, v) => v, default: () => [] }),
  searchResults:    Annotation<SearchResult[]>({ reducer: (_, v) => v, default: () => [] }),
  signals:          Annotation<Signal[]>({ reducer: (_, v) => v, default: () => [] }),
  credibilityScore: Annotation<number>({ reducer: (_, v) => v, default: () => 0 }),
  riskLevel:        Annotation<string>({ reducer: (_, v) => v, default: () => 'unknown' }),
  summary:          Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  sources:          Annotation<Source[]>({ reducer: (_, v) => v, default: () => [] }),
  error:            Annotation<string | undefined>({ reducer: (_, v) => v, default: () => undefined }),
})

export type AgentRunState = typeof AgentAnnotation.State
