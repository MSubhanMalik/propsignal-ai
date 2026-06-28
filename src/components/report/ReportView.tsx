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
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-4">
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
        <div className="bg-white rounded-2xl border-2 border-foreground p-10 text-center shadow-[4px_4px_0px_oklch(0.105_0.038_265)]">
          <p className="font-display font-semibold text-foreground mb-1">No signals found</p>
          <p className="text-sm text-muted-foreground">
            This may be a new or locally-known project with limited public presence.
          </p>
        </div>
      )}
    </div>
  )
}
