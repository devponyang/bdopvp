// ✅ use client
'use client'

import { useEffect, useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'

const WAR_TYPES = ['거점전', '점령전'] as const
const NODE_REGIONS = ['발레노스', '세렌디아', '칼페온', '카마실비아', '메디아', '발렌시아']
const SIEGE_REGIONS = ['칼페온', '발렌시아', '메디아']
const RESULTS = ['점령성공', '점령실패', '진행중']
const TIERS = ['무제한', '2단', '1단']

type WarType = (typeof WAR_TYPES)[number]

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

export default function AdminWarRecordsPage() {
  const [selectedWarType, setSelectedWarType] = useState<WarType>('거점전')
  const [selectedRegion, setSelectedRegion] = useState(NODE_REGIONS[0])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [records, setRecords] = useState<Record<string, RecordRow[]>>({})
  const [alliances, setAlliances] = useState<AllianceRow[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')

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
    const updated: RecordRow[] = [...rows]
    updated[idx][key] = value
    setRecords((prev) => ({ ...prev, [getKey()]: updated }))
  }

  const updateAlliance = (name: string, key: keyof AllianceRow, value: any) => {
    setAlliances(prev =>
      prev.map(a =>
        a.name === name
          ? { ...a, [key]: value }
          : a
      )
    );
  };

  const toggleTier = (name: string, tier: string) => {
    setAlliances(prev =>
      prev.map(a => {
        if (a.name !== name) return a;
        const prevTiers = a.tiers ?? [];
        const next = prevTiers.includes(tier)
          ? prevTiers.filter(t => t !== tier)
          : [...prevTiers, tier];
        return { ...a, tiers: next };
      })
    );
  };


  const saveRecords = async () => {
    const payload = (records[getKey()] || []).filter(r => r.alliance_name && r.result);

    // 기존 저장 로직
    try {
      const res = await fetch('/api/admin/war-records/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          region: selectedRegion,
          war_type: selectedWarType,
          records: payload,
        }),
      });

      if (res.ok) {
        alert('✅ 저장 완료!');
      } else {
        const errorData = await res.json().catch(() => ({ detail: '네트워크 오류가 발생했습니다.' }));
        console.error('❌ 저장 실패:', errorData);
        alert(`❌ 저장 실패: ${errorData.detail || errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('❌ 저장 중 예외 발생:', error);
      alert(`❌ 저장 실패: 네트워크 연결을 확인해주세요. (${error instanceof Error ? error.message : '알 수 없는 오류'})`);
    }
  };

  const saveAlliances = async () => {
    // 이름이 있는 모든 연맹을 저장 (활성/비활성 모두 포함)
    const valid = alliances.filter(a => a.name && a.name.trim())
    
    try {
      const res = await fetch('/api/admin/alliances/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alliances: valid }),
      })
      
      if (res.ok) {
        alert('✅ 연맹 저장 완료!')
      } else {
        const errorData = await res.json().catch(() => ({ detail: '네트워크 오류가 발생했습니다.' }))
        console.error('❌ 연맹 저장 실패:', errorData)
        alert(`❌ 연맹 저장 실패: ${errorData.detail || errorData.message || '알 수 없는 오류가 발생했습니다.'}`)
      }
    } catch (error) {
      console.error('❌ 연맹 저장 중 예외 발생:', error)
      alert(`❌ 연맹 저장 실패: 네트워크 연결을 확인해주세요. (${error instanceof Error ? error.message : '알 수 없는 오류'})`)
    }
  }

  useEffect(() => {
    const fetchAlliances = async () => {
      const res = await fetch('/api/admin/alliances/load')
      const data = await res.json()
      const parsed = Array.isArray(data)
        ? data.map((a) => ({
            name: a.name,
            guilds: Array.isArray(a.guilds)
              ? a.guilds
              : (a.guilds ?? '').split('/').map((g: string) => g.trim()).filter(Boolean),
            tiers: Array.isArray(a.tiers) ? a.tiers : [],
            isActive: a.isActive === true, // 명시적으로 true인 경우만 활성으로 처리
          }))
        : []
      setAlliances(parsed)
    }
    fetchAlliances()
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      const query = new URLSearchParams({
        date: format(selectedDate, 'yyyy-MM-dd'),
        region: selectedRegion,
        war_type: selectedWarType,
      })

      const res = await fetch(`/api/admin/war-records/load?${query}`)
      const data = await res.json()

      if (Array.isArray(data)) {
        const parsed: RecordRow[] = data.map((item) => ({
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

  // 정렬된 연맹 목록 생성
  const sortedAlliances = useMemo(() => 
    [...alliances].sort((a, b) => {
      const aTier = Math.min(...(a.tiers.map(t => TIER_ORDER[t as keyof typeof TIER_ORDER] ?? 99)), 99)
      const bTier = Math.min(...(b.tiers.map(t => TIER_ORDER[t as keyof typeof TIER_ORDER] ?? 99)), 99)
      return aTier - bTier
    }),
    [alliances]
  )

  // 정렬된 전투기록 생성 (점령성공이 맨 위로) - 인덱스 매핑 방식
  const sortedRows = useMemo(() => {
    // 원본 인덱스와 함께 정렬
    const indexedRows = rows.map((row, index) => ({ ...row, originalIndex: index }))
    
    return indexedRows.sort((a, b) => {
      const resultOrder = { '점령성공': 0, '진행중': 1, '점령실패': 2 }
      const aOrder = resultOrder[a.result as keyof typeof resultOrder] ?? 3
      const bOrder = resultOrder[b.result as keyof typeof resultOrder] ?? 3
      return aOrder - bOrder
    })
  }, [rows])

  return (
    <div className="space-y-8">
      {/* 전투 기록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">⚔️</span>
          </div>
          <h2 className="text-3xl font-bold text-white">전투 기록 관리</h2>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ko }) : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Select value={selectedWarType} onValueChange={(val) => setSelectedWarType(val as WarType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WAR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {filteredRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 rounded-xl p-6 border border-white/10 shadow-lg overflow-x-auto">
          <table className="w-full text-center text-white text-sm">
            <thead className="bg-gradient-to-r from-slate-700/60 to-slate-600/60">
              <tr>
                <th className="border border-white/10 px-4 py-3 text-left font-bold text-blue-300">연맹명</th>
                <th className="border border-white/10 px-4 py-3 text-left font-bold text-blue-300">성채단계</th>
                <th className="border border-white/10 px-4 py-3 text-left font-bold text-blue-300">점령지역</th>
                <th className="border border-white/10 px-4 py-3 text-left font-bold text-blue-300">결과</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr key={row.originalIndex} className="hover:bg-white/5 transition-colors">
                  <td className="border border-white/10 px-3 py-2">
                    <Input value={row.alliance_name} onChange={(e) => updateRecord(row.originalIndex, 'alliance_name', e.target.value)} className="bg-slate-700/50 border-white/20" />
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={row.fort_stage ?? ''}
                      onChange={(e) => updateRecord(row.originalIndex, 'fort_stage', Number(e.target.value))}
                      className="bg-slate-700/50 border-white/20"
                    />
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <Input value={row.occupied_area} onChange={(e) => updateRecord(row.originalIndex, 'occupied_area', e.target.value)} className="bg-slate-700/50 border-white/20" />
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <Select value={row.result} onValueChange={(val) => updateRecord(row.originalIndex, 'result', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-white/20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RESULTS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-3 mt-6">
            <Button 
              onClick={() => setRecords(prev => ({
                ...prev,
                [getKey()]: [...(records[getKey()] ?? []), {
                  alliance_name: '', fort_stage: null, occupied_area: '', result: '진행중'
                }]
              }))}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              + 기록 추가
            </Button>
            <Button 
              onClick={saveRecords}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
            >
              💾 전체 저장
            </Button>
          </div>
        </div>
      </div>

      {/* 연맹 등록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <h2 className="text-3xl font-bold text-white">연맹 등록</h2>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setAlliances([...alliances, { name: '', guilds: [''], tiers: [], isActive: true }])}
              className="flex items-center gap-2 border-white/20 hover:bg-white/10"
            >
              <span>+ 연맹 추가</span>
            </Button>
            <Button 
              onClick={saveAlliances}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
            >
              <span>💾 연맹 저장</span>
            </Button>
          </div>
        </div>

        {/* 연맹 관리 탭 */}
        <div className="space-y-6">
          <div className="flex space-x-2 bg-slate-700/40 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              ✅ 활성 연맹
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'inactive'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              ❌ 해체 연맹
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 rounded-xl border border-white/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-slate-700/60 to-slate-600/60">
                  <tr>
                    <th className="px-4 py-4 text-left font-bold text-blue-300 border-b border-white/10">연맹명</th>
                    <th className="px-4 py-4 text-left font-bold text-blue-300 border-b border-white/10" colSpan={4}>길드명</th>
                    <th className="px-4 py-4 text-center font-bold text-blue-300 border-b border-white/10 w-20">+ 길드</th>
                    <th className="px-4 py-4 text-center font-bold text-blue-300 border-b border-white/10">단계</th>
                    {activeTab === 'active' && (
                      <>
                        <th className="px-4 py-4 text-center font-bold text-blue-300 border-b border-white/10 w-20">해체</th>
                        <th className="px-4 py-4 text-center font-bold text-blue-300 border-b border-white/10 w-20">삭제</th>
                      </>
                    )}
                    {activeTab === 'inactive' && (
                      <th className="px-4 py-4 text-center font-bold text-blue-300 border-b border-white/10 w-20">삭제</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedAlliances
                    .filter(a => activeTab === 'active' ? a.isActive !== false : a.isActive === false)
                    .map((a) => (
                      <tr key={a.name} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <Input
                            value={a.name}
                            onChange={e => updateAlliance(a.name, 'name', e.target.value)}
                            className="bg-slate-700/50 border-white/20"
                            placeholder="연맹명 입력"
                          />
                        </td>
                        {a.guilds.map((g, gIdx) => (
                          <td key={gIdx} className="px-4 py-3">
                            <Input
                              value={g}
                              onChange={e => {
                                const updated = [...a.guilds];
                                updated[gIdx] = e.target.value;
                                updateAlliance(a.name, 'guilds', updated);
                              }}
                              className="bg-slate-700/50 border-white/20"
                              placeholder={`길드 ${gIdx + 1}`}
                            />
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 4 - a.guilds.length) }).map((_, i) => (
                          <td key={`empty-${i}`} className="px-4 py-3" />
                        ))}
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            onClick={() => updateAlliance(a.name, 'guilds', [...a.guilds, ''])}
                            className="hover:bg-white/10"
                          >
                            +
                          </Button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-3 justify-center">
                            {TIERS.map((tier) => (
                              <label key={tier} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={a.tiers.includes(tier)}
                                  onChange={() => toggleTier(a.name, tier)}
                                  className="w-4 h-4 rounded border-gray-600"
                                />
                                <span className="text-sm">{tier}</span>
                              </label>
                            ))}
                          </div>
                        </td>
                        {activeTab === 'active' && (
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              onClick={async () => {
                                if (confirm(`${a.name} 연맹을 해체하시겠습니까?`)) {
                                  try {
                                    const response = await fetch('/api/admin/alliances/deactivate', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ allianceName: a.name })
                                    })
                                    
                                    if (response.ok) {
                                      // 로컬 상태에서 연맹을 비활성화 상태로 표시 (제거하지 않음)
                                      setAlliances(alliances.map(alliance => 
                                        alliance.name === a.name 
                                          ? { ...alliance, isActive: false }
                                          : alliance
                                      ))
                                      alert('연맹이 해체되었습니다.')
                                    } else {
                                      alert('연맹 해체에 실패했습니다.')
                                    }
                                  } catch (error) {
                                    console.error('연맹 해체 오류:', error)
                                    alert('연맹 해체 중 오류가 발생했습니다.')
                                  }
                                }
                              }}
                              className="hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300"
                            >
                              해체
                            </Button>
                          </td>
                        )}
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            onClick={() => setAlliances(alliances.filter(alliance => alliance.name !== a.name))}
                            className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          >
                            삭제
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
