const { Pool } = require('pg')

const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'new_dium',
  user: 'postgres',
  password: process.env.DB_PASSWORD || 'gortkdxks1@'
})

async function activateGuildLeagueSeason1() {
  const client = await db.connect()
  try {
    // 길드리그 시즌 1을 활성화
    const result = await client.query(`
      UPDATE guild_league_seasons 
      SET is_active = TRUE 
      WHERE season_number = 1
    `)
    
    console.log(`길드리그 시즌 1 활성화 완료: ${result.rowCount}개 행 수정`)
    
    // 최신 히스토리 데이터를 현재 테이블로 복사
    const latestDateRes = await client.query(`
      SELECT DISTINCT snapshot_date
      FROM guild_league_history
      ORDER BY snapshot_date DESC
      LIMIT 1
    `)
    
    const latestDate = latestDateRes.rows[0]?.snapshot_date
    console.log('최신 날짜:', latestDate)
    
    if (latestDate) {
      // 현재 테이블 비우기
      await client.query('DELETE FROM guild_league')
      
      // 최신 히스토리 데이터를 현재 테이블로 복사
      const copyResult = await client.query(`
        INSERT INTO guild_league (guild_name, rank, wins, losses, score, updated_at)
        SELECT guild_name, rank, wins, losses, score, snapshot_date
        FROM guild_league_history
        WHERE snapshot_date = $1
      `, [latestDate])
      
      console.log(`현재 테이블로 복사 완료: ${copyResult.rowCount}개 행 복사`)
      
      // 너왜시비냐 길드 데이터 확인
      const guildCheck = await client.query(`
        SELECT * FROM guild_league WHERE guild_name = '너왜시비냐'
      `)
      
      console.log('너왜시비냐 길드리그 데이터:', guildCheck.rows[0] || '없음')
    }
    
  } catch (err) {
    console.error('시즌 활성화 오류:', err)
  } finally {
    client.release()
    await db.end()
  }
}

activateGuildLeagueSeason1()
