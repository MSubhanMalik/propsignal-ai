'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

const SAMPLES = [
  'DHA Valley Islamabad',
  'Park Lane Residences',
  'Bahria Orchard Lahore',
]

interface Props {
  onSubmit: (query: string) => void
  loading: boolean
}

export function SearchForm({ onSubmit, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="e.g. DHA Valley Islamabad..."
          disabled={loading}
          className="flex-1 h-12 rounded-full px-5 bg-white border-2 border-foreground text-sm shadow-[2px_2px_0px_oklch(0.105_0.038_265)] focus-visible:shadow-[3px_3px_0px_oklch(0.52_0.24_277)] focus-visible:border-primary transition-all"
        />
        <Button
          type="submit"
          disabled={loading || !value.trim()}
          className="h-12 px-6 rounded-full font-display font-semibold text-sm whitespace-nowrap border-2 border-foreground shadow-[3px_3px_0px_oklch(0.105_0.038_265)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Researching...
            </>
          ) : (
            'Research →'
          )}
        </Button>
      </form>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="text-xs text-muted-foreground">Try:</span>
        {SAMPLES.map(s => (
          <button
            key={s}
            onClick={() => {
              setValue(s)
              if (!loading) onSubmit(s)
            }}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
