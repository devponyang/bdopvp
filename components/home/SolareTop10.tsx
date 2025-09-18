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
    return "text-gray-400"
  }

  return (
    <div className="bg-zinc-800 rounded-xl border border-black dark:border-zinc-700 shadow px-4 py-5 w-full max-w-[400px] overflow-x-auto">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-semibold text-center">🌟 솔라레의 창 TOP 10</h2>
        <Link
          href="/solare-league"
          className="self-end text-sm text-white hover:underline mt-1"
        >
          랭킹 바로가기
        </Link>
      </div>

      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="text-white text-center bg-gray-800 border-gray-700">
            <th className="px-2 py-2">순위</th>
            <th className="px-2 py-2">티어</th>
            <th className="px-2 py-2">가문명</th>
            <th className="px-2 py-2">클래스</th>
            <th className="px-2 py-2">승률</th>
            <th className="px-2 py-2">점수</th>
          </tr>
        </thead>
        <tbody className="text-center text-white ">
          {entries.map((e: Entry) => {
            const total = e.wins + e.draws + e.losses
            const winRate = total > 0 ? Math.round((e.wins / total) * 100) : 0
            const rankChange = e.rankChange ?? "-"
            const changeColor = getRankChangeStyle(rankChange)

            return (
              <tr key={`${e.name}-${e.rank}`} className="h-[42px] border-b border-gray-500">
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-6 text-right">{e.rank}</span>
                    <span className={`w-6 text-left text-xs ${changeColor}`}>{rankChange}</span>
                  </div>
                </td>

                <td className="px-2 py-1">
                  <Image
                    src={`/solare-icons/${e.tier}.png`}
                    alt="티어"
                    width={26}
                    height={26}
                    className="mx-auto"
                  />
                </td>

                <td className="px-2 py-1 whitespace-nowrap text-white-300">{e.name}</td>
                <td className="px-2 py-1 whitespace-nowrap">{e.class}</td>
                <td className="px-2 py-1 whitespace-nowrap">{winRate}%</td>
                <td className="px-2 py-1 whitespace-nowrap">{e.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
