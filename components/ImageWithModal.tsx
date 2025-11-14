"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const FullScreenImageModal = dynamic(() => import("@/components/FullScreenImageModal"), {
  ssr: false
})

interface ImageWithModalProps {
  src: string
  alt: string
  wrapperClassName?: string
  imageClassName?: string
}

export default function ImageWithModal({
  src,
  alt,
  wrapperClassName,
  imageClassName
}: ImageWithModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
          wrapperClassName ?? ""
        }`}
      >
        <img
          src={src}
          alt={alt}
          className={`pointer-events-none ${imageClassName ?? ""}`}
        />
      </button>
      {isOpen && (
        <FullScreenImageModal isOpen={isOpen} imageUrl={src} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}

