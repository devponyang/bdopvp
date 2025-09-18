import { NextResponse } from 'next/server'
import { db } from 'lib/db'

export const revalidate = 300 // 5분 캐시

export async function GET() {
  try {
    const client = await db.connect()
    
    try {
      // 길드 수 조회 - 실제 guilds 테이블에서 (삭제되지 않은 것만)
      const guildResult = await client.query('SELECT COUNT(*) as count FROM guilds WHERE is_deleted = FALSE')
      const totalGuilds = parseInt(guildResult.rows[0].count)

      // 쿠폰 수 조회 (실제 데이터)
      const couponResult = await client.query('SELECT COUNT(*) as count FROM coupons')
      const totalCoupons = parseInt(couponResult.rows[0].count)


      // 검색 통계 (실제 데이터)
      let searchStats = {
        totalSearches: 0,
        popularQueries: [] as Array<{ query: string; count: number }>,
        recentSearches: [] as string[]
      }

      try {
        // 총 검색 수
        const totalSearchResult = await client.query('SELECT COUNT(*) as count FROM search_logs')
        searchStats.totalSearches = parseInt(totalSearchResult.rows[0].count)

        // 인기 검색어 (상위 10개)
        const popularResult = await client.query(`
          SELECT query, COUNT(*) as count 
          FROM search_logs 
          GROUP BY query 
          ORDER BY count DESC 
          LIMIT 10
        `)
        searchStats.popularQueries = popularResult.rows.map(row => ({
          query: row.query,
          count: parseInt(row.count)
        }))

        // 최근 검색어 (최근 10개)
        const recentResult = await client.query(`
          SELECT DISTINCT query, MAX(created_at) as latest_search
          FROM search_logs 
          GROUP BY query
          ORDER BY latest_search DESC 
          LIMIT 10
        `)
        searchStats.recentSearches = recentResult.rows.map(row => row.query)

      } catch (searchError) {
        console.error('Failed to fetch search stats:', searchError)
        // 검색 통계 실패 시 기본값 사용
        searchStats = {
          totalSearches: 0,
          popularQueries: [],
          recentSearches: []
        }
      }

      return NextResponse.json({
        totalGuilds,
        totalCoupons,
        searchStats
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
