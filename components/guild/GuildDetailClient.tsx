"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/card"
import Image from "next/image"
import Link from "next/link"
import { FaTrophy } from "react-icons/fa"
import MemberTrendChart from "@/components/charts/MemberTrendChart"
import RankTrendChart from "@/components/charts/RankTrendChart"
import GuildAchievementsSection from "@/components/guild/GuildAchievementsSection"
import FavoriteButton from "@/components/FavoriteButton"

interface GuildMark {
  id: number
  guild_name: string
  mark_url: string
  created_at: string
  updated_at: string
}

interface GuildDetail {
  name: string
  leader: string
  member_count: number
  creation_date: string
  rank: number | null
  wins: number
  losses: number
  winRate: number
  updated_at: string
  icon_url?: string
  alliance_name?: string
  members: string[]
  joinCount: number
  leaveCount: number
  history: { date: string, join: number, leave: number }[]
}

export default function GuildDetailClient({ guild }: { guild: GuildDetail }) {
  const [guildMark, setGuildMark] = useState<GuildMark | null>(null)

  // ✅ 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ✅ 길드마크 정보 가져오기
  useEffect(() => {
    const fetchGuildMark = async () => {
      try {
        const response = await fetch(`/api/guild-marks?guild_name=${encodeURIComponent(guild.name)}`)
        if (response.ok) {
          const mark = await response.json()
          setGuildMark(mark)
        }
      } catch (error) {
        console.error('길드마크 정보를 불러오는데 실패했습니다:', error)
      }
    }

    fetchGuildMark()
  }, [guild.name])

  const renderTrophy = () => {
    if (guild.rank === 1) return <FaTrophy className="w-4 h-4 inline text-yellow-400" title="1위" />
    if (guild.rank === 2) return <FaTrophy className="w-4 h-4 inline text-gray-300" title="2위" />
    if (guild.rank === 3) return <FaTrophy className="w-4 h-4 inline text-orange-500" title="3위" />
    return null
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">
      {/* 고사리 길드 추모 공지 */}
      {guild.name === '고사리' && (
        <Card className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <span className="text-3xl">🕊️</span>
              Explorer님을 추모하며
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-2">
              <p>고사리 길드의 Explorer님의 갑작스러운 별세 소식을 전해드립니다.</p>
              <p>검은사막이라는 게임을 통해 만난 동료를 잃은 것은 정말 가슴 아픈 일입니다.</p>
              <p>Explorer님의 명복을 빌며 추모의 마음을 전합니다.</p>
              <p>게임 속에서도, 현실에서도 소중한 사람들이 건강하고 행복하기를 바랍니다.</p>
              <p>작은 인연이라도 소중히 여기며 살아가시길 바랍니다.</p>
              <div className="pt-4">
                <p className="text-lg font-semibold">🕊️ 삼가 고인의 명복을 빕니다.</p>
                <p className="text-sm text-gray-400 mt-2">- BDOPVP-포냥이 개발자 -</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 길드 기본 정보 */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-left">{guild.name}</h1>
            <FavoriteButton guildName={guild.name} />
          </div>
          {guildMark && (
            <div className="flex items-center gap-2">
              <span className="sponsor-badge flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-full shadow-lg">
                <Image
                  src="/logo.png"
                  alt="BDOPonyang 로고"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                후원
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            {guildMark ? (
              // 후원자 길드마크가 있는 경우 - 메인으로 표시
              <div className="w-[130px] h-[130px] border-4 border-white flex items-center justify-center">
                <Image
                  src={guildMark.mark_url}
                  alt="후원자 길드마크"
                  width={100}
                  height={100}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/guild-icons/default.png'
                  }}
                />
              </div>
            ) : (
              // 후원자 길드마크가 없는 경우 - 기본 이미지 표시
              <div className="w-[130px] h-[130px] border-4 border-white flex items-center justify-center">
                <Image
                  src={guild.icon_url || "/guild-icons/default.png"}
                  alt="길드 마크"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 text-sm md:text-base">
            <p><strong>인원 수 :</strong> {guild.member_count}명</p>
            <p><strong>길드리그 순위 :</strong> {guild.rank ?? "-"}위 {renderTrophy()}</p>
            <p><strong>대장 :</strong> {guild.leader}</p>
            <p>
              <strong>연맹 :</strong> {
                guild.alliance_name ? (
                  <Link 
                    href={`/alliance/${encodeURIComponent(guild.alliance_name)}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors underline hover:no-underline"
                  >
                    {guild.alliance_name}
                  </Link>
                ) : (
                  "소속 연맹 없음"
                )
              }
            </p>
            <p><strong>길드리그 전적 :</strong> {guild.wins}승 / {guild.losses}패 ({guild.winRate.toFixed(1)}%)
              {guild.winRate >= 70 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-rose-600 text-white rounded-full">고승률🔥</span>
              )}
            </p>
            <p><strong>길드 생성일 :</strong> {new Date(guild.creation_date).toLocaleDateString("ko-KR")}</p>
          </div>
        </div>
      </Card>

      {/* 차트 */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">최근 1개월 활동 요약</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <MemberTrendChart data={guild.history} currentMemberCount={guild.member_count} />
          </div>
          <div className="w-full md:w-1/2">
            <RankTrendChart guildName={guild.name} />
          </div>
        </div>
      </Card>

      {/* 길드 업적 */}
      <GuildAchievementsSection guildName={guild.name} />

      {/* 길드원 목록 */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-5">길드원 목록</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-lg text-gray-300">
          {guild.members.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
