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
      const today = now.getDay()

      let targetDate = new Date(now)

      if (today === 6) {
        targetDate.setDate(now.getDate() + 1)
      } else {
        const today22 = new Date(now)
        today22.setHours(22, 0, 0, 0)
        if (now > today22) {
          targetDate.setDate(now.getDate() + 1)
          if (targetDate.getDay() === 6) {
            targetDate.setDate(targetDate.getDate() + 1)
          }
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

    if (dayOfWeek === 6) {
      targetDate.setDate(now.getDate() + 1)
    } else {
      const today22 = new Date(now)
      today22.setHours(22, 0, 0, 0)
      if (now > today22) {
        targetDate.setDate(now.getDate() + 1)
        if (targetDate.getDay() === 6) {
          targetDate.setDate(targetDate.getDate() + 1)
        }
      }
    }

    const targetDayOfWeek = targetDate.getDay()
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth() + 1
    const date = targetDate.getDate()
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    const dayName = dayNames[targetDayOfWeek]
    const fullDate = `${year}년 ${month.toString().padStart(2, '0')}월 ${date.toString().padStart(2, '0')}일 ${dayName}`

    if ([1, 3, 5].includes(targetDayOfWeek)) {
      return {
        dayType: fullDate,
        stages: [
          { players: '25인 거점전' },
          { players: '40인 거점전' },
          { players: '55인 거점전' },
        ],
      }
    } else if ([2, 4, 0].includes(targetDayOfWeek)) {
      return {
        dayType: fullDate,
        stages: [
          { players: '30인 거점전' },
          { players: '50인 거점전' },
          { players: '75인 거점전' },
        ],
      }
    } else {
      return { dayType: fullDate, stages: [] }
    }
  }

  const nodeWarInfo = getNodeWarInfo()

  const rows = [
    {
      left: { img: '/war-records/balenos.png', name: '발레노스' },
      right: { img: '/war-records/Serendia.png', name: '세렌디아' },
      label: '1단계',
      type: '제한',
    },
    {
      left: { img: '/war-records/media.png', name: '메디아' },
      right: { img: '/war-records/balencia.png', name: '발렌시아' },
      label: '2단계',
      type: '제한',
    },
    {
      left: { img: '/war-records/calfeon.png', name: '칼페온' },
      right: { img: '/war-records/kamasylvia.png', name: '카마실비아' },
      label: '3단계',
      type: '무제한',
    },
  ]

  return (
    <div
      className="node-war-card w-full rounded-xl overflow-hidden border border-zinc-800/50"
      style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
    >
      {/* 헤더 */}
      <div
        className="px-5 py-3.5 flex items-center justify-between border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span>🌍</span>
          <span>거점전 시간표</span>
        </h2>
        <span className="text-xs text-zinc-500">
          <span className="hidden md:inline">{nodeWarInfo.dayType}</span>
          <span className="md:hidden">
            {new Date().getMonth() + 1}/{new Date().getDate()} 거점전
          </span>
        </span>
      </div>

      {/* 단계 행 목록 */}
      {nodeWarInfo.stages.length > 0 ? (
        <div className="divide-y divide-white/[0.05]">
          {nodeWarInfo.stages.map((stage, index) => {
            const row = rows[index]
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* 왼쪽 지역 */}
                <div className="flex items-center gap-2.5 w-28 shrink-0">
                  <div className="relative w-9 h-9 shrink-0">
                    <Image
                      src={row.left.img}
                      alt={row.left.name}
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs text-zinc-400 leading-tight">{row.left.name}</span>
                </div>

                {/* 단계 정보 */}
                <div className="flex-1 text-center">
                  <div className="text-sm font-bold text-white">{row.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {row.type} · {stage.players}
                  </div>
                </div>

                {/* 오른쪽 지역 */}
                <div className="flex items-center gap-2.5 w-28 shrink-0 justify-end">
                  <span className="text-xs text-zinc-400 leading-tight text-right">
                    {row.right.name}
                  </span>
                  <div className="relative w-9 h-9 shrink-0">
                    <Image
                      src={row.right.img}
                      alt={row.right.name}
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-10 text-center text-zinc-600 text-sm">
          토요일은 거점전이 없습니다
        </div>
      )}

      {/* 타이머 푸터 */}
      {nodeWarInfo.stages.length > 0 && (
        <div
          className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]"
          style={{ background: 'oklch(0.12 0.02 270)' }}
        >
          <span className="text-xs text-zinc-500">⏰ 다음 거점전까지</span>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: 'oklch(0.85 0.18 200)' }}
          >
            {(() => {
              const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes
              const days = Math.floor(totalMinutes / (24 * 60))
              const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
              const minutes = totalMinutes % 60
              return `${days}일 ${hours}시간 ${minutes}분`
            })()}
          </span>
        </div>
      )}
    </div>
  )
}
