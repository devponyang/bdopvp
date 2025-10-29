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
  const [activeTab, setActiveTab] = useState<'tournaments' | 'participants' | 'matches'>('participants')
  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    tournamentId: '',
    playerName: '',
    className: ''
  })

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
      
      // 활성 대회가 있으면 기본값으로 설정
      const activeTournament = tournamentsData.find((t: Tournament) => t.is_active)
      if (activeTournament) {
        setNewParticipant(prev => ({ ...prev, tournamentId: activeTournament.id.toString() }))
      }
    } catch (error) {
      console.error('데이터 로딩 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddParticipant = async () => {
    if (!newParticipant.playerName || !newParticipant.className) {
      alert('이름과 클래스를 입력해주세요.')
      return
    }

    try {
      const response = await fetch('/api/admin/master-class/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentId: parseInt(newParticipant.tournamentId),
          playerName: newParticipant.playerName,
          className: newParticipant.className,
          subclass: '',
          gearScore: 0,
          attackPower: 0,
          defensePower: 0
        })
      })

      if (response.ok) {
        alert('참가자가 추가되었습니다.')
        setShowAddParticipant(false)
        setNewParticipant({
          tournamentId: tournaments.find(t => t.is_active)?.id.toString() || '',
          playerName: '',
          className: ''
        })
        loadData()
      } else {
        alert('참가자 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('참가자 추가 오류:', error)
      alert('참가자 추가 중 오류가 발생했습니다.')
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
          <Button 
            onClick={() => setActiveTab('matches')}
            className={activeTab === 'matches' ? 'bg-blue-600' : 'bg-zinc-700'}
          >
            매칭 관리
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">참가자 목록</h2>
              <Button
                onClick={() => setShowAddParticipant(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                + 참가자 추가
              </Button>
            </div>
            
            {participants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">등록된 참가자가 없습니다.</p>
                <p className="text-gray-500 text-sm mt-2">위의 "참가자 추가" 버튼을 클릭하여 참가자를 등록하세요.</p>
              </div>
            ) : (
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
                        <td className="px-3 py-2 text-white">{participant.attack_power || '-'}</td>
                        <td className="px-3 py-2 text-white">{participant.defense_power || '-'}</td>
                        <td className="px-3 py-2 text-white">{participant.total_ap_dp || '-'}</td>
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
            )}
          </Card>

          {/* 참가자 추가 모달 */}
          {showAddParticipant && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">참가자 추가</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">이름</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    value={newParticipant.playerName}
                    onChange={(e) => setNewParticipant({ ...newParticipant, playerName: e.target.value })}
                    placeholder="예: 눈여아"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">클래스</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    value={newParticipant.className}
                    onChange={(e) => setNewParticipant({ ...newParticipant, className: e.target.value })}
                    placeholder="예: 드라카니아"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddParticipant}
                  className="bg-green-600 hover:bg-green-700"
                >
                  추가
                </Button>
                <Button
                  onClick={() => setShowAddParticipant(false)}
                  className="bg-zinc-700 hover:bg-zinc-600"
                >
                  취소
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">매칭 관리</h2>
            <p className="text-gray-400 mb-4">
              참가자를 추가한 후 클래스별로 매칭을 생성하세요.
            </p>
            
            <MatchManager tournaments={tournaments} participants={participants} />
          </Card>
        </div>
      )}
    </div>
  )
}

