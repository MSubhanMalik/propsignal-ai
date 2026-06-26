import { ReportHeader } from './ReportHeader'
import { SignalCard } from './SignalCard'
import { SourceList } from './SourceList'
import type { Report, Signal } from '@/types'

interface Props {
  report: Report & { signals: Signal[] }
}

export function ReportView({ report }: Props) {
  const sources = (report.sources ?? []) as { title: string; url: string }[]

  return (
    <div className="space-y-8">
      <ReportHeader report={report} />

      {report.signals.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#0D1B2A] mb-3">
            Signals Found ({report.signals.length})
          </h2>
          <div className="space-y-3">
            {report.signals.map((signal, i) => (
              <SignalCard key={i} signal={signal} />
            ))}
          </div>
        </div>
      )}

      <SourceList sources={sources} />

      {report.signals.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center">
          <p className="text-[#94A3B8] text-sm">No public signals found for this project.</p>
          <p className="text-[#94A3B8] text-xs mt-1">This may indicate a new or locally-known project with limited public presence.</p>
        </div>
      )}
    </div>
  )
}
