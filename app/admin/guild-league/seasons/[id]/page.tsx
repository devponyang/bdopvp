'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/card'

interface Season {
  id: number
  season_name: string
  season_number: number
  start_date: string
  end_date?: string
  is_active: boolean
  description?: string
}

interface GuildData {
  id: number
  guild_name: string
  rank: number
  wins: number
  losses: number
  score: number
}

export default function GuildLeagueSeasonDetailPage() {
  const params = useParams()
  const seasonId = params.id as string
  
  const [season, setSeason] = useState<Season | null>(null)
  const [data, setData] = useState<GuildData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (seasonId) {
      loadSeasonData()
    }
  }, [seasonId])

  const loadSeasonData = async () => {
    try {
      const response = await fetch(`/api/admin/guild-league/season-data?seasonId=${seasonId}`)
      const result = await response.json()
      
      setSeason(result.season)
      setData(result.data)
    } catch (error) {
      console.error('길드리그 시즌 데이터 로딩 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  if (!season) {
    return (
      <div className="p-6">
        <div className="text-white">시즌을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 시즌 정보 */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {season.season_name}
        </h1>
        <div className="text-gray-400 space-y-1">
          <p>시즌 #{season.season_number}</p>
          <p>기간: {season.start_date} ~ {season.end_date || '진행중'}</p>
          {season.description && (
            <p>설명: {season.description}</p>
          )}
        </div>
      </Card>

      {/* 길드리그 랭킹 테이블 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">길드리그 랭킹</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">순위</th>
                <th className="px-4 py-2">길드명</th>
                <th className="px-4 py-2">승</th>
                <th className="px-4 py-2">패</th>
                <th className="px-4 py-2">승률</th>
                <th className="px-4 py-2">점수</th>
              </tr>
            </thead>
            <tbody>
              {data.map((guild) => {
                const winRate = guild.wins + guild.losses > 0 
                  ? Math.round((guild.wins / (guild.wins + guild.losses)) * 100)
                  : 0
                
                return (
                  <tr key={guild.id} className="border-b border-gray-700 text-white">
                    <td className="px-4 py-2 font-semibold">{guild.rank}</td>
                    <td className="px-4 py-2 text-left">{guild.guild_name}</td>
                    <td className="px-4 py-2">{guild.wins}</td>
                    <td className="px-4 py-2">{guild.losses}</td>
                    <td className="px-4 py-2">{winRate}%</td>
                    <td className="px-4 py-2 font-semibold">{guild.score}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
