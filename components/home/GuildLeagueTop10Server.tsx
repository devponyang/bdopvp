import Link from "next/link"
import Image from "next/image"
import { getGuildLeagueTop10 } from '@/lib/queries/guild-league'

export default async function GuildLeagueTop10Server() {
  const guilds = await getGuildLeagueTop10()

  const getRankChangeStyle = (change: string) => {
    if (change.startsWith("▲")) return "text-red-400"
    if (change.startsWith("▼")) return "text-blue-400"
    return "text-gray-400"
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px] overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2 flex-1">
          <span className="text-xl">🏆</span>
          길드 리그 TOP 10
        </h2>
        <Link
          href="/guild-league"
          className="text-xs text-gray-300 hover:text-white transition-colors whitespace-nowrap"
        >
          랭킹 →
        </Link>
      </div>

      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="text-white text-center bg-white/5 border-b border-white/10">
            <th className="px-2 py-2 text-xs font-medium">순위</th>
            <th className="px-2 py-2 text-xs font-medium">길드명</th>
            <th className="px-2 py-2 text-xs font-medium">승 / 패</th>
            <th className="px-2 py-2 text-xs font-medium">승률</th>
            <th className="px-2 py-2 text-xs font-medium">점수</th>
          </tr>
        </thead>
        <tbody className="text-center text-white">
          {guilds.map((g, i) => {
            const total = g.wins + g.losses
            const rate = total > 0 ? Math.round((g.wins / total) * 100) : 0
            const rankChange = g.rankChange ?? "-"
            const changeColor = getRankChangeStyle(rankChange)
            const rank = i + 1

            return (
              <tr 
                key={g.guild_name} 
                className="h-[42px] border-b border-white/5 hover:bg-white/5 transition-colors"
                style={rank <= 3 ? {
                  backgroundImage: `url('/ponyang/${rank}st-bg.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                } : {}}
              >
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    {rank <= 3 ? (
                      <Image
                        src={`/ponyang/${rank}st.png`}
                        alt={`${rank}등`}
                        width={36}
                        height={36}
                        className="inline relative top-1"
                      />
                    ) : (
                      <span className="w-6 text-right">{rank}</span>
                    )}
                    <span className={`w-6 text-left text-xs ${changeColor}`}>{rankChange}</span>
                  </div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <Link href={`/guild/${encodeURIComponent(g.guild_name)}`} className="text-gray-200 hover:text-blue-300 transition-colors">
                    {g.guild_name}
                  </Link>
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-300">
                  {g.wins}승 / {g.losses}패
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-300">{rate}%</td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-300">{g.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
