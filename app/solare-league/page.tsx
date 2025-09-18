'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import ClassSelector from '@/components/solare/ClassSelector'
import SeasonSelector from '@/components/solare/SeasonSelector'
import SolareTable from '@/components/solare/SolareTable'
import { getTier } from '@/lib/utils/tier'
import PonyangLoading from '../components/PonyangLoading'
import { Card } from '@/components/card'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  rankChange?: string
  tier?: string // ⬅️ UI 표시용으로 클라이언트에서 추가
}

export default function SolareOverallPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<Entry[]>([])
  const [updateDate, setUpdateDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)

  const fetchData = useCallback((seasonId: number | null = null) => {
    setLoading(true)
    
    const url = seasonId 
      ? `/api/solare-league/season?seasonId=${seasonId}`
      : '/api/solare-league/overall'
    
    
    fetch(url)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
        }
        
        const text = await res.text()
        try {
          return JSON.parse(text)
        } catch (jsonError) {
          console.error('JSON 파싱 에러:', text)
          throw new Error('서버에서 잘못된 응답을 받았습니다.')
        }
      })
      .then((raw: Entry[]) => {
        const withTier = raw.map(entry => ({
          ...entry,
          tier: entry.tier || getTier(entry.score)
        }))
        setData(withTier)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // URL 파라미터에서 시즌 ID 확인
    const urlSeasonId = searchParams.get('seasonId')
    
    const loadInitialData = async () => {
      try {
        if (urlSeasonId) {
          // URL에 시즌 ID가 있으면 해당 시즌 데이터 로드
          const seasonId = parseInt(urlSeasonId)
          console.log('URL에서 시즌 ID 발견:', seasonId)
          setSelectedSeasonId(seasonId)
          fetchData(seasonId)
        } else {
          // URL에 시즌 ID가 없으면 활성 시즌 확인 후 데이터 로드
          const response = await fetch('/api/admin/solare/seasons')
          const seasons = await response.json()
          console.log('시즌 목록:', seasons)
          const activeSeason = seasons.find((season: any) => season.is_active)
          console.log('활성 시즌:', activeSeason)
          
          if (activeSeason) {
            console.log('활성 시즌으로 데이터 로드:', activeSeason.id)
            setSelectedSeasonId(activeSeason.id)
            fetchData(activeSeason.id)
          } else {
            console.log('활성 시즌 없음, 기본 데이터 로드')
            setSelectedSeasonId(null)
            fetchData() // 활성 시즌이 없으면 기본 데이터
          }
        }
      } catch (error) {
        console.error('초기 데이터 로딩 오류:', error)
        fetchData() // 오류 시 기본 데이터
      }
    }

    loadInitialData()
    
    // Fetch the update date (KST)
    const currentDate = new Date()
    const kstDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
    setUpdateDate(kstDate.toISOString().split('T')[0]) // YYYY-MM-DD 형식으로 표시
  }, [searchParams, fetchData])

  const handleSeasonChange = useCallback((seasonId: number | null) => {
    console.log('메인 페이지 - handleSeasonChange 호출:', seasonId)
    setSelectedSeasonId(seasonId)
    fetchData(seasonId)
  }, [fetchData])

  if (loading) return <PonyangLoading />

  return (
    <Card className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-3 md:p-6 rounded-2xl shadow-lg flex items-center justify-center mb-2">
        <h2 className="text-2xl md:text-4xl text-center font-bold text-white flex items-center gap-2 m-0">
          <span className="text-2xl md:text-4xl">🌟</span>
          <span className="text-lg md:text-4xl">솔라레의 창 - 정규 시즌 순위</span>
        </h2>
      </div>
      <div className="flex justify-between w-full text-sm text-white mt-2 px-2 mb-4">
        <span>⏰ 매일 오전 중에 업데이트 중입니다.</span>
        <span>📅 {updateDate}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <SeasonSelector onSeasonChange={handleSeasonChange} selectedSeasonId={selectedSeasonId} />
        <ClassSelector selectedSeasonId={selectedSeasonId} />
      </div>
      <SolareTable data={data} />
    </Card>
  )
}
