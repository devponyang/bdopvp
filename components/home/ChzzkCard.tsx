'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

interface Streamer {
  nickname: string
  title: string
  isLive: boolean
  viewerCount: number
  thumbnailUrl: string  // 프로필 이미지
  broadcastThumbnail: string  // 방송 화면 썸네일
  url: string
}

const DEFAULT_THUMBNAIL = 'https://ssl.pstatic.net/static/nng/glive/icon/favicon.png'

const ChzzkCard = () => {
  const { data: streamers = [], isLoading, error } = useQuery<Streamer[]>({
    queryKey: ['streamers'],
    queryFn: async () => {
      const res = await fetch('/api/chzzk')
      if (!res.ok) throw new Error('Failed to fetch streamers')
      const data = await res.json()
      // 특정 스트리머 필터링 (숨기고 싶은 스트리머들)
      const hiddenStreamers = ['아이온2']
      const filteredData = data.filter((streamer: Streamer) => 
        !hiddenStreamers.includes(streamer.nickname)
      )
      
      return filteredData.sort((a: Streamer, b: Streamer) => {
        if (!a.isLive && b.isLive) return 1
        if (a.isLive && !b.isLive) return -1
        return (b.viewerCount || 0) - (a.viewerCount || 0)
      })
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 5 * 60 * 1000, // 5분
  })

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
        <div className="animate-pulse">
          <div className="bg-white/10 rounded h-6 w-3/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-lg h-16"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
        <div className="text-red-300 text-center py-4">
          스트리머 정보를 불러오는데 실패했습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
        <Image 
          src="/tip-images/chzzk.png" 
          alt="치지직" 
          width={24} 
          height={24}
          className="object-contain"
        />
        검은사막 LIVE in Chzzk
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          {streamers.filter((_, i) => i % 2 === 0).map((streamer) => (
            <StreamerItem key={streamer.url} streamer={streamer} />
          ))}
        </div>
        <div className="space-y-1">
          {streamers.filter((_, i) => i % 2 === 1).map((streamer) => (
            <StreamerItem key={streamer.url} streamer={streamer} />
          ))}
        </div>
      </div>
    </div>
  )
}

const StreamerItem = ({ streamer }: { streamer: Streamer }) => {
  const [imageError, setImageError] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)

  return (
    <a
      href={streamer.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white/5 hover:bg-white/10 rounded-lg p-2 border border-white/10 hover:border-purple-500/50 transition-all"
    >
      <div className="flex flex-col gap-1">
        {streamer.isLive && (
          <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-700/50">
            {!imageError && streamer.broadcastThumbnail && 
             streamer.broadcastThumbnail !== DEFAULT_THUMBNAIL && 
             streamer.broadcastThumbnail.startsWith('http') && 
             streamer.broadcastThumbnail.includes('.') ? (
              <img
                src={streamer.broadcastThumbnail}
                alt={`${streamer.nickname}의 방송`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
            )}
            <div className="absolute top-1 left-1">
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium shadow-lg">
                LIVE
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="relative flex-shrink-0">
            {!profileImageError && streamer.thumbnailUrl && streamer.thumbnailUrl !== DEFAULT_THUMBNAIL ? (
              <img
                src={streamer.thumbnailUrl}
                alt={streamer.nickname}
                className="w-7 h-7 rounded-full object-cover"
                onError={() => setProfileImageError(true)}
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {streamer.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <p className="text-[11px] font-medium text-gray-200 group-hover:text-purple-300 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
            {streamer.nickname}
          </p>
        </div>
      </div>
    </a>
  )
}

export default ChzzkCard 