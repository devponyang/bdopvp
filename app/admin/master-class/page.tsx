'use client'

import { useState, useEffect } from 'react'
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

type Status = { type: 'success' | 'error'; msg: string } | null

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
  const [participantStatus, setParticipantStatus] = useState<Status>(null)

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
      setParticipantStatus({ type: 'error', msg: '이름과 클래스를 입력해주세요.' })
      return
    }

    try {
      const response = await fetch('/api/admin/master-class/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setParticipantStatus({ type: 'success', msg: '참가자가 추가되었습니다.' })
        setShowAddParticipant(false)
        setNewParticipant({
          tournamentId: tournaments.find(t => t.is_active)?.id.toString() || '',
          playerName: '',
          className: ''
        })
        loadData()
      } else {
        setParticipantStatus({ type: 'error', msg: '참가자 추가에 실패했습니다.' })
      }
    } catch (error) {
      console.error('참가자 추가 오류:', error)
      setParticipantStatus({ type: 'error', msg: '참가자 추가 중 오류가 발생했습니다.' })
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
      return <span className="px-2 py-1 bg-slate-500/30 text-gray-300 border border-white/10 rounded text-xs">대기중</span>
    } else if (now >= regStart && now <= regEnd) {
      return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-xs">신청중</span>
    } else if (now > regEnd && now < start) {
      return <span className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded text-xs">준비중</span>
    } else if (now >= start && now <= end) {
      return <span className="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-xs">진행중</span>
    } else {
      return <span className="px-2 py-1 bg-slate-600/40 text-gray-400 border border-white/10 rounded text-xs">종료</span>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center justify-center py-8 text-gray-400">
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-3" />
            로딩 중...
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'tournaments', label: '대회 관리' },
    { key: 'participants', label: '참가자 관리' },
    { key: 'matches', label: '매칭 관리' },
  ] as const

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-white">마스터 클래스 관리</h1>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-2 bg-slate-700/40 p-1.5 rounded-xl border border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tournaments' && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">대회 목록</h2>
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-slate-700/40 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tournament.tournament_name}</h3>
                    <p className="text-gray-400 text-sm">{tournament.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(tournament)}
                    {tournament.is_active && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded text-xs font-semibold">활성</span>
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
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-white">참가자 목록</h2>
              <Button
                onClick={() => setShowAddParticipant(true)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-4 py-2 rounded-xl shadow-lg transition-all"
              >
                + 참가자 추가
              </Button>
            </div>

            {participantStatus && (
              <p className={`mb-4 text-sm font-medium ${participantStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {participantStatus.type === 'success' ? '✅' : '❌'} {participantStatus.msg}
              </p>
            )}

            {participants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">등록된 참가자가 없습니다.</p>
                <p className="text-gray-500 text-sm mt-2">위의 "참가자 추가" 버튼을 클릭하여 참가자를 등록하세요.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-white/10">
                      <th className="px-3 py-2 text-left text-gray-300 font-medium">이름</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium">클래스</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium">AP</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium">DP</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium">합계</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium">자격</th>
                      <th className="px-3 py-2 text-left text-gray-300 font-medium">신청일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.id} className="border-b border-white/5 hover:bg-slate-700/30 transition-colors">
                        <td className="px-3 py-2 text-white">{participant.player_name}</td>
                        <td className="px-3 py-2 text-white">{participant.class_name}</td>
                        <td className="px-3 py-2 text-white">{participant.attack_power || '-'}</td>
                        <td className="px-3 py-2 text-white">{participant.defense_power || '-'}</td>
                        <td className="px-3 py-2 text-white">{participant.total_ap_dp || '-'}</td>
                        <td className="px-3 py-2">
                          {participant.is_qualified ? (
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-xs">자격</span>
                          ) : (
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-xs">미자격</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-gray-400">{formatDate(participant.registration_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {showAddParticipant && (
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">참가자 추가</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">이름</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    value={newParticipant.playerName}
                    onChange={(e) => setNewParticipant({ ...newParticipant, playerName: e.target.value })}
                    placeholder="예: 눈여아"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">클래스</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    value={newParticipant.className}
                    onChange={(e) => setNewParticipant({ ...newParticipant, className: e.target.value })}
                    placeholder="예: 드라카니아"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddParticipant}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-4 py-2 rounded-xl shadow-lg transition-all"
                >
                  추가
                </Button>
                <Button
                  onClick={() => setShowAddParticipant(false)}
                  className="bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 px-4 py-2 rounded-xl border border-white/10 transition-colors"
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-2">매칭 관리</h2>
          <p className="text-gray-400 mb-6 text-sm">
            참가자를 추가한 후 클래스별로 매칭을 생성하세요.
          </p>
          <MatchManager tournaments={tournaments} participants={participants} />
        </div>
      )}
    </div>
  )
}

function MatchManager({ tournaments, participants }: { tournaments: Tournament[], participants: Participant[] }) {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedTournament, setSelectedTournament] = useState('')
  const [matches, setMatches] = useState<any[]>([])
  const [selectedRound, setSelectedRound] = useState(32)
  const [matchStatus, setMatchStatus] = useState<Status>(null)

  const classList = Array.from(new Set(participants.map(p => p.class_name))).filter(Boolean)

  useEffect(() => {
    if (tournaments.length > 0 && !selectedTournament) {
      const activeTournament = tournaments.find(t => t.is_active) || tournaments[0]
      setSelectedTournament(activeTournament.id.toString())
    }
  }, [tournaments, selectedTournament])

  const loadMatches = async () => {
    if (!selectedClass || !selectedTournament) return

    try {
      const url = `/api/master-class/matches?className=${encodeURIComponent(selectedClass)}&tournamentId=${selectedTournament}`
      const response = await fetch(url)
      const data = await response.json()
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
      setMatchStatus({ type: 'error', msg: '클래스와 토너먼트를 선택해주세요.' })
      return
    }

    if (!player1Id || !player2Id) {
      setMatchStatus({ type: 'error', msg: '두 선수를 모두 선택해주세요.' })
      return
    }

    if (player1Id === player2Id) {
      setMatchStatus({ type: 'error', msg: '같은 선수끼리는 매칭할 수 없습니다.' })
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

      const response = await fetch('/api/admin/master-class/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
      })

      if (response.ok) {
        setMatchStatus({ type: 'success', msg: '매칭이 추가되었습니다!' })
        loadMatches()
      } else {
        const errorText = await response.text()
        setMatchStatus({ type: 'error', msg: '매칭 추가에 실패했습니다: ' + errorText })
      }
    } catch (error) {
      console.error('매칭 추가 오류:', error)
      setMatchStatus({ type: 'error', msg: '매칭 추가 중 오류가 발생했습니다.' })
    }
  }

  const deleteMatch = async (matchId: number) => {
    if (!confirm('이 매칭을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/master-class/matches/${matchId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMatchStatus({ type: 'success', msg: '매칭이 삭제되었습니다!' })
        loadMatches()
      } else {
        const errorText = await response.text()
        setMatchStatus({ type: 'error', msg: '매칭 삭제에 실패했습니다: ' + errorText })
      }
    } catch (error) {
      console.error('매칭 삭제 오류:', error)
      setMatchStatus({ type: 'error', msg: '매칭 삭제 중 오류가 발생했습니다.' })
    }
  }

  return (
    <div className="space-y-4">
      {matchStatus && (
        <p className={`text-sm font-medium ${matchStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
          {matchStatus.type === 'success' ? '✅' : '❌'} {matchStatus.msg}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">토너먼트</label>
          <select
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
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
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
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
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none mb-4"
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

          <MatchAdder
            participants={participants.filter(p => p.class_name === selectedClass && p.tournament_id === parseInt(selectedTournament))}
            onAddMatch={addMatch}
            onStatus={setMatchStatus}
          />

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {selectedClass} 참가자 ({participants.filter(p => p.class_name === selectedClass && p.tournament_id === parseInt(selectedTournament)).length}명)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {participants
                .filter(p => p.class_name === selectedClass && p.tournament_id === parseInt(selectedTournament))
                .map((p, idx) => (
                  <div key={p.id} className="bg-slate-700/40 rounded-lg p-2 text-white text-sm border border-white/5">
                    {idx + 1}. {p.player_name}
                  </div>
                ))}
            </div>
          </div>

          {matches.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-3">생성된 매칭 ({matches.length}개)</h3>
              <div className="space-y-3">
                {matches.map((match) => {
                  const p1 = participants.find(p => p.id === match.player1_id)
                  const p2 = participants.find(p => p.id === match.player2_id)
                  return (
                    <div key={match.id} className="bg-slate-700/40 rounded-xl p-4 border border-white/10">
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
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs px-3 py-1 rounded-lg shadow-lg transition-all"
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
            <div className="mt-4 bg-slate-700/40 rounded-xl p-4 border border-white/10">
              <p className="text-gray-400 text-center">생성된 매칭이 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MatchAdder({ participants, onAddMatch, onStatus }: {
  participants: Participant[]
  onAddMatch: (p1: number, p2: number) => void
  onStatus: (s: Status) => void
}) {
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')

  const handleAdd = () => {
    if (!player1 || !player2) {
      onStatus({ type: 'error', msg: '두 선수를 모두 선택해주세요.' })
      return
    }
    if (player1 === player2) {
      onStatus({ type: 'error', msg: '같은 선수끼리는 매칭할 수 없습니다.' })
      return
    }
    onAddMatch(parseInt(player1), parseInt(player2))
    setPlayer1('')
    setPlayer2('')
  }

  return (
    <div className="bg-slate-700/40 rounded-xl p-4 border border-white/10">
      <h4 className="text-white font-semibold mb-3">매칭 추가</h4>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">플레이어 1</label>
          <select
            className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          >
            <option value="">선택</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.player_name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-center">
          <span className="text-white font-bold text-2xl pb-2">VS</span>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">플레이어 2</label>
          <select
            className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:border-purple-500 focus:outline-none"
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
        className="mt-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold w-full rounded-xl shadow-lg transition-all"
      >
        매칭 추가
      </Button>
    </div>
  )
}
