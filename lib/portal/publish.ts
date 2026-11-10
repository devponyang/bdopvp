import type { PoolClient } from 'pg'
import type { PortalData } from './schema'

export class PublishConflict extends Error {
  constructor() {
    super('다른 창에서 데이터가 변경되었습니다. 최신 내용을 다시 불러온 뒤 게시하세요.')
  }
}

/** Lock, compare revision, archive and publish as one transaction. */
export async function publishSnapshot(
  client: Pick<PoolClient, 'query'>,
  data: PortalData,
  expectedRevision: string | null,
) {
  await client.query('BEGIN')
  try {
    await client.query('SELECT pg_advisory_xact_lock(706679)')
    const current = await client.query('SELECT revision::text FROM portal_snapshots WHERE id = 1')
    if ((current.rows[0]?.revision ?? null) !== expectedRevision) throw new PublishConflict()
    await client.query(
      'INSERT INTO portal_snapshot_history(payload, published_at, revision) SELECT payload, updated_at, revision FROM portal_snapshots WHERE id = 1',
    )
    const result = await client.query(
      'INSERT INTO portal_snapshots(id,payload,revision,updated_at) VALUES (1,$1,1,NOW()) ON CONFLICT(id) DO UPDATE SET payload=EXCLUDED.payload,revision=portal_snapshots.revision+1,updated_at=EXCLUDED.updated_at RETURNING revision::text,updated_at',
      [JSON.stringify(data)],
    )
    await client.query('COMMIT')
    return {
      revision: String(result.rows[0].revision),
      updatedAt: new Date(result.rows[0].updated_at).toISOString(),
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    throw error
  }
}
