'use client'

import { useParams, useRouter } from 'next/navigation'
import { useReport } from '@/hooks/useReport'
import { Navbar } from '@/components/layout/Navbar'
import { ProgressTracker } from './ProgressTracker'
import { ReportView } from './ReportView'
import type { AgentStep } from '@/types'

export function ReportScreen() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { report, error } = useReport(id)

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar breadcrumb="Report" />
      <main className="max-w-3xl mx-auto px-6 py-8">

        {error && (
          <div className="text-center py-20">
            <p className="text-[#94A3B8] text-sm">{error}</p>
            <button onClick={() => router.push('/')} className="mt-4 text-sm text-[#1D4ED8] hover:underline">
              ← Back to search
            </button>
          </div>
        )}

        {!report && !error && (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {report?.status === 'running' && (
          <div className="flex items-center justify-center py-12">
            <ProgressTracker
              currentStep={(report.current_step ?? 'resolving') as AgentStep}
              projectInput={report.project_input}
            />
          </div>
        )}

        {report?.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <p className="text-sm text-red-700 font-medium">Research failed</p>
            <p className="text-xs text-red-500 mt-1">{report.error ?? 'Unknown error'}</p>
            <button onClick={() => router.push('/')} className="mt-3 text-sm text-[#1D4ED8] hover:underline">
              ← Try again
            </button>
          </div>
        )}

        {report?.status === 'done' && <ReportView report={report} />}

      </main>
    </div>
  )
}
