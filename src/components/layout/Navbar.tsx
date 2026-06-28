'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  breadcrumb?: string
}

export function Navbar({ breadcrumb }: Props) {
  const router = useRouter()

  return (
    <nav className="bg-transparent px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 group"
        >
          <span className="font-display font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
            PropSignal
          </span>
          <span className="text-primary font-display font-bold text-xl">.</span>
        </button>

        {breadcrumb ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{breadcrumb}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground hidden sm:block">
            AI-powered · Real-time · Pakistan
          </span>
        )}

        <Button
          onClick={() => router.push('/')}
          className="rounded-full font-display font-semibold px-5"
        >
          Start research →
        </Button>
      </div>
    </nav>
  )
}
