'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
      <div className="animate-pulse">
        <div className="bg-white/10 rounded h-6 w-3/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 rounded-lg h-12"></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
        <span className="text-xl">🛠️</span>
        검은사막 업데이트
      </h2>
      <div className="space-y-2">
        {updates.map((item, idx) => (
          <Link
            key={item.id || idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all duration-200 group"
            title={item.title}
          >
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border border-blue-500/40">
                {formatDate(item.date)}
              </div>
              <span className="font-medium text-gray-200 group-hover:text-blue-300 transition-colors text-xs leading-tight line-clamp-2">
                {stripTitle(item.title)}
              </span>
            </div>
          </Link>
        ))}
      </div>
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
