import Link from 'next/link'
import { getPortal } from '@/lib/portal/data'
import { guides } from '@/lib/portal/guides'
import { guideAuthors } from '@/lib/portal/guide-authors'
import { matchesGuide } from '@/lib/portal/guide-search'
import { DataNotice, PageHeading } from './UI'
export default async function SearchPage({ query }: { query: string }) {
  const state = await getPortal()
  const q = query.normalize('NFC').trim().slice(0, 100)
  const match = (value: string) =>
    Boolean(q) && value.normalize('NFC').toLocaleLowerCase().includes(q.toLocaleLowerCase())
  const guildNames = [
    ...new Set(
      [
        ...state.data.league.map((g) => g.name),
        ...state.data.solare.map((g) => g.guild),
        ...state.data.recruits.map((g) => g.name),
      ].filter(Boolean),
    ),
  ]
  const results = [
    ...guildNames.filter(match).map((name) => ({
      name,
      label: '길드',
      href: `/guild/${encodeURIComponent(name)}`,
      description: '길드 정보 보기 ↗',
    })),
    ...state.data.solare
      .filter((p) => match(p.name))
      .map((p) => ({
        name: p.name,
        label: '모험가',
        href: `/family/${encodeURIComponent(p.name)}`,
        description: '모험가 전적 보기 ↗',
      })),
    ...guides
      .filter((g) => Boolean(q) && matchesGuide(g, q))
      .map((g) => ({
        name: g.title,
        label: '클래스 가이드',
        href: `/tip-board/${g.id}`,
        description: `${guideAuthors[g.id].name} 작성 · ${guideAuthors[g.id].affiliation}`,
      })),
  ]
  return (
    <>
      <PageHeading
        label="SEARCH PONYANG"
        title={q ? `“${q}” 검색 결과` : '무엇을 찾고 있나요?'}
        description="길드, 모험가, 클래스와 공략 작성자를 검색하세요."
      />
      <form action="/search" className="toolbar panel mb-6">
        <input
          name="q"
          className="field flex-1"
          defaultValue={q}
          aria-label="검색어"
          placeholder="길드명, 모험가명, 클래스, 작성자"
          maxLength={100}
          required
        />
        <button className="button">검색</button>
      </form>
      <DataNotice state={state} />
      <p className="data-caption">
        {q
          ? `${results.length}개의 검색 결과`
          : '검색어를 입력해 주세요. 연맹 검색은 데이터 재구축 후 제공됩니다.'}
      </p>
      <div className="content-grid">
        {results.map((r) => (
          <Link key={r.href} href={r.href} className="panel content-card">
            <span className="tag">{r.label}</span>
            <h2>{r.name}</h2>
            <p>{r.description}</p>
          </Link>
        ))}
      </div>
      {q && !results.length && (
        <div className="panel empty-state">
          <h3>일치하는 결과가 없습니다</h3>
          <p>클래스 이름으로 검색하거나 데이터 재구축 이후 다시 확인해 주세요.</p>
          <Link href="/tip-board">전체 클래스 가이드 보기 ↗</Link>
        </div>
      )}
    </>
  )
}
