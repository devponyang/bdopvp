"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CLASS_EMOJIS, getCategoryFromTags, getClassFromTags } from '@/lib/constants/tip-categories'

interface TipPost {
  id: number
  title: string
  tags: string[]
  author?: string
  created_at: string
  is_new?: boolean
  is_updated?: boolean
  priority?: number
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

  const handleToggleFlag = async (id: number, flag: 'is_new' | 'is_updated', currentValue: boolean) => {
    try {
      const res = await fetch(`/api/tip-board/${id}/flags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [flag]: !currentValue })
      })
      if (!res.ok) throw new Error('플래그 업데이트 실패')
      
      setPosts(posts.map(p => 
        p.id === id ? { ...p, [flag]: !currentValue } : p
      ))
    } catch (err: any) {
      alert(err.message || '오류 발생')
    }
  }

  const handlePriorityUp = async (id: number) => {
    try {
      const res = await fetch(`/api/tip-board/${id}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'up' })
      })
      if (!res.ok) throw new Error('우선순위 업데이트 실패')
      
      // 목록 새로고침
      fetchPosts()
    } catch (err: any) {
      alert(err.message || '오류 발생')
    }
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💡</span>
            </div>
            <h1 className="text-3xl font-bold text-white">팁 게시판 관리</h1>
          </div>
          <Button
            onClick={() => router.push('/admin/tip-board/write')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            ✏️ 글쓰기
          </Button>
        </div>
      </div>

      {/* 게시글 목록 */}
      {loading ? (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            <div className="text-gray-400">로딩 중...</div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-400 text-lg">등록된 팁 게시글이 없습니다.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id} className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-white mb-3">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-medium">
                      {getCategoryFromTags(post.tags || [])}
                    </span>
                    {getClassFromTags(post.tags || []) && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium flex items-center gap-1">
                        <span>{CLASS_EMOJIS[getClassFromTags(post.tags || [])!]}</span>
                        <span>{getClassFromTags(post.tags || [])}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span>👤</span>
                      <span>{post.author || '익명'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 ml-6">
                  {/* 플래그 체크박스들 */}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={post.is_new || false}
                        onChange={() => handleToggleFlag(post.id, 'is_new', post.is_new || false)}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-green-400 font-medium">NEW</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={post.is_updated || false}
                        onChange={() => handleToggleFlag(post.id, 'is_updated', post.is_updated || false)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-blue-400 font-medium">UPDATE</span>
                    </label>
                  </div>
                  
                  {/* 액션 버튼들 */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePriorityUp(post.id)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-3 py-1 rounded-lg shadow-lg transition-all text-sm"
                    >
                      ⬆️ 끌어올리기
                    </Button>
                    <Button
                      onClick={() => router.push(`/admin/tip-board/${post.id}/edit`)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow-lg transition-all text-sm"
                    >
                      ✏️ 수정
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-3 py-1 rounded-lg shadow-lg transition-all text-sm"
                    >
                      🗑️ 삭제
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 