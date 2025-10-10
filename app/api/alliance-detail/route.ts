import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const allianceName = searchParams.get('name')?.trim()

  if (!allianceName) {
    return NextResponse.json({ error: 'Alliance name is required' }, { status: 400 })
  }

  const client = await db.connect()

  try {
    // 타임아웃 설정 (30초)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    )

    const queryPromise = (async () => {
      // 연맹 기본 정보 조회 (alliance_marks 테이블과 조인)
      const allianceResult = await client.query(
        `SELECT a.name, a.tiers, a.is_active, 
                COALESCE(am.mark_url, a.image_url) as mark_url
         FROM alliances a
         LEFT JOIN alliance_marks am ON a.name = am.alliance_name
         WHERE a.name = $1 AND a.is_active = true`,
        [allianceName]
      )

      if (allianceResult.rows.length === 0) {
        throw new Error('Alliance not found')
      }

      const alliance = allianceResult.rows[0]

      // 연맹 소속 길드 목록 조회 (최적화된 쿼리)
      const guildsResult = await client.query(
        `SELECT ag.guild_name, 
                COALESCE(g.member_count, 0) AS member_count, 
                COALESCE(g.leader, '정보 없음') AS leader, 
                gm.mark_url AS icon_url,
                COALESCE(l.rank, NULL) AS rank, 
                COALESCE(l.wins, 0) AS wins, 
                COALESCE(l.losses, 0) AS losses
         FROM alliance_guilds ag
         LEFT JOIN guilds g ON LOWER(g.name) = LOWER(ag.guild_name) AND g.is_deleted = FALSE
         LEFT JOIN guild_league l ON LOWER(g.name) = LOWER(l.guild_name)
         LEFT JOIN guild_marks gm ON gm.guild_name = ag.guild_name
         WHERE ag.alliance_id = (
           SELECT id FROM alliances WHERE name = $1
         )
         ORDER BY ag.id ASC
         LIMIT 100`,
        [allianceName]
      )

      // 연맹 거점전 기록 조회 (거점전만, 제한 없음)
      const fortWarRecordsResult = await client.query(
        `SELECT wr.war_date, wr.region, wr.occupied_area, wr.result
         FROM war_records wr
         INNER JOIN alliances a ON a.id = wr.alliance_id
         WHERE a.name = $1 AND wr.war_type = '거점전'
         ORDER BY wr.war_date DESC`,
        [allianceName]
      )

      return { alliance, guildsResult, fortWarRecordsResult }
    })()

    // 타임아웃과 쿼리 실행을 경쟁시킴
    const { alliance, guildsResult, fortWarRecordsResult } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]) as any

    const fortWarRecords = fortWarRecordsResult.rows
    

    // 연맹 통계 계산 (거점전 기준)
    const totalGuilds = guildsResult.rows.length
    const totalMembers = guildsResult.rows.reduce((sum: number, guild: any) => sum + (guild.member_count || 0), 0)
    
    // 전체 거점전 전적 계산 (1단, 2단, 무제한 모두 포함)
    const totalWins = fortWarRecords.filter((record: any) => record.result === '점령성공').length
    const totalLosses = fortWarRecords.filter((record: any) => record.result === '점령실패').length
    const totalWinRate = totalWins + totalLosses > 0 ? (totalWins / (totalWins + totalLosses)) * 100 : 0

    // 최근 승리 기록 (거점전만, 최대 10개)
    const recentVictories = fortWarRecords.filter((record: any) => record.result === '점령성공').slice(0, 10)


    const response = {
      name: alliance.name,
      tiers: alliance.tiers || [],
      isActive: alliance.is_active,
      markUrl: alliance.mark_url,
      totalGuilds,
      totalMembers,
      totalWins,
      totalLosses,
      totalWinRate: Math.round(totalWinRate * 10) / 10,
      guilds: guildsResult.rows.map((guild: any) => {
        const wins = Number(guild.wins) || 0
        const losses = Number(guild.losses) || 0
        const totalGames = wins + losses
        const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100 * 10) / 10 : 0
        
        return {
          name: guild.guild_name,
          memberCount: Number(guild.member_count) || 0,
          leader: guild.leader || '정보 없음',
          iconUrl: guild.icon_url || '',
          rank: guild.rank ? Number(guild.rank) : null,
          wins: wins,
          losses: losses,
          winRate: winRate
        }
      }),
      recentWarRecords: fortWarRecords.slice(0, 10).map((record: any) => ({
        warDate: record.war_date,
        region: record.region,
        occupiedArea: record.occupied_area,
        result: record.result,
        guildName: '연맹 전체'
      })),
      recentVictories: recentVictories.map((record: any) => ({
        warDate: record.war_date,
        region: record.region,
        occupiedArea: record.occupied_area,
        result: record.result,
        guildName: '연맹 전체'
      }))
    }

    return NextResponse.json(response)
  } catch (err: any) {
    // Alliance not found는 정상적인 경우이므로 로그 출력 안함
    if (err.message === 'Alliance not found') {
      return NextResponse.json({ error: 'Alliance not found' }, { status: 404 })
    }
    
    // 실제 에러만 로그 출력
    console.error('Alliance detail API Error:', err)
    
    if (err.message === 'Request timeout') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    client.release()
  }
}
