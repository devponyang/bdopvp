// /app/api/admin/war-records/save-all/route.ts

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { REGION_TIERS } from '@/lib/constants/war-tiers'

export async function POST(req: Request) {
  const { date, region, war_type, records } = await req.json()
  if (!date || !region || !war_type || !Array.isArray(records)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // KST 시간대 처리: 클라이언트에서 받은 날짜를 KST 기준으로 처리
  const kstDate = new Date(date + 'T21:00:00+09:00') // KST 21시로 설정
  const utcDateString = kstDate.toISOString().split('T')[0] // UTC 날짜 문자열

  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 기존 기록 삭제 (KST 기준 날짜 사용)
    await client.query(
      'DELETE FROM war_records WHERE war_date = $1 AND region = $2 AND war_type = $3',
      [utcDateString, region, war_type]
    )

    for (const r of records) {
      let allianceId = null

      if (r.alliance_name?.trim()) {
        const cleanedName = r.alliance_name.trim()

        // 1. 정확히 같은 이름이 존재하는지 검사 (대소문자 무시, 활성/비활성 모두 포함)
        const found = await client.query(
          `SELECT id, is_active FROM alliances WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))`,
          [cleanedName]
        )

        if (found.rows.length > 0) {
          allianceId = found.rows[0].id
          // 해체된 연맹이라도 다시 활성화하지 않음 (원래 상태 유지)
        } else {
          // 2. 없으면 새로 연맹 생성 (길드명으로 연맹 찾기 로직 제거)
          const tier = REGION_TIERS[region as keyof typeof REGION_TIERS] ?? null
          const tiers = tier ? [tier] : []
          const inserted = await client.query(
            `INSERT INTO alliances (name, tiers, is_active) VALUES ($1, $2, TRUE) RETURNING id`,
            [cleanedName, tiers]
          )
          allianceId = inserted.rows[0].id
        }
      }

      await client.query(
        `INSERT INTO war_records (war_date, region, war_type, alliance_id, occupied_area, fort_stage, result)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          utcDateString, // KST 기준으로 변환된 날짜 사용
          region,
          war_type,
          allianceId,
          r.occupied_area,
          r.fort_stage || null,
          r.result,
        ]
      )
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[SAVE WAR RECORDS ERROR]', JSON.stringify(err, null, 2))
    return NextResponse.json({ error: 'DB error', detail: String(err) }, { status: 500 })
  } finally {
    client.release()
  }
}
