'use client'

import { useState } from 'react'
import { convertToEmbedUrl, getYouTubeVideoInfo, isValidYouTubeUrl } from '@/lib/utils/youtube'

interface YouTubeEmbedProps {
  url: string
  title?: string
  width?: string | number
  height?: string | number
  autoplay?: boolean
  controls?: boolean
  rel?: boolean
  modestbranding?: boolean
}

export default function YouTubeEmbed({
  url,
  title = '유튜브 동영상',
  width = '100%',
  height = 315,
  autoplay = false,
  controls = true,
  rel = false,
  modestbranding = true
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // 유튜브 URL 유효성 검사
  if (!isValidYouTubeUrl(url)) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 my-4">
        <p className="text-red-400 text-sm">
          ❌ 유효하지 않은 유튜브 URL입니다: {url}
        </p>
      </div>
    )
  }

  const embedUrl = convertToEmbedUrl(url)
  if (!embedUrl) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 my-4">
        <p className="text-red-400 text-sm">
          ❌ 유튜브 URL을 임베드 URL로 변환할 수 없습니다.
        </p>
      </div>
    )
  }

  const videoInfo = getYouTubeVideoInfo(url)
  
  // URL 파라미터 구성
  const params = new URLSearchParams()
  if (autoplay) params.append('autoplay', '1')
  if (!controls) params.append('controls', '0')
  if (!rel) params.append('rel', '0')
  if (modestbranding) params.append('modestbranding', '1')
  
  const finalEmbedUrl = `${embedUrl}?${params.toString()}`

  return (
    <div className="my-6">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg border border-zinc-700">
        {/* 로딩 상태 */}
        {!isLoaded && !hasError && (
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">동영상 로딩 중...</p>
              </div>
            </div>
            {videoInfo?.thumbnail && (
              <img
                src={videoInfo.thumbnail}
                alt={title}
                className="w-full h-full object-cover opacity-50"
              />
            )}
          </div>
        )}

        {/* 에러 상태 */}
        {hasError && (
          <div className="w-full" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 text-sm mb-2">❌ 동영상을 불러올 수 없습니다</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  유튜브에서 직접 보기
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 유튜브 임베드 */}
        <iframe
          src={finalEmbedUrl}
          title={title}
          width={width}
          height={height}
          className={`w-full rounded-lg transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ aspectRatio: '16/9' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />

        {/* 제목 (선택사항) */}
        {title && (
          <div className="p-3 bg-zinc-800/50 border-t border-zinc-700">
            <p className="text-white text-sm font-medium truncate">
              🎬 {title}
            </p>
          </div>
        )}

        {/* 원본 링크 */}
        <div className="p-2 bg-zinc-900/50 border-t border-zinc-700">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs underline"
          >
            🔗 유튜브에서 원본 보기
          </a>
        </div>
      </div>
    </div>
  )
}
