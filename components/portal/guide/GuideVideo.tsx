'use client'
import { useState } from 'react'
import { Play, ArrowUpRight } from 'lucide-react'

export default function GuideVideo({ src, title }: { src: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="guide-video">
      {playing ? (
        <iframe
          src={src}
          title={title}
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button className="video-launch" onClick={() => setPlaying(true)}>
          <Play size={28} />
          <strong>{title}</strong>
          <span>클릭해서 YouTube 영상 불러오기</span>
        </button>
      )}
      <a href={src} target="_blank" rel="noreferrer">
        YouTube에서 보기 <ArrowUpRight size={14} />
      </a>
    </div>
  )
}
