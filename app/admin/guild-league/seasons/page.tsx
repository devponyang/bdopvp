'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

type Status = { type: 'success' | 'error'; msg: string } | null

interface Season {
  id: number
  season_name: string
  season_number: number
  start_date: string
  end_date?: string
  is_active: boolean
  description?: string
  created_at: string
}

export default function GuildLeagueSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewSeasonForm, setShowNewSeasonForm] = useState(false)
  const [newSeason, setNewSeason] = useState({
    seasonName: '',
    seasonNumber: 1,
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [status, setStatus] = useState<Status>(null)

  useEffect(() => {
    loadSeasons()
  }, [])

  const loadSeasons = async () => {
    try {
      const response = await fetch('/api/admin/guild-league/seasons')
      const data = await response.json()
      setSeasons(data)
    } catch (error) {
      console.error('길드리그 시즌 목록 로딩 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewSeason = async () => {
    setStatus(null)
    try {
      const response = await fetch('/api/admin/guild-league/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeason)
      })

      if (response.ok) {
        setShowNewSeasonForm(false)
        setNewSeason({
          seasonName: '',
          seasonNumber: 1,
          startDate: new Date().toISOString().split('T')[0],
          description: ''
        })
        loadSeasons()
        setStatus({ type: 'success', msg: '새 길드리그 시즌이 생성되었습니다.' })
      } else {
        setStatus({ type: 'error', msg: '길드리그 시즌 생성에 실패했습니다.' })
      }
    } catch (error) {
      console.error('길드리그 시즌 생성 오류:', error)
      setStatus({ type: 'error', msg: '시즌 생성 중 오류가 발생했습니다.' })
    }
  }

  const archiveSeason = async (seasonId: number) => {
    if (!confirm('현재 길드리그 시즌을 종료하고 데이터를 보관하시겠습니까?')) return

    setStatus(null)
    try {
      const response = await fetch('/api/admin/guild-league/archive-season', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seasonId, endDate: new Date().toISOString().split('T')[0] })
      })

      if (response.ok) {
        loadSeasons()
        setStatus({ type: 'success', msg: '길드리그 시즌이 보관되었습니다.' })
      } else {
        setStatus({ type: 'error', msg: '시즌 보관에 실패했습니다.' })
      }
    } catch (error) {
      console.error('길드리그 시즌 보관 오류:', error)
      setStatus({ type: 'error', msg: '시즌 보관 중 오류가 발생했습니다.' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-400 text-sm">로딩 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">길드리그 시즌 관리</h1>
              <p className="text-sm text-gray-400 mt-0.5">시즌 생성, 종료 및 데이터 보관을 관리합니다</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewSeasonForm(true)}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-lg"
          >
            + 새 시즌 생성
          </button>
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

      {/* 새 시즌 생성 폼 */}
      {showNewSeasonForm && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4">새 길드리그 시즌 생성</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">시즌 이름</label>
              <Input
                value={newSeason.seasonName}
                onChange={(e) => setNewSeason({...newSeason, seasonName: e.target.value})}
                placeholder="예: 길드리그 시즌 2"
                className="bg-slate-700/50 text-white border-slate-600 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">시즌 번호</label>
              <Input
                type="number"
                value={newSeason.seasonNumber}
                onChange={(e) => setNewSeason({...newSeason, seasonNumber: parseInt(e.target.value)})}
                className="bg-slate-700/50 text-white border-slate-600 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">시작일</label>
              <Input
                type="date"
                value={newSeason.startDate}
                onChange={(e) => setNewSeason({...newSeason, startDate: e.target.value})}
                className="bg-slate-700/50 text-white border-slate-600 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">설명 (선택)</label>
              <Input
                value={newSeason.description}
                onChange={(e) => setNewSeason({...newSeason, description: e.target.value})}
                placeholder="시즌에 대한 설명"
                className="bg-slate-700/50 text-white border-slate-600 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={createNewSeason}
                className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all shadow-lg"
              >
                생성
              </button>
              <button
                onClick={() => setShowNewSeasonForm(false)}
                className="px-6 py-2 text-sm font-medium bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 rounded-lg border border-white/10 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시즌 목록 */}
      <div className="space-y-3">
        {seasons.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-10 border border-white/10 text-center text-gray-500 text-sm">
            등록된 시즌이 없습니다.
          </div>
        ) : seasons.map((season) => (
          <div key={season.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{season.season_name}</h3>
                  {season.is_active && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                      활성
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  시즌 #{season.season_number} · {season.start_date} ~ {season.end_date || '진행중'}
                </p>
                {season.description && (
                  <p className="text-sm text-gray-300 mt-1.5">{season.description}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {season.is_active && (
                  <button
                    onClick={() => archiveSeason(season.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-lg transition-colors"
                  >
                    시즌 종료
                  </button>
                )}
                <button
                  onClick={() => window.open(`/admin/guild-league/seasons/${season.id}`, '_blank')}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-colors"
                >
                  데이터 보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
