"use client"

import { useEffect } from "react"
import { Card } from "@/components/card"
import Link from "next/link"
import { FaTrophy, FaUsers, FaFistRaised } from "react-icons/fa"
import { getRegionTier } from "@/lib/constants/war-tiers"

interface AllianceGuild {
  name: string
  memberCount: number
  leader: string
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
    <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 연맹 기본 정보 */}
      <Card className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl overflow-hidden">
              <img 
                src={alliance.markUrl || '/alliance-icons/default.png'} 
                alt={`${alliance.name} 마크`}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/alliance-icons/default.png'
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">{alliance.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {alliance.tiers.map(tier => (
                  <span key={tier} className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${tierColors[tier as keyof typeof tierColors] || 'text-gray-400 border-gray-600'}`}>
                    {tier}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-600">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-400 text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">소속 길드</span>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{alliance.totalGuilds}개</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-600">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FaUsers className="text-green-400 text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">총 인원</span>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{alliance.totalMembers.toLocaleString()}명</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-600">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FaFistRaised className="text-red-400 text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">전체 전적</span>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              <span className="text-green-400">{alliance.totalWins}승</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-red-400">{alliance.totalLosses}패</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              승률 {alliance.totalWinRate}%
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-600">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <FaTrophy className="text-yellow-400 text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">거점전 승률</span>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              <span className={alliance.totalWinRate >= 70 ? 'text-yellow-400' : 'text-white'}>
                {alliance.totalWinRate}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 소속 길드 목록 */}
      <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <FaUsers className="text-blue-400 text-lg sm:text-xl" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">소속 길드</h2>
            <p className="text-sm sm:text-base text-gray-400">총 {alliance.totalGuilds}개 길드</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {alliance.guilds.map((guild) => (
            <div key={guild.name} className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-600 hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-700/50 group">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <Link 
                  href={`/guild/${encodeURIComponent(guild.name)}`}
                  className="text-base sm:text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:text-blue-300 truncate flex-1"
                >
                  {guild.name}
                </Link>
                {guild.rank && (
                  <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30 ml-2 flex-shrink-0">
                    {guild.rank}위
                  </span>
                )}
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
      </Card>

      {/* 최근 전투 기록 */}
      <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <FaFistRaised className="text-red-400 text-lg sm:text-xl" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">최근 거점전 기록</h2>
            <p className="text-sm sm:text-base text-gray-400">연맹의 최근 거점전 기록</p>
          </div>
        </div>
        
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
      </Card>

      {/* 최근 승리 기록 */}
      {alliance.recentVictories.length > 0 && (
        <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <FaTrophy className="text-yellow-400 text-lg sm:text-xl" />
            </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">최근 승리 기록</h2>
            <p className="text-sm sm:text-base text-gray-400">연맹의 최근 거점전 승리 기록</p>
          </div>
          </div>
          
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
        </Card>
      )}

    </div>
  )
}
