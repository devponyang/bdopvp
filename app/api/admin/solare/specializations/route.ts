import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// 특화 정보 목록 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const playerName = searchParams.get('player')
  const className = searchParams.get('class')

  const client = await db.connect()
  try {
    let query = 'SELECT * FROM solare_specializations'
    const params: any[] = []
    const conditions: string[] = []

    if (playerName) {
      conditions.push('player_name ILIKE $' + (params.length + 1))
      params.push(`%${playerName}%`)
    }

    if (className) {
      conditions.push('class = $' + (params.length + 1))
      params.push(className)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY updated_at DESC'

    const result = await client.query(query, params)
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('특화 정보 조회 오류:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    client.release()
  }
}

// 특화 정보 저장/업데이트
export async function POST(req: NextRequest) {
  try {
    const { playerName, className, specializationImageUrl, description } = await req.json()

    if (!playerName || !className) {
      return NextResponse.json({ error: '플레이어명과 클래스는 필수입니다.' }, { status: 400 })
    }

    const client = await db.connect()
    try {
      // UPSERT (INSERT OR UPDATE)
      const result = await client.query(`
        INSERT INTO solare_specializations (player_name, class, specialization_image_url, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (player_name, class)
        DO UPDATE SET 
          specialization_image_url = EXCLUDED.specialization_image_url,
          description = EXCLUDED.description,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `, [playerName, className, specializationImageUrl || null, description || null])

      return NextResponse.json(result.rows[0])
    } catch (err) {
      console.error('특화 정보 저장 오류:', err)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('요청 파싱 오류:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}




































