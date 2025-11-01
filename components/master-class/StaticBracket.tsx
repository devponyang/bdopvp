'use client'

import { useMemo, useRef } from 'react'
import { toPng } from 'html-to-image'
import type { BracketStage } from '@/lib/data/master-class-brackets'

interface StaticBracketProps {
  title: string
  stages: BracketStage[]
  exportFileName?: string
}

export default function StaticBracket({ title, stages, exportFileName = 'master-class-bracket' }: StaticBracketProps) {
  const bracketRef = useRef<HTMLDivElement>(null)

  const pyramidStages = useMemo(() => [...stages].reverse(), [stages])

  const CARD_WIDTH = 220
  const HORIZONTAL_GAP = 32

  const baseWidth = useMemo(() => {
    const maxMatches = pyramidStages.reduce((max, stage) => Math.max(max, stage.matches.length), 0)
    if (maxMatches === 0) return CARD_WIDTH
    return maxMatches * CARD_WIDTH + Math.max(maxMatches - 1, 0) * HORIZONTAL_GAP
  }, [pyramidStages])

  const handleDownload = async () => {
    if (!bracketRef.current) return

    try {
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
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl font-semibold text-white">{title}</h3>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500/90 hover:bg-orange-500 text-white px-4 py-2 text-sm font-semibold transition-colors"
        >
          대진표 이미지 다운로드
        </button>
      </div>

      <div ref={bracketRef} className="relative overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6">
        <div className="flex flex-col gap-12 items-start" style={{ minWidth: baseWidth }}>
          {pyramidStages.map((stage, index) => (
            <StageRow
              key={stage.id}
              label={stage.label}
              matches={stage.matches}
              cardWidth={CARD_WIDTH}
              gap={HORIZONTAL_GAP}
              baseWidth={baseWidth}
              nextMatches={pyramidStages[index + 1]?.matches}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface StageRowProps {
  label: string
  matches: BracketStage['matches']
  cardWidth: number
  gap: number
  baseWidth: number
  nextMatches?: BracketStage['matches']
}

function StageRow({ label, matches, cardWidth, gap, baseWidth, nextMatches }: StageRowProps) {
  if (matches.length === 0) return null

  const rowWidth = matches.length * cardWidth + Math.max(matches.length - 1, 0) * gap
  const offset = Math.max((baseWidth - rowWidth) / 2, 0)
  const hasNext = Array.isArray(nextMatches) && nextMatches.length > 0
  const connectorHeight = hasNext ? 64 : 0
  const cardAreaHeight = 150

  const defaultCenters = matches.map((_, index) => offset + index * (cardWidth + gap) + cardWidth / 2)

  const nextRowWidth = hasNext
    ? nextMatches!.length * cardWidth + Math.max(nextMatches!.length - 1, 0) * gap
    : 0
  const nextOffset = hasNext ? Math.max((baseWidth - nextRowWidth) / 2, 0) : 0
  const childCenters = hasNext
    ? nextMatches!.map((_, index) => nextOffset + index * (cardWidth + gap) + cardWidth / 2)
    : []
  const childCentersByReference = new Map<string, number[]>()

  if (hasNext) {
    nextMatches!.forEach((childMatch, childIndex) => {
      const center = childCenters[childIndex]
      if (typeof center !== 'number') return

      childMatch.competitors.forEach((competitor) => {
        if (competitor.type === 'winner' && competitor.referenceMatchId) {
          const list = childCentersByReference.get(competitor.referenceMatchId) ?? []
          list.push(center)
          childCentersByReference.set(competitor.referenceMatchId, list)
        }
      })
    })
  }

  const desiredCenters = matches.map((match, index) => {
    if (!hasNext) return defaultCenters[index]

    const childPositions = childCentersByReference.get(match.id) ?? []

    if (childPositions.length === 0) return defaultCenters[index]

    const uniquePositions = Array.from(new Set(childPositions.map((value) => Math.round(value * 100))))
    if (uniquePositions.length <= 1 && matches.length > 1) {
      return defaultCenters[index]
    }

    const sum = childPositions.reduce((acc, value) => acc + value, 0)
    return sum / childPositions.length
  })

  const parentCenters = desiredCenters

  return (
    <div className="flex w-full flex-col items-center gap-3" style={{ width: baseWidth }}>
      <div className="relative" style={{ width: baseWidth }}>
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ width: rowWidth }}
        >
          <div
            className="text-sm font-semibold text-orange-300 text-center"
            style={{ marginLeft: offset, marginRight: offset }}
          >
            {label}
          </div>
        </div>
      </div>
      <div className="relative" style={{ width: baseWidth, height: cardAreaHeight }}>
        {matches.map((match, index) => {
          const centerX = desiredCenters[index]
          const left = centerX - cardWidth / 2
          return (
            <div
              key={match.id}
              className="absolute"
              style={{
                left,
                width: cardWidth,
                top: 0
              }}
            >
              <MatchCard label={match.label} competitors={match.competitors} align="center" />
            </div>
          )
        })}
      </div>

      {hasNext && (
        <div className="relative" style={{ width: baseWidth, height: connectorHeight, marginTop: 4 }}>
          {parentCenters.map((parentCenter, index) => {
            const parentMatch = matches[index]
            if (!parentMatch) return null

            const childPositions = (childCentersByReference.get(parentMatch.id) ?? [])
              .slice()
              .sort((a, b) => a - b)

            if (childPositions.length === 0) return null

            const horizontalLeft = Math.min(...childPositions)
            const horizontalRight = Math.max(...childPositions)
            const horizontalWidth = Math.max(horizontalRight - horizontalLeft, 2)

            return (
              <div key={`connector-${label}-${index}`}>
                <div
                  className="absolute bg-orange-400/60"
                  style={{
                    left: parentCenter - 1,
                    top: 0,
                    width: 2,
                    height: connectorHeight / 2
                  }}
                />
                <div
                  className="absolute bg-orange-400/50"
                  style={{
                    left: horizontalLeft,
                    top: connectorHeight / 2 - 1,
                    width: horizontalWidth,
                    height: 2
                  }}
                />
                {childPositions.map((childCenter, childIdx) => (
                  <div
                    key={`connector-${label}-${index}-child-${childIdx}`}
                    className="absolute bg-orange-400/60"
                    style={{
                      left: childCenter - 1,
                      top: connectorHeight / 2,
                      width: 2,
                      height: connectorHeight / 2
                    }}
                  />
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface MatchCardProps {
  label: string
  competitors: BracketStage['matches'][number]['competitors']
  align?: 'left' | 'right' | 'center'
}

function MatchCard({ label, competitors, align = 'center' }: MatchCardProps) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
  const competitorAlignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-xl border border-white/10 bg-slate-900/80 p-4 shadow-sm">
      <div className={`text-xs text-slate-400 mb-2 ${alignClass}`}>{label}</div>
      <div className="space-y-2">
        {competitors.map((competitor, index) => (
          <div
            key={index}
            className={`rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
              competitor.type === 'player'
                ? `border-white/10 text-white bg-slate-800/60 ${competitorAlignClass}`
                : `border-dashed border-slate-500 text-slate-300 bg-slate-800/40 ${competitorAlignClass}`
            }`}
          >
            {competitor.name}
          </div>
        ))}
      </div>
    </div>
  )
}



