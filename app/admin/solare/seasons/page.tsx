'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Season {
  id: number
  season_name: string
  season_number: number
  start_date: string
  end_date?: string
  is_active: boolean
  description?: string
  created_at: string
}

export default function SolareSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewSeasonForm, setShowNewSeasonForm] = useState(false)
  const [newSeason, setNewSeason] = useState({
    seasonName: '',
    seasonNumber: 1,
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  })

  useEffect(() => {
    loadSeasons()
  }, [])

  const loadSeasons = async () => {
    try {
      const response = await fetch('/api/admin/solare/seasons')
      const data = await response.json()
      setSeasons(data)
    } catch (error) {
      console.error('시즌 목록 로딩 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewSeason = async () => {
    try {
      const response = await fetch('/api/admin/solare/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeason)
      })
      
      if (response.ok) {
        alert('새 시즌이 생성되었습니다!')
        setShowNewSeasonForm(false)
        setNewSeason({
          seasonName: '',
          seasonNumber: 1,
          startDate: new Date().toISOString().split('T')[0],
          description: ''
        })
        loadSeasons()
      } else {
        alert('시즌 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('시즌 생성 오류:', error)
      alert('시즌 생성 중 오류가 발생했습니다.')
    }
  }

  const archiveSeason = async (seasonId: number) => {
    if (!confirm('현재 시즌을 종료하고 데이터를 보관하시겠습니까?')) return
    
    try {
      const response = await fetch('/api/admin/solare/archive-season', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seasonId, 
          endDate: new Date().toISOString().split('T')[0] 
        })
      })
      
      if (response.ok) {
        alert('시즌이 성공적으로 보관되었습니다!')
        loadSeasons()
      } else {
        alert('시즌 보관에 실패했습니다.')
      }
    } catch (error) {
      console.error('시즌 보관 오류:', error)
      alert('시즌 보관 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">솔라레 시즌 관리</h1>
        <Button 
          onClick={() => setShowNewSeasonForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          새 시즌 생성
        </Button>
      </div>

      {/* 새 시즌 생성 폼 */}
      {showNewSeasonForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">새 시즌 생성</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                시즌 이름
              </label>
              <Input
                value={newSeason.seasonName}
                onChange={(e) => setNewSeason({...newSeason, seasonName: e.target.value})}
                placeholder="예: 솔라레의 창 시즌 2"
                className="bg-zinc-800 text-white border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                시즌 번호
              </label>
              <Input
                type="number"
                value={newSeason.seasonNumber}
                onChange={(e) => setNewSeason({...newSeason, seasonNumber: parseInt(e.target.value)})}
                className="bg-zinc-800 text-white border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                시작일
              </label>
              <Input
                type="date"
                value={newSeason.startDate}
                onChange={(e) => setNewSeason({...newSeason, startDate: e.target.value})}
                className="bg-zinc-800 text-white border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                설명
              </label>
              <Input
                value={newSeason.description}
                onChange={(e) => setNewSeason({...newSeason, description: e.target.value})}
                placeholder="시즌에 대한 설명 (선택사항)"
                className="bg-zinc-800 text-white border-zinc-600"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createNewSeason} className="bg-green-600 hover:bg-green-700">
                생성
              </Button>
              <Button 
                onClick={() => setShowNewSeasonForm(false)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                취소
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 시즌 목록 */}
      <div className="grid gap-4">
        {seasons.map((season) => (
          <Card key={season.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {season.season_name}
                  {season.is_active && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded">
                      활성
                    </span>
                  )}
                </h3>
                <p className="text-gray-400 mt-1">
                  시즌 #{season.season_number} • {season.start_date} ~ {season.end_date || '진행중'}
                </p>
                {season.description && (
                  <p className="text-gray-300 mt-2">{season.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                {season.is_active && (
                  <Button
                    onClick={() => archiveSeason(season.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    시즌 종료
                  </Button>
                )}
                <Button
                  onClick={() => window.open(`/admin/solare/seasons/${season.id}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  데이터 보기
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
