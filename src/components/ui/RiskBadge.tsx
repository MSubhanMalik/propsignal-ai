import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/types'

const CONFIG: Record<RiskLevel, { label: string; className: string }> = {
  low:     { label: 'Low Risk',    className: 'bg-green-50 text-green-700 border-green-300' },
  medium:  { label: 'Medium Risk', className: 'bg-amber-50 text-amber-700 border-amber-300' },
  high:    { label: 'High Risk',   className: 'bg-red-50 text-red-700 border-red-300' },
  unknown: { label: 'Unknown',     className: 'bg-secondary text-muted-foreground border-border' },
}

interface Props {
  level: RiskLevel
  className?: string
}

export function RiskBadge({ level, className }: Props) {
  const { label, className: colorClass } = CONFIG[level]
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border font-display',
      colorClass, className
    )}>
      {label}
    </span>
  )
}
