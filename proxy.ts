import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  // Legacy routes include unauthenticated writes and external scrapers. Retired as a unit.
  const activeApis = ['/api/session', '/api/v2/admin', '/api/v2/admin/history', '/api/v2/health']
  if (path.startsWith('/api/') && !activeApis.includes(path)) {
    return NextResponse.json(
      { error: '이전 API는 서비스 재구축으로 종료되었습니다.', code: 'LEGACY_API_RETIRED' },
      { status: 410, headers: { 'Cache-Control': 'no-store' } },
    )
  }
  if (request.headers.has('next-action'))
    return NextResponse.json({ error: '이전 서버 작업은 종료되었습니다.' }, { status: 410 })
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  if (path.startsWith('/admin') || path.startsWith('/api/'))
    response.headers.set('Cache-Control', 'no-store')
  return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
