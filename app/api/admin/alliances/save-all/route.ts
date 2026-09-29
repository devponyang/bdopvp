// /app/api/admin/alliances/save-all/route.ts

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { alliances } = await req.json()

  if (!Array.isArray(alliances)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // ✅ alliance_guilds는 전체 삭제
    await client.query('DELETE FROM alliance_guilds')

    // 현재 저장하려는 연맹 이름 목록
    const allianceNames = alliances
      .map(a => a.name?.trim())
      .filter(Boolean)

    // 목록에 없는 연맹은 비활성화 (삭제하지 않음)
    if (allianceNames.length > 0) {
      await client.query(
        `UPDATE alliances SET is_active = FALSE WHERE name != ALL($1)`,
        [allianceNames]
      )
    } else {
      // 모든 연맹 비활성화
      await client.query('UPDATE alliances SET is_active = FALSE')
    }

    for (const a of alliances) {
      const name = a.name?.trim()
      const tiers: string[] = Array.isArray(a.tiers) ? a.tiers : []
      const guilds: string[] = [...new Set<string>(Array.isArray(a.guilds) ? a.guilds : [])]
      const isActive = a.isActive !== false // 프론트엔드에서 보낸 isActive 값 사용

      if (!name || guilds.length === 0) continue

      // 이미 존재하는 경우 ID 가져오기
      const existing = await client.query(`SELECT id FROM alliances WHERE name = $1`, [name])
      let allianceId: number

      if (existing.rows.length > 0) {
        allianceId = existing.rows[0].id
        // 기존 연맹 업데이트 (프론트엔드에서 보낸 isActive 값 사용)
        await client.query(`UPDATE alliances SET tiers = $1, is_active = $2 WHERE id = $3`, [tiers, isActive, allianceId])
      } else {
        const result = await client.query(
          `INSERT INTO alliances (name, tiers, is_active) VALUES ($1, $2, $3) RETURNING id`,
          [name, tiers, isActive]
        )
        allianceId = result.rows[0].id
      }

      // 기존 길드 목록 삭제
      await client.query(`DELETE FROM alliance_guilds WHERE alliance_id = $1`, [allianceId])

      for (const guild of guilds) {
        const clean = guild.trim()
        if (clean) {
          await client.query(
            `INSERT INTO alliance_guilds (alliance_id, guild_name) VALUES ($1, $2)`,
            [allianceId, clean]
          )
        }
      }
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[SAVE ALLIANCES ERROR]', JSON.stringify(err, null, 2))
    return NextResponse.json({ error: 'DB error', detail: String(err) }, { status: 500 })
  } finally {
    client.release()
  }
}
