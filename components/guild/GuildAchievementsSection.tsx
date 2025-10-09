'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  type: 'rank' | 'stability' | 'nodewar' | 'size' | 'popularity'
  title: string
  description: string
  icon: string
  value?: any
}

interface GuildAchievements {
  guild_name: string
  achievements: Achievement[]
  total_count: number
}

interface Props {
  guildName: string
}

export default function GuildAchievementsSection({ guildName }: Props) {
  const [achievements, setAchievements] = useState<GuildAchievements | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(`/api/guild-achievements?guild_name=${encodeURIComponent(guildName)}`)
        const data = await response.json()
        setAchievements(data)
      } catch (error) {
        console.error('Error fetching guild achievements:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (guildName) {
      fetchAchievements()
    }
  }, [guildName])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rank': return 'text-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
      case 'stability': return 'text-green-400 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
      case 'nodewar': return 'text-red-400 bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50'
      case 'size': return 'text-blue-400 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50'
      case 'popularity': return 'text-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50'
      default: return 'text-gray-400 bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/50'
    }
  }


  const getCategoryName = (type: string) => {
    switch (type) {
      case 'rank': return '길드리그 순위'
      case 'stability': return '안정성'
      case 'nodewar': return '거점전'
      case 'size': return '길드 규모'
      case 'popularity': return '인기도'
      default: return '기타 업적'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!achievements || achievements.achievements.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">🏅</span>
          길드 특징
        </h3>
        <p className="text-gray-300 text-center py-8">
          아직 특별한 특징이 없습니다.
        </p>
      </div>
    )
  }

  const displayedAchievements = showAll ? achievements.achievements : achievements.achievements.slice(0, 4)

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🏅</span>
          길드 특징
          <span className="text-base font-normal text-gray-300 ml-2">({achievements.achievements.length}개)</span>
        </h3>
      </div>

      {/* 특징 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayedAchievements.map((achievement, index) => (
          <div
            key={index}
            className={`p-3 md:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${getTypeColor(achievement.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h5 className="font-bold text-sm leading-tight">{achievement.title}</h5>
              <span className="text-xs opacity-70 font-semibold hidden md:block ml-2 whitespace-nowrap">
                {getCategoryName(achievement.type)}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-tight line-clamp-2 md:line-clamp-3 mb-2">
              {achievement.description}
            </p>
            
            {(achievement.type === 'rank' || achievement.type === 'nodewar') && achievement.value && typeof achievement.value === 'object' && (
              <div className="mt-2 pt-2 border-t border-current/20">
                <div className="text-xs space-y-1 opacity-80">
                  {achievement.type === 'rank' ? (
                    <>
                      <div className="flex justify-between">
                        <span>순위:</span><span className="font-semibold">{achievement.value.rank}위</span>
                      </div>
                      <div className="flex justify-between">
                        <span>점수:</span><span className="font-semibold">{achievement.value.score?.toLocaleString()}점</span>
                      </div>
                      <div className="flex justify-between">
                        <span>승률:</span><span className="font-semibold">{achievement.value.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>전적:</span><span className="font-semibold">{achievement.value.wins}승 {achievement.value.losses}패</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>연맹:</span><span className="font-semibold">{achievement.value.alliance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>승률:</span><span className="font-semibold">{achievement.value.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>전적:</span><span className="font-semibold">{achievement.value.wins}승 {achievement.value.losses}패</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {achievements.achievements.length > 4 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-semibold border border-white/20"
          >
            {showAll ? '접기 ▲' : `+${achievements.achievements.length - 4}개 더 보기 ▼`}
          </button>
        </div>
      )}

    </div>
  )
}
