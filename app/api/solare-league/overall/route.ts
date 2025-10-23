// ✅ /app/api/solare-league/overall/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSolareOverallRankChanges } from '@/lib/utils/solare-history'

export const dynamic = 'force-dynamic'

// 캐싱 비활성화 (실시간 데이터 반영)
export const revalidate = 0

export async function GET() {
  const client = await db.connect()
  try {
    // 간단하게 현재 테이블에서만 조회 (기존 방식으로 복원)
    const result = await client.query(`
      SELECT
        s.name,
        s.subclass,
        s.class,
        s.wins,
        s.draws,
        s.losses,
        s.score
      FROM solare_overall_league s
      ORDER BY s.score DESC
      LIMIT 100
    `)

    const today = result.rows.map((row, index) => ({
      ...row,
      rank: index + 1
    }))

    const withRankChanges = await getSolareOverallRankChanges(today)
    
    // 마지막 업데이트 시간 조회 (created_at 컬럼이 없으므로 제거)
    const lastUpdated = null
    
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
