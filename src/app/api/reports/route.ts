import { NextResponse } from 'next/server'
import { db } from '@/services/supabase'

export async function GET() {
  const { data, error } = await db
    .from('reports')
    .select('id, project_input, status, credibility_score, risk_level, summary, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reports: data })
}
