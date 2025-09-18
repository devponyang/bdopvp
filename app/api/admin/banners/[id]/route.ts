import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/validation'

// 개별 배너 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await db.connect()
    
    try {
      const result = await client.query(`
        SELECT id, title, description, image_url, link_url, button_text, is_active, priority, created_at, updated_at
        FROM banners 
        WHERE id = $1
      `, [id])
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: '배너를 찾을 수 없습니다' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch banner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    )
  }
}

// 배너 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(req)
    if (authError) return authError

    const { id } = await params
    const body = await req.json()
    const { title, description, image_url, link_url, button_text, is_active, priority } = body

    const client = await db.connect()
    
    try {
      // 업데이트할 필드들만 동적으로 구성
      const updateFields = []
      const values = []
      let paramIndex = 1

      if (title !== undefined) {
        updateFields.push(`title = $${paramIndex}`)
        values.push(sanitizeString(title))
        paramIndex++
      }
      if (description !== undefined) {
        updateFields.push(`description = $${paramIndex}`)
        values.push(sanitizeString(description))
        paramIndex++
      }
      if (image_url !== undefined) {
        updateFields.push(`image_url = $${paramIndex}`)
        values.push(sanitizeString(image_url))
        paramIndex++
      }
      if (link_url !== undefined) {
        updateFields.push(`link_url = $${paramIndex}`)
        values.push(sanitizeString(link_url))
        paramIndex++
      }
      if (button_text !== undefined) {
        updateFields.push(`button_text = $${paramIndex}`)
        values.push(sanitizeString(button_text))
        paramIndex++
      }
      if (is_active !== undefined) {
        updateFields.push(`is_active = $${paramIndex}`)
        values.push(is_active === true)
        paramIndex++
      }
      if (priority !== undefined) {
        updateFields.push(`priority = $${paramIndex}`)
        values.push(priority)
        paramIndex++
      }

      if (updateFields.length === 0) {
        return NextResponse.json(
          { error: '수정할 필드가 없습니다' },
          { status: 400 }
        )
      }

      // updated_at 추가
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
      
      values.push(id)

      const result = await client.query(`
        UPDATE banners 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values)

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: '배너를 찾을 수 없습니다' },
          { status: 404 }
        )
      }

      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to update banner:', error)
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    )
  }
}

// 배너 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(req)
    if (authError) return authError

    const { id } = await params
    const client = await db.connect()
    
    try {
      const result = await client.query(`
        DELETE FROM banners 
        WHERE id = $1
        RETURNING id
      `, [id])

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: '배너를 찾을 수 없습니다' },
          { status: 404 }
        )
      }

      return NextResponse.json({ message: '배너가 삭제되었습니다' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to delete banner:', error)
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    )
  }
}

