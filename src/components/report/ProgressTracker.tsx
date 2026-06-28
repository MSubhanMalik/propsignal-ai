import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { AgentStep } from '@/types'

const STEPS: { key: AgentStep; label: string; sub: string }[] = [
  { key: 'resolving',  label: 'Resolving',  sub: 'Normalising project name' },
  { key: 'searching',  label: 'Searching',  sub: 'Scanning public sources' },
  { key: 'extracting', label: 'Extracting', sub: 'Identifying credibility signals' },
  { key: 'saving',     label: 'Writing',    sub: 'Building your report' },
]

const STEP_ORDER: AgentStep[] = ['resolving', 'searching', 'extracting', 'saving']

interface Props {
  currentStep: AgentStep
  projectInput: string
}

export function ProgressTracker({ currentStep, projectInput }: Props) {
  const currentIndex = STEP_ORDER.indexOf(currentStep)

  return (
    <div className="bg-white rounded-2xl border-2 border-foreground p-8 max-w-md w-full mx-auto shadow-[4px_4px_0px_oklch(0.105_0.038_265)]">
      <p className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-1">Researching</p>
      <p className="font-display font-bold text-xl text-foreground mb-8 truncate">{projectInput}</p>

      <div className="space-y-1">
        {STEPS.map(({ key, label, sub }, i) => {
          const done = i < currentIndex
          const active = i === currentIndex

          return (
            <div key={key} className="flex items-start gap-4">
              {/* connector line + dot */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  done && 'bg-primary border-primary',
                  active && 'border-primary bg-white',
                  !done && !active && 'border-border bg-white'
                )}>
                  {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'w-0.5 h-6 my-1 transition-colors duration-300',
                    i < currentIndex ? 'bg-primary' : 'bg-border'
                  )} />
                )}
              </div>

              {/* text */}
              <div className={cn('pb-6', i === STEPS.length - 1 && 'pb-0')}>
                <p className={cn(
                  'font-display font-semibold text-sm transition-colors',
                  done && 'text-muted-foreground line-through',
                  active && 'text-foreground',
                  !done && !active && 'text-muted-foreground'
                )}>
                  {label}
                </p>
                {active && (
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
