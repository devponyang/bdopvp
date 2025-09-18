import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { seasonId, endDate } = await req.json()
  const client = await db.connect()

  try {
    await client.query('BEGIN')
    
    // 현재 활성 시즌의 데이터를 시즌별 테이블로 보관
    const currentOverall = await client.query('SELECT * FROM solare_overall_league ORDER BY score DESC')
    const currentClass = await client.query('SELECT * FROM solare_class_league ORDER BY class, score DESC')
    
    // 전체 랭킹 보관
    for (let i = 0; i < currentOverall.rows.length; i++) {
      const entry = currentOverall.rows[i]
      await client.query(`
        INSERT INTO solare_overall_league_seasons (season_id, name, subclass, class, wins, draws, losses, score, rank)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [seasonId, entry.name, entry.subclass, entry.class, entry.wins, entry.draws, entry.losses, entry.score, i + 1])
    }
    
    // 클래스별 랭킹 보관
    for (const entry of currentClass.rows) {
      await client.query(`
        INSERT INTO solare_class_league_seasons (season_id, name, subclass, class, wins, draws, losses, score, rank)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [seasonId, entry.name, entry.subclass, entry.class, entry.wins, entry.draws, entry.losses, entry.score, entry.rank])
    }
    
    // 시즌 종료 처리
    await client.query(`
      UPDATE solare_seasons 
      SET end_date = $1, is_active = FALSE 
      WHERE id = $2
    `, [endDate, seasonId])
    
    // 현재 데이터 초기화
    await client.query('DELETE FROM solare_overall_league')
    await client.query('DELETE FROM solare_class_league')
    
    await client.query('COMMIT')
    return NextResponse.json({ success: true, message: '시즌 데이터가 성공적으로 보관되었습니다.' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('시즌 보관 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
