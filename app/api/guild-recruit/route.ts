import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET: 모집 글 목록 조회 (페이지네이션 지원)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // 전체 개수 조회
    const countResult = await db.query(`
      SELECT COUNT(*) as total
      FROM guild_recruit_posts 
      WHERE is_active = true
    `)
    const total = parseInt(countResult.rows[0].total)

    // 페이지네이션된 데이터 조회
    const result = await db.query(`
      SELECT 
        id, guild_name, title, content, requirements, 
        contact_info, author, is_active,
        created_at, updated_at
      FROM guild_recruit_posts 
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])
    
    return NextResponse.json({
      posts: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('길드 모집 글 조회 실패:', error)
    return NextResponse.json(
      { error: '길드 모집 글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 모집 글 작성
export async function POST(request: NextRequest) {
  try {
    const {
      guild_name,
      title,
      content,
      requirements,
      contact_info,
      author,
      password
    } = await request.json()

    // 필수 필드 검증
    if (!guild_name || !title || !content || !author || !password) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    // 비밀번호 길이 검증
    if (password.length < 4) {
      return NextResponse.json(
        { error: '비밀번호는 최소 4자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // 길드명 길이 검증
    if (guild_name.length > 50) {
      return NextResponse.json(
        { error: '길드명은 50자를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    // 제목 길이 검증
    if (title.length > 100) {
      return NextResponse.json(
        { error: '제목은 100자를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    // 내용 길이 검증
    if (content.length > 2000) {
      return NextResponse.json(
        { error: '내용은 2000자를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db.query(`
      INSERT INTO guild_recruit_posts 
      (guild_name, title, content, requirements, contact_info, author, password, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING id
    `, [guild_name, title, content, requirements, contact_info, author, hashedPassword])

    return NextResponse.json(
      { message: '모집 글이 성공적으로 등록되었습니다.', id: result.rows[0].id },
      { status: 201 }
    )
  } catch (error) {
    console.error('길드 모집 글 작성 실패:', error)
    return NextResponse.json(
      { error: '모집 글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
