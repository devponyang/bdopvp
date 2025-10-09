-- 길드 모집 게시판 테이블 생성
CREATE TABLE IF NOT EXISTS guild_recruit_posts (
  id SERIAL PRIMARY KEY,
  guild_name VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  requirements TEXT,
  contact_info VARCHAR(200),
  author VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_guild_recruit_posts_is_active ON guild_recruit_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_guild_recruit_posts_created_at ON guild_recruit_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guild_recruit_posts_guild_name ON guild_recruit_posts(guild_name);

-- 샘플 데이터 (선택사항)
INSERT INTO guild_recruit_posts (guild_name, title, content, requirements, contact_info, author, is_active) VALUES
('샘플길드', '신규/복귀 길드원 모집합니다!', '안녕하세요! 샘플길드에서 새로운 길드원을 모집합니다.

저희 길드는 2021년에 창설된 길드로, 현재 30명의 활발한 길드원들과 함께 하고 있습니다.

🎯 주요 활동:
- 일일 길드 미션 참여
- 주간 거점전 참여 (매주 토요일)
- 길드원 간 사냥 및 던전 파티
- 자유로운 채팅과 정보 공유

🏰 길드 시설:
- 모든 길드 버프 상시 활성화
- 길드 창고 자유 이용
- 길드 스킬 최대 레벨

편안하고 즐거운 게임 환경을 만들어가고 있으니, 많은 관심 부탁드립니다!', '- 레벨 56 이상
- 주 3회 이상 접속 가능
- 디스코드 사용 가능 (필수 아님)
- 예의 바른 매너', '게임 내: 샘플길드장
디스코드: sample#1234', '샘플길드장', true);
