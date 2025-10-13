'use client'

import { useEffect, useState } from 'react'

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

interface WarCorrespondent {
  id: number
  streamer_name: string
  chzzk_channel_url: string
  profile_image_url: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function BannersAdmin() {
  const [activeTab, setActiveTab] = useState<'banners' | 'correspondents'>('banners')
  
  // 배너 관리
  const [banners, setBanners] = useState<Banner[]>([])
  const [bannersLoading, setBannersLoading] = useState(true)
  const [bannersError, setBannersError] = useState('')
  
  // 종군기자 관리
  const [correspondents, setCorrespondents] = useState<WarCorrespondent[]>([])
  const [correspondentsLoading, setCorrespondentsLoading] = useState(true)
  const [showAddCorrespondentForm, setShowAddCorrespondentForm] = useState(false)
  const [newCorrespondent, setNewCorrespondent] = useState({
    streamer_name: '',
    chzzk_channel_url: '',
    profile_image_url: '',
    description: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchBanners()
    fetchCorrespondents()
  }, [])

  // 배너 함수들
  const fetchBanners = async () => {
    try {
      setBannersLoading(true)
      const response = await fetch('/api/admin/banners')
      if (!response.ok) throw new Error('배너를 불러올 수 없습니다')
      const data = await response.json()
      setBanners(data)
    } catch (err) {
      setBannersError(err instanceof Error ? err.message : '알 수 없는 오류')
    } finally {
      setBannersLoading(false)
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

  // 종군기자 함수들
  const fetchCorrespondents = async () => {
    try {
      const response = await fetch('/api/admin/war-correspondents')
      if (response.ok) {
        const data = await response.json()
        setCorrespondents(data)
      }
    } catch (error) {
      console.error('종군기자 목록을 불러오는데 실패했습니다:', error)
    } finally {
      setCorrespondentsLoading(false)
    }
  }

  const handleAddCorrespondent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCorrespondent.streamer_name.trim() || !newCorrespondent.chzzk_channel_url.trim()) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/war-correspondents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCorrespondent),
      })

      if (response.ok) {
        setNewCorrespondent({
          streamer_name: '',
          chzzk_channel_url: '',
          profile_image_url: '',
          description: '',
        })
        setShowAddCorrespondentForm(false)
        fetchCorrespondents()
        alert('종군기자가 성공적으로 추가되었습니다!')
      } else {
        const errorData = await response.json()
        alert(`종군기자 추가 실패: ${errorData.error}`)
      }
    } catch (error) {
      console.error('종군기자 추가 중 오류:', error)
      alert('종군기자 추가 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleCorrespondentActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/war-correspondents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (response.ok) {
        fetchCorrespondents()
      } else {
        alert('상태 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('상태 변경 중 오류:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteCorrespondent = async (id: number) => {
    if (!confirm('정말 이 종군기자를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/war-correspondents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCorrespondents()
        alert('종군기자가 삭제되었습니다.')
      } else {
        alert('종군기자 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('종군기자 삭제 중 오류:', error)
      alert('종군기자 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎨</span>
          </div>
          <h1 className="text-3xl font-bold text-white">배너 & 종군기자 관리</h1>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-2 bg-slate-700/40 p-1.5 rounded-xl border border-white/10">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'banners'
              ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          🎨 배너 관리
        </button>
        <button
          onClick={() => setActiveTab('correspondents')}
          className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'correspondents'
              ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          📺 종군기자
        </button>
      </div>

      {/* 배너 관리 탭 */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">배너 목록</h2>
              <Link href="/admin/banners/new">
                <button className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
                  + 새 배너 추가
                </button>
              </Link>
            </div>

            {bannersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-6 h-6 border-3 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">배너 목록을 불러오는 중...</span>
                </div>
              </div>
            ) : bannersError ? (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h2 className="text-red-400 font-bold mb-2">⚠️ 오류 발생</h2>
                <p className="text-red-300">{bannersError}</p>
                <button 
                  onClick={fetchBanners}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="bg-slate-700/40 rounded-xl p-6 border border-white/10">
                    <div className="flex gap-6">
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-48 h-32 object-cover rounded-lg border border-white/20"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                            <p className="text-gray-400 mt-1">{banner.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              banner.is_active 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-600 text-gray-300'
                            }`}>
                              {banner.is_active ? '활성' : '비활성'}
                            </span>
                            <span className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
                              우선순위: {banner.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              banner.is_active
                                ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
                                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                            } text-white shadow-lg`}
                          >
                            {banner.is_active ? '비활성화' : '활성화'}
                          </button>
                          <Link href={`/admin/banners/${banner.id}/edit`}>
                            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg">
                              수정
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteBanner(banner.id)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 종군기자 관리 탭 */}
      {activeTab === 'correspondents' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">종군기자 관리</h2>
              <button
                onClick={() => setShowAddCorrespondentForm(!showAddCorrespondentForm)}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                {showAddCorrespondentForm ? '취소' : '+ 종군기자 추가'}
              </button>
            </div>

            {showAddCorrespondentForm && (
              <form onSubmit={handleAddCorrespondent} className="bg-slate-700/40 rounded-xl p-6 mb-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">스트리머 이름</label>
                    <input
                      type="text"
                      value={newCorrespondent.streamer_name}
                      onChange={(e) => setNewCorrespondent({...newCorrespondent, streamer_name: e.target.value})}
                      placeholder="스트리머 이름"
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-white/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">치지직 채널 URL</label>
                    <input
                      type="url"
                      value={newCorrespondent.chzzk_channel_url}
                      onChange={(e) => setNewCorrespondent({...newCorrespondent, chzzk_channel_url: e.target.value})}
                      placeholder="https://chzzk.naver.com/..."
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-white/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">프로필 이미지 URL</label>
                    <input
                      type="url"
                      value={newCorrespondent.profile_image_url}
                      onChange={(e) => setNewCorrespondent({...newCorrespondent, profile_image_url: e.target.value})}
                      placeholder="프로필 이미지 URL (선택사항)"
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
                    <input
                      type="text"
                      value={newCorrespondent.description}
                      onChange={(e) => setNewCorrespondent({...newCorrespondent, description: e.target.value})}
                      placeholder="스트리머 설명 (선택사항)"
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-white/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? '추가 중...' : '종군기자 추가'}
                  </button>
                </div>
              </form>
            )}

            {correspondentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-6 h-6 border-3 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">종군기자 목록을 불러오는 중...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {correspondents.map((correspondent) => (
                  <div key={correspondent.id} className="bg-slate-700/40 rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      {correspondent.profile_image_url && (
                        <img
                          src={correspondent.profile_image_url}
                          alt={correspondent.streamer_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-white">{correspondent.streamer_name}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            correspondent.is_active 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {correspondent.is_active ? '활성' : '비활성'}
                          </span>
                        </div>
                        {correspondent.description && (
                          <p className="text-gray-300 text-sm mb-2">{correspondent.description}</p>
                        )}
                        <a
                          href={correspondent.chzzk_channel_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          채널 보기 →
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleToggleCorrespondentActive(correspondent.id, correspondent.is_active)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                          correspondent.is_active
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                        } text-white shadow-lg`}
                      >
                        {correspondent.is_active ? '비활성화' : '활성화'}
                      </button>
                      <button
                        onClick={() => handleDeleteCorrespondent(correspondent.id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

