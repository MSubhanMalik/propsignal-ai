'use client'

import { useRouter } from 'next/navigation'

interface Props {
  breadcrumb?: string
}

export function Navbar({ breadcrumb }: Props) {
  const router = useRouter()
  return (
    <nav className="bg-white border-b border-[#E2E8F0] px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <span className="font-bold text-[#0D1B2A] group-hover:text-[#1D4ED8] transition-colors">PropSignal</span>
        </button>
        {breadcrumb && (
          <>
            <span className="text-[#E2E8F0]">/</span>
            <span className="text-sm text-[#94A3B8]">{breadcrumb}</span>
          </>
        )}
        {!breadcrumb && (
          <span className="text-xs text-[#94A3B8] ml-auto hidden sm:block">Real estate due diligence, powered by AI</span>
        )}
      </div>
    </nav>
  )
}
