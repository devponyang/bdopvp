'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'

interface RecruitPost {
  id: number
  guild_name: string
  title: string
  content: string
  requirements: string
  contact_info: string
  author: string
  is_active: boolean
}

export default function EditRecruitPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    requirements: '',
    contact_info: '',
    is_active: true
  })
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      // sessionStorage에서 비밀번호 가져오기
      const savedPassword = sessionStorage.getItem(`edit_token_${id}`)
      
      if (!savedPassword) {
        setError('권한이 없습니다. 다시 시도해주세요.')
        setLoading(false)
        setTimeout(() => {
          router.push(`/guild-recruit/${id}`)
        }, 2000)
        return
      }

      setPassword(savedPassword)

      try {
        // 글 데이터 가져오기
        const response = await fetch(`/api/guild-recruit/${id}`)
        if (!response.ok) {
          setError('모집 글을 찾을 수 없습니다.')
          return
        }

        const post: RecruitPost = await response.json()
        
        setFormData({
          title: post.title,
          content: post.content,
          requirements: post.requirements || '',
          contact_info: post.contact_info || '',
          is_active: post.is_active
        })
      } catch (error) {
        setError('데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // 컴포넌트 언마운트 시 토큰 삭제
    return () => {
      sessionStorage.removeItem(`edit_token_${id}`)
    }
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('필수 항목을 모두 입력해주세요.')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/guild-recruit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          password
        }),
      })

      if (response.ok) {
        alert('모집 글이 수정되었습니다.')
        router.push(`/guild-recruit/${id}`)
      } else {
        const data = await response.json()
        setError(data.error || '수정에 실패했습니다.')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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

  if (error && !formData.title) {
    return (
      <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-8 text-center">
          <div className="text-red-400 text-lg mb-6">{error}</div>
          <button
            onClick={() => router.push(`/guild-recruit/${id}`)}
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
      {/* 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-8">
        <div 
          className="absolute inset-0 bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/ponyang/rec.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 43%"
          }}
        />
        
        <div className="relative p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg flex items-center gap-3">
            <span className="text-4xl">✏️</span> 길드 모집 글 수정
          </h1>
          <p className="text-slate-300 text-lg">모집 내용을 수정하세요.</p>
        </div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/40 rounded-xl p-4 text-red-300 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* 제목 */}
          <div>
            <label className="block text-base font-semibold text-white mb-3">
              모집 제목 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="예: 신규/복귀 길드원 모집합니다!"
              required
            />
          </div>

          {/* 모집 내용 */}
          <div>
            <label className="block text-base font-semibold text-white mb-3">
              모집 내용 <span className="text-red-400">*</span>
            </label>
            
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="길드 소개, 활동 내용, 분위기 등을 자세히 적어주세요."
            />
          </div>

          {/* 모집 조건 */}
          <div>
            <label className="block text-base font-semibold text-white mb-3">
              모집 조건
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
              placeholder="예: 레벨 제한, 접속 시간, 디스코드 필수 등"
            />
          </div>

          {/* 연락처 */}
          <div>
            <label className="block text-base font-semibold text-white mb-3">
              연락처
            </label>
            <input
              type="text"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="게임 내 닉네임, 디스코드 등"
            />
          </div>

          {/* 모집 상태 */}
          <div>
            <label className="block text-base font-semibold text-white mb-3">
              모집 상태
            </label>
            <select
              name="is_active"
              value={formData.is_active.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="true">모집중</option>
              <option value="false">모집완료</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 bg-gradient-to-r from-zinc-700 via-zinc-800 to-gray-800 hover:from-zinc-600 hover:via-zinc-700 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

