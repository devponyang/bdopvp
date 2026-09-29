'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import classList from '@/lib/constants/class-list'
import SolareTable from './SolareTable'
import ClassSelector from './ClassSelector'
import SeasonSelector from './SeasonSelector'
import PonyangLoading from '@/components/shared/PonyangLoading'
import ErrorMessage from '@/components/shared/ErrorMessage'

const CLASS_ICON_MAP: Record<string, string> = {
  '워리어': 'warrior', '하사신': 'hasasin', '세이지': 'saji',
  '레인저': 'ranger', '가디언': 'gadi', '스칼라': 'scara',
  '드라카니아': 'draca', '소서러': 'sor', '노바': 'nova',
  '커세어': 'cosair', '란': 'lhan', '자이언트': 'jai',
  '매구': 'magu', '금수랑': 'taimer', '샤이': 'shai',
  '격투가': 'fighter', '무사': 'musa', '매화': 'mahwa',
  '미스틱': 'mistic', '발키리': 'valc', '쿠노이치': 'kuno',
  '닌자': 'ninja', '다크나이트': 'darknight', '위자드': 'wizard',
  '아처': 'archer', '우사': 'usa', '위치': 'witch',
  '도사': 'dosa', '데드아이': 'dead', '오공': 'ukong',
}

const TIER_ICON_MAP: Record<string, string> = {
  '솔라레': 'solare', '영광의 창': 'final', '여명의 창': 'dawn',
  '불꽃의 창': 'blood', '노을의 창': 'sunset',
  '숙련된 병사': 'expert', '견습 병사': 'apprentice',
}

const TIER_COLOR: Record<string, { text: string; bar: string; border: string }> = {
  '솔라레': { text: 'text-amber-400', bar: 'bg-amber-400', border: 'border-amber-400/30' },
  '영광의 창': { text: 'text-sky-400', bar: 'bg-sky-400', border: 'border-sky-400/30' },
  '여명의 창': { text: 'text-purple-400', bar: 'bg-purple-400', border: 'border-purple-400/30' },
  '불꽃의 창': { text: 'text-red-400', bar: 'bg-red-400', border: 'border-red-400/30' },
  '노을의 창': { text: 'text-orange-400', bar: 'bg-orange-400', border: 'border-orange-400/30' },
  '숙련된 병사': { text: 'text-emerald-400', bar: 'bg-emerald-400', border: 'border-emerald-400/30' },
  '견습 병사': { text: 'text-zinc-400', bar: 'bg-zinc-400', border: 'border-zinc-600/40' },
}

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  tier: string
  rankChange?: string
  guild_name?: string | null
}

