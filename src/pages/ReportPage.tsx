import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProgressTracker } from '@/components/ProgressTracker'
import { ReportView } from '@/components/ReportView'
import type { Report, Signal, AgentStep } from '@/lib/types'

type FullReport = Report & { signals: Signal[] }

export function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<FullReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!id) return

    async function poll() {
      try {
        const res = await fetch(`/api/report/${id}`)
        if (!res.ok) { setError('Report not found'); return }

        const data = await res.json() as FullReport
        setReport(data)

        if (data.status === 'done' || data.status === 'error') {
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch {
        setError('Failed to load report')
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [id])

  if (error) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <p className="text-[#94A3B8] text-sm">{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 text-sm text-[#1D4ED8] hover:underline">
            ← Back to search
          </button>
        </div>
      </PageShell>
    )
  }

  if (!report) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      {(report.status === 'running') && (
        <div className="flex items-center justify-center py-12">
          <ProgressTracker
            currentStep={(report.current_step ?? 'resolving') as AgentStep}
            projectInput={report.project_input}
          />
        </div>
      )}

      {report.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <p className="text-sm text-red-700 font-medium">Research failed</p>
          <p className="text-xs text-red-500 mt-1">{report.error ?? 'Unknown error'}</p>
          <button onClick={() => navigate('/')} className="mt-3 text-sm text-[#1D4ED8] hover:underline">
            ← Try again
          </button>
        </div>
      )}

      {report.status === 'done' && (
        <ReportView report={report} />
      )}
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <nav className="bg-white border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <span className="font-bold text-[#0D1B2A] group-hover:text-[#1D4ED8] transition-colors">PropSignal</span>
          </button>
          <span className="text-[#E2E8F0]">/</span>
          <span className="text-sm text-[#94A3B8]">Report</span>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
