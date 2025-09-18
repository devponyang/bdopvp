'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ListSkeleton } from '../../app/components/SkeletonLoader'

export interface UpdateItem {
  id: number
  title: string
  link: string
  date: string
}

type UpdateCardProps = { data?: UpdateItem[] }

export default function UpdateCard({ data }: UpdateCardProps) {
  const [updates, setUpdates] = useState<UpdateItem[]>(data || [])
  const [loading, setLoading] = useState(data ? false : true)

  useEffect(() => {
    if (data) return;
    fetch('/api/updates')
      .then(res => res.json())
      .then(data => setUpdates(data))
      .catch(err => console.error('업데이트 불러오기 실패:', err))
      .finally(() => setLoading(false))
  }, [data])

  if (loading) return (
    <div className="bg-zinc-800 rounded-lg shadow p-4">
      <div className="animate-pulse">
        <div className="bg-gray-700 rounded h-6 w-3/4 mx-auto mb-4"></div>
        <div className="border-b border-gray-600 mb-4"></div>
      </div>
      <ListSkeleton items={3} />
    </div>
  )

  return (
    <div className="bg-zinc-800 rounded-xl border border-black dark:border-zinc-700 shadow px-3 md:px-4 py-3 md:py-5 w-full max-w-[400px]">
      <div className="bg-zinc-800 dark:bg-zinc-800 px-3 md:px-4 py-2 md:py-3 rounded-t-xl -mx-3 md:-mx-4 -mt-3 md:-mt-5 mb-3 md:mb-4">
        <h2 className="text-base md:text-lg font-bold text-white flex items-center justify-center gap-2">
          <span className="text-lg md:text-xl">🛠️</span>
          <span>검은사막 업데이트</span>
        </h2>
      </div>
      <div className="border-b border-slate-700/50 mb-2 md:mb-3"></div>
      <ul className="space-y-2 md:space-y-3">
        {updates.map((item, idx) => (
          <li key={item.id || idx}>
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 md:p-4 rounded-lg bg-transparent dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:shadow-lg transition-all duration-200 group"
              title={item.title}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs font-bold shrink-0 border border-blue-500/30">
                  {formatDate(item.date)}
                </div>
                <span className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200 update-text text-xs md:text-[13px] leading-tight">
                  {stripTitle(item.title)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const day = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${mm}.${dd}(${day})`
}

function stripTitle(title: string) {
  return title
    .replace(/^\d+월 \d+일\(.\)\s*/, '') // 날짜 제거
    .replace(/\(최종\s*수정\s*:[^)]+\)/g, '') // 최종 수정 제거
    .trim()
}
