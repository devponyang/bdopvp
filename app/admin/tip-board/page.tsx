"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CLASS_EMOJIS, getCategoryFromTags, getClassFromTags } from '@/lib/constants/tip-categories'

interface TipPost {
  id: number
  title: string
  tags: string[]
  author?: string
  created_at: string
}

export default function AdminTipBoardManagePage() {
  const [posts, setPosts] = useState<TipPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!document.cookie.includes('isAdmin=true')) {
      router.replace('/admin/login')
    }
  }, [router])

  const fetchPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tip-board')
      if (!res.ok) throw new Error('불러오기 실패')
      setPosts(await res.json())
    } catch (err: any) {
      setError(err.message || '오류 발생')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      const res = await fetch(`/api/tip-board/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('삭제 실패')
      setPosts(posts.filter(p => p.id !== id))
    } catch (err: any) {
      alert(err.message || '오류 발생')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">팁 게시글 관리</h1>
        <a href="/admin/tip-board/write" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold">+ 글쓰기</a>
      </div>
      {loading ? (
        <div className="text-gray-400">불러오는 중...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-400">등록된 팁이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-blue-300 text-sm">
                <th className="w-2/5 px-2">제목</th>
                <th className="w-1/5 px-2">카테고리</th>
                <th className="w-1/6 px-2">작성자</th>
                <th className="w-1/6 px-2">작성일</th>
                <th className="w-1/6 px-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="bg-zinc-800 hover:bg-zinc-700 transition border-b border-zinc-700">
                  <td className="px-2 py-2 font-semibold text-blue-200 truncate">{post.title}</td>
                  <td className="px-2 py-2 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">
                        {getCategoryFromTags(post.tags || [])}
                      </span>
                      {getClassFromTags(post.tags || []) && (
                        <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs flex items-center gap-1">
                          <span>{CLASS_EMOJIS[getClassFromTags(post.tags || [])!]}</span>
                          <span>{getClassFromTags(post.tags || [])}</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-300">{post.author || '-'}</td>
                  <td className="px-2 py-2 text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('ko-KR')}</td>
                  <td className="px-2 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/tip-board/${post.id}/edit`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm font-semibold"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-semibold"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 