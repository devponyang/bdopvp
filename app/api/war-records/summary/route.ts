// ✅ 수정 완료: 중복 row 방지 위해 DISTINCT로 집계

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const revalidate = 300 // 5분 캐시

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tierFilter = searchParams.get('tier')
  const period = searchParams.get('period') || 'weekly'
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  try {
    const client = await db.connect()
    try {
      if (!tierFilter) {
        return NextResponse.json([])
      }

      // tier에 해당하는 지역 목록 가져오기 (날짜별로 다르게 처리)
      // 6월 25일 이전과 이후의 모든 가능한 지역을 포함
      const allRegions = ['칼페온', '메디아', '발렌시아', '발레노스', '세렌디아', '카마실비아']

      // 기간에 따른 쿼리 구성
      let dateFilter = ''
      if (start && end) {
        dateFilter = `w.war_date >= '${start}' AND w.war_date <= '${end}'`
      } else {
        switch (period) {
          case 'monthly':
            dateFilter = 'w.war_date >= CURRENT_DATE - INTERVAL \'1 month\''
            break
          case 'yearly':
            dateFilter = 'w.war_date >= CURRENT_DATE - INTERVAL \'1 year\''
            break
          default:
            dateFilter = 'w.war_date >= CURRENT_DATE - INTERVAL \'6 days\''
        }
      }

      const query = `
        WITH filtered_records AS (
          SELECT DISTINCT w.id, w.alliance_id, w.result, w.region, w.war_date
          FROM war_records w
          JOIN alliances a ON w.alliance_id = a.id
          WHERE ${dateFilter}
            AND w.region = ANY($1)
            AND w.war_type = '거점전'
            AND a.is_active = TRUE
        ),
        records_with_tier AS (
          SELECT fr.*, 
            CASE 
              WHEN fr.war_date < '2025-06-25' THEN
                CASE fr.region
                  WHEN '칼페온' THEN '무제한'
                  WHEN '메디아' THEN '2단'
                  WHEN '발렌시아' THEN '1단'
                  ELSE NULL
                END
              ELSE
                CASE fr.region
                  WHEN '발레노스' THEN '1단'
                  WHEN '세렌디아' THEN '1단'
                  WHEN '메디아' THEN '2단'
                  WHEN '발렌시아' THEN '2단'
                  WHEN '칼페온' THEN '무제한'
                  WHEN '카마실비아' THEN '무제한'
                  ELSE NULL
                END
            END as calculated_tier
          FROM filtered_records fr
        )
        SELECT
          a.name AS alliance_name,
          COUNT(DISTINCT rwt.id) FILTER (WHERE rwt.result = '점령성공') AS count,
          COUNT(DISTINCT rwt.id) AS participated
        FROM records_with_tier rwt
        JOIN alliances a ON rwt.alliance_id = a.id
        WHERE rwt.calculated_tier = $2
        GROUP BY a.id, a.name
        ORDER BY count DESC
      `

      // 쿼리 실행
      const result = await client.query(query, [allRegions, tierFilter])

      const filteredRecords = result.rows.map(r => ({
        alliance_name: r.alliance_name,
        count: Number(r.count),
        participated: Number(r.participated),
      }))

      const response = NextResponse.json(filteredRecords)
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
      return response
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('DB Error:', error)
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 })
  }
}