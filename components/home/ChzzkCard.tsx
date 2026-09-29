'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

interface Streamer {
  nickname: string
  title: string
  isLive: boolean
  viewerCount: number
  thumbnailUrl: string
  broadcastThumbnail: string
  url: string
}

const DEFAULT_THUMBNAIL = 'https://ssl.pstatic.net/static/nng/glive/icon/favicon.png'

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div
    className="w-full max-w-[400px] rounded-xl overflow-hidden border border-zinc-800/50"
    style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.65 0.25 290)' }}
  >
    {children}
  </div>
)

const ChzzkCard = () => {
  const { data: streamers = [], isLoading, error } = useQuery<Streamer[]>({
    queryKey: ['streamers'],
    queryFn: async () => {
      const res = await fetch('/api/chzzk')
      if (!res.ok) throw new Error('Failed to fetch streamers')
      const data = await res.json()
      const hidden = ['아이온2']
      return data
        .filter((s: Streamer) => !hidden.includes(s.nickname))
        .sort((a: Streamer, b: Streamer) => {
          if (!a.isLive && b.isLive) return 1
          if (a.isLive && !b.isLive) return -1
          return (b.viewerCount || 0) - (a.viewerCount || 0)
        })
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  if (isLoading) return (
    <CardShell>
      <div
        className="px-4 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <div className="h-4 w-44 bg-zinc-700/60 rounded animate-pulse" />
      </div>
      <div className="px-4 py-3 space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="space-y-2">
            <div className="aspect-video w-full bg-zinc-800/60 rounded-md animate-pulse" />
            <div className="h-4 w-1/2 bg-zinc-800/40 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </CardShell>
  )

  if (error) return (
    <CardShell>
      <div className="py-10 text-center text-zinc-600 text-sm">
        스트리머 정보를 불러오는데 실패했습니다.
      </div>
    </CardShell>
  )

  const live = streamers.filter(s => s.isLive)
  const offline = streamers.filter(s => !s.isLive)

  return (
    <CardShell>
      {/* 헤더 */}
      <div
        className="flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <Image
          src="/tip-images/chzzk.png"
          alt="치지직"
          width={16}
          height={16}
          className="object-contain"
        />
        <h2 className="text-sm font-bold text-white">검은사막 LIVE in Chzzk</h2>
        {live.length > 0 && (
          <span className="ml-auto text-[11px] font-medium text-red-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
            {live.length}명 방송 중
          </span>
        )}
      </div>

      {streamers.length === 0 ? (
        <div className="py-10 text-center text-zinc-600 text-sm">
          현재 방송 중인 스트리머가 없습니다.
        </div>
      ) : (
        <div>
          {/* 라이브 스트리머 — 2열 그리드 */}
          <div className="grid grid-cols-2 gap-2 p-3">
            {live.map((streamer) => (
              <LiveStreamerItem key={streamer.url} streamer={streamer} />
            ))}
          </div>

          {/* 구분선 */}
          {live.length > 0 && offline.length > 0 && (
            <div className="px-4 py-2 border-t border-white/[0.05]">
              <span className="text-[10px] text-zinc-700 uppercase tracking-wider">오프라인</span>
            </div>
          )}

          {/* 오프라인 스트리머 — 컴팩트 행 */}
          <div className="divide-y divide-white/[0.04]">
            {offline.map((streamer) => (
              <OfflineStreamerItem key={streamer.url} streamer={streamer} />
            ))}
          </div>
        </div>
      )}
    </CardShell>
  )
}

const LiveStreamerItem = ({ streamer }: { streamer: Streamer }) => {
  const [thumbError, setThumbError] = useState(false)
  const [profileError, setProfileError] = useState(false)

  const hasValidThumb =
    !thumbError &&
    streamer.broadcastThumbnail &&
    streamer.broadcastThumbnail !== DEFAULT_THUMBNAIL &&
    streamer.broadcastThumbnail.startsWith('http')

  return (
    <a
      href={streamer.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg overflow-hidden hover:bg-white/[0.06] transition-colors group bg-white/[0.03]"
    >
      {/* 방송 썸네일 */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-800/60">
        {hasValidThumb ? (
          <img
            src={streamer.broadcastThumbnail}
            alt={`${streamer.nickname}의 방송`}
            className="w-full h-full object-cover"
            onError={() => setThumbError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.2 0.05 290), oklch(0.15 0.03 270))' }}
          >
            <span className="text-zinc-600 text-xs">썸네일 없음</span>
          </div>
        )}
        <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
          LIVE
        </span>
        {streamer.viewerCount > 0 && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded tabular-nums">
            {streamer.viewerCount.toLocaleString()}명
          </span>
        )}
      </div>

      {/* 프로필 + 닉네임 */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        {!profileError && streamer.thumbnailUrl && streamer.thumbnailUrl !== DEFAULT_THUMBNAIL ? (
          <img
            src={streamer.thumbnailUrl}
            alt={streamer.nickname}
            className="w-5 h-5 rounded-full object-cover shrink-0"
            onError={() => setProfileError(true)}
          />
        ) : (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
            style={{ background: 'oklch(0.65 0.25 290)' }}
          >
            {streamer.nickname.charAt(0).toUpperCase()}
          </div>
        )}
        <p className="text-[11px] font-medium text-zinc-300 group-hover:text-[oklch(0.78_0.2_290)] transition-colors truncate">
          {streamer.nickname}
        </p>
      </div>
    </a>
  )
}

const OfflineStreamerItem = ({ streamer }: { streamer: Streamer }) => {
  const [profileError, setProfileError] = useState(false)

  return (
    <a
      href={streamer.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors group"
    >
      {!profileError && streamer.thumbnailUrl && streamer.thumbnailUrl !== DEFAULT_THUMBNAIL ? (
        <img
          src={streamer.thumbnailUrl}
          alt={streamer.nickname}
          className="w-6 h-6 rounded-full object-cover shrink-0 opacity-50"
          onError={() => setProfileError(true)}
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-[10px] font-bold shrink-0">
          {streamer.nickname.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors truncate">
        {streamer.nickname}
      </span>
      <span className="ml-auto text-[11px] text-zinc-700 shrink-0">오프라인</span>
    </a>
  )
}

export default ChzzkCard
