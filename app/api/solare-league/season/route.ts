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
        SELECT *, ROW_NUMBER() OVER (ORDER BY score DESC) as rank FROM solare_overall_league
        ORDER BY score DESC
        LIMIT 100
      `)
    } else {
      // 비활성 시즌인 경우 시즌별 테이블에서 데이터 조회
      result = await client.query(`
        SELECT * FROM solare_overall_league_seasons 
        WHERE season_id = $1 
        ORDER BY score DESC
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
      rankChange: '-' // 시즌별 조회에서는 변동 표시하지 않음
    }))

    return NextResponse.json(withTier)
  } catch (err) {
    console.error('[solare season data GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
