import Link from 'next/link'
import { getPortal } from '@/lib/portal/data'
import { DataNotice, EmptyState, PageHeading } from './UI'

export async function Recruits() {
  const state = await getPortal()
  return (
    <>
      <PageHeading
        label="FIND YOUR GUILD"
        title="함께 싸울 동료를 찾으세요"
        description="플레이 스타일이 맞는 길드와 다음 전장을 준비하세요."
      >
        <Link className="button secondary" href="/guild-recruit/new">
          모집 등록 안내
        </Link>
      </PageHeading>
      <DataNotice state={state} />
      {state.data.recruits.length ? (
        <div className="content-grid">
          {state.data.recruits.map((r) => (
            <Link
              href={`/guild-recruit/${encodeURIComponent(r.id)}`}
              key={r.id}
              className="panel content-card"
            >
              <span className="eyebrow">{r.name}</span>
              <h2>{r.title}</h2>
              {r.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
              <p>{r.description.slice(0, 130)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="panel">
          <EmptyState
            title="새로운 동료를 맞이할 준비 중"
            description="현재 공개된 모집글이 없습니다. 등록 안내에서 접수 방법을 확인하세요."
          />
        </div>
      )}
    </>
  )
}
export async function Tournaments() {
  const state = await getPortal()
  return (
    <>
      <PageHeading
        label="PONYANG TOURNAMENT"
        title="승부의 무대"
        description="모험가가 만드는 대회. 함께 즐기는 검은사막 PvP."
      />
      <DataNotice state={state} />
      {state.data.tournaments.length ? (
        <div className="content-grid">
          {state.data.tournaments.map((t) => (
            <article className="panel content-card" key={t.id}>
              <span className="tag">{t.status}</span>
              <span className="eyebrow">{t.date}</span>
              <h2>{t.title}</h2>
              <p>{t.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel">
          <EmptyState
            title="다음 대회를 준비하고 있습니다"
            description="확정된 일정과 참가 안내는 이 페이지에 공개됩니다. 현재 접수 중인 대회는 없습니다."
          />
        </div>
      )}
    </>
  )
}
export async function Statistics() {
  const state = await getPortal()
  const counts = new Map<string, number>()
  for (const row of state.data.solare) counts.set(row.class, (counts.get(row.class) || 0) + 1)
  return (
    <>
      <PageHeading
        label="PVP INSIGHTS"
        title="기록으로 보는 전장"
        description="등록된 솔라레 랭킹을 기준으로 보는 클래스 분포입니다."
      />
      <DataNotice state={state} />
      {counts.size ? (
        <div className="panel panel-pad stack">
          {[...counts]
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => (
              <div key={name}>
                <div className="section-heading">
                  <span>{name}</span>
                  <span>
                    {count}명 · {Math.round((count / state.data.solare.length) * 100)}%
                  </span>
                </div>
                <meter
                  value={count}
                  max={state.data.solare.length}
                  aria-label={`${name} 비중`}
                  className="w-full"
                />
              </div>
            ))}
        </div>
      ) : (
        <div className="panel">
          <EmptyState
            title="분석할 랭킹 데이터가 없습니다"
            description="실제 랭킹이 등록된 이후 클래스별 분포를 제공합니다."
          />
        </div>
      )}
    </>
  )
}
