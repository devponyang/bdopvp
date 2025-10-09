'use client'

import { useState } from 'react'
import { Card } from '@/components/card'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'

export default function NewRecruitPage() {
  const [formData, setFormData] = useState({
    guild_name: '',
    title: '',
    content: '',
    requirements: '',
    contact_info: '',
    author: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 필수 필드 검증
    if (!formData.guild_name.trim() || !formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError('필수 항목을 모두 입력해주세요.')
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📝 길드 모집 글 작성</h1>
        <p className="text-gray-400">새로운 길드원을 모집해보세요!</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {/* 기본 정보 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              길드명 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="guild_name"
              value={formData.guild_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="길드명을 입력하세요"
              required
            />
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              모집 제목 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 신규/복귀 길드원 모집합니다!"
              required
            />
          </div>

          {/* 모집 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              모집 내용 <span className="text-red-400">*</span>
            </label>
            
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="길드 소개, 활동 내용, 분위기 등을 자세히 적어주세요."
            />
            
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <div>💡 <strong>서식:</strong> 툴바 버튼을 사용하거나 Ctrl+B(굵게), Ctrl+I(기울임), Ctrl+U(밑줄) 단축키 사용</div>
              <div>📷 <strong>이미지:</strong> 툴바의 '📷 이미지' 버튼을 클릭해서 업로드하세요</div>
            </div>
          </div>

          {/* 모집 조건 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              모집 조건
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="예: 레벨 제한, 접속 시간, 디스코드 필수 등"
            />
          </div>

          {/* 연락처 및 작성자 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                연락처
              </label>
              <input
                type="text"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="게임 내 닉네임, 디스코드 등"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                작성자 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="작성자 닉네임"
                required
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '작성 중...' : '모집 글 등록'}
            </button>
          </div>
        </form>
      </Card>

      {/* 작성 가이드 */}
      <Card className="mt-6 p-6 bg-slate-800/30">
        <h3 className="text-lg font-semibold text-white mb-3">✍️ 작성 가이드</h3>
        <div className="text-sm text-gray-400 space-y-2">
          <p>• <strong>길드명:</strong> 정확한 길드명을 입력해주세요.</p>
          <p>• <strong>모집 내용:</strong> 길드의 특징, 활동 내용, 분위기를 상세히 작성하면 좋은 길드원을 만날 확률이 높아집니다.</p>
          <p>• <strong>모집 조건:</strong> 레벨 제한, 접속 시간, 필수 조건 등을 명확히 적어주세요.</p>
          <p>• <strong>연락처:</strong> 게임 내 닉네임이나 디스코드 등 연락 가능한 방법을 적어주세요.</p>
        </div>
      </Card>
    </div>
  )
}
