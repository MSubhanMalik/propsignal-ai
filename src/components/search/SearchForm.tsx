'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { cn } from '@/lib/utils'

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
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="e.g. DHA Valley Islamabad, Bahria Town Karachi..."
          disabled={loading}
          className={cn(
            'flex-1 h-11 px-4 rounded-lg border text-sm bg-white',
            'border-[#E2E8F0] text-[#0D1B2A] placeholder:text-[#94A3B8]',
            'focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className={cn(
            'h-11 px-5 rounded-lg text-sm font-medium text-white',
            'bg-[#1D4ED8] hover:bg-[#1E3A8A]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors flex items-center gap-2 whitespace-nowrap'
          )}
        >
          {loading ? (
            <>
              <Spinner />
              Researching...
            </>
          ) : (
            'Research'
          )}
        </button>
      </form>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs text-[#94A3B8]">Try:</span>
        {SAMPLES.map(s => (
          <button
            key={s}
            onClick={() => {
              setValue(s)
              if (!loading) onSubmit(s)
            }}
            disabled={loading}
            className={cn(
              'text-xs px-3 py-1 rounded-full border border-[#E2E8F0]',
              'text-[#475569] hover:border-[#1D4ED8] hover:text-[#1D4ED8]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'transition-colors bg-white'
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
