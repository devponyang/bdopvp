"use client"
import { useEffect, useState } from 'react'

interface AllianceMark {
  id: number
  alliance_name: string
  mark_url: string
  created_at: string
  updated_at: string
}

interface GuildMark {
  id: number
  guild_name: string
  mark_url: string
  created_at: string
  updated_at: string
}

type Status = { type: 'success' | 'error'; msg: string } | null

export default function MarksAdmin() {
  const [activeTab, setActiveTab] = useState<'alliance' | 'guild'>('alliance')

  // 연맹 마크
  const [allianceMarks, setAllianceMarks] = useState<AllianceMark[]>([])
  const [allianceLoading, setAllianceLoading] = useState(true)
  const [showAllianceForm, setShowAllianceForm] = useState(false)
  const [newAllianceName, setNewAllianceName] = useState('')
  const [newAllianceFile, setNewAllianceFile] = useState<File | null>(null)
  const [allianceUploading, setAllianceUploading] = useState(false)
  const [allianceStatus, setAllianceStatus] = useState<Status>(null)

  // 길드 마크
  const [guildMarks, setGuildMarks] = useState<GuildMark[]>([])
  const [guildLoading, setGuildLoading] = useState(true)
  const [showGuildForm, setShowGuildForm] = useState(false)
  const [newGuildName, setNewGuildName] = useState('')
  const [newGuildFile, setNewGuildFile] = useState<File | null>(null)
  const [guildUploading, setGuildUploading] = useState(false)
  const [guildStatus, setGuildStatus] = useState<Status>(null)

  useEffect(() => {
    fetchAllianceMarks()
    fetchGuildMarks()
  }, [])

  // 연맹 마크 함수들
  const fetchAllianceMarks = async () => {
    try {
      const response = await fetch('/api/admin/alliance-marks')
      if (response.ok) {
        const data = await response.json()
        setAllianceMarks(data)
      }
    } catch (error) {
      console.error('연맹마크 목록을 불러오는데 실패했습니다:', error)
    } finally {
      setAllianceLoading(false)
    }
  }

  const handleAddAllianceMark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAllianceName.trim() || !newAllianceFile) return

    setAllianceUploading(true)
    setAllianceStatus(null)
    try {
      const formData = new FormData()
      formData.append('file', newAllianceFile)
      formData.append('folderType', 'alliance-icons')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        setAllianceStatus({ type: 'error', msg: `이미지 업로드 실패: ${errorData.error}` })
        return
      }

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url

      const response = await fetch('/api/admin/alliance-marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alliance_name: newAllianceName.trim(),
          mark_url: imageUrl,
        }),
      })

      if (response.ok) {
        setNewAllianceName('')
        setNewAllianceFile(null)
        setShowAllianceForm(false)
        fetchAllianceMarks()
        setAllianceStatus({ type: 'success', msg: '연맹마크가 등록되었습니다.' })
      } else {
        setAllianceStatus({ type: 'error', msg: '연맹마크 등록에 실패했습니다.' })
      }
    } catch (error) {
      console.error('연맹마크 등록 오류:', error)
      setAllianceStatus({ type: 'error', msg: '연맹마크 등록 중 오류가 발생했습니다.' })
    } finally {
      setAllianceUploading(false)
    }
  }

  const handleDeleteAllianceMark = async (id: number) => {
    if (!confirm('정말 이 연맹마크를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/alliance-marks/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAllianceMarks()
        setAllianceStatus({ type: 'success', msg: '연맹마크가 삭제되었습니다.' })
      } else {
        setAllianceStatus({ type: 'error', msg: '연맹마크 삭제에 실패했습니다.' })
      }
    } catch (error) {
      console.error('연맹마크 삭제 오류:', error)
      setAllianceStatus({ type: 'error', msg: '연맹마크 삭제 중 오류가 발생했습니다.' })
    }
  }

  // 길드 마크 함수들
  const fetchGuildMarks = async () => {
    try {
      const response = await fetch('/api/admin/guild-marks')
      if (response.ok) {
        const data = await response.json()
        setGuildMarks(data)
      }
    } catch (error) {
      console.error('길드마크 목록을 불러오는데 실패했습니다:', error)
    } finally {
      setGuildLoading(false)
    }
  }

  const handleAddGuildMark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuildName.trim() || !newGuildFile) return

    setGuildUploading(true)
    setGuildStatus(null)
    try {
      const formData = new FormData()
      formData.append('file', newGuildFile)
      formData.append('folderType', 'guild-icons')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        setGuildStatus({ type: 'error', msg: `이미지 업로드 실패: ${errorData.error}` })
        return
      }

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url

      const response = await fetch('/api/admin/guild-marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guild_name: newGuildName.trim(),
          mark_url: imageUrl,
        }),
      })

      if (response.ok) {
        setNewGuildName('')
        setNewGuildFile(null)
        setShowGuildForm(false)
        fetchGuildMarks()
        setGuildStatus({ type: 'success', msg: '길드마크가 등록되었습니다.' })
      } else {
        setGuildStatus({ type: 'error', msg: '길드마크 등록에 실패했습니다.' })
      }
    } catch (error) {
      console.error('길드마크 등록 오류:', error)
      setGuildStatus({ type: 'error', msg: '길드마크 등록 중 오류가 발생했습니다.' })
    } finally {
      setGuildUploading(false)
    }
  }

  const handleDeleteGuildMark = async (id: number) => {
    if (!confirm('정말 이 길드마크를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/guild-marks/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchGuildMarks()
        setGuildStatus({ type: 'success', msg: '길드마크가 삭제되었습니다.' })
      } else {
        setGuildStatus({ type: 'error', msg: '길드마크 삭제에 실패했습니다.' })
      }
    } catch (error) {
      console.error('길드마크 삭제 오류:', error)
      setGuildStatus({ type: 'error', msg: '길드마크 삭제 중 오류가 발생했습니다.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🤝</span>
          </div>
          <h1 className="text-3xl font-bold text-white">동맹 & 길드마크 관리</h1>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-2 bg-slate-700/40 p-1.5 rounded-xl border border-white/10">
        <button
          onClick={() => setActiveTab('alliance')}
          className={`flex-1 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'alliance'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          🏰 연맹 마크
        </button>
        <button
          onClick={() => setActiveTab('guild')}
          className={`flex-1 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'guild'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          🛡️ 길드 마크
        </button>
      </div>

      {/* 연맹 마크 탭 */}
      {activeTab === 'alliance' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-white">연맹 마크 관리</h2>
              <button
                onClick={() => setShowAllianceForm(!showAllianceForm)}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                {showAllianceForm ? '취소' : '+ 연맹 마크 추가'}
              </button>
            </div>

            {allianceStatus && (
              <p className={`mb-4 text-sm font-medium ${allianceStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {allianceStatus.type === 'success' ? '✅' : '❌'} {allianceStatus.msg}
              </p>
            )}

            {showAllianceForm && (
              <form onSubmit={handleAddAllianceMark} className="bg-slate-700/40 rounded-xl p-6 mb-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">연맹 이름</label>
                    <input
                      type="text"
                      value={newAllianceName}
                      onChange={(e) => setNewAllianceName(e.target.value)}
                      placeholder="연맹 이름을 입력하세요"
                      className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">마크 이미지</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewAllianceFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={allianceUploading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                  >
                    {allianceUploading ? '등록 중...' : '등록'}
                  </button>
                </div>
              </form>
            )}

            {allianceLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">연맹 마크 불러오는 중...</span>
                </div>
              </div>
            ) : allianceMarks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">등록된 연맹마크가 없습니다.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allianceMarks.map((mark) => (
                  <div key={mark.id} className="bg-slate-700/40 rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={mark.mark_url}
                        alt={mark.alliance_name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-white/20"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{mark.alliance_name}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(mark.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAllianceMark(mark.id)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 길드 마크 탭 */}
      {activeTab === 'guild' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-white">길드 마크 관리 (후원자)</h2>
              <button
                onClick={() => setShowGuildForm(!showGuildForm)}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                {showGuildForm ? '취소' : '+ 길드 마크 추가'}
              </button>
            </div>

            {guildStatus && (
              <p className={`mb-4 text-sm font-medium ${guildStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {guildStatus.type === 'success' ? '✅' : '❌'} {guildStatus.msg}
              </p>
            )}

            {showGuildForm && (
              <form onSubmit={handleAddGuildMark} className="bg-slate-700/40 rounded-xl p-6 mb-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">길드 이름</label>
                    <input
                      type="text"
                      value={newGuildName}
                      onChange={(e) => setNewGuildName(e.target.value)}
                      placeholder="길드 이름을 입력하세요"
                      className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">마크 이미지</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewGuildFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={guildUploading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                  >
                    {guildUploading ? '등록 중...' : '등록'}
                  </button>
                </div>
              </form>
            )}

            {guildLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">길드 마크 불러오는 중...</span>
                </div>
              </div>
            ) : guildMarks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">등록된 길드마크가 없습니다.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guildMarks.map((mark) => (
                  <div key={mark.id} className="bg-slate-700/40 rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={mark.mark_url}
                        alt={mark.guild_name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-white/20"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{mark.guild_name}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(mark.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGuildMark(mark.id)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      삭제
                    </button>
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