export default function SolareClassClient() {
  const params = useParams()
  const searchParams = useSearchParams()
  const className = decodeURIComponent(params?.class as string || '')
  const iconName = CLASS_ICON_MAP[className] || className.toLowerCase()

  const [data, setData] = useState<Entry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateDate, setUpdateDate] = useState('')
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [statisticsData, setStatisticsData] = useState<any>(null)
  const [statisticsLoading, setStatisticsLoading] = useState(false)

  const fetchStatistics = useCallback(async () => {
    if (statisticsData) return
    setStatisticsLoading(true)
    try {
      const res = await fetch(
        `/api/solare-league/class-statistics?class=${encodeURIComponent(className)}`,
        { cache: 'no-store', headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } }
      )
      if (res.ok) setStatisticsData(await res.json())
    } catch { /* silent */ }
    finally { setStatisticsLoading(false) }
  }, [statisticsData, className])

  const handleStatisticsToggle = useCallback(() => {
    setShowStatistics(p => !p)
    if (!showStatistics && !statisticsData) fetchStatistics()
  }, [showStatistics, statisticsData, fetchStatistics])

  const fetchWithSeason = useCallback(async (seasonId: number | null = null) => {
    setLoading(true); setError(null)
    try {
      const url = seasonId
        ? `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${seasonId}`
        : `/api/solare-league/${encodeURIComponent(className)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`${res.status}`)
      const text = await res.text()
      let result
      try { result = JSON.parse(text) } catch { throw new Error('서버 응답 오류') }
      if (Array.isArray(result)) { setData(result) }
      else {
        setData(result.data)
        if (result.lastUpdated) {
          const kst = new Date(new Date(result.lastUpdated).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
          setUpdateDate(kst.toISOString().split('T')[0])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.')
      setData(null)
    } finally { setLoading(false) }
  }, [className])

  useEffect(() => {
    if (!classList.includes(className)) { setError('존재하지 않는 클래스입니다.'); setLoading(false); return }
    const init = async () => {
      const urlSeasonId = searchParams.get('seasonId')
      try {
        if (urlSeasonId) {
          const id = parseInt(urlSeasonId); setSelectedSeasonId(id); await fetchWithSeason(id)
        } else {
          const seasons = await (await fetch('/api/admin/solare/seasons')).json()
          const active = seasons.find((s: any) => s.is_active)
          if (active) { setSelectedSeasonId(active.id); await fetchWithSeason(active.id) }
          else {
            const sorted = seasons.sort((a: any, b: any) => b.season_number - a.season_number)
            if (sorted.length > 0) { setSelectedSeasonId(sorted[0].id); await fetchWithSeason(sorted[0].id) }
            else await fetchWithSeason()
          }
        }
      } catch { await fetchWithSeason() }
    }
    init(); fetchStatistics()
  }, [className, searchParams, fetchWithSeason, fetchStatistics])

  const handleSeasonChange = useCallback(async (id: number | null) => {
    setSelectedSeasonId(id); await fetchWithSeason(id)
  }, [fetchWithSeason])

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <PonyangLoading message={`${className} 랭킹을 불러오는 중...`} size="md" />
    </div>
  )

  if (error) return (
    <div className="p-6 min-h-[400px] bg-zinc-950 flex items-center justify-center">
      <ErrorMessage message={`${className} 랭킹 데이터를 불러오는 중 오류가 발생했습니다.`} onRetry={() => window.location.reload()} />
    </div>
  )

  if (!data) return (
    <div className="p-6 min-h-[400px] bg-zinc-950 flex items-center justify-center">
      <ErrorMessage message={`${className} 랭킹 데이터가 없습니다.`} showRetry={false} />
    </div>
  )

  const maxSubclassCount = statisticsData?.classStats?.subclassDistribution?.length > 0
    ? Math.max(...statisticsData.classStats.subclassDistribution.map((i: any) => i.count))
    : 1

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="px-3 md:px-6 py-6 max-w-[1490px] mx-auto space-y-4">

        {/* Header */}
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "url('/ponyang/sorare-bg.png')", backgroundSize: '100% auto', backgroundPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/70 to-transparent" />

          {/* Desktop */}
          <div className="relative hidden md:flex items-center justify-between gap-6 px-8 py-7">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <img
                  src={`/class-icons/${iconName}.png`}
                  alt={className}
                  className="w-9 h-9 object-contain brightness-0 invert opacity-75"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  솔라레의 창
                  <span className="ml-3 text-lg font-normal text-cyan-400/70">— {className}</span>
                </h1>
                <p className="text-zinc-500 text-sm mt-0.5">{className} 클래스 시즌 랭킹</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {updateDate && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400">
                  <span className="text-cyan-500/60 text-xs">●</span>{updateDate}
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400">
                <span className="text-cyan-500/60 text-xs">●</span>매일 오전 업데이트
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="relative md:hidden px-4 py-5 space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">솔라레의 창</h1>
            <p className="text-zinc-400 text-xs">{className} 클래스 순위</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {updateDate && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-400">
                  <span className="text-cyan-500/60">●</span>{updateDate}
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-400">
                <span className="text-cyan-500/60">●</span>매일 오전 업데이트
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <SeasonSelector onSeasonChange={handleSeasonChange} selectedSeasonId={selectedSeasonId} />
            <ClassSelector selectedSeasonId={selectedSeasonId} />
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {statisticsLoading ? (
            <div className="flex items-center justify-center py-8 gap-3">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-500 text-sm">통계 데이터 불러오는 중...</span>
            </div>
          ) : statisticsData ? (
            <>
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors duration-200"
                onClick={handleStatisticsToggle}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`/class-icons/${iconName}.png`}
                    alt={className}
                    className="w-5 h-5 object-contain brightness-0 invert opacity-50"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  <span className="font-semibold text-zinc-300 text-sm">{className} 클래스 통계</span>
                  {!showStatistics && (
                    <span className="text-[10px] border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10">
                      클릭하여 펼치기
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${showStatistics ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showStatistics && (
                <div className="border-t border-zinc-800 divide-y divide-zinc-800/60">

                  {/* Summary stats */}
                  <div className="grid grid-cols-3 divide-x divide-zinc-800/60">
                    {[
                      { label: '평균 점수', value: statisticsData.classStats.avgScore, accent: 'text-amber-400' },
                      { label: '평균 승률', value: `${statisticsData.classStats.avgWinRate}%`, accent: 'text-cyan-400' },
                      { label: '총 플레이어', value: `${statisticsData.classStats.totalPlayers}명`, accent: 'text-violet-400' },
                    ].map(s => (
                      <div key={s.label} className="px-5 py-4 text-center">
                        <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">{s.label}</div>
                        <div className={`text-2xl font-bold font-mono ${s.accent}`}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Subclass horizontal bars */}
                  <div className="px-5 py-4 space-y-2.5">
                    <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">전승 / 각성 분포</h4>
                    {statisticsData.classStats.subclassDistribution.map((item: any, i: number) => {
                      const barWidth = maxSubclassCount > 0 ? (item.count / maxSubclassCount) * 100 : 0
                      const isSeon = item.subclass === '전승'
                      return (
                        <div key={item.subclass} className="flex items-center gap-3">
                          <span className="text-[10px] text-zinc-600 font-mono w-4 text-right">{i + 1}</span>
                          <img
                            src={isSeon ? '/ponyang/ac.png' : '/ponyang/aw.png'}
                            alt={item.subclass}
                            className="w-5 h-5 object-contain opacity-70"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                          />
                          <span className={`text-xs w-10 ${isSeon ? 'text-cyan-400' : 'text-fuchsia-400'}`}>{item.subclass}</span>
                          <div className="flex-1 h-6 bg-zinc-800/80 rounded-sm overflow-hidden">
                            <div
                              className="h-full rounded-sm transition-all duration-500"
                              style={{
                                width: `${barWidth}%`,
                                background: isSeon ? 'rgba(6,182,212,0.25)' : 'rgba(217,70,239,0.2)',
                                borderLeft: isSeon ? '2px solid rgb(6,182,212)' : '2px solid rgb(217,70,239)',
                              }}
                            />
                          </div>
                          <div className="text-right w-20">
                            <span className="text-xs text-zinc-300 font-mono">{item.count}명</span>
                            <span className="text-[10px] text-zinc-500 ml-1.5">{item.percentage}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Tier distribution */}
                  <div className="px-5 py-4">
                    <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">티어별 분포</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {statisticsData.tierDistribution.map((item: any) => {
                        const iconFile = TIER_ICON_MAP[item.tier] || 'null'
                        const color = TIER_COLOR[item.tier] || { text: 'text-zinc-400', bar: 'bg-zinc-400', border: 'border-zinc-700' }
                        return (
                          <div
                            key={item.tier}
                            className={`bg-zinc-800/60 border rounded-lg p-3 text-center hover:bg-zinc-800 transition-colors ${color.border}`}
                          >
                            <img
                              src={`/solare-icons/${iconFile}.png`}
                              alt={item.tier}
                              className="w-10 h-10 object-contain mx-auto mb-2"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                            />
                            <div className={`text-sm font-bold ${color.text}`}>{item.percentage}%</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">{item.count}명</div>
                            <div className="w-full h-1 bg-zinc-700 rounded-full mt-2 overflow-hidden">
                              <div className={`h-full rounded-full ${color.bar}`} style={{ width: `${item.percentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Insight */}
                  {statisticsData.classStats.subclassDistribution.length > 0 && (
                    <div className="px-5 py-4">
                      <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{className} 인사이트</h4>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                          <span className="text-zinc-500">총 플레이어 <span className="text-cyan-400 font-semibold font-mono">{statisticsData.classStats.totalPlayers}명</span></span>
                          <span className="text-zinc-500">평균 점수 <span className="text-amber-400 font-semibold font-mono">{statisticsData.classStats.avgScore}점</span></span>
                          <span className="text-zinc-500">평균 승률 <span className="text-emerald-400 font-semibold font-mono">{statisticsData.classStats.avgWinRate}%</span></span>
                          {statisticsData.classStats.subclassDistribution[0] && (
                            <span className="text-zinc-500">
                              주류:{' '}
                              <span className="text-fuchsia-400 font-semibold">{statisticsData.classStats.subclassDistribution[0].subclass}</span>
                              {' '}({statisticsData.classStats.subclassDistribution[0].percentage}%)
                            </span>
                          )}
                          {statisticsData.tierDistribution[0] && (
                            <span className="text-zinc-500">
                              최다 티어:{' '}
                              <span className="text-orange-400 font-semibold">{statisticsData.tierDistribution[0].tier}</span>
                              {' '}({statisticsData.tierDistribution[0].percentage}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-zinc-600 text-sm">통계 데이터를 불러올 수 없습니다.</div>
          )}
        </div>

        {/* Tip */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-500">
          <span className="text-cyan-500/50 text-xs">✦</span>
          <span>
            <span className="hidden md:inline">가문명을 클릭하면</span>
            <span className="md:hidden">카드를 터치하면</span>
            {' '}해당 플레이어의 <span className="text-amber-400/70 font-semibold">특화</span>를 확인할 수 있습니다
          </span>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SolareTable data={data} />
        </div>
      </div>
    </div>
  )
}
