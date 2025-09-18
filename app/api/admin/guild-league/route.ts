// app/api/admin/guild-league/route.ts
'use server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from 'lib/db'
import { requireAdminAuth } from 'lib/auth'
import { sanitizeString } from 'lib/validation'

export async function GET(req: NextRequest) {
  // 어드민 인증 확인
  const authError = requireAdminAuth(req)
  if (authError) return authError

  try {
    const date = req.nextUrl.searchParams.get('date')
    
    // 날짜 입력 검증
    if (date) {
      const sanitizedDate = sanitizeString(date)
      // 날짜 형식 검증 (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(sanitizedDate)) {
        return NextResponse.json(
          { error: 'Invalid date format' }, 
          { status: 400 }
        )
      }
    }

    const now = new Date()
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    const todayStr = kstNow.toISOString().split('T')[0]

    if (date) {
      if (date === todayStr) {
        // 오늘 날짜면 현재 테이블에서 조회
        const { rows } = await db.query('SELECT * FROM guild_league ORDER BY rank ASC')
        return NextResponse.json(rows)
      } else {
        // 과거 날짜면 히스토리 테이블에서 조회 (wins, losses, score 포함)
        const { rows } = await db.query(
          `SELECT guild_name, rank, wins, losses, score
           FROM guild_league_history
           WHERE snapshot_date = $1::date
           ORDER BY rank ASC`,
          [date]
        )
        return NextResponse.json(rows)
      }
    } else {
      // 기본: 현재 테이블
      const { rows } = await db.query('SELECT * FROM guild_league ORDER BY rank ASC')
      return NextResponse.json(rows)
    }
  } catch (error) {
    console.error('Guild league API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
