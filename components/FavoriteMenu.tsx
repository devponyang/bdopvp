'use client'

import Link from 'next/link'
import { useFavoriteGuilds } from '@/hooks/useFavoriteGuilds'

export default function FavoriteMenu() {
  const { favoriteGuilds, isLoaded } = useFavoriteGuilds()

  // 즐겨찾기가 없거나 로딩 중이면 렌더링하지 않음
  if (!isLoaded || favoriteGuilds.length === 0) {
    return null
  }

  return (
    <div className="border-t border-zinc-600/50 border-b border-zinc-600/50">
      {/* 데스크톱 버전 */}
      <div className="hidden md:block">
        <div className="max-w-[1490px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            {favoriteGuilds.map((guildName) => (
              <Link
                key={guildName}
                href={`/guild/${encodeURIComponent(guildName)}`}
                className="px-3 py-1.5 bg-yellow-600/30 hover:bg-yellow-600/50 border border-yellow-500/40 rounded-lg text-sm text-white hover:text-yellow-200 transition-all duration-200 flex items-center gap-1"
              >
                <span className="text-yellow-400">⭐</span>
                <span>{guildName}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="md:hidden">
        <div className="px-4 py-3">
          <div className="flex flex-wrap justify-center gap-2">
            {favoriteGuilds.map((guildName) => (
              <Link
                key={guildName}
                href={`/guild/${encodeURIComponent(guildName)}`}
                className="px-2 py-1 bg-yellow-600/30 hover:bg-yellow-600/50 border border-yellow-500/40 rounded text-xs text-white hover:text-yellow-200 transition-all duration-200 flex items-center gap-1"
              >
                <span className="text-yellow-400">⭐</span>
                <span>{guildName}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
