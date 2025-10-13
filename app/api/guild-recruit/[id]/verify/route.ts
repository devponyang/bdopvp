import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// POST: 비밀번호 검증
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID입니다.' },
        { status: 400 }
      )
    }

    const { password } = await request.json()

    // 비밀번호 확인
    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 글 조회 (비밀번호 포함)
    const result = await db.query(
      'SELECT password FROM guild_recruit_posts WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '모집 글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, result.rows[0].password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, message: '비밀번호가 확인되었습니다.' })
  } catch (error) {
    console.error('비밀번호 검증 실패:', error)
    return NextResponse.json(
      { error: '비밀번호 검증에 실패했습니다.' },
      { status: 500 }
    )
  }
}

