'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import ClassSelector from '@/components/solare/ClassSelector'
import SeasonSelector from '@/components/solare/SeasonSelector'
import SolareTable from '@/components/solare/SolareTable'
import { getTier } from '@/lib/utils/tier'
import PonyangLoading from '@/components/shared/PonyangLoading'
import SolareWithNotice from '../components/SolareWithNotice'

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

const TIER_COLOR: Record<string, string> = {
  '솔라레': 'from-amber-400 to-yellow-500',
  '영광의 창': 'from-sky-400 to-blue-500',
  '여명의 창': 'from-purple-400 to-violet-500',
  '불꽃의 창': 'from-red-400 to-rose-500',
  '노을의 창': 'from-orange-400 to-amber-500',
  '숙련된 병사': 'from-emerald-400 to-green-500',
  '견습 병사': 'from-zinc-400 to-zinc-500',
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
  tier?: string
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
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' },
    })
      .then(async res => {
        if (!res.ok) throw new Error(`${res.status}`)
        return JSON.parse(await res.text())
      })
      .then((response: { data: Entry[], lastUpdated: string | null } | Entry[]) => {
        let raw: Entry[]
        let lastUpdated: string | null = null
        if (Array.isArray(response)) { raw = response }
        else { raw = response.data; lastUpdated = response.lastUpdated }
        setData(raw.map(e => ({ ...e, tier: e.tier || getTier(e.score) })))
        setLoading(false)
        if (lastUpdated) {
          const kst = new Date(new Date(lastUpdated).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
          setUpdateDate(kst.toISOString().split('T')[0])
        }
      })
      .catch(() => setLoading(false))
  }, [])

  const fetchStatistics = useCallback(async () => {
    if (statisticsData) return
    setStatisticsLoading(true)
    try {
      const res = await fetch('/api/solare-league/statistics', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' },
      })
      if (res.ok) setStatisticsData(await res.json())
    } catch { /* silent */ }
    finally { setStatisticsLoading(false) }
  }, [statisticsData])

  useEffect(() => {
    const urlSeasonId = searchParams.get('seasonId')
    const init = async () => {
      try {
        if (urlSeasonId) {
          const id = parseInt(urlSeasonId); setSelectedSeasonId(id); fetchData(id)
        } else {
          const seasons = await (await fetch('/api/admin/solare/seasons')).json()
          const active = seasons.find((s: any) => s.is_active)
          if (active) { setSelectedSeasonId(active.id); fetchData(active.id) }
          else {
            const sorted = seasons.sort((a: any, b: any) => b.season_number - a.season_number)
            if (sorted.length > 0) { setSelectedSeasonId(sorted[0].id); fetchData(sorted[0].id) }
            else { setSelectedSeasonId(null); fetchData() }
          }
        }
      } catch { fetchData() }
    }
    init(); fetchStatistics()
  }, [searchParams, fetchData, fetchStatistics])

  const handleSeasonChange = useCallback((id: number | null) => {
    setSelectedSeasonId(id); fetchData(id)
  }, [fetchData])

  const handleStatisticsToggle = useCallback(() => {
    setShowStatistics(p => !p)
    if (!showStatistics && !statisticsData) fetchStatistics()
  }, [showStatistics, statisticsData, fetchStatistics])

  if (loading) return <PonyangLoading />

  return (
    <SolareWithNotice>
      <div className="px-3 md:px-6 py-6 max-w-[1490px] mx-auto space-y-4">

        {/* ── Header ── */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20"
          style={{ boxShadow: '0 0 60px rgba(6,182,212,0.07)' }}>
          <div
            className="absolute inset-0 opacity-25"
            style={{ backgroundImage: "url('/ponyang/sorare-bg.png')", backgroundSize: '100% auto', backgroundPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/90" />

          <div className="relative hidden md:flex items-center justify-between gap-6 px-8 py-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 shrink-0"
                style={{ boxShadow: '0 0 24px rgba(6,182,212,0.2)' }}>
                <img src="/icons/rank1.png" alt="솔라레의 창" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">솔라레의 창</h1>
                <p className="text-cyan-400 text-sm font-medium mt-1">정규 시즌 순위</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {updateDate && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-sm text-zinc-300">
                  <span className="text-cyan-400">📅</span>{updateDate}
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-sm text-zinc-300">
                <span className="text-cyan-400">⏰</span>매일 오전 업데이트
              </div>
            </div>
          </div>

          <div className="relative md:hidden px-4 py-4 space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">솔라레의 창</h1>
            <p className="text-cyan-400 text-xs">정규 시즌 순위</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {updateDate && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-xs text-zinc-300">
                  <span className="text-cyan-400">📅</span>{updateDate}
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-xs text-zinc-300">
                <span className="text-cyan-400">⏰</span>매일 오전 업데이트
              </div>
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <SeasonSelector onSeasonChange={handleSeasonChange} selectedSeasonId={selectedSeasonId} />
            <ClassSelector selectedSeasonId={selectedSeasonId} />
          </div>
        </div>

        {/* ── Statistics ── */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
          {statisticsLoading ? (
            <div className="flex items-center justify-center py-8 gap-3">
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-500 text-sm">통계 데이터 불러오는 중...</span>
            </div>
          ) : statisticsData ? (
            <>
              {/* Toggle header */}
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition-colors duration-200"
                onClick={handleStatisticsToggle}
              >
                <div className="flex items-center gap-3">
                  <img src="/solare-icons/solare.png" alt="" className="w-5 h-5 object-contain" />
                  <span className="font-semibold text-white text-sm">솔라레의 창 통계</span>
                  {!showStatistics && (
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                      클릭하여 펼치기
                    </span>
                  )}
                </div>
                <svg className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${showStatistics ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showStatistics && (
                <div className="border-t border-zinc-800">

                  {/* ── Summary stats row ── */}
                  <div className="grid grid-cols-2 gap-px bg-zinc-800">
                    <div className="bg-zinc-900/60 px-6 py-4">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">평균 점수</div>
                      <div className="text-2xl font-bold text-amber-400 font-mono">{statisticsData.totalStats.avg_score}</div>
                    </div>
                    <div className="bg-zinc-900/60 px-6 py-4">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">평균 승률</div>
                      <div className="text-2xl font-bold text-cyan-400 font-mono">{statisticsData.totalStats.avg_win_rate}%</div>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">

                    {/* ── Class pick rate (horizontal bar chart) ── */}
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-3 bg-cyan-400 rounded-full inline-block" />
                        클래스 픽률 TOP {Math.min(statisticsData.classDistribution.length, 12)}
                      </h4>
                      <div className="space-y-2">
                        {statisticsData.classDistribution.slice(0, 12).map((item: any, i: number) => {
                          const maxCount = statisticsData.classDistribution[0]?.count || 1
                          const barWidth = Math.round((item.count / maxCount) * 100)
                          const iconName = CLASS_ICON_MAP[item.class] || item.class.toLowerCase()
                          const subs = statisticsData.classSubclassDistribution?.filter(
                            (s: any) => s.class === item.class && s.subclass !== '일반'
                          ) || []
                          const 전승 = subs.find((s: any) => s.subclass === '전승')
                          const 각성 = subs.find((s: any) => s.subclass === '각성')
                          const 전승Pct = 전승?.percentage || 0
                          const 각성Pct = 각성?.percentage || 0
                          const hasSubclass = 전승Pct > 0 || 각성Pct > 0

                          return (
                            <div key={item.class} className="flex items-center gap-3 group">
                              {/* Rank number */}
                              <span className="text-[10px] text-zinc-600 font-mono w-4 text-right flex-shrink-0">{i + 1}</span>

                              {/* Class icon */}
                              <img
                                src={`/class-icons/${iconName}.png`}
                                alt={item.class}
                                className="w-5 h-5 object-contain brightness-0 invert opacity-50 flex-shrink-0"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                              />

                              {/* Class name */}
                              <span className="text-xs text-zinc-300 w-16 flex-shrink-0">{item.class}</span>

                              {/* Bar */}
                              <div className="flex-1 h-5 bg-zinc-800/80 rounded-sm overflow-hidden relative">
                                {/* Main bar */}
                                <div
                                  className="absolute inset-y-0 left-0 transition-all duration-500"
                                  style={{ width: `${barWidth}%`, background: 'rgba(6,182,212,0.25)' }}
                                />
                                {/* Subclass split inside bar */}
                                {hasSubclass && (
                                  <div className="absolute inset-y-0 left-0 flex" style={{ width: `${barWidth}%` }}>
                                    {전승Pct > 0 && (
                                      <div className="h-full" style={{ width: `${전승Pct}%`, background: 'rgba(6,182,212,0.5)' }} />
                                    )}
                                    {각성Pct > 0 && (
                                      <div className="h-full" style={{ width: `${각성Pct}%`, background: 'rgba(232,121,249,0.4)' }} />
                                    )}
                                  </div>
                                )}
                                {/* Label inside bar */}
                                <div className="absolute inset-0 flex items-center px-2">
                                  {hasSubclass && (
                                    <span className="text-[9px] text-white/40 font-mono">
                                      {전승 && `전${전승.count}`}
                                      {전승 && 각성 && ' · '}
                                      {각성 && `각${각성.count}`}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Count + percentage */}
                              <div className="text-right flex-shrink-0 w-20">
                                <span className="text-xs text-zinc-300 font-mono">{item.count}명</span>
                                <span className="text-[10px] text-zinc-500 ml-1.5">{item.percentage}%</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* ── Tier distribution ── */}
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-3 bg-amber-400 rounded-full inline-block" />
                        티어별 분포
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {statisticsData.tierDistribution.map((item: any) => {
                          const iconFile = TIER_ICON_MAP[item.tier] || 'null'
                          const colorClass = TIER_COLOR[item.tier] || 'from-zinc-500 to-zinc-600'
                          return (
                            <div
                              key={item.tier}
                              className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3 flex flex-col items-center gap-1.5 hover:border-zinc-600 transition-colors"
                            >
                              <img
                                src={`/solare-icons/${iconFile}.png`}
                                alt={item.tier}
                                className="w-9 h-9 object-contain"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                              />
                              <div className="text-[9px] text-white/60 font-semibold text-center leading-tight">{item.tier}</div>
                              <div className="text-sm font-bold text-white font-mono">{item.count}<span className="text-[9px] text-zinc-500 font-normal ml-0.5">명</span></div>
                              <div className="text-xs font-bold text-cyan-400">{item.percentage}%</div>
                              <div className="w-full h-1 bg-zinc-700 rounded-full">
                                <div className={`h-full rounded-full bg-gradient-to-r ${colorClass}`} style={{ width: `${item.percentage}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* ── Insight ── */}
                    {statisticsData.classDistribution.length > 0 && (
                      <div className="bg-zinc-800/30 border border-zinc-700/40 rounded-xl px-4 py-3">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">인사이트</div>
                        <ul className="space-y-1 text-xs text-zinc-400">
                          <li>가장 많이 플레이하는 클래스: <span className="text-cyan-400 font-semibold">{statisticsData.classDistribution[0]?.class}</span> ({statisticsData.classDistribution[0]?.percentage}%)</li>
                          <li>가장 많이 분포한 티어: <span className="text-amber-400 font-semibold">{statisticsData.tierDistribution[0]?.tier}</span> ({statisticsData.tierDistribution[0]?.percentage}%)</li>
                          {statisticsData.classAverageScore?.length > 0 && (
                            <li>가장 높은 평균 점수 클래스: <span className="text-fuchsia-400 font-semibold">{statisticsData.classAverageScore[0]?.class}</span> ({statisticsData.classAverageScore[0]?.avg_score}점)</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-zinc-600 text-sm">통계 데이터를 불러올 수 없습니다.</div>
          )}
        </div>

        {/* ── Tip ── */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-sm text-cyan-300/70">
          <span className="text-cyan-400/60 text-xs shrink-0">◆</span>
          <span>가문명을 클릭하면 해당 플레이어의 <span className="text-amber-400 font-semibold">특화</span>를 확인할 수 있습니다</span>
        </div>

        {/* ── Ranking Table ── */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
          <SolareTable data={data} />
        </div>
      </div>
    </SolareWithNotice>
  )
}
