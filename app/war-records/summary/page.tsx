'use client'

export const dynamic = 'force-dynamic'

import { useState, Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { format, subDays, subMonths, subYears } from 'date-fns'
import Image from 'next/image'
import PeriodSelector from '@/components/war-records/PeriodSelector'

const SHIELD_IMAGES: Record<string, string> = {
  '칼페온': '/war-records/calfeon.png',
  '카마실비아': '/war-records/kamasylvia.png',
  '메디아': '/war-records/media.png',
  '발렌시아': '/war-records/balencia.png',
  '발레노스': '/war-records/balenos.png',
  '세렌디아': '/war-records/Serendia.png',
}

const TIER_LABELS: Record<'무제한' | '2단' | '1단', string> = {
  '무제한': '3단계 무제한',
  '2단': '2단계 제한',
  '1단': '1단계 제한',
}

const TIER_ACCENT: Record<'무제한' | '2단' | '1단', string> = {
  '무제한': 'oklch(0.7 0.28 340)',    // 마젠타 — 가장 높은 티어
  '2단':    'oklch(0.85 0.18 200)',   // 시안
  '1단':    'oklch(0.65 0.2 260)',    // 퍼플
}

interface AllianceData { alliance_name: string; guilds: string[]; tiers: string[] }
interface WarSummaryData { alliance_name: string; count: number; participated: number }
interface RecentVictory { alliance_name: string; war_date: string; occupied_area: string; region: string }
interface GuildLeagueInfo { guild_name: string; league_points: number; league_rank: number; league_tier: string; wins: number; losses: number }

async function fetchWarSummary(period: string, tier: string): Promise<WarSummaryData[]> {
  const res = await fetch(`/api/war-records/summary?period=${period}&tier=${tier}`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
async function fetchAlliances(): Promise<AllianceData[]> {
  const res = await fetch('/api/war-records/alliances')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
async function fetchRecentVictories(): Promise<RecentVictory[]> {
  const res = await fetch('/api/war-records/recent-victories')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
async function fetchGuildLeague(name: string): Promise<GuildLeagueInfo[]> {
  try {
    const res = await fetch(`/api/war-records/guild-league?alliance_name=${encodeURIComponent(name)}`)
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}
async function fetchAllianceMarks(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/admin/alliance-marks')
    if (!res.ok) return {}
    const marks = await res.json()
    return marks.reduce((acc: Record<string, string>, m: { alliance_name: string; mark_url: string }) => {
      acc[m.alliance_name] = m.mark_url; return acc
    }, {})
  } catch { return {} }
}

export default function WarSummaryPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  const [expanded, setExpanded] = useState<Record<string, GuildLeagueInfo[] | undefined>>({})

  const { data: ranking = { '무제한': [], '2단': [], '1단': [] } } = useQuery({
    queryKey: ['war-summary', period],
    queryFn: async () => {
      const tiers = ['무제한', '2단', '1단'] as const
      const [a, b, c] = await Promise.all(tiers.map(t => fetchWarSummary(period, t)))
      return { '무제한': a, '2단': b, '1단': c }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const { data: alliances = [] } = useQuery({
    queryKey: ['alliances'],
    queryFn: fetchAlliances,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const { data: victories = [] } = useQuery({
    queryKey: ['recent-victories'],
    queryFn: fetchRecentVictories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const { data: marks = {} } = useQuery({
    queryKey: ['alliance-marks'],
    queryFn: fetchAllianceMarks,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const toggle = async (name: string) => {
    if (expanded[name]) {
      setExpanded(p => ({ ...p, [name]: undefined }))
    } else {
      const data = await fetchGuildLeague(name)
      setExpanded(p => ({ ...p, [name]: data }))
    }
  }

  const today = new Date()
  const rangeStart = period === 'weekly' ? subDays(today, 6) : period === 'monthly' ? subMonths(today, 1) : subYears(today, 1)

  const getFilteredRanking = (tier: '무제한' | '2단' | '1단') =>
    alliances
      .filter(a => a.tiers.includes(tier) && (ranking[tier].find(r => r.alliance_name === a.alliance_name)?.participated ?? 0) >= 1)
      .map(a => {
        const r = ranking[tier].find(r => r.alliance_name === a.alliance_name)
        const occupied = r?.count ?? 0
        const participated = r?.participated ?? 0
        const winRate = participated > 0 ? Math.round((occupied / participated) * 100) : 0
        return { ...a, occupied, participated, winRate }
      })
      .sort((a, b) => b.occupied - a.occupied)

  return (
    <div className="space-y-6">

      {/* 헤더 + 기간 선택 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white">연맹 점령 현황</h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            {format(rangeStart, 'MM.dd')} – {format(today, 'MM.dd')}
          </p>
        </div>
        <PeriodSelector selected={period} onChange={v => setPeriod(v as 'weekly' | 'monthly' | 'yearly')} />
      </div>

      {/* 영지별 성주 — 가로 배너 */}
      {victories.length > 0 && (
        <div
          className="rounded-xl overflow-hidden border border-zinc-800/50"
          style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.7 0.28 340)' }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]"
            style={{ background: 'oklch(0.12 0.02 270)' }}
          >
            <span>🏆</span>
            <span className="text-sm font-bold text-white">공성(점령)전 현황</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/[0.05]">
            {['칼페온', '메디아', '발렌시아'].map(region => {
              const v = victories
                .filter(x => x.region === region)
                .sort((a, b) => new Date(b.war_date).getTime() - new Date(a.war_date).getTime())[0]
              return (
                <div key={region} className="flex items-center gap-3 px-5 py-4">
                  <div className="relative w-10 h-12 shrink-0">
                    <Image src={SHIELD_IMAGES[region]} alt={region} fill sizes="40px" className="object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-600 mb-0.5">{region}</p>
                    {v ? (
                      <>
                        {marks[v.alliance_name] && (
                          <Image src={marks[v.alliance_name]} alt="" width={14} height={14} className="w-3.5 h-3.5 rounded-full object-cover inline mr-1" />
                        )}
                        <span className="text-xs font-semibold text-zinc-100 truncate">{v.alliance_name}</span>
                        <p className="text-[10px] text-zinc-600 mt-0.5">
                          {new Date(v.war_date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
                        </p>
                      </>
                    ) : (
                      <span className="text-xs text-zinc-700">기록 없음</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 티어별 랭킹 */}
      {(['무제한', '2단', '1단'] as const).map(tier => {
        const rows = getFilteredRanking(tier)
        const accent = TIER_ACCENT[tier]

        return (
          <div
            key={tier}
            className="rounded-xl overflow-hidden border border-zinc-800/50"
            style={{ background: 'oklch(0.1 0.015 270)', borderTop: `2px solid ${accent}` }}
          >
            {/* 티어 헤더 */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]"
              style={{ background: 'oklch(0.12 0.02 270)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🏰</span>
                <h2 className="text-sm font-bold text-white">{TIER_LABELS[tier]}</h2>
              </div>
              <span className="text-xs text-zinc-600">{rows.length}개 연맹</span>
            </div>

            {rows.length === 0 ? (
              <div className="py-8 text-center text-zinc-700 text-xs">해당 기간에 참여한 연맹이 없습니다.</div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {rows.map((a, idx) => {
                  const isExpanded = Array.isArray(expanded[a.alliance_name])
                  const barWidth = `${a.winRate}%`

                  return (
                    <Fragment key={a.alliance_name}>
                      {/* 연맹 행 */}
                      <div
                        className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.025] transition-colors cursor-pointer group"
                        onClick={() => toggle(a.alliance_name)}
                      >
                        {/* 순위 */}
                        <span className="w-6 text-right text-xs text-zinc-600 tabular-nums shrink-0">{idx + 1}</span>

                        {/* 연맹 마크 */}
                        {marks[a.alliance_name] ? (
                          <Image src={marks[a.alliance_name]} alt="" width={28} height={28} className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0">
                            <span className="text-[10px] text-zinc-500 font-bold">{a.alliance_name.charAt(0)}</span>
                          </div>
                        )}

                        {/* 연맹명 + 길드 */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/alliance/${encodeURIComponent(a.alliance_name)}`}
                            className="text-sm font-semibold text-zinc-200 hover:text-[oklch(0.85_0.18_200)] transition-colors truncate block"
                            onClick={e => e.stopPropagation()}
                          >
                            {a.alliance_name}
                          </Link>
                          <p className="text-[11px] text-zinc-600 truncate mt-0.5">{a.guilds.join(' · ')}</p>
                        </div>

                        {/* 통계 */}
                        <div className="hidden sm:flex items-center gap-6 shrink-0">
                          <div className="text-center">
                            <p className="text-[10px] text-zinc-600 mb-0.5">참여</p>
                            <p className="text-xs text-zinc-400 tabular-nums font-medium">{a.participated}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-zinc-600 mb-0.5">점령</p>
                            <p className="text-sm text-zinc-200 tabular-nums font-bold">{a.occupied}</p>
                          </div>
                          {/* 승률 바 */}
                          <div className="w-24">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-zinc-600">승률</span>
                              <span className={`text-xs font-semibold tabular-nums ${
                                a.winRate >= 80 ? 'text-red-400' : a.winRate >= 60 ? 'text-[oklch(0.85_0.18_200)]' : 'text-zinc-400'
                              }`}>
                                {a.participated > 0 ? `${a.winRate}%` : '-'}
                              </span>
                            </div>
                            <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: a.participated > 0 ? barWidth : '0%',
                                  background: a.winRate >= 80 ? 'oklch(0.65 0.25 25)' : a.winRate >= 60 ? accent : 'oklch(0.45 0.02 270)',
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 모바일 간략 통계 */}
                        <div className="sm:hidden flex items-center gap-3 shrink-0 text-right">
                          <div>
                            <p className="text-[10px] text-zinc-600">점령</p>
                            <p className="text-sm font-bold text-zinc-200 tabular-nums">{a.occupied}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-600">승률</p>
                            <p className={`text-xs font-semibold tabular-nums ${a.winRate >= 80 ? 'text-red-400' : a.winRate >= 60 ? 'text-[oklch(0.85_0.18_200)]' : 'text-zinc-400'}`}>
                              {a.participated > 0 ? `${a.winRate}%` : '-'}
                            </p>
                          </div>
                        </div>

                        {/* 확장 화살표 */}
                        <span className={`text-zinc-700 text-[10px] shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                      </div>

                      {/* 길드리그 확장 */}
                      {isExpanded && expanded[a.alliance_name] && (
                        <div
                          className="border-t border-white/[0.05] px-5 py-3"
                          style={{ background: 'oklch(0.085 0.012 270)' }}
                        >
                          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2.5">길드리그 현황</p>
                          <div className="space-y-1.5">
                            {expanded[a.alliance_name]?.map((g, i) => {
                              const total = g.wins + g.losses
                              const gRate = total > 0 ? Math.round((g.wins / total) * 100) : 0
                              return (
                                <div key={i} className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                                  {g.league_rank > 0 && (
                                    <span className="text-[10px] text-zinc-600 tabular-nums w-7 text-right shrink-0">{g.league_rank}위</span>
                                  )}
                                  <Link
                                    href={`/guild/${encodeURIComponent(g.guild_name)}`}
                                    className="text-xs text-zinc-300 hover:text-[oklch(0.85_0.18_200)] transition-colors flex-1 min-w-0 truncate"
                                  >
                                    {g.guild_name}
                                  </Link>
                                  <div className="flex items-center gap-4 text-xs tabular-nums text-right shrink-0">
                                    <span className="text-zinc-500">{total > 0 ? `${g.wins}승 ${g.losses}패` : '-'}</span>
                                    <span className={`w-10 ${gRate >= 70 ? 'text-red-400' : 'text-zinc-400'}`}>
                                      {total > 0 ? `${gRate}%` : '-'}
                                    </span>
                                    <span className="text-zinc-200 font-semibold w-10 text-right">
                                      {g.league_points > 0 ? g.league_points : '-'}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </Fragment>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      <p className="text-center text-zinc-700 text-xs">
        출처:{' '}
        <a href="https://discord.gg/korbdo" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-500 transition-colors">
          검은사막 통합 디스코드
        </a>
      </p>
    </div>
  )
}
