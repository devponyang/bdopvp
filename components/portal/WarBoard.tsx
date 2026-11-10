'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { PortalState } from '@/lib/portal/schema'
import { DataNotice, EmptyState, PageHeading } from './UI'
export default function WarBoard({
  state,
  history = false,
}: {
  state: PortalState
  history?: boolean
}) {
  const [type, setType] = useState('전체')
  const [query, setQuery] = useState('')
  const [date, setDate] = useState('')
  const rows = [...state.data.wars]
    .filter(
      (w) =>
        (type === '전체' || w.type === type) &&
        (!date || w.date === date) &&
        `${w.region} ${w.winner}`.includes(query.trim()),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHeading
        label="BATTLE RECORDS"
        title="거점 · 점령전"
        description="전장을 차지한 이름들. 지역별 결과와 지난 전투를 확인하세요."
      />
      <DataNotice state={state} />
      <div className="chip-list">
        <Link className={`chip ${!history ? 'active' : ''}`} href="/war-records/summary">
          전투 현황
        </Link>
        <Link className={`chip ${history ? 'active' : ''}`} href="/war-records/history">
          기록 검색
        </Link>
      </div>
      <div className="panel">
        <div className="toolbar">
          <select
            className="field"
            aria-label="전투 종류"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {['전체', '거점전', '점령전'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="지역 또는 길드 검색"
            placeholder="지역 또는 길드 검색"
          />
          {history && (
            <label>
              전투일
              <input
                type="date"
                className="field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          )}
          <span className="result-count" aria-live="polite">
            {rows.length}개 기록
          </span>
        </div>
        {rows.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>종류</th>
                  <th>지역</th>
                  <th>단계</th>
                  <th>승리 길드</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((w) => (
                  <tr key={w.id}>
                    <td>{w.date}</td>
                    <td>{w.type}</td>
                    <td>{w.region}</td>
                    <td>{w.tier}</td>
                    <td>
                      <Link href={`/guild/${encodeURIComponent(w.winner)}`}>{w.winner}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={
              state.data.wars.length
                ? '조건에 맞는 전투가 없습니다'
                : '전장의 기록을 다시 준비합니다'
            }
            description={
              state.data.wars.length
                ? '검색 조건을 변경해 보세요.'
                : '기존 전투 기록은 유실되었습니다. 확인된 결과가 등록되면 이곳에 표시됩니다.'
            }
          />
        )}
      </div>
    </>
  )
}
