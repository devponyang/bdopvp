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
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-600/30">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">📺</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">종군기자</h3>
            <p className="text-xs text-gray-400">실시간 중계 스트리머</p>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700/50 rounded-lg w-3/4"></div>
          <div className="h-4 bg-slate-700/50 rounded-lg w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || correspondents.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-600/30">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">📺</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">종군기자</h3>
            <p className="text-xs text-gray-400">실시간 중계 스트리머</p>
          </div>
        </div>
        <div className="text-gray-400 text-sm text-center py-6 bg-slate-700/30 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-3 bg-slate-600/50 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-xl">📺</span>
          </div>
          현재 활동 중인 종군기자가 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-600/30">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg font-bold">📺</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">종군기자</h3>
          <p className="text-xs text-gray-400">실시간 중계 스트리머</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {correspondents.map((correspondent) => (
          <div key={correspondent.id} className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {correspondent.profile_image_url && (
                  <div className="relative">
                    <img
                      src={correspondent.profile_image_url}
                      alt={`${correspondent.streamer_name} 프로필`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-500 group-hover:border-purple-400 transition-colors"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    {correspondent.isLive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white"></div>
                    )}
                  </div>
                )}
                <div>
                  <span className="font-semibold text-white text-sm block">
                    {correspondent.streamer_name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {correspondent.isLive ? (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] px-2 py-1 rounded-full font-medium animate-pulse shadow-lg">
                        🔴 LIVE
                      </span>
                    ) : (
                      <span className="bg-slate-600 text-gray-300 text-[10px] px-2 py-1 rounded-full">
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
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                시청하기
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center bg-slate-700/30 rounded-lg p-3">
        <span className="text-purple-300">💡</span> 중계 진행중이 아님에도 방송중이면 LIVE로 표시됩니다
      </div>
    </div>
  )
}
