'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { SearchForm } from '@/components/search/SearchForm'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { startResearch, fetchReports } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Report, RiskLevel } from '@/types'

export function HomeScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [recentReports, setRecentReports] = useState<Report[]>([])

  useEffect(() => {
    fetchReports().then(setRecentReports).catch(() => {})
  }, [])

  async function handleSubmit(query: string) {
    setLoading(true)
    try {
      const { reportId } = await startResearch(query)
      router.push(`/reports/${reportId}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">

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

        {recentReports.length > 0 && (
          <div className="mt-16">
            <h2 className="text-sm font-semibold text-[#0D1B2A] mb-3 uppercase tracking-wide">
              Recent Reports
            </h2>
            <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0]">
              {recentReports.map(r => (
                <button
                  key={r.id}
                  onClick={() => router.push(`/reports/${r.id}`)}
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
                      <span className="text-sm font-semibold text-[#475569]">{r.credibility_score}</span>
                    )}
                    {r.risk_level
                      ? <RiskBadge level={r.risk_level as RiskLevel} />
                      : <span className="text-xs text-[#94A3B8]">{r.status}</span>
                    }
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
