'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/card'
import SolareTable from '@/components/solare/SolareTable'

interface Season {
  id: number
  season_name: string
  season_number: number
  start_date: string
  end_date?: string
  is_active: boolean
  description?: string
}

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  rank?: number
}

export default function SeasonDetailPage() {
  const params = useParams()
  const seasonId = params.id as string
  
  const [season, setSeason] = useState<Season | null>(null)
  const [overallData, setOverallData] = useState<Entry[]>([])
  const [classData, setClassData] = useState<Record<string, Entry[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string>('전체')

  useEffect(() => {
    if (seasonId) {
      loadSeasonData()
    }
  }, [seasonId])

  const loadSeasonData = async () => {
    try {
      const response = await fetch(`/api/admin/solare/season-data?seasonId=${seasonId}`)
      const data = await response.json()
      
      setSeason(data.season)
      setOverallData(data.overall)
      setClassData(data.classData)
    } catch (error) {
      console.error('시즌 데이터 로딩 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const getClassList = () => {
    const classes = Object.keys(classData)
    return ['전체', ...classes]
  }

  const getCurrentData = () => {
    if (selectedClass === '전체') {
      return overallData
    }
    return classData[selectedClass] || []
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  if (!season) {
    return (
      <div className="p-6">
        <div className="text-white">시즌을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 시즌 정보 */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {season.season_name}
        </h1>
        <div className="text-gray-400 space-y-1">
          <p>시즌 #{season.season_number}</p>
          <p>기간: {season.start_date} ~ {season.end_date || '진행중'}</p>
          {season.description && (
            <p>설명: {season.description}</p>
          )}
        </div>
      </Card>

      {/* 클래스 선택 */}
      <Card className="p-4">
        <div className="flex gap-2 flex-wrap">
          {getClassList().map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedClass === className
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
              }`}
            >
              {className}
            </button>
          ))}
        </div>
      </Card>

      {/* 데이터 테이블 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          {selectedClass === '전체' ? '전체 랭킹' : `${selectedClass} 랭킹`}
        </h2>
        <SolareTable data={getCurrentData()} />
      </Card>
    </div>
  )
}
