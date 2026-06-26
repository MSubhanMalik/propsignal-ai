'use client'

import { useState, useEffect, useRef } from 'react'
import { fetchReport } from '@/lib/api'
import type { FullReport } from '@/lib/api'

const POLL_INTERVAL_MS = 4000

export function useReport(id: string | undefined) {
  const [report, setReport] = useState<FullReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!id) return

    async function poll() {
      try {
        const data = await fetchReport(id!)
        setReport(data)
        if (data.status === 'done' || data.status === 'error') {
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch {
        setError('Failed to load report')
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [id])

  return { report, error }
}
