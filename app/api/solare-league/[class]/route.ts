import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getSolareClassRankChanges } from '@/lib/utils/solare-history'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const className = decodeURIComponent(url.pathname.split('/').pop() || '')

  if (!className) return new NextResponse('잘못된 클래스명입니다.', { status: 400 })

  const client = await db.connect()
  try {
    const result = await client.query(
      `SELECT name, subclass, class, wins, draws, losses, score, guild_name
       FROM solare_class_league
       WHERE class = $1
       ORDER BY score DESC LIMIT 20`,
      [className]
    )

    const today = result.rows.map((row, idx) => ({ ...row, rank: idx + 1 }))
    const withRankChange = await getSolareClassRankChanges(today, className)

    return NextResponse.json({ data: withRankChange, lastUpdated: null })
  } catch (err) {
    console.error('[solare_class_league GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
