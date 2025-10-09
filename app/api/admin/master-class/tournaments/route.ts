import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT * FROM master_class_tournaments 
      ORDER BY tournament_year DESC, created_at DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('마스터 클래스 대회 목록 조회 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { 
    tournamentName, 
    tournamentYear, 
    startDate, 
    endDate, 
    registrationStartDate, 
    registrationEndDate, 
    description, 
    requirements 
  } = await req.json()
  
  const client = await db.connect()

  try {
    await client.query('BEGIN')
    
    // 기존 활성 대회 비활성화
    await client.query('UPDATE master_class_tournaments SET is_active = FALSE WHERE is_active = TRUE')
    
    // 새 대회 생성
    const result = await client.query(`
      INSERT INTO master_class_tournaments (
        tournament_name, tournament_year, start_date, end_date, 
        registration_start_date, registration_end_date, is_active, 
        description, requirements
      )
      VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7, $8)
      RETURNING *
    `, [
      tournamentName, tournamentYear, startDate, endDate, 
      registrationStartDate, registrationEndDate, description, requirements
    ])
    
    await client.query('COMMIT')
    return NextResponse.json(result.rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('마스터 클래스 대회 생성 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
