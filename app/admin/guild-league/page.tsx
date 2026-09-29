'use client'

import { useEffect, useState } from 'react'
import SaveAllButton from './save-all-button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { Card } from '@/components/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GuildRow {
  id: number
  rank: number
  guild_name: string
  wins: number
  losses: number
  score: number
}

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

type Status = { type: 'success' | 'error'; msg: string } | null

export default function AdminGuildLeaguePage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'seasons'>('daily')
  const [rows, setRows] = useState<GuildRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  const [seasons, setSeasons] = useState<Season[]>([])
  const [seasonsLoading, setSeasonsLoading] = useState(false)
  const [showNewSeasonForm, setShowNewSeasonForm] = useState(false)
  const [seasonStatus, setSeasonStatus] = useState<Status>(null)
  const [newSeason, setNewSeason] = useState({
    seasonName: '',
    seasonNumber: 1,
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  })

  const isPast = true
  const tableRef = useKeyboardNavigation({ rows: rows.length, cols: 5, disabled: !isPast })

  const fetchData = async (targetDate: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/guild-league?date=${targetDate}`)
      const json = await res.json()
      const parsed = (json as any[]).map((row: any, idx: number) => ({
        id: row.id ?? idx + 1,
        rank: row.rank ?? 0,
        guild_name: row.guild_name ?? '',
        wins: row.wins ?? 0,
        losses: row.losses ?? 0,
        score: row.score ?? 0,
      }))
      const empty = parsed.length < 100
        ? Array.from({ length: 100 - parsed.length }, (_, i) => ({
            id: parsed.length + i + 1,
            rank: parsed.length + i + 1,
            guild_name: '',
            wins: 0,
            losses: 0,
            score: 0,
          }))
        : []
      setRows([...parsed, ...empty])
    } catch {
      setRows([])
    }
    setLoading(false)
  }

  const fetchYesterdayData = () => {
    const yesterday = new Date(selectedDate)
    yesterday.setDate(yesterday.getDate() - 1)
    fetchData(format(yesterday, 'yyyy-MM-dd'))
  }

  useEffect(() => { fetchData(format(selectedDate, 'yyyy-MM-dd')) }, [selectedDate])
  useEffect(() => { if (activeTab === 'seasons') loadSeasons() }, [activeTab])

  const loadSeasons = async () => {
    setSeasonsLoading(true)
    try {
      const res = await fetch('/api/admin/guild-league/seasons')
      setSeasons(await res.json())
    } catch { /* silent */ } finally { setSeasonsLoading(false) }
  }

  const createNewSeason = async () => {
    setSeasonStatus(null)
    try {
      const res = await fetch('/api/admin/guild-league/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeason),
      })
      if (res.ok) {
        setSeasonStatus({ type: 'success', msg: '새 시즌이 생성되었습니다.' })
        setShowNewSeasonForm(false)
        setNewSeason({ seasonName: '', seasonNumber: 1, startDate: new Date().toISOString().split('T')[0], description: '' })
        loadSeasons()
      } else {
        setSeasonStatus({ type: 'error', msg: '시즌 생성에 실패했습니다.' })
      }
    } catch { setSeasonStatus({ type: 'error', msg: '오류가 발생했습니다.' }) }
  }

  const archiveSeason = async (seasonId: number) => {
    if (!confirm('현재 시즌을 종료하고 데이터를 보관하시겠습니까?')) return
    setSeasonStatus(null)
    try {
      const res = await fetch('/api/admin/guild-league/archive-season', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seasonId, endDate: new Date().toISOString().split('T')[0] }),
      })
      if (res.ok) {
        setSeasonStatus({ type: 'success', msg: '시즌이 보관되었습니다.' })
        loadSeasons()
      } else {
        setSeasonStatus({ type: 'error', msg: '시즌 보관에 실패했습니다.' })
      }
    } catch { setSeasonStatus({ type: 'error', msg: '오류가 발생했습니다.' }) }
  }

  const updateRow = (index: number, key: keyof GuildRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [key]: ['rank', 'wins', 'losses', 'score'].includes(key) ? Number(value) : value,
      }
      return updated
    })
  }

  if (loading && activeTab === 'daily') return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xl">불러오는 중...</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-white">길드 리그 관리</h1>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex space-x-2 bg-slate-700/40 p-1.5 rounded-xl border border-white/10">
        {(['daily', 'seasons'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg shadow-yellow-500/30'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'daily' ? '📊 날짜별 수정' : '📅 시즌 관리'}
          </button>
        ))}
      </div>

      {/* 날짜별 수정 탭 */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex flex-wrap items-center gap-3">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-600/50 transition-colors">
                    📅 {format(selectedDate, 'yyyy.MM.dd (EEE)', { locale: ko })}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => { if (date) { setSelectedDate(date); setCalendarOpen(false) } }}
                    locale={ko}
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>

              <button
                onClick={fetchYesterdayData}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-colors"
              >
                ⬅ 전날 데이터 불러오기
              </button>

              {status && (
                <p className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status.type === 'success' ? '✅' : '❌'} {status.msg}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            <table ref={tableRef} className="w-full text-sm">
              <thead className="bg-slate-800/80 border-b border-white/10">
                <tr>
                  {['순위', '길드명', '승', '패', '점수'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-gray-300 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-slate-700/30 transition-colors">
                    <td className="px-3 py-1.5 w-20">
                      <input type="number" value={row.rank} onChange={(e) => updateRow(idx, 'rank', e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-yellow-500" disabled={!isPast} />
                    </td>
                    <td className="px-3 py-1.5">
                      <input value={row.guild_name} onChange={(e) => updateRow(idx, 'guild_name', e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-yellow-500" disabled={!isPast} />
                    </td>
                    <td className="px-3 py-1.5 w-20">
                      <input type="number" value={row.wins} onChange={(e) => updateRow(idx, 'wins', e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-yellow-500" disabled={!isPast} />
                    </td>
                    <td className="px-3 py-1.5 w-20">
                      <input type="number" value={row.losses} onChange={(e) => updateRow(idx, 'losses', e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-yellow-500" disabled={!isPast} />
                    </td>
                    <td className="px-3 py-1.5 w-24">
                      <input type="number" value={row.score} onChange={(e) => updateRow(idx, 'score', e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-yellow-500" disabled={!isPast} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SaveAllButton data={rows} date={selectedDate} disabled={!isPast} />
        </div>
      )}

      {/* 시즌 관리 탭 */}
      {activeTab === 'seasons' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-white">시즌 관리</h2>
              <div className="flex items-center gap-3">
                {seasonStatus && (
                  <p className={`text-sm font-medium ${seasonStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {seasonStatus.type === 'success' ? '✅' : '❌'} {seasonStatus.msg}
                  </p>
                )}
                <Button
                  onClick={() => {
                    const nextNumber = seasons.length > 0 ? Math.max(...seasons.map(s => s.season_number)) + 1 : 1
                    setNewSeason({ seasonName: `길드리그 시즌 ${nextNumber}`, seasonNumber: nextNumber, startDate: new Date().toISOString().split('T')[0], description: '' })
                    setShowNewSeasonForm(true)
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                >
                  새 시즌 생성
                </Button>
              </div>
            </div>
          </div>

          {showNewSeasonForm && (
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">새 길드리그 시즌 생성</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">시즌 이름</label>
                  <Input value={newSeason.seasonName} onChange={(e) => setNewSeason({ ...newSeason, seasonName: e.target.value })} placeholder="예: 길드리그 시즌 2" className="bg-slate-700/50 text-white border-white/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">시즌 번호</label>
                  <Input type="number" value={newSeason.seasonNumber} onChange={(e) => setNewSeason({ ...newSeason, seasonNumber: parseInt(e.target.value) })} className="bg-slate-700/50 text-white border-white/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">시작일</label>
                  <Input type="date" value={newSeason.startDate} onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })} className="bg-slate-700/50 text-white border-white/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
                  <Input value={newSeason.description} onChange={(e) => setNewSeason({ ...newSeason, description: e.target.value })} placeholder="시즌에 대한 설명 (선택사항)" className="bg-slate-700/50 text-white border-white/20" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createNewSeason} className="bg-gradient-to-r from-green-600 to-green-700">생성</Button>
                  <Button onClick={() => setShowNewSeasonForm(false)} className="bg-gradient-to-r from-gray-600 to-gray-700">취소</Button>
                </div>
              </div>
            </Card>
          )}

          {seasonsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-gray-400">시즌 목록 불러오는 중...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {seasons.map((season) => (
                <Card key={season.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {season.season_name}
                        {season.is_active && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-green-600 to-green-700 text-white rounded shadow-lg">활성</span>
                        )}
                      </h3>
                      <p className="text-gray-400 mt-1">시즌 #{season.season_number} • {season.start_date} ~ {season.end_date || '진행중'}</p>
                      {season.description && <p className="text-gray-300 mt-2">{season.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      {season.is_active && (
                        <Button onClick={() => archiveSeason(season.id)} className="bg-gradient-to-r from-orange-600 to-orange-700">시즌 종료</Button>
                      )}
                      <Button onClick={() => window.open(`/admin/guild-league/seasons/${season.id}`, '_blank')} className="bg-gradient-to-r from-blue-600 to-blue-700">데이터 보기</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
