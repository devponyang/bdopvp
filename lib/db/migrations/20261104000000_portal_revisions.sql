BEGIN;
ALTER TABLE portal_snapshots ADD COLUMN IF NOT EXISTS revision BIGINT NOT NULL DEFAULT 0;
ALTER TABLE portal_snapshot_history ADD COLUMN IF NOT EXISTS revision BIGINT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS portal_snapshot_history_archived_idx ON portal_snapshot_history(archived_at DESC);
COMMIT;
