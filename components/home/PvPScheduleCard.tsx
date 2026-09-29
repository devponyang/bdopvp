'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import PonyangLoading from '@/components/shared/PonyangLoading'

interface RecentVictory {
  alliance_name: string
  war_date: string
  occupied_area: string
  region: string
}

const imageMap: Record<string, string> = {
  '칼페온': '/war-records/calfeon.png',
  '메디아': '/war-records/media.png',
  '발렌시아': '/war-records/balencia.png',
}

async function fetchRecentVictories(): Promise<RecentVictory[]> {
  const res = await fetch('/api/war-records/recent-victories')
  if (!res.ok) throw new Error('Failed to fetch recent victories')
  return res.json()
}

export default function PvPScheduleCard() {
  const [recentVictories, setRecentVictories] = useState<RecentVictory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecentVictories()
        setRecentVictories(data)
      } catch (error) {
        console.error('Error fetching war schedule:', error)
        setRecentVictories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const regions = ['칼페온', '메디아', '발렌시아']

  const getLastSaturdayLabel = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const lastSaturday = new Date(today)
    if (dayOfWeek === 0) {
      lastSaturday.setDate(today.getDate() - 1)
    } else {
      lastSaturday.setDate(today.getDate() - ((dayOfWeek + 1) % 7))
    }
    return lastSaturday.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  const getNextSiegeCountdown = () => {
    const now = new Date()
    const today = now.getDay()
    const nextSaturday = new Date(now)
    if (today === 6) {
      const today20 = new Date(now)
      today20.setHours(20, 0, 0, 0)
      if (now < today20) {
        nextSaturday.setHours(20, 0, 0, 0)
      } else {
        nextSaturday.setDate(now.getDate() + 7)
        nextSaturday.setHours(20, 0, 0, 0)
      }
    } else {
      const daysUntilSaturday = (6 - today) % 7 || 7
      nextSaturday.setDate(now.getDate() + daysUntilSaturday)
      nextSaturday.setHours(20, 0, 0, 0)
    }
    const diff = nextSaturday.getTime() - now.getTime()
    if (diff <= 0) return '0일 0시간 0분'
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${days}일 ${hours}시간 ${minutes}분`
  }

  if (isLoading) {
    return <PonyangLoading />
  }

  return (
    <div
      className="pvp-schedule-card w-full rounded-xl overflow-hidden border border-zinc-800/50"
      style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.7 0.28 340)' }}
    >
      {/* 헤더 */}
      <div
        className="px-5 py-3.5 flex items-center justify-between border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span>🏆</span>
          <span>공성(점령)전 결과</span>
        </h2>
        <span className="text-xs text-zinc-500">{getLastSaturdayLabel()}</span>
      </div>

      {/* 지역별 결과 행 */}
      <div className="divide-y divide-white/[0.05]">
        {regions.map((region) => {
          const victory = recentVictories
            .filter(v => v.region === region)
            .sort((a, b) => new Date(b.war_date).getTime() - new Date(a.war_date).getTime())[0]

          return (
            <div
              key={region}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="relative w-10 h-12 shrink-0">
                <Image
                  src={imageMap[region]}
                  alt={region}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-500 mb-0.5">{region}</div>
                {victory ? (
                  <div className="text-sm font-semibold text-zinc-100 truncate">
                    {victory.alliance_name}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-600">기록 없음</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 타이머 푸터 */}
      <div
        className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <span className="text-xs text-zinc-500">⏰ 다음 점령전까지</span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: 'oklch(0.7 0.28 340)' }}
        >
          {getNextSiegeCountdown()}
        </span>
      </div>
    </div>
  )
}
