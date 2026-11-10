'use client'
import { useEffect, useState } from 'react'
import { portalSchema } from '@/lib/portal/schema'

type Collection = 'solare' | 'league' | 'wars' | 'recruits' | 'tournaments' | 'notices'
type Field = {
  key: string
  label: string
  type?: 'number' | 'date' | 'url' | 'textarea'
  options?: string[]
  optional?: boolean
}
const rankFields: Field[] = [
  { key: 'name', label: '이름' },
  { key: 'class', label: '클래스', optional: true },
  { key: 'guild', label: '소속 길드', optional: true },
  { key: 'specialization', label: '전승 / 각성', optional: true },
  { key: 'score', label: '점수', type: 'number' },
  { key: 'wins', label: '승', type: 'number' },
  { key: 'draws', label: '무', type: 'number' },
  { key: 'losses', label: '패', type: 'number' },
]
const collections: Record<Collection, { label: string; fields: Field[] }> = {
  solare: { label: '솔라레', fields: rankFields },
  league: {
    label: '길드 리그',
    fields: rankFields.filter((f) => !['class', 'guild', 'specialization'].includes(f.key)),
  },
  wars: {
    label: '전투 기록',
    fields: [
      { key: 'id', label: '기록 ID' },
      { key: 'date', label: '전투일', type: 'date' },
      { key: 'type', label: '종류', options: ['거점전', '점령전'] },
      { key: 'region', label: '지역' },
      { key: 'tier', label: '단계' },
      { key: 'winner', label: '승리 길드' },
    ],
  },
  recruits: {
    label: '길드 모집',
    fields: [
      { key: 'id', label: '게시글 ID' },
      { key: 'name', label: '길드명' },
      { key: 'title', label: '모집 제목' },
      { key: 'tags', label: '태그 (쉼표로 구분)', optional: true },
      { key: 'contact', label: '연락처 HTTPS 주소', type: 'url' },
      { key: 'description', label: '모집 내용', type: 'textarea' },
    ],
  },
  tournaments: {
    label: '대회',
    fields: [
      { key: 'id', label: '대회 ID' },
      { key: 'title', label: '대회명' },
      { key: 'date', label: '개최일', type: 'date' },
      { key: 'status', label: '진행 상태', options: ['예정', '진행 중', '종료'] },
      { key: 'description', label: '일정 및 참가 안내', type: 'textarea' },
    ],
  },
  notices: {
    label: '공지',
    fields: [
      { key: 'id', label: '공지 ID' },
      { key: 'title', label: '제목' },
      { key: 'date', label: '게시일', type: 'date' },
      { key: 'content', label: '내용', type: 'textarea' },
    ],
  },
}

export default function ContentForm({
  source,
  onChange,
}: {
  source: string
  onChange: (value: string) => void
}) {
  const [collection, setCollection] = useState<Collection>('solare')
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [season, setSeason] = useState('')
  useEffect(() => {
    try {
      setSeason(JSON.parse(source).season || '')
    } catch {
      /* Keep the last valid season while JSON is edited. */
    }
  }, [source])
  let input: unknown
  try {
    input = JSON.parse(source)
  } catch {
    input = null
  }
  const parsed = portalSchema.safeParse(input)
  if (!parsed.success)
    return (
      <div className="form-message">
        간편 입력을 사용하려면 아래 JSON 형식의 오류를 먼저 수정해 주세요.
      </div>
    )
  const data = parsed.data
  const { fields } = collections[collection]
  const rows: Record<string, unknown>[] = data[collection]
  return (
    <div className="panel panel-pad mb-6">
      <label className="editor-label">
        현재 시즌
        <input
          className="field"
          value={season}
          maxLength={200}
          onChange={(e) => setSeason(e.target.value)}
          onBlur={() => {
            if (season.trim()) onChange(JSON.stringify({ ...data, season: season.trim() }, null, 2))
            else setSeason(data.season)
          }}
        />
      </label>
      <div className="chip-list section-gap">
        {(Object.keys(collections) as Collection[]).map((key) => (
          <button
            key={key}
            className={`chip ${collection === key ? 'active' : ''}`}
            aria-pressed={collection === key}
            onClick={() => {
              setCollection(key)
              setDraft({})
              setEditing(null)
              setMessage('')
            }}
          >
            {collections[key].label} · {data[key].length}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const record: Record<string, unknown> = {}
          for (const field of fields) {
            const value =
              draft[field.key] ?? field.options?.[0] ?? (field.type === 'number' ? '0' : '')
            record[field.key] =
              field.type === 'number'
                ? Number(value)
                : field.key === 'tags'
                  ? value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : value
          }
          const updated = [...rows]
          if (editing === null) updated.push(record)
          else updated[editing] = record
          const result = portalSchema.safeParse({ ...data, [collection]: updated })
          if (!result.success) {
            setMessage(result.error.issues.map((i) => i.message).join('\n'))
            return
          }
          onChange(JSON.stringify(result.data, null, 2))
          setDraft({})
          setEditing(null)
          setMessage('초안에 반영했습니다. 아래에서 내용 검증 후 게시하세요.')
        }}
      >
        <div className="content-grid">
          {fields.map((field) => (
            <label key={field.key} className="editor-label">
              {field.label}
              {field.optional ? ' (선택)' : ''}
              {field.options ? (
                <select
                  className="field"
                  value={draft[field.key] ?? field.options[0]}
                  onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                >
                  {field.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  className="field"
                  rows={4}
                  value={draft[field.key] || ''}
                  onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                  maxLength={10000}
                  required={!field.optional}
                />
              ) : (
                <input
                  className="field"
                  type={field.type || 'text'}
                  min={field.type === 'number' ? 0 : undefined}
                  step={field.type === 'number' ? 1 : undefined}
                  maxLength={200}
                  value={draft[field.key] ?? (field.type === 'number' ? '0' : '')}
                  onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                  required={!field.optional}
                />
              )}
            </label>
          ))}
        </div>
        <div className="admin-actions mt-5">
          <button className="button secondary">
            {editing === null ? '초안에 추가' : '초안 수정'}
          </button>
          {editing !== null && (
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setEditing(null)
                setDraft({})
              }}
            >
              수정 취소
            </button>
          )}
        </div>
      </form>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
      <div className="table-scroll section-gap">
        <table className="data-table">
          <caption className="sr-only">등록 초안 목록</caption>
          <thead>
            <tr>
              <th>이름 / 제목</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{String(row.name || row.title || row.winner || row.id)}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="chip"
                      onClick={() => {
                        setEditing(index)
                        setDraft(
                          Object.fromEntries(
                            Object.entries(row).map(([k, v]) => [
                              k,
                              Array.isArray(v) ? v.join(', ') : String(v),
                            ]),
                          ),
                        )
                        setMessage('위 입력란에서 수정하세요.')
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="chip"
                      onClick={() => {
                        onChange(
                          JSON.stringify(
                            { ...data, [collection]: rows.filter((_, i) => i !== index) },
                            null,
                            2,
                          ),
                        )
                        setEditing(null)
                        setDraft({})
                        setMessage(
                          '초안에서 제외했습니다. 게시 전까지 공개 데이터에는 반영되지 않습니다.',
                        )
                      }}
                    >
                      초안에서 제외
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="data-caption mt-4">아직 등록한 초안이 없습니다.</p>}
      </div>
    </div>
  )
}
