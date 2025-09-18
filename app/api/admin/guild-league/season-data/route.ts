import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seasonId = searchParams.get('seasonId')
  
  if (!seasonId) {
    return new NextResponse('Season ID is required', { status: 400 })
  }

  const client = await db.connect()
  try {
    // 시즌 정보 조회
    const seasonResult = await client.query(`
      SELECT * FROM guild_league_seasons WHERE id = $1
    `, [seasonId])
    
    if (seasonResult.rows.length === 0) {
      return new NextResponse('Season not found', { status: 404 })
    }
    
    // 시즌이 활성 상태인지 확인
    const isActiveSeason = seasonResult.rows[0].is_active
    
    let dataResult
    
    if (isActiveSeason) {
      // 활성 시즌인 경우 현재 테이블에서 데이터 조회
      dataResult = await client.query(`
        SELECT * FROM guild_league ORDER BY rank ASC
      `)
    } else {
      // 비활성 시즌인 경우 시즌별 테이블에서 데이터 조회
      dataResult = await client.query(`
        SELECT * FROM guild_league_seasons_data 
        WHERE season_id = $1 
        ORDER BY rank ASC
      `, [seasonId])
    }
    
    return NextResponse.json({
      season: seasonResult.rows[0],
      data: dataResult.rows
    })
  } catch (err) {
    console.error('길드리그 시즌 데이터 조회 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
