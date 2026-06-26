import type { Report, Signal } from '@/types'

export type FullReport = Report & { signals: Signal[] }

export async function startResearch(projectInput: string): Promise<{ reportId: string }> {
  const res = await fetch('/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectInput }),
  })
  if (!res.ok) throw new Error('Failed to start research')
  return res.json()
}

export async function fetchReport(id: string): Promise<FullReport> {
  const res = await fetch(`/api/report/${id}`)
  if (!res.ok) throw new Error('Report not found')
  return res.json()
}

export async function fetchReports(): Promise<Report[]> {
  const res = await fetch('/api/reports')
  if (!res.ok) return []
  const data = await res.json()
  return data.reports ?? []
}
