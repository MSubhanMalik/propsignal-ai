import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/types'

const CONFIG: Record<RiskLevel, { label: string; className: string }> = {
  low:     { label: 'Low Risk',    className: 'bg-green-50 text-green-700 border-green-200' },
  medium:  { label: 'Medium Risk', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  high:    { label: 'High Risk',   className: 'bg-red-50 text-red-700 border-red-200' },
  unknown: { label: 'Unknown',     className: 'bg-slate-50 text-slate-600 border-slate-200' },
}

interface Props {
  level: RiskLevel
  className?: string
}

export function RiskBadge({ level, className }: Props) {
  const { label, className: colorClass } = CONFIG[level]
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
      colorClass, className
    )}>
      {label}
    </span>
  )
}
