import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SESSION_COOKIE, verifySession } from '@/lib/portal/session'
import { portalSchema } from '@/lib/portal/schema'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  if (!verifySession(request.cookies.get(SESSION_COOKIE)?.value))
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  if (process.env.DB_ENABLED !== 'true')
    return NextResponse.json({ items: [] }, { headers: { 'Cache-Control': 'no-store' } })
  const id = request.nextUrl.searchParams.get('id')
  if (id && !/^\d{1,18}$/.test(id))
    return NextResponse.json({ error: '잘못된 이력 ID입니다.' }, { status: 400 })
  try {
    if (id) {
      const result = await db.query('SELECT payload FROM portal_snapshot_history WHERE id=$1', [id])
      if (!result.rows[0])
        return NextResponse.json({ error: '이력을 찾을 수 없습니다.' }, { status: 404 })
      return NextResponse.json(portalSchema.parse(result.rows[0].payload), {
        headers: { 'Cache-Control': 'no-store' },
      })
    }
    const result = await db.query(
      'SELECT id::text,revision::text,published_at,archived_at FROM portal_snapshot_history ORDER BY archived_at DESC,id DESC LIMIT 20',
    )
    return NextResponse.json({ items: result.rows }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: '게시 이력을 불러오지 못했습니다.' }, { status: 503 })
  }
}
