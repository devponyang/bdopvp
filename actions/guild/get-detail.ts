import { db } from "@/lib/db"

export async function getGuildDetail(guildName: string) {
  // 활성 시즌 확인
  const activeSeason = await db.query(`
    SELECT id FROM guild_league_seasons WHERE is_active = TRUE LIMIT 1
  `)
  
  let result
  if (activeSeason.rows.length > 0) {
    // 활성 시즌이 있으면 현재 테이블에서 데이터 조회
    result = await db.query(`
      SELECT 
        g.id,
        g.name,
        g.leader,
        g.member_count,
        g.creation_date,
        COALESCE(l.rank, 0) AS rank,
        COALESCE(l.wins, 0) AS wins,
        COALESCE(l.losses, 0) AS losses,
        COALESCE(l.updated_at::text, '') AS updated_at
      FROM guilds g
      LEFT JOIN guild_league l ON g.name = l.guild_name
      WHERE g.name = $1
    `, [guildName])
  } else {
    // 활성 시즌이 없으면 최신 히스토리 데이터 사용
    const latestDateRes = await db.query(`
      SELECT DISTINCT snapshot_date
      FROM guild_league_history
      ORDER BY snapshot_date DESC
      LIMIT 1
    `)
    
    const latestDate = latestDateRes.rows[0]?.snapshot_date
    
    if (latestDate) {
      result = await db.query(`
        SELECT 
          g.id,
          g.name,
          g.leader,
          g.member_count,
          g.creation_date,
          COALESCE(h.rank, 0) AS rank,
          COALESCE(h.wins, 0) AS wins,
          COALESCE(h.losses, 0) AS losses,
          COALESCE(h.snapshot_date::text, '') AS updated_at
        FROM guilds g
        LEFT JOIN guild_league_history h ON g.name = h.guild_name AND h.snapshot_date = $2
        WHERE g.name = $1
      `, [guildName, latestDate])
    } else {
      // 히스토리 데이터도 없으면 기본값으로 조회
      result = await db.query(`
        SELECT 
          g.id,
          g.name,
          g.leader,
          g.member_count,
          g.creation_date,
          0 AS rank,
          0 AS wins,
          0 AS losses,
          '' AS updated_at
        FROM guilds g
        WHERE g.name = $1
      `, [guildName])
    }
  }

  const guild = result.rows[0]
  if (!guild) return null

  const winRate =
    guild.wins + guild.losses > 0
      ? (guild.wins / (guild.wins + guild.losses)) * 100
      : 0

  const membersRes = await db.query(`
    SELECT family_name FROM guild_members WHERE guild_id = $1
  `, [guild.id])

  const historyRes = await db.query(`
    SELECT 
      to_char(change_date, 'YYYY-MM') AS date,
      SUM(CASE WHEN status = '가입' THEN 1 ELSE 0 END) AS join,
      SUM(CASE WHEN status = '탈퇴' THEN 1 ELSE 0 END) AS leave
    FROM guild_history
    WHERE guild_id = $1
    GROUP BY date
    ORDER BY date ASC
  `, [guild.id])

  const history = historyRes.rows.map((row: any) => ({
    date: row.date,
    join: parseInt(row.join),
    leave: parseInt(row.leave),
  }))

  const joinCount = history.reduce((sum, row) => sum + row.join, 0)
  const leaveCount = history.reduce((sum, row) => sum + row.leave, 0)

  return {
    name: guild.name,
    leader: guild.leader,
    member_count: guild.member_count,
    creation_date: guild.creation_date,
    rank: guild.rank,
    wins: guild.wins,
    losses: guild.losses,
    winRate,
    updated_at: guild.updated_at,
    icon_url: null as unknown as string | undefined,
    members: membersRes.rows.map((r: any) => r.family_name),
    joinCount,
    leaveCount,
    history,
  }
}
