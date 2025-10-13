import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET: 특정 모집 글 조회
export async function GET(
  _request: NextRequest,
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

    const result = await db.query(`
      SELECT 
        id, guild_name, title, content, requirements, 
        contact_info, author, is_active,
        created_at, updated_at
      FROM guild_recruit_posts 
      WHERE id = $1
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '모집 글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('길드 모집 글 조회 실패:', error)
    return NextResponse.json(
      { error: '모집 글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 모집 글 수정
export async function PUT(
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

    const {
      title,
      content,
      requirements,
      contact_info,
      is_active,
      password
    } = await request.json()

    // 비밀번호 확인
    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 기존 글 조회 (비밀번호 포함)
    const postResult = await db.query(
      'SELECT password FROM guild_recruit_posts WHERE id = $1',
      [id]
    )

    if (postResult.rows.length === 0) {
      return NextResponse.json(
        { error: '모집 글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, postResult.rows[0].password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    const result = await db.query(`
      UPDATE guild_recruit_posts 
      SET 
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        requirements = COALESCE($3, requirements),
        contact_info = COALESCE($4, contact_info),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
      WHERE id = $6
      RETURNING id
    `, [title, content, requirements, contact_info, is_active, id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '모집 글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '모집 글이 수정되었습니다.' })
  } catch (error) {
    console.error('길드 모집 글 수정 실패:', error)
    return NextResponse.json(
      { error: '모집 글 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 모집 글 삭제 (비활성화)
export async function DELETE(
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

    // 기존 글 조회 (비밀번호 포함)
    const postResult = await db.query(
      'SELECT password FROM guild_recruit_posts WHERE id = $1',
      [id]
    )

    if (postResult.rows.length === 0) {
      return NextResponse.json(
        { error: '모집 글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, postResult.rows[0].password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    const result = await db.query(`
      UPDATE guild_recruit_posts 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '모집 글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '모집 글이 삭제되었습니다.' })
  } catch (error) {
    console.error('길드 모집 글 삭제 실패:', error)
    return NextResponse.json(
      { error: '모집 글 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
