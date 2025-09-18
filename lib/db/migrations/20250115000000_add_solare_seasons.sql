-- 솔라레 시즌 관리 테이블 생성
CREATE TABLE IF NOT EXISTS solare_seasons (
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

-- 시즌별 솔라레 전체 랭킹 테이블
CREATE TABLE IF NOT EXISTS solare_overall_league_seasons (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES solare_seasons(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  subclass VARCHAR(50),
  class VARCHAR(50),
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 시즌별 솔라레 클래스 랭킹 테이블
CREATE TABLE IF NOT EXISTS solare_class_league_seasons (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES solare_seasons(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  subclass VARCHAR(50),
  class VARCHAR(50),
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_solare_seasons_active ON solare_seasons(is_active);
CREATE INDEX IF NOT EXISTS idx_solare_seasons_number ON solare_seasons(season_number);
CREATE INDEX IF NOT EXISTS idx_solare_overall_seasons_season ON solare_overall_league_seasons(season_id);
CREATE INDEX IF NOT EXISTS idx_solare_overall_seasons_score ON solare_overall_league_seasons(score DESC);
CREATE INDEX IF NOT EXISTS idx_solare_class_seasons_season ON solare_class_league_seasons(season_id);
CREATE INDEX IF NOT EXISTS idx_solare_class_seasons_class ON solare_class_league_seasons(class);
CREATE INDEX IF NOT EXISTS idx_solare_class_seasons_score ON solare_class_league_seasons(score DESC);

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_solare_seasons_updated_at
  BEFORE UPDATE ON solare_seasons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 기본 시즌 1 생성
INSERT INTO solare_seasons (season_name, season_number, start_date, is_active, description)
VALUES ('솔라레의 창 시즌 1', 1, CURRENT_DATE, TRUE, '첫 번째 솔라레의 창 시즌')
ON CONFLICT (season_number) DO NOTHING;
