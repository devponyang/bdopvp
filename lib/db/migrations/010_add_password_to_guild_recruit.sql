-- 길드 모집 게시판에 비밀번호 컬럼 추가
ALTER TABLE guild_recruit_posts ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 기존 데이터에 대한 기본 비밀번호 설정 (나중에 수동으로 변경 필요)
UPDATE guild_recruit_posts SET password = 'default1234' WHERE password IS NULL;

