'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface SiteNotice {
  id: number
  title: string
  content: string
  is_published: boolean
  created_at: string
  updated_at: string
}

const EMPTY_FORM = {
  title: '',
  content: '',
  isPublished: true
}

export default function AdminSiteNoticesPage() {
  const [notices, setNotices] = useState<SiteNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const title = selectedId ? '공지 수정' : '새 공지 작성'
  const ctaLabel = selectedId ? '공지 수정하기' : '공지 등록하기'

  const selectedNotice = useMemo(
    () => notices.find((notice) => notice.id === selectedId) ?? null,
    [notices, selectedId]
  )

  const fetchNotices = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/site-notices?limit=100&includeAll=true', {
        cache: 'no-store'
      })
      if (!res.ok) throw new Error('공지 불러오기 실패')
      const data = (await res.json()) as SiteNotice[]
      setNotices(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setSelectedId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }
    if (!form.content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        isPublished: form.isPublished
      }

      const res = await fetch(
        selectedId ? `/api/site-notices/${selectedId}` : '/api/site-notices',
        {
          method: selectedId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '저장에 실패했습니다.')
      }

      await fetchNotices()
      resetForm()
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (notice: SiteNotice) => {
    setSelectedId(notice.id)
    setForm({
      title: notice.title,
      content: notice.content,
      isPublished: notice.is_published
    })
  }

  const handleTogglePublish = async (notice: SiteNotice) => {
    try {
      const res = await fetch(`/api/site-notices/${notice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !notice.is_published })
      })
      if (!res.ok) throw new Error('상태 변경 실패')
      await fetchNotices()
    } catch (err) {
      const message = err instanceof Error ? err.message : '상태 변경에 실패했습니다.'
      setError(message)
    }
  }

  const handleDelete = async (notice: SiteNotice) => {
    if (!confirm(`'${notice.title}' 공지를 삭제할까요?`)) return

    setDeletingId(notice.id)
    try {
      const res = await fetch(`/api/site-notices/${notice.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('삭제 실패')
      await fetchNotices()
      if (selectedId === notice.id) {
        resetForm()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '삭제에 실패했습니다.'
      setError(message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">📢 사이트 공지 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            메인 페이지에 노출되는 공지사항을 등록하고 관리합니다.
          </p>
        </div>
        <button
          onClick={resetForm}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-colors"
        >
          새 공지 작성
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 space-y-4 shadow-lg shadow-black/40"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {selectedNotice && (
              <span className="text-xs text-gray-400">
                마지막 수정: {new Date(selectedNotice.updated_at).toLocaleString()}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-blue-500 focus:outline-none"
              placeholder="메인 공지 제목을 입력하세요"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              className="w-full min-h-[180px] px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-blue-500 focus:outline-none resize-y"
              placeholder="공지 내용을 입력하세요. 줄바꿈과 링크를 지원합니다."
            />
          </div>

          <div className="flex items-center justify-between bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-2">
            <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isPublished: e.target.checked }))
                }
                className="w-4 h-4 rounded border-zinc-600 text-blue-500 focus:ring-blue-400"
              />
              메인 페이지에 노출
            </label>
            <span className="text-xs text-gray-400">
              비공개로 저장하면 목록에만 유지됩니다.
            </span>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 rounded-lg transition-colors"
            >
              {submitting ? '저장 중...' : ctaLabel}
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/10 transition-colors"
              >
                취소
              </button>
            )}
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-2 text-xs text-gray-400 space-y-1">
            <p>• 줄바꿈은 자동으로 적용됩니다.</p>
            <p>• URL은 자동으로 링크로 변환됩니다.</p>
            <p>• 메인 페이지 카드에서 제목을 클릭하면 모달로 노출됩니다.</p>
          </div>
        </form>

        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 space-y-4 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">공지 목록</h2>
            <button
              onClick={fetchNotices}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-colors"
            >
              새로고침
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-10">불러오는 중...</div>
          ) : notices.length === 0 ? (
            <div className="text-center text-gray-400 py-10">등록된 공지가 없습니다.</div>
          ) : (
            <ul className="space-y-3">
              {notices.map((notice) => (
                <li
                  key={notice.id}
                  className={`rounded-xl border px-4 py-3 transition-colors ${
                    selectedId === notice.id
                      ? 'border-blue-500/40 bg-blue-500/10'
                      : 'border-white/10 bg-zinc-900/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(notice)}
                        className="text-left text-sm font-semibold text-white hover:text-blue-300"
                      >
                        {notice.title}
                      </button>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>
                          작성 {new Date(notice.created_at).toLocaleString()}
                        </span>
                        <span>·</span>
                        <span>
                          {notice.is_published ? '공개' : '비공개'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(notice)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                          notice.is_published
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-zinc-800 border-white/20 text-gray-300 hover:bg-zinc-700'
                        }`}
                      >
                        {notice.is_published ? '비공개' : '공개'}
                      </button>
                      <Link
                        href={`/api/site-notices/${notice.id}`}
                        target="_blank"
                        className="px-3 py-1 text-xs font-medium rounded-lg border border-white/20 text-gray-300 hover:bg-zinc-800"
                      >
                        JSON
                      </Link>
                      <button
                        onClick={() => handleDelete(notice)}
                        disabled={deletingId === notice.id}
                        className="px-3 py-1 text-xs font-medium rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                      >
                        {deletingId === notice.id ? '삭제 중...' : '삭제'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}













