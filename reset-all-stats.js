const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'new_dium',
  user: 'postgres',
  password: process.env.DB_PASSWORD || 'gortkdxks1@'
})

async function resetAllStats() {
  const client = await db.connect()
  try {
    console.log('=== 모든 통계 초기화 시작 ===')
    
    // 1. 검색 로그 삭제
    console.log('1. 검색 로그 삭제 중...')
    const searchResult = await client.query('DELETE FROM search_logs')
    console.log(`   - 삭제된 검색 로그: ${searchResult.rowCount}개`)
    
    // 2. 트래픽 통계 초기화
    console.log('2. 트래픽 통계 초기화 중...')
    const DATA_PATH = path.join(process.cwd(), 'traffic.json')
    const resetData = {
      today: {},
      week: {},
      month: {},
      total: 0
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(resetData, null, 2))
    console.log('   - 트래픽 통계 초기화 완료')
    
    // 3. 초기화 후 확인
    console.log('\n3. 초기화 후 상태 확인:')
    
    // 검색 로그 확인
    const searchCount = await client.query('SELECT COUNT(*) FROM search_logs')
    console.log(`   - 검색 로그 수: ${searchCount.rows[0].count}`)
    
    // 트래픽 데이터 확인
    const trafficData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
    console.log(`   - 트래픽 총합: ${trafficData.total}`)
    
    console.log('\n✅ 모든 통계 초기화 완료!')
    
  } catch (err) {
    console.error('오류:', err)
  } finally {
    client.release()
    await db.end()
  }
}

resetAllStats()
