import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from './_lib/supabase'
import { runAgent } from './_lib/agent'

export const maxDuration = 60

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { projectInput } = req.body as { projectInput?: string }
  if (!projectInput?.trim()) {
    return res.status(400).json({ error: 'projectInput is required' })
  }

  // Create report row (status: running)
  const { data, error } = await db
    .from('reports')
    .insert({ project_input: projectInput.trim(), status: 'running', current_step: 'resolving' })
    .select('id')
    .single()

  if (error || !data) {
    return res.status(500).json({ error: 'Failed to create report' })
  }

  const reportId = data.id as string

  // Return immediately — agent runs async via waitUntil if available, else inline
  res.status(202).json({ reportId })

  // Run agent after response is sent (Vercel keeps fn alive until promise resolves)
  await runAgent(reportId, projectInput.trim())
}
