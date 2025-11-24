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
  { place: "우승", reward: "상금 30만원" },
  { place: "검은사막 굿즈", reward: "펄어비스 지원 · 배포 대상 추후 안내" }
]

const rules = [
  "3명씩 팀을 짜서 신청, 총 32팀을 모집합니다.",
  "모집 팀 초과 시 솔라레 시즌 점수 합산 순으로 참가가 확정됩니다.",
  "본선은 Round of 16 Tournament로 진행되며, 라운드별 세부 규칙은 추후 공지됩니다.",
  "경기 운영 및 문의는 BDOPVP-포냥이 공식 디스코드에서 담당합니다.",
  "모든 참가자는 BDOPVP-포냥이 공식 디스코드 서버에 참여해야 하며, 대회 안내 및 공지는 디스코드를 통해 제공됩니다."
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

export default function PonyangSolareTournamentPage() {
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
    <main className="bg-zinc-950 text-white min-h-screen pb-16">
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-[1490px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1490px] py-12 lg:py-16 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/50 bg-blue-500/10 text-xs sm:text-sm text-blue-200">
              🎮 BDOPVP 커뮤니티 주관
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              BDOPVP-포냥이 Solare Tournament 2025
              <span className="block text-lg sm:text-xl font-semibold text-blue-200 mt-3">
                2025년 12월 20일 · Round of 16 Tournament 
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              BDOPVP-포냥이 커뮤니티가 주최하는 솔라레의 창 토너먼트입니다. 
              세 명이 한 팀을 이뤄 최고의 솔라레 팀을 결정짓는 승부를 펼칩니다. 참가 신청은 BDOPVP-포냥이
              홈페이지에서 진행되며, 경기는 치지직에서 생중계됩니다.
            </p>
            <p className="text-sm text-gray-500"> <b className="text-blue-200">BDOPVP-포냥이 Solare Tournament 2025 는 펄어비스로부터 소정의 검은사막 굿즈를 지원받았습니다.</b></p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-start justify-center">
              {isApplicationOpen ? (
                <Link
                  href="/solare-tournament/apply"
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
                  href="/solare-tournament/apply?mode=edit"
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
                  <p className="text-sm sm:text-base font-semibold text-white">BDOPVP-포냥이 Solare Tournament 2025 테마곡</p>
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
            src="/ponyang/solareton.jpg"
            alt="BDOPVP-포냥이 Solare Tournament 2025 홍보지"
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
              정보를 입력해주세요. 접수가 마감되면 솔라레 시즌 점수 합산을 기준으로 본선
              시드가 확정됩니다.
            </p>
            <ul className="grid gap-3 text-sm text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-0.5">①</span>
                <span>BDOPVP-포냥이 홈페이지의 대회 신청 폼을 작성합니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-0.5">②</span>
                <span>팀명, 대표자, 팀원 솔라레 점수 및 클래스를 등록합니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-0.5">③</span>
                <span>모집 마감 후 운영진이 참가 확정 팀 및 대진을 안내합니다.</span>
              </li>
            </ul>
            {isApplicationOpen ? (
              <Link
                href="/solare-tournament/apply"
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

              {prizePool.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/30 px-5 py-4 shadow-[0_20px_45px_rgba(79,70,229,0.35)]">
                  <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-500/20 via-purple-500/25 to-pink-500/20" />
                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-200/30 text-2xl text-blue-100">
                        🏆
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">우승</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">{prizePool[0].reward}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch sm:items-end gap-2 text-xs text-gray-200">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        운영자 사비로 제공
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {prizePool.length > 1 && (
                <ul className="space-y-3">
                  {prizePool.slice(1).map((item) => (
                    <li
                      key={item.place}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-semibold text-blue-200">
                        🎁
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 w-full">
                        <span className="font-semibold text-white flex items-center gap-2">
                          {item.place}
                          
                        </span>
                        <span className="text-xs text-gray-300 sm:text-right">{item.reward}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <p className="text-[11px] text-blue-100/70">
                ※ 보상은 운영 상황에 따라 일부 조정될 수 있으며, 확정 시 별도 공지합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/70 border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold">대회 규정 요약</h2>
            <ul className="space-y-3 text-sm text-gray-200">
              {rules.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                >
                  <span className="text-blue-300 font-semibold">{idx + 1}</span>
                  <span>{rule}</span>
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
          <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/70 border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold">중계 & 하이라이트</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              경기는 스트리머 사다새와 벙라가 현장감 넘치는 해설과 함께
              실시간으로 중계합니다. 경기 종료 후 하이라이트 영상과 리플레이 데이터가
              업데이트될 예정입니다.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="https://chzzk.naver.com/9cc4bda5d0387d211f9b2123895db58b"
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
                <div className="relative flex items-center gap-3 px-4 py-4">
                  <Image
                    src="https://nng-phinf.pstatic.net/MjAyNDAyMDhfOTQg/MDAxNzA3Mzk1NzM3MDQ0.IwwhxQmZB9eLo0-nOql9VnroAzdb2Y25WGsQ5p7sWzcg.3FKqhs2Ijux4qyCt3DWEhfDp6OoQL2FSg8vfKNHl930g.PNG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C.png?type=f120_120_na"
                    alt="사다새 프로필"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">사다새 채널</p>
                    <p className="text-xs text-purple-100 mt-1">치지직 라이브 & 하이라이트</p>
                  </div>
                  <span className="text-lg text-purple-200 group-hover:text-white transition-colors">→</span>
                </div>
              </Link>
              <Link
                href="https://chzzk.naver.com/0fb4e3255f30079c3d677bf4ac00e0a8"
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
                <div className="relative flex items-center gap-3 px-4 py-4">
                  <Image
                    src="/ponyang/벙라.jpg"
                    alt="벙라 프로필"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">벙라 채널</p>
                    <p className="text-xs text-purple-100 mt-1">치지직 라이브 & 하이라이트</p>
                  </div>
                  <span className="text-lg text-purple-200 group-hover:text-white transition-colors">→</span>
                </div>
              </Link>
              <Link
                href="https://www.youtube.com/@벙라"
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-red-500/20 to-pink-500/20" />
                <div className="relative flex items-center gap-3 px-4 py-4">
                  <Image
                    src="/ponyang/벙라.jpg"
                    alt="벙라 프로필"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">벙라 채널</p>
                    <p className="text-xs text-red-100 mt-1">유튜브 하이라이트</p>
                  </div>
                  <span className="text-lg text-red-200 group-hover:text-white transition-colors">→</span>
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

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 px-6 py-10">
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(180,83,9,0.25),_transparent_55%)]" />
          <div className="relative z-10 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Special Thanks</h2>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed sm:max-w-2xl mx-auto">
              BDOPVP-포냥이 솔라레 토너먼트는 <span className="text-base sm:text-lg font-bold text-white drop-shadow-[0_0_25px_rgba(96,165,250,0.45)] whitespace-nowrap">펄어비스로부터 소정의 검은사막 굿즈를 지원받았습니다</span>.<br />
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

