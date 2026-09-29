import Link from "next/link"
import Image from "next/image"
import { getGuildLeagueTop10 } from '@/lib/queries/guild-league'

export default async function GuildLeagueTop10Server() {
  const guilds = await getGuildLeagueTop10()

  const getRankChangeStyle = (change: string) => {
    if (change.startsWith("▲")) return "text-red-400"
    if (change.startsWith("▼")) return "text-blue-400"
    return "text-zinc-600"
  }

  return (
    <div
      className="w-full max-w-[400px] rounded-xl overflow-hidden border border-zinc-800/50"
      style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
    >
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <img
            src="/icons/guild-league-icon.png"
            alt="길드 리그"
            className="w-5 h-5 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          길드 리그 TOP 10
        </h2>
        <Link
          href="/guild-league"
          className="text-xs text-[oklch(0.85_0.18_200/0.6)] hover:text-[oklch(0.85_0.18_200)] transition-colors"
        >
          랭킹 →
        </Link>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr
              className="text-center border-b border-white/[0.06]"
              style={{ background: 'oklch(0.115 0.018 270)' }}
            >
              <th className="px-3 py-2.5 text-xs font-medium text-zinc-300">순위</th>
              <th className="px-3 py-2.5 text-xs font-medium text-zinc-300">길드명</th>
              <th className="px-3 py-2.5 text-xs font-medium text-zinc-300">승 / 패</th>
              <th className="px-3 py-2.5 text-xs font-medium text-zinc-300">승률</th>
              <th className="px-3 py-2.5 text-xs font-medium text-zinc-300">점수</th>
            </tr>
          </thead>
          <tbody className="text-center divide-y divide-white/[0.04]">
            {guilds.map((g, i) => {
              const total = g.wins + g.losses
              const rate = total > 0 ? Math.round((g.wins / total) * 100) : 0
              const rankChange = g.rankChange ?? "-"
              const changeColor = getRankChangeStyle(rankChange)
              const rank = i + 1

              return (
                <tr
                  key={g.guild_name}
                  className="h-[42px] hover:bg-white/[0.03] transition-colors"
                  style={rank <= 3 ? {
                    backgroundImage: `url('/ponyang/${rank}st-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  } : {}}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      {rank <= 3 ? (
                        <Image
                          src={`/ponyang/${rank}st.png`}
                          alt={`${rank}등`}
                          width={32}
                          height={32}
                          className="inline relative top-1"
                        />
                      ) : (
                        <span className="w-6 text-right text-zinc-400 text-xs">{rank}</span>
                      )}
                      <span className={`w-6 text-left text-xs ${changeColor}`}>{rankChange}</span>
                    </div>
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap">
                    <Link
                      href={`/guild/${encodeURIComponent(g.guild_name)}`}
                      className="text-xs text-zinc-200 hover:text-[oklch(0.85_0.18_200)] transition-colors"
                    >
                      {g.guild_name}
                    </Link>
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap text-zinc-300 text-xs">
                    {g.wins}승 / {g.losses}패
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap text-zinc-300 text-xs">{rate}%</td>
                  <td className="px-3 py-1 whitespace-nowrap text-xs font-semibold text-zinc-200">
                    {g.score}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
