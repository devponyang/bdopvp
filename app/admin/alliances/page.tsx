"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AllianceMark {
  id: number
  alliance_name: string
  mark_url: string
  created_at: string
  updated_at: string
}

export default function AllianceMarksAdmin() {
  const [allianceMarks, setAllianceMarks] = useState<AllianceMark[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAllianceName, setNewAllianceName] = useState('')
  const [newMarkFile, setNewMarkFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAllianceMarks()
  }, [])

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
      setLoading(false)
    }
  }

  const handleAddAllianceMark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAllianceName.trim() || !newMarkFile) return

    setUploading(true)
    try {
      // 1. 이미지 업로드
      const formData = new FormData()
      formData.append('file', newMarkFile)
      formData.append('folderType', 'alliance-icons')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        alert(`이미지 업로드 실패: ${errorData.error}`)
        return
      }

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url

      // 2. 연맹마크 정보 저장
      const response = await fetch('/api/admin/alliance-marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alliance_name: newAllianceName.trim(),
          mark_url: imageUrl,
        }),
      })

      if (response.ok) {
        setNewAllianceName('')
        setNewMarkFile(null)
        setShowAddForm(false)
        fetchAllianceMarks()
      } else {
        const errorData = await response.json()
        alert(`연맹마크 추가 실패: ${errorData.error}`)
      }
    } catch (error) {
      console.error('연맹마크 추가 중 오류:', error)
      alert('연맹마크 추가 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAllianceMark = async (id: number) => {
    if (!confirm('정말로 이 연맹마크를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/alliance-marks/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAllianceMarks()
      } else {
        alert('연맹마크 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('연맹마크 삭제 중 오류:', error)
      alert('연맹마크 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleFixUrl = async (id: number, currentUrl: string) => {
    if (!confirm('이 연맹마크의 URL을 수정하시겠습니까?')) return

    try {
      const newUrl = currentUrl.replace('/uploads/', '/alliance-icons/')
      
      const response = await fetch(`/api/admin/alliance-marks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mark_url: newUrl,
        }),
      })

      if (response.ok) {
        alert('URL이 성공적으로 수정되었습니다!')
        fetchAllianceMarks()
      } else {
        alert('URL 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('URL 수정 중 오류:', error)
      alert('URL 수정 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-200">⚔️ 연맹마크 관리</h1>
            <p className="text-gray-400 mt-2">후원자들의 연맹마크를 관리합니다.</p>
          </div>
          <Link 
            href="/admin/dashboard"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← 대시보드로
          </Link>
        </div>
      </div>

      {/* 연맹마크 추가 폼 */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-300">새 연맹마크 추가</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {showAddForm ? '취소' : '+ 추가하기'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAllianceMark} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                연맹명
              </label>
              <input
                type="text"
                value={newAllianceName}
                onChange={(e) => setNewAllianceName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="연맹명을 입력하세요"
                required
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                연맹마크 이미지
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewMarkFile(e.target.files?.[0] || null)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                required
                disabled={uploading}
              />
              <p className="text-xs text-gray-400 mt-1">
                이미지 파일만 업로드 가능합니다. (최대 5MB)
              </p>
              {newMarkFile && (
                <div className="mt-2">
                  <p className="text-sm text-green-400">선택된 파일: {newMarkFile.name}</p>
                  <p className="text-xs text-gray-400">크기: {(newMarkFile.size / 1024).toFixed(1)} KB</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {uploading ? '업로드 중...' : '추가하기'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewAllianceName('')
                  setNewMarkFile(null)
                  setShowAddForm(false)
                }}
                disabled={uploading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 연맹마크 목록 */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-purple-300">연맹마크 목록</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">로딩 중...</span>
          </div>
        ) : allianceMarks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            등록된 연맹마크가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allianceMarks.map((mark) => (
              <div key={mark.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-purple-200">{mark.alliance_name}</h3>
                  <div className="flex gap-2">
                    {mark.mark_url.startsWith('/uploads/') && (
                      <button
                        onClick={() => handleFixUrl(mark.id, mark.mark_url)}
                        className="text-yellow-400 hover:text-yellow-300 text-sm"
                        title="URL 수정"
                      >
                        🔧 수정
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAllianceMark(mark.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <img
                    src={mark.mark_url}
                    alt={`${mark.alliance_name} 연맹마크`}
                    className="w-full h-20 object-contain bg-zinc-700 rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/alliance-icons/default.png'
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-400 space-y-1">
                  <div>ID: {mark.id}</div>
                  <div>등록일: {new Date(mark.created_at).toLocaleDateString('ko-KR')}</div>
                  <div>수정일: {new Date(mark.updated_at).toLocaleDateString('ko-KR')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
