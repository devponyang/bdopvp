'use client'

import Image from 'next/image'
import { getTier } from '@/lib/utils/tier'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  rankChange?: string
}

interface Props {
  data: Entry[]
}

export default function SolareTable({ data }: Props) {
  // ✅ 중복 제거: name + score + class 조합으로 유일한 데이터만 남김
  const uniqueData = Array.from(
    new Map(data.map((d) => [`${d.name}-${d.score}-${d.class}`, d])).values()
  )

  // 상위 3등 배경 스타일 (길드리그와 동일)
  const rankStyles = [
    "bg-gradient-to-r from-yellow-500 to-black-700 text-white rank-header", // 1위
    "bg-gradient-to-r from-gray-400 to-black-700 text-white rank-header",   // 2위
    "bg-gradient-to-r from-amber-700 to-black-700 text-white rank-header", // 3위
  ]

  return (
    <div className="rounded-xl">
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-lg text-center solare-table">
        <thead className="py-2 bg-gray-800 border-gray-700 text-white font-semibold">
          <tr>
            <th className="px-3 py-2">순위</th>
            <th className="px-2 py-1">티어</th>
            <th className="px-2 py-1">가문명</th>
            <th className="px-2 py-1">전승/각성</th>
            <th className="px-2 py-1">클래스</th>
            <th className="px-2 py-1">승 / 무 / 패</th>
            <th className="px-2 py-1">승률</th>
            <th className="px-2 py-1">점수</th>
          </tr>
        </thead>
        <tbody>
          {uniqueData.map((entry, idx) => {
            const tier = getTier(entry.score)
            const change = entry.rankChange || '-'
            let changeColor = 'text-gray-400'
            if (change.startsWith('▲')) changeColor = 'text-red-500'
            else if (change.startsWith('▼')) changeColor = 'text-blue-500'
            else if (change === 'NEW') changeColor = 'text-green-600'

            return (
              <tr 
                key={`${entry.name}-${entry.score}-${idx}`} 
                className={`border-b border-gray-700 ${
                  idx < 3 ? rankStyles[idx] : "text-black dark:!text-white"
                }`}
              >
                <td className="py-3 px-2 font-semibold flex items-center justify-center gap-1">
                  <span>{idx + 1}</span>
                  <span className={`text-xs ${changeColor}`}>{change}</span>
                </td>
                <td className="py-3 px-2">
                  <Image
                    src={`/solare-icons/${tier}.png`}
                    alt={`${tier} 티어 아이콘`}
                    width={40}
                    height={40}
                    className="mx-auto"
                  />
                </td>
                <td
                  className="py-3 px-2 font-semibold"
                  style={{
                    minWidth: '150px',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.name}
                </td>
                <td className="py-3 px-2 font-semibold">{entry.subclass}</td>
                <td className="py-3 px-2 font-semibold">{entry.class}</td>
                <td className="py-3 px-2 font-semibold">
                  {entry.wins}/{entry.draws}/{entry.losses}
                </td>
                <td className="py-3 px-2 font-semibold">
                  {entry.wins + entry.draws + entry.losses > 0 ? (
                    (() => {
                      const winRate = Math.round((entry.wins / (entry.wins + entry.draws + entry.losses)) * 100)
                      if (winRate >= 80) {
                        return <span className="text-rose-400 font-bold">{winRate}%</span>
                      } else if (winRate >= 70) {
                        return <span className="text-yellow-300 font-semibold">{winRate}%</span>
                      } else {
                        return <span className="text-shadow-black">{winRate}%</span>
                      }
                    })()
                  ) : '-'}
                </td>
                <td className="py-3 px-2 font-semibold">{entry.score}</td>
              </tr>
            )
          })}
        </tbody>
        </table>
      </div>

      {/* 모바일 카드 레이아웃 */}
      <div className="md:hidden space-y-3">
        {uniqueData.map((entry, idx) => {
          const tier = getTier(entry.score)
          const change = entry.rankChange || '-'
          let changeColor = 'text-gray-400'
          if (change.startsWith('▲')) changeColor = 'text-red-500'
          else if (change.startsWith('▼')) changeColor = 'text-blue-500'
          else if (change === 'NEW') changeColor = 'text-green-600'

          return (
            <div
              key={`mobile-${entry.name}-${entry.score}-${idx}`}
              className={`p-4 rounded-lg border ${
                idx < 3 ? rankStyles[idx] : "bg-gradient-to-r from-slate-800/50 to-blue-900/50 border-gray-700 text-white"
              }`}
            >
              {/* 순위, 티어 아이콘, 가문명 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{idx + 1}</span>
                  <span className={`text-sm ${changeColor}`}>{change}</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* 티어 아이콘 */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src={`/solare-icons/${tier}.png`}
                      alt={`${tier} 티어 아이콘`}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  {/* 가문명 */}
                  <div className="text-xl md:text-lg font-semibold text-white truncate max-w-[200px]">
                    {entry.name}
                  </div>
                </div>
              </div>

              {/* 전적 정보 */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-xs mb-1">승/무/패</div>
                  <div className="text-white font-semibold">{entry.wins}/{entry.draws}/{entry.losses}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">승률</div>
                  <div className="font-semibold">
                    {entry.wins + entry.draws + entry.losses > 0 ? (
                      (() => {
                        const winRate = Math.round((entry.wins / (entry.wins + entry.draws + entry.losses)) * 100)
                        if (winRate >= 80) {
                          return <span className="text-rose-400 font-bold">{winRate}%</span>
                        } else if (winRate >= 70) {
                          return <span className="text-yellow-300 font-semibold">{winRate}%</span>
                        } else {
                          return <span className="text-white">{winRate}%</span>
                        }
                      })()
                    ) : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">점수</div>
                  <div className="text-white font-semibold">{entry.score}</div>
                </div>
              </div>
              
              {/* 클래스 정보 */}
              <div className="mt-3 text-center">
                <span className="text-gray-300 text-sm">{entry.subclass} {entry.class}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
