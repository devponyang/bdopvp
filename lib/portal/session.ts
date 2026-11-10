import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'
import type { NextRequest } from 'next/server'

export const SESSION_COOKIE = 'ponyang_session'
const lifetime = 60 * 60 * 4
export function sessionConfigured() {
  return (process.env.SESSION_SECRET?.length || 0) >= 32
}
export function signSession() {
  if (!sessionConfigured()) throw new Error('Session secret is not configured')
  const payload = `${Math.floor(Date.now() / 1000) + lifetime}.${randomBytes(24).toString('hex')}`
  return `${payload}.${createHmac('sha256', process.env.SESSION_SECRET!).update(payload).digest('hex')}`
}
export function verifySession(token?: string) {
  if (!sessionConfigured() || !token || token.length > 200) return false
  const [expires, nonce, signature, ...rest] = token.split('.')
  if (
    rest.length ||
    !/^\d+$/.test(expires) ||
    !/^[a-f0-9]{48}$/.test(nonce || '') ||
    !/^[a-f0-9]{64}$/.test(signature || '')
  )
    return false
  const expiry = Number(expires)
  const now = Math.floor(Date.now() / 1000)
  if (expiry <= now || expiry > now + lifetime) return false
  const expected = createHmac('sha256', process.env.SESSION_SECRET!)
    .update(`${expires}.${nonce}`)
    .digest()
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'))
}
export function trustedOrigin(request: NextRequest) {
  const expected = process.env.SITE_ORIGIN || request.nextUrl.origin
  return request.headers.get('origin') === expected
}
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: lifetime,
}
