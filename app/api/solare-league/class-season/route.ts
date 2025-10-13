import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getTier } from '@/lib/utils/tier'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seasonId = searchParams.get('seasonId')
  const classNameRaw = searchParams.get('class') || ''
  const className = decodeURIComponent(classNameRaw)
  
  console.log(`[DEBUG] 원본 className: ${classNameRaw}`)
  console.log(`[DEBUG] 디코딩된 className: ${className}`)
  
  if (!className) {
    return new NextResponse('클래스명이 필요합니다', { status: 400 })
  }
  
  const client = await db.connect()
  try {
    let isActiveSeason = false
    
    // seasonId가 있는 경우에만 시즌 정보 조회
    if (seasonId) {
      const seasonResult = await client.query(`
        SELECT * FROM solare_seasons WHERE id = $1
      `, [seasonId])
      
      if (seasonResult.rows.length === 0) {
        return new NextResponse('Season not found', { status: 404 })
      }
      
      // 시즌이 활성 상태인지 확인
      isActiveSeason = seasonResult.rows[0].is_active
    } else {
      // seasonId가 없으면 활성 시즌이 있는지 확인
      const activeSeasonResult = await client.query(`
        SELECT id FROM solare_seasons WHERE is_active = true LIMIT 1
      `)
      isActiveSeason = activeSeasonResult.rows.length > 0
    }
  
  let result
  
  if (isActiveSeason) {
    // 활성 시즌인 경우 현재 테이블에서 데이터 조회
    result = await client.query(`
      SELECT 
        s.*,
        g.name AS guild_name,
        ROW_NUMBER() OVER (ORDER BY s.score DESC) as rank 
      FROM solare_class_league s
      LEFT JOIN guild_members gm ON s.name = gm.family_name
      LEFT JOIN guilds g ON gm.guild_id = g.id
      WHERE s.class = $1
      ORDER BY s.score DESC
      LIMIT 100
    `, [className])
  } else {
    // 비활성 시즌인 경우 시즌별 테이블에서 데이터 조회
    if (seasonId) {
      console.log(`[DEBUG] 클래스별 시즌 데이터 조회: seasonId=${seasonId}, className=${className}`)
      
      // 먼저 시즌별 클래스 테이블에서 조회 시도
      result = await client.query(`
        SELECT 
          s.*,
          g.name AS guild_name
        FROM solare_class_league_seasons s
        LEFT JOIN guild_members gm ON s.name = gm.family_name
        LEFT JOIN guilds g ON gm.guild_id = g.id
        WHERE s.season_id = $1 AND s.class = $2
        ORDER BY s.score DESC
        LIMIT 100
      `, [seasonId, className])
      
      console.log(`[DEBUG] 시즌별 클래스 테이블 조회 결과: ${result.rows.length}개 행`)
      
      // 시즌별 클래스 테이블에 데이터가 없으면 전체 시즌 데이터에서 필터링
      if (result.rows.length === 0) {
        console.log(`[DEBUG] 시즌별 클래스 테이블에 데이터 없음, 전체 데이터에서 필터링 시도`)
        const overallResult = await client.query(`
          SELECT 
            s.*,
            g.name AS guild_name,
            ROW_NUMBER() OVER (ORDER BY s.score DESC) as rank
          FROM solare_overall_league_seasons s
          LEFT JOIN guild_members gm ON s.name = gm.family_name
          LEFT JOIN guilds g ON gm.guild_id = g.id
          WHERE s.season_id = $1 AND s.class = $2
          ORDER BY s.score DESC
          LIMIT 100
        `, [seasonId, className])
        
        result = overallResult
        console.log(`[DEBUG] 전체 시즌 데이터에서 필터링 결과: ${result.rows.length}개 행`)
      }
    } else {
      // seasonId가 없으면 빈 결과 반환
      result = { rows: [] }
    }
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
      FROM solare_class_league
      WHERE class = $1
    `, [className])
    lastUpdated = updateTimeResult.rows[0]?.last_updated || null
  } else {
    // 비활성 시즌은 시즌별 테이블의 created_at 사용
    if (seasonId) {
      const updateTimeResult = await client.query(`
        SELECT MAX(created_at) as last_updated 
        FROM solare_class_league_seasons
        WHERE season_id = $1 AND class = $2
      `, [seasonId, className])
      lastUpdated = updateTimeResult.rows[0]?.last_updated || null
    } else {
      lastUpdated = null
    }
  }

  return NextResponse.json({
    data: withTier,
    lastUpdated
  })
  } catch (err) {
    console.error('[solare class season data GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
