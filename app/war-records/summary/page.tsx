'use client'

export const dynamic = 'force-dynamic'

import { useState, Fragment, useCallback, useMemo } from 'react'
import PeriodSelector from '@/components/war-records/PeriodSelector'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { format, subDays, subMonths, subYears } from 'date-fns'
import Image from 'next/image'

const imageMap: Record<string, string> = {
  '칼페온': '/war-records/calfeon.png',
  '카마실비아': '/war-records/kamasylvia.png',
  '메디아': '/war-records/media.png',
  '발렌시아': '/war-records/balencia.png',
  '발레노스': '/war-records/balenos.png',
  '세렌디아': '/war-records/Serendia.png',
}

interface AllianceData {
  alliance_name: string
  guilds: string[]
  tiers: string[]
}

interface WarSummaryData {
  alliance_name: string
  count: number
  participated: number
}

interface RecentVictory {
  alliance_name: string
  war_date: string
  occupied_area: string
  region: string
}

interface GuildLeagueInfo {
  guild_name: string
  league_points: number
  league_rank: number
  league_tier: string
  wins: number
  losses: number
}

async function fetchWarSummary(period: string, tier: string): Promise<WarSummaryData[]> {
  const res = await fetch(`/api/war-records/summary?period=${period}&tier=${tier}`)
  if (!res.ok) throw new Error('Failed to fetch war summary')
  return res.json()
}

async function fetchAlliances(): Promise<AllianceData[]> {
  const res = await fetch('/api/war-records/alliances')
  if (!res.ok) throw new Error('Failed to fetch alliances')
  return res.json()
}

async function fetchRecentVictories(): Promise<RecentVictory[]> {
  const res = await fetch('/api/war-records/recent-victories')
  if (!res.ok) throw new Error('Failed to fetch recent victories')
  return res.json()
}

