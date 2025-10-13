-- 솔라레 특화 정보 테이블에 season_id 컬럼 추가
ALTER TABLE solare_specializations 
ADD COLUMN IF NOT EXISTS season_id INTEGER REFERENCES solare_seasons(id);

-- 기존 UNIQUE 제약 조건 삭제
ALTER TABLE solare_specializations 
DROP CONSTRAINT IF EXISTS solare_specializations_player_name_class_key;

-- 새로운 UNIQUE 제약 조건 추가 (player_name, class, season_id)
ALTER TABLE solare_specializations 
ADD CONSTRAINT solare_specializations_player_class_season_unique 
UNIQUE(player_name, class, season_id);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_solare_specializations_season ON solare_specializations(season_id);

-- 코멘트 추가
COMMENT ON COLUMN solare_specializations.season_id IS '솔라레 시즌 ID (NULL이면 전체 시즌 공통)';

