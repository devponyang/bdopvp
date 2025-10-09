import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = await db.connect()
  
  try {
    // 모든 연맹과 소속 길드들을 가져오기
    const result = await client.query(`
      SELECT 
        a.id,
        a.name,
        a.tiers,
        a.is_active as "isActive",
        COALESCE(
          ARRAY_AGG(ag.guild_name ORDER BY ag.id) FILTER (WHERE ag.guild_name IS NOT NULL),
          ARRAY[]::text[]
        ) as guilds
      FROM alliances a
      LEFT JOIN alliance_guilds ag ON a.id = ag.alliance_id
      GROUP BY a.id, a.name, a.tiers, a.is_active
      ORDER BY a.name ASC
    `)

    const alliances = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      guilds: row.guilds || [],
      tiers: row.tiers || [],
      isActive: row.isActive === true
    }))

    return NextResponse.json(alliances)
  } catch (err) {
    console.error('[LOAD ALLIANCES ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
}



















