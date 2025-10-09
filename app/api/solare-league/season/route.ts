import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getTier } from '@/lib/utils/tier'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seasonId = searchParams.get('seasonId')
  
  const client = await db.connect()
  try {
    // 시즌 정보 조회 (어드민 API와 동일한 로직 사용)
    const seasonResult = await client.query(`
      SELECT * FROM solare_seasons WHERE id = $1
    `, [seasonId])
    
    if (seasonResult.rows.length === 0) {
      return new NextResponse('Season not found', { status: 404 })
    }
    
    // 시즌이 활성 상태인지 확인
    const isActiveSeason = seasonResult.rows[0].is_active
    
    let result
    
    if (isActiveSeason) {
      // 활성 시즌인 경우 현재 테이블에서 데이터 조회
      result = await client.query(`
        SELECT 
          s.*,
          g.name AS guild_name,
          ROW_NUMBER() OVER (ORDER BY s.score DESC) as rank 
        FROM solare_overall_league s
        LEFT JOIN guild_members gm ON s.name = gm.family_name
        LEFT JOIN guilds g ON gm.guild_id = g.id
        ORDER BY s.score DESC
        LIMIT 100
      `)
    } else {
      // 비활성 시즌인 경우 시즌별 테이블에서 데이터 조회
      result = await client.query(`
        SELECT 
          s.*,
          g.name AS guild_name
        FROM solare_overall_league_seasons s
        LEFT JOIN guild_members gm ON s.name = gm.family_name
        LEFT JOIN guilds g ON gm.guild_id = g.id
        WHERE s.season_id = $1 
        ORDER BY s.score DESC
        LIMIT 100
      `, [seasonId])
    }
    

    const withTier = result.rows.map((row) => ({
      name: row.name,
      subclass: row.subclass,
      class: row.class,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      score: row.score,
      rank: row.rank || row.row_number, // rank 또는 row_number 사용
      tier: getTier(row.score),
      rankChange: '-', // 시즌별 조회에서는 변동 표시하지 않음
      guild_name: row.guild_name || null
    }))
    
    // 마지막 업데이트 시간 조회
    let lastUpdated = null
    
    if (isActiveSeason) {
      // 활성 시즌은 현재 테이블의 updated_at 사용
      const updateTimeResult = await client.query(`
        SELECT MAX(updated_at) as last_updated 
        FROM solare_overall_league
      `)
      lastUpdated = updateTimeResult.rows[0]?.last_updated || null
    } else {
      // 비활성 시즌은 시즌별 테이블의 created_at 사용
      const updateTimeResult = await client.query(`
        SELECT MAX(created_at) as last_updated 
        FROM solare_overall_league_seasons
        WHERE season_id = $1
      `, [seasonId])
      lastUpdated = updateTimeResult.rows[0]?.last_updated || null
    }

    return NextResponse.json({
      data: withTier,
      lastUpdated
    })
  } catch (err) {
    console.error('[solare season data GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
