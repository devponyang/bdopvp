import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const className = searchParams.get('className')
  const tournamentId = searchParams.get('tournamentId') || '1'

  if (!className) {
    return new NextResponse('클래스명이 필요합니다.', { status: 400 })
  }

  const client = await db.connect()

  try {
    // 해당 클래스의 참가자 조회 (is_qualified 조건 제거)
    const result = await client.query(`
      SELECT 
        mp.id,
        mp.player_name,
        mp.class_name,
        mp.subclass,
        mp.total_ap_dp,
        mp.gear_score
      FROM master_class_participants mp
      WHERE mp.class_name = $1 
        AND mp.tournament_id = $2
      ORDER BY mp.total_ap_dp DESC
    `, [className, tournamentId])

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('브라켓 데이터 조회 오류:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

