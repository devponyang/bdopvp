'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'

interface BracketGeneratorProps {
  bracketTitle?: string
  initialParticipants?: string[]
  exportFileName?: string
}

interface BracketMatch {
  id: string
  players: [string, string]
}

interface BracketRound {
  id: string
  label: string
  matches: BracketMatch[]
}

const TOURNAMENT_SIZES = [8, 16, 32] as const

const DEFAULT_NAMES: Record<number, string[]> = {
  8: Array.from({ length: 8 }, (_, idx) => `참가자 ${idx + 1}`),
  16: Array.from({ length: 16 }, (_, idx) => `참가자 ${idx + 1}`),
  32: Array.from({ length: 32 }, (_, idx) => `참가자 ${idx + 1}`)
}

const getRoundLabel = (roundIndex: number, totalRounds: number, totalSlots: number) => {
  if (roundIndex === totalRounds - 1) return '결승'
  if (roundIndex === totalRounds - 2) return '준결승'

  const roundSize = totalSlots / Math.pow(2, roundIndex)
  return `${roundSize}강`
}

const padParticipants = (participants: string[], size: number) => {
  const padded = [...participants]
  while (padded.length < size) {
    padded.push('BYE')
  }
  return padded.slice(0, size)
}

const buildBracket = (participants: string[]): BracketRound[] => {
  const size = participants.length
  const totalRounds = Math.log2(size)

  return Array.from({ length: totalRounds }, (_, roundIndex) => {
    const matchesInRound = size / Math.pow(2, roundIndex + 1)

    const matches: BracketMatch[] = Array.from({ length: matchesInRound }, (_, matchIndex) => {
      if (roundIndex === 0) {
        const p1 = participants[matchIndex * 2] ?? 'BYE'
        const p2 = participants[matchIndex * 2 + 1] ?? 'BYE'
        return {
          id: `r${roundIndex + 1}-m${matchIndex + 1}`,
          players: [p1, p2]
        }
      }

      const previousRoundMatchStart = matchIndex * 2 + 1
      return {
        id: `r${roundIndex + 1}-m${matchIndex + 1}`,
        players: [`R${roundIndex} 승자 ${previousRoundMatchStart}`, `R${roundIndex} 승자 ${previousRoundMatchStart + 1}`]
      }
    })

    return {
      id: `round-${roundIndex + 1}`,
      label: getRoundLabel(roundIndex, totalRounds, size),
      matches
    }
  })
}

export default function BracketGenerator({
  bracketTitle = '마스터 클래스 토너먼트',
  initialParticipants = DEFAULT_NAMES[16],
  exportFileName = 'master-class-bracket'
}: BracketGeneratorProps) {
  const [tournamentSize, setTournamentSize] = useState<number>(Math.min(Math.max(initialParticipants.length, 8), 32))
  const [participantText, setParticipantText] = useState(() => initialParticipants.join('\n'))
  const [isExporting, setIsExporting] = useState(false)
  const bracketRef = useRef<HTMLDivElement>(null)

  const normalizedSize = useMemo(() => {
    const nearestSize = TOURNAMENT_SIZES.find((size) => size >= tournamentSize) ?? 32
    return nearestSize
  }, [tournamentSize])

  const participants = useMemo(() => {
    const list = participantText
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)

    if (list.length === 0) {
      return DEFAULT_NAMES[normalizedSize]
    }

    return padParticipants(list, normalizedSize)
  }, [participantText, normalizedSize])

  const rounds = useMemo(() => buildBracket(participants), [participants])

  const handleTournamentSizeChange = useCallback((size: number) => {
    setTournamentSize(size)
    const list = participantText
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)

    if (list.length < size) {
      const extended = padParticipants(list, size)
      setParticipantText(extended.join('\n'))
    } else if (list.length > size) {
      setParticipantText(list.slice(0, size).join('\n'))
    }
  }, [participantText])

  const handleFillDefault = useCallback(() => {
    setParticipantText(DEFAULT_NAMES[normalizedSize].join('\n'))
  }, [normalizedSize])

  const handleRandomize = useCallback(() => {
    const shuffled = [...participants]
      .filter((name) => name !== 'BYE')
      .sort(() => Math.random() - 0.5)

    const padded = padParticipants(shuffled, normalizedSize)
    setParticipantText(padded.join('\n'))
  }, [participants, normalizedSize])

  const handleDownload = useCallback(async () => {
    if (!bracketRef.current) return

    try {
      setIsExporting(true)
      const dataUrl = await toPng(bracketRef.current, {
        cacheBust: true,
        backgroundColor: '#0f172a',
        pixelRatio: 2
      })

      const link = document.createElement('a')
      link.download = `${exportFileName}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('대진표 이미지를 내보내는 중 오류가 발생했습니다.', error)
      alert('이미지 내보내기에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsExporting(false)
    }
  }, [exportFileName])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm text-gray-300">참가자 명단 (줄바꿈으로 구분)</label>
          <textarea
            className="w-full h-40 rounded-xl border border-white/10 bg-slate-900/80 p-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            value={participantText}
            onChange={(event) => setParticipantText(event.target.value)}
            placeholder="참가자 이름을 한 줄에 하나씩 입력하세요"
          />
        </div>

        <div className="w-full md:w-64 space-y-3">
          <div>
            <label className="text-sm text-gray-300">대진 인원</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {TOURNAMENT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleTournamentSizeChange(size)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors border ${
                    normalizedSize === size
                      ? 'bg-orange-500/80 text-white border-orange-500/60'
                      : 'bg-slate-900/80 text-gray-300 border-white/10 hover:border-orange-400/40'
                  }`}
                >
                  {size}강
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleFillDefault}
              className="flex-1 rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-sm text-gray-200 hover:border-orange-400/40"
            >
              기본 명단 채우기
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              className="flex-1 rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-sm text-gray-200 hover:border-orange-400/40"
            >
              시드 섞기
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full rounded-lg bg-orange-500/90 hover:bg-orange-500 text-white font-semibold py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isExporting ? '이미지 생성 중...' : '대진표 이미지 다운로드'}
          </button>
        </div>
      </div>

      <div
        ref={bracketRef}
        className="relative overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6"
      >
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-white">{bracketTitle}</h3>
          <p className="text-sm text-slate-300">총 {participants.length}명 토너먼트</p>
        </div>

        <div className="flex gap-6 min-w-full">
          {rounds.map((round) => (
            <div key={round.id} className="flex-1 min-w-[160px]">
              <div className="mb-4 text-center text-sm font-semibold text-orange-300">{round.label}</div>
              <div className="space-y-4">
                {round.matches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-white/10 bg-slate-900/80 p-4 shadow-sm"
                  >
                    <div className="text-xs text-slate-400 mb-2">{match.id.toUpperCase()}</div>
                    <div className="space-y-2">
                      {match.players.map((player, index) => (
                        <div
                          key={index}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            player === 'BYE'
                              ? 'border border-dashed border-slate-600 text-slate-500'
                              : 'border border-white/10 text-white bg-slate-800/60'
                          }`}
                        >
                          {player}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


