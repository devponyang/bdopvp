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
    // 해당 클래스의 선수 ID 조회 (is_qualified 조건 제거)
    const participantResult = await client.query(`
      SELECT id FROM master_class_participants 
      WHERE class_name = $1 AND tournament_id = $2
    `, [className, tournamentId])

    const participantIds = participantResult.rows.map((row: any) => row.id)

    if (participantIds.length === 0) {
      return NextResponse.json([])
    }

    // 해당 클래스 선수들의 매치 조회
    const result = await client.query(`
      SELECT 
        m.id,
        m.round_number,
        m.match_number,
        m.player1_id,
        m.player2_id,
        m.winner_id,
        m.match_date,
        m.match_duration,
        m.is_completed
      FROM master_class_matches m
      WHERE m.tournament_id = $1
        AND (
          m.player1_id = ANY($2::int[]) 
          OR m.player2_id = ANY($2::int[])
        )
      ORDER BY m.round_number DESC, m.match_number ASC
    `, [tournamentId, participantIds])

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('매치 데이터 조회 오류:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

