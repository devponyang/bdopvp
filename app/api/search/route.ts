// 경로: app/api/search/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim().normalize('NFC')

  if (!q) return NextResponse.json([])

  const client = await db.connect()

  try {
    // 검색 로그 저장
    try {
      const userIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      const userAgent = req.headers.get('user-agent') || 'unknown'
      
      await client.query(
        'INSERT INTO search_logs (query, user_ip, user_agent) VALUES ($1, $2, $3)',
        [q, userIp, userAgent]
      )
    } catch (logError) {
      console.error('Failed to log search:', logError)
      // 로깅 실패해도 검색은 계속 진행
    }
    // 정확히 일치하는 우선 검색 (길드만, 멤버가 있는 길드만)
    const exactGuilds = await client.query(
      `SELECT DISTINCT g.name 
       FROM guilds g
       INNER JOIN guild_members gm ON g.id = gm.guild_id
       WHERE g.name = $1`,
      [q]
    )

    // 포함 검색 (길드만, 한글 정규화 고려, 멤버가 있는 길드만)
    const partialGuilds = await client.query(
      `SELECT DISTINCT g.name 
       FROM guilds g
       INNER JOIN guild_members gm ON g.id = gm.guild_id
       WHERE g.name ILIKE $1`,
      [`%${q}%`]
    )

    // 정확히 일치하는 연맹 검색 (활성 연맹만)
    const exactAlliances = await client.query(
      `SELECT DISTINCT a.name 
       FROM alliances a
       WHERE a.name = $1 AND a.is_active = true`,
      [q]
    )

    // 포함 검색 (연맹만, 활성 연맹만)
    const partialAlliances = await client.query(
      `SELECT DISTINCT a.name 
       FROM alliances a
       WHERE a.name ILIKE $1 AND a.is_active = true`,
      [`%${q}%`]
    )

    const resultMap = new Map<string, { type: 'guild' | 'alliance'; name: string }>()

    // 길드 결과 추가
    exactGuilds.rows.forEach(row =>
      resultMap.set(`guild-${row.name}`, { type: 'guild', name: row.name })
    )
    partialGuilds.rows.forEach(row =>
      resultMap.set(`guild-${row.name}`, { type: 'guild', name: row.name })
    )

    // 연맹 결과 추가
    exactAlliances.rows.forEach(row =>
      resultMap.set(`alliance-${row.name}`, { type: 'alliance', name: row.name })
    )
    partialAlliances.rows.forEach(row =>
      resultMap.set(`alliance-${row.name}`, { type: 'alliance', name: row.name })
    )

    const combined = [...resultMap.values()].slice(0, 5)
    return NextResponse.json(combined)
  } catch (err) {
    console.error('Search API Error:', err)
    return NextResponse.json([], { status: 500 })
  } finally {
    client.release()
  }
}
