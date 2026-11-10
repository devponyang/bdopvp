import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import {
  SESSION_COOKIE,
  cookieOptions,
  sessionConfigured,
  signSession,
  trustedOrigin,
} from '@/lib/portal/session'
import { readLimitedJson } from '@/lib/portal/request'

// Per-process backstop. A shared edge rate limit is required for public deployment.
const attempts = new Map<string, { count: number; until: number }>()
export async function POST(request: NextRequest) {
  if (!trustedOrigin(request))
    return NextResponse.json({ error: '요청 출처를 확인할 수 없습니다.' }, { status: 403 })
  if (!sessionConfigured() || !process.env.ADMIN_PASSWORD_HASH)
    return NextResponse.json({ error: '관리자 계정이 아직 설정되지 않았습니다.' }, { status: 503 })
  const now = Date.now()
  for (const [key, value] of attempts) if (value.until < now) attempts.delete(key)
  // Only trust an IP header when the deployment proxy is configured to overwrite it.
  const key = 'admin-login'
  const record = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 }
  if (record.count >= 10)
    return NextResponse.json(
      { error: '로그인 시도가 많습니다. 15분 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((record.until - now) / 1000)) } },
    )
  record.count++
  attempts.set(key, record)
  try {
    const body = z
      .object({ password: z.string().min(1).max(256) })
      .parse(await readLimitedJson(request, 2048))
    if (!(await compare(body.password, process.env.ADMIN_PASSWORD_HASH)))
      return NextResponse.json({ error: '비밀번호를 확인해 주세요.' }, { status: 401 })
    const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
    response.cookies.set(SESSION_COOKIE, signSession(), cookieOptions)
    response.cookies.set('isAdmin', '', { path: '/', maxAge: 0 })
    return response
  } catch {
    return NextResponse.json({ error: '로그인 요청을 처리할 수 없습니다.' }, { status: 400 })
  }
}
export async function DELETE(request: NextRequest) {
  if (!trustedOrigin(request))
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 })
  return response
}
