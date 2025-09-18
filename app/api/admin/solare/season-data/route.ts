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
      SELECT * FROM solare_seasons WHERE id = $1
    `, [seasonId])
    
    if (seasonResult.rows.length === 0) {
      return new NextResponse('Season not found', { status: 404 })
    }
    
    // 시즌이 활성 상태인지 확인
    const isActiveSeason = seasonResult.rows[0].is_active
    
    let overallResult, classResult
    
    if (isActiveSeason) {
      // 활성 시즌인 경우 현재 테이블에서 데이터 조회
      overallResult = await client.query(`
        SELECT *, ROW_NUMBER() OVER (ORDER BY score DESC) as rank FROM solare_overall_league
        ORDER BY score DESC
      `)
      
      classResult = await client.query(`
        SELECT *, ROW_NUMBER() OVER (PARTITION BY class ORDER BY score DESC) as rank FROM solare_class_league
        ORDER BY class, score DESC
      `)
    } else {
      // 비활성 시즌인 경우 시즌별 테이블에서 데이터 조회
      overallResult = await client.query(`
        SELECT * FROM solare_overall_league_seasons 
        WHERE season_id = $1 
        ORDER BY score DESC
      `, [seasonId])
      
      classResult = await client.query(`
        SELECT * FROM solare_class_league_seasons 
        WHERE season_id = $1 
        ORDER BY class, score DESC
      `, [seasonId])
    }
    
    // 클래스별로 그룹화
    const classData: Record<string, any[]> = {}
    for (const row of classResult.rows) {
      const cls = row.class
      if (!classData[cls]) classData[cls] = []
      classData[cls].push(row)
    }
    
    return NextResponse.json({
      season: seasonResult.rows[0],
      overall: overallResult.rows,
      classData
    })
  } catch (err) {
    console.error('시즌 데이터 조회 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