// 매칭 관리 컴포넌트
function MatchManager({ tournaments, participants }: { tournaments: Tournament[], participants: Participant[] }) {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedTournament, setSelectedTournament] = useState('')
  const [matches, setMatches] = useState<any[]>([])
  const [selectedRound, setSelectedRound] = useState(32)

  // 클래스 목록 추출
  const classList = Array.from(new Set(participants.map(p => p.class_name))).filter(Boolean)

  // 토너먼트 초기값 설정
  useEffect(() => {
    if (tournaments.length > 0 && !selectedTournament) {
      const activeTournament = tournaments.find(t => t.is_active) || tournaments[0]
      setSelectedTournament(activeTournament.id.toString())
    }
  }, [tournaments, selectedTournament])

  const loadMatches = async () => {
    if (!selectedClass || !selectedTournament) {
      console.log('loadMatches: 클래스나 토너먼트가 선택되지 않음', { selectedClass, selectedTournament })
      return
    }
    
    try {
      const url = `/api/master-class/matches?className=${encodeURIComponent(selectedClass)}&tournamentId=${selectedTournament}`
      console.log('loadMatches 호출:', url)
      const response = await fetch(url)
      const data = await response.json()
      console.log('매칭 데이터:', data)
      setMatches(data)
    } catch (error) {
      console.error('매칭 로딩 오류:', error)
    }
  }

  useEffect(() => {
    loadMatches()
  }, [selectedClass, selectedTournament])

  const addMatch = async (player1Id: number, player2Id: number) => {
    if (!selectedClass || !selectedTournament) {
      alert('클래스와 토너먼트를 선택해주세요.')
      return
    }

    if (!player1Id || !player2Id) {
      alert('두 선수를 모두 선택해주세요.')
      return
    }

    if (player1Id === player2Id) {
      alert('같은 선수끼리는 매칭할 수 없습니다.')
      return
    }

    try {
      const matchData = {
        tournament_id: parseInt(selectedTournament),
        round_number: selectedRound,
        match_number: matches.length + 1,
        player1_id: player1Id,
        player2_id: player2Id
      }
      console.log('매칭 추가 요청:', matchData)
      
      const response = await fetch('/api/admin/master-class/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('매칭 추가 성공:', result)
        alert('매칭이 추가되었습니다!')
        loadMatches()
      } else {
        const errorText = await response.text()
        console.error('매칭 추가 실패:', errorText)
        alert('매칭 추가에 실패했습니다: ' + errorText)
      }
    } catch (error) {
      console.error('매칭 추가 오류:', error)
      alert('매칭 추가 중 오류가 발생했습니다.')
    }
  }

  const deleteMatch = async (matchId: number) => {
    if (!confirm('이 매칭을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/master-class/matches/${matchId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('매칭이 삭제되었습니다!')
        loadMatches()
      } else {
        const errorText = await response.text()
        console.error('매칭 삭제 실패:', errorText)
        alert('매칭 삭제에 실패했습니다: ' + errorText)
      }
    } catch (error) {
      console.error('매칭 삭제 오류:', error)
      alert('매칭 삭제 중 오류가 발생했습니다.')
    }
  }


  return (
    <div className="space-y-4">
      {/* 클래스 선택 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">토너먼트</label>
          <select
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
          >
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.tournament_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">클래스</label>
          <select
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">클래스를 선택하세요</option>
            {classList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && (
        <>
          <div>
            <label className="block text-sm text-gray-300 mb-1">라운드</label>
            <select
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white mb-4"
              value={selectedRound}
              onChange={(e) => setSelectedRound(parseInt(e.target.value))}
            >
              <option value={32}>32강</option>
              <option value={16}>16강</option>
              <option value={8}>8강</option>
              <option value={4}>4강</option>
              <option value={2}>결승</option>
            </select>
          </div>
          
          {/* 매칭 추가 폼 */}
          <MatchAdder 
            participants={participants.filter(p => p.class_name === selectedClass && p.tournament_id === parseInt(selectedTournament))}
            onAddMatch={addMatch}
          />

          {/* 참가자 목록 */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {selectedClass} 참가자 ({participants.filter(p => p.class_name === selectedClass && p.tournament_id === parseInt(selectedTournament)).length}명)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {participants
                .filter(p => p.class_name === selectedClass && p.tournament_id === parseInt(selectedTournament))
                .map((p, idx) => (
                  <div key={p.id} className="bg-zinc-800 rounded p-2 text-white text-sm">
                    {idx + 1}. {p.player_name}
                  </div>
                ))}
            </div>
          </div>

          {/* 생성된 매칭 목록 */}
          {matches.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-3">생성된 매칭 ({matches.length}개)</h3>
              <div className="space-y-3">
                {matches.map((match) => {
                  const p1 = participants.find(p => p.id === match.player1_id)
                  const p2 = participants.find(p => p.id === match.player2_id)
                  return (
                    <div key={match.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 text-white">
                            <div className="font-bold">{p1?.player_name || 'TBA'}</div>
                            <span className="text-purple-400 font-bold">VS</span>
                            <div className="font-bold">{p2?.player_name || 'TBA'}</div>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {match.round_number}강 - 매치 {match.match_number}
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteMatch(match.id)}
                          className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mt-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <p className="text-gray-400 text-center">생성된 매칭이 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// 매칭 추가 컴포넌트
function MatchAdder({ participants, onAddMatch }: { participants: Participant[], onAddMatch: (p1: number, p2: number) => void }) {
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')

  const handleAdd = () => {
    if (!player1 || !player2) {
      alert('두 선수를 모두 선택해주세요.')
      return
    }
    if (player1 === player2) {
      alert('같은 선수끼리는 매칭할 수 없습니다.')
      return
    }
    onAddMatch(parseInt(player1), parseInt(player2))
    setPlayer1('')
    setPlayer2('')
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
      <h4 className="text-white font-semibold mb-3">매칭 추가</h4>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">플레이어 1</label>
          <select
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          >
            <option value="">선택</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.player_name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-white font-bold text-2xl">VS</span>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">플레이어 2</label>
          <select
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          >
            <option value="">선택</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.player_name}</option>
            ))}
          </select>
        </div>
      </div>
      <Button
        onClick={handleAdd}
        className="mt-3 bg-purple-600 hover:bg-purple-700 w-full"
      >
        매칭 추가
      </Button>
    </div>
  )
}
