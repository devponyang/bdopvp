'use client'

import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

export interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
}

interface Props {
  selectedClass: string
  overall: Entry[]
  classData: Record<string, Entry[]>
  setOverall: (data: Entry[]) => void
  setClassData: (fn: (prev: Record<string, Entry[]>) => Record<string, Entry[]>) => void
}

export default function SolareAdminForm({
  selectedClass,
  overall,
  classData,
  setOverall,
  setClassData
}: Props) {
  const isOverall = selectedClass === '전체'
  const data = isOverall ? overall : (classData[selectedClass] ?? [])
  
  // 키보드 내비게이션 (7열: 가문명, 전승/각성, 클래스, 승, 무, 패, 점수)
  const tableRef = useKeyboardNavigation({ 
    rows: isOverall ? 100 : 20, 
    cols: 7, 
    disabled: false 
  })

  const ensureEntry = (entry?: Entry): Entry => ({
    name: entry?.name || '',
    subclass: entry?.subclass || '',
    class: entry?.class || '',
    wins: entry?.wins ?? 0,
    draws: entry?.draws ?? 0,
    losses: entry?.losses ?? 0,
    score: entry?.score ?? 0,
  })

  const handleChange = (index: number, field: keyof Entry, value: string) => {
    const updated = [...data]
    const entry = ensureEntry(updated[index])
    const newEntry: Entry = {
      ...entry,
      [field]: ['wins', 'draws', 'losses', 'score'].includes(field)
        ? parseInt(value) || 0
        : value
    }
    updated[index] = newEntry

    if (isOverall) {
      setOverall(updated)
    } else {
      setClassData(prev => ({ ...prev, [selectedClass]: updated }))
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/solare/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overall, classData })
      })
      
      if (res.ok) {
        alert('✅ 솔라레 데이터 저장 완료!')
      } else {
        const errorData = await res.json().catch(() => ({ detail: '네트워크 오류가 발생했습니다.' }))
        console.error('❌ 솔라레 저장 실패:', errorData)
        alert(`❌ 저장 실패: ${errorData.detail || errorData.message || '알 수 없는 오류가 발생했습니다.'}`)
      }
    } catch (error) {
      console.error('❌ 솔라레 저장 중 예외 발생:', error)
      alert(`❌ 저장 실패: 네트워크 연결을 확인해주세요. (${error instanceof Error ? error.message : '알 수 없는 오류'})`)
    }
  }

  return (
    <div className="space-y-4 text-base">
      <h2 className="text-xl font-semibold">{selectedClass} 랭킹</h2>
      <table ref={tableRef} className="w-full text-lg border border-gray-700">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border p-2 text-sm">순위</th>
            <th className="border p-2 text-lg">가문명</th>
            <th className="border p-2 text-lg">전승/각성</th>
            <th className="border p-2 text-lg">클래스</th>
            <th className="border p-2 text-lg">승</th>
            <th className="border p-2 text-lg">무</th>
            <th className="border p-2 text-lg">패</th>
            <th className="border p-2 text-lg">점수</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: isOverall ? 100 : 20 }).map((_, i) => {
            const entry = ensureEntry(data[i])
            return (
              <tr key={i}>
                <td className="border p-2 text-center text-sm">{i + 1}</td>
                {(Object.keys(entry) as (keyof Entry)[]).map((key) =>
                  ['wins', 'draws', 'losses', 'score'].includes(key) ? (
                    <td key={key} className="border p-1">
                      <input
                        type="number"
                        className="w-full bg-transparent p-1 text-sm"
                        value={entry[key]}
                        onChange={e => handleChange(i, key, e.target.value)}
                      />
                    </td>
                  ) : (
                    <td key={key} className="border p-1">
                      <input
                        className="w-full bg-transparent p-1 text-sm"
                        value={entry[key] as string}
                        onChange={e => handleChange(i, key, e.target.value)}
                      />
                    </td>
                  )
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded mt-2">
        전체 저장
      </button>
    </div>
  )
}
