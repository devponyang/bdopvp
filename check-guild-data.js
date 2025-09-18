const { Pool } = require('pg')

const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'new_dium',
  user: 'postgres',
  password: process.env.DB_PASSWORD || 'gortkdxks1@'
})

async function checkGuildData() {
  const client = await db.connect()
  try {
    const guildName = '너왜시비냐'
    
    // 1. 길드 기본 정보 확인
    const guildInfo = await client.query(`
      SELECT * FROM guilds WHERE name = $1
    `, [guildName])
    
    console.log('길드 기본 정보:', guildInfo.rows[0] || '없음')
    
    // 2. 현재 길드리그 테이블에서 확인
    const currentLeague = await client.query(`
      SELECT * FROM guild_league WHERE guild_name = $1
    `, [guildName])
    
    console.log('현재 길드리그 데이터:', currentLeague.rows[0] || '없음')
    
    // 3. 히스토리에서 확인
    const historyData = await client.query(`
      SELECT * FROM guild_league_history 
      WHERE guild_name = $1 
      ORDER BY snapshot_date DESC 
      LIMIT 5
    `, [guildName])
    
    console.log('히스토리 데이터 (최근 5개):')
    historyData.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.snapshot_date}: ${row.rank}위 (${row.wins}승 ${row.losses}패, ${row.score}점)`)
    })
    
    // 4. 활성 시즌 확인
    const activeSeason = await client.query(`
      SELECT * FROM guild_league_seasons WHERE is_active = TRUE
    `)
    
    console.log('활성 길드리그 시즌:', activeSeason.rows[0] || '없음')
    
  } catch (err) {
    console.error('데이터 확인 오류:', err)
  } finally {
    client.release()
    await db.end()
  }
}

checkGuildData()
