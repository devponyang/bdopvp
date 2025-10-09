'use client'

import { useState, useEffect, useRef } from 'react'
import ImageModal from './ImageModal'

interface ClickableContentProps {
  content: string
  className?: string
}

export default function ClickableContent({ content, className = '' }: ClickableContentProps) {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // 이미지 스타일 적용
  useEffect(() => {
    if (contentRef.current) {
      const images = contentRef.current.querySelectorAll('img')
      
      images.forEach((img) => {
        img.style.cursor = 'pointer'
        img.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
        img.title = '클릭하면 크게 볼 수 있습니다'
      })
    }
  }, [content])

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage('')
  }

  return (
    <>
      <div 
        ref={contentRef}
        className={`${className} clickable-content`}
        dangerouslySetInnerHTML={{ __html: content }}
        onPointerDown={(e) => {
          const target = e.target as HTMLElement
          if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement
            setSelectedImage(img.src)
            setIsModalOpen(true)
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement
            setSelectedImage(img.src)
            setIsModalOpen(true)
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      />
      
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={closeModal}
      />

      <style jsx>{`
        .clickable-content img {
          cursor: pointer !important;
          transition: opacity 0.2s ease, transform 0.2s ease !important;
          border-radius: 8px !important;
          pointer-events: auto !important;
          user-select: none !important;
        }
        .clickable-content img:hover {
          opacity: 0.8 !important;
          transform: scale(1.02) !important;
        }
        .clickable-content img:active {
          transform: scale(0.98) !important;
        }
      `}</style>
    </>
  )
}
