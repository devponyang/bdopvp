-- tip_posts 테이블에 새로운 플래그 필드들 추가
ALTER TABLE tip_posts ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;
ALTER TABLE tip_posts ADD COLUMN IF NOT EXISTS is_updated BOOLEAN DEFAULT FALSE;
ALTER TABLE tip_posts ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_tip_posts_flags ON tip_posts(is_new, is_updated, priority DESC);
CREATE INDEX IF NOT EXISTS idx_tip_posts_priority ON tip_posts(priority DESC);

-- 기존 정렬 로직을 위한 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_tip_posts_sort ON tip_posts(is_notice DESC, priority DESC, created_at DESC);
