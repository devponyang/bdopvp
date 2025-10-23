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
  
  // 클래스명을 영문 파일명으로 매핑
  const getClassIconName = (className: string) => {
    const classMap: { [key: string]: string } = {
      '워리어': 'warrior',
      '하사신': 'hasasin',
      '세이지': 'saji',
      '레인저': 'ranger',
      '가디언': 'gadi',
      '스칼라': 'scara',
      '드라카니아': 'draca',
      '소서러': 'sor',
      '노바': 'nova',
      '커세어': 'cosair',
      '란': 'lhan',
      '자이언트': 'jai',
      '매구': 'magu',
      '금수랑': 'taimer',
      '샤이': 'shai',
      '격투가': 'fighter',
      '무사': 'musa',
      '매화': 'mahwa',
      '미스틱': 'mistic',
      '발키리': 'valc',
      '쿠노이치': 'kuno',
      '닌자': 'ninja',
      '다크나이트': 'darknight',
      '위자드': 'wizard',
      '아처': 'archer',
      '우사': 'usa',
      '위치': 'witch',
      '도사': 'dosa',
      '데드아이': 'dead',
      '오공': 'ukong'
    }
    return classMap[className] || className.toLowerCase()
  }
  const [data, setData] = useState<Entry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateDate, setUpdateDate] = useState('')
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [statisticsData, setStatisticsData] = useState<any>(null)
  const [statisticsLoading, setStatisticsLoading] = useState(false)

  const fetchStatistics = useCallback(async () => {
    if (statisticsData) return // 이미 데이터가 있으면 다시 가져오지 않음
    
    setStatisticsLoading(true)
    try {
      const response = await fetch(`/api/solare-league/class-statistics?class=${encodeURIComponent(className)}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStatisticsData(data)
      }
    } catch (error) {
      console.error('통계 데이터 로딩 실패:', error)
    } finally {
      setStatisticsLoading(false)
    }
  }, [statisticsData, className])

  const handleStatisticsToggle = useCallback(() => {
    setShowStatistics(!showStatistics)
    if (!showStatistics && !statisticsData) {
      fetchStatistics()
    }
  }, [showStatistics, statisticsData, fetchStatistics])

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
    
    // 통계 데이터도 자동으로 로드
    fetchStatistics()
  }, [className, searchParams, fetchStatistics])

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
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg p-3">
                  <img 
                    src={`/class-icons/${getClassIconName(className)}.png`} 
                    alt={`${className} 아이콘`} 
                    className="w-full h-full object-contain brightness-0 invert"
                    onError={(e) => {
                      // 아이콘이 없으면 기본 이모티콘으로 대체
                      e.currentTarget.style.display = 'none'
                    }}
                  />
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

      {/* 통계 드롭다운 */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-slate-800/60 to-blue-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden">
            {statisticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-white text-lg">통계 데이터 로딩 중...</span>
              </div>
            ) : statisticsData ? (
              <div className="p-6">
                <div className="mb-6">
                  <div 
                    className="text-2xl font-bold text-white flex items-center justify-between cursor-pointer hover:text-blue-300 transition-colors duration-300"
                    onClick={handleStatisticsToggle}
                  >
                    <div className="flex items-center gap-3">
                      <img src="/solare-icons/solare.png" alt="솔라레" className="w-8 h-8 object-contain" />
                      <span>솔라레의 창 통계</span>
                      <span className={`transition-transform duration-300 ${showStatistics ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                    <p className="text-base text-blue-300 font-semibold bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-400/30">
                      ▼ 버튼을 클릭하면 전체 통계를 확인할 수 있습니다
                    </p>
                  </div>
                </div>
                
                {showStatistics && (
                  <div>
                    {/* 클래스별 분포 */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚔️</span>
                    {className} 전승/각성 분포
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {statisticsData.classStats.subclassDistribution.map((item: any) => (
                      <div key={item.subclass} className="bg-slate-700/50 rounded-lg p-4 border border-white/10 hover:bg-slate-700/70 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.subclass === '전승' ? '/ponyang/ac.png' : '/ponyang/aw.png'}
                              alt={item.subclass}
                              className="w-8 h-8 object-contain"
                            />
                            <div>
                              <h5 className="text-lg font-bold text-white">{item.subclass}</h5>
                              <p className="text-sm text-gray-300">{item.count}명 ({item.percentage}%)</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 진행률 바 */}
                        <div className="w-full bg-slate-600 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              item.subclass === '전승' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 클래스 통계 요약 */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    {className} 클래스 통계
                  </h4>
                  
                  {/* 기본 통계 카드들 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-400/30 hover:from-yellow-500/30 hover:to-yellow-600/30 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">⭐</div>
                        <h4 className="text-lg font-bold text-white">평균 점수</h4>
                      </div>
                      <p className="text-3xl font-bold text-yellow-300">{statisticsData.classStats.avgScore}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-400/30 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">📊</div>
                        <h4 className="text-lg font-bold text-white">평균 승률</h4>
                      </div>
                      <p className="text-3xl font-bold text-green-300">{statisticsData.classStats.avgWinRate}%</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">👥</div>
                        <h4 className="text-lg font-bold text-white">총 플레이어</h4>
                      </div>
                      <p className="text-3xl font-bold text-blue-300">{statisticsData.classStats.totalPlayers}명</p>
                    </div>
                  </div>

                  {/* 티어별 분포 */}
                  <div className="bg-slate-700/30 rounded-xl p-6 border border-white/10">
                    <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      {className} 티어별 분포
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                      {statisticsData.tierDistribution.map((item: any) => (
                        <div key={item.tier} className="bg-slate-700/50 rounded-lg p-3 border border-white/10 hover:bg-slate-700/70 transition-all duration-300">
                          <div className="flex flex-col items-center gap-2 mb-2">
                            <img
                              src={`/solare-icons/${item.tier === '솔라레' ? 'solare' : 
                                item.tier === '영광의 창' ? 'final' :
                                item.tier === '여명의 창' ? 'dawn' :
                                item.tier === '불꽃의 창' ? 'blood' :
                                item.tier === '노을의 창' ? 'sunset' :
                                item.tier === '숙련된 병사' ? 'expert' :
                                item.tier === '견습 병사' ? 'apprentice' : 'null'}.png`}
                              alt={item.tier}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            <div className="text-center">
                              <h5 className="text-xs font-bold text-white leading-tight">{item.tier}</h5>
                              <p className="text-xs text-gray-300">{item.count}명</p>
                              <p className="text-xs text-blue-300 font-semibold">{item.percentage}%</p>
                            </div>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                item.tier === '솔라레' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                item.tier === '영광의 창' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                item.tier === '여명의 창' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                                item.tier === '불꽃의 창' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                item.tier === '노을의 창' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                                item.tier === '숙련된 병사' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                item.tier === '견습 병사' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                'bg-gradient-to-r from-gray-500 to-gray-700'
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 인사이트 */}
                {statisticsData.classStats.subclassDistribution.length > 0 && statisticsData.tierDistribution.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-400/30">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      {className} 클래스 인사이트
                    </h4>
                    <div className="space-y-2 text-gray-300">
                      <p>• 총 플레이어 수: <span className="text-blue-400 font-bold">{statisticsData.classStats.totalPlayers}명</span></p>
                      <p>• 평균 점수: <span className="text-yellow-400 font-bold">{statisticsData.classStats.avgScore}점</span></p>
                      <p>• 평균 승률: <span className="text-green-400 font-bold">{statisticsData.classStats.avgWinRate}%</span></p>
                      {statisticsData.classStats.subclassDistribution.length > 0 && (
                        <p>• 가장 많은 전승/각성: <span className="text-purple-400 font-bold">{statisticsData.classStats.subclassDistribution[0]?.subclass}</span> ({statisticsData.classStats.subclassDistribution[0]?.percentage}%)</p>
                      )}
                      {statisticsData.tierDistribution.length > 0 && (
                        <p>• 가장 많은 티어: <span className="text-orange-400 font-bold">{statisticsData.tierDistribution[0]?.tier}</span> ({statisticsData.tierDistribution[0]?.percentage}%)</p>
                      )}
                    </div>
                  </div>
                )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">통계 데이터를 불러올 수 없습니다.</p>
              </div>
            )}
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
