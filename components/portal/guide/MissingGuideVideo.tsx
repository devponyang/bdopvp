import type { ReactNode } from 'react'

// Keep the original source reference for recovery, without showing a broken player.
export default function MissingGuideVideo({ src, children }: { src: string; children: ReactNode }) {
  return (
    <div className="article-callout" data-missing-video={src} role="note">
      <strong>첨부 영상 복구 대기</strong>
      <p>원본 영상 파일이 없어 현재 재생할 수 없습니다. 공략 본문은 계속 읽을 수 있습니다.</p>
      <span hidden>{children}</span>
    </div>
  )
}
