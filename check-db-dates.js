const { Pool } = require('pg')

const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'new_dium',
  user: 'postgres',
  password: 'gortkdxks1@'
})

async function checkDBDates() {
  const client = await db.connect()
  try {
    console.log('=== 데이터베이스 날짜 저장 형태 확인 ===')
    
    // 최근 며칠 데이터의 실제 저장 형태 확인
    const result = await client.query(`
      SELECT 
        war_date,
        DATE(war_date) as date_part,
        DATE(war_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul') as kst_date,
        region,
        occupied_area,
        result
      FROM war_records 
      WHERE war_date >= '2025-09-14'
        AND war_type = '거점전'
        AND region IN ('발레노스', '세렌디아')
      ORDER BY war_date DESC
      LIMIT 10
    `)
    
    console.log('결과:')
    result.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. war_date: ${row.war_date}`)
      console.log(`     DATE(war_date): ${row.date_part}`)
      console.log(`     KST 변환: ${row.kst_date}`)
      console.log(`     지역: ${row.region}, 결과: ${row.result}`)
      console.log('')
    })
    
    // API 쿼리와 동일한 조건으로 테스트
    console.log('=== API 쿼리 테스트 ===')
    const apiTest = await client.query(`
      SELECT
        w.id,
        w.war_type,
        w.war_date,
        COALESCE(a.name, '[해체된 연맹]') AS alliance_name,
        w.occupied_area,
        w.result,
        w.fort_stage,
        w.region
      FROM war_records w
      LEFT JOIN alliances a ON w.alliance_id = a.id
      WHERE w.war_date = $1 AND w.war_type = $2 AND w.region = ANY($3)
      ORDER BY w.region ASC, a.name ASC
    `, ['2025-09-16', '거점전', ['발레노스', '세렌디아']])
    
    console.log(`2025-09-16 쿼리 결과: ${apiTest.rows.length}개`)
    if (apiTest.rows.length > 0) {
      console.log('첫 번째 결과:', apiTest.rows[0])
    }
    
  } catch (err) {
    console.error('에러:', err)
  } finally {
    client.release()
    await db.end()
  }
}

checkDBDates()

