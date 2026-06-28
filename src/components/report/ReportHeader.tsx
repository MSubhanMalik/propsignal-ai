import { cn } from '@/lib/utils'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { formatDate } from '@/lib/utils'
import type { Report, RiskLevel } from '@/types'

const SCORE_COLOR: Record<RiskLevel, string> = {
  low:     'text-green-600',
  medium:  'text-amber-600',
  high:    'text-red-600',
  unknown: 'text-muted-foreground',
}

const SCORE_BG: Record<RiskLevel, string> = {
  low:     'bg-green-50 border-green-200',
  medium:  'bg-amber-50 border-amber-200',
  high:    'bg-red-50 border-red-200',
  unknown: 'bg-secondary border-border',
}

interface Props {
  report: Report
}

export function ReportHeader({ report }: Props) {
  const risk = (report.risk_level ?? 'unknown') as RiskLevel

  return (
    <div className="bg-white rounded-2xl border-2 border-foreground p-6 lg:p-8 shadow-[4px_4px_0px_oklch(0.105_0.038_265)]">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-display mb-2">
            Research Report · {formatDate(report.created_at)}
          </p>
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-foreground leading-tight">
            {report.resolved_name ?? report.project_input}
          </h1>
        </div>

        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div className={cn(
            'w-24 h-24 rounded-2xl border-2 flex items-center justify-center',
            SCORE_BG[risk]
          )}>
            <span className={cn('font-display font-bold text-4xl leading-none', SCORE_COLOR[risk])}>
              {report.credibility_score ?? '—'}
            </span>
          </div>
          <RiskBadge level={risk} />
        </div>
      </div>

      {report.summary && (
        <p className="mt-6 text-sm text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4">
          {report.summary}
        </p>
      )}
    </div>
  )
}
