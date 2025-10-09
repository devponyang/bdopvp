import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST: 조회수 증가
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // 조회수 증가
    const result = await db.query(`
      UPDATE tip_posts 
      SET view_count = view_count + 1 
      WHERE id = $1 
      RETURNING view_count
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ view_count: result.rows[0].view_count })
  } catch (error) {
    console.error('조회수 증가 오류:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
