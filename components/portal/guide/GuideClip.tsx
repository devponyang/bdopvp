import { ArrowUpRight, Play } from 'lucide-react'

export default function GuideClip({
  href,
  thumbnail,
  title,
}: {
  href: string
  thumbnail: string
  title: string
}) {
  return (
    <a
      className="guide-clip"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} — YouTube에서 새 탭으로 열기`}
    >
      <span className="guide-clip-thumbnail">
        <img src={thumbnail} alt="" loading="lazy" decoding="async" />
        <span className="guide-clip-play">
          <Play size={14} fill="currentColor" />
        </span>
      </span>
      <span className="guide-clip-label">
        <small>YouTube 클립</small>
        <strong>{title}</strong>
        <span>
          새 탭에서 보기 <ArrowUpRight size={12} />
        </span>
      </span>
    </a>
  )
}
