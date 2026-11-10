const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
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
const { portalSchema, emptyPortal } = require('../lib/portal/schema.ts')
const { signSession, verifySession } = require('../lib/portal/session.ts')
const { readLimitedJson } = require('../lib/portal/request.ts')
const { publishSnapshot, PublishConflict } = require('../lib/portal/publish.ts')
const { decodeRouteSegment } = require('../lib/portal/text.ts')
async function main() {
  assert.equal(decodeRouteSegment(encodeURIComponent('검증용길드')), '검증용길드')
  assert.equal(decodeRouteSegment('100%'), '100%')
  assert(portalSchema.safeParse(emptyPortal).success)
  const entry = { name: '검증용 모험가', class: '매구', score: 2000, wins: 10, losses: 5 }
  assert(portalSchema.safeParse({ ...emptyPortal, solare: [entry] }).success)
  assert(!portalSchema.safeParse({ ...emptyPortal, solare: [{ ...entry, score: -1 }] }).success)
  assert(!portalSchema.safeParse({ ...emptyPortal, solare: [entry, entry] }).success)
  assert(
    !portalSchema.safeParse({
      ...emptyPortal,
      recruits: [
        {
          id: '1',
          name: '테스트',
          title: '모집',
          description: '',
          tags: [],
          contact: 'javascript:alert(1)',
        },
      ],
    }).success,
  )
  assert(
    !portalSchema.safeParse({
      ...emptyPortal,
      wars: [
        { id: '1', date: 'not-a-date', region: '지역', tier: '1', winner: '길드', type: '거점전' },
      ],
    }).success,
  )
  process.env.SESSION_SECRET = 'test-only-secret-with-at-least-32-characters'
  const token = signSession()
  assert(verifySession(token))
  assert(!verifySession('true'))
  assert(!verifySession(token + 'x'))
  assert(!verifySession(token.replace(/^\d+/, '1')))
  process.env.SESSION_SECRET = 'different-test-secret-with-at-least-32-characters'
  assert(!verifySession(token))
  delete process.env.SESSION_SECRET
  assert(!verifySession(token))
  assert.deepEqual(
    await readLimitedJson(
      new Request('http://localhost', { method: 'POST', body: '{"name":"포냥이"}' }),
      100,
    ),
    { name: '포냥이' },
  )
  await assert.rejects(
    readLimitedJson(
      new Request('http://localhost', { method: 'POST', body: 'x'.repeat(101) }),
      100,
    ),
    /BODY_TOO_LARGE/,
  )
  await assert.rejects(
    readLimitedJson(new Request('http://localhost', { method: 'POST', body: 'invalid' }), 100),
  )
  const commands = []
  const client = {
    query: async (sql) => {
      commands.push(sql)
      if (sql.startsWith('SELECT revision')) return { rows: [{ revision: '3' }] }
      if (sql.includes('RETURNING'))
        return { rows: [{ revision: '4', updated_at: '2026-11-04T00:00:00Z' }] }
      return { rows: [] }
    },
  }
  assert.equal((await publishSnapshot(client, emptyPortal, '3')).revision, '4')
  assert.equal(commands.at(-1), 'COMMIT')
  commands.length = 0
  await assert.rejects(publishSnapshot(client, emptyPortal, '2'), PublishConflict)
  assert.equal(commands.at(-1), 'ROLLBACK')
  assert(!commands.some((sql) => sql.startsWith('INSERT')), 'conflicts must never write')
  const failed = []
  await assert.rejects(
    publishSnapshot(
      {
        query: async (sql) => {
          failed.push(sql)
          if (sql.startsWith('SELECT revision')) return { rows: [] }
          if (sql.startsWith('INSERT')) throw new Error('storage failed')
          return { rows: [] }
        },
      },
      emptyPortal,
      null,
    ),
    /storage failed/,
  )
  assert.equal(failed.at(-1), 'ROLLBACK')
  console.log(
    'PASS: snapshot validation, unsafe URLs, duplicate records, sessions, tampering, expired tokens, secret rotation, UTF-8 JSON and body limits.',
  )
  console.log(
    'PASS: atomic publication, revision conflicts without writes, storage failure rollback.',
  )
}
main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
