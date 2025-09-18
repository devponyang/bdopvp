import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT * FROM solare_seasons 
      ORDER BY season_number DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('시즌 목록 조회 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { seasonName, seasonNumber, startDate, description } = await req.json()
  const client = await db.connect()

  try {
    await client.query('BEGIN')
    
    // 기존 활성 시즌 비활성화
    await client.query('UPDATE solare_seasons SET is_active = FALSE WHERE is_active = TRUE')
    
    // 새 시즌 생성
    const result = await client.query(`
      INSERT INTO solare_seasons (season_name, season_number, start_date, is_active, description)
      VALUES ($1, $2, $3, TRUE, $4)
      RETURNING *
    `, [seasonName, seasonNumber, startDate, description])
    
    await client.query('COMMIT')
    return NextResponse.json(result.rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('시즌 생성 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
