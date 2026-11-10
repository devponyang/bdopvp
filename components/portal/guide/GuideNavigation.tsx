'use client'
import { useEffect, useRef, useState } from 'react'
import { List, ArrowUp } from 'lucide-react'

export type GuideHeading = { id: string; title: string; section?: string }
export default function GuideNavigation({
  sections,
  headings,
  topId = 'ranger-top',
}: {
  sections: GuideHeading[]
  headings: GuideHeading[]
  topId?: string
}) {
  const [active, setActive] = useState(sections[0]?.id || '')
  const [query, setQuery] = useState('')
  const mobile = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    sections.forEach((s) => {
      const node = document.getElementById(s.id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [sections])
  const items = query.trim()
    ? headings.filter((h) => h.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    : sections
  const content = (
    <>
      <label className="toc-search-label">
        목차에서 찾기
        <input
          className="field"
          placeholder="스킬명, 특화, 생존…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <nav aria-label="공략 목차">
        {items.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? 'location' : undefined}
            onClick={() => {
              setActive(s.section || s.id)
              mobile.current?.removeAttribute('open')
            }}
          >
            <span>{query ? '↳' : String(i + 1).padStart(2, '0')}</span>
            {s.title}
          </a>
        ))}
      </nav>
      {!items.length && (
        <p className="toc-no-results" role="status">
          일치하는 항목이 없습니다.
        </p>
      )}
      <a className="toc-top" href={`#${topId}`}>
        <ArrowUp size={14} /> 공략 처음으로
      </a>
    </>
  )
  return (
    <>
      <aside className="guide-toc">
        <span className="eyebrow">IN THIS GUIDE</span>
        <h2>필요한 부분부터.</h2>
        {content}
      </aside>
      <details className="guide-mobile-toc" ref={mobile}>
        <summary>
          <List size={18} /> 목차 보기 <span>{sections.find((s) => s.id === active)?.title}</span>
        </summary>
        <div>{content}</div>
      </details>
    </>
  )
}
