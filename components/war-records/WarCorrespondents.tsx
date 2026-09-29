'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

interface WarCorrespondent {
  id: number
  streamer_name: string
  description: string
  profile_image_url: string
  url: string
  isLive: boolean
  viewerCount: number
}

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div
    className="rounded-xl overflow-hidden border border-zinc-800/50"
    style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.65 0.25 290)' }}
  >
    {children}
  </div>
)

const Header = () => (
  <div
    className="flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.06]"
    style={{ background: 'oklch(0.12 0.02 270)' }}
  >
    <span className="text-sm">📺</span>
    <h3 className="text-sm font-bold text-white">종군기자</h3>
  </div>
)

export default function WarCorrespondents() {
  const { data: correspondents = [], isLoading, error } = useQuery<WarCorrespondent[]>({
    queryKey: ['war-correspondents'],
    queryFn: async () => {
      const res = await fetch('/api/war-correspondents/live')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  if (isLoading) return (
    <CardShell>
      <Header />
      <div className="px-4 py-3 space-y-2">
        {[1, 2].map(i => (
          <div key={i} className="h-12 bg-zinc-800/40 rounded-lg animate-pulse" />
        ))}
      </div>
    </CardShell>
  )

  if (error || correspondents.length === 0) return (
    <CardShell>
      <Header />
      <div className="py-8 text-center text-zinc-600 text-xs">
        현재 활동 중인 종군기자가 없습니다.
      </div>
    </CardShell>
  )

  return (
    <CardShell>
      <Header />

      <div className="divide-y divide-white/[0.05]">
        {correspondents.map(c => (
          <CorrespondentRow key={c.id} c={c} />
        ))}
      </div>

      <div
        className="px-4 py-2.5 border-t border-white/[0.05] text-[11px] text-zinc-600"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        방송 중이면 거점전 외 콘텐츠도 LIVE로 표시됩니다.
      </div>
    </CardShell>
  )
}

function CorrespondentRow({ c }: { c: WarCorrespondent }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group">
      {/* 프로필 이미지 */}
      <div className="relative shrink-0">
        {!imgError && c.profile_image_url ? (
          <img
            src={c.profile_image_url}
            alt={c.streamer_name}
            className="w-9 h-9 rounded-full object-cover border border-white/10"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white/10"
            style={{ background: 'oklch(0.65 0.25 290)' }}
          >
            {c.streamer_name.charAt(0)}
          </div>
        )}
        {c.isLive && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[oklch(0.1_0.015_270)] animate-pulse" />
        )}
      </div>

      {/* 이름 + 상태 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-200 truncate">{c.streamer_name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {c.isLive ? (
            <span className="text-[10px] font-bold text-red-400">● LIVE</span>
          ) : (
            <span className="text-[10px] text-zinc-700">오프라인</span>
          )}
          {c.viewerCount > 0 && (
            <span className="text-[10px] text-zinc-600 tabular-nums">{c.viewerCount.toLocaleString()}명</span>
          )}
        </div>
        {c.description && (
          <p className="text-[10px] text-zinc-600 truncate mt-0.5">{c.description}</p>
        )}
      </div>

      {/* 시청 버튼 */}
      <a
        href={c.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors border ${
          c.isLive
            ? 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25'
            : 'bg-zinc-800 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
        }`}
      >
        {c.isLive ? '시청하기' : '채널'}
      </a>
    </div>
  )
}
