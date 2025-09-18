-- 배너 타입 필드 추가
ALTER TABLE banners ADD COLUMN IF NOT EXISTS banner_type VARCHAR(20) DEFAULT 'main';

-- 기존 배너들을 메인 타입으로 설정
UPDATE banners SET banner_type = 'main' WHERE banner_type IS NULL;

-- 배너 타입에 NOT NULL 제약 조건 추가
ALTER TABLE banners ALTER COLUMN banner_type SET NOT NULL;

-- 배너 타입 제약 조건 추가 (main, sidebar, card, inline 만 허용)
ALTER TABLE banners ADD CONSTRAINT check_banner_type 
  CHECK (banner_type IN ('main', 'sidebar', 'card', 'inline'));

-- 배너 타입별 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_banners_type_active ON banners(banner_type, is_active, priority);

-- 배너 위치 필드 추가 (사이드바나 카드형 배너의 위치 지정용)
ALTER TABLE banners ADD COLUMN IF NOT EXISTS position VARCHAR(50) DEFAULT 'home';

-- 위치별 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position, banner_type, is_active);

COMMENT ON COLUMN banners.banner_type IS '배너 타입: main(메인배너), sidebar(사이드바), card(카드형), inline(인라인)';
COMMENT ON COLUMN banners.position IS '배너 위치: home(홈페이지), guild(길드페이지), solare(솔라레페이지) 등';

