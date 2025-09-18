import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET: 글 목록
export async function GET() {
  try {
    const result = await db.query('SELECT id, title, is_notice, author, created_at FROM tip_posts ORDER BY is_notice DESC, created_at DESC')
    return NextResponse.json(result.rows)
  } catch (err) {
    const error = err as Error & { stack?: string }
    return NextResponse.json({ error: 'DB Error', detail: String(error.message), stack: error.stack }, { status: 500 })
  }
}

// POST: 글 작성 (운영자만)
export async function POST(req: NextRequest) {
  try {
    const { title, content, is_notice, author, source } = await req.json()
    const result = await db.query(
      'INSERT INTO tip_posts (title, content, is_notice, tags, image_urls, author, source) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, content, is_notice || false, [], [], author || '', source || '']
    )
    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    const error = err as Error & { stack?: string }
    return NextResponse.json({ error: 'DB Error', detail: String(error.message), stack: error.stack }, { status: 500 })
  }
} 