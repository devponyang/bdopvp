'use client'
import { useState } from 'react'
import { guides } from '@/lib/portal/guides'
import { matchesGuide } from '@/lib/portal/guide-search'
import GuideCard from './GuideCard'
import { PageHeading } from './UI'

export default function GuideLibrary() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('전체')
  const filtered = guides.filter(
    (g) => matchesGuide(g, query) && (type === '전체' || g.title.includes(type)),
  )
  return (
    <>
      <PageHeading
        label="CLASS ARCHIVE"
        title="당신의 클래스를 더 깊이"
        description="전승부터 각성까지. 남아 있는 공략에서 다음 승리의 실마리를 찾아보세요."
      />
      <div className="data-notice">
        기존에 작성된 공략 보관본입니다. 현재 게임 패치와 내용이 다를 수 있습니다.
      </div>
      <div className="section-heading">
        <div className="chip-list">
          {['전체', '전승', '각성'].map((t) => (
            <button
              key={t}
              className={`chip ${type === t ? 'active' : ''}`}
              aria-pressed={type === t}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          className="field"
          aria-label="공략 검색"
          placeholder="클래스 · 작성자 · 길드 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p className="data-caption" aria-live="polite">
        {filtered.length}개의 보관된 가이드
      </p>
      <div className="guide-grid">
        {filtered.map((g) => (
          <GuideCard key={g.id} guide={g} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h3>일치하는 가이드가 없습니다</h3>
          <p>다른 클래스 이름을 입력하거나 필터를 변경해 보세요.</p>
          <button
            className="button secondary section-gap"
            onClick={() => {
              setQuery('')
              setType('전체')
            }}
          >
            필터 초기화
          </button>
        </div>
      )}
    </>
  )
}
