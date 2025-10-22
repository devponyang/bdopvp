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
    class: entry?.class || (isOverall ? '' : selectedClass), // 클래스별 랭킹에서는 해당 클래스명으로 자동 채움
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
    
    // 클래스별 랭킹에서 클래스 필드가 비어있으면 자동으로 해당 클래스명으로 채움
    if (!isOverall && field === 'class' && (!newEntry.class || newEntry.class.trim() === '')) {
      newEntry.class = selectedClass
    }
    
    updated[index] = newEntry

    if (isOverall) {
      setOverall(updated)
    } else {
      setClassData(prev => ({ ...prev, [selectedClass]: updated }))
    }
  }

  // 클래스별 자동 매칭 함수
  const handleAutoMatch = () => {
    if (!isOverall) {
      alert('전체 랭킹에서만 클래스별 자동 매칭이 가능합니다.')
      return
    }

    if (overall.length === 0) {
      alert('전체 랭킹 데이터가 없습니다.')
      return
    }

    // 전체 랭킹에서 클래스별로 데이터 분류
    const newClassData: Record<string, Entry[]> = {}
    
    // 각 클래스별로 빈 배열 초기화
    const allClasses = [
      '워리어', '하사신', '세이지', '레인저', '가디언', '스칼라', '드라카니아',
      '소서러', '노바', '커세어', '란', '자이언트', '매구', '금수랑', '샤이',
      '격투가', '무사', '매화', '미스틱', '발키리', '쿠노이치', '닌자', '다크나이트',
      '위자드', '아처', '우사', '위치', '도사', '데드아이'
    ]
    
    allClasses.forEach(cls => {
      newClassData[cls] = []
    })

    // 전체 랭킹에서 각 플레이어를 해당 클래스에 추가
    overall.forEach(entry => {
      if (entry.class && entry.class.trim() && entry.name && entry.name.trim()) {
        const className = entry.class.trim()
        if (newClassData[className]) {
          newClassData[className].push({
            ...entry,
            class: className // 클래스명 정리하여 해당 클래스로 설정
          })
        }
      }
    })

    // 각 클래스를 점수순으로 정렬하고 상위 20위까지만 유지
    Object.keys(newClassData).forEach(className => {
      newClassData[className] = newClassData[className]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
    })

    // 클래스 데이터 업데이트
    setClassData(() => newClassData)
    
    alert(`✅ 클래스별 자동 매칭 완료!\n총 ${Object.keys(newClassData).length}개 클래스에 데이터가 분류되었습니다.`)
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{selectedClass} 랭킹</h2>
          {isOverall ? (
            <p className="text-sm text-gray-400 mt-1">
              전체 랭킹에서 클래스별 자동 매칭을 사용하여 각 클래스별 20위까지 자동 정렬할 수 있습니다.
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">
              {selectedClass} 클래스 랭킹 - 클래스 필드는 자동으로 "{selectedClass}"로 설정됩니다.
            </p>
          )}
        </div>
        {isOverall && (
          <button 
            onClick={handleAutoMatch}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg"
          >
            🔄 클래스별 자동 매칭
          </button>
        )}
      </div>
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
                        className={`w-full bg-transparent p-1 text-sm ${!isOverall && key === 'class' ? 'text-gray-500 cursor-default' : ''}`}
                        value={entry[key] as string}
                        onChange={e => handleChange(i, key, e.target.value)}
                        readOnly={!isOverall && key === 'class'} // 클래스별 랭킹에서 클래스 필드 읽기 전용
                        title={!isOverall && key === 'class' ? '클래스별 랭킹에서는 클래스가 자동으로 설정됩니다' : ''}
                      />
                    </td>
                  )
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      <button 
        onClick={handleSave} 
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg mt-4"
      >
        💾 전체 저장
      </button>
    </div>
  )
}
