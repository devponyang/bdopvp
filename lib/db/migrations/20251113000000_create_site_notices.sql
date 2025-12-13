CREATE TABLE IF NOT EXISTS site_notices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_notices_published_created_at
  ON site_notices(is_published, created_at DESC);

CREATE TRIGGER update_site_notices_updated_at
  BEFORE UPDATE ON site_notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();












