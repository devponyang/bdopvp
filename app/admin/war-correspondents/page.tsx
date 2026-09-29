"use client"
import { useEffect, useState } from 'react'

type Status = { type: 'success' | 'error'; msg: string } | null

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
  const [status, setStatus] = useState<Status>(null)

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
    setStatus(null)
    try {
      const response = await fetch('/api/admin/war-correspondents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCorrespondent),
      })

      if (response.ok) {
        setNewCorrespondent({ streamer_name: '', chzzk_channel_url: '', profile_image_url: '', description: '' })
        setShowAddForm(false)
        fetchCorrespondents()
        setStatus({ type: 'success', msg: '종군기자가 추가되었습니다.' })
      } else {
        const errorData = await response.json()
        setStatus({ type: 'error', msg: `추가 실패: ${errorData.error}` })
      }
    } catch (error) {
      console.error('종군기자 추가 중 오류:', error)
      setStatus({ type: 'error', msg: '추가 중 오류가 발생했습니다.' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    setStatus(null)
    try {
      const response = await fetch(`/api/admin/war-correspondents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (response.ok) {
        fetchCorrespondents()
        setStatus({ type: 'success', msg: `${currentStatus ? '비활성화' : '활성화'}되었습니다.` })
      } else {
        setStatus({ type: 'error', msg: '상태 변경에 실패했습니다.' })
      }
    } catch (error) {
      console.error('상태 변경 중 오류:', error)
      setStatus({ type: 'error', msg: '상태 변경 중 오류가 발생했습니다.' })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 종군기자를 삭제하시겠습니까?')) return

    setStatus(null)
    try {
      const response = await fetch(`/api/admin/war-correspondents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCorrespondents()
        setStatus({ type: 'success', msg: '종군기자가 삭제되었습니다.' })
      } else {
        setStatus({ type: 'error', msg: '삭제에 실패했습니다.' })
      }
    } catch (error) {
      console.error('종군기자 삭제 중 오류:', error)
      setStatus({ type: 'error', msg: '삭제 중 오류가 발생했습니다.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📺</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">종군기자 관리</h1>
            <p className="text-sm text-gray-400 mt-0.5">거점/점령전 옵저버 스트리머를 관리합니다</p>
          </div>
        </div>
      </div>

      {/* 인라인 상태 메시지 */}
      {status && (
        <p className={`text-sm font-medium px-4 py-2.5 rounded-lg border ${
          status.type === 'success'
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
            : 'text-red-400 bg-red-500/10 border-red-500/30'
        }`}>
          {status.type === 'success' ? '✅' : '❌'} {status.msg}
        </p>
      )}

      {/* 종군기자 추가 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">새 종군기자 추가</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all shadow-lg"
          >
            {showAddForm ? '취소' : '+ 추가하기'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddCorrespondent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">스트리머명 *</label>
              <input
                type="text"
                value={newCorrespondent.streamer_name}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, streamer_name: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:outline-none"
                placeholder="스트리머명을 입력하세요"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">치지직 채널 URL *</label>
              <input
                type="url"
                value={newCorrespondent.chzzk_channel_url}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, chzzk_channel_url: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:outline-none"
                placeholder="https://chzzk.naver.com/live/채널ID"
                required
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">치지직 채널의 전체 URL을 입력하세요</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">프로필 이미지 URL (선택)</label>
              <input
                type="url"
                value={newCorrespondent.profile_image_url}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, profile_image_url: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:outline-none"
                placeholder="https://example.com/profile.jpg"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">설명 (선택)</label>
              <textarea
                value={newCorrespondent.description}
                onChange={(e) => setNewCorrespondent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:outline-none"
                placeholder="종군기자에 대한 설명을 입력하세요"
                rows={3}
                disabled={saving}
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg"
              >
                {saving ? '추가 중...' : '추가하기'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewCorrespondent({ streamer_name: '', chzzk_channel_url: '', profile_image_url: '', description: '' })
                  setShowAddForm(false)
                }}
                disabled={saving}
                className="px-6 py-2 text-sm font-medium bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg border border-white/10 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 종군기자 목록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">종군기자 목록</h2>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400 text-sm">로딩 중...</span>
          </div>
        ) : correspondents.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">등록된 종군기자가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {correspondents.map((correspondent) => (
              <div key={correspondent.id} className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {correspondent.profile_image_url && (
                      <img
                        src={correspondent.profile_image_url}
                        alt={`${correspondent.streamer_name} 프로필`}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white/10 flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm">{correspondent.streamer_name}</h3>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs rounded-md font-medium ${
                        correspondent.is_active
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-600/50 text-gray-400'
                      }`}>
                        {correspondent.is_active ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(correspondent.id, correspondent.is_active)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        correspondent.is_active
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {correspondent.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleDelete(correspondent.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-gray-400">
                  <div className="truncate">
                    <span className="text-gray-500">채널:</span>{' '}
                    <a
                      href={correspondent.chzzk_channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {correspondent.chzzk_channel_url}
                    </a>
                  </div>
                  {correspondent.description && (
                    <div>
                      <span className="text-gray-500">설명:</span> {correspondent.description}
                    </div>
                  )}
                  <div className="text-gray-600 pt-1">
                    등록: {new Date(correspondent.created_at).toLocaleDateString('ko-KR')} · 수정: {new Date(correspondent.updated_at).toLocaleDateString('ko-KR')}
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
