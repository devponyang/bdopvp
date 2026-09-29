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

export default function WarScheduleCard() {
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
    const interval = setInterval(fetchData, 60000) // 1분마다 갱신
    return () => clearInterval(interval)
  }, [])

  const regions = ['칼페온', '메디아', '발렌시아']

  if (isLoading) {
    return <PonyangLoading />
  }

  return (
    <div className="bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 border border-zinc-600 rounded-xl shadow-xl overflow-hidden relative">
      <div className="bg-gradient-to-r from-zinc-700/20 to-zinc-600/20 px-6 py-4 border-b border-zinc-600">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span className="text-2xl">🏆</span>
          <span>PvP 시간표</span>
        </h2>
      </div>

      <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm px-6 py-6">
        <div className="flex flex-row flex-wrap justify-center gap-8 sm:flex-nowrap">
          {regions.map((region) => {
            const regionVictory = recentVictories
              .filter(v => v.region === region)
              .sort((a, b) => new Date(b.war_date).getTime() - new Date(a.war_date).getTime())[0]
            return (
              <div key={region} className="flex flex-col items-center bg-zinc-800 rounded-2xl p-6 w-64 min-h-[220px] overflow-hidden">
                <div className="relative w-[140px] h-[160px] mb-3">
                  <Image
                    src={imageMap[region]}
                    alt={region + ' 방패'}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
                <div className="text-xl font-bold text-white mb-1">{region}</div>
                <div className="text-base text-blue-300 font-semibold break-words text-center truncate max-w-[120px] overflow-hidden">
                  {regionVictory ? regionVictory.alliance_name : '최근 승리 기록 없음'}
                </div>
              </div>
            )
          })}
        </div>
        {/* 전쟁 일정 안내 */}
        <div className="space-y-2 text-center mt-6">
          <div className="text-white font-semibold text-sm"><span className="font-bold">다음 장미전쟁</span>: 5월 18일 (토) 18:00 시작 (2주에 1번)</div>
          <div className="text-white font-semibold text-sm"><span className="font-bold">다음 점령전</span>: 매주 토요일 20:00 시작</div>
          <div className="text-white font-semibold text-sm"><span className="font-bold">다음 거점전</span>: 토요일 제외 매일 21:00 시작</div>
        </div>
      </div>
    </div>
  )
}
