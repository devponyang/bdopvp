import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// 연맹마크 수정
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { mark_url } = await req.json()
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  
  if (!mark_url) {
    return NextResponse.json(
      { error: 'Mark URL is required' },
      { status: 400 }
    )
  }
  
  const client = await db.connect()
  
  try {
    const result = await client.query(
      `UPDATE alliance_marks 
       SET mark_url = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, alliance_name, mark_url, created_at, updated_at`,
      [mark_url, id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Alliance mark not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating alliance mark:', error)
    return NextResponse.json(
      { error: 'Failed to update alliance mark' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// 연맹마크 삭제
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  const client = await db.connect()
  
  try {
    const result = await client.query(
      'DELETE FROM alliance_marks WHERE id = $1 RETURNING id',
      [id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Alliance mark not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting alliance mark:', error)
    return NextResponse.json(
      { error: 'Failed to delete alliance mark' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
