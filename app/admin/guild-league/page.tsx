'use client'

import { useEffect, useState } from 'react'
import SaveAllButton from './save-all-button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

interface GuildRow {
  id: number
  rank: number
  guild_name: string
  wins: number
  losses: number
  score: number
}

export default function AdminGuildLeaguePage() {
  const [rows, setRows] = useState<GuildRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const isPast = true
  
  // 키보드 내비게이션 (5열: 순위, 길드명, 승, 패, 점수)
  const tableRef = useKeyboardNavigation({ 
    rows: rows.length, 
    cols: 5, 
    disabled: !isPast 
  })

  // 데이터 가져오기 함수
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
      if (parsed.length < 100) {
        const emptyRows = Array.from({ length: 100 - parsed.length }, (_, i) => ({
          id: parsed.length + i + 1,
          rank: parsed.length + i + 1,
          guild_name: '',
          wins: 0,
          losses: 0,
          score: 0,
        }))
        setRows([...parsed, ...emptyRows])
      } else {
        setRows(parsed)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setRows([])
    }
    setLoading(false)
  }

  // 전날 데이터 가져오기 함수
  const fetchYesterdayData = () => {
    const yesterday = new Date(selectedDate)
    yesterday.setDate(yesterday.getDate() - 1)
    fetchData(format(yesterday, 'yyyy-MM-dd'))
  }

  // 초기 데이터 로드
  useEffect(() => {
    fetchData(format(selectedDate, 'yyyy-MM-dd'))
  }, [selectedDate])

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

  if (loading) return <p className="text-center mt-10 text-zinc-400">불러오는 중...</p>

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">🛠️ 길드 리그 날짜별 수정</h1>
        <div className="relative">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ko}
            className="rounded-md border bg-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="bg-zinc-800 text-white px-3 py-2 rounded"
          />
          <button
            onClick={fetchYesterdayData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            전날 데이터 가져오기
          </button>
        </div>
        <span>{format(selectedDate, 'yyyy-MM-dd')} 데이터 수정 중</span>
      </div>
      <table ref={tableRef} className="w-full text-sm border border-zinc-700">
        <thead className="bg-zinc-800 text-gray-300">
          <tr>
            <th className="p-2">순위</th>
            <th className="p-2">길드명</th>
            <th className="p-2">승</th>
            <th className="p-2">패</th>
            <th className="p-2">점수</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-zinc-700">
              <td className="p-2">
                <input
                  type="number"
                  value={row.rank}
                  onChange={(e) => updateRow(idx, 'rank', e.target.value)}
                  className="w-full bg-transparent border px-2 py-1 text-white"
                  disabled={!isPast}
                />
              </td>
              <td className="p-2">
                <input
                  value={row.guild_name}
                  onChange={(e) => updateRow(idx, 'guild_name', e.target.value)}
                  className="w-full bg-transparent border px-2 py-1 text-white"
                  disabled={!isPast}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={row.wins}
                  onChange={(e) => updateRow(idx, 'wins', e.target.value)}
                  className="w-full bg-transparent border px-2 py-1 text-white"
                  disabled={!isPast}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={row.losses}
                  onChange={(e) => updateRow(idx, 'losses', e.target.value)}
                  className="w-full bg-transparent border px-2 py-1 text-white"
                  disabled={!isPast}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={row.score}
                  onChange={(e) => updateRow(idx, 'score', e.target.value)}
                  className="w-full bg-transparent border px-2 py-1 text-white"
                  disabled={!isPast}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SaveAllButton data={rows} date={selectedDate} disabled={!isPast} />
    </div>
  )
}
