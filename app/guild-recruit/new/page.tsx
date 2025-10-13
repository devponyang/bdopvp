'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'

export default function NewRecruitPage() {
  const [formData, setFormData] = useState({
    guild_name: '',
    title: '',
    content: '',
    requirements: '',
    contact_info: '',
    author: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 필수 필드 검증
    if (!formData.guild_name.trim() || !formData.title.trim() || !formData.content.trim() || !formData.author.trim() || !formData.password.trim()) {
      setError('필수 항목을 모두 입력해주세요.')
      setLoading(false)
      return
    }

    // 비밀번호 길이 검증
    if (formData.password.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/guild-recruit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/guild-recruit')
      } else {
        const errorData = await response.json()
        setError(errorData.error || '모집 글 작성에 실패했습니다.')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }


  return (
    <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
      {/* 헤더 */}
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg flex items-center gap-3">
            <span className="text-4xl">📝</span> 길드 모집 글 작성
          </h1>
          <p className="text-slate-300 text-lg">새로운 길드원을 모집해보세요!</p>
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

          {/* 기본 정보 */}
          <div>
            <label className="block text-base font-semibold text-white mb-3">
              길드명 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="guild_name"
              value={formData.guild_name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="길드명을 입력하세요"
              required
            />
          </div>

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
            
            <div className="mt-3 text-sm text-gray-400 bg-slate-700/30 rounded-lg p-3 space-y-1">
              <div>💡 <strong>서식:</strong> 툴바 버튼을 사용하거나 Ctrl+B(굵게), Ctrl+I(기울임), Ctrl+U(밑줄) 단축키 사용</div>
              <div>📷 <strong>이미지:</strong> 툴바의 '📷 이미지' 버튼을 클릭해서 업로드하세요</div>
            </div>
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

          {/* 연락처 및 작성자 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-base font-semibold text-white mb-3">
                작성자 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="작성자 닉네임"
                required
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-base font-semibold text-white mb-3">
              비밀번호 <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="수정/삭제 시 사용할 비밀번호 (최소 4자)"
              required
              minLength={4}
            />
            <p className="mt-2 text-sm text-gray-400 flex items-center gap-2">
              <span>🔒</span>
              <span>글 수정 및 삭제 시 필요한 비밀번호입니다. 잊지 않도록 주의하세요!</span>
            </p>
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
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? '작성 중...' : '모집 글 등록'}
            </button>
          </div>
        </form>
      </div>

      {/* 작성 가이드 */}
      <div className="mt-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/30 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-2xl">✍️</span> 작성 가이드
        </h3>
        <div className="text-gray-300 space-y-3">
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>길드명:</strong> 정확한 길드명을 입력해주세요.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>모집 내용:</strong> 길드의 특징, 활동 내용, 분위기를 상세히 작성하면 좋은 길드원을 만날 확률이 높아집니다.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>모집 조건:</strong> 레벨 제한, 접속 시간, 필수 조건 등을 명확히 적어주세요.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>연락처:</strong> 게임 내 닉네임이나 디스코드 등 연락 가능한 방법을 적어주세요.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>비밀번호:</strong> 나중에 글을 수정하거나 삭제할 때 필요하니 반드시 기억해주세요.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
