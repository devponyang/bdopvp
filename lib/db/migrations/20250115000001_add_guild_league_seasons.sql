-- 길드리그 시즌 관리 테이블 생성
CREATE TABLE IF NOT EXISTS guild_league_seasons (
  id SERIAL PRIMARY KEY,
  season_name VARCHAR(100) NOT NULL,
  season_number INTEGER NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 시즌별 길드리그 랭킹 테이블
CREATE TABLE IF NOT EXISTS guild_league_seasons_data (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES guild_league_seasons(id) ON DELETE CASCADE,
  guild_name VARCHAR(100) NOT NULL,
  rank INTEGER NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_guild_league_seasons_active ON guild_league_seasons(is_active);
CREATE INDEX IF NOT EXISTS idx_guild_league_seasons_number ON guild_league_seasons(season_number);
CREATE INDEX IF NOT EXISTS idx_guild_league_seasons_data_season ON guild_league_seasons_data(season_id);
CREATE INDEX IF NOT EXISTS idx_guild_league_seasons_data_rank ON guild_league_seasons_data(rank);
CREATE INDEX IF NOT EXISTS idx_guild_league_seasons_data_guild ON guild_league_seasons_data(guild_name);

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_guild_league_seasons_updated_at
  BEFORE UPDATE ON guild_league_seasons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 기본 시즌 1 생성
INSERT INTO guild_league_seasons (season_name, season_number, start_date, is_active, description)
VALUES ('길드리그 시즌 1', 1, CURRENT_DATE, TRUE, '첫 번째 길드리그 시즌')
ON CONFLICT (season_number) DO NOTHING;
