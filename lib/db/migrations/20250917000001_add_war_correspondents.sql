-- 종군기자 스트리머 관리 테이블 생성
CREATE TABLE IF NOT EXISTS war_correspondents (
  id SERIAL PRIMARY KEY,
  streamer_name VARCHAR(100) NOT NULL UNIQUE,
  chzzk_channel_url VARCHAR(255) NOT NULL,
  profile_image_url VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_war_correspondents_active ON war_correspondents(is_active);

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_war_correspondents_updated_at
  BEFORE UPDATE ON war_correspondents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 예시 데이터 (실제 종군기자들로 교체)
INSERT INTO war_correspondents (streamer_name, chzzk_channel_url, profile_image_url, description)
VALUES 
  ('예시스트리머1', 'https://chzzk.naver.com/live/example_channel_1', '/uploads/profile1.jpg', '거점전 전문 종군기자'),
  ('예시스트리머2', 'https://chzzk.naver.com/live/example_channel_2', '/uploads/profile2.jpg', '점령전 전문 종군기자')
ON CONFLICT (streamer_name) DO NOTHING;
