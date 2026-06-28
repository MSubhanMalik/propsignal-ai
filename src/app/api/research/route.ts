import { NextRequest, NextResponse, after } from 'next/server'
import { db } from '@/services/supabase'
import { runAgent } from '@/services/agent/graph'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { projectInput } = await req.json() as { projectInput?: string }

  if (!projectInput?.trim()) {
    return NextResponse.json({ error: 'projectInput is required' }, { status: 400 })
  }

  const { data, error } = await db
    .from('reports')
    .insert({ project_input: projectInput.trim(), status: 'running', current_step: 'resolving' })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }

  const reportId = data.id as string

  after(runAgent(reportId, projectInput.trim()))

  return NextResponse.json({ reportId }, { status: 202 })
}
