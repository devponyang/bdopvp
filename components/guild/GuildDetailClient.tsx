"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/card"
import Image from "next/image"
import Link from "next/link"
import { FaTrophy } from "react-icons/fa"
import MemberTrendChart from "@/components/charts/MemberTrendChart"
import RankTrendChart from "@/components/charts/RankTrendChart"
import GuildAchievementsSection from "@/components/guild/GuildAchievementsSection"
import FavoriteButton from "@/components/FavoriteButton"

interface GuildMark {
  id: number
  guild_name: string
  mark_url: string
  created_at: string
  updated_at: string
}

interface GuildDetail {
  name: string
  leader: string
  member_count: number
  creation_date: string
  rank: number | null
  wins: number
  losses: number
  winRate: number
  updated_at: string
  icon_url?: string
  alliance_name?: string
  members: string[]
  joinCount: number
  leaveCount: number
  history: { date: string, join: number, leave: number }[]
}

interface AllianceWarStats {
  totalWins: number
  totalLosses: number
  totalWinRate: number
  tiers: string[]
}

export default function GuildDetailClient({ guild }: { guild: GuildDetail }) {
  const [guildMark, setGuildMark] = useState<GuildMark | null>(null)
  const [allianceWarStats, setAllianceWarStats] = useState<AllianceWarStats | null>(null)

  // ✅ 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ✅ 최근 3개월 데이터 보장 (빈 달 채우기)
  const getRecentThreeMonthsData = () => {
    const now = new Date()
    const months = []
    
    // 최근 3개월 생성
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = date.toISOString().slice(0, 7) // YYYY-MM 형식
      months.push(monthStr)
    }
    
    // 기존 데이터와 병합
    const dataMap = new Map(guild.history.map(item => [item.date, item]))
    
    return months.map(month => ({
      date: month,
      join: dataMap.get(month)?.join || 0,
      leave: dataMap.get(month)?.leave || 0,
    }))
  }

  // ✅ 길드마크 정보 가져오기
  useEffect(() => {
    const fetchGuildMark = async () => {
      try {
        const response = await fetch(`/api/guild-marks?guild_name=${encodeURIComponent(guild.name)}`)
        if (response.ok) {
          const mark = await response.json()
          setGuildMark(mark)
        }
      } catch (error) {
        console.error('길드마크 정보를 불러오는데 실패했습니다:', error)
      }
    }

    fetchGuildMark()
  }, [guild.name])

  // ✅ 연맹 거점전 전적 가져오기
  useEffect(() => {
    const fetchAllianceWarStats = async () => {
      if (!guild.alliance_name) return

      try {
        const response = await fetch(`/api/alliance-detail?name=${encodeURIComponent(guild.alliance_name)}`)
        if (response.ok) {
          const data = await response.json()
          setAllianceWarStats({
            totalWins: data.totalWins,
            totalLosses: data.totalLosses,
            totalWinRate: data.totalWinRate,
            tiers: data.tiers || []
          })
        }
      } catch (error) {
        console.error('연맹 거점전 전적을 불러오는데 실패했습니다:', error)
      }
    }

    fetchAllianceWarStats()
  }, [guild.alliance_name])

  const tierColors = {
    '무제한': 'text-red-400 border-red-400',
    '2단': 'text-yellow-400 border-yellow-400',
    '1단': 'text-blue-400 border-blue-400'
  }

  const renderTrophy = () => {
    if (guild.rank === 1) return <FaTrophy className="w-4 h-4 inline text-yellow-400" title="1위" />
    if (guild.rank === 2) return <FaTrophy className="w-4 h-4 inline text-gray-300" title="2위" />
    if (guild.rank === 3) return <FaTrophy className="w-4 h-4 inline text-orange-500" title="3위" />
    return null
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      {/* 고사리 길드 추모 공지 */}
      {guild.name === '고사리' && (
        <Card className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <span className="text-3xl">🕊️</span>
              Explorer님을 추모하며
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-2">
              <p>고사리 길드의 Explorer님의 갑작스러운 별세 소식을 전해드립니다.</p>
              <p>검은사막이라는 게임을 통해 만난 동료를 잃은 것은 정말 가슴 아픈 일입니다.</p>
              <p>Explorer님의 명복을 빌며 추모의 마음을 전합니다.</p>
              <p>게임 속에서도, 현실에서도 소중한 사람들이 건강하고 행복하기를 바랍니다.</p>
              <p>작은 인연이라도 소중히 여기며 살아가시길 바랍니다.</p>
              <div className="pt-4">
                <p className="text-lg font-semibold">🕊️ 삼가 고인의 명복을 빕니다.</p>
                <p className="text-sm text-gray-400 mt-2">- BDOPVP-포냥이 개발자 -</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 메인 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/ponyang/guild-bg.jpg')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 40%"
          }}
        ></div>
        
        {/* 콘텐츠 */}
        <div className="relative p-6 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* 왼쪽: 길드 아이콘과 제목 */}
            <div className="flex items-center gap-6">
              {/* 길드 아이콘 */}
              <Image
                src={guildMark?.mark_url || guild.icon_url || "/guild-icons/default.png"}
                alt="길드 마크"
                width={112}
                height={112}
                className="w-28 h-28 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/guild-icons/default.png'
                }}
              />
              
              {/* 제목 블록 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {guildMark && (
                    <span className="sponsor-badge flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-full shadow-lg">
                      <Image
                        src="/logo.png"
                        alt="BDOPonyang 로고"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      후원
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {guild.name}
                  </h1>
                  {guild.rank && guild.rank <= 3 && (
                    <div className="text-4xl">{renderTrophy()}</div>
                  )}
                  <FavoriteButton guildName={guild.name} />
                </div>
                {allianceWarStats && allianceWarStats.tiers.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {allianceWarStats.tiers.map(tier => (
                      <span key={tier} className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${tierColors[tier as keyof typeof tierColors] || 'text-gray-400 border-gray-400'}`}>
                        {tier}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* 오른쪽: 주요 정보 */}
            <div className="flex flex-col gap-2 min-w-[200px]">
              {/* 대장 */}
              <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-xl px-4 py-3 border border-white/20">
                <div className="text-white/70 text-sm">대장</div>
                <div className="text-white text-xl font-bold">{guild.leader}</div>
              </div>
              
              {/* 길드원 수 */}
              <div className="bg-gradient-to-r from-slate-800/90 to-purple-900/90 rounded-xl px-4 py-3 border border-white/20">
                <div className="text-white/70 text-sm">길드원 수</div>
                <div className="text-white text-2xl font-bold">{guild.member_count}명</div>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden space-y-4">
            {/* 상단: 길드 아이콘과 제목 */}
            <div className="flex items-center gap-4">
              <Image
                src={guildMark?.mark_url || guild.icon_url || "/guild-icons/default.png"}
                alt="길드 마크"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/guild-icons/default.png'
                }}
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  {guildMark && (
                    <span className="sponsor-badge flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-semibold rounded-full shadow-lg">
                      <Image
                        src="/logo.png"
                        alt="BDOPonyang 로고"
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                      후원
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className="text-2xl font-bold text-white">
                    {guild.name}
                  </h1>
                  {guild.rank && guild.rank <= 3 && (
                    <div className="text-2xl">{renderTrophy()}</div>
                  )}
                  <FavoriteButton guildName={guild.name} />
                </div>
                {allianceWarStats && allianceWarStats.tiers.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    {allianceWarStats.tiers.map(tier => (
                      <span key={tier} className={`px-2 py-1 rounded-lg text-xs font-bold border ${tierColors[tier as keyof typeof tierColors] || 'text-gray-400 border-gray-400'}`}>
                        {tier}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* 하단: 정보 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-lg px-3 py-2 border border-white/20">
                <div className="text-white/70 text-xs">대장</div>
                <div className="text-white text-base font-bold truncate">{guild.leader}</div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800/90 to-purple-900/90 rounded-lg px-3 py-2 border border-white/20">
                <div className="text-white/70 text-xs">길드원 수</div>
                <div className="text-white text-xl font-bold">{guild.member_count}명</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 카드 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          상세 정보
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 연맹 카드 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-4 sm:p-5 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏰</span>
                </div>
                <span className="text-xs sm:text-sm text-purple-300 font-semibold">연맹</span>
              </div>
              <div className="text-base sm:text-lg font-bold truncate">
                {guild.alliance_name ? (
                  <Link 
                    href={`/alliance/${encodeURIComponent(guild.alliance_name)}`}
                    className="text-blue-300 hover:text-blue-200 transition-colors group-hover:text-blue-200"
                  >
                    {guild.alliance_name}
                  </Link>
                ) : (
                  <span className="text-gray-400 text-sm">소속 연맹 없음</span>
                )}
              </div>
            </div>
          </div>
          
          {/* 거점전 전적 카드 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-4 sm:p-5 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏯</span>
                </div>
                <span className="text-xs sm:text-sm text-cyan-300 font-semibold">거점전 전적</span>
              </div>
              {allianceWarStats ? (
                <div className="space-y-2">
                  <div className="text-base sm:text-lg font-bold">
                    <span className="text-green-300">{allianceWarStats.totalWins}승</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-red-300">{allianceWarStats.totalLosses}패</span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${allianceWarStats.totalWinRate >= 70 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-gray-300'}`}>
                      승률 {allianceWarStats.totalWinRate}%
                    </span>
                  </div>
                </div>
              ) : guild.alliance_name ? (
                <div className="text-sm text-gray-400">로딩 중...</div>
              ) : (
                <div className="text-sm text-gray-400">연맹 없음</div>
              )}
            </div>
          </div>
          
          {/* 길드리그 전적 카드 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-4 sm:p-5 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚔️</span>
                </div>
                <span className="text-xs sm:text-sm text-red-300 font-semibold">길드리그 전적</span>
              </div>
              <div className="space-y-2">
                <div className="text-base sm:text-lg font-bold">
                  <span className="text-green-300">{guild.wins}승</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-red-300">{guild.losses}패</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${guild.winRate >= 70 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-gray-300'}`}>
                    승률 {guild.winRate.toFixed(1)}%
                  </span>
                  {guild.rank && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded-lg">
                      {guild.rank}위
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 길드 생성일 카드 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 sm:p-5 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <span className="text-xs sm:text-sm text-green-300 font-semibold">길드 생성일</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {new Date(guild.creation_date).toLocaleDateString("ko-KR")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          길드 활동 그래프
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 bg-white/5 rounded-xl p-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <span>👥</span>
              최근 3개월 길드원 가입/탈퇴 현황
            </h3>
            <MemberTrendChart data={getRecentThreeMonthsData()} currentMemberCount={guild.member_count} />
          </div>
          <div className="w-full md:w-1/2 bg-white/5 rounded-xl p-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <span>📈</span>
              길드리그 순위 그래프
            </h3>
            <RankTrendChart guildName={guild.name} />
          </div>
        </div>
      </div>

      {/* 길드 업적 */}
      <GuildAchievementsSection guildName={guild.name} />

      {/* 길드원 목록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">👥</span>
          길드원 목록
          <span className="text-base font-normal text-gray-300 ml-2">({guild.members.length}명)</span>
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {guild.members.map((name) => (
            <li 
              key={name} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg px-4 py-3 text-gray-200 text-center font-medium border border-white/10"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
