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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 1
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다')
      return
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB를 초과할 수 없습니다')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '업로드에 실패했습니다')
      }

      const result = await response.json()
      setFormData(prev => ({
        ...prev,
        image_url: result.url
      }))
      
      alert('이미지가 성공적으로 업로드되었습니다!')
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
        headers: {
          'Content-Type': 'application/json',
        },
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

      await response.json()
      alert('배너가 성공적으로 생성되었습니다!')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-200">➕ 새 배너 추가</h1>
          <p className="text-gray-400 mt-1">홈페이지에 표시될 새로운 배너를 추가합니다</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ← 뒤로가기
        </button>
      </div>

      {/* 배너 미리보기 */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-blue-300">📱 배너 미리보기</h2>
        <div className="relative w-full h-32 md:h-40 lg:h-48">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80">
            {formData.image_url && (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${formData.image_url})` }}
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-20 h-full flex items-center px-4 md:px-6 lg:px-8">
              <div className="max-w-2xl ml-4 md:ml-6 lg:ml-8">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">
                  {formData.title || '배너 제목'}
                </h1>
                <p className="text-xs md:text-sm lg:text-base text-gray-200 mb-2 md:mb-3 max-w-lg">
                  {formData.description || '배너 설명을 입력하세요'}
                </p>
                <button className="bg-yellow-500 text-black font-semibold px-4 py-2 text-sm rounded-lg shadow-lg">
                  {formData.button_text || '버튼 텍스트'} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 배너 생성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-xl font-bold mb-4 text-blue-300">📝 배너 정보</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 제목 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                배너 제목 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="예: 🎮 검은사막 정보 포털"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 설명 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                배너 설명 *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="예: 길드 리그, 솔라레의 창, 거점전 정보를 한 곳에서!"
                rows={3}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                배너 이미지 *
              </label>
              
              {/* 파일 업로드 */}
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
                />
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    업로드 중...
                  </div>
                )}
              </div>

              {/* 수동 URL 입력 */}
              <div className="relative">
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="또는 이미지 URL을 직접 입력하세요 (예: /logo.png, https://example.com/image.jpg)"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">이미지 미리보기:</p>
                    <img 
                      src={formData.image_url} 
                      alt="미리보기" 
                      className="w-32 h-20 object-cover rounded border border-zinc-600"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 배너 사이즈 가이드라인 */}
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-300 mb-2">📐 권장 배너 사이즈</h4>
                {formData.banner_type === 'main' && (
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>• <strong>최적 비율:</strong> 16:9 또는 3:1 (가로가 긴 형태)</li>
                    <li>• <strong>권장 해상도:</strong> 1200x400px ~ 1920x640px</li>
                    <li>• <strong>최소 크기:</strong> 800x267px</li>
                    <li>• <strong>파일 형식:</strong> JPG, PNG, WebP</li>
                    <li>• <strong>파일 크기:</strong> 5MB 이하</li>
                  </ul>
                )}
                {formData.banner_type === 'sidebar' && (
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>• <strong>최적 비율:</strong> 6:5 (300x250px)</li>
                    <li>• <strong>권장 해상도:</strong> 300x250px ~ 600x500px</li>
                    <li>• <strong>최소 크기:</strong> 300x250px</li>
                    <li>• <strong>파일 형식:</strong> JPG, PNG, WebP</li>
                    <li>• <strong>파일 크기:</strong> 3MB 이하</li>
                  </ul>
                )}
                {formData.banner_type === 'card' && (
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>• <strong>최적 비율:</strong> 2:1 (400x200px)</li>
                    <li>• <strong>권장 해상도:</strong> 400x200px ~ 800x400px</li>
                    <li>• <strong>최소 크기:</strong> 400x200px</li>
                    <li>• <strong>파일 형식:</strong> JPG, PNG, WebP</li>
                    <li>• <strong>파일 크기:</strong> 3MB 이하</li>
                  </ul>
                )}
                {formData.banner_type === 'inline' && (
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>• <strong>최적 비율:</strong> 16:9 또는 3:1</li>
                    <li>• <strong>권장 해상도:</strong> 800x267px ~ 1200x400px</li>
                    <li>• <strong>최소 크기:</strong> 600x200px</li>
                    <li>• <strong>파일 형식:</strong> JPG, PNG, WebP</li>
                    <li>• <strong>파일 크기:</strong> 3MB 이하</li>
                  </ul>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  💡 선택한 배너 타입에 맞는 사이즈로 제작해주세요.
                </p>
              </div>
            </div>

            {/* 링크 URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                링크 URL *
              </label>
              <input
                type="url"
                name="link_url"
                value={formData.link_url}
                onChange={handleInputChange}
                placeholder="예: /support 또는 https://example.com"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 버튼 텍스트 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                버튼 텍스트 *
              </label>
              <input
                type="text"
                name="button_text"
                value={formData.button_text}
                onChange={handleInputChange}
                placeholder="예: 둘러보기"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 배너 타입 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                배너 타입 *
              </label>
              <select
                name="banner_type"
                value={formData.banner_type}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="main">메인 배너 (홈페이지 상단)</option>
                <option value="sidebar">사이드바 배너 (300x250)</option>
                <option value="card">카드형 배너 (400x200)</option>
                <option value="inline">인라인 배너</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">배너가 표시될 위치와 형태를 선택하세요</p>
            </div>

            {/* 배너 위치 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                배너 위치 *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="home">홈페이지</option>
                <option value="home-right">홈페이지 (우측)</option>
                <option value="guild">길드 페이지</option>
                <option value="solare">솔라레 페이지</option>
                <option value="war-records">거점전 페이지</option>
                <option value="all">모든 페이지</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">배너가 표시될 페이지를 선택하세요</p>
            </div>

            {/* 우선순위 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                우선순위
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleNumberChange}
                min="1"
                max="100"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">숫자가 작을수록 먼저 표시됩니다</p>
            </div>

            {/* 활성 상태 */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-blue-600 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-300">
                  배너 활성화 (체크 해제하면 배너가 표시되지 않습니다)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                배너 생성 중...
              </>
            ) : (
              <>
                <span>➕</span>
                배너 생성하기
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
