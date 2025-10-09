'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import PonyangLoading from '../../app/components/PonyangLoading'

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
    const interval = setInterval(fetchData, 60000) // 1분마다 갱신
    return () => clearInterval(interval)
  }, [])

  const regions = ['칼페온', '메디아', '발렌시아']

  if (isLoading) {
    return <PonyangLoading />
  }

  return (
    <div className="pvp-schedule-card bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden relative">
      <div className="px-3 md:px-6 py-3 md:py-4 border-b border-white/10">
        <h2 className="text-lg md:text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span className="text-lg md:text-2xl">🏆</span>
          <span>공성(점령)전 결과</span>
        </h2>
      </div>

      <div className="px-3 md:px-6 py-3 md:py-6">
        {/* 공성전 결과 날짜 표시 */}
        <div className="text-center mb-3 md:mb-6">
          <div className="inline-block px-2 md:px-4 py-1 md:py-2 bg-white/10 rounded-full border-2 border-white/20">
            <div className="text-white font-bold text-sm md:text-lg">
              <span className="hidden md:inline">📅 {(() => {
                const today = new Date()
                const dayOfWeek = today.getDay() // 0=일요일, 1=월요일, ..., 6=토요일
                
                // 지난 토요일 계산
                let lastSaturday = new Date(today)
                if (dayOfWeek === 0) { // 일요일이면
                  // 일요일이면 어제(토요일)
                  lastSaturday.setDate(today.getDate() - 1)
                } else {
                  // 일요일이 아니면 이번 주 토요일이 아직 안 지났으므로 지난 주 토요일
                  const daysSinceLastSaturday = (dayOfWeek + 1) % 7
                  lastSaturday.setDate(today.getDate() - daysSinceLastSaturday)
                }
                
                return lastSaturday.toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })
              })()} 공성전 결과</span>
              <span className="md:hidden">📅 지난 공성전 결과</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3 md:gap-8 sm:flex-nowrap">
          {regions.map((region) => {
            const regionVictory = recentVictories
              .filter(v => v.region === region)
              .sort((a, b) => new Date(b.war_date).getTime() - new Date(a.war_date).getTime())[0]
            return (
              <div key={region} className="flex flex-row md:flex-col items-center justify-center bg-white/5 rounded-2xl p-3 md:p-6 w-full md:w-64 min-h-[80px] md:min-h-[220px] overflow-hidden border border-white/10 shadow-lg">
                <div className="relative w-16 h-16 md:w-[140px] md:h-[160px] mb-0 md:mb-3 mr-3 md:mr-0 flex-shrink-0">
                  <Image
                    src={imageMap[region]}
                    alt={region + ' 방패'}
                    fill
                    sizes="(max-width: 768px) 64px, 140px"
                    className="object-contain drop-shadow-xl"
                  />
                </div>
                <div className="flex flex-col items-start md:items-center justify-center">
                  <div className="text-lg md:text-xl font-bold text-white mb-0.5 md:mb-1">{region}</div>
                  <div className="text-sm md:text-base text-yellow-300 font-semibold break-words text-left md:text-center max-w-full md:max-w-[120px] overflow-hidden leading-tight">
                    {regionVictory ? regionVictory.alliance_name : '최근 승리 기록 없음'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* 다음 점령전까지 남은 시간 */}
        <div className="text-center mt-3 md:mt-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-white">
            <span className="text-sm md:text-lg font-bold">⏰ 다음 점령전까지</span>
            <span className="text-sm md:text-lg font-bold">
              {(() => {
                const now = new Date()
                const today = now.getDay() // 0=일요일, 1=월요일, ..., 6=토요일
                
                // 다음 토요일 20:00 계산
                let nextSaturday = new Date(now)
                if (today === 6) { // 오늘이 토요일이면
                  // 토요일 20시 이전이면 오늘, 이후면 다음 토요일
                  const today20 = new Date(now)
                  today20.setHours(20, 0, 0, 0)
                  if (now < today20) {
                    // 오늘 20시 이전이면 오늘 20시
                    nextSaturday.setHours(20, 0, 0, 0)
                  } else {
                    // 오늘 20시 이후면 다음 토요일 20시
                    nextSaturday.setDate(now.getDate() + 7)
                    nextSaturday.setHours(20, 0, 0, 0)
                  }
                } else {
                  // 토요일이 아니면 다음 토요일 20시
                  const daysUntilSaturday = (6 - today) % 7
                  nextSaturday.setDate(now.getDate() + daysUntilSaturday)
                  nextSaturday.setHours(20, 0, 0, 0)
                }
                
                const diff = nextSaturday.getTime() - now.getTime()
                
                if (diff > 0) {
                  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                  
                  return `${days}일 ${hours}시간 ${minutes}분`
                } else {
                  return "0일 0시간 0분"
                }
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
