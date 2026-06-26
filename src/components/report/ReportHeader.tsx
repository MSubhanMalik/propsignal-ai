import { cn } from '@/lib/utils'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { formatDate } from '@/lib/utils'
import type { Report, RiskLevel } from '@/types'

const SCORE_COLOR: Record<RiskLevel, string> = {
  low:     'text-green-700',
  medium:  'text-amber-700',
  high:    'text-red-700',
  unknown: 'text-slate-500',
}

const SCORE_RING: Record<RiskLevel, string> = {
  low:     'ring-green-200',
  medium:  'ring-amber-200',
  high:    'ring-red-200',
  unknown: 'ring-slate-200',
}

interface Props {
  report: Report
}

export function ReportHeader({ report }: Props) {
  const risk = (report.risk_level ?? 'unknown') as RiskLevel

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium mb-1">Research Report</p>
          <h1 className="text-2xl font-bold text-[#0D1B2A]">
            {report.resolved_name ?? report.project_input}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">{formatDate(report.created_at)}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className={cn('w-20 h-20 rounded-full ring-4 flex items-center justify-center', SCORE_RING[risk])}>
            <span className={cn('text-3xl font-bold', SCORE_COLOR[risk])}>
              {report.credibility_score ?? '—'}
            </span>
          </div>
          <RiskBadge level={risk} />
        </div>
      </div>

      {report.summary && (
        <p className="mt-4 text-sm text-[#475569] leading-relaxed border-l-4 border-[#E2E8F0] pl-4 italic">
          {report.summary}
        </p>
      )}
    </div>
  )
}
