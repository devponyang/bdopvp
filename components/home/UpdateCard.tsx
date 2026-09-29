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

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div
    className="w-full max-w-[400px] rounded-xl overflow-hidden border border-zinc-800/50"
    style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
  >
    {children}
  </div>
)

export default function UpdateCard({ data }: UpdateCardProps) {
  const [updates, setUpdates] = useState<UpdateItem[]>(data || [])
  const [loading, setLoading] = useState(data ? false : true)

  useEffect(() => {
    if (data) return
    fetch('/api/updates')
      .then(res => res.json())
      .then(d => setUpdates(d))
      .catch(err => console.error('업데이트 불러오기 실패:', err))
      .finally(() => setLoading(false))
  }, [data])

  if (loading) return (
    <CardShell>
      <div
        className="px-4 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <div className="h-4 w-32 bg-zinc-700/60 rounded animate-pulse" />
      </div>
      <div className="px-4 py-3 space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 bg-zinc-800/40 rounded-lg animate-pulse" />
        ))}
      </div>
    </CardShell>
  )

  return (
    <CardShell>
      {/* 헤더 */}
      <div
        className="flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <img
          src="/icons/home-icon.png"
          alt="업데이트"
          className="w-4 h-4 object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <h2 className="text-sm font-bold text-white">검은사막 업데이트</h2>
      </div>

      {/* 업데이트 목록 */}
      <div className="divide-y divide-white/[0.05]">
        {updates.map((item, idx) => (
          <Link
            key={item.id || idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group"
            title={item.title}
          >
            <span className="shrink-0 text-[11px] text-zinc-500 tabular-nums w-14">
              {formatDate(item.date)}
            </span>
            <span className="text-xs text-zinc-300 group-hover:text-white transition-colors leading-tight line-clamp-2 flex-1">
              {stripTitle(item.title)}
            </span>
          </Link>
        ))}
      </div>
    </CardShell>
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
    .replace(/^\d+월 \d+일\(.\)\s*/, '')
    .replace(/\(최종\s*수정\s*:[^)]+\)/g, '')
    .trim()
}
