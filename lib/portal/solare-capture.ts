import type { Ranking } from '@/lib/portal/schema'

export type Observation = {
  rank: number | null
  name: string
  rate: string
  record: string
  score: string
  className: string
  iconKey: string
  specialization: '' | '전승' | '각성'
  clean: boolean
  proof: Blob
}
export type CaptureRow = Observation & { rank: number; conflict: boolean; confirmed: boolean }

export function positionRows(rows: Observation[]) {
  // The score detector sees contiguous rows. Two or more visible ordinals must
  // independently agree on that sequence before we fill a missing ordinal.
  const offsets = rows.flatMap((row, index) => (row.rank === null ? [] : [row.rank - index]))
  if (offsets.length < 2 || new Set(offsets).size !== 1 || offsets[0] < 1) return []
  return rows.map((row, i) => ({
    ...row,
    rank: offsets[0] + i,
    clean: row.clean && row.rank !== null,
  }))
}

export function mergeRows(
  previous: Map<number, CaptureRow>,
  observations: ReturnType<typeof positionRows>,
  limit: number,
) {
  const result = new Map(previous)
  for (const row of observations) {
    if (row.rank > limit) continue
    const existing = result.get(row.rank)
    const same =
      existing &&
      (['name', 'rate', 'record', 'score', 'specialization', 'className'] as const).every(
        (key) => existing[key] === row[key],
      )
    if (existing && same && (existing.clean || !row.clean)) continue
    const conflict = Boolean(existing && (!same || existing.conflict))
    result.set(row.rank, { ...row, conflict, confirmed: false })
  }
  return result
}

export function toRanking(
  row: CaptureRow,
): Pick<Ranking, 'name' | 'score' | 'wins' | 'draws' | 'losses'> &
  Partial<Pick<Ranking, 'specialization' | 'class'>> {
  const name = row.name.trim()
  const record = row.record.match(/^\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*$/)
  if (!name || name.length > 200 || !/^\d+$/.test(row.score) || !record)
    throw Error(row.rank + '위의 가문명·점수·승무패를 확인해 주세요.')
  const [score, wins, draws, losses] = [row.score, ...record.slice(1)].map(Number)
  if (![score, wins, draws, losses].every(Number.isSafeInteger)) throw Error('숫자가 너무 큽니다.')
  const rate = row.rate.trim().match(/^(\d+(?:\.\d{1,2})?)%?$/)
  if (
    !rate ||
    !(wins + draws + losses) ||
    Math.abs(Number(rate[1]) - (100 * wins) / (wins + draws + losses)) >= 0.011
  )
    throw Error(row.rank + '위의 승률과 승무패가 일치하지 않습니다.')
  return {
    name,
    score,
    wins,
    draws,
    losses,
    ...(row.specialization && { specialization: row.specialization }),
    ...(row.className.trim() && { class: row.className.trim() }),
  }
}
