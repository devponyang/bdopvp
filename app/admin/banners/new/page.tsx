'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BannerFormData {
  title: string
  description: string
  image_url: string
  link_url: string
  button_text: string
  is_active: boolean
  priority: number
  banner_type: string
  position: string
}

export default function NewBanner() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    button_text: '',
    is_active: true,
    priority: 1,
    banner_type: 'main',
    position: 'home'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const isFormValid = () => formData.image_url.trim() !== ''

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB를 초과할 수 없습니다')
      return
    }

    setUploading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folderType', 'banner-images')

      const response = await fetch('/api/upload', { method: 'POST', body: fd })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '업로드에 실패했습니다')
      }

      const result = await response.json()
      setFormData(prev => ({ ...prev, image_url: result.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.image_url,
          linkUrl: formData.link_url,
          buttonText: formData.button_text,
          isActive: formData.is_active,
          priority: formData.priority,
          bannerType: formData.banner_type,
          position: formData.position
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '배너 생성에 실패했습니다')
      }

      router.push('/admin/banners')
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">새 배너 추가</h1>
              <p className="text-sm text-gray-400 mt-0.5">홈페이지에 표시될 새로운 배너를 추가합니다</p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
          >
            ← 뒤로가기
          </button>
        </div>
      </div>

      {/* 배너 미리보기 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">배너 미리보기</h2>
        <div className="relative w-full h-32 md:h-40 rounded-xl overflow-hidden bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80">
          {formData.image_url && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${formData.image_url})` }}
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-20 h-full flex items-center px-6">
            <div className="max-w-2xl">
              <h1 className="text-lg md:text-xl font-bold text-white mb-1">
                {formData.title || '배너 제목'}
              </h1>
              <p className="text-xs md:text-sm text-gray-200 mb-2">
                {formData.description || '배너 설명을 입력하세요'}
              </p>
              <button className="bg-yellow-500 text-black font-semibold px-4 py-1.5 text-sm rounded-lg">
                {formData.button_text || '버튼 텍스트'} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 배너 생성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4">배너 정보</h2>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">
              ❌ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 이미지 업로드 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">배너 이미지 *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-600 file:text-white hover:file:bg-pink-700 file:cursor-pointer disabled:opacity-50"
              />
              {uploading && (
                <div className="flex items-center gap-2 mt-2 text-blue-400 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  업로드 중...
                </div>
              )}
              {formData.image_url && !uploading && (
                <p className="text-xs text-emerald-400 mt-1.5">✅ 이미지가 업로드되었습니다</p>
              )}
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="또는 이미지 URL 직접 입력"
                className="mt-2 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 링크 URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">링크 URL</label>
              <input
                type="text"
                name="link_url"
                value={formData.link_url}
                onChange={handleInputChange}
                placeholder="예: /support 또는 https://example.com"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 버튼 텍스트 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">버튼 텍스트</label>
              <input
                type="text"
                name="button_text"
                value={formData.button_text}
                onChange={handleInputChange}
                placeholder="예: 둘러보기"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 우선순위 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">우선순위</label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleNumberChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
              />
              <p className="text-xs text-gray-500 mt-1">숫자가 작을수록 먼저 표시됩니다</p>
            </div>

            {/* 제목 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">배너 제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="예: 🎮 검은사막 정보 포털"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 설명 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">배너 설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="예: 길드 리그, 솔라레의 창, 거점전 정보를 한 곳에서!"
                rows={3}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 배너 타입 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">배너 타입</label>
              <select
                name="banner_type"
                value={formData.banner_type}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="main">메인 배너 (홈페이지 상단)</option>
                <option value="sidebar">사이드바 배너 (300x250)</option>
                <option value="card">카드형 배너 (400x200)</option>
                <option value="inline">인라인 배너</option>
              </select>
            </div>

            {/* 배너 위치 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">배너 위치</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="home">홈페이지</option>
                <option value="home-right">홈페이지 (우측)</option>
                <option value="guild">길드 페이지</option>
                <option value="solare">솔라레 페이지</option>
                <option value="war-records">거점전 페이지</option>
                <option value="all">모든 페이지</option>
              </select>
            </div>

            {/* 활성 상태 */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-pink-600 bg-slate-700/50 border-slate-600 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-300">
                  배너 활성화 (체크 해제 시 표시되지 않음)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                배너 생성 중...
              </>
            ) : '배너 생성하기'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 rounded-xl font-medium transition-colors border border-white/10"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
