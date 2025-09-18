'use client'

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

export default function WarCorrespondents() {
  const { data: correspondents = [], isLoading, error } = useQuery<WarCorrespondent[]>({
    queryKey: ['war-correspondents'],
    queryFn: async () => {
      const res = await fetch('/api/war-correspondents/live')
      if (!res.ok) throw new Error('Failed to fetch war correspondents')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    // refetchInterval 제거 - 자동 새로고침 비활성화
  })

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
        <h3 className="text-lg font-bold dark:text-purple-300 mb-3 flex items-center gap-2">
          📺 종군기자 (옵저버)
        </h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || correspondents.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
        <h3 className="text-lg font-bold dark:text-purple-300 mb-3 flex items-center gap-2">
          📺 종군기자 (옵저버)
        </h3>
        <div className="text-gray-400 text-sm text-center py-4">
          현재 활동 중인 종군기자가 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
      <h3 className="text-lg font-bold dark:text-purple-300 mb-3 flex items-center gap-2">
        📺 종군기자
      </h3>
      
      <div className="space-y-3">
        {correspondents.map((correspondent) => (
          <div key={correspondent.id} className="bg-zinc-800 rounded-lg p-3 border border-zinc-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {correspondent.profile_image_url && (
                  <img
                    src={correspondent.profile_image_url}
                    alt={`${correspondent.streamer_name} 프로필`}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                )}
                <div>
                  <span className="font-semibold text-white text-sm">
                    {correspondent.streamer_name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {correspondent.isLive ? (
                      <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium animate-pulse">
                        ON AIR
                      </span>
                    ) : (
                      <span className="bg-gray-800 !text-white text-[10px] px-1.5 py-0.5 rounded">
                        OFFLINE
                      </span>
                    )}
                    {correspondent.description && (
                      <span className="text-gray-400 text-xs">
                        {correspondent.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <a
                href={correspondent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 text-sm rounded font-medium transition-colors"
              >
                시청하기
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-400 text-center">
        중계 진행중이 아님에도 방송중이면 Onair로 표시됩니다
      </div>
    </div>
  )
}
