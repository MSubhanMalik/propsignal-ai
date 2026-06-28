'use client'

import { useParams, useRouter } from 'next/navigation'
import { useReport } from '@/hooks/useReport'
import { Navbar } from '@/components/layout/Navbar'
import { ProgressTracker } from './ProgressTracker'
import { ReportView } from './ReportView'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { AgentStep } from '@/types'

export function ReportScreen() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { report, error } = useReport(id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar breadcrumb="Report" />
      <main className="max-w-3xl mx-auto px-6 py-8">

        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="rounded-full font-display"
            >
              ← Back to search
            </Button>
          </div>
        )}

        {!report && !error && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
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
          <div className="bg-white rounded-2xl border-2 border-red-300 p-8 text-center shadow-[4px_4px_0px_theme(colors.red.200)]">
            <p className="font-display font-bold text-red-600 mb-1">Research failed</p>
            <p className="text-xs text-red-500/80 mb-5">{report.error ?? 'Unknown error'}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="rounded-full font-display"
            >
              ← Try again
            </Button>
          </div>
        )}

        {report?.status === 'done' && <ReportView report={report} />}

      </main>
    </div>
  )
}
