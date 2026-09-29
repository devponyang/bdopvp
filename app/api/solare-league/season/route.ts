import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getTier } from '@/lib/utils/tier'
import { getSolareOverallRankChanges } from '@/lib/utils/solare-history'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seasonId = searchParams.get('seasonId')

  const client = await db.connect()
  try {
    const seasonResult = await client.query(`SELECT * FROM solare_seasons WHERE id = $1`, [seasonId])
    if (seasonResult.rows.length === 0) return new NextResponse('Season not found', { status: 404 })

    const isActiveSeason = seasonResult.rows[0].is_active
    let result

    if (isActiveSeason) {
      result = await client.query(`
        SELECT *, ROW_NUMBER() OVER (ORDER BY score DESC) as rank
        FROM solare_overall_league
        ORDER BY score DESC LIMIT 100
      `)
    } else {
      result = await client.query(`
        SELECT * FROM solare_overall_league_seasons
        WHERE season_id = $1
        ORDER BY score DESC LIMIT 100
      `, [seasonId])
    }

    let data

    if (isActiveSeason) {
      const today = result.rows.map((row, index) => ({
        name: row.name, subclass: row.subclass, class: row.class,
        wins: row.wins, draws: row.draws, losses: row.losses,
        score: row.score, rank: row.rank || (index + 1),
        guild_name: row.guild_name ?? null,
      }))
      const withRankChanges = await getSolareOverallRankChanges(today)
      data = withRankChanges.map(row => ({ ...row, tier: getTier(row.score) }))
    } else {
      data = result.rows.map((row, index) => ({
        name: row.name, subclass: row.subclass, class: row.class,
        wins: row.wins, draws: row.draws, losses: row.losses,
        score: row.score, rank: index + 1,
        tier: getTier(row.score), rankChange: '-',
        guild_name: row.guild_name ?? null,
      }))
    }

    let lastUpdated = null
    if (isActiveSeason) {
      const r = await client.query(`SELECT MAX(updated_at) as last_updated FROM solare_overall_league`)
      lastUpdated = r.rows[0]?.last_updated || null
    } else {
      const r = await client.query(
        `SELECT MAX(created_at) as last_updated FROM solare_overall_league_seasons WHERE season_id = $1`,
        [seasonId]
      )
      lastUpdated = r.rows[0]?.last_updated || null
    }

    return NextResponse.json({ data, lastUpdated })
  } catch (err) {
    console.error('[solare season data GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
