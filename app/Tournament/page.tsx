"use client"

import Link from "next/link"
import Image from "next/image"
import ImageWithModal from "@/components/ImageWithModal"
import { useEffect, useState } from "react"

const tournamentPhases = [
  {
    title: "Round of 16",
    subtitle: "16강",
    date: "2025년 12월 20일 (토) 13:00",
    matches: []
  },
  {
    title: "Quarterfinals",
    subtitle: "8강 ",
    date: "2025년 12월 20일 (토) 16:00",
    matches: []
  },
  {
    title: "Semifinals",
    subtitle: "4강 ",
    date: "2025년 12월 20일 (토) 18:00",
    matches: []
  },
  {
    title: "Grand Final",
    subtitle: "결승전",
    date: "2025년 12월 20일 (토) 19:00",
    matches: []
  }
]

const prizePool = [
  { place: "1등", reward: "15만원 + 굿즈 3세트" },
  { place: "2등", reward: "5만원 + 굿즈 3세트" },
  { place: "3등", reward: "굿즈 3세트" }
]

const rules = [
  "팀 구성: 3명씩 팀을 짜서 신청 (총 32팀 모집)",
  "참가 팀 수: 20팀 미달 시 16팀으로 8강 토너먼트 진행",
  "참가 확정: 솔라레 시즌 점수 합산 순으로 참가 확정",
  "경기 방식: 16강/8강은 3라운드 2선승, 준결승/3·4위전/결승은 5라운드 3선승",
  "문의처: 경기 운영 및 문의는 BDOPVP-포냥이 공식 디스코드에서 담당",
  "필수 참여: 모든 참가자는 BDOPVP-포냥이 공식 디스코드 서버 참여 필수(대회 안내 및 공지는 디스코드로 제공)"
]

// 신청 기간 체크 함수 (한국시간 기준)
function isApplicationPeriodOpen(): boolean {
  // 현재 시간을 한국시간 기준으로 가져옴
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000 // 9시간을 밀리초로 변환
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
  const kstTime = new Date(utcTime + kstOffset)
  
  // 신청 시작일: 2025년 11월 26일 00:00:00 (KST)
  const startDate = new Date("2025-11-27T00:00:00+09:00")
  
  // 신청 종료일: 2025년 12월 14일 23:59:59 (KST)
  const endDate = new Date("2025-12-14T23:59:59+09:00")
  
  return kstTime >= startDate && kstTime <= endDate
}

