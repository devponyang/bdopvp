const { db } = require('./lib/db.ts')
const fs = require('fs')
const path = require('path')

async function runSiteNoticesMigration() {
  const migrationPath = path.join(
    __dirname,
    'lib',
    'db',
    'migrations',
    '20251113000000_create_site_notices.sql'
  )

  try {
    const sql = fs.readFileSync(migrationPath, 'utf8')
    console.log('📢 site_notices 테이블 마이그레이션 실행 중...')
    await db.query(sql)
    console.log('✅ 마이그레이션 완료!')
    process.exit(0)
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error)
    process.exit(1)
  }
}

runSiteNoticesMigration()













