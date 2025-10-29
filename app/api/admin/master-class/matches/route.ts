import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tournamentId = searchParams.get('tournamentId')
  const className = searchParams.get('className')

  if (!tournamentId) {
    return new NextResponse('토너먼트 ID가 필요합니다.', { status: 400 })
  }

  const client = await db.connect()

  try {
    let query = `
      SELECT * FROM master_class_matches 
      WHERE tournament_id = $1
    `
    const params: any[] = [tournamentId]

    if (className) {
      // 클래스 필터링을 위해 참가자 테이블 조인
      query = `
        SELECT m.* 
        FROM master_class_matches m
        JOIN master_class_participants p1 ON m.player1_id = p1.id
        WHERE m.tournament_id = $1 AND p1.class_name = $2
      `
      params.push(className)
    }

    query += ' ORDER BY round_number DESC, match_number ASC'

    const result = await client.query(query, params)
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('매칭 목록 조회 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { 
    tournament_id,
    round_number,
    match_number,
    player1_id,
    player2_id
  } = await req.json()

  const client = await db.connect()

  try {
    const result = await client.query(`
      INSERT INTO master_class_matches (
        tournament_id, round_number, match_number, 
        player1_id, player2_id, is_completed
      )
      VALUES ($1, $2, $3, $4, $5, FALSE)
      RETURNING *
    `, [
      tournament_id, round_number, match_number,
      player1_id, player2_id
    ])
    
    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error('매칭 생성 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

