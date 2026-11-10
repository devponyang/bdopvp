const assert = require('node:assert/strict')
const fs = require('node:fs')
const crypto = require('node:crypto')
const ts = require('typescript')
const { Client } = require('pg')
require.extensions['.ts'] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  )
const { publishSnapshot, PublishConflict } = require('../lib/portal/publish.ts')
const { emptyPortal } = require('../lib/portal/schema.ts')

async function main() {
  const embedded = process.argv.includes('--embedded')
  const url = process.env.TEST_DATABASE_URL
  if (!embedded && (!url || !new URL(url).pathname.startsWith('/ponyang_test')))
    throw new Error(
      'Use a dedicated ponyang_test database via TEST_DATABASE_URL. Production databases are not accepted.',
    )
  let client, migrate
  if (embedded) {
    const { PGlite } = require('@electric-sql/pglite')
    const database = await PGlite.create()
    client = {
      query: database.query.bind(database),
      connect: async () => {},
      end: () => database.close(),
    }
    migrate = database.exec.bind(database)
  } else {
    client = new Client({ connectionString: url })
    migrate = client.query.bind(client)
  }
  const schema = `test_${crypto.randomBytes(12).toString('hex')}`
  await client.connect()
  try {
    await client.query(`CREATE SCHEMA ${schema}`)
    await client.query(`SET search_path TO ${schema}`)
    for (const name of ['20261022000000_portal_rebuild.sql', '20261104000000_portal_revisions.sql'])
      await migrate(fs.readFileSync(`lib/db/migrations/${name}`, 'utf8'))
    assert.equal((await publishSnapshot(client, emptyPortal, null)).revision, '1')
    assert.equal(
      (await publishSnapshot(client, { ...emptyPortal, season: '검증용 시즌' }, '1')).revision,
      '2',
    )
    await assert.rejects(publishSnapshot(client, emptyPortal, '1'), PublishConflict)
    assert.equal(
      (await client.query('SELECT count(*)::int AS count FROM portal_snapshot_history')).rows[0]
        .count,
      1,
    )
    const previous = (await client.query('SELECT payload FROM portal_snapshot_history')).rows[0]
      .payload
    assert.equal((await publishSnapshot(client, previous, '2')).revision, '3')
    assert.equal(
      (await client.query('SELECT payload FROM portal_snapshots')).rows[0].payload.season,
      emptyPortal.season,
    )
    console.log(
      'PASS: PostgreSQL migration, publication, history, conflict rejection and restoring a previous publication.',
    )
  } finally {
    await client.query('ROLLBACK').catch(() => {})
    await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`)
    await client.end()
  }
}
main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
