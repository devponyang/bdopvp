// ✅ /app/api/solare-league/overall/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSolareOverallRankChanges } from '@/lib/utils/solare-history'

export const dynamic = 'force-dynamic'

// 5분간 캐싱
export const revalidate = 300

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT
        s.name,
        s.subclass,
        s.class,
        s.wins,
        s.draws,
        s.losses,
        s.score,
        g.name AS guild_name
      FROM solare_overall_league s
      LEFT JOIN guild_members gm ON s.name = gm.family_name
      LEFT JOIN guilds g ON gm.guild_id = g.id
      ORDER BY s.score DESC
      LIMIT 100
    `)

    const today = result.rows.map((row, index) => ({
      ...row,
      rank: index + 1
    }))

    const withRankChanges = await getSolareOverallRankChanges(today)
    
    // 마지막 업데이트 시간 조회 (테이블의 updated_at 컬럼 사용)
    const updateTimeResult = await client.query(`
      SELECT MAX(updated_at) as last_updated 
      FROM solare_overall_league
    `)
    
    const lastUpdated = updateTimeResult.rows[0]?.last_updated || null
    
    return NextResponse.json({
      data: withRankChanges,
      lastUpdated
    })
  } catch (err) {
    console.error('[solare_overall_league GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
