// ✅ 경로: app/api/guild-detail/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name")
  if (!name) return NextResponse.json(null)

  try {
    const guildRes = await db.query(
      `SELECT g.id, g.name, g.leader, g.member_count, g.creation_date,
              l.rank, l.wins, l.losses, l.updated_at
       FROM guilds g
       LEFT JOIN guild_league l ON LOWER(g.name) = LOWER(l.guild_name)
       WHERE LOWER(g.name) = LOWER($1)`,  // ✅ 대소문자 무시 비교
      [name]
    )

    if (guildRes.rowCount === 0) return NextResponse.json(null)

    const guild = guildRes.rows[0]

    const membersRes = await db.query(
      `SELECT family_name FROM guild_members WHERE guild_id = $1`,
      [guild.id]
    )
    const members = membersRes.rows.map((row) => row.family_name)

    const historyRes = await db.query(
      `SELECT change_date, status FROM guild_history
       WHERE guild_id = $1
         AND change_date >= NOW() - INTERVAL '1 month'
       ORDER BY change_date ASC`,
      [guild.id]
    )

    let joinCount = 0
    let leaveCount = 0
    const monthly: Record<string, { join: number; leave: number }> = {}

    for (const row of historyRes.rows) {
      const month = row.change_date.toISOString().slice(0, 7)
      if (!monthly[month]) monthly[month] = { join: 0, leave: 0 }
      if (row.status === "가입") {
        joinCount++
        monthly[month].join++
      } else if (row.status === "탈퇴") {
        leaveCount++
        monthly[month].leave++
      }
    }

    const history = Object.entries(monthly).map(([month, { join, leave }]) => ({
      date: month,
      join,
      leave,
    }))

    const totalGames = guild.wins + guild.losses
    const winRate = totalGames > 0 ? (guild.wins / totalGames) * 100 : 0

    // 연맹 정보 가져오기
    const allianceRes = await db.query(`
      SELECT a.name AS alliance_name
      FROM alliance_guilds ag
      JOIN alliances a ON ag.alliance_id = a.id
      WHERE LOWER(ag.guild_name) = LOWER($1) AND a.is_active = TRUE
      LIMIT 1
    `, [name])

    const allianceName = allianceRes.rows.length > 0 ? allianceRes.rows[0].alliance_name : null

    return NextResponse.json({
      name: guild.name,
      leader: guild.leader,
      member_count: guild.member_count,
      creation_date: guild.creation_date,
      rank: guild.rank,
      wins: guild.wins,
      losses: guild.losses,
      winRate,
      updated_at: guild.updated_at,
      icon_url: null,
      alliance_name: allianceName,
      members,
      joinCount,
      leaveCount,
      history,
    })
  } catch (err) {
    console.error("❌ 길드 정보 API 오류:", err)
    return NextResponse.json(null, { status: 500 })
  }
}
