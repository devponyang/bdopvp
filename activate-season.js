const { db } = require('./lib/db');

async function activateSeason() {
  const client = await db.connect();
  try {
    console.log('시즌 활성화 중...');
    
    // 모든 시즌을 비활성화
    await client.query('UPDATE solare_seasons SET is_active = FALSE');
    console.log('모든 시즌 비활성화 완료');
    
    // 가장 최근 시즌을 활성화
    const result = await client.query(`
      UPDATE solare_seasons 
      SET is_active = TRUE 
      WHERE id = (SELECT MAX(id) FROM solare_seasons)
    `);
    
    console.log('최신 시즌 활성화 완료');
    
    // 활성 시즌 확인
    const activeSeason = await client.query('SELECT * FROM solare_seasons WHERE is_active = TRUE');
    console.log('활성 시즌:', activeSeason.rows);
    
  } finally {
    client.release();
  }
}

activateSeason();
