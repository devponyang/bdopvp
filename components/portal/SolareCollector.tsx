'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { CLASS_NAME_MAP } from '@/lib/constants/master-class'
import {
  mergeRows,
  positionRows,
  toRanking,
  type CaptureRow,
  type Observation,
} from '@/lib/portal/solare-capture'

type Point = { x: number; y: number }
type Area = { left: number; top: number; width: number; height: number }
const full: Area = { left: 0, top: 0, width: 1, height: 1 }
type Phase = 'idle' | 'choosing' | 'select' | 'reading' | 'review'
function areaBetween(a: Point, b: Point): Area {
  return {
    left: Math.min(a.x, b.x),
    top: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }
}
function Proof({ blob }: { blob: Blob }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])
  return url ? (
    <img src={url} alt="게임 화면에서 읽은 원본 행" style={{ width: '100%', height: 'auto' }} />
  ) : null
}

export default function SolareCollector({
  onApply,
}: {
  onApply: (rows: ReturnType<typeof toRanking>[]) => void
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [lastRank, setLastRank] = useState('100')
  const limit = Math.min(100, Math.max(1, Math.trunc(Number(lastRank)) || 1))
  const [rows, setRows] = useState(new Map<number, CaptureRow>()),
    [area, setArea] = useState<Area>(full)
  const [message, setMessage] = useState(''),
    [all, setAll] = useState(false)
  const video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null)
  const worker = useRef<Worker | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const epoch = useRef(0),
    drag = useRef<Point | null>(null)
  const verifiedIcons = useRef(new Map<string, string>())
  function release() {
    ++epoch.current
    if (timer.current) clearTimeout(timer.current)
    worker.current?.terminate()
    worker.current = null
    stream.current?.getTracks().forEach((track) => track.stop())
    stream.current = null
    if (video.current) video.current.srcObject = null
  }
  useEffect(() => release, [])
  function stop() {
    release()
    setPhase('review')
    setMessage('수집을 마쳤습니다. 확인이 필요한 행을 원본과 대조해 주세요.')
  }
  async function choose() {
    release()
    const id = epoch.current
    setMessage('')
    setPhase('choosing')
    try {
      if (!navigator.mediaDevices?.getDisplayMedia)
        throw Error(
          '화면 공유를 지원하는 데스크톱 브라우저에서 HTTPS 또는 localhost로 열어 주세요.',
        )
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'window' },
        audio: false,
      })
      if (id !== epoch.current) {
        media.getTracks().forEach((t) => t.stop())
        return
      }
      stream.current = media
      media.getVideoTracks()[0].onended = () => {
        if (id === epoch.current) stop()
      }
      video.current!.srcObject = media
      await video.current!.play()
      if (id === epoch.current) {
        setArea(full)
        setPhase('select')
      }
    } catch (e) {
      if (id === epoch.current) {
        stop()
        setMessage(e instanceof Error ? e.message : '화면을 열지 못했습니다.')
      }
    }
  }
  function point(e: PointerEvent<HTMLDivElement>): Point {
    const r = e.currentTarget.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    }
  }
  function start() {
    const v = video.current
    if (
      !v ||
      !v.videoWidth ||
      area.width * v.videoWidth < 420 ||
      area.height * v.videoHeight < 50
    ) {
      setMessage('순위표의 양 끝과 보이는 행 전체를 선택해 주세요.')
      return
    }
    const id = epoch.current
    const engine = new Worker('/solare-ocr/reader.js', { type: 'module' })
    worker.current = engine
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(v.videoWidth * area.width)
    canvas.height = Math.round(v.videoHeight * area.height)
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    let last = ''
    const schedule = () => {
      timer.current = setTimeout(read, 650)
    }
    function fail(reason: string) {
      if (id === epoch.current) {
        stop()
        setMessage(reason)
      }
    }
    async function read() {
      if (id !== epoch.current || !v) return
      try {
        ctx.drawImage(
          v,
          area.left * v.videoWidth,
          area.top * v.videoHeight,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height,
        )
        // Sample the text columns to skip stationary frames while the list is open.
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
        let checksum = 2166136261
        for (let y = 0; y < canvas.height; y += 3)
          for (let x = Math.floor(canvas.width * 0.31); x < canvas.width * 0.95; x += 7)
            checksum = Math.imul(checksum ^ image.data[(y * canvas.width + x) * 4], 16777619)
        if (String(checksum) === last) {
          schedule()
          return
        }
        last = String(checksum)
        const bitmap = await createImageBitmap(canvas)
        if (epoch.current !== id) {
          bitmap.close()
          return
        }
        engine.postMessage({ bitmap, catalog: CLASS_NAME_MAP }, [bitmap])
      } catch (e) {
        fail(e instanceof Error ? e.message : '화면을 읽지 못했습니다.')
      }
    }
    engine.onmessage = ({ data }: { data: { rows?: Observation[]; error?: string } }) => {
      if (id !== epoch.current) return
      if (data.error) {
        fail(data.error)
        return
      }
      const aligned = positionRows(
        (data.rows ?? []).map((row) => ({
          ...row,
          className: verifiedIcons.current.get(row.iconKey) ?? row.className,
        })),
      )
      if (aligned.length) {
        setRows((previous) => mergeRows(previous, aligned, limit))
        setMessage(
          aligned[0].rank +
            '~' +
            aligned[aligned.length - 1].rank +
            '위 읽음 · 다음 행이 보이도록 스크롤하세요.',
        )
      } else setMessage('순위 위치를 확인할 수 없습니다. 순위표를 맞추고 잠시 멈춰 주세요.')
      schedule()
    }
    engine.onerror = () =>
      fail('로컬 OCR을 실행하지 못했습니다. 브라우저를 업데이트한 뒤 다시 시도하세요.')
    setPhase('reading')
    setMessage('PC에서 한글 인식 모델을 불러오는 중…')
    void read()
  }
  const ranked = [...rows.values()].filter((r) => r.rank <= limit).sort((a, b) => a.rank - b.rank)
  const pending = (r: CaptureRow) => !r.confirmed && (!r.clean || r.conflict || !r.className)
  const review = ranked.filter(pending)
  const missing = Array.from({ length: limit }, (_, i) => i + 1).filter((rank) => !rows.has(rank))
  function edit(rank: number, change: Partial<CaptureRow>) {
    setRows((prev) => {
      const next = new Map(prev)
      next.set(rank, { ...next.get(rank)!, clean: false, confirmed: false, ...change })
      return next
    })
  }
  function apply() {
    try {
      const records = ranked.map(toRanking)
      if (new Set(records.map((r) => r.name)).size !== records.length)
        throw Error('중복 가문명이 있습니다. 전체 행 보기에서 수정해 주세요.')
      if (records.some((r, i) => i > 0 && r.score > records[i - 1].score))
        throw Error('점수 순서가 뒤바뀐 행이 있습니다. 전체 행 보기에서 수정해 주세요.')
      onApply(records)
      setMessage(records.length + '명을 솔라레 초안에 반영했습니다.')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '초안 반영 실패')
    }
  }
  const active = ['select', 'choosing', 'reading'].includes(phase)
  return (
    <section className="panel panel-pad section-gap">
      <h2>솔라레 순위 수집</h2>
      <div className="admin-actions">
        <label>
          수집할 마지막 순위{' '}
          <input
            className="field"
            style={{ width: 85 }}
            type="number"
            min={1}
            max={100}
            value={lastRank}
            disabled={active}
            onChange={(e) => setLastRank(e.target.value)}
            onBlur={() => setLastRank(String(limit))}
          />
        </label>
        {!active && (
          <button className="button" onClick={choose}>
            {rows.size ? '이어서 수집' : '솔라레 수집 시작'}
          </button>
        )}
        {active && (
          <button className="button secondary" onClick={stop}>
            수집 중지
          </button>
        )}
      </div>
      <div hidden={phase !== 'select' && phase !== 'reading'}>
        <p>
          {phase === 'select'
            ? '순위표의 왼쪽 끝부터 오른쪽 화살표 끝까지, 보이는 행 전체를 드래그하세요.'
            : '게임에서 순위표를 천천히 내려 주세요.'}
        </p>
        <div
          style={{
            position: 'relative',
            touchAction: 'none',
            cursor: phase === 'select' ? 'crosshair' : 'default',
          }}
          onPointerDown={(e) => {
            if (phase === 'select') {
              drag.current = point(e)
              e.currentTarget.setPointerCapture(e.pointerId)
            }
          }}
          onPointerMove={(e) => {
            if (drag.current) setArea(areaBetween(drag.current, point(e)))
          }}
          onPointerUp={(e) => {
            if (drag.current) {
              setArea(areaBetween(drag.current, point(e)))
              drag.current = null
            }
          }}
          onPointerCancel={() => {
            drag.current = null
          }}
        >
          <video
            ref={video}
            muted
            playsInline
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              border: '2px solid var(--accent)',
              left: area.left * 100 + '%',
              top: area.top * 100 + '%',
              width: area.width * 100 + '%',
              height: area.height * 100 + '%',
            }}
          />
        </div>
        {phase === 'select' && (
          <button className="button" onClick={start}>
            선택 영역 읽기
          </button>
        )}
      </div>
      <p role="status">{message}</p>
      {(rows.size > 0 || phase === 'reading') && (
        <p>
          수집 {ranked.length}/{limit}명 · 확인 필요 {review.length}명
        </p>
      )}
      {phase === 'review' && ranked.length > 0 && (
        <>
          {missing.length > 0 && (
            <p>
              아직 읽지 못한 순위 · {missing.slice(0, 15).join(', ')}
              {missing.length > 15 ? ' …' : ''}
            </p>
          )}
          <label>
            <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> 전체
            행 보기
          </label>
          {(all ? ranked : review).map((row) => (
            <div className="panel panel-pad" key={row.rank}>
              <strong>
                {row.rank}위 {row.conflict ? '· 서로 다른 결과 감지' : ''}
              </strong>
              <Proof blob={row.proof} />
              <div className="admin-actions">
                <label>
                  클래스
                  <input
                    className="field"
                    list="solare-capture-classes"
                    maxLength={40}
                    placeholder="미판별 · 기존 값 유지"
                    value={row.className}
                    onChange={(e) => edit(row.rank, { className: e.target.value })}
                  />
                </label>
                <label>
                  전승·각성
                  <select
                    className="field"
                    value={row.specialization}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || value === '전승' || value === '각성')
                        edit(row.rank, { specialization: value })
                    }}
                  >
                    <option value="">미판별 · 기존 값 유지</option>
                    <option value="전승">전승 (파랑)</option>
                    <option value="각성">각성 (빨강)</option>
                  </select>
                </label>
                {(['name', 'record', 'score', 'rate'] as const).map((key, i) => (
                  <label key={key}>
                    {['가문명', '승 / 무 / 패', '점수', '승률'][i]}
                    <input
                      className="field"
                      value={row[key]}
                      onChange={(e) => edit(row.rank, { [key]: e.target.value })}
                    />
                  </label>
                ))}
                <button
                  className="button secondary"
                  onClick={() => {
                    try {
                      toRanking(row)
                      if (row.iconKey && row.className.trim()) {
                        const name = row.className.trim()
                        verifiedIcons.current.set(row.iconKey, name)
                        setRows(
                          (prev) =>
                            new Map(
                              [...prev].map(([k, r]) => [
                                k,
                                r.iconKey === row.iconKey ? { ...r, className: name } : r,
                              ]),
                            ),
                        )
                      }
                      edit(row.rank, { confirmed: true })
                      setMessage('')
                    } catch (e) {
                      setMessage((e as Error).message)
                    }
                  }}
                >
                  원본 확인
                </button>
              </div>
            </div>
          ))}
          <datalist id="solare-capture-classes">
            {Object.keys(CLASS_NAME_MAP).map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <button
            className="button"
            disabled={Boolean(review.length || missing.length)}
            onClick={apply}
          >
            솔라레 초안에 반영
          </button>
          <button
            className="button secondary"
            onClick={() => {
              if (window.confirm('이번에 수집한 행을 지울까요?')) {
                setRows(new Map())
                verifiedIcons.current.clear()
                setPhase('idle')
                setMessage('')
              }
            }}
          >
            수집 초기화
          </button>
        </>
      )}
    </section>
  )
}
