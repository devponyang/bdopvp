-- alliances 테이블에 is_active 컬럼 추가
ALTER TABLE alliances ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 기존 연맹들은 모두 활성 상태로 설정
UPDATE alliances SET is_active = TRUE WHERE is_active IS NULL;

-- is_active 컬럼에 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_alliances_is_active ON alliances(is_active);