export default function PonyangSolareTournamentPage() {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const [showNotice, setShowNotice] = useState(false)
  
  useEffect(() => {
    setIsApplicationOpen(isApplicationPeriodOpen())
    // 1분마다 체크하여 날짜가 변경될 때 업데이트
    const interval = setInterval(() => {
      setIsApplicationOpen(isApplicationPeriodOpen())
    }, 60000)
    
    // 공지사항 표시 여부 확인
    try {
      const todayString = new Date().toDateString()
      const dismissedDate = window.localStorage.getItem('tournamentNoticeDismissed')
      
      if (dismissedDate !== todayString) {
        setShowNotice(true)
      }
    } catch (error) {
      setShowNotice(true)
    }
    
    return () => clearInterval(interval)
  }, [])
  
  const handleCloseNotice = () => {
    setShowNotice(false)
  }
  
  return (
    <main className="bg-zinc-950 text-white min-h-screen pb-16">
      {/* 공지 팝업 */}
      {showNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-gray-600/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/ponyang/ponyang-1.png" 
                    alt="포냥이" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-300">대회 공지</h2>
              </div>
              <button
                onClick={handleCloseNotice}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-6">
              <div className="text-gray-300 leading-relaxed">
                {/* 메인 내용 */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-4 border-l-4 border-amber-400">
                    <h3 className="font-semibold text-amber-300 mb-3 text-lg">【공지】 대회 모드 변경 안내</h3>
                    <p className="text-sm leading-relaxed text-gray-200 mb-3">
                      안녕하세요. BDOPVP-포냥이 운영자 <strong>디움</strong>입니다.
                    </p>
                    <p className="text-sm leading-relaxed text-gray-200 mb-4">
                      12월 20일 예정이었던 포냥이 솔라레 대회는 아래와 같이 변경되어 진행됩니다.
                    </p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-200">
                        <strong className="text-amber-200">기존:</strong> 솔라레의 창 사용자 설정 대전(사설게임) 3vs3
                      </p>
                      <p className="text-sm text-gray-200">
                        <strong className="text-amber-200">변경:</strong> 아르샤의 창 팀 대전 3vs3 토너먼트
                      </p>
                      <p className="text-sm text-gray-200">
                        <strong className="text-amber-200">이에 따른 변화로 인해, 신청기한이 변경되었습니다. <br></br>25년 11월 27일(목) 00시부터 신청 가능합니다</strong>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">변경 사유</h4>
                    <p className="text-sm leading-relaxed text-gray-300 mb-2">
                      솔라레 사용자 설정 대전에는 실시간 관전 기능이 제공되지 않아 중계 시 실시간 경기 화면 전달이 불가능합니다.
                    </p>
                    <p className="text-sm leading-relaxed text-gray-300">
                      보다 원활한 생중계와 시청자 경험 향상을 위해 아르샤의 창으로 전환합니다.
                    </p>
                  </div>
                  
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-200 mb-2">주요 변경 사항</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• <strong>모드:</strong> 아르샤 서버 3vs3 팀 대전</li>
                      <li>• <strong>장비:</strong> 아르샤의 상자2</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 모달 버튼들 */}
            <div className="flex gap-3 p-6 border-t border-slate-700/50">
              <button
                onClick={() => {
                  const today = new Date().toDateString()
                  localStorage.setItem('tournamentNoticeDismissed', today)
                  handleCloseNotice()
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                오늘 하루 보지 않기
              </button>
              <button
                onClick={handleCloseNotice}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-[1490px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1490px] py-12 lg:py-16 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/50 bg-blue-500/10 text-xs sm:text-sm text-blue-200">
              🎮 BDOPVP 커뮤니티 주관
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              BDOPVP-포냥이<br></br> Arena of Arsha Tournament
              <span className="block text-lg sm:text-xl font-semibold text-blue-200 mt-3">
                2025년 12월 20일 · Round of 16 Tournament 
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              BDOPVP-포냥이 커뮤니티가 주최하는 아르샤의 창으로 진행하는 3vs3 팀 토너먼트입니다. 
              세 명이 한 팀을 이뤄 최고의 팀을 결정짓는 승부를 펼칩니다. 참가 신청은 BDOPVP-포냥이
              홈페이지에서 진행되며, 경기는 치지직에서 생중계됩니다.
            </p>
            <p className="text-sm text-gray-500"> <b className="text-blue-200">BDOPVP-포냥이 Arena Of Arsha Tournament 는 펄어비스로부터 소정의 검은사막 굿즈를 지원받았습니다.</b></p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-start justify-center">
              {isApplicationOpen ? (
                <Link
                  href="/Tournament/apply"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-semibold"
                >
                  참가 신청하기 →
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-600 cursor-not-allowed opacity-50 text-sm font-semibold"
                >
                  참가 신청하기 →
                </button>
              )}
              {isApplicationOpen ? (
                <Link
                  href="/Tournament/apply?mode=edit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-blue-400/60 text-blue-200 hover:bg-blue-500/10 transition-colors text-sm font-semibold"
                >
                  신청내역 수정하기
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-600 text-gray-400 cursor-not-allowed opacity-50 text-sm font-semibold"
                >
                  신청내역 수정하기
                </button>
              )}
              <Link
                href="/solare-league"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 hover:border-blue-400/60 hover:bg-white/5 transition-colors text-sm font-semibold"
              >
                솔라레 랭킹 보기
              </Link>
            </div>
          </div>
            <div className="flex-1 max-w-lg w-full">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(79,120,255,0.35)] bg-transparent flex items-center justify-center">
              <div className="w-full max-w-xl drop-shadow-[0_20px_40px_rgba(79,120,255,0.45)]">
                <div className="relative w-full aspect-[16/9] min-h-[220px] sm:min-h-[260px] lg:min-h-[320px] rounded-3xl overflow-hidden border border-white/10 bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/Kse-PgjMtjI"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
              <div className="absolute inset-x-0 top-4 flex justify-center px-4">
                <div className="w-full max-w-sm sm:max-w-md bg-black/55 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 text-center shadow-[0_10px_35px_rgba(79,120,255,0.35)]">
                  <p className="text-sm sm:text-base font-semibold text-white">BDOPVP-포냥이 Arena Of Arsha Tournament 테마곡</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="max-w-[1490px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <section className="flex justify-center">
          <ImageWithModal
            src="/ponyang/Tournament.jpg"
            alt="BDOPVP-포냥이 Arena Of Arsha Tournament 홍보지"
            wrapperClassName="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
            imageClassName="w-full h-auto object-cover"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">토너먼트 브래킷</h2>
          <p className="text-sm text-gray-400">
            32팀이 참가하는 Round of 16 토너먼트입니다. 모든 경기는 12월 20일 하루 동안
            진행되며, 경기별 대략적인 시간은 아래와 같습니다.
          </p>
          <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
            {tournamentPhases.map((phase) => (
              <div
                key={phase.title}
                className="bg-gradient-to-br from-zinc-900/80 to-slate-900/70 border border-white/10 rounded-2xl p-4 space-y-3"
              >
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide">
                    {phase.subtitle}
                  </p>
                  <h3 className="text-xl font-semibold text-white mt-1">{phase.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{phase.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm sm:text-base text-gray-200 text-center font-semibold">
            대진표는 추첨 결과를 기준으로 추후 공지됩니다.
          </div>
          {/* <ImageWithModal
            src="/ponyang/대진표.jpg"
            alt="포냥이 솔라레 대회 대진표"
            wrapperClassName="block overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
            imageClassName="w-full h-auto object-cover"
          /> */}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="bg-gradient-to-br from-indigo-900/50 via-zinc-900/80 to-slate-900/70 border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-2xl font-bold">참가 안내</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              참가 신청은 BDOPVP-포냥이 홈페이지에서 접수합니다. 팀 구성(3인 1팀) 후 신청
              정보를 입력해주세요. 접수가 마감되면 3인의 솔라레의 창 시즌 점수 합산을 기준으로 본선
              시드가 확정됩니다.
            </p>
            <ul className="grid gap-3 text-sm text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-0.5">①</span>
                <span>BDOPVP-포냥이 홈페이지의 대회 신청 폼을 작성합니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-0.5">②</span>
                <span>팀명, 대표자, 팀원 솔라레의 창 점수 및 클래스를 등록합니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-0.5">③</span>
                <span>모집 마감 후 운영진이 참가 확정 팀 및 대진을 안내합니다.</span>
              </li>
            </ul>
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-red-300 flex items-center gap-2">
                <span>⚠️</span>
                주의 사항
              </h3>
              <div className="space-y-2 text-sm text-gray-200">
                <p className="leading-relaxed">
                  <span className="font-medium text-white">3인 1팀</span>으로 참가해야 합니다. <span className="text-red-300 font-medium">클래스 중복은 불가</span>합니다.
                </p>
                <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                  <p className="text-xs text-red-200">
                    <span className="font-semibold">예)</span> 워리어 2명 + 발키리 1명 <span className="text-red-400 font-bold">X</span>
                  </p>
                </div>
              </div>
            </div>
            {isApplicationOpen ? (
              <Link
                href="/Tournament/apply"
                className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-semibold"
              >
                참가 신청 페이지 이동 →
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-600 cursor-not-allowed opacity-50 text-sm font-semibold"
              >
                참가 신청 페이지 이동 →
              </button>
            )}
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/60 via-zinc-900/70 to-slate-900/80 p-6">
            <div className="absolute inset-0 opacity-60 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.45),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.35),_transparent_55%)]" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span role="img" aria-hidden="true">🏅</span>
                    대회상금
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
                  Prize Pool
                </span>
              </div>

              <div className="space-y-4">
                {prizePool.map((item, index) => {
                  const prizeStyles = [
                    {
                      // 1등 - 금색
                      border: "border-yellow-400/40",
                      bg: "bg-gradient-to-br from-yellow-500/20 via-amber-500/15 to-yellow-600/10",
                      iconBg: "bg-gradient-to-br from-yellow-400/30 to-amber-500/20 border-yellow-300/40",
                      icon: "🥇",
                      textColor: "text-yellow-100",
                      labelColor: "text-yellow-200",
                      shadow: "shadow-[0_20px_45px_rgba(234,179,8,0.35)]",
                      glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    },
                    {
                      // 2등 - 은색
                      border: "border-gray-300/40",
                      bg: "bg-gradient-to-br from-gray-400/20 via-slate-400/15 to-gray-500/10",
                      iconBg: "bg-gradient-to-br from-gray-300/30 to-slate-400/20 border-gray-200/40",
                      icon: "🥈",
                      textColor: "text-gray-100",
                      labelColor: "text-gray-200",
                      shadow: "shadow-[0_20px_45px_rgba(148,163,184,0.35)]",
                      glow: "shadow-[0_0_15px_rgba(148,163,184,0.25)]"
                    },
                    {
                      // 3등 - 동색
                      border: "border-orange-400/40",
                      bg: "bg-gradient-to-br from-orange-500/20 via-amber-600/15 to-orange-700/10",
                      iconBg: "bg-gradient-to-br from-orange-400/30 to-amber-600/20 border-orange-300/40",
                      icon: "🥉",
                      textColor: "text-orange-100",
                      labelColor: "text-orange-200",
                      shadow: "shadow-[0_20px_45px_rgba(251,146,60,0.35)]",
                      glow: "shadow-[0_0_15px_rgba(251,146,60,0.25)]"
                    }
                  ]
                  
                  const style = prizeStyles[index] || prizeStyles[0]
                  
                  return (
                    <div
                      key={item.place}
                      className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} px-5 py-4 ${style.shadow} transition-all duration-300 hover:scale-[1.02] hover:brightness-110`}
                    >
                      <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                      <div className="relative flex items-center gap-4">
                        <div className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl ${style.iconBg} text-3xl sm:text-4xl transition-transform duration-300 hover:scale-110`}>
                          {style.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm font-bold ${style.labelColor} uppercase tracking-wider mb-1`}>
                            {item.place}
                          </p>
                          <p className={`text-lg sm:text-xl md:text-2xl font-black ${style.textColor} leading-tight`}>
                            {item.reward}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-blue-500/20 border border-blue-400/40 rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-blue-100">
                  신규 출시 예정 굿즈 포함 1세트당 3품목 예정 - 무료 배송
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/70 border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold">대회 규정 요약</h2>
            <ul className="space-y-3">
              {rules.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <span className="text-blue-400 font-bold text-base min-w-[24px]">{idx + 1}</span>
                  <span className="text-sm sm:text-base text-gray-200 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400">
              자세한 규칙과 금지 사항은{" "}
              <a
                href="https://discord.com/invite/mD37c4GEby"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline underline-offset-2"
              >
                BDOPVP-포냥이 공식 디스코드
              </a>{" "}
              채널의 공지 게시글을 참고해주세요.
            </p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">중계 & 하이라이트</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                  Live & Highlights
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                경기는 스트리머 사다새와 벙라가 현장감 넘치는 해설과 함께
                실시간으로 중계합니다. 경기 종료 후 하이라이트 영상과 리플레이 데이터가
                업데이트될 예정입니다.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="https://chzzk.naver.com/9cc4bda5d0387d211f9b2123895db58b"
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-purple-500/50 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-blue-500/10 hover:from-purple-500/30 hover:via-purple-600/25 hover:to-blue-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-600/20" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300" />
                <div className="relative flex items-center gap-3 px-4 py-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-500/50 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
                    <Image
                      src="https://nng-phinf.pstatic.net/MjAyNDAyMDhfOTQg/MDAxNzA3Mzk1NzM3MDQ0.IwwhxQmZB9eLo0-nOql9VnroAzdb2Y25WGsQ5p7sWzcg.3FKqhs2Ijux4qyCt3DWEhfDp6OoQL2FSg8vfKNHl930g.PNG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C.png?type=f120_120_na"
                      alt="사다새 프로필"
                      width={64}
                      height={64}
                      className="relative h-16 w-16 rounded-2xl object-cover border-2 border-purple-400/50 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm sm:text-base font-bold text-white group-hover:text-purple-100 transition-colors">사다새 채널</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/30 border border-purple-400/50 px-2 py-0.5 text-[10px] font-semibold text-purple-100">
                        <span>🔴</span> LIVE
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-200/80">치지직 라이브 & 하이라이트</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-purple-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">→</span>
                  </div>
                </div>
              </Link>
              <Link
                href="https://chzzk.naver.com/0fb4e3255f30079c3d677bf4ac00e0a8"
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-purple-500/50 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-blue-500/10 hover:from-purple-500/30 hover:via-purple-600/25 hover:to-blue-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-600/20" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300" />
                <div className="relative flex items-center gap-3 px-4 py-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-500/50 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
                    <Image
                      src="/ponyang/벙라.jpg"
                      alt="벙라 프로필"
                      width={64}
                      height={64}
                      className="relative h-16 w-16 rounded-2xl object-cover border-2 border-purple-400/50 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm sm:text-base font-bold text-white group-hover:text-purple-100 transition-colors">벙라 채널</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/30 border border-purple-400/50 px-2 py-0.5 text-[10px] font-semibold text-purple-100">
                        <span>🔴</span> LIVE
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-200/80">치지직 라이브 & 하이라이트</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-purple-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">→</span>
                  </div>
                </div>
              </Link>
              <Link
                href="https://www.youtube.com/@벙라"
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-red-500/50 bg-gradient-to-br from-red-500/20 via-red-600/15 to-pink-500/10 hover:from-red-500/30 hover:via-red-600/25 hover:to-pink-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-600/20" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-300" />
                <div className="relative flex items-center gap-3 px-4 py-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/50 to-pink-500/50 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
                    <Image
                      src="/ponyang/벙라.jpg"
                      alt="벙라 프로필"
                      width={64}
                      height={64}
                      className="relative h-16 w-16 rounded-2xl object-cover border-2 border-red-400/50 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm sm:text-base font-bold text-white group-hover:text-red-100 transition-colors">벙라 채널</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/30 border border-red-400/50 px-2 py-0.5 text-[10px] font-semibold text-red-100">
                        <span>▶️</span> YOUTUBE
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-red-200/80">유튜브 하이라이트</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-red-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">→</span>
                  </div>
                </div>
              </Link>
              {/* <Link
                href="https://chzzk.naver.com/de3311bb46fb85d9301ef304f9b308a3"
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
                <div className="relative flex items-center gap-3 px-4 py-4">
                  <Image
                    src="https://nng-phinf.pstatic.net/MjAyNDAzMjRfMTY1/MDAxNzExMjYyMjEwNjAz.dDjWLLitGQRvQ6l_6vWEzXCERzVYanwjYxBwf52kiKIg._JkOw-EoM2RvGg5LQOk01Yl3MZftg-nsGSIStWBHfPMg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C.jpg?type=f120_120_na"
                    alt="흉살 프로필"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">흉살 채널</p>
                    <p className="text-xs text-purple-100 mt-1">치지직 라이브 & 하이라이트</p>
                  </div>
                  <span className="text-lg text-purple-200 group-hover:text-white transition-colors">→</span>
                </div>
              </Link> */}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-zinc-900/80 to-slate-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">대회 세부 규정</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
              Detailed Rules
            </span>
          </div>
          
          <div className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>👥</span>
                팀 구성 규정
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  <span className="font-medium text-white">3인 1팀</span>으로 참가해야 합니다.
                </p>
                <p className="leading-relaxed text-red-300 font-medium">
                  클래스 중복은 <span className="font-bold">불가</span>합니다.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
                  <p className="text-xs sm:text-sm text-red-200">
                    <span className="font-semibold">예)</span> 워리어 2명 + 발키리 1명 <span className="text-red-400 font-bold">X</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>⚔️</span>
                장비 규정
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  <span className="font-medium text-white">체험 캐릭터(프캐) 아르샤의 상자 2</span>만 사용 가능합니다.
                </p>
                <p className="leading-relaxed text-red-300 font-medium">
                  그 외 본 캐릭터 및 안내된 장비 외 다른 장비 착용 적발 시 실격 처리됩니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>⏰</span>
                경기 시간 및 일정
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  경기 일정은 <span className="font-medium text-white">디스코드로 안내</span>됩니다.
                </p>
                <ul className="space-y-2 ml-4 list-disc text-red-300">
                  <li>5분 지각 시 경고 1회</li>
                  <li>10분 지각 시 실격 처리</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>⚠️</span>
                경고 누적 규정
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed text-red-300 font-medium">
                  본 대회 중 경고 3회 누적 시 실격 처리됩니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>🚫</span>
                금지 사항
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed text-red-300 font-medium">
                  일반 채팅 및 귓속말 등 채팅으로 참가자에 대한 비하 행위는 금지됩니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-red-500/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2">
                <span>🚨</span>
                부정 행위 규정
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-gray-200">
                <ul className="space-y-2 ml-4 list-disc text-red-300">
                  <li>부계정 대여 적발 시 실격</li>
                  <li>불법 프로그램 사용 시 실격</li>
                  <li>고의 트롤링, 조작 행동 발견 시 실격</li>
                </ul>
                <p className="leading-relaxed text-blue-300 font-medium mt-3 pt-3 border-t border-white/10">
                  의심 사례는 영상/클립 제출 시 즉시 검토합니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>🌐</span>
                네트워크/연결 문제 대응
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  경기 중 연결 끊김 또는 심각한 지연(lag) 발생 시 즉시 운영진에게 알려주세요.
                </p>
                <ul className="space-y-2 ml-4 list-disc text-gray-300">
                  <li>경기 시작 전 연결 문제: 경기 시작 시간 조정 가능</li>
                  <li>경기 중 연결 끊김: 상황에 따라 재경기 또는 해당 라운드 무효 처리</li>
                  <li>심각한 지연 발생: 운영진 판단 하에 재경기 결정</li>
                </ul>
                <p className="leading-relaxed text-blue-300 font-medium mt-3">
                  모든 결정은 운영진의 최종 판단에 따릅니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>🔄</span>
                팀원 변경 규정
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed text-red-300 font-medium">
                  대회 중 팀원 변경은 <span className="font-bold">불가</span>합니다.
                </p>
                <p className="leading-relaxed">
                  대회 시작 전 팀원 변경이 필요한 경우, 상단에 <span className="font-medium text-white">신청내역 수정하기</span>를 클릭 후 비밀번호 입력하면 변경창이 뜹니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>🎲</span>
                대진표 및 추첨 규정
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  대진표는 <span className="font-medium text-white">신청 마감 후 무작위 추첨</span>으로 결정됩니다.
                </p>
                <ul className="space-y-2 ml-4 list-disc text-gray-300">
                  <li>참가 확정 후 디스코드에서 추첨 일정 공지</li>
                  <li>추첨 결과는 대회 페이지 및 디스코드에 공개</li>
                </ul>
                <p className="leading-relaxed text-gray-400 text-xs mt-2">
                  ※ 추첨 방식 및 일정은 디스코드 공지를 통해 안내됩니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>🎥</span>
                리플레이/영상 녹화 규정
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  경기 녹화는 <span className="font-medium text-white">선택 사항</span>입니다.
                </p>
                <ul className="space-y-2 ml-4 list-disc text-gray-300">
                  <li>운영진이 리플레이 요청 시 제출 가능한 팀은 협조 부탁드립니다</li>
                  <li>녹화 영상은 대회 하이라이트 제작 및 분쟁 해결에 활용될 수 있습니다</li>
                  <li>부정 행위 의심 사례 제보 시 영상/클립 제출 시 즉시 검토</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>💰</span>
                상금 지급 규정
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  상금 및 굿즈는 대회 종료 후 지급됩니다.
                </p>
                <ul className="space-y-2 ml-4 list-disc text-gray-300">
                  <li>상금 지급: 대회 종료 후 7일 이내 계좌 이체</li>
                  <li>굿즈 배송: 대회 종료 후 14일 이내 무료 배송</li>
                  <li>수령 정보는 대회 종료 후 디스코드로 개별 안내</li>
                </ul>
                <p className="leading-relaxed text-blue-300 font-medium mt-3">
                  수령 정보 미제출 시 지급이 지연될 수 있습니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>📞</span>
                문의 및 제재 절차
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed">
                  대회 관련 문의 및 이의 제기는 <span className="font-medium text-white">디스코드</span>를 통해 접수합니다.
                </p>
                <ul className="space-y-2 ml-4 list-disc text-gray-300">
                  <li>이의 제기: 경기 종료 후 10분 이내 디스코드로 제출</li>
                  <li>제재 결정: 운영진 검토 후 최종 결정 및 통보</li>
                  <li>제재 통보: 디스코드 개별 메시지 및 공지 게시판 공개</li>
                </ul>
                <p className="leading-relaxed text-red-300 font-medium mt-3">
                  운영진의 최종 결정은 변경되지 않으며, 모든 참가자는 이를 준수해야 합니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <span>📝</span>
                기타 세부 사항
              </h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-200">
                <p className="leading-relaxed text-gray-400">
                  기타 세부 사항은{" "}
                  <a
                    href="https://discord.com/invite/mD37c4GEby"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 underline underline-offset-2 font-medium"
                  >
                    BDOPVP-포냥이 공식 디스코드
                  </a>
                  {" "}채널의 공지 게시글을 확인해주세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 px-6 py-10">
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(180,83,9,0.25),_transparent_55%)]" />
          <div className="relative z-10 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Special Thanks</h2>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed sm:max-w-2xl mx-auto">
              BDOPVP-포냥이 아르샤의 창 토너먼트는 <span className="text-base sm:text-lg font-bold text-white drop-shadow-[0_0_25px_rgba(96,165,250,0.45)] whitespace-nowrap">펄어비스로부터 소정의 검은사막 굿즈를 지원받았습니다</span>.<br />
              대회에 힘을 실어주신 모든 분께 감사드립니다.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-blue-100">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-2">
                <span role="img" aria-hidden="true">⚡</span>
                COMMUNITY POWERED
              </span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="text-gray-300">함께 만들어가는 커뮤니티 대회</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

