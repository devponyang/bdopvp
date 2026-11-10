import { readFile } from 'node:fs/promises'
import pg from 'pg'

// Explicitly invoked only. Never runs when the app starts or renders a page.
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. No migration was run.')
const files = ['20261022000000_portal_rebuild.sql', '20261104000000_portal_revisions.sql']
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
})
try {
  await client.connect()
  for (const name of files) {
    const sql = await readFile(new URL(`../lib/db/migrations/${name}`, import.meta.url), 'utf8')
    await client.query(sql)
    console.log(`Applied: ${name}`)
  }
} finally {
  await client.end()
}
