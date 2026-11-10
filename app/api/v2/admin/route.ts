import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SESSION_COOKIE, trustedOrigin, verifySession } from '@/lib/portal/session'
import { portalSchema } from '@/lib/portal/schema'
import { readPortal } from '@/lib/portal/data'
import { revalidateTag } from 'next/cache'
import { readLimitedJson } from '@/lib/portal/request'
import { publishSnapshot, PublishConflict } from '@/lib/portal/publish'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  if (!verifySession(request.cookies.get(SESSION_COOKIE)?.value))
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  return NextResponse.json(await readPortal(), { headers: { 'Cache-Control': 'no-store' } })
}
export async function PUT(request: NextRequest) {
  if (!verifySession(request.cookies.get(SESSION_COOKIE)?.value))
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  if (!trustedOrigin(request))
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
  if (process.env.DB_ENABLED !== 'true')
    return NextResponse.json({ error: 'DB 연결을 설정한 후 게시할 수 있습니다.' }, { status: 503 })
  const match = request.headers.get('if-match')?.match(/^"(none|\d+)"$/)
  if (!match)
    return NextResponse.json(
      { error: '최신 데이터 버전이 필요합니다. 다시 불러와 주세요.' },
      { status: 428 },
    )
  let input: unknown
  try {
    input = await readLimitedJson(request, 1024 * 1024)
  } catch {
    return NextResponse.json(
      { error: 'JSON 형식을 확인하세요. 최대 크기는 1MB입니다.' },
      { status: 400 },
    )
  }
  const parsed = portalSchema.safeParse(input)
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n') },
      { status: 400 },
    )
  const client = await db.connect().catch(() => null)
  if (!client) return NextResponse.json({ error: 'DB에 연결할 수 없습니다.' }, { status: 503 })
  try {
    const published = await publishSnapshot(
      client,
      parsed.data,
      match[1] === 'none' ? null : match[1],
    )
    // Publication is already committed. A cache failure must not report a failed write.
    try {
      revalidateTag('portal-v2', { expire: 0 })
    } catch {
      console.error('Portal cache invalidation failed; public data expires within 30 seconds.')
    }
    return NextResponse.json(
      { ok: true, ...published },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof PublishConflict)
      return NextResponse.json({ error: error.message }, { status: 409 })
    return NextResponse.json(
      { error: '게시하지 못했습니다. 마이그레이션과 DB 연결을 확인하세요.' },
      { status: 503 },
    )
  } finally {
    client.release()
  }
}
