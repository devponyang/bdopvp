const { db } = require('./lib/db.ts');
const fs = require('fs');

async function runMigration() {
  try {
    const sql = fs.readFileSync('./lib/db/migrations/20250125000001_add_tip_posts_flags.sql', 'utf8');
    console.log('마이그레이션 실행 중...');
    await db.query(sql);
    console.log('마이그레이션 완료!');
    process.exit(0);
  } catch (err) {
    console.error('마이그레이션 오류:', err);
    process.exit(1);
  }
}

runMigration();
