-- Non-destructive foundation for the rebuilt site. Does not restore lost data.
BEGIN;
CREATE TABLE IF NOT EXISTS portal_snapshots (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS portal_snapshot_history (
  id BIGSERIAL PRIMARY KEY,
  payload JSONB NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMIT;
