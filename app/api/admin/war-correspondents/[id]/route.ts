import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { id } = await params
    const body = await request.json()

    const result = await db.query(
      'UPDATE war_correspondents SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [body.is_active, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '종군기자를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('종군기자 수정 오류:', error)
    return NextResponse.json({ error: '종군기자 수정에 실패했습니다.' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { id } = await params

    const result = await db.query('DELETE FROM war_correspondents WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '종군기자를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({ message: '종군기자가 삭제되었습니다.' })
  } catch (error) {
    console.error('종군기자 삭제 오류:', error)
    return NextResponse.json({ error: '종군기자 삭제에 실패했습니다.' }, { status: 500 })
  }
}






