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
const RESULTS = ['점령성공', '점령실패']
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
    result: '점령실패',
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

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8 bg-gray-900 rounded-2xl">
      {/* 전투 기록 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">⚔️ 전투 기록</h2>
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

        <div className="bg-gray-800 rounded-2xl p-4 shadow">
          <table className="w-full text-center text-white text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="border px-2 py-1 text-left">연맹명</th>
                <th className="border px-2 py-1 text-left">성채단계</th>
                <th className="border px-2 py-1 text-left">점령지역</th>
                <th className="border px-2 py-1 text-left">결과</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-white font-semibold">
                    <Input value={row.alliance_name} onChange={(e) => updateRecord(idx, 'alliance_name', e.target.value)} />
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={row.fort_stage ?? ''}
                      onChange={(e) => updateRecord(idx, 'fort_stage', Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1 text-white font-semibold">
                    <Input value={row.occupied_area} onChange={(e) => updateRecord(idx, 'occupied_area', e.target.value)} />
                  </td>
                  <td className="border px-2 py-1 text-white font-semibold">
                    <Select value={row.result} onValueChange={(val) => updateRecord(idx, 'result', val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RESULTS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setRecords(prev => ({
              ...prev,
              [getKey()]: [...(records[getKey()] ?? []), {
                alliance_name: '', fort_stage: null, occupied_area: '', result: '점령실패'
              }]
            }))}>
              + 기록 추가
            </Button>
            <Button onClick={saveRecords}>💾 전체 저장</Button>
          </div>
        </div>
      </div>

      {/* 연맹 등록 */}
      <div className="mt-10 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">⚔️ 연맹 등록</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setAlliances([...alliances, { name: '', guilds: [''], tiers: [], isActive: true }])}
              className="flex items-center gap-2"
            >
              <span>+ 연맹 추가</span>
            </Button>
            <Button 
              onClick={saveAlliances}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <span>💾 연맹 저장</span>
            </Button>
          </div>
        </div>

        {/* 연맹 관리 탭 */}
        <div className="space-y-4">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'active'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              활성 연맹
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              해체 연맹
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">연맹명</th>
                    <th className="px-4 py-3 text-left font-medium" colSpan={4}>길드명</th>
                    <th className="px-4 py-3 text-center font-medium w-20">+ 길드</th>
                    <th className="px-4 py-3 text-center font-medium">단계</th>
                    {activeTab === 'active' && (
                      <>
                        <th className="px-4 py-3 text-center font-medium w-20">해체</th>
                        <th className="px-4 py-3 text-center font-medium w-20">삭제</th>
                      </>
                    )}
                    {activeTab === 'inactive' && (
                      <th className="px-4 py-3 text-center font-medium w-20">삭제</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedAlliances
                    .filter(a => activeTab === 'active' ? a.isActive !== false : a.isActive === false)
                    .map((a) => (
                      <tr key={a.name} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <Input
                            value={a.name}
                            onChange={e => updateAlliance(a.name, 'name', e.target.value)}
                            className="bg-transparent border-gray-600"
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
                              className="bg-transparent border-gray-600"
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
                            className="hover:bg-muted/60"
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
