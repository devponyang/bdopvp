-- 기존 테이블 및 트리거 삭제
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS coupons;

-- 쿠폰 테이블 생성
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 쿠폰 테이블 트리거 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE tip_posts ADD COLUMN IF NOT EXISTS is_notice BOOLEAN DEFAULT FALSE;

-- 검색 로그 테이블 생성
CREATE TABLE IF NOT EXISTS search_logs (
  id SERIAL PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  user_ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 검색 로그 테이블에 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at);

-- 배너 테이블 생성 (광고/후원용)
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  link_url VARCHAR(500),
  button_text VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 배너 테이블 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 배너 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_banners_active_priority ON banners(is_active, priority);

-- 후원자 테이블 생성
CREATE TABLE IF NOT EXISTS supporters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  donation_date DATE NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 후원자 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_supporters_amount ON supporters(amount DESC);
CREATE INDEX IF NOT EXISTS idx_supporters_date ON supporters(donation_date DESC);

-- 길드마크 테이블 생성 (후원자 길드마크용)
CREATE TABLE IF NOT EXISTS guild_marks (
  id SERIAL PRIMARY KEY,
  guild_name VARCHAR(100) NOT NULL UNIQUE,
  mark_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 길드마크 테이블 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_guild_marks_updated_at
  BEFORE UPDATE ON guild_marks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 길드마크 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_guild_marks_guild_name ON guild_marks(guild_name);
CREATE INDEX IF NOT EXISTS idx_guild_marks_created_at ON guild_marks(created_at DESC); 