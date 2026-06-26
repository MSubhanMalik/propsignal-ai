import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }
  if (!id) return res.status(400).json({ error: 'Missing id' })

  const { data: report, error } = await db
    .from('reports')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !report) return res.status(404).json({ error: 'Report not found' })

  // If done, fetch signals
  if (report.status === 'done') {
    const { data: signals } = await db
      .from('signals')
      .select('*')
      .eq('report_id', id)
      .order('weight', { ascending: false })

    return res.json({ ...report, signals: signals ?? [] })
  }

  res.json({ ...report, signals: [] })
}
