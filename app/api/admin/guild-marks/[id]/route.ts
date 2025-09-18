import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
    }

    // 길드마크 존재 확인
    const existingMark = await db.query('SELECT id FROM guild_marks WHERE id = $1', [id])
    if (existingMark.rows.length === 0) {
      return NextResponse.json({ error: '길드마크를 찾을 수 없습니다.' }, { status: 404 })
    }

    await db.query('DELETE FROM guild_marks WHERE id = $1', [id])

    return NextResponse.json({ message: '길드마크가 성공적으로 삭제되었습니다.' })
  } catch (error) {
    console.error('길드마크 삭제 오류:', error)
    return NextResponse.json({ error: '길드마크 삭제에 실패했습니다.' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const { guild_name, mark_url } = await request.json()

    if (isNaN(id)) {
      return NextResponse.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
    }

    if (!guild_name || !mark_url) {
      return NextResponse.json({ error: '길드명과 길드마크 URL은 필수입니다.' }, { status: 400 })
    }

    // 길드마크 존재 확인
    const existingMark = await db.query('SELECT id FROM guild_marks WHERE id = $1', [id])
    if (existingMark.rows.length === 0) {
      return NextResponse.json({ error: '길드마크를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 중복 길드명 체크 (자신 제외)
    const duplicateMark = await db.query('SELECT id FROM guild_marks WHERE guild_name = $1 AND id != $2', [guild_name, id])
    if (duplicateMark.rows.length > 0) {
      return NextResponse.json({ error: '이미 등록된 길드명입니다.' }, { status: 400 })
    }

    const result = await db.query(
      'UPDATE guild_marks SET guild_name = $1, mark_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [guild_name, mark_url, id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('길드마크 수정 오류:', error)
    return NextResponse.json({ error: '길드마크 수정에 실패했습니다.' }, { status: 500 })
  }
}

