-- 솔라레 테이블에 길드명 컬럼 추가 (korbdo API 연동)
ALTER TABLE solare_overall_league ADD COLUMN IF NOT EXISTS guild_name VARCHAR(100);
ALTER TABLE solare_class_league ADD COLUMN IF NOT EXISTS guild_name VARCHAR(100);
ALTER TABLE solare_overall_league_history ADD COLUMN IF NOT EXISTS guild_name VARCHAR(100);
ALTER TABLE solare_class_league_history ADD COLUMN IF NOT EXISTS guild_name VARCHAR(100);
