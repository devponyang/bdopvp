CREATE TABLE IF NOT EXISTS solare_tournament_applications (
  id SERIAL PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  leader_family_name VARCHAR(100) NOT NULL,
  leader_character_name VARCHAR(100) NOT NULL,
  leader_discord VARCHAR(120) NOT NULL,
  team_members JSONB NOT NULL,
  substitute_member JSONB,
  notes TEXT,
  agree_rules BOOLEAN DEFAULT FALSE,
  edit_password VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_solare_tournament_applications_created_at
  ON solare_tournament_applications(created_at DESC);

