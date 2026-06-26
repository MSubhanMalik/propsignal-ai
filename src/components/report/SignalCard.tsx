import { cn } from '@/lib/utils'
import type { Signal } from '@/types'

const SENTIMENT_BORDER: Record<string, string> = {
  positive: 'border-l-green-500',
  negative: 'border-l-red-500',
  neutral:  'border-l-slate-300',
}

const TYPE_LABELS: Record<string, string> = {
  legal_issue:          'Legal Issue',
  fraud_allegation:     'Fraud Allegation',
  delivery_delay:       'Delivery Delay',
  positive_review:      'Positive Review',
  regulatory_approval:  'Regulatory Approval',
  news_mention:         'News Mention',
  social_complaint:     'Social Complaint',
  court_record:         'Court Record',
  award_recognition:    'Award',
  government_notice:    'Government Notice',
}

interface Props {
  signal: Signal
}

export function SignalCard({ signal }: Props) {
  return (
    <div className={cn(
      'bg-white border border-[#E2E8F0] rounded-xl p-4 border-l-4',
      SENTIMENT_BORDER[signal.sentiment] ?? 'border-l-slate-300'
    )}>
      <div className="flex items-start gap-3">
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
        <ExternalIcon />
        {signal.source_title ?? 'View source'}
      </a>
    </div>
  )
}

function WeightDots({ weight }: { weight: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cn('w-1.5 h-1.5 rounded-full', i < weight ? 'bg-[#94A3B8]' : 'bg-[#E2E8F0]')} />
      ))}
    </div>
  )
}

function ExternalIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}
