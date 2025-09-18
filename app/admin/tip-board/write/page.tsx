"use client"
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminTipWritePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [isNotice, setIsNotice] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!document.cookie.includes('isAdmin=true')) {
      router.replace('/admin/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tip-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          is_notice: isNotice,
          author,
        })
      })
      if (!res.ok) throw new Error('등록 실패')
      router.push('/admin/tip-board')
    } catch (err: any) {
      setError(err.message || '오류 발생')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      const { url } = await res.json()
      setContent(content + `\n<img src=\"${url}\" alt=\"업로드 이미지\" />`)
    } else {
      alert('이미지 업로드 실패')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">팁 게시판 글쓰기 (운영자)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">제목</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">작성자</label>
          <input value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">내용 (HTML 가능)</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white min-h-[120px]" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">이미지 업로드</label>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <div className="text-xs text-gray-400 mt-1">업로드 후 본문에 이미지 태그가 자동 삽입됩니다.</div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isNotice" checked={isNotice} onChange={e => setIsNotice(e.target.checked)} />
          <label htmlFor="isNotice" className="font-semibold">공지로 등록</label>
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </div>
  )
} 