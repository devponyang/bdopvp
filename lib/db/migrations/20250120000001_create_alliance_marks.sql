-- 연맹마크 테이블 생성
CREATE TABLE IF NOT EXISTS alliance_marks (
  id SERIAL PRIMARY KEY,
  alliance_name VARCHAR(100) NOT NULL UNIQUE,
  mark_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_alliance_marks_name ON alliance_marks(alliance_name);
CREATE INDEX IF NOT EXISTS idx_alliance_marks_created_at ON alliance_marks(created_at);

-- updated_at 자동 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_alliance_marks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거 생성
CREATE TRIGGER update_alliance_marks_updated_at
  BEFORE UPDATE ON alliance_marks
  FOR EACH ROW
  EXECUTE FUNCTION update_alliance_marks_updated_at();




















