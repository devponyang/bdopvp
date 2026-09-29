'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { filterProfanity, filterProfanityStrings } from 'lib/profanity-filter'
import PonyangLoading from '@/components/shared/PonyangLoading'

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
      
      // 검색 결과가 정확히 하나이고, 검색어와 정확히 일치하는 경우 바로 해당 페이지로 이동
      if (data.length === 1 && data[0].name.toLowerCase() === query.toLowerCase()) {
        if (data[0].type === 'guild') {
          router.push(`/guild/${encodeURIComponent(data[0].name)}`)
        } else if (data[0].type === 'alliance') {
          router.push(`/alliance/${encodeURIComponent(data[0].name)}`)
        } else {
          router.push(`/search?q=${encodeURIComponent(query)}`)
        }
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
      <div className="max-w-[1490px] mx-auto px-4 py-6 md:py-10">
        <PonyangLoading message="통계 데이터를 불러오는 중..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1490px] mx-auto px-4 py-6 md:py-10">
        <div className="text-center text-red-400 py-20">
          통계 데이터를 불러오는데 실패했습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 max-w-full md:max-w-[1490px] mx-auto mt-6">
      {/* 메인 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/ponyang/tong-bg.jpg')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 60%"
          }}
        ></div>
        
        {/* 콘텐츠 */}
        <div className="relative p-3 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center gap-6">
            {/* 왼쪽: 아이콘과 제목 */}
            <div className="flex items-center gap-4">
              {/* 아이콘 */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg p-2">
          <img src="/icons/tong-tip.png" alt="통계" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
              
              {/* 제목 블록 */}
              <div className="px-4 py-3">
                <h1 className="text-4xl font-bold text-white">
                  사이트 통계
                </h1>
                <div className="text-lg text-white font-medium">
                  BDOPVP 포냥이 통계 정보
                </div>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden">
            {/* 제목 */}
            <div className="flex flex-col items-center text-center">
              <div>
                <h1 className="text-xl font-bold text-white">
                  사이트 통계
                </h1>
                <div className="text-xs text-white font-medium">
                  BDOPVP 포냥이 통계 정보
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 기본 통계 카드들 */}
      <div className="mt-8 mb-6 bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          주요 통계
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 저장된 길드 수 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-5 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-sm text-blue-300 font-semibold">저장된 길드 수</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats?.totalGuilds?.toLocaleString() || '0'}개
              </div>
            </div>
          </div>

          {/* 쿠폰 수 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-5 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎫</span>
                </div>
                <span className="text-sm text-green-300 font-semibold">활성 쿠폰</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats?.totalCoupons?.toLocaleString() || '0'}개
              </div>
              <p className="text-xs text-gray-400 mt-1">사용 가능한 쿠폰</p>
            </div>
          </div>

          {/* 총 검색 수 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-5 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <span className="text-sm text-yellow-300 font-semibold">총 검색 수</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats?.searchStats?.totalSearches?.toLocaleString() || '0'}회
              </div>
              <p className="text-xs text-gray-400 mt-1">누적 검색 횟수</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 통계 */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 인기 검색어 */}
        <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            인기 검색어
          </h3>
          {stats?.searchStats?.popularQueries && stats.searchStats.popularQueries.length > 0 ? (
            <div className="space-y-2">
              {filterProfanity(stats.searchStats.popularQueries).slice(0, 10).map((item, index) => (
                <div 
                  key={item.query} 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    searchingQuery === item.query 
                      ? 'bg-blue-600/40 border border-blue-500/50' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                  onClick={() => handleSearchClick(item.query)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {searchingQuery === item.query ? '⏳' : index + 1}
                    </span>
                    <span className="font-medium text-gray-200 hover:text-blue-300">
                      {item.query}
                      {searchingQuery === item.query && <span className="ml-2 text-blue-300">검색 중...</span>}
                    </span>
                  </div>
                  <span className="text-blue-300 font-bold text-sm px-2 py-1 bg-blue-500/20 rounded-lg">{item.count}회</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              검색 데이터가 없습니다.
            </div>
          )}
        </div>

        {/* 최근 검색어 */}
        <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            최근 검색어
          </h3>
          {stats?.searchStats?.recentSearches && stats.searchStats.recentSearches.length > 0 ? (
            <div className="space-y-2">
              {filterProfanityStrings(stats.searchStats.recentSearches).slice(0, 10).map((query, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    searchingQuery === query 
                      ? 'bg-blue-600/40 border border-blue-500/50' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                  onClick={() => handleSearchClick(query)}
                >
                  <span className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {searchingQuery === query ? '⏳' : index + 1}
                  </span>
                  <span className="font-medium text-gray-200 hover:text-blue-300">
                    {query}
                    {searchingQuery === query && <span className="ml-2 text-blue-300">검색 중...</span>}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              최근 검색 기록이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
