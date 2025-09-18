// lib/utils/solare-history.ts
import { db } from '@/lib/db'

interface OverallEntry {
  name: string
  rank: number
  [key: string]: any
}

interface ClassEntry {
  name: string
  rank: number
  class: string
  [key: string]: any
}

// ✅ 전체 랭킹 순위 변동 계산 (시즌 상태에 따라 처리)
export async function getSolareOverallRankChanges(today: OverallEntry[]) {
  // 활성 시즌 확인
  const activeSeason = await db.query(`
    SELECT id FROM solare_seasons WHERE is_active = TRUE LIMIT 1
  `)
  
  const isSeasonActive = activeSeason.rows.length > 0
  
  // 시즌이 비활성화된 경우 모든 변동을 '-'로 표시
  if (!isSeasonActive) {
    return today.map(entry => ({ ...entry, rankChange: '-' }))
  }

  // 활성 시즌인 경우에만 전날 데이터와 비교
  const latest = await db.query(`
    SELECT snapshot_date
    FROM solare_overall_league_history
    ORDER BY snapshot_date DESC
    LIMIT 1
  `)

  const latestDate = latest.rows[0]?.snapshot_date
  if (!latestDate) return today.map(entry => ({ ...entry, rankChange: 'NEW' }))

  const result = await db.query(
    `SELECT name, class_rank FROM solare_overall_league_history WHERE snapshot_date = $1`,
    [latestDate]
  )

  const prevMap = new Map<string, number>()
  result.rows.forEach((row: any) => {
    prevMap.set(row.name, row.class_rank)
  })

  return today.map((entry) => {
    const prevRank = prevMap.get(entry.name)
    let rankChange = '-'
    if (prevRank === undefined) {
      rankChange = 'NEW'
    } else {
      const diff = prevRank - entry.rank
      if (diff > 0) rankChange = `▲${diff}`
      else if (diff < 0) rankChange = `▼${Math.abs(diff)}`
    }
    return { ...entry, rankChange }
  })
}

// ✅ 클래스별 랭킹 순위 변동 계산 (시즌 상태에 따라 처리)
export async function getSolareClassRankChanges(today: ClassEntry[], className: string) {
  // 활성 시즌 확인
  const activeSeason = await db.query(`
    SELECT id FROM solare_seasons WHERE is_active = TRUE LIMIT 1
  `)
  
  const isSeasonActive = activeSeason.rows.length > 0
  
  // 시즌이 비활성화된 경우 모든 변동을 '-'로 표시
  if (!isSeasonActive) {
    return today.map(entry => ({ ...entry, rankChange: '-' }))
  }

  // 활성 시즌인 경우에만 전날 데이터와 비교
  const latest = await db.query(`
    SELECT snapshot_date
    FROM solare_class_league_history
    WHERE class = $1
    ORDER BY snapshot_date DESC
    LIMIT 1
  `, [className])

  const latestDate = latest.rows[0]?.snapshot_date
  if (!latestDate) return today.map(entry => ({ ...entry, rankChange: 'NEW' }))

  const result = await db.query(
    `SELECT name, class_rank FROM solare_class_league_history WHERE snapshot_date = $1 AND class = $2`,
    [latestDate, className]
  )

  const prevMap = new Map<string, number>()
  result.rows.forEach((row: any) => {
    prevMap.set(row.name, row.class_rank)
  })

  return today.map((entry) => {
    const prevRank = prevMap.get(entry.name)
    let rankChange = '-'
    if (prevRank === undefined) {
      rankChange = 'NEW'
    } else {
      const diff = prevRank - entry.rank
      if (diff > 0) rankChange = `▲${diff}`
      else if (diff < 0) rankChange = `▼${Math.abs(diff)}`
    }
    return { ...entry, rankChange }
  })
}
