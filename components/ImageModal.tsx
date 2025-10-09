'use client'

import { useEffect } from 'react'

interface ImageModalProps {
  isOpen: boolean
  imageUrl: string
  onClose: () => void
}

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative max-w-[90vw] max-h-[90vh] p-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors"
          title="닫기 (ESC)"
        >
          ×
        </button>
        
        {/* 이미지 */}
        <div className="relative">
          <img
            src={imageUrl}
            alt="확대된 이미지"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* 하단 안내 */}
        <div className="mt-4 text-center text-white/70 text-sm">
          이미지를 클릭하거나 ESC 키를 눌러 닫을 수 있습니다
        </div>
      </div>
    </div>
  )
}
