import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// 연맹마크 목록 조회
export async function GET() {
  const client = await db.connect()
  
  try {
    const result = await client.query(`
      SELECT id, alliance_name, mark_url, created_at, updated_at
      FROM alliance_marks
      ORDER BY created_at DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching alliance marks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alliance marks' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// 연맹마크 추가
export async function POST(req: Request) {
  const { alliance_name, mark_url } = await req.json()
  
  if (!alliance_name || !mark_url) {
    return NextResponse.json(
      { error: 'Alliance name and mark URL are required' },
      { status: 400 }
    )
  }
  
  const client = await db.connect()
  
  try {
    const result = await client.query(
      `INSERT INTO alliance_marks (alliance_name, mark_url) 
       VALUES ($1, $2) 
       RETURNING id, alliance_name, mark_url, created_at, updated_at`,
      [alliance_name, mark_url]
    )
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error adding alliance mark:', error)
    return NextResponse.json(
      { error: 'Failed to add alliance mark' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}




















