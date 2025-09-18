'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Statistics {
  totalGuilds: number
  totalCoupons: number
  searchStats: {
    totalSearches: number
    popularQueries: Array<{ query: string; count: number }>
    recentSearches: string[]
  }
}

async function fetchStatistics(): Promise<Statistics> {
  const res = await fetch('/api/statistics')
  if (!res.ok) throw new Error('Failed to fetch statistics')
  return res.json()
}

export default function StatisticsPage() {
  const router = useRouter()
  const [searchingQuery, setSearchingQuery] = useState<string | null>(null)
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['statistics'],
    queryFn: fetchStatistics,
    staleTime: 5 * 60 * 1000, // 5분 캐시
  })

  const handleSearchClick = async (query: string) => {
    setSearchingQuery(query)
    try {
      // 먼저 검색 API를 호출해서 결과 확인
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      
      // 검색 결과가 정확히 하나이고, 검색어와 정확히 일치하는 경우 바로 길드 페이지로 이동
      if (data.length === 1 && data[0].name.toLowerCase() === query.toLowerCase()) {
        router.push(`/guild/${encodeURIComponent(data[0].name)}`)
      } else {
        // 그렇지 않으면 검색 페이지로 이동
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    } catch (error) {
      // 오류 발생시 기본적으로 검색 페이지로 이동
      router.push(`/search?q=${encodeURIComponent(query)}`)
    } finally {
      setSearchingQuery(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">📊 사이트 통계</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">📊 사이트 통계</h1>
          <div className="text-center text-red-400">
            통계 데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">📊 사이트 통계</h1>
        
        {/* 기본 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 저장된 길드 수 */}
          <Card className="p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-lg font-semibold mb-2">저장된 길드 수</h3>
            <div className="text-3xl font-bold text-blue-400">
              {stats?.totalGuilds?.toLocaleString() || '0'}
            </div>
          </Card>

          {/* 쿠폰 수 */}
          <Card className="p-6 text-center">
            <div className="text-4xl mb-2">🎫</div>
            <h3 className="text-lg font-semibold mb-2">활성 쿠폰</h3>
            <div className="text-3xl font-bold text-green-400">
              {stats?.totalCoupons?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-gray-400 mt-2">사용 가능한 쿠폰</p>
          </Card>

          {/* 총 검색 수 */}
          <Card className="p-6 text-center">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-semibold mb-2">총 검색 수</h3>
            <div className="text-3xl font-bold text-yellow-400">
              {stats?.searchStats?.totalSearches?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-gray-400 mt-2">누적 검색 횟수</p>
          </Card>
        </div>

        {/* 검색 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 인기 검색어 */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🔥 인기 검색어
            </h3>
            {stats?.searchStats?.popularQueries && stats.searchStats.popularQueries.length > 0 ? (
              <div className="space-y-3">
                {stats?.searchStats?.popularQueries?.slice(0, 10).map((item, index) => (
                  <div 
                    key={item.query} 
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      searchingQuery === item.query 
                        ? 'bg-blue-900 opacity-75' 
                        : 'hover:bg-zinc-800'
                    }`}
                    onClick={() => handleSearchClick(item.query)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {searchingQuery === item.query ? '⏳' : index + 1}
                      </span>
                      <span className="font-medium hover:text-blue-400">
                        {item.query}
                        {searchingQuery === item.query && <span className="ml-2 text-blue-400">검색 중...</span>}
                      </span>
                    </div>
                    <span className="text-blue-400 font-semibold">{item.count}회</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                검색 데이터가 없습니다.
              </div>
            )}
          </Card>

          {/* 최근 검색어 */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⏰ 최근 검색어
            </h3>
            {stats?.searchStats?.recentSearches && stats.searchStats.recentSearches.length > 0 ? (
              <div className="space-y-2">
                {stats?.searchStats?.recentSearches?.slice(0, 10).map((query, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                      searchingQuery === query 
                        ? 'bg-blue-900 opacity-75' 
                        : 'bg-zinc-800 hover:bg-zinc-700'
                    }`}
                    onClick={() => handleSearchClick(query)}
                  >
                    <span className="text-gray-400 text-sm w-6">
                      {searchingQuery === query ? '⏳' : `${index + 1}.`}
                    </span>
                    <span className="font-medium hover:text-blue-400">
                      {query}
                      {searchingQuery === query && <span className="ml-2 text-blue-400">검색 중...</span>}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                최근 검색 기록이 없습니다.
              </div>
            )}
          </Card>
        </div>

        {/* 업데이트 정보 */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          마지막 업데이트: {new Date().toLocaleString('ko-KR')}
        </div>
      </div>
    </div>
  )
}
