'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

interface BannerData {
  id: number
  title: string
  description: string
  image_url: string
  link_url: string
  button_text: string
  is_active: boolean
  priority: number
}

async function fetchBanners(): Promise<BannerData[]> {
  const res = await fetch('/api/admin/banners')
  if (!res.ok) {
    throw new Error('Failed to fetch banners')
  }
  return res.json()
}

export default function MainBanner() {
  const [currentBanner, setCurrentBanner] = useState(0)
  
  const { data: banners = [], isLoading, error } = useQuery<BannerData[]>({
    queryKey: ['banners'],
    queryFn: fetchBanners,
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  })

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const activeBanners = banners.filter(banner => banner.is_active)
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [banners])

  // 배너 클릭 핸들러
  const handleBannerClick = (banner: BannerData) => {
    if (banner.link_url) {
      window.open(banner.link_url, '_self')
    }
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="relative w-full h-32 md:h-40 lg:h-48 mb-4 md:mb-6">
        <div className="w-full h-full rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-white text-lg">배너 로딩 중...</div>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
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

  // currentBannerData가 없는 경우 처리
  if (!currentBannerData) {
    return null
  }

  return (
    <div className="relative w-full h-32 md:h-40 lg:h-48 mb-4 md:mb-6">
      {/* 메인 배너 */}
      <div 
        className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => handleBannerClick(currentBannerData)}
      >
        {/* 배경 그라데이션 - 라이트모드와 다크모드 모두 고려 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90 dark:from-blue-900/80 dark:via-purple-900/80 dark:to-indigo-900/80 z-10" />
        
        {/* 배경 이미지 */}
        {currentBannerData.image_url && (
          <Image
            src={currentBannerData.image_url}
            alt={currentBannerData.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={currentBanner === 0}
          />
        )}
        
        {/* 컨텐츠 */}
        <div className="relative z-20 h-full flex items-center px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl ml-4 md:ml-6 lg:ml-8">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
              {currentBannerData.title}
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-100 dark:text-gray-200 mb-2 md:mb-3 max-w-lg drop-shadow-md">
              {currentBannerData.description}
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              {currentBannerData.button_text} →
            </button>
          </div>
        </div>

        {/* 오버레이 효과 */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* 배너 인디케이터 (여러 배너가 있을 때만) */}
      {activeBanners.length > 1 && (
        <>
          {/* 점 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === safeCurrentBanner 
                    ? 'bg-yellow-400 w-6' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* 화살표 네비게이션 */}
          <button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-30"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % activeBanners.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-30"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}