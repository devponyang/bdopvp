const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'new_dium',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'gortkdxks1@',
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🔄 마이그레이션 시작...');
    
    // password 컬럼 추가
    await client.query(`
      ALTER TABLE guild_recruit_posts 
      ADD COLUMN IF NOT EXISTS password VARCHAR(255);
    `);
    console.log('✅ password 컬럼 추가 완료');
    
    // 기존 데이터에 기본 비밀번호 설정 (bcrypt 해시)
    await client.query(`
      UPDATE guild_recruit_posts 
      SET password = '$2a$10$abcdefghijklmnopqrstuv.WqJ7hZ8qU1hZ8qU1hZ8qU1hZ8qU1hZ8qU' 
      WHERE password IS NULL;
    `);
    console.log('✅ 기존 데이터 기본 비밀번호 설정 완료');
    
    console.log('🎉 마이그레이션 성공!');
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);

