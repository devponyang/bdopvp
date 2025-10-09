-- 솔라레 특화 정보 테이블 생성
CREATE TABLE IF NOT EXISTS solare_specializations (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  class VARCHAR(50) NOT NULL,
  specialization_image_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_name, class)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_solare_specializations_player ON solare_specializations(player_name);
CREATE INDEX IF NOT EXISTS idx_solare_specializations_class ON solare_specializations(class);

-- 업데이트 트리거 생성
CREATE TRIGGER update_solare_specializations_updated_at
  BEFORE UPDATE ON solare_specializations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 테이블 코멘트
COMMENT ON TABLE solare_specializations IS '솔라레의 창 플레이어 특화 정보';
COMMENT ON COLUMN solare_specializations.player_name IS '플레이어 닉네임';
COMMENT ON COLUMN solare_specializations.class IS '클래스명';
COMMENT ON COLUMN solare_specializations.specialization_image_url IS '특화 스크린샷 이미지 URL';
COMMENT ON COLUMN solare_specializations.description IS '특화 설명 (선택사항)';




































