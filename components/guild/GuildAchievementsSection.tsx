'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/card'

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
      <Card className="p-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (!achievements || achievements.achievements.length === 0) {
    return (
      <Card 
        className="guild-achievements-container p-4 md:p-6 bg-sky-50 dark:bg-zinc-800 border border-sky-200 dark:border-zinc-700"
        style={{
          backgroundColor: document.documentElement.classList.contains('dark') ? '#27272a' : '#f0f9ff',
          borderColor: document.documentElement.classList.contains('dark') ? '#3f3f46' : '#e0f2fe'
        }}
      >
        <h3 className="text-lg font-bold text-gray-800 dark:!text-white mb-4 flex items-center gap-2">
          <span>🏅</span>
          <span className="dark:!text-white">길드 특징</span>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          아직 특별한 특징이 없습니다.
        </p>
      </Card>
    )
  }

  const displayedAchievements = showAll ? achievements.achievements : achievements.achievements.slice(0, 4)

  return (
    <Card 
      className="guild-achievements-container p-4 md:p-6 bg-sky-50 dark:bg-zinc-800 border border-sky-200 dark:border-zinc-700"
      style={{
        backgroundColor: document.documentElement.classList.contains('dark') ? '#27272a' : '#f0f9ff',
        borderColor: document.documentElement.classList.contains('dark') ? '#3f3f46' : '#e0f2fe'
      }}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-xl font-bold !text-gray-800 dark:!text-white flex items-center gap-2">
          <span>🏅</span>
          <span>길드 특징</span>
        </h3>
      </div>

      {/* 특징 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {displayedAchievements.map((achievement, index) => (
          <div
            key={index}
            className={`p-2 md:p-3 rounded-lg border transition-all hover:scale-[1.02] ${getTypeColor(achievement.type)}`}
          >
            <div className="flex items-start justify-between mb-1 md:mb-2">
              <h5 className="font-bold text-xs leading-tight">{achievement.title}</h5>
              <span className="text-xs opacity-60 font-semibold hidden md:block">
                {getCategoryName(achievement.type)}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-tight line-clamp-2 md:line-clamp-3">
              {achievement.description}
            </p>
            
            {(achievement.type === 'rank' || achievement.type === 'nodewar') && achievement.value && typeof achievement.value === 'object' && (
              <div className="mt-1 md:mt-2 pt-1 md:pt-2 border-t border-current/20">
                <div className="text-xs space-y-0.5 md:space-y-1 opacity-75">
                  {achievement.type === 'rank' ? (
                    <>
                      <div className="flex justify-between">
                        <span>순위:</span><span>{achievement.value.rank}위</span>
                      </div>
                      <div className="flex justify-between">
                        <span>점수:</span><span>{achievement.value.score?.toLocaleString()}점</span>
                      </div>
                      <div className="flex justify-between">
                        <span>승률:</span><span>{achievement.value.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>전적:</span><span>{achievement.value.wins}승 {achievement.value.losses}패</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>연맹:</span><span>{achievement.value.alliance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>승률:</span><span>{achievement.value.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>전적:</span><span>{achievement.value.wins}승 {achievement.value.losses}패</span>
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
        <div className="mt-4 md:mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 md:px-6 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-xs md:text-sm font-semibold"
          >
            {showAll ? '접기' : `+${achievements.achievements.length - 4}개 더 보기`}
          </button>
        </div>
      )}

    </Card>
  )
}
