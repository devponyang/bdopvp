"use client"
import { useEffect, useState } from 'react'

interface GuildMark {
  id: number
  guild_name: string
  mark_url: string
  created_at: string
  updated_at: string
}

type Status = { type: 'success' | 'error'; msg: string } | null

export default function GuildMarksAdmin() {
  const [guildMarks, setGuildMarks] = useState<GuildMark[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGuildName, setNewGuildName] = useState('')
  const [newMarkFile, setNewMarkFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  useEffect(() => { fetchGuildMarks() }, [])

  const fetchGuildMarks = async () => {
    try {
      const res = await fetch('/api/admin/guild-marks')
      if (res.ok) setGuildMarks(await res.json())
    } catch { /* silent */ } finally { setLoading(false) }
  }

  const handleAddGuildMark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuildName.trim() || !newMarkFile) return
    setUploading(true)
    setStatus(null)
    try {
      const formData = new FormData()
      formData.append('file', newMarkFile)
      formData.append('folderType', 'guild-icons')
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        setStatus({ type: 'error', msg: `이미지 업로드 실패: ${err.error}` })
        return
      }
      const { url: imageUrl } = await uploadRes.json()
      const res = await fetch('/api/admin/guild-marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_name: newGuildName.trim(), mark_url: imageUrl }),
      })
      if (res.ok) {
        setStatus({ type: 'success', msg: '길드마크가 추가되었습니다.' })
        setNewGuildName('')
        setNewMarkFile(null)
        setShowAddForm(false)
        fetchGuildMarks()
      } else {
        const err = await res.json()
        setStatus({ type: 'error', msg: `추가 실패: ${err.error}` })
      }
    } catch (e) {
      setStatus({ type: 'error', msg: `오류: ${e}` })
    } finally { setUploading(false) }
  }

  const handleDeleteGuildMark = async (id: number) => {
    if (!confirm('정말로 이 길드마크를 삭제하시겠습니까?')) return
    try {
      const res = await fetch(`/api/admin/guild-marks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setStatus({ type: 'success', msg: '삭제되었습니다.' })
        fetchGuildMarks()
      } else {
        setStatus({ type: 'error', msg: '삭제에 실패했습니다.' })
      }
    } catch { setStatus({ type: 'error', msg: '삭제 중 오류가 발생했습니다.' }) }
  }

  const handleFixUrl = async (id: number, currentUrl: string) => {
    if (!confirm('이 길드마크의 URL을 수정하시겠습니까?')) return
    try {
      const res = await fetch(`/api/admin/guild-marks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_url: currentUrl.replace('/uploads/', '/guild-icons/') }),
      })
      if (res.ok) {
        setStatus({ type: 'success', msg: 'URL이 수정되었습니다.' })
        fetchGuildMarks()
      } else {
        setStatus({ type: 'error', msg: 'URL 수정에 실패했습니다.' })
      }
    } catch { setStatus({ type: 'error', msg: 'URL 수정 중 오류가 발생했습니다.' }) }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏷️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">길드마크 관리</h1>
              <p className="text-gray-400 text-sm mt-1">후원자들의 길드마크를 관리합니다.</p>
            </div>
          </div>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setStatus(null) }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-400 rounded-lg text-sm font-semibold hover:bg-purple-500/30 transition-colors"
          >
            {showAddForm ? '✕ 취소' : '+ 추가하기'}
          </button>
        </div>
        {status && (
          <p className={`mt-4 text-sm font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {status.type === 'success' ? '✅' : '❌'} {status.msg}
          </p>
        )}
      </div>

      {/* 추가 폼 */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">새 길드마크 추가</h2>
          <form onSubmit={handleAddGuildMark} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">길드명</label>
              <input
                type="text"
                value={newGuildName}
                onChange={(e) => setNewGuildName(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="길드명을 입력하세요"
                required
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">길드마크 이미지</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewMarkFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                required
                disabled={uploading}
              />
              {newMarkFile && (
                <p className="text-xs text-emerald-400 mt-1">
                  {newMarkFile.name} ({(newMarkFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg"
              >
                {uploading ? '업로드 중...' : '추가하기'}
              </button>
              <button
                type="button"
                onClick={() => { setNewGuildName(''); setNewMarkFile(null); setShowAddForm(false) }}
                disabled={uploading}
                className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 rounded-lg font-medium transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 목록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          길드마크 목록
          <span className="ml-2 text-sm font-normal text-gray-400">({guildMarks.length}개)</span>
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-gray-400">로딩 중...</span>
          </div>
        ) : guildMarks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">등록된 길드마크가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {guildMarks.map((mark) => (
              <div key={mark.id} className="bg-slate-700/40 rounded-xl p-4 border border-white/5 hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-sm truncate">{mark.guild_name}</h3>
                </div>
                <div className="mb-3 bg-slate-800/60 rounded-lg p-2">
                  <img
                    src={mark.mark_url}
                    alt={`${mark.guild_name} 길드마크`}
                    className="w-full h-16 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/guild-icons/default.png' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mb-3">{new Date(mark.updated_at).toLocaleDateString('ko-KR')}</p>
                <div className="flex gap-2">
                  {mark.mark_url.startsWith('/uploads/') && (
                    <button
                      onClick={() => handleFixUrl(mark.id, mark.mark_url)}
                      className="flex-1 text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors"
                    >
                      🔧 URL수정
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteGuildMark(mark.id)}
                    className="flex-1 text-xs px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
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
  )
}
