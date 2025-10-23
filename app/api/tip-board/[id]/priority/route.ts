import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH: 우선순위 업데이트 (끌어올리기)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await req.json()
    const { action } = body

    if (action !== 'up') {
      return NextResponse.json({ error: 'Invalid action. Only "up" is supported.' }, { status: 400 })
    }

    // 현재 게시글의 우선순위 조회
    const currentPost = await db.query('SELECT priority FROM tip_posts WHERE id = $1', [id])
    if (currentPost.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const currentPriority = currentPost.rows[0].priority || 0
    const newPriority = currentPriority + 1

    // 우선순위 업데이트
    const result = await db.query(
      'UPDATE tip_posts SET priority = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newPriority, id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('우선순위 업데이트 오류:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
