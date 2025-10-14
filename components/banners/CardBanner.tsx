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

interface CardBannerProps {
  position?: string // 'home', 'guild', 'solare' 등
  className?: string
}

async function fetchCardBanners(position: string): Promise<BannerData[]> {
  const res = await fetch(`/api/admin/banners?type=card&position=${position}`)
  if (!res.ok) throw new Error('Failed to fetch card banners')
  return res.json()
}

export default function CardBanner({ position = 'home', className = '' }: CardBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  
  const { data: banners = [], isLoading, error } = useQuery<BannerData[]>({
    queryKey: ['card-banners', position],
    queryFn: () => fetchCardBanners(position),
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  })

  // 자동 슬라이드 (10초마다)
  useEffect(() => {
    const activeBanners = banners.filter(banner => banner.is_active)
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length)
      }, 10000)

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
      <div className={`w-full ${className}`}>
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-gray-600 rounded w-1/3"></div>
            <div className="h-3 bg-gray-600 rounded w-8"></div>
          </div>
          <div className="w-full h-32 bg-gray-600 rounded mb-3"></div>
          <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
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
    <div className={`w-full max-w-[400px] mx-auto ${className}`} style={{ maxWidth: 'min(400px, 100%)' }}>
      {/* 카드형 배너 (2:1 비율) */}
      <div 
        className="bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-300 cursor-pointer group overflow-hidden"
        onClick={() => handleBannerClick(currentBannerData)}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <span>🎯</span>
            <span>추천 광고</span>
          </h3>
          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
            AD
          </span>
        </div>

        {/* 배너 컨텐츠 */}
        <div className="relative">
          {/* 이미지 영역 */}
          <div className="relative w-full aspect-[2/1] overflow-hidden">
            {currentBannerData.image_url ? (
              <Image
                src={currentBannerData.image_url}
                alt={currentBannerData.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600" />
            )}
            
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* 텍스트 컨텐츠 */}
          <div className="p-4">
            <h4 className="text-white font-bold text-sm mb-2 line-clamp-2">
              {currentBannerData.title}
            </h4>
            
            {currentBannerData.description && (
              <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                {currentBannerData.description}
              </p>
            )}

            {/* 버튼 영역 */}
            <div className="flex items-center justify-between">
              {currentBannerData.button_text && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 text-xs rounded transition-all duration-200 transform hover:scale-105">
                  {currentBannerData.button_text}
                </button>
              )}
              
              {/* 인디케이터 (여러 배너가 있을 때만) */}
              {activeBanners.length > 1 && (
                <div className="flex space-x-1">
                  {activeBanners.map((_, index) => (
                    <button
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        index === safeCurrentBanner
                          ? 'bg-blue-500'
                          : 'bg-gray-500 hover:bg-gray-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentBanner(index)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
