import { db } from "@/lib/db"

export async function getGuildLeagueTop10() {
  // 활성 시즌 확인
  const activeSeason = await db.query(`
    SELECT id FROM guild_league_seasons WHERE is_active = TRUE LIMIT 1
  `)
  
  const isSeasonActive = activeSeason.rows.length > 0
  
  if (!isSeasonActive) {
    // 활성 시즌이 없으면 최신 히스토리 데이터 사용
    const latestDateRes = await db.query(`
      SELECT DISTINCT snapshot_date
      FROM guild_league_history
      ORDER BY snapshot_date DESC
      LIMIT 1
    `)

    const latestDate = latestDateRes.rows[0]?.snapshot_date
    if (!latestDate) return []

    // 최신 날짜의 데이터 가져오기
    const latestRows = await db.query(
      `SELECT *, snapshot_date FROM guild_league_history 
       WHERE snapshot_date = $1 
       ORDER BY rank ASC
       LIMIT 10`,
      [latestDate]
    )

    // 전날 데이터 가져오기 (여러 날짜를 시도)
    let prevRows = { rows: [] }
    let daysBack = 1
    
    while (prevRows.rows.length === 0 && daysBack <= 7) {
      const prevDate = new Date(latestDate)
      prevDate.setDate(prevDate.getDate() - daysBack)
      
      prevRows = await db.query(
        `SELECT guild_name, rank FROM guild_league_history 
         WHERE snapshot_date = $1`,
        [prevDate]
      )
      daysBack++
    }

    const prevMap = new Map<string, number>()
    for (const row of prevRows.rows) {
      const name = (row as any).guild_name.trim().normalize('NFC')
      prevMap.set(name, (row as any).rank)
    }

    // 시즌이 비활성화된 경우 모든 변동을 '-'로 표시
    return latestRows.rows.map((row) => ({
      ...row,
      rankChange: '-',
    }))
  } else {
    // 활성 시즌이 있으면 현재 테이블에서 데이터 조회
    const currentRows = await db.query(`
      SELECT 
        guild_name,
        rank,
        wins,
        losses,
        score,
        updated_at as snapshot_date
      FROM guild_league
      ORDER BY rank ASC
      LIMIT 10
    `)

    // 전날 데이터와 비교를 위해 히스토리에서 가져오기
    const latestDateRes = await db.query(`
      SELECT DISTINCT snapshot_date
      FROM guild_league_history
      ORDER BY snapshot_date DESC
      LIMIT 1
    `)

    const latestDate = latestDateRes.rows[0]?.snapshot_date
    let prevMap = new Map<string, number>()
    
    if (latestDate) {
      let prevRows = { rows: [] }
      let daysBack = 1
      
      while (prevRows.rows.length === 0 && daysBack <= 7) {
        const prevDate = new Date(latestDate)
        prevDate.setDate(prevDate.getDate() - daysBack)
        
        prevRows = await db.query(
          `SELECT guild_name, rank FROM guild_league_history 
           WHERE snapshot_date = $1`,
          [prevDate]
        )
        daysBack++
      }

      for (const row of prevRows.rows) {
        const name = (row as any).guild_name.trim().normalize('NFC')
        prevMap.set(name, (row as any).rank)
      }
    }

    return currentRows.rows.map((row) => {
      const name = (row as any).guild_name.trim().normalize('NFC')
      const prevRank = prevMap.get(name)
      
      let rankChange: string
      if (prevRank === undefined) {
        rankChange = 'NEW'
      } else {
        const change = prevRank - (row as any).rank
        if (change > 0) rankChange = `▲${change}`
        else if (change < 0) rankChange = `▼${Math.abs(change)}`
        else rankChange = '-'
      }

      return {
        ...row,
        rankChange,
      }
    })
  }
}
