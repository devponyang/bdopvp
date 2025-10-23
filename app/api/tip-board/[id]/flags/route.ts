import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH: 플래그 업데이트 (is_new, is_updated)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await req.json()
    const { is_new, is_updated } = body

    // 업데이트할 필드들 구성
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (typeof is_new === 'boolean') {
      updates.push(`is_new = $${paramIndex}`)
      values.push(is_new)
      paramIndex++
    }

    if (typeof is_updated === 'boolean') {
      updates.push(`is_updated = $${paramIndex}`)
      values.push(is_updated)
      paramIndex++
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // updated_at 필드 추가
    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = `UPDATE tip_posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`
    const result = await db.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('플래그 업데이트 오류:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
