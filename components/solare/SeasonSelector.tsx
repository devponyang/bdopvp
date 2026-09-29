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
        const data = await (await fetch('/api/admin/solare/seasons')).json()
        const sorted = data.sort((a: Season, b: Season) => b.season_number - a.season_number)
        setSeasons(sorted)
        if (selectedSeasonId !== undefined) {
          setSelectedSeason(selectedSeasonId === null ? 'current' : selectedSeasonId.toString())
        } else {
          const active = sorted.find((s: Season) => s.is_active)
          setSelectedSeason(active ? active.id.toString() : sorted[0]?.id.toString() ?? 'current')
        }
      } catch { /* silent */ }
    }
    fetchSeasons()
  }, [])

  useEffect(() => {
    if (selectedSeasonId === null) setSelectedSeason('current')
    else if (selectedSeasonId) setSelectedSeason(selectedSeasonId.toString())
  }, [selectedSeasonId])

  const handleChange = (value: string) => {
    setSelectedSeason(value)
    onSeasonChange(value === 'current' ? null : parseInt(value))
  }

  const hasActive = seasons.some(s => s.is_active)

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">시즌</span>
      <Select value={selectedSeason} onValueChange={handleChange}>
        <SelectTrigger className="w-48 text-sm text-zinc-200 bg-zinc-900 border-zinc-700 hover:border-cyan-500/50 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-colors">
          <SelectValue placeholder="시즌 선택" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700">
          {!hasActive && (
            <SelectItem value="current" className="text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 text-sm">
              현재 시즌
            </SelectItem>
          )}
          {seasons.map((s) => (
            <SelectItem
              key={s.id}
              value={s.id.toString()}
              className="text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 text-sm"
            >
              <div className="flex items-center gap-2">
                {s.season_name}
                {s.is_active && (
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
                    현재
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
