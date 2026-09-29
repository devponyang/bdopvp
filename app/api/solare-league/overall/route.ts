import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSolareOverallRankChanges } from '@/lib/utils/solare-history'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT name, subclass, class, wins, draws, losses, score, guild_name
      FROM solare_overall_league
      ORDER BY score DESC
      LIMIT 100
    `)

    const today = result.rows.map((row, index) => ({ ...row, rank: index + 1 }))
    const withRankChanges = await getSolareOverallRankChanges(today)

    return NextResponse.json({ data: withRankChanges, lastUpdated: null })
  } catch (err) {
    console.error('[solare_overall_league GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
