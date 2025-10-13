const { Pool } = require('pg')

async function updateExistingSpecializations() {
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
      console.log('기존 특화 정보 확인 중...')
      
      // season_id가 NULL인 특화 정보 개수 확인
      const countResult = await client.query(`
        SELECT COUNT(*) as count FROM solare_specializations WHERE season_id IS NULL
      `)
      
      const nullCount = parseInt(countResult.rows[0].count)
      console.log(`season_id가 NULL인 특화 정보: ${nullCount}개`)
      
      if (nullCount === 0) {
        console.log('✅ 업데이트할 특화 정보가 없습니다.')
        return
      }
      
      // 시즌 2 찾기
      const season2Result = await client.query(`
        SELECT id, season_name FROM solare_seasons WHERE season_number = 2 LIMIT 1
      `)
      
      if (season2Result.rows.length === 0) {
        console.log('⚠️  시즌 2를 찾을 수 없습니다.')
        return
      }
      
      const season2 = season2Result.rows[0]
      console.log(`시즌 2: ${season2.season_name} (ID: ${season2.id})`)
      
      // season_id가 NULL인 기존 특화 정보들을 시즌 2로 업데이트
      const updateResult = await client.query(`
        UPDATE solare_specializations
        SET season_id = $1
        WHERE season_id IS NULL
      `, [season2.id])
      
      console.log(`✅ ${updateResult.rowCount}개의 특화 정보가 시즌 2(ID: ${season2.id})로 업데이트되었습니다.`)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ 업데이트 실패:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

updateExistingSpecializations()
