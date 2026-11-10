'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import classList from '@/lib/constants/class-list'
import type { PortalState } from '@/lib/portal/schema'
import { DataNotice, EmptyState, PageHeading } from './UI'

export default function RankingBoard({
  state,
  mode,
  initialClass = '',
}: {
  state: PortalState
  mode: 'solare' | 'league'
  initialClass?: string
}) {
  const [query, setQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState(initialClass)
  const [page, setPage] = useState(1)
  const solare = mode === 'solare'
  const ranked = [...state.data[mode]]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
  const rows = ranked.filter(
    (e) =>
      (!selectedClass || e.class === selectedClass) &&
      `${e.name} ${e.guild}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )
  const pageCount = Math.max(1, Math.ceil(rows.length / 20))
  return (
    <>
      <PageHeading
        label={solare ? 'ARENA OF SOLARE' : 'GUILD LEAGUE'}
        title={solare ? '솔라레의 창' : '길드 리그'}
        description={
          solare
            ? '실력으로 증명하는 순간. 모험가들의 경쟁을 한눈에.'
            : '개인의 실력을 넘어, 길드의 이름으로 기록하는 승리.'
        }
      />
      <DataNotice state={state} />
      <div className="stat-grid">
        {[
          {
            label: solare ? '등록된 모험가' : '참여 길드',
            value: ranked.length ? ranked.length.toLocaleString() : '—',
            sub: '현재 등록된 랭킹 기준',
          },
          {
            label: '최고 점수',
            value: ranked.length ? ranked[0].score.toLocaleString() : '—',
            sub: '점수 내림차순 집계',
          },
          { label: '시즌', value: state.data.season, sub: '관리자가 검증한 기록' },
        ].map((s) => (
          <div className="panel stat-card" key={s.label}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
            <small>{s.sub}</small>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="toolbar">
          <Search size={16} />
          <input
            className="field"
            aria-label={solare ? '모험가 또는 길드 검색' : '길드 검색'}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder={solare ? '모험가 또는 길드 검색' : '길드명 검색'}
          />
          {solare && (
            <select
              className="field"
              aria-label="클래스 선택"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value)
                setPage(1)
              }}
            >
              <option value="">전체 클래스</option>
              {classList.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}
          <span className="result-count" aria-live="polite">
            {rows.length}개 결과
          </span>
        </div>
        {rows.length ? (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <caption className="sr-only">{solare ? '솔라레' : '길드 리그'} 순위표</caption>
                <thead>
                  <tr>
                    <th scope="col">순위</th>
                    <th scope="col">{solare ? '모험가' : '길드'}</th>
                    {solare && <th scope="col">클래스</th>}
                    <th scope="col">점수</th>
                    <th className="desktop-column" scope="col">
                      승 / 무 / 패
                    </th>
                    <th className="desktop-column" scope="col">
                      승률
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice((page - 1) * 20, page * 20).map((e) => (
                    <tr key={e.name}>
                      <td className="rank">{String(e.rank).padStart(2, '0')}</td>
                      <td>
                        <Link
                          href={`/${solare ? 'family' : 'guild'}/${encodeURIComponent(e.name)}`}
                        >
                          {e.name}
                        </Link>
                        {e.guild && <small>{e.guild}</small>}
                      </td>
                      {solare && (
                        <td>
                          {e.class}
                          <small>{e.specialization}</small>
                        </td>
                      )}
                      <td className="score">{e.score.toLocaleString()}</td>
                      <td className="desktop-column">
                        {e.wins} / {e.draws} / {e.losses}
                      </td>
                      <td className="desktop-column">
                        {e.wins + e.draws + e.losses
                          ? `${Math.round((e.wins / (e.wins + e.draws + e.losses)) * 100)}%`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button
                className="icon-button"
                aria-label="이전 페이지"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span>
                {page} / {pageCount}
              </span>
              <button
                className="icon-button"
                aria-label="다음 페이지"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title={ranked.length ? '검색 결과가 없습니다' : '랭킹 데이터를 준비하고 있습니다'}
            description={
              ranked.length
                ? '검색어나 클래스 필터를 변경해 보세요.'
                : '이전 기록이 유실되어 재구축 중입니다. 실제 데이터가 등록되면 순위를 표시합니다.'
            }
          />
        )}
      </div>
    </>
  )
}
