'use client'

import { useEffect, useRef, useState } from 'react'
import { Expand, Minus, Plus, X } from 'lucide-react'

export default function GuideImage({
  src,
  alt,
  loading = 'lazy',
}: {
  src: string
  alt: string
  loading?: 'eager' | 'lazy'
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    if (!open) {
      dialog.current?.close()
      return
    }
    setZoom(1)
    dialog.current?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])
  return (
    <>
      <button
        className="guide-image-button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} 확대`}
      >
        <img src={encodeURI(src)} alt={alt} loading={loading} decoding="async" />
        <span>
          <Expand size={14} /> 이미지 확대
        </span>
      </button>
      <dialog
        ref={dialog}
        className="guide-image-dialog"
        aria-label={`${alt} 확대 보기`}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className="guide-image-controls">
          <strong>{alt}</strong>
          <button
            className="icon-button"
            aria-label="축소"
            disabled={zoom <= 1}
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
          >
            <Minus size={18} />
          </button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button
            className="icon-button"
            aria-label="확대"
            disabled={zoom >= 3}
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          >
            <Plus size={18} />
          </button>
          <button className="icon-button" aria-label="이미지 닫기" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="guide-image-viewport">
          {open && (
            <img
              src={encodeURI(src)}
              alt={alt}
              style={{ width: `${zoom * 100}%`, maxWidth: 'none' }}
            />
          )}
        </div>
      </dialog>
    </>
  )
}
