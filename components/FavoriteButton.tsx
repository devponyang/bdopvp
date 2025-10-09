'use client'

import { useFavoriteGuilds } from '@/hooks/useFavoriteGuilds'

interface FavoriteButtonProps {
  guildName: string
  className?: string
}

export default function FavoriteButton({ guildName, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavoriteGuilds()

  if (!isLoaded) {
    return (
      <button 
        className={`opacity-50 cursor-not-allowed flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 bg-slate-700/40 text-gray-400 border-slate-600/40 ${className}`} 
        disabled
      >
        <span className="text-lg">☆</span>
        <span className="text-sm font-semibold">즐겨찾기</span>
      </button>
    )
  }

  const favorite = isFavorite(guildName)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation() // 부모 클릭 이벤트 방지
        toggleFavorite(guildName)
      }}
      className={`transition-all duration-200 hover:scale-105 flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 ${
        favorite 
          ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/40 hover:border-yellow-400/60' 
          : 'bg-slate-700/60 text-gray-300 border-slate-600/60 hover:bg-slate-600/70 hover:border-yellow-500/40 hover:text-yellow-300'
      } ${className}`}
      title={favorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
    >
      <span className="text-lg">
        {favorite ? '⭐' : '☆'}
      </span>
      <span className="text-sm font-semibold">
        즐겨찾기
      </span>
    </button>
  )
}
