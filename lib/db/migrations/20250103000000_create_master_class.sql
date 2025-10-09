-- 마스터 클래스 대회 테이블 생성
CREATE TABLE IF NOT EXISTS master_class_tournaments (
  id SERIAL PRIMARY KEY,
  tournament_name VARCHAR(100) NOT NULL,
  tournament_year INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  registration_start_date DATE,
  registration_end_date DATE,
  is_active BOOLEAN DEFAULT FALSE,
  description TEXT,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 마스터 클래스 참가자 테이블 생성
CREATE TABLE IF NOT EXISTS master_class_participants (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES master_class_tournaments(id) ON DELETE CASCADE,
  player_name VARCHAR(100) NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  subclass VARCHAR(50),
  gear_score INTEGER,
  attack_power INTEGER,
  defense_power INTEGER,
  total_ap_dp INTEGER,
  is_qualified BOOLEAN DEFAULT FALSE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 마스터 클래스 매치 결과 테이블 생성
CREATE TABLE IF NOT EXISTS master_class_matches (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES master_class_tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  player1_id INTEGER REFERENCES master_class_participants(id) ON DELETE CASCADE,
  player2_id INTEGER REFERENCES master_class_participants(id) ON DELETE CASCADE,
  winner_id INTEGER REFERENCES master_class_participants(id) ON DELETE CASCADE,
  match_date TIMESTAMP WITH TIME ZONE,
  match_duration INTEGER, -- 초 단위
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 마스터 클래스 클래스별 우승자 테이블 생성
CREATE TABLE IF NOT EXISTS master_class_winners (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES master_class_tournaments(id) ON DELETE CASCADE,
  class_name VARCHAR(50) NOT NULL,
  winner_id INTEGER REFERENCES master_class_participants(id) ON DELETE CASCADE,
  final_rank INTEGER,
  prize_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_master_class_tournaments_active ON master_class_tournaments(is_active);
CREATE INDEX IF NOT EXISTS idx_master_class_tournaments_year ON master_class_tournaments(tournament_year);
CREATE INDEX IF NOT EXISTS idx_master_class_participants_tournament ON master_class_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_master_class_participants_class ON master_class_participants(class_name);
CREATE INDEX IF NOT EXISTS idx_master_class_participants_qualified ON master_class_participants(is_qualified);
CREATE INDEX IF NOT EXISTS idx_master_class_matches_tournament ON master_class_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_master_class_matches_round ON master_class_matches(round_number);
CREATE INDEX IF NOT EXISTS idx_master_class_winners_tournament ON master_class_winners(tournament_id);
CREATE INDEX IF NOT EXISTS idx_master_class_winners_class ON master_class_winners(class_name);

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_master_class_tournaments_updated_at
  BEFORE UPDATE ON master_class_tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 기본 2025 마스터 클래스 대회 데이터 삽입
INSERT INTO master_class_tournaments (
  tournament_name, 
  tournament_year, 
  start_date, 
  end_date, 
  registration_start_date, 
  registration_end_date, 
  is_active, 
  description, 
  requirements
) VALUES (
  '2025 Black Desert Master Class',
  2025,
  '2025-06-01',
  '2025-06-30',
  '2025-05-01',
  '2025-05-25',
  TRUE,
  '검은사막 각 클래스의 최강자를 가리는 명예로운 PvP 대회',
  '장비 능력치 공격력과 방어력의 합계를 810 이상'
) ON CONFLICT DO NOTHING;
