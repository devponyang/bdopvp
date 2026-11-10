import Link from 'next/link'
import { getPortal } from '@/lib/portal/data'
import { DataNotice, EmptyState, PageHeading, SectionHeading } from './UI'
export default async function Profile({
  name,
  kind,
}: {
  name: string
  kind: '길드' | '연맹' | '모험가'
}) {
  const state = await getPortal()
  const player = state.data.solare.find((p) => p.name === name)
  const guild = state.data.league.find((p) => p.name === name)
  const members = state.data.solare.filter((p) => p.guild === name)
  const entry = kind === '모험가' ? player : kind === '길드' ? guild : undefined
  return (
    <>
      <Link className="back-link" href="/search">
        ← 통합 검색
      </Link>
      <PageHeading
        label={kind === '모험가' ? 'ADVENTURER PROFILE' : 'GUILD PROFILE'}
        title={name}
        description={`${kind} 정보 · 등록된 공개 기록을 기준으로 표시합니다.`}
      />
      <DataNotice state={state} />
      {entry ? (
        <div className="stat-grid">
          <div className="panel stat-card">
            <span>점수</span>
            <strong>{entry.score.toLocaleString()}</strong>
          </div>
          <div className="panel stat-card">
            <span>전적</span>
            <strong>
              {entry.wins}승 {entry.losses}패
            </strong>
          </div>
          <div className="panel stat-card">
            <span>{kind === '모험가' ? '클래스' : '시즌'}</span>
            <strong>{kind === '모험가' ? entry.class : state.data.season}</strong>
          </div>
        </div>
      ) : (
        <div className="panel">
          <EmptyState
            title={`${kind} 정보를 확인할 수 없습니다`}
            description={
              kind === '연맹'
                ? '연맹 정보는 현재 재구축 중입니다. 확인된 소속 관계가 확보된 후 제공합니다.'
                : '이전 정보는 유실되었습니다. 새로 등록된 공개 기록에서 확인되는 정보만 표시합니다.'
            }
          />
        </div>
      )}
      {kind === '길드' && members.length > 0 && (
        <section className="section-gap">
          <SectionHeading title="솔라레에 등록된 소속 모험가" />
          <div className="content-grid">
            {members.map((m) => (
              <Link
                className="panel content-card"
                href={`/family/${encodeURIComponent(m.name)}`}
                key={m.name}
              >
                <span className="tag">{m.class}</span>
                <h3>{m.name}</h3>
                <p>{m.score.toLocaleString()}점</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
