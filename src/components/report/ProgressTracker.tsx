import { cn } from '@/lib/utils'
import type { AgentStep } from '@/types'

const STEPS: { key: AgentStep; label: string }[] = [
  { key: 'resolving', label: 'Resolving project name' },
  { key: 'searching', label: 'Searching public sources' },
  { key: 'extracting', label: 'Extracting credibility signals' },
  { key: 'saving', label: 'Writing report' },
]

const STEP_ORDER: AgentStep[] = ['resolving', 'searching', 'extracting', 'saving']

interface Props {
  currentStep: AgentStep
  projectInput: string
}

export function ProgressTracker({ currentStep, projectInput }: Props) {
  const currentIndex = STEP_ORDER.indexOf(currentStep)

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-md mx-auto">
      <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium mb-1">Researching</p>
      <p className="text-base font-semibold text-[#0D1B2A] mb-6 truncate">{projectInput}</p>

      <div className="space-y-4">
        {STEPS.map(({ key, label }, i) => {
          const done = i < currentIndex
          const active = i === currentIndex

          return (
            <div key={key} className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                done && 'bg-[#1D4ED8]',
                active && 'border-2 border-[#1D4ED8] bg-white',
                !done && !active && 'border-2 border-[#E2E8F0] bg-white'
              )}>
                {done && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {active && (
                  <div className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
                )}
              </div>
              <span className={cn(
                'text-sm transition-colors',
                done && 'text-[#94A3B8] line-through',
                active && 'text-[#0D1B2A] font-medium',
                !done && !active && 'text-[#94A3B8]'
              )}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
