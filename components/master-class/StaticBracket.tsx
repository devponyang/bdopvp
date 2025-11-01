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

  const parentCenters = matches.map((_, index) => offset + index * (cardWidth + gap) + cardWidth / 2)

  const nextRowWidth = hasNext
    ? nextMatches!.length * cardWidth + Math.max(nextMatches!.length - 1, 0) * gap
    : 0
  const nextOffset = hasNext ? Math.max((baseWidth - nextRowWidth) / 2, 0) : 0
  const childCenters = hasNext
    ? nextMatches!.map((_, index) => nextOffset + index * (cardWidth + gap) + cardWidth / 2)
    : []

  const baseChildCount = hasNext && matches.length > 0 ? Math.max(Math.floor(childCenters.length / matches.length), 1) : 1
  const remainder = hasNext && matches.length > 0 ? childCenters.length % matches.length : 0
  let runningIndex = 0

  return (
    <div className="flex w-full flex-col items-center gap-3" style={{ width: baseWidth }}>
      <div
        className="text-sm font-semibold text-orange-300 text-center"
        style={{ width: rowWidth, marginLeft: offset, marginRight: offset }}
      >
        {label}
      </div>
      <div
        className="grid justify-items-center"
        style={{
          gridTemplateColumns: `repeat(${matches.length}, minmax(${cardWidth}px, ${cardWidth}px))`,
          columnGap: gap,
          width: rowWidth,
          marginLeft: offset,
          marginRight: offset
        }}
      >
        {matches.map((match) => (
          <MatchCard key={match.id} label={match.label} competitors={match.competitors} align="center" />
        ))}
      </div>

      {hasNext && (
        <div className="relative" style={{ width: baseWidth, height: connectorHeight, marginTop: 4 }}>
          {parentCenters.map((parentCenter, index) => {
            const extra = remainder > 0 && index < remainder ? 1 : 0
            const childCount = Math.max(Math.min(baseChildCount + extra, childCenters.length - runningIndex), 1)
            const startIndex = runningIndex
            if (startIndex >= childCenters.length) {
              return null
            }

            const endIndex = Math.min(startIndex + childCount - 1, childCenters.length - 1)
            runningIndex = endIndex + 1

            const firstChild = childCenters[startIndex]
            if (firstChild === undefined) return null

            const lastChild = childCenters[endIndex] ?? firstChild
            const horizontalLeft = Math.min(firstChild, lastChild)
            const horizontalRight = Math.max(firstChild, lastChild)
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
                {Array.from({ length: endIndex - startIndex + 1 }).map((_, childOffset) => {
                  const childIndex = startIndex + childOffset
                  const childCenter = childCenters[childIndex]
                  if (childCenter === undefined) return null

                  return (
                    <div
                      key={`connector-${label}-${index}-child-${childIndex}`}
                      className="absolute bg-orange-400/60"
                      style={{
                        left: childCenter - 1,
                        top: connectorHeight / 2,
                        width: 2,
                        height: connectorHeight / 2
                      }}
                    />
                  )
                })}
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



