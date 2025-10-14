'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

interface BannerData {
  id: number
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
  button_text: string | null
  is_active: boolean
  priority: number
  banner_type: string
  position: string
}

interface SidebarBannerProps {
  position?: string // 'home', 'guild', 'solare' 등
  className?: string
}

async function fetchSidebarBanners(position: string): Promise<BannerData[]> {
  const res = await fetch(`/api/admin/banners?type=sidebar&position=${position}`)
  if (!res.ok) throw new Error('Failed to fetch sidebar banners')
  return res.json()
}

export default function SidebarBanner({ position = 'home', className = '' }: SidebarBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  
  const { data: banners = [], isLoading, error } = useQuery<BannerData[]>({
    queryKey: ['sidebar-banners', position],
    queryFn: () => fetchSidebarBanners(position),
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  })

  // 자동 슬라이드 (8초마다)
  useEffect(() => {
    const activeBanners = banners.filter(banner => banner.is_active)
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [banners])

  // 배너 클릭 핸들러
  const handleBannerClick = (banner: BannerData) => {
    if (banner.link_url) {
      window.open(banner.link_url, '_blank')
    }
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`w-full h-[250px] ${className}`}>
        <div className="w-full h-full rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-white text-sm">광고 로딩 중...</div>
        </div>
      </div>
    )
  }

  // 에러 상태 또는 배너가 없는 경우
  if (error || !banners.length) {
    return null
  }

  // 활성 배너만 필터링
  const activeBanners = banners.filter(banner => banner.is_active)

  if (activeBanners.length === 0) {
    return null
  }

  // currentBanner 인덱스가 범위를 벗어나지 않도록 조정
  const safeCurrentBanner = Math.min(currentBanner, activeBanners.length - 1)
  const currentBannerData = activeBanners[safeCurrentBanner]

  if (!currentBannerData) {
    return null
  }

  return (
    <div className={`w-full max-w-[300px] mx-auto ${className}`} style={{ maxWidth: 'min(300px, 100%)' }}>
      {/* 사이드바 배너 (300x250 기본 사이즈) */}
      <div 
        className="relative w-full aspect-[6/5] rounded-lg overflow-hidden cursor-pointer group border border-zinc-700 hover:border-zinc-600 transition-all duration-300"
        onClick={() => handleBannerClick(currentBannerData)}
      >
        {/* 배경 이미지 */}
        {currentBannerData.image_url ? (
          <Image
            src={currentBannerData.image_url}
            alt={currentBannerData.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="300px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600" />
        )}
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* 컨텐츠 */}
        <div className="relative z-10 h-full flex flex-col justify-end p-4">
          <div>
            <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg line-clamp-2">
              {currentBannerData.title}
            </h3>
            {currentBannerData.description && (
              <p className="text-gray-200 text-xs mb-2 drop-shadow-md line-clamp-2">
                {currentBannerData.description}
              </p>
            )}
            {currentBannerData.button_text && (
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-1 text-xs rounded transition-all duration-200 transform hover:scale-105 shadow-lg">
                {currentBannerData.button_text}
              </button>
            )}
          </div>
        </div>

        {/* 광고 표시 */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          AD
        </div>
      </div>

      {/* 배너 인디케이터 (여러 배너가 있을 때만) */}
      {activeBanners.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === safeCurrentBanner
                  ? 'bg-blue-500'
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
