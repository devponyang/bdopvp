import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { fetchGuildNames } from '@/lib/utils/guild-lookup'

export async function POST() {
  const client = await db.connect()
  try {
    const { rows } = await client.query<{ name: string }>(`
      SELECT DISTINCT name FROM solare_overall_league WHERE name IS NOT NULL
      UNION
      SELECT DISTINCT name FROM solare_class_league WHERE name IS NOT NULL
    `)

    const names = rows.map(r => r.name)
    if (names.length === 0) {
      return NextResponse.json({ updated: 0, total: 0 })
    }

    const guildMap = await fetchGuildNames(names)

    let updated = 0
    for (const [name, guild] of Object.entries(guildMap)) {
      if (!guild) continue
      const r1 = await client.query(
        'UPDATE solare_overall_league SET guild_name = $1 WHERE name = $2',
        [guild, name]
      )
      const r2 = await client.query(
        'UPDATE solare_class_league SET guild_name = $1 WHERE name = $2',
        [guild, name]
      )
      await client.query(
        'UPDATE solare_overall_league_history SET guild_name = $1 WHERE name = $2',
        [guild, name]
      )
      await client.query(
        'UPDATE solare_class_league_history SET guild_name = $1 WHERE name = $2',
        [guild, name]
      )
      updated += (r1.rowCount ?? 0) + (r2.rowCount ?? 0)
    }

    return NextResponse.json({ updated, total: names.length })
  } catch (err) {
    console.error('refresh-guilds error:', err)
    return new NextResponse(err instanceof Error ? err.message : 'Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
