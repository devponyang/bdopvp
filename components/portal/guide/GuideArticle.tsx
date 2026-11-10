import GuideImage from './GuideImage'
import Link from 'next/link'
import type { ReactNode } from 'react'
import GuideNavigation, { type GuideHeading } from './GuideNavigation'

export default function GuideArticle({
  title,
  author,
  cover,
  sections,
  headings,
  children,
  topId = 'ranger-top',
  eyebrow = 'RANGER / SUCCESSION',
  subtitle = '거리와 지형을 읽고, 다음 화살을 준비하다.',
}: {
  title: string
  author: ReactNode
  cover?: { src: string; alt: string; caption: string }
  sections: { id: string; title: string; content: ReactNode }[]
  headings: GuideHeading[]
  children?: ReactNode
  topId?: string
  eyebrow?: string
  subtitle?: string
}) {
  return (
    <article className="guide-reader" id={topId}>
      <header className={`reader-hero ${cover ? '' : 'reader-hero--text-only'}`}>
        <div>
          <Link className="back-link" href="/tip-board">
            ← 클래스 공략
          </Link>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="reader-author">{author}</div>
          <div className="reader-meta">
            <span>작성 시점: 미확인</span>
            <span>패치 검증: 미확인</span>
            <span>원문 보관본</span>
          </div>
        </div>
        {cover && (
          <figure className="reader-portrait">
            <GuideImage src={cover.src} alt={cover.alt} loading="eager" />
            <figcaption>{cover.caption}</figcaption>
          </figure>
        )}
      </header>
      <div className="reader-disclaimer">
        이 글에는 작성자의 경험과 개인적인 의견이 담겨 있습니다. 현재 패치와 다를 수 있으니
        참고용으로 활용해 주세요. 화면 개편은 공략 내용의 최신성을 의미하지 않습니다.
      </div>
      <div className="reader-layout">
        <GuideNavigation
          topId={topId}
          sections={sections.map(({ id, title }) => ({ id, title }))}
          headings={[...sections.map(({ id, title }) => ({ id, title })), ...headings]}
        />
        <div className="reader-body">
          {children}
          {sections.map((s, i) => (
            <section
              className="reader-section"
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
            >
              <div className="reader-section-title">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h2 id={`${s.id}-title`}>{s.title}</h2>
                <a href={`#${s.id}`} aria-label={`${s.title} 바로가기 링크`}>
                  #
                </a>
              </div>
              <div className="reader-prose">{s.content}</div>
            </section>
          ))}
          <footer className="reader-end">
            <strong>읽고, 연습하고, 나만의 플레이로.</strong>
            <p>
              원문 내용은 보존했습니다. 공략의 실제 수정 이력과 패치 검증 정보는 확인되는 대로
              추가할 예정입니다.
            </p>
            <Link className="button secondary" href="/tip-board">
              다른 클래스 공략 보기
            </Link>
          </footer>
        </div>
      </div>
    </article>
  )
}
