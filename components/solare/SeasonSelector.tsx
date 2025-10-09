'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Season {
  id: number
  season_name: string
  season_number: number
  is_active: boolean
}

interface SeasonSelectorProps {
  onSeasonChange: (seasonId: number | null) => void
  selectedSeasonId?: number | null
}

export default function SeasonSelector({ onSeasonChange, selectedSeasonId }: SeasonSelectorProps) {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<string>('')

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch('/api/admin/solare/seasons')
        const data = await response.json()
        const sortedSeasons = data.sort((a: Season, b: Season) => b.season_number - a.season_number)
        setSeasons(sortedSeasons)
        
        // 부모에서 전달받은 selectedSeasonId가 있으면 그것을 사용
        if (selectedSeasonId !== undefined) {
          if (selectedSeasonId === null) {
            setSelectedSeason('current')
          } else {
            setSelectedSeason(selectedSeasonId.toString())
          }
        } else {
          // 부모에서 전달받은 값이 없으면 활성 시즌을 기본값으로 설정
          const activeSeason = sortedSeasons.find((season: Season) => season.is_active)
          if (activeSeason) {
            setSelectedSeason(activeSeason.id.toString())
          } else {
            // 활성 시즌이 없으면 가장 최근 시즌을 기본값으로 설정
            if (sortedSeasons.length > 0) {
              setSelectedSeason(sortedSeasons[0].id.toString())
            } else {
              setSelectedSeason('current')
            }
          }
        }
      } catch (error) {
        console.error('시즌 목록을 불러오는데 실패했습니다:', error)
      }
    }

    fetchSeasons()
  }, [])

  // 부모 컴포넌트에서 전달받은 selectedSeasonId에 따라 UI 업데이트
  useEffect(() => {
    if (selectedSeasonId === null) {
      setSelectedSeason('current')
    } else if (selectedSeasonId) {
      setSelectedSeason(selectedSeasonId.toString())
    }
  }, [selectedSeasonId])

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(value)
    if (value === 'current') {
      onSeasonChange(null) // 현재 시즌
    } else {
      onSeasonChange(parseInt(value))
    }
  }

  const hasActiveSeason = seasons.some(season => season.is_active)

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm font-medium">시즌:</span>
      <Select value={selectedSeason} onValueChange={handleSeasonChange}>
        <SelectTrigger className="w-48 bg-zinc-800 border-zinc-600 text-white">
          <SelectValue placeholder="시즌 선택" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-600">
          {!hasActiveSeason && (
            <SelectItem value="current" className="text-white hover:bg-zinc-700">
              현재 시즌
            </SelectItem>
          )}
          {seasons.map((season) => (
            <SelectItem 
              key={season.id} 
              value={season.id.toString()}
              className="text-white hover:bg-zinc-700"
            >
              {season.season_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
