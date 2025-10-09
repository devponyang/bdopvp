import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// 특정 플레이어의 특화 정보 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const playerName = searchParams.get('player')
  const className = searchParams.get('class')

  if (!playerName || !className) {
    return NextResponse.json({ error: 'player와 class 파라미터가 필요합니다.' }, { status: 400 })
  }

  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT 
        player_name,
        class,
        specialization_image_url,
        description,
        updated_at
      FROM solare_specializations
      WHERE player_name = $1 AND class = $2
    `, [playerName, className])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '특화 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error('특화 정보 조회 오류:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    client.release()
  }
}




































