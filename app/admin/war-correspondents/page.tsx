"use client"
import { useEffect, useState } from 'react'

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

export default function WarCorrespondentsAdmin() {
  const [correspondents, setCorrespondents] = useState<WarCorrespondent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCorrespondent, setNewCorrespondent] = useState({
    streamer_name: '',
    chzzk_channel_url: '',
    profile_image_url: '',
    description: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCorrespondents()
  }, [])

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
      setLoading(false)
    }
  }

  const handleAddCorrespondent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCorrespondent.streamer_name.trim() || !newCorrespondent.chzzk_channel_url.trim()) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/war-correspondents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCorrespondent),
      })

      if (response.ok) {
        setNewCorrespondent({
          streamer_name: '',
          chzzk_channel_url: '',
          profile_image_url: '',
          description: '',
        })
        setShowAddForm(false)
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

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/war-correspondents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
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

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 종군기자를 삭제하시겠습니까?')) return

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
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-200">📺 종군기자 관리</h1>
            <p className="text-gray-400 mt-2">거점/점령전 옵저버 스트리머를 관리합니다.</p>
          </div>
          <Link 
            href="/admin/dashboard"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← 대시보드로
          </Link>
        </div>
      </div>

      {/* 종군기자 추가 폼 */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-300">새 종군기자 추가</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {showAddForm ? '취소' : '+ 추가하기'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddCorrespondent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                스트리머명
              </label>
              <input
                type="text"
                value={newCorrespondent.streamer_name}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, streamer_name: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="스트리머명을 입력하세요"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                치지직 채널 URL
              </label>
              <input
                type="url"
                value={newCorrespondent.chzzk_channel_url}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, chzzk_channel_url: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="https://chzzk.naver.com/live/채널ID"
                required
                disabled={saving}
              />
              <p className="text-xs text-gray-400 mt-1">
                치지직 채널의 전체 URL을 입력하세요
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                프로필 이미지 URL (선택사항)
              </label>
              <input
                type="url"
                value={newCorrespondent.profile_image_url}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, profile_image_url: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="https://example.com/profile.jpg"
                disabled={saving}
              />
              <p className="text-xs text-gray-400 mt-1">
                스트리머 프로필 이미지 URL을 입력하세요
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                설명 (선택사항)
              </label>
              <textarea
                value={newCorrespondent.description}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="종군기자에 대한 설명을 입력하세요"
                rows={3}
                disabled={saving}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {saving ? '추가 중...' : '추가하기'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewCorrespondent({
                    streamer_name: '',
                    chzzk_channel_url: '',
                    profile_image_url: '',
                    description: '',
                  })
                  setShowAddForm(false)
                }}
                disabled={saving}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 종군기자 목록 */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-purple-300">종군기자 목록</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">로딩 중...</span>
          </div>
        ) : correspondents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            등록된 종군기자가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {correspondents.map((correspondent) => (
              <div key={correspondent.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {correspondent.profile_image_url && (
                      <img
                        src={correspondent.profile_image_url}
                        alt={`${correspondent.streamer_name} 프로필`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-zinc-600"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-purple-200">{correspondent.streamer_name}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        correspondent.is_active 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {correspondent.is_active ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(correspondent.id, correspondent.is_active)}
                      className={`px-3 py-1 text-sm rounded ${
                        correspondent.is_active 
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {correspondent.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleDelete(correspondent.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div>
                    <span className="font-medium">채널 URL:</span> 
                    <a 
                      href={correspondent.chzzk_channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 ml-1 break-all"
                    >
                      {correspondent.chzzk_channel_url}
                    </a>
                  </div>
                  {correspondent.description && (
                    <div>
                      <span className="font-medium">설명:</span> {correspondent.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 pt-2">
                    <div>등록일: {new Date(correspondent.created_at).toLocaleDateString('ko-KR')}</div>
                    <div>수정일: {new Date(correspondent.updated_at).toLocaleDateString('ko-KR')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
