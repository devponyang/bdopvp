import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { allianceName } = await req.json()

  if (!allianceName) {
    return NextResponse.json({ error: 'Missing alliance name' }, { status: 400 })
  }

  const client = await db.connect()
  try {
    // 연맹을 비활성화 (삭제하지 않음)
    await client.query(
      'UPDATE alliances SET is_active = FALSE WHERE name = $1',
      [allianceName]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DEACTIVATE ALLIANCE ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
}
