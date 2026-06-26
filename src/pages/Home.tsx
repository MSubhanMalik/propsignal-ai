import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchForm } from '@/components/SearchForm'
import { RiskBadge } from '@/components/RiskBadge'
import { formatDate } from '@/lib/utils'
import type { RiskLevel } from '@/lib/types'

interface ReportSummary {
  id: string
  project_input: string
  status: string
  credibility_score: number | null
  risk_level: RiskLevel | null
  created_at: string
}

export function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [recentReports, setRecentReports] = useState<ReportSummary[]>([])

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(d => setRecentReports(d.reports ?? []))
      .catch(() => {})
  }, [])

  async function handleSubmit(query: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectInput: query }),
      })
      const { reportId } = await res.json() as { reportId: string }
      navigate(`/reports/${reportId}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <nav className="bg-white border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <span className="font-bold text-[#0D1B2A]">PropSignal</span>
          </div>
          <span className="text-xs text-[#94A3B8]">Real estate due diligence, powered by AI</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-3">
            Research any real estate project
          </h1>
          <p className="text-[#475569] text-base max-w-xl mx-auto">
            PropSignal searches public sources — news, court records, reviews — and generates
            a credibility report for buyers in minutes.
          </p>
        </div>

        <SearchForm onSubmit={handleSubmit} loading={loading} />

        {/* Recent reports */}
        {recentReports.length > 0 && (
          <div className="mt-16">
            <h2 className="text-sm font-semibold text-[#0D1B2A] mb-3 uppercase tracking-wide">
              Recent Reports
            </h2>
            <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0]">
              {recentReports.map(r => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/reports/${r.id}`)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#F7F8FA] transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0D1B2A] truncate group-hover:text-[#1D4ED8]">
                      {r.project_input}
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{formatDate(r.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {r.credibility_score != null && (
                      <span className="text-sm font-semibold text-[#475569]">
                        {r.credibility_score}
                      </span>
                    )}
                    {r.risk_level ? (
                      <RiskBadge level={r.risk_level as RiskLevel} />
                    ) : (
                      <span className="text-xs text-[#94A3B8]">{r.status}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
