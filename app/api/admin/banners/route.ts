import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/validation'

// 배너 목록 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // main, sidebar, card, inline
    const position = searchParams.get('position') // home, guild, solare 등
    
    const client = await db.connect()
    
    try {
      let query = `
        SELECT id, title, description, image_url, link_url, button_text, is_active, priority, 
               banner_type, position, created_at, updated_at
        FROM banners 
      `
      const params: any[] = []
      const conditions: string[] = []
      
      // 타입 필터링
      if (type) {
        conditions.push(`banner_type = $${params.length + 1}`)
        params.push(type)
      }
      
      // 위치 필터링
      if (position) {
        conditions.push(`position = $${params.length + 1}`)
        params.push(position)
      }
      
      // 활성 배너만 (클라이언트 요청 시)
      if (type || position) {
        conditions.push('is_active = true')
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`
      }
      
      query += ` ORDER BY priority ASC, created_at DESC`
      
      const result = await client.query(query, params)
      
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

// 새 배너 생성
export async function POST(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(req)
    if (authError) return authError

    const body = await req.json()
    const { title, description, imageUrl, linkUrl, buttonText, isActive, priority, bannerType, position } = body

    // 입력 검증 (선택적)
    // if (!title || !description || !imageUrl || !linkUrl || !buttonText) {
    //   return NextResponse.json(
    //     { error: '필수 필드가 누락되었습니다' },
    //     { status: 400 }
    //   )
    // }

    // 배너 타입 검증
    const validBannerTypes = ['main', 'sidebar', 'card', 'inline']
    if (bannerType && !validBannerTypes.includes(bannerType)) {
      return NextResponse.json(
        { error: '유효하지 않은 배너 타입입니다' },
        { status: 400 }
      )
    }

    const client = await db.connect()
    
    try {
      const result = await client.query(`
        INSERT INTO banners (title, description, image_url, link_url, button_text, is_active, priority, banner_type, position)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        sanitizeString(title),
        sanitizeString(description),
        sanitizeString(imageUrl),
        sanitizeString(linkUrl),
        sanitizeString(buttonText),
        isActive === true,
        priority || 1,
        bannerType || 'main',
        position || 'home'
      ])

      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to create banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}





