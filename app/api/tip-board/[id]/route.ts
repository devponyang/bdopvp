import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: 글 상세
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const result = await db.query('SELECT * FROM tip_posts WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT: 글 수정 (운영자만)
export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, content, tags, image_urls, author, source, is_notice } = await _req.json()
    const result = await db.query(
      'UPDATE tip_posts SET title = $1, content = $2, tags = $3, image_urls = $4, author = $5, source = $6, is_notice = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [title, content, tags || [], image_urls || [], author || '', source || '', is_notice || false, id]
    )
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(result.rows[0])
  } catch (err) {
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  }
}

// DELETE: 글 삭제 (운영자만)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.query('DELETE FROM tip_posts WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  }
}