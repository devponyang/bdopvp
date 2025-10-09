import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guildName = searchParams.get('guild_name')

    if (guildName) {
      // 특정 길드의 길드마크 조회
      const result = await db.query('SELECT * FROM guild_marks WHERE guild_name = $1', [guildName])
      return NextResponse.json(result.rows[0] || null)
    } else {
      // 모든 길드마크 조회
      const result = await db.query('SELECT * FROM guild_marks ORDER BY created_at DESC')
      return NextResponse.json(result.rows)
    }
  } catch (error) {
    console.error('길드마크 조회 오류:', error)
    return NextResponse.json({ error: '길드마크를 불러올 수 없습니다.' }, { status: 500 })
  }
}











































