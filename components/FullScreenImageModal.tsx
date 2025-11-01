'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface FullScreenImageModalProps {
  isOpen: boolean
  imageUrl: string
  onClose: () => void
}

const DEFAULT_SCALE = 0.45
const MIN_SCALE = 0.3
const MAX_SCALE = 3

export default function FullScreenImageModal({ isOpen, imageUrl, onClose }: FullScreenImageModalProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [scale, setScale] = useState(1)
  const [baseScale, setBaseScale] = useState(1)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setScale(1)
      setBaseScale(1)
      setImageSize({ width: 0, height: 0 })
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen || !imageUrl) return

    const computeInitialScale = () => {
      const img = imageRef.current
      if (!img) return

      const naturalWidth = img.naturalWidth || img.width
      const naturalHeight = img.naturalHeight || img.height
      if (!naturalWidth || !naturalHeight) return

      const horizontalPadding = 96
      const verticalPadding = 128
      const availableWidth = window.innerWidth - horizontalPadding
      const availableHeight = window.innerHeight - verticalPadding

      const widthScale = availableWidth / naturalWidth
      const heightScale = availableHeight / naturalHeight
      const fitScale = Math.min(widthScale, heightScale)
      const targetScale = Math.max(MIN_SCALE, Math.min(DEFAULT_SCALE, fitScale))

      setScale(targetScale)
      setBaseScale(targetScale)
      setImageSize({ width: naturalWidth, height: naturalHeight })
    }

    const img = imageRef.current
    if (img) {
      if (img.complete) {
        computeInitialScale()
      } else {
        img.addEventListener('load', computeInitialScale, { once: true })
      }
    }

    window.addEventListener('resize', computeInitialScale)

    return () => {
      if (img) {
        img.removeEventListener('load', computeInitialScale)
      }
      window.removeEventListener('resize', computeInitialScale)
    }
  }, [isOpen, imageUrl])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const delta = event.deltaY * -0.001
      setScale((prev) => {
        const next = prev + delta
        return Math.min(Math.max(next, MIN_SCALE), MAX_SCALE)
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('wheel', handleWheel, { passive: false })

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('wheel', handleWheel)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) {
    return null
  }

  const handleClose = () => {
    setScale(1)
    onClose()
  }

  const adjustScale = (delta: number) => {
    setScale((prev) => {
      const next = prev + delta
      return Math.min(Math.max(next, MIN_SCALE), MAX_SCALE)
    })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
      onClick={handleClose}
    >
      <button
        type="button"
        onClick={handleClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10001] w-10 h-10 sm:w-12 sm:h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-medium transition-all duration-200 border border-gray-500 hover:border-gray-400 shadow-lg"
        title="닫기 (ESC)"
      >
        ×
      </button>

      <div className="fixed top-4 left-4 z-[10001] bg-black/70 text-white px-4 py-2 rounded-lg text-sm border border-gray-500 shadow hidden sm:block">
        <div>🖱️ 마우스 휠: 확대/축소 ({Math.round(scale * 100)}%)</div>
        <div>🔍 현재 배율: {scale.toFixed(2)}x</div>
        <div>📐 기준 배율: {baseScale.toFixed(2)}x</div>
      </div>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10001] bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs border border-gray-600 shadow sm:hidden">
        배율 {Math.round(scale * 100)}%
      </div>

      <div
        className="relative flex w-full h-full items-center justify-center p-4 sm:p-8 overflow-auto"
        onClick={(event) => event.stopPropagation()}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <img
          src={imageUrl}
          alt="대진표 이미지"
          ref={imageRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.12s ease-out',
            maxWidth: 'none',
            maxHeight: 'none',
            width: imageSize.width ? `${imageSize.width}px` : 'auto',
            height: imageSize.height ? `${imageSize.height}px` : 'auto'
          }}
          className="max-w-none h-auto rounded-2xl shadow-2xl border border-gray-700 select-none"
          draggable={false}
        />
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10001] bg-black/70 text-white/70 px-5 py-3 rounded-lg text-xs sm:text-sm border border-gray-500 shadow flex flex-col sm:flex-row sm:items-center sm:gap-2 text-center sm:text-left">
        <span className="hidden sm:inline">화면을 클릭하거나 ESC 키를 눌러 닫을 수 있습니다</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">마우스 휠 또는 우측 하단 버튼으로 확대/축소</span>
        <span className="sm:hidden">화면을 탭해 닫고, 우측 하단 버튼으로 확대/축소할 수 있습니다</span>
      </div>

      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10002] flex items-center gap-3 bg-black/60 border border-gray-600 rounded-full px-3 py-2 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => adjustScale(-0.1)}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-lg font-semibold transition-colors"
          aria-label="축소"
        >
          −
        </button>
        <div className="text-white text-xs sm:text-sm font-semibold tabular-nums min-w-[48px] text-center">
          {Math.round(scale * 100)}%
        </div>
        <button
          type="button"
          onClick={() => adjustScale(0.1)}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-lg font-semibold transition-colors"
          aria-label="확대"
        >
          ＋
        </button>
      </div>
    </div>,
    document.body
  )
}

