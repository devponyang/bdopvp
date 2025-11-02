'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import ClassSelector from '@/components/solare/ClassSelector'
import SeasonSelector from '@/components/solare/SeasonSelector'
import SolareTable from '@/components/solare/SolareTable'
import { getTier } from '@/lib/utils/tier'
import PonyangLoading from '../components/PonyangLoading'
import SolareWithNotice from '../components/SolareWithNotice'

// 클래스명을 영문 파일명으로 매핑 (ClassSelector와 동일)
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

// 티어 아이콘 매핑
const getTierIcon = (tier: string) => {
  const iconMap: { [key: string]: string } = {
    '솔라레': '/solare-icons/solare.png',
    '영광의 창': '/solare-icons/final.png',
    '여명의 창': '/solare-icons/dawn.png',
    '불꽃의 창': '/solare-icons/blood.png',
    '노을의 창': '/solare-icons/sunset.png',
    '숙련된 병사': '/solare-icons/expert.png',
    '견습 병사': '/solare-icons/apprentice.png',
    '언랭크': '/solare-icons/null.png'
  }
  return iconMap[tier] || '/solare-icons/null.png'
}

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
  const [showStatistics, setShowStatistics] = useState(false)
  const [statisticsData, setStatisticsData] = useState<any>(null)
  const [statisticsLoading, setStatisticsLoading] = useState(false)

  const fetchData = useCallback((seasonId: number | null = null) => {
    setLoading(true)
    
    const url = seasonId 
      ? `/api/solare-league/season?seasonId=${seasonId}`
      : '/api/solare-league/overall'
    
    
    fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
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

  const fetchStatistics = useCallback(async () => {
    if (statisticsData) return // 이미 데이터가 있으면 다시 가져오지 않음
    
    setStatisticsLoading(true)
    try {
      const response = await fetch('/api/solare-league/statistics', {
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
  }, [statisticsData])

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
    
    // 통계 데이터도 자동으로 로드
    fetchStatistics()
  }, [searchParams, fetchData, fetchStatistics])

  const handleSeasonChange = useCallback((seasonId: number | null) => {
    setSelectedSeasonId(seasonId)
    fetchData(seasonId)
  }, [fetchData])

  const handleStatisticsToggle = useCallback(() => {
    setShowStatistics(!showStatistics)
    if (!showStatistics && !statisticsData) {
      fetchStatistics()
    }
  }, [showStatistics, statisticsData, fetchStatistics])

  if (loading) return <PonyangLoading />

  return (
    <SolareWithNotice>
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
                      className="text-2xl font-bold text-white flex flex-col md:flex-row md:items-center md:justify-between gap-2 cursor-pointer hover:text-blue-300 transition-colors duration-300"
                      onClick={handleStatisticsToggle}
                    >
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <img src="/solare-icons/solare.png" alt="솔라레" className="w-8 h-8 object-contain" />
                        <span className="whitespace-nowrap">솔라레의 창 통계</span>
                        <span className={`transition-transform duration-300 ${showStatistics ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                      <p className="text-base text-blue-300 font-semibold bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-400/30">
                        클릭하면 전체 통계를 확인할 수 있습니다
                      </p>
                    </div>
                  </div>
                  
                  {showStatistics && (
                    <div>
                      {/* 클래스별 분포 */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">⚔️</span>
                      클래스별 분포
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {statisticsData.classDistribution.map((item: any) => {
                        // 해당 클래스의 전승/각성 데이터 찾기
                        const subclassData = statisticsData.classSubclassDistribution?.filter((sub: any) => sub.class === item.class && sub.subclass !== '일반') || []
                        const 전승 = subclassData.find((sub: any) => sub.subclass === '전승')
                        const 각성 = subclassData.find((sub: any) => sub.subclass === '각성')
                        
                        // 전승/각성 비율 계산 (API에서 계산된 percentage 사용)
                        const 전승Percentage = 전승?.percentage || 0
                        const 각성Percentage = 각성?.percentage || 0
                        const hasSubclass = 전승Percentage > 0 || 각성Percentage > 0
                        
                        return (
                          <div key={item.class} className="bg-slate-700/50 rounded-lg p-3 border border-white/10 hover:bg-slate-700/70 transition-all duration-300">
                            {/* 클래스 헤더 */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={`/class-icons/${getClassIconName(item.class)}.png`}
                                  alt={item.class}
                                  className="w-8 h-8 object-contain flex-shrink-0 brightness-0 invert"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                                <div>
                                  <h5 className="text-sm font-bold text-white whitespace-nowrap">{item.class}</h5>
                                  <p className="text-xs text-gray-300">{item.count}명 ({item.percentage}%)</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-300">
                                {전승 && (
                                  <span className="flex items-center gap-1">
                                    <img src="/ponyang/ac.png" alt="전승" className="w-3 h-3" />
                                    {전승.count}명
                                  </span>
                                )}
                                {각성 && (
                                  <span className="flex items-center gap-1">
                                    <img src="/ponyang/aw.png" alt="각성" className="w-3 h-3" />
                                    {각성.count}명
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* 전승/각성 비율 그래프 */}
                            <div className="w-full bg-slate-600 rounded-full h-2 flex overflow-hidden">
                              {hasSubclass ? (
                                <>
                                  {전승Percentage > 0 && (
                                    <div 
                                      className="bg-blue-500 h-2 transition-all duration-500"
                                      style={{ width: `${전승Percentage}%` }}
                                    ></div>
                                  )}
                                  {각성Percentage > 0 && (
                                    <div 
                                      className="bg-red-500 h-2 transition-all duration-500"
                                      style={{ width: `${각성Percentage}%` }}
                                    ></div>
                                  )}
                                </>
                              ) : (
                                <div className="bg-yellow-500 h-2 w-full transition-all duration-500"></div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>


                  {/* 전체 통계 요약 */}
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">📈</span>
                      전체 통계 요약
                    </h4>
                    
                    {/* 기본 통계 카드들 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-400/30 hover:from-yellow-500/30 hover:to-yellow-600/30 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-3xl">⭐</div>
                          <h4 className="text-lg font-bold text-white">평균 점수</h4>
                        </div>
                        <p className="text-3xl font-bold text-yellow-300">{statisticsData.totalStats.avg_score}</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-400/30 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-3xl">📊</div>
                          <h4 className="text-lg font-bold text-white">평균 승률</h4>
                        </div>
                        <p className="text-3xl font-bold text-green-300">{statisticsData.totalStats.avg_win_rate}%</p>
                      </div>
                    </div>

                    {/* 티어별 분포 */}
                    <div className="bg-slate-700/30 rounded-xl p-6 border border-white/10">
                      <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">🏆</span>
                        티어별 분포
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                        {statisticsData.tierDistribution.map((item: any) => (
                          <div key={item.tier} className="bg-slate-700/50 rounded-lg p-3 border border-white/10 hover:bg-slate-700/70 transition-all duration-300">
                            <div className="flex flex-col items-center gap-2 mb-2">
                              <img
                                src={getTierIcon(item.tier)}
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
                  {statisticsData.classDistribution.length > 0 && statisticsData.tierDistribution.length > 0 && (
                    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-400/30">
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        인사이트
                      </h4>
                      <div className="space-y-2 text-gray-300">
                        <p>• 가장 많은 플레이어가 사용하는 클래스: <span className="text-blue-400 font-bold">{statisticsData.classDistribution[0]?.class}</span> ({statisticsData.classDistribution[0]?.percentage}%)</p>
                        <p>• 가장 많은 플레이어가 있는 티어: <span className="text-green-400 font-bold">{statisticsData.tierDistribution[0]?.tier}</span> ({statisticsData.tierDistribution[0]?.percentage}%)</p>
                        {statisticsData.classAverageScore.length > 0 && (
                          <p>• 가장 높은 평균 점수를 가진 클래스: <span className="text-yellow-400 font-bold">{statisticsData.classAverageScore[0]?.class}</span> ({statisticsData.classAverageScore[0]?.avg_score}점)</p>
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
    </SolareWithNotice>
  )
}