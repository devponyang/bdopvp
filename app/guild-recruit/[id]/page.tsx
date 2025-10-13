'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { renderMarkdown } from '@/lib/markdown'
import ClickableContent from '@/components/ClickableContent'

interface RecruitPost {
  id: number
  guild_name: string
  title: string
  content: string
  requirements: string
  contact_info: string
  author: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function RecruitDetailPage() {
  const [post, setPost] = useState<RecruitPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState<'edit' | 'delete' | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [processing, setProcessing] = useState(false)
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/guild-recruit/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        setError('모집 글을 찾을 수 없습니다.')
      }
    } catch (error) {
      setError('모집 글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatContent = (content: string) => {
    return renderMarkdown(content)
  }

  const handleDelete = async () => {
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.')
      return
    }

    setProcessing(true)
    setPasswordError('')

    try {
      const response = await fetch(`/api/guild-recruit/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        alert('모집 글이 삭제되었습니다.')
        router.push('/guild-recruit')
      } else {
        const data = await response.json()
        setPasswordError(data.error || '삭제에 실패했습니다.')
      }
    } catch (error) {
      setPasswordError('네트워크 오류가 발생했습니다.')
    } finally {
      setProcessing(false)
    }
  }

  const handleEdit = async () => {
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.')
      return
    }

    setProcessing(true)
    setPasswordError('')

    try {
      // 비밀번호 검증
      const response = await fetch(`/api/guild-recruit/${id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        // 검증 성공 시 세션 스토리지에 임시 토큰 저장
        sessionStorage.setItem(`edit_token_${id}`, password)
        router.push(`/guild-recruit/${id}/edit`)
      } else {
        const data = await response.json()
        setPasswordError(data.error || '비밀번호가 일치하지 않습니다.')
      }
    } catch (error) {
      setPasswordError('네트워크 오류가 발생했습니다.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
        <div className="text-center py-12">
          <div className="text-gray-400">불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-8 text-center">
          <div className="text-red-400 text-lg mb-6">{error}</div>
          <button
            onClick={() => router.push('/guild-recruit')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/guild-recruit')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-zinc-800/60 to-zinc-700/60 hover:from-zinc-700/70 hover:to-zinc-600/70 text-blue-400 hover:text-blue-300 rounded-xl transition-all duration-300 border border-zinc-600/40 hover:border-zinc-500/60 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      {/* 헤더 - 배경 이미지와 함께 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-8">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/ponyang/rec.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 43%"
          }}
        />
        
        {/* 콘텐츠 */}
        <div className="relative p-8">
          {/* 모집 상태 뱃지 */}
          <div className="flex items-center gap-3 mb-6">
            {post.is_active ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 rounded-xl border border-green-500/40 font-semibold shadow-lg">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                모집중
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600/30 to-gray-700/30 text-gray-400 rounded-xl border border-gray-600/40 font-semibold">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                모집완료
              </span>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
            {post.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-600/30">
              <span className="text-gray-400">길드:</span>
              <Link 
                href={`/guild/${encodeURIComponent(post.guild_name)}`}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {post.guild_name}
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-600/30">
              <span className="text-gray-400">작성자:</span>
              <span className="text-blue-400 font-semibold">{post.author}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-600/30">
              <span className="text-gray-400">작성일:</span>
              <span className="text-gray-300">{formatDate(post.created_at)}</span>
            </div>
            {post.updated_at !== post.created_at && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-600/30">
                <span className="text-gray-400">수정일:</span>
                <span className="text-gray-300">{formatDate(post.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모집 내용 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-6 shadow-xl border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3 text-3xl">📋</span> 모집 내용
        </h2>
        <ClickableContent 
          content={formatContent(post.content)}
          className="text-slate-200 text-lg leading-relaxed"
        />
      </div>

      {/* 모집 조건 */}
      {post.requirements && (
        <div className="bg-slate-800 p-8 rounded-2xl mb-6 shadow-xl border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 모집 조건
          </h2>
          <ClickableContent 
            content={formatContent(post.requirements)}
            className="text-slate-200 text-lg leading-relaxed"
          />
        </div>
      )}

      {/* 연락처 */}
      {post.contact_info && (
        <div className="bg-slate-800 p-8 rounded-2xl mb-6 shadow-xl border-l-4 border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3 text-3xl">📞</span> 연락처
          </h2>
          <div className="bg-slate-700/50 p-6 rounded-xl">
            <p className="text-slate-200 text-lg font-semibold">
              {post.contact_info}
            </p>
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/30 shadow-lg mb-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-3 text-2xl">💡</span> 지원 안내
        </h3>
        <div className="text-gray-300 space-y-3">
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span>위 연락처로 직접 연락하여 지원해주세요.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span>길드 가입 전 길드 규칙이나 활동 내용을 충분히 확인해보세요.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span>허위 정보나 스팸성 연락은 피해주세요.</span>
          </p>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => router.push('/guild-recruit')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-blue-500/30 hover:border-blue-400/50"
        >
          📝 다른 모집 글 보기
        </button>
        <button
          onClick={() => setShowPasswordModal('edit')}
          className="px-8 py-3 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-500 hover:via-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-green-500/30 hover:border-green-400/50"
        >
          ✏️ 수정하기
        </button>
        <button
          onClick={() => setShowPasswordModal('delete')}
          className="px-8 py-3 bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-500 hover:via-red-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-red-500/30 hover:border-red-400/50"
        >
          🗑️ 삭제하기
        </button>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-3 bg-gradient-to-r from-zinc-700 via-zinc-800 to-gray-800 hover:from-zinc-600 hover:via-zinc-700 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-zinc-600/30 hover:border-zinc-500/50"
        >
          ⬆️ 맨 위로
        </button>
      </div>

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {showPasswordModal === 'delete' ? '🗑️ 글 삭제' : '✏️ 글 수정'}
            </h3>
            <p className="text-gray-300 mb-4">
              {showPasswordModal === 'delete' 
                ? '글을 삭제하려면 비밀번호를 입력해주세요.' 
                : '글을 수정하려면 비밀번호를 입력해주세요.'}
            </p>
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  showPasswordModal === 'delete' ? handleDelete() : handleEdit()
                }
              }}
            />

            {passwordError && (
              <div className="mb-4 text-red-400 text-sm">{passwordError}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(null)
                  setPassword('')
                  setPasswordError('')
                }}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={showPasswordModal === 'delete' ? handleDelete : handleEdit}
                disabled={processing}
                className={`flex-1 px-4 py-2 ${showPasswordModal === 'delete' ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'} text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing ? '처리 중...' : showPasswordModal === 'delete' ? '삭제' : '수정'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
