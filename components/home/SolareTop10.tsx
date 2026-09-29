import Image from "next/image"
import Link from "next/link"
import { getSolareTop10 } from "@/lib/queries/solare-league"

interface Entry {
  name: string
  class: string
  subclass: string
  wins: number
  draws: number
  losses: number
  score: number
  rank: number
  rankChange?: string
  tier: string
}

export default async function SolareTop10() {
  const entries = await getSolareTop10()

  const getRankChangeStyle = (change: string) => {
    if (change.startsWith("▲")) return "text-red-400"
    if (change.startsWith("▼")) return "text-blue-400"
    if (change === "NEW") return "text-green-500"
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
          <img src="/icons/rank1.png" alt="솔라레의 창" className="w-5 h-5 object-contain" />
          솔라레의 창 TOP 10
        </h2>
        <Link
          href="/solare-league"
          className="text-xs text-[oklch(0.85_0.18_200/0.6)] hover:text-[oklch(0.85_0.18_200)] transition-colors"
        >
          랭킹 →
        </Link>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed min-w-0">
          <thead>
            <tr
              className="text-center border-b border-white/[0.06]"
              style={{ background: 'oklch(0.115 0.018 270)' }}
            >
              <th className="px-2 py-2.5 text-xs font-medium text-zinc-300 w-16">순위</th>
              <th className="px-2 py-2.5 text-xs font-medium text-zinc-300 w-10">티어</th>
              <th className="px-2 py-2.5 text-xs font-medium text-zinc-300 w-20">가문명</th>
              <th className="px-2 py-2.5 text-xs font-medium text-zinc-300 w-16">클래스</th>
              <th className="px-2 py-2.5 text-xs font-medium text-zinc-300 w-12">승률</th>
              <th className="px-2 py-2.5 text-xs font-medium text-zinc-300 w-12">점수</th>
            </tr>
          </thead>
          <tbody className="text-center divide-y divide-white/[0.04]">
            {entries.map((e: Entry) => {
              const total = e.wins + e.draws + e.losses
              const winRate = total > 0 ? Math.round((e.wins / total) * 100) : 0
              const rankChange = e.rankChange ?? "-"
              const changeColor = getRankChangeStyle(rankChange)

              return (
                <tr
                  key={`${e.name}-${e.rank}`}
                  className="h-[42px] hover:bg-white/[0.03] transition-colors"
                  style={e.rank <= 3 ? {
                    backgroundImage: `url('/ponyang/${e.rank}st-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  } : {}}
                >
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      {e.rank <= 3 ? (
                        <Image
                          src={`/ponyang/${e.rank}st.png`}
                          alt={`${e.rank}등`}
                          width={32}
                          height={32}
                          className="inline relative top-1"
                        />
                      ) : (
                        <span className="w-6 text-right text-zinc-400 text-xs">{e.rank}</span>
                      )}
                      <span className={`w-6 text-left text-xs ${changeColor}`}>{rankChange}</span>
                    </div>
                  </td>
                  <td className="px-2 py-1">
                    <Image
                      src={`/solare-icons/${e.tier}.png`}
                      alt="티어"
                      width={24}
                      height={24}
                      className="mx-auto"
                    />
                  </td>
                  <td className="px-2 py-1 text-xs text-zinc-200 max-w-[80px] truncate" title={e.name}>
                    {e.name}
                  </td>
                  <td className="px-2 py-1 text-xs text-zinc-300 text-center truncate" title={e.class}>
                    {e.class}
                  </td>
                  <td className="px-2 py-1 text-xs text-zinc-300 text-center">{winRate}%</td>
                  <td className="px-2 py-1 text-xs font-semibold text-zinc-200 text-center">{e.score}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
