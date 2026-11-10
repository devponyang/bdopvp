import 'server-only'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { emptyPortal, portalSchema, type PortalState } from './schema'

export async function readPortal(): Promise<PortalState> {
  if (process.env.DB_ENABLED !== 'true')
    return { status: 'offline', updatedAt: null, revision: null, data: emptyPortal }
  try {
    const result = await db.query(
      'SELECT payload, updated_at, revision::text FROM portal_snapshots WHERE id = 1',
    )
    if (!result.rows[0])
      return { status: 'empty', updatedAt: null, revision: null, data: emptyPortal }
    return {
      status: 'live',
      revision: String(result.rows[0].revision),
      updatedAt: new Date(result.rows[0].updated_at).toISOString(),
      data: portalSchema.parse(result.rows[0].payload),
    }
  } catch (error) {
    console.error('Portal data unavailable:', error instanceof Error ? error.name : 'Unknown error')
    return { status: 'error', updatedAt: null, revision: null, data: emptyPortal }
  }
}

// Public reads share a short-lived cache. Administrator reads always bypass it.
export const getPortal = cache(
  unstable_cache(readPortal, ['portal-v2'], { revalidate: 30, tags: ['portal-v2'] }),
)
