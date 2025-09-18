'use server'

import { db } from '@/lib/db'

export async function getAllGuildLeague() {
  // 활성 시즌 확인
  const activeSeason = await db.query(`
    SELECT id, is_active FROM guild_league_seasons WHERE is_active = TRUE LIMIT 1
  `)
  
  const isSeasonActive = activeSeason.rows.length > 0

  let latestRows
  let latestDate

  if (isSeasonActive) {
    // 활성 시즌인 경우 현재 테이블에서 데이터 조회
    latestRows = await db.query(`
      SELECT 
        guild_name,
        rank,
        wins,
        losses,
        score,
        updated_at as snapshot_date
      FROM guild_league
      ORDER BY rank ASC
    `)
    latestDate = latestRows.rows[0]?.snapshot_date
  } else {
    // 비활성 시즌인 경우 히스토리에서 최신 데이터 조회
    const latestDateRes = await db.query(`
      SELECT DISTINCT snapshot_date
      FROM guild_league_history
      ORDER BY snapshot_date DESC
    `)

    latestDate = latestDateRes.rows[0]?.snapshot_date
    if (!latestDate) {
      return []
    }

    // 최신 날짜의 데이터 가져오기
    latestRows = await db.query(
      `SELECT *, snapshot_date FROM guild_league_history 
       WHERE snapshot_date = $1 
       ORDER BY rank ASC`,
      [latestDate]
    )
  }

  // 시즌 활성화 상태에 따른 순위 변동 처리
  if (!isSeasonActive) {
    // 시즌이 비활성화된 경우 모든 변동을 '-'로 표시
    return latestRows.rows.map((row) => ({
      ...row,
      rank_diff: '-',
      score_diff: '-',
    }))
  }

  // 활성 시즌인 경우에만 전날 데이터와 비교
  let prevRows: any = { rows: [] }
  let daysBack = 1
  
  while (prevRows.rows.length === 0 && daysBack <= 7) {
    const prevDate = new Date(latestDate)
    prevDate.setDate(prevDate.getDate() - daysBack)
    
    prevRows = await db.query(
      `SELECT guild_name, rank, score FROM guild_league_history 
       WHERE snapshot_date = $1`,
      [prevDate]
    )
    
    console.log(`${daysBack}일 전 데이터 개수:`, prevRows.rows.length)
    daysBack++
  }
  
  console.log('최종 전날 데이터 개수:', prevRows.rows.length)

  const prevMap = new Map<string, { rank: number, score: number }>()
  for (const row of prevRows.rows) {
    const name = row.guild_name.trim().normalize('NFC')
    prevMap.set(name, { rank: row.rank, score: row.score })
    console.log('전날 데이터:', name, row.rank, row.score)
  }

  return latestRows.rows.map((row) => {
    const name = row.guild_name.trim().normalize('NFC')
    const prev = prevMap.get(name)
    let rank_diff = '-'
    let score_diff = '-'
    if (prev) {
      const rankChange = prev.rank - row.rank
      rank_diff = rankChange > 0 ? `▲${rankChange}` : rankChange < 0 ? `▼${Math.abs(rankChange)}` : '-'
      const scoreChange = row.score - prev.score
      score_diff = scoreChange > 0 ? `▲${scoreChange}` : scoreChange < 0 ? `▼${Math.abs(scoreChange)}` : '-'
    } else {
      rank_diff = 'NEW'
      score_diff = 'NEW'
    }
    console.log('길드:', name, '현재 순위:', row.rank, '이전 순위:', prev?.rank, '순위 변동:', rank_diff, '점수 변동:', score_diff)
    
    return {
      ...row,
      rank_diff,
      score_diff,
    }
  })
}
