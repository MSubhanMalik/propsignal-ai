import type { SearchResult } from '@/types'

export async function searchWeb(query: string): Promise<SearchResult[]> {
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
