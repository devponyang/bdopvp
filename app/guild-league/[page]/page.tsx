// ✅ 캐시 강제 비활성화 → 항상 최신 서버 데이터를 보여줌
export const dynamic = 'force-dynamic'

import { getAllGuildLeague } from "@/actions/guild-league/get-all"
import Link from "next/link"
import Image from "next/image"
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
  let rawData: any[] = []
  let guildMarks: GuildMark[] = []
  
  try {
    rawData = await getAllGuildLeague()
    
    // 길드마크 정보 가져오기
    try {
      const marksResult = await db.query('SELECT * FROM guild_marks ORDER BY created_at DESC')
      guildMarks = marksResult.rows
    } catch (error) {
      console.error('길드마크 정보를 불러오는데 실패했습니다:', error)
      guildMarks = []
    }
  } catch (error) {
    console.error('길드리그 데이터를 불러오는데 실패했습니다:', error)
    rawData = []
  }

  const data: Guild[] = rawData && rawData.length > 0 ? rawData.map((guild: any) => ({
    name: guild.guild_name || '알 수 없는 길드',
    wins: guild.wins || 0,
    losses: guild.losses || 0,
    winRate:
      guild.wins + guild.losses > 0
        ? Number(((guild.wins / (guild.wins + guild.losses)) * 100).toFixed(1))
        : 0,
    score: guild.score || 0,
    rank: guild.rank || 0,
    updated_at: guild.updated_at || new Date(),
    snapshot_date: guild.snapshot_date || new Date(),
    rankChange: guild.rank_diff || '-',
    score_diff: guild.score_diff || '-',
  })) : []

  // 길드마크 매핑 함수
  const getGuildMark = (guildName: string) => {
    return guildMarks.find(mark => mark.guild_name === guildName)
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto mt-6">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-sm"></div>
          <div className="relative bg-gradient-to-r from-slate-800/80 to-blue-900/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/10">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-white mb-4">길드 리그 데이터를 불러오는 중...</h2>
              <p className="text-gray-400">잠시만 기다려주세요.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
    <div className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto mt-6">
      {/* 메인 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/ponyang/guildleague-bg.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 40%"
          }}
        ></div>
        
        {/* 콘텐츠 */}
        <div className="relative p-3 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* 왼쪽: 아이콘과 제목 */}
            <div className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl blur-sm"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-3xl">⚔️</div>
                </div>
              </div>
              
              {/* 제목 블록 */}
              <div className="px-4 py-3">
                <h1 className="text-4xl font-bold text-white">
                  길드 리그
                </h1>
                <div className="text-lg text-white font-medium">
                  시즌 1 순위
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 날짜와 업데이트 정보 */}
            <div className="flex flex-col gap-2">
              {/* 날짜 */}
              {updatedAt && (
                <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2">
                  <div className="text-white/70">📅</div>
                  <span className="text-white text-base font-medium">{updatedAt}</span>
                </div>
              )}
              
              {/* 업데이트 알림 */}
              <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2">
                <div className="text-white/70">⏰</div>
                <span className="text-white text-base font-medium">매일 오전 업데이트</span>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden space-y-2">
            {/* 상단: 제목만 */}
            <div className="flex flex-col items-center text-center">
              <div>
                <h1 className="text-xl font-bold text-white">
                  길드 리그
                </h1>
                <div className="text-xs text-white font-medium">
                  시즌 1 순위
                </div>
              </div>
            </div>
            
            {/* 하단: 날짜와 업데이트 정보 */}
            <div className="flex flex-col gap-1">
              {/* 날짜 */}
              {updatedAt && (
                <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-lg px-3 py-1 border border-white/20 flex items-center justify-center gap-2">
                  <div className="text-white/70 text-xs">📅</div>
                  <span className="text-white text-xs font-medium">{updatedAt}</span>
                </div>
              )}
              
              {/* 업데이트 알림 */}
              <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-lg px-3 py-1 border border-white/20 flex items-center justify-center gap-2">
                <div className="text-white/70 text-xs">⏰</div>
                <span className="text-white text-xs font-medium">매일 오전 업데이트</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-8 mb-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 shadow-lg">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base text-blue-200">
            <span className="text-xl">💡</span>
            <span className="font-medium">
              길드명을 클릭하면 해당 길드의 <span className="text-yellow-300 font-bold">상세 정보</span>를 확인할 수 있습니다!
            </span>
          </div>
        </div>
      </div>

      {/* 랭킹 테이블 */}
      <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

        {/* 데스크톱 테이블 */}
        <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-lg text-center">
          <thead className="bg-gradient-to-r from-slate-700/80 to-blue-800/80 backdrop-blur-sm border-b border-white/20">
            <tr>
              <th className="px-6 py-4 font-bold text-lg text-white">순위</th>
              <th className="px-2 py-4 font-bold text-lg text-white w-10"></th>
              <th className="px-6 py-4 font-bold text-lg text-white">길드명</th>
              <th className="px-6 py-4 font-bold text-lg text-white">승 / 패</th>
              <th className="px-6 py-4 font-bold text-lg text-white">승률</th>
              <th className="px-6 py-4 font-bold text-lg text-white">점수</th>
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
                  className={`border-b border-white/10 transition-all duration-300 hover:bg-white/5 ${
                    guild.rank <= 3 ? rankStyles[guild.rank - 1] + " rank-header" : "text-white"
                  }`}
                  style={guild.rank <= 3 ? {
                    backgroundImage: `url('/ponyang/${guild.rank}st-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  } : {}}
                >
                  <td className="py-4 px-6 font-bold">
                    <div className="flex items-center justify-center gap-2">
                      {guild.rank <= 3 ? (
                        <Image
                          src={`/ponyang/${guild.rank}st.png`}
                          alt={`${guild.rank}등`}
                          width={40}
                          height={40}
                          className="inline relative top-1"
                        />
                      ) : (
                        <span>{guild.rank}</span>
                      )}
                      <span className={`text-xs ${changeColor}`}>{rankChange}</span>
                    </div>
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
                        unoptimized
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
              className={`p-6 rounded-2xl border-2 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                guild.rank <= 3 ? rankStyles[guild.rank - 1] + " rank-header" : "bg-gradient-to-r from-slate-800/60 to-blue-900/60 border-white/20 text-white backdrop-blur-sm"
              }`}
              style={guild.rank <= 3 ? {
                backgroundImage: `url('/ponyang/${guild.rank}st-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              } : {}}
            >
              {/* 순위, 길드마크, 길드명 */}
              <div className="flex items-center justify-between mb-3">
                {/* 순위와 변화 - 왼쪽 */}
                <div className="flex items-center gap-2">
                  {guild.rank <= 3 ? (
                    <Image
                      src={`/ponyang/${guild.rank}st.png`}
                      alt={`${guild.rank}등`}
                      width={48}
                      height={48}
                      className="inline relative top-1"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">{guild.rank}</span>
                  )}
                  <span className={`text-sm ${changeColor}`}>{rankChange}</span>
                </div>
                
                {/* 길드마크와 길드명 - 가운데 */}
                <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
                  {/* 길드마크 */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {guildMark ? (
                      <Image
                        src={guildMark.mark_url}
                        alt={`${guild.name} 길드마크`}
                        width={32}
                        height={32}
                        className="object-contain"
                        unoptimized
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
                    className="text-xl md:text-lg font-semibold text-white hover:text-blue-400"
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
      </div>
    </div>
  )
}