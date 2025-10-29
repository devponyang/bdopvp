'use client'

import { useEffect, useState } from 'react'

interface Participant {
  id: number
  player_name: string
  class_name: string
  subclass: string
  total_ap_dp: number
  gear_score?: number
}

interface Match {
  id: number
  round_number: number
  match_number: number
  player1_id: number
  player2_id: number
  winner_id: number | null
  match_date: string | null
  match_duration: number | null
  is_completed: boolean
  player1?: Participant
  player2?: Participant
  winner?: Participant
}

interface Props {
  className: string
}

const ROUND_NAMES: { [key: number]: string } = {
  32: '32강',
  16: '16강',
  8: '8강',
  4: '4강',
  2: '결승전',
  1: '우승'
}

export default function MasterClassBracket({ className }: Props) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBracketData()
  }, [className])

  const loadBracketData = async () => {
    setLoading(true)
    try {
      // API에서 데이터 가져오기
      const [participantsRes, matchesRes] = await Promise.all([
        fetch(`/api/master-class/brackets?className=${encodeURIComponent(className)}`),
        fetch(`/api/master-class/matches?className=${encodeURIComponent(className)}`)
      ])

      const participantsData = await participantsRes.json()
      const matchesData = await matchesRes.json()

      console.log('참가자 데이터:', participantsData)
      console.log('매치 데이터:', matchesData)

      // 매치 데이터에 선수 정보 추가
      const matchesWithPlayers = matchesData.map((match: Match) => {
        const p1 = participantsData.find((p: Participant) => p.id === match.player1_id)
        const p2 = participantsData.find((p: Participant) => p.id === match.player2_id)
        const winner = participantsData.find((p: Participant) => p.id === match.winner_id)
        
        console.log('매칭 처리:', { match, p1, p2 })
        
        return {
          ...match,
          player1: p1,
          player2: p2,
          winner
        }
      })

      setMatches(matchesWithPlayers)
    } catch (error) {
      console.error('브라켓 데이터 로딩 에러:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    )
  }

  // 라운드별로 매치 그룹화 및 순서 정의
  const matchesByRound: { [key: number]: Match[] } = {}
  matches.forEach(match => {
    if (!matchesByRound[match.round_number]) {
      matchesByRound[match.round_number] = []
    }
    matchesByRound[match.round_number].push(match)
  })

  // 진행된 라운드 찾기
  const completedRounds = Object.keys(matchesByRound).map(Number).filter(round => matchesByRound[round].length > 0)
  const firstRound = completedRounds.length > 0 ? Math.min(...completedRounds) : null
  
  // 라운드 순서
  const roundOrder = [16, 8, 4, 2] // 16강 → 8강 → 4강 → 결승
  
  // 표시할 라운드 결정
  let roundsToShow: number[] = []
  if (firstRound) {
    const startIdx = roundOrder.indexOf(firstRound)
    if (startIdx !== -1) {
      roundsToShow = roundOrder.slice(startIdx)
    }
  }

  // 라운드를 양쪽으로 분할
  const splitMatchesBySide = (round: number): { left: Match[], right: Match[] } => {
    const matches = matchesByRound[round] || []
    const sortedMatches = matches.sort((a, b) => a.match_number - b.match_number)
    const half = sortedMatches.length / 2
    return {
      left: sortedMatches.slice(0, half),
      right: sortedMatches.slice(half)
    }
  }

  // 중앙 대진표 구성
  const renderCentralBracket = () => {
    const finalRound = 2
    const finalMatches = matchesByRound[finalRound] || []
    
    // 결승전을 제외한 라운드들
    const otherRounds = roundsToShow.filter(r => r !== finalRound)
    // 왼쪽: 16강 → 8강 → 4강 (큰 라운드부터)
    const leftRounds = [...otherRounds]
    // 오른쪽: 4강 → 8강 → 16강 (작은 라운드부터, 반대 순서)
    const rightRounds = [...otherRounds].reverse()
    
    return (
      <div className="flex gap-6 items-center justify-center w-full relative">
        {/* 왼쪽 라운드들 (16강 → 8강 → 4강) */}
        <div className="flex gap-8 relative">
          {leftRounds.map((round, roundIdx) => {
            const { left } = splitMatchesBySide(round)
            const isLast = roundIdx === leftRounds.length - 1
            
            // 각 사이드의 매치 수 계산
            let targetMatchCount = 0
            if (isLast) {
              // 결승전의 경우 left는 1개
              targetMatchCount = 1
            } else {
              // 현재 라운드의 실제 매치 수 확인
              const currentRoundMatches = matchesByRound[round] || []
              if (currentRoundMatches.length > 0) {
                // 데이터가 있으면 현재 라운드의 절반
                targetMatchCount = currentRoundMatches.length / 2
              } else {
                // 데이터가 없으면: 
                // 1) 이전 라운드가 있으면 그것을 사용
                // 2) 없으면 다음 라운드를 사용
                let prevRoundIdx = roundIdx - 1
                let usePrev = prevRoundIdx >= 0
                
                if (!usePrev && roundIdx < leftRounds.length - 1) {
                  // 이전이 없고 다음이 있으면, 다음 라운드를 사용
                  const nextRound = leftRounds[roundIdx + 1]
                  const nextRoundMatches = matchesByRound[nextRound] || []
                  targetMatchCount = Math.ceil(nextRoundMatches.length / 4)
                } else if (prevRoundIdx >= 0) {
                  const prevRound = leftRounds[prevRoundIdx]
                  const prevRoundMatches = matchesByRound[prevRound] || []
                  targetMatchCount = Math.ceil(prevRoundMatches.length / 4)
                } else {
                  targetMatchCount = 0
                }
              }
            }
            
            return (
              <div key={`left-${round}`} className="flex flex-col justify-center relative">
                <h2 className="text-xl font-bold text-white mb-8 text-center whitespace-nowrap">
                  {ROUND_NAMES[round] || `${round}강`}
                </h2>
                <div className="space-y-12">
                  {/* 실제 매치들 */}
                  {left.map((match) => (
                    <div key={match.id} className="relative">
                      <MatchCard match={match} />
                      {/* 다음 라운드로 가는 연결선 */}
                      {!isLast && (
                        <div className="absolute top-1/2 -right-8 w-8 border-t-2 border-gray-500 z-0"></div>
                      )}
                    </div>
                  ))}
                  {/* 빈 매치 카드 */}
                  {left.length < targetMatchCount && Array.from({ length: targetMatchCount - left.length }).map((_, idx) => (
                    <div key={`empty-left-${round}-${idx}`} className="relative">
                      <EmptyMatchCard />
                      {!isLast && (
                        <div className="absolute top-1/2 -right-8 w-8 border-t-2 border-gray-500 z-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* 중앙 - 결승전 */}
        <div className="flex flex-col justify-center relative">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center whitespace-nowrap">
            결승전
          </h2>
          <div className="space-y-12">
            {finalMatches.length > 0 ? (
              finalMatches.map((match) => (
                <div key={match.id} className="relative">
                  {/* 왼쪽 4강에서 들어오는 연결선 */}
                  <div className="absolute top-1/2 -left-8 w-8 border-t-2 border-gray-500 z-0"></div>
                  <MatchCard match={match} />
                  {/* 오른쪽 4강에서 들어오는 연결선 */}
                  <div className="absolute top-1/2 -right-8 w-8 border-t-2 border-gray-500 z-0"></div>
                </div>
              ))
            ) : (
              <div className="relative">
                <div className="absolute top-1/2 -left-8 w-8 border-t-2 border-gray-500 z-0"></div>
                <EmptyMatchCard />
                <div className="absolute top-1/2 -right-8 w-8 border-t-2 border-gray-500 z-0"></div>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 라운드들 (4강 → 8강 → 16강) */}
        <div className="flex gap-8 relative">
          {rightRounds.map((round, roundIdx) => {
            const { right } = splitMatchesBySide(round)
            const isLast = roundIdx === rightRounds.length - 1
            
            // 각 사이드의 매치 수 계산
            let targetMatchCount = 0
            if (isLast) {
              // 결승전의 경우 right는 1개
              targetMatchCount = 1
            } else {
              // 현재 라운드의 실제 매치 수 확인
              const currentRoundMatches = matchesByRound[round] || []
              if (currentRoundMatches.length > 0) {
                // 데이터가 있으면 현재 라운드의 절반
                targetMatchCount = currentRoundMatches.length / 2
              } else {
                // 데이터가 없으면:
                // 1) 이전 라운드가 있으면 그것을 사용
                // 2) 없으면 다음 라운드를 사용
                let prevRoundIdx = roundIdx - 1
                let usePrev = prevRoundIdx >= 0
                
                if (!usePrev && roundIdx < rightRounds.length - 1) {
                  // 이전이 없고 다음이 있으면, 다음 라운드를 사용
                  const nextRound = rightRounds[roundIdx + 1]
                  const nextRoundMatches = matchesByRound[nextRound] || []
                  targetMatchCount = Math.ceil(nextRoundMatches.length / 4)
                } else if (prevRoundIdx >= 0) {
                  const prevRound = rightRounds[prevRoundIdx]
                  const prevRoundMatches = matchesByRound[prevRound] || []
                  targetMatchCount = Math.ceil(prevRoundMatches.length / 4)
                } else {
                  targetMatchCount = 0
                }
              }
            }
            
            return (
              <div key={`right-${round}`} className="flex flex-col justify-center relative">
                <h2 className="text-xl font-bold text-white mb-8 text-center whitespace-nowrap">
                  {ROUND_NAMES[round] || `${round}강`}
                </h2>
                <div className="space-y-12">
                  {/* 실제 매치들 */}
                  {right.map((match) => (
                    <div key={match.id} className="relative">
                      <MatchCard match={match} />
                      {/* 다음 라운드로 가는 연결선 */}
                      {!isLast && (
                        <div className="absolute top-1/2 -left-8 w-8 border-t-2 border-gray-500 z-0"></div>
                      )}
                    </div>
                  ))}
                  {/* 빈 매치 카드 */}
                  {right.length < targetMatchCount && Array.from({ length: targetMatchCount - right.length }).map((_, idx) => (
                    <div key={`empty-right-${round}-${idx}`} className="relative">
                      <EmptyMatchCard />
                      {!isLast && (
                        <div className="absolute top-1/2 -left-8 w-8 border-t-2 border-gray-500 z-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 중앙 대진표 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-8 w-full overflow-x-auto">
        {renderCentralBracket()}
      </div>

      {/* 참가자 정보가 아직 없는 경우 */}
      {completedRounds.length === 0 && (
        <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-12">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">대진표가 아직 공개되지 않았습니다</h3>
            <p className="text-gray-300">대진표는 2025년 10월 22일(수)에 공개됩니다.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 빈 매치 카드 (아직 진행되지 않은 매칭)
function EmptyMatchCard() {
  return (
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 min-w-[200px]">
      <div className="space-y-3">
        <div className="rounded-lg p-4 bg-slate-700/20 border border-slate-600/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 text-lg">대기중</span>
          </div>
        </div>
        <div className="rounded-lg p-4 bg-slate-700/20 border border-slate-600/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 text-lg">대기중</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 매치 카드 컴포넌트
function MatchCard({ match }: { match: Match }) {
  const { player1, player2, winner_id, is_completed } = match

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10 hover:border-orange-500/50 transition-all min-w-[200px]">
      <div className="space-y-3">
        {/* 플레이어 1 */}
        <div className={`rounded-lg p-4 ${
          winner_id === player1?.id 
            ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500' 
            : is_completed && winner_id === player2?.id
            ? 'bg-slate-700/20 border border-slate-600'
            : 'bg-slate-700/40 border border-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            {player1?.subclass && (
              <img 
                src={player1.subclass === '각성' ? '/ponyang/aw.png' : '/ponyang/ac.png'} 
                alt={player1.subclass}
                className="w-5 h-5"
              />
            )}
            <span className="font-semibold text-white text-lg">{player1?.player_name || 'TBA'}</span>
          </div>
        </div>

        {/* 플레이어 2 */}
        <div className={`rounded-lg p-4 ${
          winner_id === player2?.id 
            ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500' 
            : is_completed && winner_id === player1?.id
            ? 'bg-slate-700/20 border border-slate-600'
            : 'bg-slate-700/40 border border-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            {player2?.subclass && (
              <img 
                src={player2.subclass === '각성' ? '/ponyang/aw.png' : '/ponyang/ac.png'} 
                alt={player2.subclass}
                className="w-5 h-5"
              />
            )}
            <span className="font-semibold text-white text-lg">{player2?.player_name || 'TBA'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

