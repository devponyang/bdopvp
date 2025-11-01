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
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
          title="닫기 (ESC)"
        >
          ×
        </button>

        <div className="w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt="대진표 이미지"
            className="w-full h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="mt-6 text-center text-white/70 text-sm">
          화면을 클릭하거나 ESC 키를 눌러 닫을 수 있습니다
        </div>
      </div>
    </div>
  )
}
