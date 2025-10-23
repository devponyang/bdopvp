-- 솔라레 히스토리 테이블 생성
-- 날짜별 솔라레 데이터를 저장하기 위한 테이블들

-- 솔라레 전체 랭킹 히스토리 테이블
CREATE TABLE IF NOT EXISTS solare_overall_league_history (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(50),
  classtype VARCHAR(50),
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  lose INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  class_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 솔라레 클래스별 랭킹 히스토리 테이블
CREATE TABLE IF NOT EXISTS solare_class_league_history (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(50),
  classtype VARCHAR(50),
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  lose INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  class_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 기존 솔라레 테이블들 (현재 데이터용)
CREATE TABLE IF NOT EXISTS solare_overall_league (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subclass VARCHAR(50),
  class VARCHAR(50),
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solare_class_league (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subclass VARCHAR(50),
  class VARCHAR(50),
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_solare_overall_history_date ON solare_overall_league_history(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_solare_overall_history_score ON solare_overall_league_history(snapshot_date, score DESC);
CREATE INDEX IF NOT EXISTS idx_solare_class_history_date ON solare_class_league_history(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_solare_class_history_class ON solare_class_league_history(snapshot_date, class);
CREATE INDEX IF NOT EXISTS idx_solare_class_history_score ON solare_class_league_history(snapshot_date, class, score DESC);

-- 현재 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_solare_overall_current_score ON solare_overall_league(score DESC);
CREATE INDEX IF NOT EXISTS idx_solare_class_current_class ON solare_class_league(class);
CREATE INDEX IF NOT EXISTS idx_solare_class_current_score ON solare_class_league(class, score DESC);

-- 테이블 코멘트
COMMENT ON TABLE solare_overall_league_history IS '솔라레 전체 랭킹 히스토리 (날짜별 스냅샷)';
COMMENT ON TABLE solare_class_league_history IS '솔라레 클래스별 랭킹 히스토리 (날짜별 스냅샷)';
COMMENT ON TABLE solare_overall_league IS '솔라레 전체 랭킹 (현재 데이터)';
COMMENT ON TABLE solare_class_league IS '솔라레 클래스별 랭킹 (현재 데이터)';
