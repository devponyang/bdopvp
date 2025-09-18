import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(req)
    if (authError) return authError

    const result = await db.query(`
      SELECT * FROM war_correspondents 
      ORDER BY created_at DESC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('종군기자 목록 조회 오류:', error)
    return NextResponse.json({ error: '종군기자 목록을 불러올 수 없습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { streamer_name, chzzk_channel_url, profile_image_url, description } = await request.json()

    if (!streamer_name || !chzzk_channel_url) {
      return NextResponse.json({ error: '스트리머명과 채널 URL은 필수입니다.' }, { status: 400 })
    }

    // 중복 체크
    const existingCorrespondent = await db.query(
      'SELECT id FROM war_correspondents WHERE streamer_name = $1 OR chzzk_channel_url = $2', 
      [streamer_name, chzzk_channel_url]
    )
    if (existingCorrespondent.rows.length > 0) {
      return NextResponse.json({ error: '이미 등록된 스트리머명 또는 채널 URL입니다.' }, { status: 400 })
    }

    const result = await db.query(
      'INSERT INTO war_correspondents (streamer_name, chzzk_channel_url, profile_image_url, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [streamer_name, chzzk_channel_url, profile_image_url || '', description || '']
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('종군기자 추가 오류:', error)
    return NextResponse.json({ error: '종군기자 추가에 실패했습니다.' }, { status: 500 })
  }
}
