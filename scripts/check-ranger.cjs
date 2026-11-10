const puppeteer = require('puppeteer')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { spawn } = require('node:child_process')
const origin = 'http://127.0.0.1:3102'
async function main() {
  const server = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3102'],
    {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      env: { ...process.env, DB_ENABLED: 'false' },
    },
  )
  let serverErrors = ''
  server.stderr.on('data', (chunk) => {
    serverErrors += chunk.toString()
  })
  let browser
  try {
    const deadline = Date.now() + 30000
    while (true) {
      try {
        if ((await fetch(origin + '/api/v2/health')).ok) break
      } catch {}
      if (Date.now() > deadline) throw Error('Server startup timeout')
      await new Promise((r) => setTimeout(r, 500))
    }
    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.setRequestInterception(true)
    page.on('request', (r) =>
      r.url().startsWith(origin) || r.url().startsWith('data:') ? r.continue() : r.abort(),
    )
    await page.setViewport({ width: 1440, height: 1100 })
    assert.equal(
      (await page.goto(origin + '/tip-board/15', { waitUntil: 'networkidle0' })).status(),
      200,
    )
    await page.waitForSelector('.reader-section')
    const checkAuthorCover = async () => {
      await page.waitForFunction(
        () => document.querySelector('.reader-portrait img')?.naturalWidth > 0,
      )
      const cover = await page.$eval('.reader-portrait img', (image) => {
        const rect = image.getBoundingClientRect()
        return {
          src: decodeURI(image.getAttribute('src')),
          ratio: rect.width / rect.height,
          originalRatio: image.naturalWidth / image.naturalHeight,
          fit: getComputedStyle(image).objectFit,
        }
      })
      assert.equal(cover.src, '/tip-images/홍줭.png')
      assert.equal(cover.fit, 'contain')
      assert(
        Math.abs(cover.ratio - cover.originalRatio) < 0.01,
        'author screenshot must retain its complete original aspect ratio',
      )
    }
    await checkAuthorCover()
    assert.equal((await page.$$('.reader-section')).length, 8)
    assert.equal((await page.$$('.reader-prose h3')).length, 28)
    assert.equal((await page.$$('iframe')).length, 0, 'videos must load on request only')
    assert.equal(
      (await page.$$('.guide-image-dialog img')).length,
      0,
      'full-size images load only when opened',
    )
    assert.equal(await page.$eval('h1', (e) => e.textContent), '전승 레인저')
    assert.equal(
      await page.evaluate(() => document.querySelectorAll('a button, button button').length),
      0,
    )
    assert.deepEqual(
      await page.evaluate(() =>
        [...document.querySelectorAll('.guide-reader a[href^="#"]')]
          .filter((a) => !document.getElementById(decodeURIComponent(a.hash.slice(1))))
          .map((a) => a.hash),
      ),
      [],
      'all in-page links resolve',
    )
    fs.mkdirSync('artifacts', { recursive: true })
    await page.screenshot({ path: 'artifacts/ranger-desktop.png' })
    assert.equal((await page.$$('.guide-clip')).length, 4)
    await page.$eval('.guide-clip', (e) => e.scrollIntoView({ block: 'center' }))
    await page.screenshot({ path: 'artifacts/ranger-clips-desktop.png' })
    await page.type('.guide-toc input', '단명')
    assert.equal((await page.$$('.guide-toc nav a')).length, 1)
    await page.click('.guide-toc nav a')
    assert.equal(new URL(page.url()).hash, '#ranger-combos-8')
    await page.$eval('#combos', (e) => e.scrollIntoView())
    await page.screenshot({ path: 'artifacts/ranger-combos.png' })
    await page.click('.reader-portrait .guide-image-button')
    await page.waitForFunction(
      () => document.querySelector('.guide-image-dialog[open] img')?.naturalWidth > 0,
    )
    assert.equal(
      await page.evaluate(
        () => [...document.querySelectorAll('.guide-image-dialog')].filter((d) => d.open).length,
      ),
      1,
    )
    await page.click('dialog[open] [aria-label="확대"]')
    assert.equal(await page.$eval('dialog[open] output', (e) => e.textContent), '125%')
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.querySelector('dialog[open]'))
    assert.equal(await page.evaluate(() => document.body.style.overflow), '')
    await page.click('.video-launch')
    assert.equal((await page.$$('iframe')).length, 1)
    for (const width of [320, 390, 768, 1920]) {
      await page.setViewport({ width, height: 900 })
      await page.goto(origin + '/tip-board/15', { waitUntil: 'networkidle0' })
      await checkAuthorCover()
      assert(
        await page.$$eval('.guide-clip', (cards) =>
          cards.every((card) => card.getBoundingClientRect().height < 160),
        ),
        `clips must stay compact at ${width}px`,
      )
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `overflow at ${width}`,
      )
      if (width === 390) {
        await page.screenshot({ path: 'artifacts/ranger-mobile.png' })
        await page.$eval('.guide-clip', (e) => e.scrollIntoView({ block: 'center' }))
        await page.waitForFunction(() =>
          [...document.querySelectorAll('.guide-clip img')]
            .slice(0, 2)
            .every((img) => img.naturalWidth > 0),
        )
        await page.screenshot({ path: 'artifacts/ranger-clips-mobile.png' })
        await page.click('.guide-mobile-toc summary')
        await page.type('.guide-mobile-toc input', '특화')
        await page.click('.guide-mobile-toc nav a')
        assert.equal(new URL(page.url()).hash, '#builds')
        assert.equal(await page.$eval('.guide-mobile-toc', (e) => e.open), false)
        await page.screenshot({ path: 'artifacts/ranger-builds-mobile.png' })
      }
    }
    for (const width of [320, 390, 1440]) {
      await page.setViewport({ width, height: 1000 })
      await page.goto(origin + '/tip-board', { waitUntil: 'networkidle0' })
      assert.equal((await page.$$('.guide-card-author')).length, 14)
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `guide cards overflow at ${width}`,
      )
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.guide-card-art img')]
          .slice(0, 4)
          .every((img) => img.naturalWidth > 0),
      )
      if (width === 1440) await page.screenshot({ path: 'artifacts/guide-authors-desktop.png' })
      if (width === 390) await page.screenshot({ path: 'artifacts/guide-authors-mobile.png' })
    }
    await page.type('input[aria-label="공략 검색"]', 'iframe')
    assert.equal((await page.$$('.guide-card')).length, 1)
    assert((await page.$eval('.guide-card', (e) => e.textContent)).includes('Ctrl 길드'))
    assert((await page.$eval('.guide-card', (e) => e.textContent)).includes('다크나이트 랭킹 1위'))
    assert.deepEqual(errors, [])
    assert(
      !serverErrors.includes('ERR_INVALID_CHAR'),
      'image preload headers must be safely encoded',
    )
    console.log(
      'PASS: Ranger sections, subsection search, anchors, lazy videos, accessible image zoom/Escape, mobile menu and responsive widths.',
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
