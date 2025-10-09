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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-sm"></div>
        <div className="relative bg-gradient-to-r from-slate-800/80 to-blue-900/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl md:text-6xl animate-pulse">⚔️</div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                솔라레의 창 - {className}
              </h1>
              <div className="text-4xl md:text-6xl">🏆</div>
            </div>
            <div className="text-lg md:text-xl text-blue-300 font-medium">
              {className} 클래스 순위
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="px-3 py-1 bg-blue-600/30 rounded-full border border-blue-400/30">
                ⏰ 매일 오전 업데이트
              </span>
              {updateDate && (
                <span className="px-3 py-1 bg-purple-600/30 rounded-full border border-purple-400/30">
                  📅 {updateDate} {lastUpdateTime && `(${lastUpdateTime})`}
                </span>
              )}
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
