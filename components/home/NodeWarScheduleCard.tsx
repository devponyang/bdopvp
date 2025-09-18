'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

export default function NodeWarScheduleCard() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const today = now.getDay() // 0=일요일, 1=월요일, ..., 6=토요일
      
      // 토요일(6)이면 다음 월요일(1)로, 그 외에는 오늘 또는 내일
      let targetDate = new Date(now)
      if (today === 6) { // 토요일
        targetDate.setDate(now.getDate() + 2) // 월요일
      } else if (today === 0) { // 일요일
        targetDate.setDate(now.getDate() + 1) // 월요일
      } else {
        // 월~금: 오늘 22:00이 지났으면 내일, 아니면 오늘
        const today22 = new Date(now)
        today22.setHours(22, 0, 0, 0)
        if (now > today22) {
          targetDate.setDate(now.getDate() + 1)
        }
      }
      
      targetDate.setHours(21, 0, 0, 0)
      
      const diff = targetDate.getTime() - now.getTime()
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getNodeWarInfo = () => {
    const now = new Date()
    let targetDate = new Date(now)
    const dayOfWeek = now.getDay()
    
    // 22시 이후면 다음날로
    if (dayOfWeek !== 6) { // 토요일이 아닌 경우
      const today22 = new Date(now)
      today22.setHours(22, 0, 0, 0)
      if (now > today22) {
        targetDate.setDate(now.getDate() + 1)
      }
    }
    
    const targetDayOfWeek = targetDate.getDay()
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth() + 1
    const date = targetDate.getDate()
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    const dayName = dayNames[targetDayOfWeek]
    
    const fullDate = `${year}년 ${month.toString().padStart(2, '0')}월 ${date.toString().padStart(2, '0')}일 ${dayName}`
    
    if ([1, 3, 5].includes(targetDayOfWeek)) { // 월/수/금
      return {
        dayType: fullDate,
        stages: [
          { stage: '1단 거점전', players: '25인 거점전' },
          { stage: '2단 거점전', players: '40인 거점전' },
          { stage: '3단 거점전', players: '55인 거점전' }
        ]
      }
    } else if ([2, 4, 0].includes(targetDayOfWeek)) { // 화/목/일
      return {
        dayType: fullDate,
        stages: [
          { stage: '1단 거점전', players: '30인 거점전' },
          { stage: '2단 거점전', players: '50인 거점전' },
          { stage: '3단 거점전', players: '75인 거점전' }
        ]
      }
    } else { // 토요일
      return {
        dayType: fullDate,
        stages: []
      }
    }
  }

  const nodeWarInfo = getNodeWarInfo()

  return (
    <div className="node-war-card bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 border border-zinc-600 rounded-xl shadow-xl overflow-hidden relative">
      <div className="bg-zinc-800 dark:bg-zinc-800 px-3 md:px-6 py-2 md:py-4 border-b border-zinc-600">
        <h2 className="text-lg md:text-2xl font-bold text-white dark:text-white text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <span className="text-lg md:text-2xl">🌍</span>
          <span>거점전 시간표</span>
        </h2>
      </div>

      <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm px-3 md:px-6 py-3 md:py-6">
        {/* 오늘의 거점전 정보 */}
        <div className="text-center mb-3 md:mb-6">
          <div className="inline-block px-2 md:px-4 py-1 md:py-2 bg-white dark:bg-zinc-800 rounded-full border-2 border-black dark:border-zinc-600 mb-2 md:mb-4">
            <div className="text-white font-bold text-sm md:text-lg">
              <span className="text-white hidden md:inline">📅 {nodeWarInfo.dayType} 거점전 안내</span>
              <span className="text-white md:hidden">📅 {new Date().getMonth() + 1}/{new Date().getDate()} 거점전</span>
            </div>
          </div>
          {nodeWarInfo.stages.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 md:gap-3 max-w-lg mx-auto">
              {nodeWarInfo.stages.map((stage, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-2 md:p-4 border border-slate-700 dark:border-slate-600 shadow-md">
                  <div className="text-white text-center">
                    {index === 0 && (
                      <div className="flex items-center justify-center gap-2 md:gap-6 mt-1 md:mt-3">
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 md:w-24 md:h-24">
                            <Image
                              src="/war-records/balenos.png"
                              alt="발레노스"
                              fill
                              sizes="(max-width: 768px) 48px, 96px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center px-1 md:px-2 rounded-lg py-1 md:py-3">
                          <div className="text-sm md:text-lg font-bold text-white dark:text-white text-gray-800 mb-1">발레노스 & 세렌디아</div>
                          <div className="text-lg md:text-xl font-bold text-yellow-300">1단</div>
                          <div className="text-xs md:text-sm text-white dark:text-gray-200 text-gray-800">{stage.players}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 md:w-24 md:h-24">
                            <Image
                              src="/war-records/Serendia.png"
                              alt="세렌디아"
                              fill
                              sizes="(max-width: 768px) 48px, 96px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="flex items-center justify-center gap-2 md:gap-6 mt-1 md:mt-3">
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 md:w-24 md:h-24">
                            <Image
                              src="/war-records/media.png"
                              alt="메디아"
                              fill
                              sizes="(max-width: 768px) 48px, 96px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center px-1 md:px-2 rounded-lg py-1 md:py-3">
                          <div className="text-sm md:text-lg font-bold text-white dark:text-white text-gray-800 mb-1">메디아 & 발렌시아</div>
                          <div className="text-lg md:text-xl font-bold text-yellow-300">2단</div>
                          <div className="text-xs md:text-sm text-white dark:text-gray-200 text-gray-800">{stage.players}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 md:w-24 md:h-24">
                            <Image
                              src="/war-records/balencia.png"
                              alt="발렌시아"
                              fill
                              sizes="(max-width: 768px) 48px, 96px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="flex items-center justify-center gap-2 md:gap-6 mt-1 md:mt-3">
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 md:w-24 md:h-24">
                            <Image
                              src="/war-records/calfeon.png"
                              alt="칼페온"
                              fill
                              sizes="(max-width: 768px) 48px, 96px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center px-1 md:px-2 rounded-lg py-1 md:py-3">
                          <div className="text-sm md:text-lg font-bold text-white dark:text-white text-gray-800 mb-1">칼페온 & 카마실비아</div>
                          <div className="text-lg md:text-xl font-bold text-yellow-300">3단</div>
                          <div className="text-xs md:text-sm text-white dark:text-gray-200 text-gray-800">{stage.players}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 md:w-24 md:h-24">
                            <Image
                              src="/war-records/kamasylvia.png"
                              alt="카마실비아"
                              fill
                              sizes="(max-width: 768px) 48px, 96px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="inline-block px-6 py-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50">
              <div className="text-gray-400 text-sm">😴 거점전이 없는 날입니다</div>
            </div>
          )}
        </div>

        {/* 남은 시간 */}
        {nodeWarInfo.stages.length > 0 && (
          <div className="text-center mb-2 md:mb-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-white dark:text-white text-gray-800 dark:text-white">
              <span className="text-sm md:text-lg font-bold">⏰ 다음 거점전까지</span>
              <span className="text-sm md:text-lg font-bold">
                {(() => {
                  const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes
                  const days = Math.floor(totalMinutes / (24 * 60))
                  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
                  const minutes = totalMinutes % 60
                  
                  return `${days}일 ${hours}시간 ${minutes}분`
                })()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
