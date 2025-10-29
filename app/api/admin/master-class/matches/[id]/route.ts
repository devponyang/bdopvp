import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params
  const client = await db.connect()

  try {
    const result = await client.query(`
      DELETE FROM master_class_matches 
      WHERE id = $1
      RETURNING *
    `, [id])
    
    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error('매칭 삭제 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

