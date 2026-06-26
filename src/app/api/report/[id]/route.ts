import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/services/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: report, error } = await db
    .from('reports')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

  if (report.status === 'done') {
    const { data: signals } = await db
      .from('signals')
      .select('*')
      .eq('report_id', id)
      .order('weight', { ascending: false })

    return NextResponse.json({ ...report, signals: signals ?? [] })
  }

  return NextResponse.json({ ...report, signals: [] })
}
