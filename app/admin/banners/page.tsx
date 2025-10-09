'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Banner {
  id: number
  title: string
  description: string
  image_url: string
  link_url: string
  button_text: string
  is_active: boolean
  priority: number
  created_at: string
  updated_at: string
}

export default function AdminBanners() {
  const router = useRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/banners')
      if (!response.ok) throw new Error('배너를 불러올 수 없습니다')
      const data = await response.json()
      setBanners(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }

  const toggleBannerStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      })
      
      if (!response.ok) throw new Error('상태 변경에 실패했습니다')
      
      // 로컬 상태 업데이트
      setBanners(prev => prev.map(banner => 
        banner.id === id ? { ...banner, is_active: !isActive } : banner
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : '알 수 없는 오류')
    }
  }

  const deleteBanner = async (id: number) => {
    if (!confirm('정말로 이 배너를 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('삭제에 실패했습니다')
      
      setBanners(prev => prev.filter(banner => banner.id !== id))
      alert('배너가 삭제되었습니다')
    } catch (err) {
      alert(err instanceof Error ? err.message : '알 수 없는 오류')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          배너 목록을 불러오는 중...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <h2 className="text-red-400 font-bold mb-2">⚠️ 오류 발생</h2>
        <p className="text-red-300">{error}</p>
        <button 
          onClick={fetchBanners}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-200">🎨 배너 관리</h1>
          <p className="text-gray-400 mt-1">홈페이지 메인 배너를 관리합니다</p>
        </div>
        <Link 
          href="/admin/banners/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          새 배너 추가
        </Link>
      </div>

      {/* 배너 목록 */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
        {banners.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">배너가 없습니다</h3>
            <p>첫 번째 배너를 추가해보세요!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-300">이미지</th>
                  <th className="text-left p-4 font-semibold text-gray-300">제목</th>
                  <th className="text-left p-4 font-semibold text-gray-300">설명</th>
                  <th className="text-left p-4 font-semibold text-gray-300">링크</th>
                  <th className="text-left p-4 font-semibold text-gray-300">우선순위</th>
                  <th className="text-left p-4 font-semibold text-gray-300">상태</th>
                  <th className="text-left p-4 font-semibold text-gray-300">작업</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-zinc-700 hover:bg-zinc-800/50">
                    <td className="p-4">
                      {banner.image_url ? (
                        <img 
                          src={banner.image_url} 
                          alt={banner.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
                          이미지 없음
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{banner.title}</td>
                    <td className="p-4 text-gray-400 max-w-xs truncate">{banner.description}</td>
                    <td className="p-4">
                      <a 
                        href={banner.link_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline truncate block max-w-xs"
                      >
                        {banner.link_url}
                      </a>
                    </td>
                    <td className="p-4">
                      <span className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                        {banner.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          banner.is_active 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {banner.is_active ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/banners/${banner.id}/edit`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
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

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
          <div className="text-2xl font-bold text-blue-400">{banners.length}</div>
          <div className="text-sm text-gray-400">전체 배너</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
          <div className="text-2xl font-bold text-green-400">
            {banners.filter(b => b.is_active).length}
          </div>
          <div className="text-sm text-gray-400">활성 배너</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
          <div className="text-2xl font-bold text-yellow-400">
            {banners.filter(b => !b.is_active).length}
          </div>
          <div className="text-sm text-gray-400">비활성 배너</div>
        </div>
      </div>
    </div>
  )
}











































