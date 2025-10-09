import { NextResponse } from 'next/server'
import { db } from 'lib/db'
import { filterProfanity, filterProfanityStrings } from 'lib/profanity-filter'

export const revalidate = 0 // 캐시 비활성화 (개발 중)

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

        // 인기 검색어 (실제 길드/연맹과 매칭되는 검색어만)
        const popularResult = await client.query(`
          SELECT sl.query, COUNT(*) as count 
          FROM search_logs sl
          WHERE EXISTS (
            SELECT 1 FROM guilds g 
            WHERE g.name = sl.query AND g.is_deleted = FALSE
          ) OR EXISTS (
            SELECT 1 FROM alliances a 
            WHERE a.name = sl.query AND a.is_active = TRUE
          )
          GROUP BY sl.query 
          ORDER BY count DESC 
          LIMIT 20
        `)
        const allPopularQueries = popularResult.rows.map(row => ({
          query: row.query,
          count: parseInt(row.count)
        }))
        
        // 추가 필터링 (길이, 의미없는 단어 제외)
        const validQueries = allPopularQueries.filter(item => {
          const query = item.query.toLowerCase().trim()
          // 길이 체크
          if (query.length < 2 || query.length > 20) return false
          
          // 의미없는 단어들 제외
          const meaninglessWords = ['test', '테스트', 'asdf', 'qwer', '123', 'abc']
          if (meaninglessWords.includes(query)) return false
          
          return true
        })
        
        // 비속어 필터링 후 상위 10개만 선택
        searchStats.popularQueries = filterProfanity(validQueries).slice(0, 10)

        // 최근 검색어 (실제 길드/연맹과 매칭되는 검색어만)
        const recentResult = await client.query(`
          SELECT DISTINCT sl.query, MAX(sl.created_at) as latest_search
          FROM search_logs sl
          WHERE EXISTS (
            SELECT 1 FROM guilds g 
            WHERE g.name = sl.query AND g.is_deleted = FALSE
          ) OR EXISTS (
            SELECT 1 FROM alliances a 
            WHERE a.name = sl.query AND a.is_active = TRUE
          )
          GROUP BY sl.query
          ORDER BY latest_search DESC 
          LIMIT 20
        `)
        const allRecentSearches = recentResult.rows.map(row => row.query)
        
        // 추가 필터링 (길이, 의미없는 단어 제외)
        const validRecentSearches = allRecentSearches.filter(query => {
          const normalizedQuery = query.toLowerCase().trim()
          // 길이 체크
          if (normalizedQuery.length < 2 || normalizedQuery.length > 20) return false
          
          // 의미없는 단어들 제외
          const meaninglessWords = ['test', '테스트', 'asdf', 'qwer', '123', 'abc']
          if (meaninglessWords.includes(normalizedQuery)) return false
          
          return true
        })
        
        // 비속어 필터링 후 상위 10개만 선택
        searchStats.recentSearches = filterProfanityStrings(validRecentSearches).slice(0, 10)

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
