'use client'

import { useState, useCallback } from 'react'
import classList from '@/lib/constants/class-list'
import Link from 'next/link'

interface OcrEntry {
  name: string
  class: string
  subclass: string
  wins: number
  draws: number
  losses: number
  score: number
}

type TabType = 'overall' | 'class'

function UploadZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      if (dropped.length > 0) onFiles(dropped)
    },
    [onFiles]
  )

  return (
    <div
      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors border-zinc-700 hover:border-zinc-500 bg-zinc-800/20"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => document.getElementById('ocr-file-input')?.click()}
    >
      <input
        id="ocr-file-input"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
          if (files.length > 0) onFiles(files)
          e.target.value = ''
        }}
      />
      <div className="space-y-3">
        <div className="text-5xl opacity-20 select-none">📷</div>
        <p className="text-zinc-400 text-sm">클릭하거나 이미지를 드래그해서 업로드</p>
        <p className="text-zinc-600 text-xs">PNG, JPG, WebP · 여러 파일 동시 선택 가능</p>
      </div>
    </div>
  )
}

function FileQueue({
  files,
  processingIndex,
  onRemove,
}: {
  files: File[]
  processingIndex: number | null
  onRemove: (i: number) => void
}) {
  if (files.length === 0) return null
  return (
    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
      {files.map((f, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs group transition-colors ${
            processingIndex === i
              ? 'bg-cyan-500/10 border border-cyan-500/30'
              : 'bg-zinc-800/50 border border-transparent'
          }`}
        >
          <span className="text-zinc-500 font-mono w-5 text-right shrink-0">{i + 1}</span>
          {processingIndex === i ? (
            <span className="w-3 h-3 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin shrink-0" />
          ) : (
            <span className="w-3 h-3 shrink-0" />
          )}
          <span className="text-zinc-300 flex-1 truncate">{f.name}</span>
          <span className="text-zinc-600 shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
          {processingIndex === null && (
            <button
              onClick={e => { e.stopPropagation(); onRemove(i) }}
              className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function EntryTable({
  entries,
  showClass,
  onUpdate,
  onRemove,
}: {
  entries: OcrEntry[]
  showClass: boolean
  onUpdate: (i: number, field: keyof OcrEntry, value: string | number) => void
  onRemove: (i: number) => void
}) {
  if (entries.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-600 uppercase tracking-wider">
            <th className="px-3 py-2.5 text-left w-10">순위</th>
            <th className="px-3 py-2.5 text-left">가문명</th>
            {showClass && <th className="px-3 py-2.5 text-left">클래스</th>}
            <th className="px-3 py-2.5 text-center">전승/각성</th>
            <th className="px-3 py-2.5 text-center w-14">승</th>
            <th className="px-3 py-2.5 text-center w-14">무</th>
            <th className="px-3 py-2.5 text-center w-14">패</th>
            <th className="px-3 py-2.5 text-right w-20">점수</th>
            <th className="px-2 py-2.5 w-6" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 group">
              <td className="px-3 py-2 text-zinc-600 font-mono">{i + 1}</td>
              <td className="px-3 py-2">
                <input
                  className="bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 outline-none text-zinc-200 w-32"
                  value={entry.name}
                  onChange={e => onUpdate(i, 'name', e.target.value)}
                />
              </td>
              {showClass && (
                <td className="px-3 py-2">
                  <select
                    className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-300 outline-none text-xs"
                    value={entry.class}
                    onChange={e => onUpdate(i, 'class', e.target.value)}
                  >
                    {classList.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </td>
              )}
              <td className="px-3 py-2 text-center">
                <select
                  className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-300 outline-none text-xs"
                  value={entry.subclass}
                  onChange={e => onUpdate(i, 'subclass', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="전승">전승</option>
                  <option value="각성">각성</option>
                </select>
              </td>
              {(['wins', 'draws', 'losses'] as const).map(f => (
                <td key={f} className="px-3 py-2 text-center">
                  <input
                    type="number"
                    min={0}
                    className="bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 outline-none text-zinc-300 font-mono w-10 text-center"
                    value={entry[f]}
                    onChange={e => onUpdate(i, f, parseInt(e.target.value) || 0)}
                  />
                </td>
              ))}
              <td className="px-3 py-2 text-right">
                <input
                  type="number"
                  min={0}
                  className="bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 outline-none text-zinc-300 font-mono w-16 text-right"
                  value={entry.score}
                  onChange={e => onUpdate(i, 'score', parseInt(e.target.value) || 0)}
                />
              </td>
              <td className="px-2 py-2">
                <button
                  onClick={() => onRemove(i)}
                  className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SolareOcrPage() {
  const [tab, setTab] = useState<TabType>('overall')

  // Upload queue
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [processingIndex, setProcessingIndex] = useState<number | null>(null)

  // Overall data
  const [overall, setOverall] = useState<OcrEntry[]>([])

  // Class data
  const [selectedClass, setSelectedClass] = useState(classList[0])
  const [classData, setClassData] = useState<Record<string, OcrEntry[]>>({})

  // Save
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFilesAdd = useCallback((newFiles: File[]) => {
    setFiles(prev => {
      const existingNames = new Set(prev.map(f => f.name))
      const deduped = newFiles.filter(f => !existingNames.has(f.name))
      return [...prev, ...deduped]
    })
  }, [])

  const handleFileRemove = useCallback((i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  const handleOcr = async () => {
    if (files.length === 0) return
    setProcessing(true)
    setProcessingIndex(null)
    setMessage(null)

    let successCount = 0
    let totalExtracted = 0
    const errors: string[] = []

    for (let i = 0; i < files.length; i++) {
      setProcessingIndex(i)
      const file = files[i]

      try {
        const form = new FormData()
        form.append('image', file)
        form.append('type', tab)
        if (tab === 'class') form.append('class', selectedClass)

        const res = await fetch('/api/admin/solare/ocr', { method: 'POST', body: form })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || '처리 실패')

        totalExtracted += data.count || 0
        successCount++

        if (tab === 'overall') {
          setOverall(prev => {
            const map = new Map(prev.map(e => [`${e.name}-${e.class}`, e]))
            ;(data.entries as OcrEntry[]).forEach(e => {
              const key = `${e.name}-${e.class}`
              if (!map.has(key) || map.get(key)!.score < e.score) map.set(key, e)
            })
            return Array.from(map.values()).sort((a, b) => b.score - a.score)
          })
        } else {
          setClassData(prev => {
            const prevEntries = prev[selectedClass] || []
            const map = new Map(prevEntries.map(e => [e.name, e]))
            ;(data.entries as OcrEntry[]).forEach(e => map.set(e.name, e))
            return {
              ...prev,
              [selectedClass]: Array.from(map.values()).sort((a, b) => b.score - a.score),
            }
          })
          // 클래스 랭킹 결과를 전체 랭킹에도 자동 병합 (점수 높은 쪽 우선)
          setOverall(prev => {
            const map = new Map(prev.map(e => [`${e.name}-${e.class}`, e]))
            ;(data.entries as OcrEntry[]).forEach(e => {
              const key = `${e.name}-${e.class}`
              if (!map.has(key) || map.get(key)!.score < e.score) map.set(key, e)
            })
            return Array.from(map.values()).sort((a, b) => b.score - a.score)
          })
        }
      } catch (err) {
        errors.push(`${file.name}: ${err instanceof Error ? err.message : '오류'}`)
      }
    }

    setFiles([])
    setProcessingIndex(null)
    setProcessing(false)

    if (errors.length > 0 && successCount === 0) {
      setMessage({ type: 'error', text: `모든 파일 처리 실패. ${errors[0]}` })
    } else if (errors.length > 0) {
      setMessage({
        type: 'error',
        text: `${successCount}/${files.length}장 처리 완료 (${totalExtracted}명 추출). 실패: ${errors.join(', ')}`,
      })
    } else {
      setMessage({
        type: 'success',
        text: `${successCount}장 처리 완료, ${totalExtracted}명 추출. 결과를 확인하고 수정한 뒤 저장하세요.`,
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const body = { overall, classData, date }

      const res = await fetch('/api/admin/solare/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('저장 실패')
      setMessage({ type: 'success', text: `${date} 데이터가 DB에 저장되었습니다.` })
      if (tab === 'overall') setOverall([])
      else setClassData({})
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '저장 오류' })
    } finally {
      setSaving(false)
    }
  }

  const updateOverall = (i: number, field: keyof OcrEntry, value: string | number) =>
    setOverall(prev => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)))

  const removeOverall = (i: number) =>
    setOverall(prev => prev.filter((_, idx) => idx !== i))

  const updateClass = (cls: string, i: number, field: keyof OcrEntry, value: string | number) =>
    setClassData(prev => ({
      ...prev,
      [cls]: prev[cls].map((e, idx) => (idx === i ? { ...e, [field]: value } : e)),
    }))

  const removeClass = (cls: string, i: number) =>
    setClassData(prev => ({
      ...prev,
      [cls]: prev[cls].filter((_, idx) => idx !== i),
    }))

  const hasData = tab === 'overall' ? overall.length > 0 : Object.keys(classData).length > 0
  const totalClassEntries = Object.values(classData).reduce((s, e) => s + e.length, 0)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">솔라레 OCR 파이프라인</h1>
            <p className="text-zinc-500 text-sm mt-1">
              랭킹 스크린샷 업로드 → Claude AI 자동 추출 → 미리보기/수정 → DB 저장
            </p>
          </div>
          <Link
            href="/admin/solare"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
          >
            ← 솔라레 관리
          </Link>
        </div>

        {/* Guide */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-zinc-500 space-y-1">
          <p className="text-zinc-400 font-semibold text-xs uppercase tracking-widest mb-2">사용 방법</p>
          <p>1. 탭 선택 → 스크린샷 여러 장 동시 업로드 → OCR 시작</p>
          <p>2. 추출된 데이터 확인 및 수정 (틀린 부분 직접 편집 가능)</p>
          <p>3. 전체 랭킹: 스크롤 구간별 여러 장을 한 번에 업로드하면 자동 병합됩니다</p>
          <p>4. 클래스 랭킹: 클래스 선택 후 해당 클래스 스크린샷 업로드, 반복</p>
          <p>5. 날짜 확인 후 DB 저장</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2">
          {(['overall', 'class'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setMessage(null) }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === t
                  ? 'bg-cyan-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {t === 'overall' ? '전체 랭킹 (1–100위)' : '클래스 랭킹 (1–20위)'}
            </button>
          ))}
        </div>

        {/* Upload panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              이미지 업로드
              {files.length > 0 && (
                <span className="ml-2 text-cyan-400 font-mono normal-case">{files.length}장 대기 중</span>
              )}
            </h2>
            {tab === 'class' && (
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-zinc-500">클래스</span>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:border-cyan-500/50 outline-none"
                >
                  {classList.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                {classData[selectedClass] && (
                  <span className="text-xs text-cyan-400 font-mono">
                    {classData[selectedClass].length}명 수집됨
                  </span>
                )}
              </div>
            )}
          </div>

          <UploadZone onFiles={handleFilesAdd} />

          {files.length > 0 && (
            <FileQueue
              files={files}
              processingIndex={processingIndex}
              onRemove={handleFileRemove}
            />
          )}

          <button
            onClick={handleOcr}
            disabled={files.length === 0 || processing}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-cyan-500 hover:bg-cyan-400 text-black"
          >
            {processing && processingIndex !== null ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                처리 중 {processingIndex + 1}/{files.length}...
              </span>
            ) : files.length > 0 ? (
              `OCR 시작 — ${files.length}장`
            ) : (
              'OCR 시작'
            )}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`px-4 py-3 rounded-xl text-sm border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Results + Save: Overall */}
        {tab === 'overall' && overall.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-200">전체 랭킹 추출 결과</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                  {overall.length}명
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1.5 bg-emerald-500 text-black text-sm font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                >
                  {saving ? '저장 중...' : 'DB 저장'}
                </button>
                <button
                  onClick={() => { setOverall([]); setMessage(null) }}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>
            <EntryTable
              entries={overall}
              showClass
              onUpdate={updateOverall}
              onRemove={removeOverall}
            />
          </div>
        )}

        {/* Results + Save: Class */}
        {tab === 'class' && Object.keys(classData).length > 0 && (
          <div className="space-y-4">
            {/* Class summary + global save */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500 mr-1">수집됨:</span>
                {Object.entries(classData).map(([cls, ents]) => (
                  <span
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                      cls === selectedClass
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {cls} <span className="font-mono text-cyan-400">{ents.length}</span>
                  </span>
                ))}
                <span className="text-xs text-zinc-600 ml-1">총 {totalClassEntries}명</span>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1.5 bg-emerald-500 text-black text-sm font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                >
                  {saving ? '저장 중...' : '전체 DB 저장'}
                </button>
                <button
                  onClick={() => { setClassData({}); setMessage(null) }}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* Currently selected class table */}
            {classData[selectedClass] && classData[selectedClass].length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
                  <span className="text-sm font-bold text-zinc-200">{selectedClass} 랭킹</span>
                  <span className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
                    {classData[selectedClass].length}명
                  </span>
                </div>
                <EntryTable
                  entries={classData[selectedClass]}
                  showClass={false}
                  onUpdate={(i, f, v) => updateClass(selectedClass, i, f, v)}
                  onRemove={i => removeClass(selectedClass, i)}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!hasData && !processing && (
          <div className="text-center py-12 text-zinc-700 text-sm">
            스크린샷을 업로드하면 추출 결과가 여기에 표시됩니다
          </div>
        )}
      </div>
    </div>
  )
}
