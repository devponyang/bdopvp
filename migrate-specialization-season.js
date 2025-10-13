const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function migrate() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'new_dium',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'gortkdxks1@',
  })

  try {
    const client = await pool.connect()
    
    try {
      console.log('마이그레이션 시작...')
      
      const sql = fs.readFileSync(
        path.join(__dirname, 'lib/db/migrations/20250114000001_add_season_to_solare_specializations.sql'),
        'utf-8'
      )
      
      await client.query(sql)
      
      console.log('✅ 마이그레이션 완료!')
      console.log('✅ solare_specializations 테이블에 season_id 컬럼이 추가되었습니다.')
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()

