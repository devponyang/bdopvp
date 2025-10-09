'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'favoriteGuilds'
const STORAGE_EVENT = 'favoriteGuildsChanged'

export function useFavoriteGuilds() {
  const [favoriteGuilds, setFavoriteGuilds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 로컬 스토리지에서 즐겨찾기 목록 불러오기
  const loadFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavoriteGuilds(parsed)
        }
      } else {
        setFavoriteGuilds([])
      }
    } catch (error) {
      console.error('즐겨찾기 데이터 로드 실패:', error)
      setFavoriteGuilds([])
    }
  }, [])

  useEffect(() => {
    loadFavorites()
    setIsLoaded(true)
    
    // 커스텀 이벤트 리스너 등록 (다른 컴포넌트에서 즐겨찾기 변경시 감지)
    const handleStorageChange = () => {
      loadFavorites()
    }
    
    window.addEventListener(STORAGE_EVENT, handleStorageChange)
    
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorageChange)
    }
  }, [loadFavorites])

  // 로컬 스토리지에 즐겨찾기 목록 저장
  const saveFavorites = useCallback((guilds: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guilds))
      setFavoriteGuilds(guilds)
      
      // 다른 컴포넌트에 변경 사항 알림
      window.dispatchEvent(new Event(STORAGE_EVENT))
    } catch (error) {
      console.error('즐겨찾기 데이터 저장 실패:', error)
    }
  }, [])

  // 길드 즐겨찾기 추가/제거 토글
  const toggleFavorite = useCallback((guildName: string) => {
    const newFavorites = favoriteGuilds.includes(guildName)
      ? favoriteGuilds.filter(name => name !== guildName)
      : [...favoriteGuilds, guildName]
    
    saveFavorites(newFavorites)
  }, [favoriteGuilds, saveFavorites])

  // 특정 길드가 즐겨찾기인지 확인
  const isFavorite = useCallback((guildName: string) => {
    return favoriteGuilds.includes(guildName)
  }, [favoriteGuilds])

  // 즐겨찾기 목록 초기화
  const clearFavorites = useCallback(() => {
    saveFavorites([])
  }, [saveFavorites])

  return {
    favoriteGuilds,
    isLoaded,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favoriteGuilds.length
  }
}
