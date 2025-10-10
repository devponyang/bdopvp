'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import ClassSelector from '@/components/solare/ClassSelector'
import SeasonSelector from '@/components/solare/SeasonSelector'
import SolareTable from '@/components/solare/SolareTable'
import { getTier } from '@/lib/utils/tier'
import PonyangLoading from '../components/PonyangLoading'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  rankChange?: string
  tier?: string // ⬅️ UI 표시용으로 클라이언트에서 추가
  guild_name?: string | null
}

export default function SolareOverallPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<Entry[]>([])
  const [updateDate, setUpdateDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)

  const fetchData = useCallback((seasonId: number | null = null) => {
    setLoading(true)
    
    const url = seasonId 
      ? `/api/solare-league/season?seasonId=${seasonId}`
      : '/api/solare-league/overall'
    
    
    fetch(url)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
        }
        
        const text = await res.text()
        try {
          return JSON.parse(text)
        } catch (jsonError) {
          console.error('JSON 파싱 에러:', text)
          throw new Error('서버에서 잘못된 응답을 받았습니다.')
        }
      })
      .then((response: { data: Entry[], lastUpdated: string | null } | Entry[]) => {
        // API 응답이 새 형식(객체)인지 기존 형식(배열)인지 확인
        let raw: Entry[]
        let lastUpdated: string | null = null
        
        if (Array.isArray(response)) {
          // 기존 형식 (배열)
          raw = response
        } else {
          // 새 형식 (객체)
          raw = response.data
          lastUpdated = response.lastUpdated
        }
        
        const withTier = raw.map(entry => ({
          ...entry,
          tier: entry.tier || getTier(entry.score)
        }))
        setData(withTier)
        setLoading(false)
        
        // 실제 데이터 업데이트 시간 설정 (KST)
        if (lastUpdated) {
          const updateTime = new Date(lastUpdated)
          const kstDate = new Date(updateTime.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
          setUpdateDate(kstDate.toISOString().split('T')[0]) // YYYY-MM-DD 형식
        } else {
          // 업데이트 시간 정보가 없으면 빈 문자열로 설정
          setUpdateDate('')
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // URL 파라미터에서 시즌 ID 확인
    const urlSeasonId = searchParams.get('seasonId')
    
    const loadInitialData = async () => {
      try {
        if (urlSeasonId) {
          // URL에 시즌 ID가 있으면 해당 시즌 데이터 로드
          const seasonId = parseInt(urlSeasonId)
          setSelectedSeasonId(seasonId)
          fetchData(seasonId)
        } else {
          // URL에 시즌 ID가 없으면 활성 시즌 확인 후 데이터 로드
          const response = await fetch('/api/admin/solare/seasons')
          const seasons = await response.json()
          const activeSeason = seasons.find((season: any) => season.is_active)
          
          if (activeSeason) {
            setSelectedSeasonId(activeSeason.id)
            fetchData(activeSeason.id)
          } else {
            // 활성 시즌이 없으면 가장 최근 시즌을 기본값으로 설정
            const sortedSeasons = seasons.sort((a: any, b: any) => b.season_number - a.season_number)
            if (sortedSeasons.length > 0) {
              const latestSeason = sortedSeasons[0]
              setSelectedSeasonId(latestSeason.id)
              fetchData(latestSeason.id)
            } else {
              setSelectedSeasonId(null)
              fetchData() // 시즌이 아예 없으면 기본 데이터
            }
          }
        }
      } catch (error) {
        console.error('초기 데이터 로딩 오류:', error)
        fetchData() // 오류 시 기본 데이터
      }
    }

    loadInitialData()
  }, [searchParams, fetchData])

  const handleSeasonChange = useCallback((seasonId: number | null) => {
    setSelectedSeasonId(seasonId)
    fetchData(seasonId)
  }, [fetchData])

  if (loading) return <PonyangLoading />

  return (
    <div className="p-3 md:p-6 max-w-full md:max-w-[1490px] mx-auto mt-6">
        {/* 메인 헤더 */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-no-repeat opacity-50"
            style={{
              backgroundImage: "url('/ponyang/sorare-bg.png')",
              backgroundSize: "100% auto",
              backgroundPosition: "center 30%"
            }}
          ></div>
          
          {/* 콘텐츠 */}
          <div className="relative p-3 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* 왼쪽: 아이콘과 제목 */}
            <div className="flex items-center gap-4">
                {/* 아이콘 */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg p-3">
                    <img src="/icons/rank1.png" alt="솔라레의 창" className="w-full h-full object-contain" />
                  </div>
                </div>
                
                {/* 제목 블록 */}
                <div className="px-4 py-3">
                  <h1 className="text-4xl font-bold text-white">
                    솔라레의 창
                  </h1>
                  <div className="text-lg text-white font-medium">
                    정규 시즌 순위
                  </div>
                </div>
              </div>
              
              {/* 오른쪽: 날짜와 업데이트 정보 */}
              <div className="flex flex-col gap-2">
                {/* 날짜 */}
                {updateDate && (
                  <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2">
                    <div className="text-white/70">📅</div>
                    <span className="text-white text-base font-medium">{updateDate}</span>
                  </div>
                )}
                
                {/* 업데이트 알림 */}
                <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2">
                  <div className="text-white/70">⏰</div>
                  <span className="text-white text-base font-medium">매일 오전 업데이트</span>
                </div>
              </div>
            </div>

            {/* 모바일 레이아웃 */}
            <div className="md:hidden space-y-2">
              {/* 상단: 제목만 */}
              <div className="flex flex-col items-center text-center">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    솔라레의 창
                  </h1>
                  <div className="text-xs text-white font-medium">
                    정규 시즌 순위
                  </div>
                </div>
              </div>
              
              {/* 하단: 날짜와 업데이트 정보 */}
              <div className="flex flex-col gap-1">
                {/* 날짜 */}
                {updateDate && (
                  <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-lg px-3 py-1 border border-white/20 flex items-center justify-center gap-2">
                    <div className="text-white/70 text-xs">📅</div>
                    <span className="text-white text-xs font-medium">{updateDate}</span>
                  </div>
                )}
                
                {/* 업데이트 알림 */}
                <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-lg px-3 py-1 border border-white/20 flex items-center justify-center gap-2">
                  <div className="text-white/70 text-xs">⏰</div>
                  <span className="text-white text-xs font-medium">매일 오전 업데이트</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 컨트롤 패널 */}
        <div className="mt-8 mb-6">
          <div className="bg-gradient-to-r from-slate-800/60 to-blue-900/60 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <SeasonSelector onSeasonChange={handleSeasonChange} selectedSeasonId={selectedSeasonId} />
              <ClassSelector selectedSeasonId={selectedSeasonId} />
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-sm md:text-base text-blue-200">
              <span className="text-xl">💡</span>
              <span className="font-medium">
                가문명을 클릭하면 해당 플레이어의 <span className="text-yellow-300 font-bold">특화</span>를 확인할 수 있습니다!
              </span>
            </div>
          </div>
        </div>

        {/* 랭킹 테이블 */}
        <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <SolareTable data={data} />
        </div>
    </div>
  )
}
