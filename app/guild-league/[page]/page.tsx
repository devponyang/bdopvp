// ✅ 캐시 강제 비활성화 → 항상 최신 서버 데이터를 보여줌
export const dynamic = 'force-dynamic'

import { getAllGuildLeague } from "@/actions/guild-league/get-all"
import { Card } from "@/components/card"
import { Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import PonyangLoading from '../../components/PonyangLoading'
import { db } from '@/lib/db'

interface Guild {
  name: string
  wins: number
  losses: number
  winRate: number
  score: number
  rank: number
  updated_at: Date
  rankChange?: string
  snapshot_date: Date
  score_diff?: string
}

interface GuildMark {
  id: number
  guild_name: string
  mark_url: string
  created_at: string
  updated_at: string
}


export default async function GuildLeaguePage() {
  const rawData = await getAllGuildLeague()
  
  // 길드마크 정보 가져오기
  let guildMarks: GuildMark[] = []
  try {
    const marksResult = await db.query('SELECT * FROM guild_marks ORDER BY created_at DESC')
    guildMarks = marksResult.rows
  } catch (error) {
    console.error('길드마크 정보를 불러오는데 실패했습니다:', error)
  }

  const data: Guild[] = rawData.map((guild: any) => ({
    name: guild.guild_name,
    wins: guild.wins,
    losses: guild.losses,
    winRate:
      guild.wins + guild.losses > 0
        ? Number(((guild.wins / (guild.wins + guild.losses)) * 100).toFixed(1))
        : 0,
    score: guild.score,
    rank: guild.rank,
    updated_at: guild.updated_at,
    snapshot_date: guild.snapshot_date,
    rankChange: guild.rank_diff,
    score_diff: guild.score_diff,
  }))

  // 길드마크 매핑 함수
  const getGuildMark = (guildName: string) => {
    return guildMarks.find(mark => mark.guild_name === guildName)
  }

  if (!data || data.length === 0) return <PonyangLoading />

  const guilds = data

  const updatedAt =
    data.length > 0 && data[0].snapshot_date
      ? new Date(new Date(data[0].snapshot_date).getTime() + 9 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : ""

  const rankStyles = [
    "bg-gradient-to-r from-yellow-500 to-black-700 text-white", // 1위
    "bg-gradient-to-r from-gray-400 to-black-700 text-white",   // 2위
    "bg-gradient-to-r from-amber-700 to-black-700 text-white", // 3위
  ]

  const getRankChangeStyle = (change: string) => {
    if (change.startsWith("▲")) return "text-red-400"
    if (change.startsWith("▼")) return "text-blue-400"
    return "text-gray-300"
  }

  return (
    <Card className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-3 md:p-6 rounded-2xl shadow-lg flex items-center justify-center mb-2 guild-league-header">
        <h2 className="text-2xl md:text-4xl text-center font-bold text-white flex items-center gap-2 m-0">
          <Trophy className="w-6 h-6 md:w-8 md:h-8 fill-yellow-400 text-yellow-400" />
          <span className="text-lg md:text-4xl">길드 리그 - 정규 시즌 순위</span>
        </h2>
      </div>
      <div className="flex justify-between w-full text-sm text-white mt-2 px-2 mb-4">
        <span>⏰ 매일 오전 중에 업데이트 중입니다.</span>
        <span>📅 {updatedAt}</span>
      </div>

      {/* 데스크톱 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-lg text-center">
          <thead>
            <tr className="border-0 bg-gray-800 border-gray-700 text-white-300 guild-table-header">
              <th className="py-3 px-2 text-xl">순위</th>
              <th className="py-3 px-0 text-xl w-10"></th>
              <th className="py-3 px-2 text-xl">길드명</th>
              <th className="py-3 px-2 text-xl">승/패</th>
              <th className="py-3 px-2 text-xl">승률</th>
              <th className="py-3 px-2 text-xl">점수</th>
            </tr>
          </thead>
          <tbody>
            {guilds.map((guild) => {
              const rankChange = guild.rankChange || "-"
              const changeColor = getRankChangeStyle(rankChange)
              const guildMark = getGuildMark(guild.name)
              
              // 점수 변화 색상
              let scoreChangeColor = "text-gray-300"
              if (guild.score_diff?.startsWith("▲")) scoreChangeColor = "text-red-400"
              else if (guild.score_diff?.startsWith("▼")) scoreChangeColor = "text-blue-400"

              return (
                <tr
                  key={guild.name}
                  className={`border-b border-gray-700 text-white ${
                    guild.rank <= 3 ? rankStyles[guild.rank - 1] + " rank-header" : ""
                  } text-lg`}
                >
                  <td className="py-3 px-2 font-semibold flex items-center justify-center gap-1">
                    <span className="w-6 text-right">{guild.rank}</span>
                    <span className={`w-6 text-left text-xs ${changeColor}`}>{rankChange}</span>
                  </td>
                  <td className="py-3 px-0 text-right w-10">
                    {guildMark ? (
                      <div className="w-6 h-6 ml-auto flex items-center justify-center">
                        <Image
                          src={guildMark.mark_url}
                          alt={`${guild.name} 길드마크`}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 ml-auto flex items-center justify-center text-gray-500 text-xs">
                        -
                      </div>
                    )}
                  </td>
                  <td className={`py-3 px-2 text-center ${
                    guild.rank <= 3 ? "font-bold text-white hover:text-blue-400" : "font-semibold text-white-300 hover:text-blue-400"
                  }`}>
                    <Link href={`/guild/${encodeURIComponent(guild.name)}`}>
                      {guild.name}
                    </Link>
                  </td>
                  <td className={`py-3 px-2 ${
                    guild.rank <= 3 ? "font-bold text-white" : "font-semibold"
                  }`}>
                    {guild.wins}승 / {guild.losses}패
                  </td>
                  <td className="py-3 px-2 font-semibold">
                    {guild.winRate >= 80 ? (
                      <span className="text-rose-400 font-bold">{guild.winRate}%</span>
                    ) : guild.winRate >= 70 ? (
                      <span className="text-yellow-300 font-semibold">{guild.winRate}%</span>
                    ) : (
                      <span className="text-shadow-black">{guild.winRate}%</span>
                    )}
                  </td>
                  <td className={`py-3 px-2 ${
                    guild.rank <= 3 ? "font-bold" : "font-semibold"
                  }`}>
                    <div className="flex items-center justify-center">
                      <span className={`inline-block min-w-[56px] text-right ${
                        guild.rank <= 3 ? "text-white" : ""
                      }`}>{guild.score}</span>
                      <span className={`ml-1 text-xs ${scoreChangeColor} inline-block min-w-[48px] align-middle`}>
                        ({guild.score_diff && guild.score_diff !== '-' ? guild.score_diff : ' - '})
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 레이아웃 */}
      <div className="md:hidden space-y-3">
        {guilds.map((guild) => {
          const rankChange = guild.rankChange || "-"
          const changeColor = getRankChangeStyle(rankChange)
          const guildMark = getGuildMark(guild.name)

          return (
            <div
              key={guild.name}
              className={`p-4 rounded-lg border guild-card ${
                guild.rank <= 3 ? rankStyles[guild.rank - 1] + " rank-header" : "bg-gradient-to-r from-slate-800/50 to-blue-900/50 border-gray-700 text-white"
              }`}
            >
              {/* 순위, 길드마크, 길드명 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{guild.rank}</span>
                  <span className={`text-sm ${changeColor}`}>{rankChange}</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* 길드마크 */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {guildMark ? (
                      <Image
                        src={guildMark.mark_url}
                        alt={`${guild.name} 길드마크`}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-gray-500 text-sm">
                        -
                      </div>
                    )}
                  </div>
                  {/* 길드명 */}
                  <Link 
                    href={`/guild/${encodeURIComponent(guild.name)}`}
                    className="text-xl md:text-lg font-semibold text-white hover:text-blue-400 truncate max-w-[200px]"
                  >
                    {guild.name}
                  </Link>
                </div>
              </div>

              {/* 전적 정보 */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-xs mb-1">승/패</div>
                  <div className="text-white font-semibold">{guild.wins}승 / {guild.losses}패</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">승률</div>
                  <div className="font-semibold">
                    {guild.winRate >= 80 ? (
                      <span className="text-rose-400 font-bold">{guild.winRate}%</span>
                    ) : guild.winRate >= 70 ? (
                      <span className="text-yellow-300 font-semibold">{guild.winRate}%</span>
                    ) : (
                      <span className="text-white">{guild.winRate}%</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">점수</div>
                  <div className="text-white font-semibold">{guild.score}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </Card>
  )
}