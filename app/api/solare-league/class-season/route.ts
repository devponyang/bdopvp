import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getTier } from '@/lib/utils/tier'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seasonId = searchParams.get('seasonId')
  const className = decodeURIComponent(searchParams.get('class') || '')

  if (!className) return new NextResponse('클래스명이 필요합니다', { status: 400 })

  const client = await db.connect()
  try {
    let isActiveSeason = false

    if (seasonId) {
      const seasonResult = await client.query(`SELECT * FROM solare_seasons WHERE id = $1`, [seasonId])
      if (seasonResult.rows.length === 0) return new NextResponse('Season not found', { status: 404 })
      isActiveSeason = seasonResult.rows[0].is_active
    } else {
      const r = await client.query(`SELECT id FROM solare_seasons WHERE is_active = true LIMIT 1`)
      isActiveSeason = r.rows.length > 0
    }

    let result

    if (isActiveSeason) {
      result = await client.query(`
        SELECT *, ROW_NUMBER() OVER (ORDER BY score DESC) as rank
        FROM solare_class_league
        WHERE class = $1
        ORDER BY score DESC LIMIT 100
      `, [className])
    } else if (seasonId) {
      result = await client.query(`
        SELECT * FROM solare_class_league_seasons
        WHERE season_id = $1 AND class = $2
        ORDER BY score DESC LIMIT 100
      `, [seasonId, className])

      if (result.rows.length === 0) {
        result = await client.query(`
          SELECT * FROM solare_overall_league_seasons
          WHERE season_id = $1 AND class = $2
          ORDER BY score DESC LIMIT 100
        `, [seasonId, className])
      }
    } else {
      result = { rows: [] }
    }

    const data = result.rows.map((row, index) => ({
      name: row.name, subclass: row.subclass, class: row.class,
      wins: row.wins, draws: row.draws, losses: row.losses,
      score: row.score, rank: row.rank || (index + 1),
      tier: getTier(row.score), rankChange: '-',
      guild_name: row.guild_name ?? null,
    }))

    let lastUpdated = null
    if (isActiveSeason) {
      const r = await client.query(
        `SELECT MAX(updated_at) as last_updated FROM solare_class_league WHERE class = $1`, [className]
      )
      lastUpdated = r.rows[0]?.last_updated || null
    } else if (seasonId) {
      const r = await client.query(
        `SELECT MAX(created_at) as last_updated FROM solare_class_league_seasons WHERE season_id = $1 AND class = $2`,
        [seasonId, className]
      )
      lastUpdated = r.rows[0]?.last_updated || null
    }

    return NextResponse.json({ data, lastUpdated })
  } catch (err) {
    console.error('[solare class season data GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
