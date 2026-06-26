import { cn } from '@/lib/utils'
import { RiskBadge } from './RiskBadge'
import { formatDate } from '@/lib/utils'
import type { Report, Signal, RiskLevel } from '@/lib/types'

interface Props {
  report: Report & { signals: Signal[] }
}

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

const SENTIMENT_BORDER: Record<string, string> = {
  positive: 'border-l-green-500',
  negative: 'border-l-red-500',
  neutral:  'border-l-slate-300',
}

export function ReportView({ report }: Props) {
  const risk = (report.risk_level ?? 'unknown') as RiskLevel
  const sources = (report.sources ?? []) as { title: string; url: string }[]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium mb-1">Research Report</p>
            <h1 className="text-2xl font-bold text-[#0D1B2A]">
              {report.resolved_name ?? report.project_input}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">{formatDate(report.created_at)}</p>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              'w-20 h-20 rounded-full ring-4 flex items-center justify-center',
              SCORE_RING[risk]
            )}>
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

      {/* Signals */}
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

      {/* Sources */}
      {sources.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#0D1B2A] mb-3">
            Sources Reviewed ({sources.length})
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0]">
            {sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F8FA] transition-colors group"
              >
                <div className="w-6 h-6 rounded bg-[#F1F3F7] flex items-center justify-center flex-shrink-0 text-xs text-[#94A3B8] font-medium">
                  {i + 1}
                </div>
                <span className="text-sm text-[#475569] group-hover:text-[#1D4ED8] transition-colors truncate">
                  {src.title}
                </span>
                <ExternalIcon className="ml-auto flex-shrink-0 text-[#CBD5E1] group-hover:text-[#1D4ED8]" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* No signals */}
      {report.signals.length === 0 && report.status === 'done' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center">
          <p className="text-[#94A3B8] text-sm">No public signals found for this project.</p>
          <p className="text-[#94A3B8] text-xs mt-1">This may indicate a new or locally-known project with limited public presence.</p>
        </div>
      )}
    </div>
  )
}

function SignalCard({ signal }: { signal: Signal }) {
  const TYPE_LABELS: Record<string, string> = {
    legal_issue: 'Legal Issue',
    fraud_allegation: 'Fraud Allegation',
    delivery_delay: 'Delivery Delay',
    positive_review: 'Positive Review',
    regulatory_approval: 'Regulatory Approval',
    news_mention: 'News Mention',
    social_complaint: 'Social Complaint',
    court_record: 'Court Record',
    award_recognition: 'Award',
    government_notice: 'Government Notice',
  }

  return (
    <div className={cn(
      'bg-white border border-[#E2E8F0] rounded-xl p-4 border-l-4',
      SENTIMENT_BORDER[signal.sentiment] ?? 'border-l-slate-300'
    )}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#94A3B8] font-medium">
              {TYPE_LABELS[signal.type] ?? signal.type}
            </span>
            <WeightDots weight={signal.weight} />
          </div>
          <p className="text-sm font-medium text-[#0D1B2A]">{signal.title}</p>
          {signal.detail && (
            <p className="text-xs text-[#475569] mt-1 leading-relaxed">{signal.detail}</p>
          )}
        </div>
      </div>
      <a
        href={signal.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 mt-2 text-xs text-[#1D4ED8] hover:underline"
      >
        <ExternalIcon className="w-3 h-3" />
        {signal.source_title ?? 'View source'}
      </a>
    </div>
  )
}

function WeightDots({ weight }: { weight: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            i < weight ? 'bg-[#94A3B8]' : 'bg-[#E2E8F0]'
          )}
        />
      ))}
    </div>
  )
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('w-3.5 h-3.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}
