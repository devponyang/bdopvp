'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import classList from '@/lib/constants/class-list'
import SolareTable from './SolareTable'
import ClassSelector from './ClassSelector'
import SeasonSelector from './SeasonSelector'
import PonyangLoading from '../../app/components/PonyangLoading'
import ErrorMessage from '../../app/components/ErrorMessage'
import { Card } from '@/components/card'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  tier: string
  rankChange?: string // ✅ 순위 변동
}

export default function SolareClassClient() {
  const params = useParams()
  const searchParams = useSearchParams()
  const className = decodeURIComponent(params?.class as string || '')
  const [data, setData] = useState<Entry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateDate, setUpdateDate] = useState('')
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)

  useEffect(() => {
    if (!classList.includes(className)) {
      setError('존재하지 않는 클래스입니다.')
      setLoading(false)
      return
    }

    const fetchData = async (seasonId: number | null = null) => {
      try {
        setLoading(true)
        setError(null)
        
        const url = seasonId 
          ? `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${seasonId}`
          : `/api/solare-league/${encodeURIComponent(className)}`
        
        const res = await fetch(url)
        
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
        }
        
        const text = await res.text()
        let result
        try {
          result = JSON.parse(text)
        } catch (jsonError) {
          throw new Error('서버에서 잘못된 응답을 받았습니다.')
        }
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    // URL 파라미터에서 시즌 ID 확인 후 데이터 로드
    const loadInitialData = async () => {
      const urlSeasonId = searchParams.get('seasonId')
      
      try {
        if (urlSeasonId) {
          // URL에 시즌 ID가 있으면 해당 시즌 데이터 로드
          const seasonId = parseInt(urlSeasonId)
          console.log('클래스별 페이지 - URL에서 시즌 ID 발견:', seasonId)
          setSelectedSeasonId(seasonId)
          
          setLoading(true)
          setError(null)
          const url = `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${seasonId}`
          const res = await fetch(url)
          if (res.ok) {
            const result = await res.json()
            setData(result)
          } else {
            throw new Error(`API 요청 실패: ${res.status}`)
          }
          setLoading(false)
        } else {
          // URL에 시즌 ID가 없으면 활성 시즌 확인 후 데이터 로드
          const response = await fetch('/api/admin/solare/seasons')
          const seasons = await response.json()
          const activeSeason = seasons.find((season: any) => season.is_active)
          
          if (activeSeason) {
            setSelectedSeasonId(activeSeason.id)
            // 직접 시즌 데이터 로드
            try {
              setLoading(true)
              setError(null)
              const url = `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${activeSeason.id}`
              const res = await fetch(url)
              if (res.ok) {
                const result = await res.json()
                setData(result)
              } else {
                throw new Error(`API 요청 실패: ${res.status}`)
              }
            } catch (err) {
              console.error('시즌 데이터 로딩 오류:', err)
              fetchData() // 실패 시 기본 데이터로 폴백
            } finally {
              setLoading(false)
            }
          } else {
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
  }, [className, searchParams])

  const handleSeasonChange = useCallback(async (seasonId: number | null) => {
    setSelectedSeasonId(seasonId)
    
    if (!classList.includes(className)) return
    
    try {
      setLoading(true)
      setError(null)
      
      const url = seasonId 
        ? `/api/solare-league/class-season?class=${encodeURIComponent(className)}&seasonId=${seasonId}`
        : `/api/solare-league/${encodeURIComponent(className)}`
      
      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
      }
      
      const text = await res.text()
      let result
      try {
        result = JSON.parse(text)
      } catch (jsonError) {
        throw new Error('서버에서 잘못된 응답을 받았습니다.')
      }
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [className])

  if (loading) return (
    <div className="p-3 md:p-4 max-w-full md:max-w-5xl mx-auto">
      <PonyangLoading message={`${className} 랭킹을 불러오는 중...`} size="md" />
    </div>
  )
  
  if (error) return (
    <div className="p-3 md:p-4 max-w-full md:max-w-5xl mx-auto">
      <ErrorMessage 
        message={`${className} 랭킹 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`}
        onRetry={() => window.location.reload()}
      />
    </div>
  )
  
  if (!data) return (
    <div className="p-3 md:p-4 max-w-full md:max-w-5xl mx-auto">
      <ErrorMessage 
        message={`${className} 랭킹 데이터가 없습니다.`}
        showRetry={false}
      />
    </div>
  )

  return (
    <Card className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-3 md:p-6 rounded-2xl shadow-lg flex items-center justify-center mb-2">
        <h2 className="text-2xl md:text-4xl text-center font-bold text-white flex items-center gap-2 m-0">
          <span className="text-2xl md:text-4xl">🌟</span>
          <span className="text-lg md:text-4xl">솔라레의 창 - {className} 순위</span>
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
