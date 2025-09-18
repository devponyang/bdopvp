const { Pool } = require('pg')

const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'new_dium',
  user: 'postgres',
  password: process.env.DB_PASSWORD || 'gortkdxks1@'
})

async function checkMissing16th() {
  const client = await db.connect()
  try {
    console.log('=== 16일 데이터 찾기 ===')
    
    // 15일 데이터 중 어떤 것들이 있는지 확인
    console.log('15일에 저장된 모든 거점전 데이터:')
    const data15 = await client.query(`
      SELECT id, war_date, region, occupied_area, result, fort_stage, updated_at
      FROM war_records 
      WHERE DATE(war_date) = '2025-09-15'
        AND war_type = '거점전'
      ORDER BY updated_at DESC, region, occupied_area
    `)
    
    console.log(`15일 데이터: ${data15.rows.length}개`)
    data15.rows.forEach((row, index) => {
      const updateTime = new Date(row.updated_at).toLocaleString('ko-KR')
      console.log(`  ${index + 1}. ${row.region} - ${row.occupied_area || '미입력'} (${row.result}) [입력시간: ${updateTime}]`)
    })
    
    // 2025-09-17 이후에 입력된 것들 (이것들이 16일 데이터일 가능성)
    const recent15Data = data15.rows.filter(row => 
      new Date(row.updated_at) >= new Date('2025-09-17')
    )
    
    console.log(`\n17일 이후에 입력된 15일 데이터 (16일 데이터일 가능성): ${recent15Data.length}개`)
    recent15Data.forEach((row, index) => {
      const updateTime = new Date(row.updated_at).toLocaleString('ko-KR')
      console.log(`  ${index + 1}. ${row.region} - ${row.occupied_area || '미입력'} (${row.result}) [입력시간: ${updateTime}]`)
    })
    
    // 발레노스 지역만 확인
    const balenosData = recent15Data.filter(row => row.region === '발레노스')
    console.log(`\n발레노스 16일 데이터 후보: ${balenosData.length}개`)
    balenosData.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.occupied_area || '미입력'} (${row.result}, ${row.fort_stage}단계)`)
    })
    
  } catch (err) {
    console.error('❌ 오류:', err)
  } finally {
    client.release()
    await db.end()
  }
}

checkMissing16th()
