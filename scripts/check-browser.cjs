const puppeteer = require('puppeteer')
const fs = require('node:fs')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { randomBytes } = require('node:crypto')
const { hashSync } = require('bcryptjs')
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3101'
async function main() {
  fs.mkdirSync('artifacts', { recursive: true })
  const password = randomBytes(24).toString('hex')
  const server = process.env.TEST_ORIGIN
    ? null
    : spawn(
        process.execPath,
        ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3101'],
        {
          windowsHide: true,
          stdio: 'ignore',
          env: {
            ...process.env,
            DB_ENABLED: 'false',
            SITE_ORIGIN: origin,
            SESSION_SECRET: randomBytes(48).toString('hex'),
            ADMIN_PASSWORD_HASH: hashSync(password, 10),
          },
        },
      )
  let browser
  try {
    const deadline = Date.now() + 30000
    while (true) {
      try {
        const response = await fetch(origin + '/api/v2/health')
        if (response.ok) break
      } catch {}
      if (Date.now() > deadline) throw new Error('Preview server did not become ready')
      await new Promise((r) => setTimeout(r, 500))
    }
    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setCacheEnabled(false)
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    // External embeds are not part of this offline application check.
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const url = req.url()
      if (url.startsWith(origin) || url.startsWith('data:') || url.startsWith('blob:'))
        req.continue()
      else req.abort()
    })
    if (process.argv[2] === '--debug') {
      await page.setViewport({
        width: Number(process.argv[4]) || 390,
        height: 844,
        deviceScaleFactor: 1,
      })
      await page.goto(origin + encodeURI(process.argv[3] || '/'), { waitUntil: 'networkidle0' })
      await page.screenshot({ path: 'artifacts/layout-debug.png', fullPage: true })
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
      )
      if (await page.$('select[aria-label="클래스 선택"]')) {
        assert(
          await page.$eval(
            'select[aria-label="클래스 선택"]',
            (e) => e.getBoundingClientRect().width >= 120,
          ),
          'class filter must remain readable',
        )
      }
      console.log(
        await page.evaluate(() =>
          [...document.querySelectorAll('body *')]
            .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
            .map((e) => ({
              tag: e.tagName,
              cls: e.className,
              width: e.getBoundingClientRect().width,
              text: e.textContent?.slice(0, 80),
            }))
            .slice(0, 15),
        ),
      )
      return
    }
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 })
    await page.goto(origin, { waitUntil: 'networkidle0' })
    assert(await page.$('.hero h1'))
    await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true })
    await page.type('.hero-search input', '매구')
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('.hero-search button'),
    ])
    assert.equal(new URL(page.url()).searchParams.get('q'), '매구')
    assert.equal((await page.$$('.content-card')).length, 2)
    for (const width of [320, 768, 1024, 1920]) {
      await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 })
      for (const path of ['/', '/tip-board', '/solare-league', '/search?q=매구']) {
        await page.goto(origin + encodeURI(path), { waitUntil: 'networkidle0' })
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
          false,
          `responsive overflow ${width}px ${path}`,
        )
      }
    }
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 })
    const paths = [
      '/solare-league',
      '/guild-league/1',
      '/war-records/summary',
      '/war-records/history',
      '/tip-board',
      '/guild-recruit',
      '/Tournament',
      '/statistics',
      '/site-info',
      '/support',
      '/agreement',
      '/privacy',
      '/guild/검증용길드',
      '/alliance/검증용연맹',
      '/family/검증용가문',
      '/guild-recruit/new',
      '/Tournament/apply',
      '/admin/login',
    ]
    for (const path of paths) {
      const res = await page.goto(origin + encodeURI(path), { waitUntil: 'networkidle0' })
      assert.equal(res.status(), 200, path)
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `desktop overflow ${path}`,
      )
    }
    await page.goto(origin + '/tip-board', { waitUntil: 'networkidle0' })
    assert.equal((await page.$$('.guide-card')).length, 14)
    await page.type('input[aria-label="공략 검색"]', '매구')
    await page.waitForFunction(() => document.querySelectorAll('.guide-card').length === 2)
    await page.screenshot({ path: 'artifacts/guides-desktop.png', fullPage: true })
    await page.goto(origin + '/search?q=' + encodeURIComponent('매구'), {
      waitUntil: 'networkidle0',
    })
    assert.equal((await page.$$('.content-card')).length, 2)
    await page.goto(origin + '/tip-board/12', { waitUntil: 'networkidle0' })
    assert((await page.$eval('body', (e) => e.textContent)).includes('각성 매구'))
    await page.screenshot({ path: 'artifacts/guide-desktop.png', fullPage: false })
    await page.setCookie({ name: 'isAdmin', value: 'true', url: origin })
    await page.goto(origin + '/admin/dashboard', { waitUntil: 'networkidle0' })
    assert(page.url().endsWith('/admin/login'), 'legacy cookie must not grant access')
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    for (const path of ['/', ...paths, '/tip-board/12']) {
      await page.goto(origin + encodeURI(path), { waitUntil: 'networkidle0' })
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `mobile overflow ${path}`,
      )
    }
    await page.goto(origin, { waitUntil: 'networkidle0' })
    await page.screenshot({ path: 'artifacts/home-mobile.png', fullPage: true })
    await page.click('[aria-label="메뉴 열기"]')
    assert(await page.$eval('dialog', (d) => d.open), 'mobile menu open')
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.querySelector('dialog').open)
    await page.click('[aria-label="메뉴 열기"]')
    await page.click('dialog a[href="/solare-league"]')
    await page.waitForFunction(
      () => location.pathname === '/solare-league' && !document.querySelector('dialog').open,
    )
    await page.waitForSelector('.page-heading h1')
    await page.screenshot({ path: 'artifacts/ranking-mobile.png', fullPage: true })
    await page
      .goto(origin + '/missing-page', { waitUntil: 'networkidle0' })
      .then((r) => assert.equal(r.status(), 404))
    assert.deepEqual(errors, [])
    for (const method of ['GET', 'POST', 'PUT', 'DELETE'])
      assert.equal((await fetch(origin + '/api/admin/solare/save-all', { method })).status, 410)
    assert.equal((await fetch(origin + '/api/v2/admin')).status, 401)
    assert.equal((await fetch(origin + '/api/v2/admin', { method: 'PUT', body: '{}' })).status, 401)
    assert.equal(
      (
        await fetch(origin + '/api/session', {
          method: 'POST',
          headers: { Origin: 'https://invalid.example' },
          body: '{}',
        })
      ).status,
      403,
    )
    assert.equal(
      (
        await fetch(origin + '/', {
          method: 'POST',
          headers: { 'Next-Action': 'legacy' },
          body: '{}',
        })
      ).status,
      410,
    )
    if (server) {
      const login = await fetch(origin + '/api/session', {
        method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      assert.equal(login.status, 200)
      const rawCookie = login.headers.getSetCookie().find((c) => c.startsWith('ponyang_session='))
      assert(rawCookie.includes('HttpOnly'))
      assert(rawCookie.includes('Secure'))
      assert(rawCookie.toLowerCase().includes('samesite=strict'))
      const cookie = rawCookie.split(';')[0]
      const state = await fetch(origin + '/api/v2/admin', { headers: { Cookie: cookie } })
      assert.equal(state.status, 200)
      assert.equal((await state.json()).status, 'offline')
      assert.equal(
        (
          await fetch(origin + '/api/v2/admin', {
            method: 'PUT',
            headers: { Origin: origin, Cookie: cookie },
            body: '{}',
          })
        ).status,
        503,
      )
      assert.equal(
        (
          await fetch(origin + '/api/v2/admin', {
            method: 'PUT',
            headers: { Origin: 'https://invalid.example', Cookie: cookie },
            body: '{}',
          })
        ).status,
        403,
      )
      await page.setCookie({
        name: 'ponyang_session',
        value: cookie.slice('ponyang_session='.length),
        url: origin,
        httpOnly: true,
      })
      await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 })
      await page.goto(origin + '/admin/dashboard', { waitUntil: 'networkidle0' })
      assert(page.url().endsWith('/admin/dashboard'))
      await page.type('input[type="text"][required]', '검증용 모험가')
      await page.click('form .admin-actions button')
      await page.waitForFunction(() =>
        document.querySelector('.data-table')?.textContent.includes('검증용 모험가'),
      )
      await page.screenshot({ path: 'artifacts/admin-desktop.png', fullPage: true })
      const logout = await fetch(origin + '/api/session', {
        method: 'DELETE',
        headers: { Origin: origin, Cookie: cookie },
      })
      assert.equal(logout.status, 200)
      assert(logout.headers.get('set-cookie').includes('Max-Age=0'))
    }
    console.log(
      'PASS: desktop/mobile routes, no overflow, archived guides, search/filter, dialog/Escape/navigation, no runtime errors, legacy cookie rejection and API access guards.',
    )
    console.log(
      'PASS: configured login, secure session cookie, authenticated offline editing, database-off write rejection, CSRF rejection and logout.',
    )
  } finally {
    if (browser) await browser.close()
    if (server) server.kill()
  }
}
main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
