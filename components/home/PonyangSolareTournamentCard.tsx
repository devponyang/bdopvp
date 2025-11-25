"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const infoItems = [
  {
    label: "대회 일정",
    value: "2025년 12월 20일",
    icon: "📅",
    accent: "from-blue-500/20 to-blue-500/0 border-blue-400/40"
  },
  {
    label: "참가 조건",
    value: "3인 1팀 · 32팀 (점수 컷 적용)",
    icon: "👥",
    accent: "from-purple-500/20 to-purple-500/0 border-purple-400/40"
  },
  {
    label: "신청 기간",
    value: "11월 27일(목요일) ~ 12월 14일(일요일)",
    icon: "📝",
    accent: "from-rose-500/20 to-rose-500/0 border-rose-400/40"
  }
]

// 신청 기간 체크 함수 (한국시간 기준)
function isApplicationPeriodOpen(): boolean {
  // 현재 시간을 한국시간 기준으로 가져옴
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000 // 9시간을 밀리초로 변환
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
  const kstTime = new Date(utcTime + kstOffset)
  
  // 신청 시작일: 2025년 11월 26일 00:00:00 (KST)
  const startDate = new Date("2025-11-26T00:00:00+09:00")
  
  // 신청 종료일: 2025년 12월 14일 23:59:59 (KST)
  const endDate = new Date("2025-12-14T23:59:59+09:00")
  
  return kstTime >= startDate && kstTime <= endDate
}

export default function PonyangSolareTournamentCard() {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  
  useEffect(() => {
    setIsApplicationOpen(isApplicationPeriodOpen())
    // 1분마다 체크하여 날짜가 변경될 때 업데이트
    const interval = setInterval(() => {
      setIsApplicationOpen(isApplicationPeriodOpen())
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="relative w-full max-w-[400px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-slate-900/85 to-zinc-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 opacity-[0.12] mix-blend-screen bg-[radial-gradient(circle_at_top,_#60a5fa55,_transparent_55%),radial-gradient(circle_at_bottom,_#a855f755,_transparent_55%)]" />
      <div className="relative p-5 sm:p-6 space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200">
          <span className="text-lg">🏆</span>
          최강의 팀을 가리는 3vs3 커뮤니티 친선 대회
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
          Arena of Arsha Tournament
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            BDOPVP-포냥이가 주최하는 2025 3vs3 팀 토너먼트!
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            최고의 랭커들과 실력파 모험가들이 한 자리에 모입니다.
          </p>
        </div>

        <div className="space-y-2">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-2xl border bg-gradient-to-r ${item.accent} px-3 py-2.5`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 text-lg">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-200">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          <Link
            href="/solare-tournament"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/10 px-4 py-2.5 text-xs font-semibold text-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/20"
          >
            대회 세부 정보 보기 →
          </Link>
          {isApplicationOpen ? (
            <Link
              href="/solare-tournament/apply"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-400/40 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20"
            >
              신청페이지 바로가기 →
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-600 bg-gray-600/10 px-4 py-2.5 text-xs font-semibold text-gray-400 cursor-not-allowed opacity-50"
            >
              신청페이지 바로가기 →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

