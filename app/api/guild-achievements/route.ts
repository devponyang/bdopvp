import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const revalidate = 300 // 5분 캐시

interface Achievement {
  type: 'rank' | 'stability' | 'nodewar' | 'size' | 'popularity'
  title: string
  description: string
  icon: string
  value?: number | object
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const guildName = searchParams.get('guild_name')
  
  if (!guildName) {
    return NextResponse.json({ error: 'guild_name is required' }, { status: 400 })
  }

  try {
    const client = await db.connect()
    const achievements: Achievement[] = []

    // 1. 순위 관련 업적
    const rankResult = await client.query(`
      SELECT rank, wins, losses, score
      FROM guild_league_history 
      WHERE guild_name = $1 
      ORDER BY snapshot_date DESC 
      LIMIT 1
    `, [guildName])

    if (rankResult.rows.length > 0) {
      const { rank, wins, losses, score } = rankResult.rows[0]
      const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0

      // 길드리그 순위 업적 (승률, 점수 정보 포함)
      let rankTitle = ''
      let rankIcon = ''
      let rankDescription = ''

      if (rank >= 1 && rank <= 3) {
        rankTitle = '👑 절대강자'
        rankIcon = '👑'
        rankDescription = `길드리그 ${rank}위! 최상위권을 유지하고 있습니다.`
      } else if (rank <= 10) {
        rankTitle = '⭐ TOP 10 길드'
        rankIcon = '⭐'
        rankDescription = `길드리그 상위 10위권(${rank}위)에 랭크되어 있습니다!`
      } else if (rank <= 30) {
        rankTitle = '💪 TOP 30 길드'
        rankIcon = '💪'
        rankDescription = `길드리그 ${rank}위! 꾸준히 상승 중입니다.`
      } else if (score >= 2000) {
        rankTitle = '💎 고득점 길드'
        rankIcon = '💎'
        rankDescription = `${score}점으로 높은 점수를 기록하고 있습니다!`
      } else if (score >= 1500) {
        rankTitle = '💰 실력파 길드'
        rankIcon = '💰'
        rankDescription = `${score}점의 준수한 실력을 보여줍니다.`
      }

      if (rankTitle) {
        achievements.push({
          type: 'rank',
          title: rankTitle,
          description: rankDescription,
          icon: rankIcon,
          value: {
            rank: rank,
            wins: wins,
            losses: losses,
            winRate: winRate.toFixed(1),
            score: score
          }
        })
      }
    }

    // 2. 안정성 관련 업적 (멤버 변동)
    const stabilityResult = await client.query(`
      SELECT 
        SUM(CASE WHEN status = '가입' THEN 1 ELSE 0 END) AS joins,
        SUM(CASE WHEN status = '탈퇴' THEN 1 ELSE 0 END) AS leaves
      FROM guild_history gh
      JOIN guilds g ON gh.guild_id = g.id
      WHERE g.name = $1 
        AND gh.change_date >= NOW() - INTERVAL '1 month'
    `, [guildName])

    if (stabilityResult.rows.length > 0) {
      const { leaves } = stabilityResult.rows[0]

      if ((leaves || 0) <= 3) {
        achievements.push({
          type: 'stability',
          title: '🛡️ 단단한 결속',
          description: '최근 한 달간 멤버 탈퇴가 3명 이하로 안정적인 길드입니다.',
          icon: '🛡️',
          value: leaves || 0
        })
      }
    }

    // 3. 길드 연차와 규모 업적
    const guildResult = await client.query(`
      SELECT member_count
      FROM guilds 
      WHERE name = $1
    `, [guildName])

    if (guildResult.rows.length > 0) {
      const { member_count } = guildResult.rows[0]

      // 거점전 관련 업적 (실제 데이터 활용)
      // 해당 길드가 속한 연맹의 월간 거점전 승률 계산
      const nodeWarResult = await client.query(`
        SELECT 
          COUNT(*) FILTER (WHERE w.result = '점령성공') AS wins,
          COUNT(*) AS total_battles,
          a.name AS alliance_name
        FROM war_records w
        JOIN alliances a ON w.alliance_id = a.id
        JOIN alliance_guilds ag ON ag.alliance_id = a.id
        WHERE LOWER(ag.guild_name) = LOWER($1)
          AND w.war_type = '거점전'
          AND w.war_date >= CURRENT_DATE - INTERVAL '1 month'
          AND a.is_active = TRUE
        GROUP BY a.id, a.name
        ORDER BY total_battles DESC
        LIMIT 1
      `, [guildName])

      if (nodeWarResult.rows.length > 0) {
        const { wins, total_battles, alliance_name } = nodeWarResult.rows[0]
        const nodeWarRate = total_battles > 0 ? (wins / total_battles) * 100 : 0
        const losses = total_battles - wins

        if (nodeWarRate >= 70 && total_battles >= 3) {
          achievements.push({
            type: 'nodewar',
            title: '⚔️ 거점전 강자',
            description: `월간 거점전 승률 ${nodeWarRate.toFixed(1)}%! 뛰어난 실력을 보여주고 있습니다.`,
            icon: '⚔️',
            value: {
              wins: wins,
              losses: losses,
              winRate: nodeWarRate.toFixed(1),
              alliance: alliance_name
            }
          })
        } else if (nodeWarRate >= 50 && total_battles >= 2) {
          achievements.push({
            type: 'nodewar',
            title: '🏰 거점 수호자',
            description: `월간 거점전 승률 ${nodeWarRate.toFixed(1)}%로 꾸준히 활동하고 있습니다.`,
            icon: '🏰',
            value: {
              wins: wins,
              losses: losses,
              winRate: nodeWarRate.toFixed(1),
              alliance: alliance_name
            }
          })
        } else if (total_battles >= 1) {
          achievements.push({
            type: 'nodewar',
            title: '🛡️ 거점전 참여',
            description: `월간 거점전에 ${total_battles}회 참여하며 경험을 쌓고 있습니다.`,
            icon: '🛡️',
            value: {
              wins: wins,
              losses: losses,
              winRate: nodeWarRate.toFixed(1),
              alliance: alliance_name
            }
          })
        }
      }

      // 길드 규모
      if (member_count >= 80) {
        achievements.push({
          type: 'size',
          title: '👥 대형 길드',
          description: `${member_count}명의 대규모 길드! 많은 멤버들과 함께합니다.`,
          icon: '👥',
          value: member_count
        })
      } else if (member_count >= 50) {
        achievements.push({
          type: 'size',
          title: '👬 중형 길드',
          description: `${member_count}명의 안정적인 규모를 유지하고 있습니다.`,
          icon: '👬',
          value: member_count
        })
      }
    }

    // 4. 검색 인기도
    try {
      const popularityResult = await client.query(`
        SELECT COUNT(*) as search_count
        FROM search_logs 
        WHERE LOWER(query) = LOWER($1) 
          AND created_at >= NOW() - INTERVAL '7 days'
      `, [guildName])

      if (popularityResult.rows.length > 0) {
        const searchCount = popularityResult.rows[0].search_count
        if (searchCount >= 20) {
          achievements.push({
            type: 'popularity',
            title: '🔍 화제의 길드',
            description: `최근 일주일간 ${searchCount}번 검색된 화제의 길드입니다!`,
            icon: '🔍',
            value: searchCount
          })
        } else if (searchCount >= 10) {
          achievements.push({
            type: 'popularity',
            title: '👀 주목받는 길드',
            description: `최근 많은 사람들이 관심을 가지고 있는 길드입니다.`,
            icon: '👀',
            value: searchCount
          })
        }
      }
    } catch (searchError) {
      console.log('Search logs table not found, skipping popularity achievements')
    }

    client.release()

    // 업적이 없으면 기본 업적 추가
    if (achievements.length === 0) {
      achievements.push({
        type: 'nodewar',
        title: '🌟 신진 길드',
        description: '앞으로의 성장이 기대되는 길드입니다!',
        icon: '🌟'
      })
    }

    // 타입별로 정렬
    const typeOrder = { rank: 1, stability: 2, nodewar: 3, size: 4, popularity: 5 }
    achievements.sort((a, b) => typeOrder[a.type] - typeOrder[b.type])

    return NextResponse.json({
      guild_name: guildName,
      achievements,
      total_count: achievements.length
    })

  } catch (error) {
    console.error('Guild achievements error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
