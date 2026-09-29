'use client'

import { useEffect, useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select'

const WAR_TYPES = ['거점전', '점령전'] as const
const NODE_REGIONS = ['발레노스', '세렌디아', '칼페온', '카마실비아', '메디아', '발렌시아']
const SIEGE_REGIONS = ['칼페온', '발렌시아', '메디아']
const RESULTS = ['점령성공', '점령실패', '진행중']
const TIERS = ['무제한', '2단', '1단']

type WarType = (typeof WAR_TYPES)[number]
type Status = { type: 'success' | 'error'; msg: string } | null

interface RecordRow {
  alliance_name: string
  fort_stage: number | null
  occupied_area: string
  result: string
}

interface AllianceRow {
  name: string
  guilds: string[]
  tiers: string[]
  isActive?: boolean
}

const TIER_ORDER = { '무제한': 0, '2단': 1, '1단': 2 }

const RESULT_STYLE: Record<string, string> = {
  '점령성공': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  '점령실패': 'bg-red-500/20 text-red-300 border-red-500/30',
  '진행중': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

export default function AdminWarRecordsPage() {
  const [selectedWarType, setSelectedWarType] = useState<WarType>('거점전')
  const [selectedRegion, setSelectedRegion] = useState(NODE_REGIONS[0])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [records, setRecords] = useState<Record<string, RecordRow[]>>({})
  const [alliances, setAlliances] = useState<AllianceRow[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')
  const [recordStatus, setRecordStatus] = useState<Status>(null)
  const [allianceStatus, setAllianceStatus] = useState<Status>(null)

  const filteredRegions = selectedWarType === '점령전' ? SIEGE_REGIONS : NODE_REGIONS

  useEffect(() => {
    setSelectedRegion(filteredRegions[0])
  }, [selectedWarType])

  const getKey = () => `${format(selectedDate, 'yyyy-MM-dd')}_${selectedRegion}_${selectedWarType}`

  const rows: RecordRow[] = records[getKey()] ?? Array.from({ length: 10 }, (): RecordRow => ({
    alliance_name: '',
    fort_stage: null,
    occupied_area: '',
    result: '진행중',
  }))

  const updateRecord = <K extends keyof RecordRow>(idx: number, key: K, value: RecordRow[K]) => {
    const updated = [...rows]
    updated[idx][key] = value
    setRecords(prev => ({ ...prev, [getKey()]: updated }))
  }

  const updateAlliance = (name: string, key: keyof AllianceRow, value: AllianceRow[keyof AllianceRow]) => {
    setAlliances(prev => prev.map(a => a.name === name ? { ...a, [key]: value } : a))
  }

  const toggleTier = (name: string, tier: string) => {
    setAlliances(prev => prev.map(a => {
      if (a.name !== name) return a
      const prevTiers = a.tiers ?? []
      const next = prevTiers.includes(tier) ? prevTiers.filter(t => t !== tier) : [...prevTiers, tier]
      return { ...a, tiers: next }
    }))
  }

  const saveRecords = async () => {
    setRecordStatus(null)
    const payload = (records[getKey()] || []).filter(r => r.alliance_name && r.result)
    try {
      const res = await fetch('/api/admin/war-records/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: format(selectedDate, 'yyyy-MM-dd'), region: selectedRegion, war_type: selectedWarType, records: payload }),
      })
      if (res.ok) {
        setRecordStatus({ type: 'success', msg: '저장 완료!' })
      } else {
        const err = await res.json().catch(() => ({}))
        setRecordStatus({ type: 'error', msg: `저장 실패: ${err.detail || err.message || '알 수 없는 오류'}` })
      }
    } catch (e) {
      setRecordStatus({ type: 'error', msg: `저장 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}` })
    }
  }

  const saveAlliances = async () => {
    setAllianceStatus(null)
    const valid = alliances.filter(a => a.name?.trim())
    try {
      const res = await fetch('/api/admin/alliances/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alliances: valid }),
      })
      if (res.ok) {
        setAllianceStatus({ type: 'success', msg: '연맹 저장 완료!' })
      } else {
        const err = await res.json().catch(() => ({}))
        setAllianceStatus({ type: 'error', msg: `연맹 저장 실패: ${err.detail || err.message || '알 수 없는 오류'}` })
      }
    } catch (e) {
      setAllianceStatus({ type: 'error', msg: `연맹 저장 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}` })
    }
  }

  useEffect(() => {
    const fetchAlliances = async () => {
      const res = await fetch('/api/admin/alliances/load')
      const data = await res.json()
      const parsed = Array.isArray(data)
        ? data.map(a => {
            const raw = Array.isArray(a.guilds)
              ? a.guilds
              : (a.guilds ?? '').split('/').map((g: string) => g.trim()).filter(Boolean)
            return {
              name: a.name,
              guilds: [...new Set<string>(raw)],
              tiers: Array.isArray(a.tiers) ? a.tiers : [],
              isActive: a.isActive === true,
            }
          })
        : []
      setAlliances(parsed)
    }
    fetchAlliances()
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      const query = new URLSearchParams({ date: format(selectedDate, 'yyyy-MM-dd'), region: selectedRegion, war_type: selectedWarType })
      const res = await fetch(`/api/admin/war-records/load?${query}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const parsed: RecordRow[] = data.map(item => ({
          alliance_name: item.alliance_name || '',
          occupied_area: item.occupied_area,
          fort_stage: item.fort_stage ?? null,
          result: item.result,
        }))
        setRecords(prev => ({ ...prev, [getKey()]: parsed }))
      }
    }
    fetchRecords()
  }, [selectedDate, selectedRegion, selectedWarType])

  const sortedAlliances = useMemo(() =>
    [...alliances].sort((a, b) => {
      const aTier = Math.min(...(a.tiers.map(t => TIER_ORDER[t as keyof typeof TIER_ORDER] ?? 99)), 99)
      const bTier = Math.min(...(b.tiers.map(t => TIER_ORDER[t as keyof typeof TIER_ORDER] ?? 99)), 99)
      return aTier - bTier
    }),
    [alliances]
  )

  const sortedRows = useMemo(() => {
    const indexedRows = rows.map((row, index) => ({ ...row, originalIndex: index }))
    return indexedRows.sort((a, b) => {
      const order = { '점령성공': 0, '진행중': 1, '점령실패': 2 }
      return (order[a.result as keyof typeof order] ?? 3) - (order[b.result as keyof typeof order] ?? 3)
    })
  }, [rows])

  const visibleAlliances = sortedAlliances.filter(a =>
    activeTab === 'active' ? a.isActive !== false : a.isActive === false
  )

  return (
    <div className="space-y-6">

      {/* ───── 전투 기록 ───── */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-lg">⚔️</span>
            </div>
            <h2 className="text-xl font-bold text-white">전투 기록 관리</h2>
          </div>
          {/* 필터 + 저장 */}
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="px-3 py-1.5 text-sm bg-slate-700/60 hover:bg-slate-600/60 border border-white/10 rounded-lg text-white transition-colors">
                  📅 {format(selectedDate, 'yyyy. M. d', { locale: ko })}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={date => date && setSelectedDate(date)} locale={ko} />
              </PopoverContent>
            </Popover>
            <Select value={selectedWarType} onValueChange={val => setSelectedWarType(val as WarType)}>
              <SelectTrigger className="w-28 h-8 text-sm bg-slate-700/60 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WAR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-28 h-8 text-sm bg-slate-700/60 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filteredRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <button
              onClick={() => setRecords(prev => ({
                ...prev,
                [getKey()]: [...(records[getKey()] ?? []), { alliance_name: '', fort_stage: null, occupied_area: '', result: '진행중' }]
              }))}
              className="px-3 py-1.5 text-sm bg-slate-700/60 hover:bg-slate-600/60 border border-white/10 rounded-lg text-gray-300 transition-colors"
            >
              + 행 추가
            </button>
            <button
              onClick={saveRecords}
              className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all shadow-lg"
            >
              💾 저장
            </button>
          </div>
        </div>

        {/* 기록 테이블 */}
        <div className="overflow-x-auto px-6 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-8">#</th>
                <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">연맹명</th>
                <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">성채단계</th>
                <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">점령지역</th>
                <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-36">결과</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedRows.map((row, i) => (
                <tr key={row.originalIndex} className="hover:bg-white/3 transition-colors group">
                  <td className="py-2.5 pr-4 text-slate-500 text-xs">{i + 1}</td>
                  <td className="py-2.5 pr-4">
                    <Input
                      value={row.alliance_name}
                      onChange={e => updateRecord(row.originalIndex, 'alliance_name', e.target.value)}
                      className="h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                      placeholder="연맹명"
                    />
                  </td>
                  <td className="py-2.5 pr-4">
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={row.fort_stage ?? ''}
                      onChange={e => updateRecord(row.originalIndex, 'fort_stage', Number(e.target.value))}
                      className="h-8 text-sm bg-slate-700/50 border-slate-600 text-white"
                    />
                  </td>
                  <td className="py-2.5 pr-4">
                    <Input
                      value={row.occupied_area}
                      onChange={e => updateRecord(row.originalIndex, 'occupied_area', e.target.value)}
                      className="h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                      placeholder="점령 지역"
                    />
                  </td>
                  <td className="py-2.5">
                    <Select value={row.result} onValueChange={val => updateRecord(row.originalIndex, 'result', val)}>
                      <SelectTrigger className={`h-8 text-xs font-medium border rounded-lg ${RESULT_STYLE[row.result] ?? 'bg-slate-700/50 border-slate-600 text-white'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESULTS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 기록 저장 상태 */}
        {recordStatus && (
          <div className={`mx-6 mb-4 mt-2 px-4 py-2.5 rounded-lg text-sm font-medium border ${
            recordStatus.type === 'success'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : 'text-red-400 bg-red-500/10 border-red-500/30'
          }`}>
            {recordStatus.type === 'success' ? '✅' : '❌'} {recordStatus.msg}
          </div>
        )}
      </div>

      {/* ───── 연맹 등록 ───── */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-lg">🤝</span>
            </div>
            <h2 className="text-xl font-bold text-white">연맹 등록</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAlliances(prev => [...prev, { name: '', guilds: [''], tiers: [], isActive: true }])}
              className="px-3 py-1.5 text-sm bg-slate-700/60 hover:bg-slate-600/60 border border-white/10 rounded-lg text-gray-300 transition-colors"
            >
              + 연맹 추가
            </button>
            <button
              onClick={saveAlliances}
              className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all shadow-lg"
            >
              💾 연맹 저장
            </button>
          </div>
        </div>

        {/* 연맹 저장 상태 */}
        {allianceStatus && (
          <div className={`mx-6 mt-4 px-4 py-2.5 rounded-lg text-sm font-medium border ${
            allianceStatus.type === 'success'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : 'text-red-400 bg-red-500/10 border-red-500/30'
          }`}>
            {allianceStatus.type === 'success' ? '✅' : '❌'} {allianceStatus.msg}
          </div>
        )}

        {/* 탭 */}
        <div className="px-6 pt-4">
          <div className="flex space-x-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              활성 연맹
              <span className="ml-2 text-xs opacity-70">
                ({sortedAlliances.filter(a => a.isActive !== false).length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'inactive'
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              해체 연맹
              <span className="ml-2 text-xs opacity-70">
                ({sortedAlliances.filter(a => a.isActive === false).length})
              </span>
            </button>
          </div>
        </div>

        {/* 연맹 테이블 */}
        <div className="overflow-x-auto px-6 py-4">
          {visibleAlliances.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm border border-white/5 rounded-xl bg-slate-800/30">
              {activeTab === 'active' ? '등록된 활성 연맹이 없습니다.' : '해체된 연맹이 없습니다.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-40">연맹명</th>
                  <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-56">소속 길드</th>
                  <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">단계</th>
                  {activeTab === 'active' && (
                    <th className="pb-3 pr-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">해체</th>
                  )}
                  <th className="pb-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleAlliances.map(a => (
                  <tr key={a.name} className="hover:bg-white/3 transition-colors align-top">
                    {/* 연맹명 */}
                    <td className="py-3 pr-4">
                      <Input
                        value={a.name}
                        onChange={e => updateAlliance(a.name, 'name', e.target.value)}
                        className="h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                        placeholder="연맹명"
                      />
                    </td>

                    {/* 소속 길드 (단일 열, 세로 나열) */}
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-1.5">
                        {a.guilds.map((g, gIdx) => (
                          <div key={gIdx} className="flex gap-1.5 items-center">
                            <Input
                              value={g}
                              onChange={e => {
                                const updated = [...a.guilds]
                                updated[gIdx] = e.target.value
                                updateAlliance(a.name, 'guilds', updated)
                              }}
                              className="h-7 w-44 text-xs bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                              placeholder={`길드 ${gIdx + 1}`}
                            />
                            {a.guilds.length > 1 && (
                              <button
                                onClick={() => updateAlliance(a.name, 'guilds', a.guilds.filter((_, i) => i !== gIdx))}
                                className="text-slate-500 hover:text-red-400 transition-colors text-xs flex-shrink-0"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => updateAlliance(a.name, 'guilds', [...a.guilds, ''])}
                          className="text-xs text-blue-400 hover:text-blue-300 text-left mt-0.5 transition-colors"
                        >
                          + 길드 추가
                        </button>
                      </div>
                    </td>

                    {/* 단계 체크박스 */}
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-1.5">
                        {TIERS.map(tier => (
                          <label key={tier} className="flex items-center gap-2 cursor-pointer group/tier">
                            <input
                              type="checkbox"
                              checked={a.tiers.includes(tier)}
                              onChange={() => toggleTier(a.name, tier)}
                              className="w-3.5 h-3.5 rounded border-slate-500 bg-slate-700 accent-indigo-500"
                            />
                            <span className={`text-xs transition-colors ${a.tiers.includes(tier) ? 'text-indigo-300 font-medium' : 'text-slate-400 group-hover/tier:text-slate-300'}`}>
                              {tier}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>

                    {/* 해체 버튼 (활성 탭만) */}
                    {activeTab === 'active' && (
                      <td className="py-3 pr-4 text-center align-middle">
                        <button
                          onClick={async () => {
                            if (!confirm(`${a.name} 연맹을 해체하시겠습니까?`)) return
                            try {
                              const res = await fetch('/api/admin/alliances/deactivate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ allianceName: a.name }),
                              })
                              if (res.ok) {
                                setAlliances(prev => prev.map(al => al.name === a.name ? { ...al, isActive: false } : al))
                                setAllianceStatus({ type: 'success', msg: `${a.name} 연맹이 해체되었습니다.` })
                              } else {
                                setAllianceStatus({ type: 'error', msg: '연맹 해체에 실패했습니다.' })
                              }
                            } catch {
                              setAllianceStatus({ type: 'error', msg: '연맹 해체 중 오류가 발생했습니다.' })
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                        >
                          해체
                        </button>
                      </td>
                    )}

                    {/* 삭제 버튼 */}
                    <td className="py-3 text-center align-middle">
                      <button
                        onClick={() => setAlliances(prev => prev.filter(al => al.name !== a.name))}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
