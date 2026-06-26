import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from './_lib/supabase'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const { data, error } = await db
    .from('reports')
    .select('id, project_input, status, credibility_score, risk_level, summary, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ reports: data })
}
