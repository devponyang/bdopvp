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
    const currentData = await client.query('SELECT * FROM guild_league ORDER BY rank ASC')
    
    // 길드리그 데이터 보관
    for (const entry of currentData.rows) {
      await client.query(`
        INSERT INTO guild_league_seasons_data (season_id, guild_name, rank, wins, losses, score)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [seasonId, entry.guild_name, entry.rank, entry.wins, entry.losses, entry.score])
    }
    
    // 시즌 종료 처리
    await client.query(`
      UPDATE guild_league_seasons 
      SET end_date = $1, is_active = FALSE 
      WHERE id = $2
    `, [endDate, seasonId])
    
    // 현재 데이터 초기화
    await client.query('DELETE FROM guild_league')
    
    await client.query('COMMIT')
    return NextResponse.json({ success: true, message: '길드리그 시즌 데이터가 성공적으로 보관되었습니다.' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('길드리그 시즌 보관 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
