import { cn } from '@/lib/utils'
import { ExternalLink, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { Signal } from '@/types'

const TYPE_CONFIG: Record<string, { label: string; chip: string }> = {
  legal_issue:          { label: 'Legal Issue',          chip: 'bg-red-100 text-red-700 border-red-200' },
  fraud_allegation:     { label: 'Fraud Allegation',     chip: 'bg-red-100 text-red-700 border-red-200' },
  court_record:         { label: 'Court Record',         chip: 'bg-red-100 text-red-700 border-red-200' },
  delivery_delay:       { label: 'Delivery Delay',       chip: 'bg-amber-100 text-amber-700 border-amber-200' },
  social_complaint:     { label: 'Social Complaint',     chip: 'bg-amber-100 text-amber-700 border-amber-200' },
  government_notice:    { label: 'Government Notice',    chip: 'bg-amber-100 text-amber-700 border-amber-200' },
  positive_review:      { label: 'Positive Review',      chip: 'bg-green-100 text-green-700 border-green-200' },
  regulatory_approval:  { label: 'Regulatory Approval',  chip: 'bg-green-100 text-green-700 border-green-200' },
  award_recognition:    { label: 'Award',                chip: 'bg-green-100 text-green-700 border-green-200' },
  news_mention:         { label: 'News Mention',         chip: 'bg-blue-100 text-blue-700 border-blue-200' },
}

const SENTIMENT_ICON = {
  negative: <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  positive: <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />,
  neutral:  <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
}

interface Props {
  signal: Signal
}

export function SignalCard({ signal }: Props) {
  const type = TYPE_CONFIG[signal.type] ?? { label: signal.type, chip: 'bg-secondary text-muted-foreground border-border' }

  return (
    <div className="bg-white rounded-xl border border-border hover:border-foreground/30 hover:shadow-sm transition-all duration-150">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          {SENTIMENT_ICON[signal.sentiment]}
          <span className={cn(
            'text-[11px] font-display font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border',
            type.chip
          )}>
            {type.label}
          </span>
        </div>
        <div className="flex gap-0.5 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                i < signal.weight ? 'bg-foreground/35' : 'bg-border'
              )}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="font-semibold text-sm text-foreground leading-snug mb-1.5">
          {signal.title}
        </p>
        {signal.detail && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {signal.detail}
          </p>
        )}
        <a
          href={signal.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          {signal.source_title ?? 'View source'}
        </a>
      </div>
    </div>
  )
}
