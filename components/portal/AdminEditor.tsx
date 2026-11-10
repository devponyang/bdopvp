'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { portalSchema, type PortalState } from '@/lib/portal/schema'
import { PageHeading } from './UI'
import ContentForm from './ContentForm'
import SolareCollector from './SolareCollector'

type HistoryItem = { id: string; revision: string; published_at: string }
export default function AdminEditor({ initial }: { initial: PortalState }) {
  const [source, setSource] = useState(JSON.stringify(initial.data, null, 2))
  const [revision, setRevision] = useState(initial.revision)
  const [status, setStatus] = useState(initial.status)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const router = useRouter()
  function updateSource(value: string) {
    setSource(value)
    setReviewed(false)
    setMessage('')
  }
  function validate() {
    try {
      const data = portalSchema.parse(JSON.parse(source))
      setMessage(
        `검증 완료 · 솔라레 ${data.solare.length}명 / 길드 ${data.league.length}개 / 전투 ${data.wars.length}건 / 모집 ${data.recruits.length}건 / 대회 ${data.tournaments.length}건 / 공지 ${data.notices.length}건\n게시하면 공개 데이터 전체가 교체되고 이전 게시본은 이력에 보관됩니다.`,
      )
      setReviewed(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'JSON 형식 오류')
      setReviewed(false)
    }
  }
  async function publish() {
    setBusy(true)
    try {
      const res = await fetch('/api/v2/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'If-Match': `"${revision ?? 'none'}"` },
        body: source,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRevision(data.revision)
      setStatus('live')
      setReviewed(false)
      setMessage('게시했습니다. 새로 열린 공개 화면에 반영됩니다.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '게시 실패')
    } finally {
      setBusy(false)
    }
  }
  async function reload() {
    setBusy(true)
    try {
      const res = await fetch('/api/v2/admin', { cache: 'no-store' })
      if (!res.ok) throw new Error('최신 내용을 불러오지 못했습니다. 로그인을 확인하세요.')
      const state: PortalState = await res.json()
      if (state.status === 'error') throw new Error('DB 조회 실패. 현재 초안은 보존됩니다.')
      updateSource(JSON.stringify(state.data, null, 2))
      setRevision(state.revision)
      setStatus(state.status)
      setMessage('최신 게시본을 불러왔습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '불러오기 실패')
    } finally {
      setBusy(false)
    }
  }
  async function loadHistory(id?: string) {
    try {
      const res = await fetch(`/api/v2/admin/history${id ? `?id=${id}` : ''}`, {
        cache: 'no-store',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (id) {
        updateSource(JSON.stringify(portalSchema.parse(data), null, 2))
        setMessage('이전 게시본을 초안으로 불러왔습니다. 공개하려면 검증 후 게시하세요.')
      } else {
        setHistory(data.items)
        if (!data.items.length) setMessage('보관된 게시 이력이 없습니다.')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '이력 조회 실패')
    }
  }
  return (
    <>
      <PageHeading
        label="ADMIN WORKSPACE"
        title="콘텐츠 운영"
        description="검증된 기록을 등록하고 공개 데이터를 관리합니다."
      >
        <button
          className="button secondary"
          onClick={async () => {
            try {
              const res = await fetch('/api/session', { method: 'DELETE' })
              if (!res.ok) throw new Error()
              router.replace('/admin/login')
              router.refresh()
            } catch {
              setMessage('로그아웃에 실패했습니다. 다시 시도해 주세요.')
            }
          }}
        >
          로그아웃
        </button>
      </PageHeading>
      <div className="data-notice">
        {status === 'offline'
          ? 'DB 미연결 · 초안 편집과 파일 저장은 가능합니다. 게시하려면 DB 설정이 필요합니다.'
          : status === 'error'
            ? 'DB 조회 실패 · 연결과 마이그레이션을 확인하세요.'
            : `공개 데이터 버전 ${revision ?? '없음'} · 수정 후 검증하고 게시하세요.`}
      </div>
      <SolareCollector
        onApply={(records) => {
          const draft = portalSchema.parse(JSON.parse(source))
          const byName = new Map(draft.solare.map((row) => [row.name, row]))
          for (const record of records) {
            byName.set(record.name, {
              class: '',
              guild: '',
              specialization: '',
              ...byName.get(record.name),
              ...record,
            })
          }
          draft.solare = [...byName.values()].sort((a, b) => b.score - a.score)
          updateSource(JSON.stringify(portalSchema.parse(draft), null, 2))
        }}
      />
      <ContentForm source={source} onChange={updateSource} />
      <section className="panel panel-pad">
        <details>
          <summary className="editor-summary">고급 편집 · JSON 직접 수정</summary>
          <label className="sr-only" htmlFor="portal-json">
            공개 데이터 JSON
          </label>
          <textarea
            id="portal-json"
            className="field admin-editor"
            value={source}
            spellCheck={false}
            onChange={(e) => updateSource(e.target.value)}
          />
        </details>
        <div className="admin-actions mt-5">
          <button className="button secondary" disabled={busy} onClick={validate}>
            1. 내용 검증
          </button>
          <button
            className="button"
            disabled={!reviewed || busy || status === 'offline' || status === 'error'}
            onClick={publish}
          >
            {busy ? '처리 중…' : '2. 검증한 내용 게시'}
          </button>
          <button
            className="button secondary"
            onClick={() => {
              const url = URL.createObjectURL(new Blob([source], { type: 'application/json' }))
              const a = document.createElement('a')
              a.href = url
              a.download = 'ponyang-data.json'
              a.click()
              setTimeout(() => URL.revokeObjectURL(url), 1000)
            }}
          >
            초안 파일 저장
          </button>
          <label className="button secondary">
            JSON 파일 불러오기
            <input
              type="file"
              className="sr-only"
              accept=".json,application/json"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (file.size > 1024 * 1024) {
                  setMessage('1MB 이하의 파일만 가능합니다.')
                  return
                }
                try {
                  updateSource(await file.text())
                  setMessage('파일을 불러왔습니다. 검증을 실행하세요.')
                } catch {
                  setMessage('파일을 읽을 수 없습니다.')
                }
                e.target.value = ''
              }}
            />
          </label>
          <button className="button secondary" disabled={busy} onClick={reload}>
            초안 폐기 후 최신 내용 불러오기
          </button>
          <button className="button secondary" onClick={() => loadHistory()}>
            게시 이력 보기
          </button>
        </div>
        {message && (
          <div className="form-message" role="status">
            {message}
          </div>
        )}
        {history.length > 0 && (
          <div className="section-gap stack">
            {history.map((item) => (
              <div className="section-heading" key={item.id}>
                <span>
                  버전 {item.revision} ·{' '}
                  {new Date(item.published_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                </span>
                <button className="chip" onClick={() => loadHistory(item.id)}>
                  초안으로 불러오기
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
