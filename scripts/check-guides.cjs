const puppeteer = require('puppeteer'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  { spawn } = require('node:child_process')
const manifest = require('../lib/portal/guide-content/migration-manifest.json')
const origin = 'http://127.0.0.1:3103'
async function main() {
  const server = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3103'],
    {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      env: { ...process.env, DB_ENABLED: 'false' },
    },
  )
  let stderr = '',
    browser
  server.stderr.on('data', (c) => (stderr += c))
  try {
    const deadline = Date.now() + 30000
    while (true) {
      try {
        if ((await fetch(origin + '/api/v2/health')).ok) break
      } catch {}
      if (Date.now() > deadline) throw Error('startup timeout')
      await new Promise((r) => setTimeout(r, 500))
    }
    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(page.url() + ' ' + e.message))
    await page.setRequestInterception(true)
    page.on('request', (r) =>
      r.url().startsWith(origin) || r.url().startsWith('data:') ? r.continue() : r.abort(),
    )
    for (const g of manifest) {
      assert.equal(
        (await page.goto(origin + '/tip-board/' + g.id, { waitUntil: 'networkidle0' })).status(),
        200,
      )
      assert.equal(await page.$eval('h1', (e) => e.textContent), g.title)
      assert((await page.$$('.reader-section')).length >= g.sections.length)
      assert.equal((await page.$$('iframe')).length, 0)
      assert.deepEqual(
        await page.evaluate(() =>
          [...document.querySelectorAll('.guide-reader a[href^="#"]')]
            .filter((a) => !document.getElementById(decodeURIComponent(a.hash.slice(1))))
            .map((a) => a.hash),
        ),
        [],
        g.id + ' anchors',
      )
      for (const width of [320, 390, 1440]) {
        await page.setViewport({ width, height: 1000 })
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
          false,
          g.id + ' overflow ' + width,
        )
        if (['14', '21'].includes(g.id) && width !== 320)
          await page.screenshot({ path: `artifacts/guide-${g.id}-${width}.png` })
      }
      console.log('PASS guide ' + g.id + ' ' + g.title)
      if (['14', '21'].includes(g.id)) {
        await page.setViewport({ width: g.id === '14' ? 390 : 1440, height: 1000 })
        await page.$$eval('.reader-section', (sections) => sections[2].scrollIntoView())
        await page.screenshot({ path: `artifacts/guide-${g.id}-body.png` })
      }
    }
    for (const id of ['23', '25', '26', '27', '28', '29', '30'])
      assert.equal((await fetch(origin + '/tip-board/' + id)).status, 404, 'private ' + id)
    await page.goto(origin + '/tip-board', { waitUntil: 'networkidle0' })
    assert.equal((await page.$$('.guide-card')).length, 14)
    const ids = await page.$$eval('.guide-card', (cards) =>
      cards.map((a) => a.getAttribute('href')),
    )
    for (const id of ['23', '25', '26', '27', '28', '29', '30'])
      assert(!ids.includes('/tip-board/' + id))
    await page.type('input[aria-label="공략 검색"]', '꾸도')
    assert.equal((await page.$$('.guide-card')).length, 0)
    const font = await page.evaluate(async () => {
      await document.fonts.ready
      return {
        family: getComputedStyle(document.body).fontFamily,
        loaded: [...document.fonts].some(
          (f) => f.family.includes('pretendard') && f.status === 'loaded',
        ),
      }
    })
    assert(font.family.toLowerCase().includes('pretendard'))
    assert(font.loaded, JSON.stringify(font))
    for (const [query, count] of [
      ['iframe', 1],
      ['Ctrl 다크나이트', 1],
      ['전승 레인저'.normalize('NFD'), 1],
      ['꾸도', 0],
    ]) {
      await page.goto(origin + '/search?q=' + encodeURIComponent(query), {
        waitUntil: 'networkidle0',
      })
      assert.equal((await page.$$('.content-card')).length, count, 'global search ' + query)
    }
    await page.goto(origin + '/search?q=iframe', { waitUntil: 'networkidle0' })
    assert((await page.$eval('.content-card', (e) => e.textContent)).includes('iframe 작성'))
    await page.screenshot({ path: 'artifacts/guide-author-search.png' })
    const sitemap = await (await fetch(origin + '/sitemap.xml')).text()
    for (const id of [...manifest.map((g) => g.id), '15'])
      assert(sitemap.includes(`/tip-board/${id}</loc>`))
    for (const id of ['23', '25', '26', '27', '28', '29', '30'])
      assert(!sitemap.includes(`/tip-board/${id}</loc>`))
    await page.goto(origin + '/tip-board/14', { waitUntil: 'networkidle0' })
    assert.equal(
      await page.$eval('link[rel="canonical"]', (e) => e.href),
      'https://bdopvp.com/tip-board/14',
    )
    assert.equal(await page.$eval('meta[name="author"]', (e) => e.content), 'iframe')
    assert((await page.$eval('meta[property="og:title"]', (e) => e.content)).includes('iframe'))
    assert.deepEqual(errors, [])
    assert(!stderr.includes('ERR_INVALID_CHAR'), stderr)
    console.log(
      'PASS 13 migrated guides, 7 private routes, 14 public cards, mobile widths, original media, local Pretendard font',
    )
  } finally {
    await browser?.close()
    server.kill()
  }
}
main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
