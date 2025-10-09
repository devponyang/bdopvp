'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import classList from '@/lib/constants/class-list'
import SolareTable from './SolareTable'
import ClassSelector from './ClassSelector'
import SeasonSelector from './SeasonSelector'
import PonyangLoading from '../../app/components/PonyangLoading'
import ErrorMessage from '../../app/components/ErrorMessage'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  tier: string
  rankChange?: string // ✅ 순위 변동
  guild_name?: string | null
}

export default function SolareClassClient() {
  const params = useParams()
  const searchParams = useSearchParams()
  const className = decodeURIComponent(params?.class as string || '')
  const [data, setData] = useState<Entry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateDate, setUpdateDate] = useState('')
  const [lastUpdateTime, setLastUpdateTime] = useState('')
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)

  useEffect(() => {
    if (!classList.includes(className)) {
      setError('존재하지 않는 클래스입니다.')
      setLoading(false)
      return
    }

    const fetchData = async (seasonId: number | null = null) => {
      try {
        setLoading(true)
        setError(null)
        
        const url = seasonId 
          ? `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${seasonId}`
          : `/api/solare-league/${encodeURIComponent(className)}`
        
        const res = await fetch(url)
        
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
        }
        
        const text = await res.text()
        let result
        try {
          result = JSON.parse(text)
        } catch (jsonError) {
          throw new Error('서버에서 잘못된 응답을 받았습니다.')
        }
        
        // API 응답이 새 형식(객체)인지 기존 형식(배열)인지 확인
        if (Array.isArray(result)) {
          // 기존 형식 (배열)
          setData(result)
        } else {
          // 새 형식 (객체)
          setData(result.data)
          
          // 업데이트 시간 설정
          if (result.lastUpdated) {
            const updateTime = new Date(result.lastUpdated)
            const kstDate = new Date(updateTime.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
            setUpdateDate(kstDate.toISOString().split('T')[0])
            setLastUpdateTime(kstDate.toLocaleTimeString('ko-KR', { 
              timeZone: 'Asia/Seoul',
              hour: '2-digit',
              minute: '2-digit'
            }))
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    // URL 파라미터에서 시즌 ID 확인 후 데이터 로드
    const loadInitialData = async () => {
      const urlSeasonId = searchParams.get('seasonId')
      
      try {
        if (urlSeasonId) {
          // URL에 시즌 ID가 있으면 해당 시즌 데이터 로드
          const seasonId = parseInt(urlSeasonId)
          console.log('클래스별 페이지 - URL에서 시즌 ID 발견:', seasonId)
          setSelectedSeasonId(seasonId)
          
          setLoading(true)
          setError(null)
          const url = `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${seasonId}`
          const res = await fetch(url)
          if (res.ok) {
            const result = await res.json()
            // API 응답이 새 형식(객체)인지 기존 형식(배열)인지 확인
            if (Array.isArray(result)) {
              setData(result)
            } else {
              setData(result.data)
              if (result.lastUpdated) {
                const updateTime = new Date(result.lastUpdated)
                const kstDate = new Date(updateTime.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                setUpdateDate(kstDate.toISOString().split('T')[0])
                setLastUpdateTime(kstDate.toLocaleTimeString('ko-KR', { 
                  timeZone: 'Asia/Seoul',
                  hour: '2-digit',
                  minute: '2-digit'
                }))
              }
            }
          } else {
            throw new Error(`API 요청 실패: ${res.status}`)
          }
          setLoading(false)
          } else {
            // URL에 시즌 ID가 없으면 활성 시즌 확인 후 데이터 로드
            const response = await fetch('/api/admin/solare/seasons')
            const seasons = await response.json()
            const activeSeason = seasons.find((season: any) => season.is_active)
            
            if (activeSeason) {
              setSelectedSeasonId(activeSeason.id)
              // 직접 시즌 데이터 로드
              try {
                setLoading(true)
                setError(null)
                const url = `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${activeSeason.id}`
                const res = await fetch(url)
                if (res.ok) {
                  const result = await res.json()
                  if (Array.isArray(result)) {
                    setData(result)
                  } else {
                    setData(result.data)
                    if (result.lastUpdated) {
                      const updateTime = new Date(result.lastUpdated)
                      const kstDate = new Date(updateTime.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                      setUpdateDate(kstDate.toISOString().split('T')[0])
                      setLastUpdateTime(kstDate.toLocaleTimeString('ko-KR', { 
                        timeZone: 'Asia/Seoul',
                        hour: '2-digit',
                        minute: '2-digit'
                      }))
                    }
                  }
                } else {
                  throw new Error(`API 요청 실패: ${res.status}`)
                }
              } catch (err) {
                console.error('시즌 데이터 로딩 오류:', err)
                fetchData() // 실패 시 기본 데이터로 폴백
              } finally {
                setLoading(false)
              }
            } else {
              // 활성 시즌이 없으면 가장 최근 시즌을 기본값으로 설정
              const sortedSeasons = seasons.sort((a: any, b: any) => b.season_number - a.season_number)
              if (sortedSeasons.length > 0) {
                const latestSeason = sortedSeasons[0]
                setSelectedSeasonId(latestSeason.id)
                // 직접 시즌 데이터 로드
                try {
                  setLoading(true)
                  setError(null)
                  const url = `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${latestSeason.id}`
                  const res = await fetch(url)
                  if (res.ok) {
                    const result = await res.json()
                    if (Array.isArray(result)) {
                      setData(result)
                    } else {
                      setData(result.data)
                      if (result.lastUpdated) {
                        const updateTime = new Date(result.lastUpdated)
                        const kstDate = new Date(updateTime.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                        setUpdateDate(kstDate.toISOString().split('T')[0])
                        setLastUpdateTime(kstDate.toLocaleTimeString('ko-KR', { 
                          timeZone: 'Asia/Seoul',
                          hour: '2-digit',
                          minute: '2-digit'
                        }))
                      }
                    }
                  } else {
                    throw new Error(`API 요청 실패: ${res.status}`)
                  }
                } catch (err) {
                  console.error('시즌 데이터 로딩 오류:', err)
                  fetchData() // 실패 시 기본 데이터로 폴백
                } finally {
                  setLoading(false)
                }
              } else {
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
  }, [className, searchParams])

  const handleSeasonChange = useCallback(async (seasonId: number | null) => {
    setSelectedSeasonId(seasonId)
    
    if (!classList.includes(className)) return
    
    try {
      setLoading(true)
      setError(null)
      
      const url = seasonId 
        ? `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${seasonId}`
        : `/api/solare-league/${encodeURIComponent(className)}`
      
      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
      }
      
      const text = await res.text()
      let result
      try {
        result = JSON.parse(text)
      } catch (jsonError) {
        throw new Error('서버에서 잘못된 응답을 받았습니다.')
      }
      
      // API 응답이 새 형식(객체)인지 기존 형식(배열)인지 확인
      if (Array.isArray(result)) {
        setData(result)
      } else {
        setData(result.data)
        if (result.lastUpdated) {
          const updateTime = new Date(result.lastUpdated)
          const kstDate = new Date(updateTime.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
          setUpdateDate(kstDate.toISOString().split('T')[0])
          setLastUpdateTime(kstDate.toLocaleTimeString('ko-KR', { 
            timeZone: 'Asia/Seoul',
            hour: '2-digit',
            minute: '2-digit'
          }))
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [className])

  if (loading) return (
    <div className="p-3 md:p-4 max-w-full md:max-w-5xl mx-auto">
      <PonyangLoading message={`${className} 랭킹을 불러오는 중...`} size="md" />
    </div>
  )
  
  if (error) return (
    <div className="p-3 md:p-4 max-w-full md:max-w-5xl mx-auto">
      <ErrorMessage 
        message={`${className} 랭킹 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`}
        onRetry={() => window.location.reload()}
      />
    </div>
  )
  
  if (!data) return (
    <div className="p-3 md:p-4 max-w-full md:max-w-5xl mx-auto">
      <ErrorMessage 
        message={`${className} 랭킹 데이터가 없습니다.`}
        showRetry={false}
      />
    </div>
  )

  return (
    <div className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto mt-6">
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-xl blur-sm"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-3xl">⚔️</div>
                </div>
              </div>
              
              {/* 제목 블록 */}
              <div className="px-4 py-3">
                <h1 className="text-4xl font-bold text-white">
                  솔라레의 창
                </h1>
                <div className="text-lg text-white font-medium">
                  {className} 클래스 순위
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
                  {className} 클래스 순위
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
              <span className="hidden md:inline">가문명을 클릭하면</span>
              <span className="md:hidden">카드를 터치하면</span>
              {' '}해당 플레이어의 <span className="text-yellow-300 font-bold">특화</span>를 확인할 수 있습니다!
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
