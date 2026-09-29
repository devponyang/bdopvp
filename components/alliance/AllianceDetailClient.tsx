"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FaTrophy, FaUsers, FaFistRaised } from "react-icons/fa"
import { getRegionTier } from "@/lib/constants/war-tiers"

interface AllianceGuild {
  name: string
  memberCount: number
  leader: string
  iconUrl?: string
  rank: number | null
  wins: number
  losses: number
  winRate: number
}

interface WarRecord {
  warDate: string
  region: string
  occupiedArea: string
  result: string
  guildName: string
}

interface AllianceDetail {
  name: string
  tiers: string[]
  isActive: boolean
  markUrl?: string
  totalGuilds: number
  totalMembers: number
  totalWins: number
  totalLosses: number
  totalWinRate: number
  guilds: AllianceGuild[]
  recentWarRecords: WarRecord[]
  recentVictories: WarRecord[]
}

export default function AllianceDetailClient({ alliance }: { alliance: AllianceDetail }) {
  // ✅ 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const tierColors = {
    '무제한': 'text-red-400',
    '2단': 'text-yellow-400',
    '1단': 'text-blue-400'
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case '점령성공': return 'text-green-400'
      case '점령실패': return 'text-red-400'
      case '승리': return 'text-green-400'
      case '패배': return 'text-red-400'
      case '무승부': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getRegionIcon = (region: string) => {
    const regionImages: Record<string, string> = {
      '발레노스': '/war-records/balenos.png',
      '세렌디아': '/war-records/Serendia.png',
      '칼페온': '/war-records/calfeon.png',
      '카마실비아': '/war-records/kamasylvia.png',
      '메디아': '/war-records/media.png',
      '발렌시아': '/war-records/balencia.png',
    }
    return regionImages[region] || null
  }


  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      {/* 메인 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/ponyang/all-bg.jpg')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 40%"
          }}
        ></div>
        
        {/* 콘텐츠 */}
        <div className="relative p-6 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* 왼쪽: 연맹 아이콘과 제목 */}
            <div className="flex items-center gap-6">
              {/* 연맹 아이콘 */}
              <img 
                src={alliance.markUrl || '/alliance-icons/default.png'} 
                alt={`${alliance.name} 마크`}
                className="w-28 h-28 object-contain"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/alliance-icons/default.png'
                }}
              />
              
              {/* 제목 블록 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {alliance.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {alliance.tiers.map(tier => (
                    <span key={tier} className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${tierColors[tier as keyof typeof tierColors] || 'text-gray-400 border-gray-600'}`}>
                      {tier}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 주요 정보 */}
            <div className="flex flex-col gap-2 min-w-[200px]">
              {/* 거점전 승률 */}
              <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-xl px-4 py-3 border border-white/20">
                <div className="text-white/70 text-sm">거점전 승률</div>
                <div className={`text-2xl font-bold ${alliance.totalWinRate >= 70 ? 'text-yellow-400' : 'text-white'}`}>
                  {alliance.totalWinRate}%
                </div>
              </div>
              
              {/* 전적 */}
              <div className="bg-gradient-to-r from-slate-800/90 to-purple-900/90 rounded-xl px-4 py-3 border border-white/20">
                <div className="text-white/70 text-sm">전체 전적</div>
                <div className="text-lg font-bold">
                  <span className="text-green-300">{alliance.totalWins}승</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-red-300">{alliance.totalLosses}패</span>
                </div>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden space-y-4">
            {/* 상단: 연맹 아이콘과 제목 */}
            <div className="flex items-center gap-4">
              <img 
                src={alliance.markUrl || '/alliance-icons/default.png'} 
                alt={`${alliance.name} 마크`}
                className="w-20 h-20 object-contain"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/alliance-icons/default.png'
                }}
              />
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {alliance.name}
                </h1>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {alliance.tiers.map(tier => (
                    <span key={tier} className={`px-2 py-1 rounded-lg text-xs font-bold border ${tierColors[tier as keyof typeof tierColors] || 'text-gray-400 border-gray-600'}`}>
                      {tier}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 하단: 정보 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-lg px-3 py-2 border border-white/20">
                <div className="text-white/70 text-xs">소속 길드</div>
                <div className="text-white text-xl font-bold">{alliance.totalGuilds}개</div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800/90 to-purple-900/90 rounded-lg px-3 py-2 border border-white/20">
                <div className="text-white/70 text-xs">총 인원</div>
                <div className="text-white text-xl font-bold">{alliance.totalMembers.toLocaleString()}명</div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800/90 to-pink-900/90 rounded-lg px-3 py-2 border border-white/20">
                <div className="text-white/70 text-xs">승률</div>
                <div className={`text-xl font-bold ${alliance.totalWinRate >= 70 ? 'text-yellow-400' : 'text-white'}`}>
                  {alliance.totalWinRate}%
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800/90 to-indigo-900/90 rounded-lg px-3 py-2 border border-white/20">
                <div className="text-white/70 text-xs">전적</div>
                <div className="text-sm font-bold">
                  <span className="text-green-300">{alliance.totalWins}승</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-red-300">{alliance.totalLosses}패</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 카드 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          연맹 통계
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 sm:p-5 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-blue-300 text-lg" />
                </div>
                <span className="text-xs sm:text-sm text-blue-300 font-semibold">소속 길드</span>
              </div>
              <div className="text-base sm:text-2xl font-bold text-white">{alliance.totalGuilds}개</div>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 sm:p-5 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-green-300 text-lg" />
                </div>
                <span className="text-xs sm:text-sm text-green-300 font-semibold">총 인원</span>
              </div>
              <div className="text-base sm:text-2xl font-bold text-white">{alliance.totalMembers.toLocaleString()}명</div>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-4 sm:p-5 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FaFistRaised className="text-red-300 text-lg" />
                </div>
                <span className="text-xs sm:text-sm text-red-300 font-semibold">전체 전적</span>
              </div>
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-bold">
                  <span className="text-green-300">{alliance.totalWins}승</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-red-300">{alliance.totalLosses}패</span>
                </div>
                <div className="text-xs text-gray-400">
                  승률 {alliance.totalWinRate}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 sm:p-5 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <FaTrophy className="text-yellow-300 text-lg" />
                </div>
                <span className="text-xs sm:text-sm text-yellow-300 font-semibold">거점전 승률</span>
              </div>
              <div className={`text-base sm:text-2xl font-bold ${alliance.totalWinRate >= 70 ? 'text-yellow-300' : 'text-white'}`}>
                {alliance.totalWinRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 소속 길드 목록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">🏰</span>
          소속 길드
          <span className="text-base font-normal text-gray-300 ml-2">({alliance.totalGuilds}개)</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {alliance.guilds.map((guild, idx) => (
            <div key={`${guild.name}-${idx}`} className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-600 hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-700/50 group">
              <div className="flex items-start gap-2 mb-2 sm:mb-3">
                {guild.iconUrl && (
                  <img 
                    src={guild.iconUrl}
                    alt={`${guild.name} 마크`}
                    className="w-8 h-8 object-contain flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <Link 
                      href={`/guild/${encodeURIComponent(guild.name)}`}
                      className="text-base sm:text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:text-blue-300 truncate"
                    >
                      {guild.name}
                    </Link>
                    {guild.rank && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30 ml-2 flex-shrink-0">
                        {guild.rank}위
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                  <span className="truncate">대장: {guild.leader}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                  <span>인원: {guild.memberCount}명</span>
                </div>
                
                <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-slate-600">
                  <div className="text-xs sm:text-sm">
                    <span className="text-green-400 font-bold">{guild.wins}승</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-red-400 font-bold">{guild.losses}패</span>
                  </div>
                  <div className={`text-xs sm:text-sm font-bold ${guild.winRate >= 70 ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {guild.winRate}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 전투 기록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          최근 거점전 기록
        </h2>
        
        {alliance.recentWarRecords.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">⚔️</div>
            <p className="text-gray-400 text-base sm:text-lg">최근 거점전 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {alliance.recentWarRecords.slice(0, 10).map((record, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-600 hover:border-slate-500 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getRegionIcon(record.region) ? (
                        <img 
                          src={getRegionIcon(record.region)!} 
                          alt={`${record.region} 마크`}
                          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        />
                      ) : (
                        <span className="text-xl sm:text-2xl">🗺️</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-base sm:text-lg truncate">{record.region}</div>
                      <div className="text-gray-300 text-sm sm:text-base truncate">{record.occupiedArea}</div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {getRegionTier(record.region, record.warDate) || '연맹 전체'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className={`font-bold text-xs sm:text-sm ${getResultColor(record.result)}`}>
                      {record.result}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                      {new Date(record.warDate).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 최근 승리 기록 */}
      {alliance.recentVictories.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            최근 승리 기록
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {alliance.recentVictories.map((victory, index) => (
              <div key={index} className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-4 sm:p-6 hover:border-green-400/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    {getRegionIcon(victory.region) ? (
                      <img 
                        src={getRegionIcon(victory.region)!} 
                        alt={`${victory.region} 마크`}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                      />
                    ) : (
                      <span className="text-lg sm:text-xl">🗺️</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-green-400 text-base sm:text-lg truncate">{victory.region}</div>
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="text-gray-300">
                    <span className="text-gray-400">점령지:</span> <span className="truncate">{victory.occupiedArea}</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-400">구분:</span> {getRegionTier(victory.region, victory.warDate) || '연맹 전체'}
                  </div>
                  <div className="text-gray-400 pt-1.5 sm:pt-2 border-t border-green-500/20">
                    {new Date(victory.warDate).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
