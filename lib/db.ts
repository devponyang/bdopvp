import { Pool } from 'pg'

export const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'new_dium',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'gortkdxks1@',
  max: 20, // 최대 동시 연결 수 증가
  idleTimeoutMillis: 30000, // 30초로 증가
  connectionTimeoutMillis: 10000, // 10초로 증가
  statement_timeout: 30000, // 쿼리 실행 타임아웃 30초
  query_timeout: 30000, // 쿼리 타임아웃 30초
})

// 인덱스 생성 함수 (서버에서만 실행)
export async function createIndexes() {
  // 서버 환경에서만 실행
  if (typeof window !== 'undefined') {
    return
  }

  const client = await db.connect()
  try {
    // war_records 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_war_records_date_type ON war_records(war_date, war_type);
      CREATE INDEX IF NOT EXISTS idx_war_records_alliance ON war_records(alliance_id);
      CREATE INDEX IF NOT EXISTS idx_war_records_region ON war_records(region);
    `)

    // alliances 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_alliances_name ON alliances(name);
    `)

    // guild_league 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guild_league_rank ON guild_league(rank);
      CREATE INDEX IF NOT EXISTS idx_guild_league_name ON guild_league(guild_name);
    `)

    // alliance_guilds 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_alliance_guilds_alliance_id ON alliance_guilds(alliance_id);
      CREATE INDEX IF NOT EXISTS idx_alliance_guilds_guild_name ON alliance_guilds(guild_name);
    `)

    // guilds 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guilds_name_lower ON guilds(LOWER(name));
      CREATE INDEX IF NOT EXISTS idx_guilds_is_deleted ON guilds(is_deleted);
    `)

    // alliance_marks 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_alliance_marks_alliance_name ON alliance_marks(alliance_name);
    `)

    // solare 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_solare_class_league_class ON solare_class_league(class);
      CREATE INDEX IF NOT EXISTS idx_solare_overall_league_score ON solare_overall_league(score);
    `)
  } catch (err) {
    console.error('인덱스 생성 중 오류 발생:', err)
  } finally {
    client.release()
  }
}
