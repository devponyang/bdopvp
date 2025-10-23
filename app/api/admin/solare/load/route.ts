import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  
  const client = await db.connect()
  try {
    // 날짜별 데이터 조회 (히스토리 테이블에서)
    const overallRes = await client.query(`
      SELECT name, classtype as subclass, class, wins, draws, lose as losses, score
      FROM solare_overall_league_history
      WHERE snapshot_date = $1
      ORDER BY score DESC
      LIMIT 100
    `, [date])

    const classRes = await client.query(`
      SELECT name, classtype as subclass, class, wins, draws, lose as losses, score
      FROM solare_class_league_history
      WHERE snapshot_date = $1
      ORDER BY class ASC, score DESC
    `, [date])

    const classData: Record<string, any[]> = {}
    for (const row of classRes.rows) {
      const cls = row.class
      if (!classData[cls]) classData[cls] = []
      classData[cls].push(row)
    }

    return NextResponse.json({
      overall: overallRes.rows || [],
      classData: classData || {},
    })
  } catch (err) {
    console.error('🚨 solare load 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
