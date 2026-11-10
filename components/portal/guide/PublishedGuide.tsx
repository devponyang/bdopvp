import type { ReactNode } from 'react'
import GuideArticle from './GuideArticle'
import { guideAuthors } from '@/lib/portal/guide-authors'
import type { GuideHeading } from './GuideNavigation'

export type GuideContent = {
  sections: { id: string; title: string; content: ReactNode }[]
  headings: GuideHeading[]
  cover?: { src: string; alt: string }
}

export default function PublishedGuide({
  id,
  title,
  content,
}: {
  id: string
  title: string
  content: GuideContent
}) {
  const author = guideAuthors[id]
  const shortcuts = content.sections
    .filter((s) => /콤보|연계|특화|운영|운용/.test(s.title))
    .slice(0, 4)
  return (
    <GuideArticle
      title={title}
      topId="guide-top"
      eyebrow="CLASS PLAYBOOK"
      subtitle={`${author.name}님의 경험으로 읽는 ${title} PvP 공략`}
      author={
        <>
          <span className="author-avatar">{author.name.slice(0, 1)}</span>
          <span>
            <strong>{author.name}</strong>
            <span className="reader-author-affiliation">{author.affiliation} · 원문 작성 당시</span>
          </span>
        </>
      }
      cover={
        content.cover
          ? {
              ...content.cover,
              caption: `${author.name}님 원문 첨부 이미지 · 클릭하면 원본 비율로 확대됩니다.`,
            }
          : undefined
      }
      sections={content.sections}
      headings={content.headings}
    >
      <section className="reader-brief" aria-labelledby="guide-start-title">
        <span className="eyebrow">QUICK ACCESS</span>
        <h2 id="guide-start-title">필요한 공략부터 찾아보세요</h2>
        <p className="brief-note">{author.bio} · 작성 당시 소개 기준</p>
        <div className="guide-shortcuts">
          {shortcuts.map((s, i) => (
            <a key={s.id} href={`#${s.id}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{s.title}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <p className="brief-note section-gap">
          본문 {content.sections.length}개 구역 · 목차에서 스킬명과 키워드로 바로 찾을 수 있습니다.
        </p>
      </section>
    </GuideArticle>
  )
}
