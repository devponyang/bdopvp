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
      <button className={`opacity-50 cursor-not-allowed ${className}`} disabled>
        <span className="text-gray-500">⭐</span>
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
      className={`transition-all duration-200 hover:scale-105 flex items-center gap-1 px-2 py-1 rounded ${
        favorite 
          ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30' 
          : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 hover:text-yellow-300'
      } ${className}`}
      title={favorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
    >
      <span>
        {favorite ? '⭐' : '☆'}
      </span>
      <span className="text-sm font-medium">
        즐겨찾기
      </span>
    </button>
  )
}
