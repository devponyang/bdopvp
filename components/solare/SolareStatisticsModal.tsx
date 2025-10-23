'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface StatisticsData {
  classDistribution: Array<{
    class: string
    count: number
    percentage: number
  }>
  subclassDistribution: Array<{
    subclass: string
    count: number
    percentage: number
  }>
  tierDistribution: Array<{
    tier: string
    count: number
    percentage: number
  }>
  winRateDistribution: Array<{
    win_rate_range: string
    count: number
    percentage: number
  }>
  classAverageScore: Array<{
    class: string
    avg_score: number
    avg_win_rate: number
  }>
  totalStats: {
    total_players: number
    avg_score: number
    avg_win_rate: number
    max_score: number
    min_score: number
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SolareStatisticsModal({ isOpen, onClose }: Props) {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'class' | 'tier' | 'winrate' | 'summary'>('class')

  useEffect(() => {
    if (isOpen && !data) {
      fetchStatistics()
    }
  }, [isOpen, data])

  const fetchStatistics = async () => {
    setLoading(true)
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
        const statisticsData = await response.json()
        setData(statisticsData)
      }
    } catch (error) {
      console.error('통계 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const getClassIcon = (className: string) => {
    // ClassSelector와 동일한 매핑 사용
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
    const iconName = classMap[className] || className.toLowerCase()
    return `/class-icons/${iconName}.png`
  }

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

  const getSubclassIcon = (subclass: string) => {
    if (subclass === '전승') return '/ponyang/ac.png'
    if (subclass === '각성') return '/ponyang/aw.png'
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/icons/rank1.png"
                alt="통계"
                width={32}
                height={32}
                className="drop-shadow-lg"
              />
              <h2 className="text-2xl font-bold text-white">솔라레의 창 통계</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-400 transition-colors text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-slate-700/50 p-2 border-b border-white/10">
          <div className="flex gap-2">
            {[
              { id: 'class', label: '클래스 분포', icon: '⚔️' },
              { id: 'tier', label: '티어 분포', icon: '🏆' },
              { id: 'winrate', label: '승률 분포', icon: '📊' },
              { id: 'summary', label: '요약', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-white text-lg">통계 데이터 로딩 중...</span>
            </div>
          ) : data ? (
            <>
              {/* 클래스 분포 */}
              {activeTab === 'class' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">클래스별 분포</h3>
                  
                  {/* 클래스별 플레이어 수 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.classDistribution.map((item) => (
                      <div key={item.class} className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <Image
                            src={getClassIcon(item.class)}
                            alt={item.class}
                            width={40}
                            height={40}
                            className="drop-shadow-lg"
                          />
                          <div>
                            <h4 className="text-lg font-bold text-white">{item.class}</h4>
                            <p className="text-sm text-gray-300">{item.count}명 ({item.percentage}%)</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 전승/각성 분포 */}
                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-white mb-4">전승/각성 분포</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.subclassDistribution.map((item) => (
                        <div key={item.subclass} className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-3 mb-3">
                            {getSubclassIcon(item.subclass) && (
                              <Image
                                src={getSubclassIcon(item.subclass)!}
                                alt={item.subclass}
                                width={32}
                                height={32}
                                className="drop-shadow-lg"
                              />
                            )}
                            <div>
                              <h5 className="text-lg font-bold text-white">{item.subclass}</h5>
                              <p className="text-sm text-gray-300">{item.count}명 ({item.percentage}%)</p>
                            </div>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                item.subclass === '전승' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                item.subclass === '각성' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                                'bg-gradient-to-r from-gray-400 to-gray-600'
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 클래스별 평균 점수 */}
                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-white mb-4">클래스별 평균 점수</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.classAverageScore.map((item) => (
                        <div key={item.class} className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-3 mb-2">
                            <Image
                              src={getClassIcon(item.class)}
                              alt={item.class}
                              width={32}
                              height={32}
                              className="drop-shadow-lg"
                            />
                            <h5 className="text-lg font-bold text-white">{item.class}</h5>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-300">
                              평균 점수: <span className="text-yellow-400 font-bold">{item.avg_score}</span>
                            </p>
                            <p className="text-sm text-gray-300">
                              평균 승률: <span className="text-green-400 font-bold">{item.avg_win_rate}%</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 티어 분포 */}
              {activeTab === 'tier' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">티어별 분포</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.tierDistribution.map((item) => (
                      <div key={item.tier} className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <Image
                            src={getTierIcon(item.tier)}
                            alt={item.tier}
                            width={40}
                            height={40}
                            className="drop-shadow-lg"
                          />
                          <div>
                            <h4 className="text-lg font-bold text-white">{item.tier}</h4>
                            <p className="text-sm text-gray-300">{item.count}명 ({item.percentage}%)</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              item.tier === '1위' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              item.tier === '다이아몬드' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                              item.tier === '플래티넘' ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                              item.tier === '골드' ? 'bg-gradient-to-r from-yellow-500 to-yellow-700' :
                              item.tier === '실버' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              item.tier === '브론즈' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                              'bg-gradient-to-r from-gray-500 to-gray-700'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 승률 분포 */}
              {activeTab === 'winrate' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">승률별 분포</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.winRateDistribution.map((item) => (
                      <div key={item.win_rate_range} className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-bold text-white">{item.win_rate_range}</h4>
                          <p className="text-sm text-gray-300">{item.count}명 ({item.percentage}%)</p>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              item.win_rate_range === '80% 이상' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                              item.win_rate_range === '70-79%' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                              item.win_rate_range === '60-69%' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              item.win_rate_range === '50-59%' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                              'bg-gradient-to-r from-gray-400 to-gray-600'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 요약 */}
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">전체 통계 요약</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">👥</div>
                        <h4 className="text-lg font-bold text-white">총 플레이어</h4>
                      </div>
                      <p className="text-3xl font-bold text-blue-300">{data.totalStats.total_players}명</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">⭐</div>
                        <h4 className="text-lg font-bold text-white">평균 점수</h4>
                      </div>
                      <p className="text-3xl font-bold text-yellow-300">{data.totalStats.avg_score}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">📊</div>
                        <h4 className="text-lg font-bold text-white">평균 승률</h4>
                      </div>
                      <p className="text-3xl font-bold text-green-300">{data.totalStats.avg_win_rate}%</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-6 border border-red-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">🏆</div>
                        <h4 className="text-lg font-bold text-white">최고 점수</h4>
                      </div>
                      <p className="text-3xl font-bold text-red-300">{data.totalStats.max_score}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">📉</div>
                        <h4 className="text-lg font-bold text-white">최저 점수</h4>
                      </div>
                      <p className="text-3xl font-bold text-purple-300">{data.totalStats.min_score}</p>
                    </div>
                  </div>

                  {/* 인사이트 */}
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-400/30">
                    <h4 className="text-lg font-bold text-white mb-3">📈 인사이트</h4>
                    <div className="space-y-2 text-gray-300">
                      <p>• 가장 많은 플레이어가 사용하는 클래스: <span className="text-blue-400 font-bold">{data.classDistribution[0]?.class}</span> ({data.classDistribution[0]?.percentage}%)</p>
                      <p>• 가장 높은 평균 점수를 가진 클래스: <span className="text-yellow-400 font-bold">{data.classAverageScore[0]?.class}</span> ({data.classAverageScore[0]?.avg_score}점)</p>
                      <p>• 가장 많은 플레이어가 있는 티어: <span className="text-green-400 font-bold">{data.tierDistribution[0]?.tier}</span> ({data.tierDistribution[0]?.percentage}%)</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">통계 데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
