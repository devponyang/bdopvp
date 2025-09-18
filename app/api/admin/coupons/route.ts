import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdminAuth } from 'lib/auth'
import { sanitizeString } from 'lib/validation'

export async function GET(req: NextRequest) {
  // 어드민 인증 확인
  const authError = requireAdminAuth(req)
  if (authError) return authError

  try {
    const client = await db.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          id,
          code,
          title,
          description,
          start_date,
          end_date
        FROM coupons
        ORDER BY end_date DESC
      `)

      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch coupons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  // 어드민 인증 확인
  const authError = requireAdminAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { code, title, description, start_date, end_date } = body

    // 입력 검증
    if (!code || !title || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 입력 값 정화
    const sanitizedCode = sanitizeString(code)
    const sanitizedTitle = sanitizeString(title)
    const sanitizedDescription = description ? sanitizeString(description) : ''

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    const client = await db.connect()
    
    try {
      const result = await client.query(
        `
        INSERT INTO coupons (code, title, description, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [sanitizedCode, sanitizedTitle, sanitizedDescription, start_date, end_date]
      )

      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to create coupon:', error)
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    )
  }
} 