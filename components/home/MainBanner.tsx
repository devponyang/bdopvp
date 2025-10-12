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
  const [isPaused, setIsPaused] = useState(false)
  
  const { data: banners = [], isLoading, error } = useQuery<BannerData[]>({
    queryKey: ['banners'],
    queryFn: fetchBanners,
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  })

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const activeBanners = banners.filter(banner => banner.is_active)
    if (activeBanners.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [banners, isPaused])

  // 배너 클릭 핸들러
  const handleBannerClick = (banner: BannerData) => {
    if (banner.link_url) {
      window.open(banner.link_url, '_blank')
    }
  }

  // 네비게이션 핸들러
  const goToPrevious = () => {
    const activeBanners = banners.filter(banner => banner.is_active)
    setCurrentBanner((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
  }

  const goToNext = () => {
    const activeBanners = banners.filter(banner => banner.is_active)
    setCurrentBanner((prev) => (prev + 1) % activeBanners.length)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="relative w-full h-20 md:h-48 lg:h-56 mb-2 md:mb-4">
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
    <div className="relative w-full h-20 md:h-48 lg:h-56 mb-2 md:mb-4">
      {/* 메인 배너 */}
      <div 
        className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => handleBannerClick(currentBannerData)}
      >
        
        {/* 배경 이미지 */}
        {currentBannerData.image_url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={currentBannerData.image_url}
              alt={currentBannerData.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-contain md:object-cover scale-110 md:scale-100"
              priority={currentBanner === 0}
            />
          </div>
        )}
        
        {/* 컨텐츠 - 제목이나 설명이 있을 때만 표시 */}
        {(currentBannerData.title.trim() !== '' || currentBannerData.description.trim() !== '') && (
          <div className="relative z-20 h-full flex items-center px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl ml-4 md:ml-6 lg:ml-8">
              {currentBannerData.title.trim() !== '' && (
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
                  {currentBannerData.title}
                </h1>
              )}
              {currentBannerData.description.trim() !== '' && (
                <p className="text-xs md:text-sm lg:text-base text-gray-100 dark:text-gray-200 mb-2 md:mb-3 max-w-lg drop-shadow-md">
                  {currentBannerData.description}
                </p>
              )}
              {currentBannerData.button_text.trim() !== '' && (
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                  {currentBannerData.button_text} →
                </button>
              )}
            </div>
          </div>
        )}

        {/* 오버레이 효과 */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 배너 컨트롤 (여러 배너가 있을 때만, 모바일에서는 숨김) */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 right-4 z-30 hidden md:block">
          {/* 슬라이더 컨트롤 */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-3 shadow-lg border border-white/10">
            {/* 이전 버튼 */}
            <button
              onClick={goToPrevious}
              className="text-white hover:text-purple-200 transition-colors text-lg font-bold"
            >
              &lt;
            </button>
            
            {/* 페이지 번호 */}
            <div className="text-white text-sm font-medium">
              {safeCurrentBanner + 1}/{activeBanners.length}
            </div>
            
            {/* 일시정지/재생 버튼 */}
            <button
              onClick={togglePause}
              className="text-white hover:text-purple-200 transition-colors text-sm font-bold"
            >
              {isPaused ? '▶' : '||'}
            </button>
            
            {/* 다음 버튼 */}
            <button
              onClick={goToNext}
              className="text-white hover:text-purple-200 transition-colors text-lg font-bold"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}