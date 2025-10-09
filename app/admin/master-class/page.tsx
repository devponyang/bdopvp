'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/ui/button'

interface Tournament {
  id: number
  tournament_name: string
  tournament_year: number
  start_date: string
  end_date: string
  registration_start_date: string
  registration_end_date: string
  is_active: boolean
  description: string
  requirements: string
  created_at: string
}

interface Participant {
  id: number
  tournament_id: number
  player_name: string
  class_name: string
  subclass: string
  gear_score: number
  attack_power: number
  defense_power: number
  total_ap_dp: number
  is_qualified: boolean
  registration_date: string
}

export default function MasterClassAdminPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tournaments' | 'participants'>('tournaments')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tournamentsRes, participantsRes] = await Promise.all([
        fetch('/api/admin/master-class/tournaments'),
        fetch('/api/admin/master-class/participants')
      ])
      
      const tournamentsData = await tournamentsRes.json()
      const participantsData = await participantsRes.json()
      
      setTournaments(tournamentsData)
      setParticipants(participantsData)
    } catch (error) {
      console.error('데이터 로딩 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const getStatusBadge = (tournament: Tournament) => {
    const now = new Date()
    const regStart = new Date(tournament.registration_start_date)
    const regEnd = new Date(tournament.registration_end_date)
    const start = new Date(tournament.start_date)
    const end = new Date(tournament.end_date)

    if (now < regStart) {
      return <span className="px-2 py-1 bg-gray-500 text-white rounded text-xs">대기중</span>
    } else if (now >= regStart && now <= regEnd) {
      return <span className="px-2 py-1 bg-green-500 text-white rounded text-xs">신청중</span>
    } else if (now > regEnd && now < start) {
      return <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs">준비중</span>
    } else if (now >= start && now <= end) {
      return <span className="px-2 py-1 bg-red-500 text-white rounded text-xs">진행중</span>
    } else {
      return <span className="px-2 py-1 bg-gray-400 text-white rounded text-xs">종료</span>
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
        <h1 className="text-2xl font-bold text-white">마스터 클래스 관리</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setActiveTab('tournaments')}
            className={activeTab === 'tournaments' ? 'bg-blue-600' : 'bg-zinc-700'}
          >
            대회 관리
          </Button>
          <Button 
            onClick={() => setActiveTab('participants')}
            className={activeTab === 'participants' ? 'bg-blue-600' : 'bg-zinc-700'}
          >
            참가자 관리
          </Button>
        </div>
      </div>

      {activeTab === 'tournaments' && (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">대회 목록</h2>
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{tournament.tournament_name}</h3>
                      <p className="text-gray-400 text-sm">{tournament.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(tournament)}
                      {tournament.is_active && (
                        <span className="px-2 py-1 bg-yellow-500 text-black rounded text-xs font-semibold">활성</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">신청 기간:</span>
                      <p className="text-white">{formatDate(tournament.registration_start_date)} ~ {formatDate(tournament.registration_end_date)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">대회 기간:</span>
                      <p className="text-white">{formatDate(tournament.start_date)} ~ {formatDate(tournament.end_date)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">자격 요건:</span>
                      <p className="text-white">{tournament.requirements}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">참가자 수:</span>
                      <p className="text-white">{participants.filter(p => p.tournament_id === tournament.id).length}명</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">참가자 목록</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white bg-zinc-700">
                    <th className="px-3 py-2 text-left">이름</th>
                    <th className="px-3 py-2 text-left">클래스</th>
                    <th className="px-3 py-2 text-left">AP</th>
                    <th className="px-3 py-2 text-left">DP</th>
                    <th className="px-3 py-2 text-left">합계</th>
                    <th className="px-3 py-2 text-left">자격</th>
                    <th className="px-3 py-2 text-left">신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="border-b border-zinc-700">
                      <td className="px-3 py-2 text-white">{participant.player_name}</td>
                      <td className="px-3 py-2 text-white">{participant.class_name}</td>
                      <td className="px-3 py-2 text-white">{participant.attack_power}</td>
                      <td className="px-3 py-2 text-white">{participant.defense_power}</td>
                      <td className="px-3 py-2 text-white">{participant.total_ap_dp}</td>
                      <td className="px-3 py-2">
                        {participant.is_qualified ? (
                          <span className="px-2 py-1 bg-green-500 text-white rounded text-xs">자격</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500 text-white rounded text-xs">미자격</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-400">{formatDate(participant.registration_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
