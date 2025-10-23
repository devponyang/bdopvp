// ✅ /app/api/solare-league/[class]/route.ts
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getSolareClassRankChanges } from '@/lib/utils/solare-history'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const classNameEncoded = url.pathname.split('/').pop()
  const className = decodeURIComponent(classNameEncoded || '')

  if (!className) {
    return new NextResponse('잘못된 클래스명입니다.', { status: 400 })
  }

  const client = await db.connect()
  try {
    // 현재 테이블에서 데이터 조회 (전체 랭킹과 동일한 방식)
    const result = await client.query(
      `
      SELECT
        s.name,
        s.subclass,
        s.class,
        s.wins,
        s.draws,
        s.losses,
        s.score,
        g.name AS guild_name
      FROM solare_class_league s
      LEFT JOIN guild_members gm ON s.name = gm.family_name
      LEFT JOIN guilds g ON gm.guild_id = g.id
      WHERE s.class = $1
      ORDER BY s.score DESC
      LIMIT 20
      `,
      [className]
    )

    const today = result.rows.map((row, idx) => ({
      ...row,
      rank: idx + 1
    }))

    const withRankChange = await getSolareClassRankChanges(today, className)
    
    // 마지막 업데이트 시간 조회 (created_at 컬럼이 없으므로 제거)
    const lastUpdated = null
    
    return NextResponse.json({
      data: withRankChange,
      lastUpdated
    })
  } catch (err) {
    console.error('[solare_class_league GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
