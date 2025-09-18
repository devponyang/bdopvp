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
    // 정확히 일치하는 우선 검색 (길드만)
    const exactGuilds = await client.query(
      `SELECT name FROM guilds WHERE name = $1`,
      [q]
    )

    // 포함 검색 (길드만, 한글 정규화 고려)
    const partialGuilds = await client.query(
      `SELECT name FROM guilds WHERE name ILIKE $1`,
      [`%${q}%`]
    )

    const guildMap = new Map<string, { type: 'guild'; name: string }>()

    exactGuilds.rows.forEach(row =>
      guildMap.set(row.name, { type: 'guild', name: row.name })
    )
    partialGuilds.rows.forEach(row =>
      guildMap.set(row.name, { type: 'guild', name: row.name })
    )

    const combined = [...guildMap.values()].slice(0, 5)
    return NextResponse.json(combined)
  } catch (err) {
    console.error('Search API Error:', err)
    return NextResponse.json([], { status: 500 })
  } finally {
    client.release()
  }
}
