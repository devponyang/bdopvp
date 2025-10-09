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
    <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px] overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2 flex-1">
          <span className="text-xl">🌟</span>
          솔라레의 창 TOP 10
        </h2>
        <Link
          href="/solare-league"
          className="text-xs text-gray-300 hover:text-white transition-colors whitespace-nowrap"
        >
          랭킹 →
        </Link>
      </div>

      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="text-white text-center bg-white/5 border-b border-white/10">
            <th className="px-2 py-2 text-xs font-medium">순위</th>
            <th className="px-2 py-2 text-xs font-medium">티어</th>
            <th className="px-2 py-2 text-xs font-medium">가문명</th>
            <th className="px-2 py-2 text-xs font-medium">클래스</th>
            <th className="px-2 py-2 text-xs font-medium">승률</th>
            <th className="px-2 py-2 text-xs font-medium">점수</th>
          </tr>
        </thead>
        <tbody className="text-center text-white">
          {entries.map((e: Entry) => {
            const total = e.wins + e.draws + e.losses
            const winRate = total > 0 ? Math.round((e.wins / total) * 100) : 0
            const rankChange = e.rankChange ?? "-"
            const changeColor = getRankChangeStyle(rankChange)

            return (
              <tr 
                key={`${e.name}-${e.rank}`} 
                className="h-[42px] border-b border-white/5 hover:bg-white/5 transition-colors"
                style={e.rank <= 3 ? {
                  backgroundImage: `url('/ponyang/${e.rank}st-bg.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                } : {}}
              >
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    {e.rank <= 3 ? (
                      <Image
                        src={`/ponyang/${e.rank}st.png`}
                        alt={`${e.rank}등`}
                        width={36}
                        height={36}
                        className="inline relative top-1"
                      />
                    ) : (
                      <span className="w-6 text-right">{e.rank}</span>
                    )}
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

                <td className="px-2 py-1 whitespace-nowrap text-gray-200">{e.name}</td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-300">
                  <div className="flex items-center justify-center gap-1">
                    {e.subclass === '전승' && (
                      <Image
                        src="/ponyang/ac.png"
                        alt="전승"
                        width={20}
                        height={20}
                        className="inline"
                      />
                    )}
                    {e.subclass === '각성' && (
                      <Image
                        src="/ponyang/aw.png"
                        alt="각성"
                        width={20}
                        height={20}
                        className="inline"
                      />
                    )}
                    {(!e.subclass || (e.subclass !== '전승' && e.subclass !== '각성')) && (
                      <>
                        {e.class === '샤이' && (
                          <Image
                            src="/ponyang/shai.png"
                            alt="샤이"
                            width={20}
                            height={20}
                            className="inline"
                          />
                        )}
                        {e.class === '스칼라' && (
                          <Image
                            src="/ponyang/scara.png"
                            alt="스칼라"
                            width={20}
                            height={20}
                            className="inline"
                          />
                        )}
                        {e.class === '아처' && (
                          <Image
                            src="/ponyang/archer.png"
                            alt="아처"
                            width={20}
                            height={20}
                            className="inline"
                          />
                        )}
                        {e.class === '오공' && (
                          <Image
                            src="/ponyang/ukong.png"
                            alt="오공"
                            width={20}
                            height={20}
                            className="inline"
                          />
                        )}
                        {e.class === '데드아이' && (
                          <Image
                            src="/ponyang/dead.png"
                            alt="데드아이"
                            width={20}
                            height={20}
                            className="inline"
                          />
                        )}
                      </>
                    )}
                    <span>{e.class}</span>
                  </div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-300">{winRate}%</td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-300">{e.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