async function fetchGuildLeagueInfo(allianceName: string): Promise<GuildLeagueInfo[]> {
  try {
    const res = await fetch(`/api/war-records/guild-league?alliance_name=${encodeURIComponent(allianceName)}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch guild league info: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching guild league info:', error)
    return []
  }
}

async function fetchAllianceMarks(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/admin/alliance-marks')
    if (!res.ok) {
      throw new Error('Failed to fetch alliance marks')
    }
    const marks = await res.json()
    return marks.reduce((acc: Record<string, string>, mark: any) => {
      acc[mark.alliance_name] = mark.mark_url
      return acc
    }, {})
  } catch (error) {
    console.error('Error fetching alliance marks:', error)
    return {}
  }
}

export default function WarSummaryPage() {
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  const [expandedAlliances, setExpandedAlliances] = useState<Record<string, GuildLeagueInfo[] | undefined>>({})
  const [showRotationModal, setShowRotationModal] = useState(false)

  const { data: rankingByTier = { '무제한': [], '2단': [], '1단': [] } } = useQuery({
    queryKey: ['war-summary', selectedTab],
    queryFn: async () => {
      const tiers: ('무제한' | '2단' | '1단')[] = ['무제한', '2단', '1단']
      const results = await Promise.all(
        tiers.map(tier => fetchWarSummary(selectedTab, tier))
      )
      return { '무제한': results[0], '2단': results[1], '1단': results[2] }
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  const { data: alliances = [] } = useQuery({
    queryKey: ['alliances'],
    queryFn: fetchAlliances,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  const { data: recentVictories = [] } = useQuery({
    queryKey: ['recent-victories'],
    queryFn: fetchRecentVictories,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  const { data: allianceMarks = {} } = useQuery({
    queryKey: ['alliance-marks'],
    queryFn: fetchAllianceMarks,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  const toggleExpanded = useCallback(async (name: string) => {
    if (expandedAlliances[name]) {
      setExpandedAlliances(prev => ({ ...prev, [name]: undefined }))
    } else {
      const data = await fetchGuildLeagueInfo(name)
      setExpandedAlliances(prev => ({ ...prev, [name]: data }))
    }
  }, [expandedAlliances])

  const renderTableByTier = useCallback((tier: '무제한' | '2단' | '1단') => {
    const filtered = useMemo(() => 
      alliances
        .filter((a: AllianceData) => a.tiers.includes(tier))
        .filter((a: AllianceData) => {
          const allianceData = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === a.alliance_name)
          const participated = allianceData?.participated ?? 0
          
          // 모든 기간에서 참여 1회 이상인 연맹만 표시
          return participated >= 1
        })
        .sort((a: AllianceData, b: AllianceData) => {
          const aCount = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === a.alliance_name)?.count ?? 0
          const bCount = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === b.alliance_name)?.count ?? 0
          return bCount - aCount
        }),
      [alliances, rankingByTier, tier, selectedTab]
    )

    return (
      <section key={tier} className="mb-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🏰</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{tier}</h2>
          </div>
          {/* 데스크톱 테이블 */}
          <table className="w-full text-sm text-left hidden md:table" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b-2 border-indigo-500/40 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40">
                <th className="px-6 py-4 text-lg font-bold text-indigo-300 bg-slate-700/50 rounded-tl-lg" style={{ width: '30%' }}>
                  연맹명
                </th>
                <th className="px-6 py-4 text-lg font-bold text-indigo-300 bg-slate-700/50" style={{ width: '40%' }}>
                  소속 길드
                </th>
                <th className="px-6 py-4 text-lg font-bold text-indigo-300 bg-slate-700/50 text-center" style={{ width: '10%' }}>
                  참여
                </th>
                <th className="px-6 py-4 text-lg font-bold text-indigo-300 bg-slate-700/50 text-center" style={{ width: '10%' }}>
                  점령
                </th>
                <th className="px-6 py-4 text-lg font-bold text-indigo-300 bg-slate-700/50 text-center rounded-tr-lg whitespace-nowrap" style={{ width: '10%' }}>
                  승률
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: AllianceData) => {
                const main = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === a.alliance_name)
                const occupied = main?.count ?? 0
                const participated = main?.participated ?? occupied
                const winRate = participated > 0 ? Math.round((occupied / participated) * 100) : 0
                const winRateText = participated > 0 ? `${winRate}%` : '-'
                let winRateClass = ''
                if (winRate >= 80) winRateClass = 'text-rose-400 font-bold'
                else if (winRate >= 70) winRateClass = 'text-yellow-300 font-semibold'
                else winRateClass = 'text-white/80'
                const isExpanded = Array.isArray(expandedAlliances[a.alliance_name])

                return (
                  <Fragment key={a.alliance_name}>
                    <tr 
                      className="border-b border-slate-600/20 hover:bg-gradient-to-r hover:from-slate-700/40 hover:to-slate-600/40 transition-all duration-300 group cursor-pointer"
                      onClick={() => toggleExpanded(a.alliance_name)}
                    >
                      <td className="px-4 py-3 text-white font-bold text-base group-hover:bg-slate-600/20 rounded-l-lg" style={{ width: '28%' }}>
                        <Link 
                          href={`/alliance/${encodeURIComponent(a.alliance_name)}`}
                          className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group/link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {allianceMarks[a.alliance_name] ? (
                            <Image
                              src={allianceMarks[a.alliance_name]}
                              alt={`${a.alliance_name} 마크`}
                              width={20}
                              height={20}
                              className="w-5 h-5 rounded-full object-cover border border-slate-500 group-hover/link:scale-110 transition-transform duration-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">A</span>
                            </div>
                          )}
                          <span className="group-hover/link:text-blue-300 transition-colors duration-200 truncate" title={a.alliance_name}>{a.alliance_name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-base group-hover:bg-slate-600/20" style={{ width: '38%' }}>
                        <div className="truncate" title={a.guilds.join(', ')}>
                          <span className="font-medium">{a.guilds.join(', ')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-base group-hover:bg-slate-600/20" style={{ width: '12%' }}>
                        <div className="flex items-center justify-center">
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm font-bold border border-blue-500/30">
                            {participated}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-base group-hover:bg-slate-600/20" style={{ width: '12%' }}>
                        <div className="flex items-center justify-center">
                          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-sm font-bold border border-emerald-500/30">
                            {occupied}
                          </span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-center text-base group-hover:bg-slate-600/20 rounded-r-lg ${winRateClass}`} style={{ width: '10%' }}>
                        <div className="flex items-center justify-center gap-1">
                          <span className={`px-2 py-1 rounded text-sm font-bold border ${
                            winRate >= 80 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                            winRate >= 70 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                            winRate >= 50 ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }`}>
                            {winRateText}
                          </span>
                          <span 
                            className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300 hover:scale-110 text-sm"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                          >
                            ◀
                          </span>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <>
                        <tr className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border-t-2 border-indigo-500/40">
                          <th className="px-3 py-3 text-left text-indigo-300 text-sm font-bold bg-slate-700/50 rounded-tl-lg" style={{ width: '70px' }}>
                            순위
                          </th>
                          <th className="px-3 py-3 text-left text-indigo-300 text-sm font-bold bg-slate-700/50" style={{ width: '100px' }}>
                            길드명
                          </th>
                          <th className="px-3 py-3 text-center text-indigo-300 text-sm font-bold bg-slate-700/50" style={{ width: '140px' }}>
                            전적
                          </th>
                          <th className="px-3 py-3 text-center text-indigo-300 text-sm font-bold bg-slate-700/50" style={{ width: '80px' }}>
                            승률
                          </th>
                          <th className="px-3 py-3 text-center text-indigo-300 text-sm font-bold bg-slate-700/50 rounded-tr-lg" style={{ width: '80px' }}>
                            점수
                          </th>
                        </tr>
                        {expandedAlliances[a.alliance_name]?.map((guild, i) => (
                          <tr key={`guild-${a.alliance_name}-${i}`} className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 hover:from-slate-700/40 hover:to-slate-600/40 transition-all duration-300 group border-b border-slate-600/20">
                            <td className="px-2 py-3 text-left group-hover:bg-slate-600/20 rounded-l-lg" style={{ width: '70px' }}>
                              {guild.league_rank > 0 ? (
                                <span className="text-yellow-300 text-xs font-bold bg-slate-700/50 px-1.5 py-0.5 rounded">
                                  {guild.league_rank}위
                                </span>
                              ) : (
                                <span className="text-gray-500 text-sm">-</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-white text-sm group-hover:bg-slate-600/20" style={{ width: '100px' }}>
                              <Link 
                                href={`/guild/${encodeURIComponent(guild.guild_name)}`}
                                className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group/link"
                              >
                                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex-shrink-0 group-hover/link:scale-125 transition-transform duration-200"></div>
                                <span className="truncate font-medium text-sm">{guild.guild_name}</span>
                              </Link>
                            </td>
                            <td className="px-3 py-3 text-center text-sm group-hover:bg-slate-600/20" style={{ width: '140px' }}>
                              {guild.wins > 0 || guild.losses > 0 ? (
                                <span className="bg-slate-700/50 px-1.5 py-1 rounded text-sm font-bold text-white border border-slate-600/30 whitespace-nowrap">
                                  {guild.wins}승 / {guild.losses}패
                                </span>
                              ) : (
                                <span className="text-gray-500 text-sm bg-slate-700/30 px-1.5 py-0.5 rounded">-</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center text-sm group-hover:bg-slate-600/20" style={{ width: '80px' }}>
                              {guild.wins + guild.losses > 0 ? (
                                <div className="flex items-center justify-center">
                                  <span className={`px-1.5 py-1 rounded text-sm font-bold border whitespace-nowrap ${
                                    (guild.wins / (guild.wins + guild.losses)) * 100 >= 70 
                                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
                                      : (guild.wins / (guild.wins + guild.losses)) * 100 >= 50
                                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                      : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                  }`}>
                                    {Math.round((guild.wins / (guild.wins + guild.losses)) * 100)}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm bg-slate-700/30 px-1.5 py-0.5 rounded">-</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center text-sm group-hover:bg-slate-600/20 rounded-r-lg" style={{ width: '80px' }}>
                              {guild.league_points > 0 ? (
                                <div className="flex items-center justify-center">
                                  <span className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 px-1.5 py-1 rounded text-sm font-bold border border-amber-500/30 whitespace-nowrap">
                                    {guild.league_points}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm bg-slate-700/30 px-1.5 py-0.5 rounded">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>

          {/* 모바일 카드 레이아웃 - 간단하게 */}
        <div className="md:hidden space-y-2">
          {filtered.map((a: AllianceData) => {
            const main = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === a.alliance_name)
            const occupied = main?.count ?? 0
            const participated = main?.participated ?? occupied
            const winRate = participated > 0 ? Math.round((occupied / participated) * 100) : 0
            const winRateText = participated > 0 ? `${winRate}%` : '-'
            const isExpanded = Array.isArray(expandedAlliances[a.alliance_name])

            return (
              <div key={a.alliance_name} className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-xl p-4 border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-200">
                {/* 연맹명 */}
                <div className="flex items-center justify-between mb-3">
                  <Link 
                    href={`/alliance/${encodeURIComponent(a.alliance_name)}`}
                    className="font-bold text-white text-lg hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    {allianceMarks[a.alliance_name] ? (
                      <Image
                        src={allianceMarks[a.alliance_name]}
                        alt={`${a.alliance_name} 마크`}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    )}
                    {a.alliance_name}
                  </Link>
                  <button
                    onClick={() => toggleExpanded(a.alliance_name)}
                    className="text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-blue-500/20"
                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                  >
                    ◀
                  </button>
                </div>

                  {/* 전적 정보 */}
                  <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-blue-300 text-xs font-medium mb-1 whitespace-nowrap">참여</div>
                      <div className="font-bold text-blue-200 text-lg">{participated}</div>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-cyan-300 text-xs font-medium mb-1 whitespace-nowrap">점령</div>
                      <div className="font-bold text-cyan-200 text-lg">{occupied}</div>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-gray-300 text-xs font-medium mb-1 whitespace-nowrap">승률</div>
                      <div className="font-bold text-white text-lg">{winRateText}</div>
                    </div>
                  </div>

                  {/* 소속 길드 */}
                  <div className="text-xs text-gray-400 bg-slate-600/30 rounded-lg p-2">
                    <span className="text-gray-300 font-medium">길드:</span> {a.guilds.join(', ')}
                  </div>

                  {/* 확장된 길드 정보 */}
                  {isExpanded && expandedAlliances[a.alliance_name] && (
                    <div className="mt-4 pt-4 border-t border-gradient-to-r from-indigo-500/30 to-purple-500/30">
                      <div className="text-sm text-indigo-300 font-bold mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">⚔️</span>
                        </div>
                        길드리그 정보
                      </div>
                      <div className="space-y-4">
                        {expandedAlliances[a.alliance_name]?.map((guild, i) => (
                          <div key={`guild-${a.alliance_name}-${i}`} className="bg-gradient-to-br from-slate-600/50 to-slate-700/50 rounded-xl p-4 border border-slate-500/30 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg">
                            {/* 길드 헤더 */}
                            <div className="flex justify-between items-center mb-3">
                              <Link 
                                href={`/guild/${encodeURIComponent(guild.guild_name)}`}
                                className="text-white font-semibold hover:text-blue-400 text-base flex items-center gap-2 group/link"
                              >
                                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full group-hover/link:scale-125 transition-transform duration-200"></div>
                                <span className="truncate">{guild.guild_name}</span>
                              </Link>
                              {guild.league_rank > 0 && (
                                <div className="flex items-center gap-1">
                                  {guild.league_rank <= 3 ? (
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                      guild.league_rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900' :
                                      guild.league_rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900' :
                                      'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100'
                                    }`}>
                                      {guild.league_rank}
                                    </div>
                                  ) : (
                                    <span className="text-yellow-300 text-xs font-bold bg-slate-700/50 px-2 py-1 rounded-lg">
                                  {guild.league_rank}위
                                </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* 통계 그리드 */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-lg p-3 border border-slate-600/30">
                                <div className="text-gray-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                                  <span>📊</span>전적
                                </div>
                                <div className="text-sm">
                                  {guild.wins > 0 || guild.losses > 0 ? (
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-bold">
                                        {guild.wins}승
                                      </span>
                                      <span className="text-gray-400">/</span>
                                      <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-xs font-bold">
                                        {guild.losses}패
                                    </span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-xs">-</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-center bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-lg p-3 border border-slate-600/30">
                                <div className="text-gray-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                                  <span>📈</span>승률
                                </div>
                                <div className="text-sm">
                                  {guild.wins + guild.losses > 0 ? (
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                      (guild.wins / (guild.wins + guild.losses)) * 100 >= 70 
                                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
                                        : (guild.wins / (guild.wins + guild.losses)) * 100 >= 50
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                        : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                    }`}>
                                      {Math.round((guild.wins / (guild.wins + guild.losses)) * 100)}%
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">-</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-center bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-lg p-3 border border-slate-600/30">
                                <div className="text-gray-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                                  <span>⭐</span>점수
                                </div>
                                <div className="text-sm">
                                  {guild.league_points > 0 ? (
                                    <span className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 px-2 py-1 rounded text-xs font-bold border border-amber-500/30">
                                      {guild.league_points}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">-</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }, [alliances, rankingByTier, expandedAlliances, toggleExpanded])

  // 날짜 범위 계산
  const today = new Date()
  const weeklyStart = subDays(today, 6) // 오늘 포함 7일
  const monthlyStart = subMonths(today, 1)
  const yearlyStart = subYears(today, 1)
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')
  let periodText = ''
  if (selectedTab === 'weekly') {
    periodText = ` ${formatDate(weeklyStart)} ~ ${formatDate(today)}`
  } else if (selectedTab === 'monthly') {
    periodText = ` ${formatDate(monthlyStart)} ~ ${formatDate(today)}`
  } else if (selectedTab === 'yearly') {
    periodText = ` ${formatDate(yearlyStart)} ~ ${formatDate(today)}`
  }

  return (
    <>
      {/* 로테이션 수정 완료 모달 */}
      {showRotationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-xl">✅</span>
                </div>
                <h2 className="text-2xl font-bold text-green-400">거점전 로테이션 수정 완료</h2>
              </div>
              <button
                onClick={() => setShowRotationModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              <div className="text-gray-300 leading-relaxed">
                <p className="mb-4 text-lg">
                  <span className="text-yellow-300 font-semibold">6월 25일 이전</span>과 <span className="text-yellow-300 font-semibold">이후</span>의 
                  거점전 지역별 티어 로테이션이 올바르게 수정되었습니다.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-blue-300 font-bold text-lg mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      6월 25일 이전
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">발레노스/세렌디아:</span>
                        <span className="text-yellow-300 font-semibold">무제한</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">메디아/발렌시아:</span>
                        <span className="text-green-300 font-semibold">1단</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">칼페온/카마실비아:</span>
                        <span className="text-orange-300 font-semibold">2단</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-green-500/30">
                    <div className="text-green-300 font-bold text-lg mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      6월 25일 이후
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">발레노스/세렌디아:</span>
                        <span className="text-green-300 font-semibold">1단</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">메디아/발렌시아:</span>
                        <span className="text-orange-300 font-semibold">2단</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">칼페온/카마실비아:</span>
                        <span className="text-yellow-300 font-semibold">무제한</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 text-lg">🎯</span>
                    <span className="text-green-300 font-semibold">수정 결과</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    이제 연간 통계에서 정확한 티어별 집계가 표시됩니다. 
                    예를 들어 밤양갱의 경우 무제한에서 1/1, 2단에서 5/6으로 올바르게 표시됩니다.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowRotationModal(false)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto">
      {/* 개선된 헤더 섹션 */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🏰</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">연맹 점령 현황</h1>
                  <p className="text-gray-400 text-sm">현재 각 지역을 점령한 연맹 정보</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 items-center sm:items-end">
                <PeriodSelector
                  selected={selectedTab}
                  onChange={(val) => setSelectedTab(val as 'weekly' | 'monthly' | 'yearly')}
                />
                <div className="bg-slate-700/50 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-300">{periodText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 개선된 영지별 성주 섹션 */}
      {recentVictories.length > 0 && (
        <div className="mb-8 relative z-10">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-6 shadow-xl relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🏆</span>
              </div>
              <h2 className="text-2xl font-bold text-white">영지별 성주</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {['칼페온', '메디아', '발렌시아'].map((region) => {
                const regionVictory = recentVictories
                  .filter(v => v.region === region)
                  .sort((a, b) => new Date(b.war_date).getTime() - new Date(a.war_date).getTime())[0]

                return (
                  <div key={region} className="group bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-2xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    {/* 지역 이미지 */}
                    <div className="relative w-[140px] h-[160px] mx-auto mb-4">
                      <Image
                        src={imageMap[region]}
                        alt={region + ' 방패'}
                        fill
                        sizes="(max-width: 640px) 140px, 140px"
                        priority={region === '칼페온'}
                        className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* 지역명 */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{region}</h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>
                    
                    {/* 점령 연맹 정보 */}
                    <div className="text-center">
                      {regionVictory ? (
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {allianceMarks[regionVictory.alliance_name] && (
                              <Image
                                src={allianceMarks[regionVictory.alliance_name]}
                                alt={`${regionVictory.alliance_name} 마크`}
                                width={24}
                                height={24}
                                className="w-6 h-6 rounded-full object-cover border border-slate-500"
                              />
                            )}
                            <span className="text-sm text-gray-400">점령 연맹</span>
                          </div>
                          <div className="text-lg font-semibold text-blue-300 break-words">
                            {regionVictory.alliance_name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(regionVictory.war_date).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                          <div className="text-gray-500 text-sm">데이터 없음</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {renderTableByTier('무제한')}
        {renderTableByTier('2단')}
        {renderTableByTier('1단')}
      </div>

      <div className="mt-6 text-center text-gray-500 text-xs">
        출처: <a href="https://discord.gg/korbdo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">검은사막 통합 디스코드</a>
      </div>
      </div>
    </>
  )
}
