import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const marks = await db.query('SELECT * FROM guild_marks ORDER BY created_at DESC')
    return NextResponse.json(marks.rows)
  } catch (error) {
    console.error('길드마크 목록 조회 오류:', error)
    return NextResponse.json({ error: '길드마크 목록을 불러올 수 없습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { guild_name, mark_url } = await request.json()

    if (!guild_name || !mark_url) {
      return NextResponse.json({ error: '길드명과 길드마크 URL은 필수입니다.' }, { status: 400 })
    }

    // 중복 길드명 체크
    const existingMark = await db.query('SELECT id FROM guild_marks WHERE guild_name = $1', [guild_name])
    if (existingMark.rows.length > 0) {
      return NextResponse.json({ error: '이미 등록된 길드명입니다.' }, { status: 400 })
    }

    const result = await db.query(
      'INSERT INTO guild_marks (guild_name, mark_url, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [guild_name, mark_url]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('길드마크 추가 오류:', error)
    return NextResponse.json({ error: '길드마크 추가에 실패했습니다.' }, { status: 500 })
  }
}







