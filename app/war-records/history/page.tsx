'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

// ──────────────────────────────────────────────
// 상수
// ──────────────────────────────────────────────

const NODE_GROUPS = [
  { label: '발레노스/세렌디아', regions: ['발레노스', '세렌디아'] },
  { label: '칼페온/카마실비아', regions: ['칼페온', '카마실비아'] },
  { label: '메디아/발렌시아', regions: ['메디아', '발렌시아'] },
]
const SIEGE_REGIONS = ['칼페온', '발렌시아', '메디아']

const REGION_IMG: Record<string, string> = {
  '발레노스': '/war-records/balenos.png',
  '세렌디아': '/war-records/Serendia.png',
  '칼페온': '/war-records/calfeon.png',
  '카마실비아': '/war-records/kamasylvia.png',
  '메디아': '/war-records/media.png',
  '발렌시아': '/war-records/balencia.png',
}

const GROUP_IMG: Record<string, string> = {
  '발레노스/세렌디아': '/war-records/balenos.png',
  '칼페온/카마실비아': '/war-records/calfeon.png',
  '메디아/발렌시아': '/war-records/media.png',
}

// 결과별 스타일 (왼쪽 컬러 선 + 텍스트)
const RESULT_CONFIG: Record<string, { bar: string; text: string; badge: string }> = {
  '점령성공': {
    bar: 'bg-[oklch(0.75_0.18_150)]',
    text: 'text-[oklch(0.75_0.18_150)]',
    badge: 'bg-[oklch(0.75_0.18_150/0.12)] border-[oklch(0.75_0.18_150/0.35)] text-[oklch(0.75_0.18_150)]',
  },
  '진행중': {
    bar: 'bg-[oklch(0.82_0.18_80)] animate-pulse',
    text: 'text-[oklch(0.82_0.18_80)] animate-pulse',
    badge: 'bg-[oklch(0.82_0.18_80/0.12)] border-[oklch(0.82_0.18_80/0.35)] text-[oklch(0.82_0.18_80)]',
  },
  '점령실패': {
    bar: 'bg-zinc-700',
    text: 'text-zinc-600',
    badge: 'bg-zinc-800/60 border-zinc-700/50 text-zinc-500',
  },
}

// ──────────────────────────────────────────────
// 타입
// ──────────────────────────────────────────────

interface WarRecord {
  id: number
  war_type: string
  war_date: string
  alliance_name: string
  occupied_area: string
  result: string
  fort_stage: number | null
  region: string
}

// ──────────────────────────────────────────────
// 날짜 유틸
// ──────────────────────────────────────────────

function defaultNodeDate(): Date {
  const now = new Date()
  const d = now.getDay(), h = now.getHours(), m = now.getMinutes()
  if (d === 6 || h < 20 || (h === 20 && m < 45)) {
    const prev = new Date(now)
    prev.setDate(prev.getDate() - (d === 6 ? 1 : 0) - (d !== 6 && (h < 20 || (h === 20 && m < 45)) ? 1 : 0))
    return prev
  }
  return now
}

function latestSaturday(): Date {
  const now = new Date()
  const d = now.getDay()
  if (d === 6) return now
  const sat = new Date(now)
  sat.setDate(now.getDate() - (d === 0 ? 1 : d + 1))
  return sat
}

function isOngoing(): boolean {
  const now = new Date()
  const d = now.getDay(), h = now.getHours(), m = now.getMinutes()
  if (d === 6) return false
  return (h === 20 && m >= 45) || h === 21 || (h === 22 && m === 0)
}

// ──────────────────────────────────────────────
// API
// ──────────────────────────────────────────────

async function fetchMarks(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/admin/alliance-marks')
    if (!res.ok) return {}
    const list = await res.json()
    return list.reduce((acc: Record<string, string>, m: { alliance_name: string; mark_url: string }) => {
      acc[m.alliance_name] = m.mark_url; return acc
    }, {})
  } catch { return {} }
}

// ──────────────────────────────────────────────
// 컴포넌트
// ──────────────────────────────────────────────

export default function WarHistoryPage() {
  const [warType, setWarType] = useState<'거점전' | '점령전'>('거점전')
  const [date, setDate] = useState<Date | undefined>(defaultNodeDate())
  const [region, setRegion] = useState('발레노스/세렌디아')
  const [records, setRecords] = useState<WarRecord[]>([])

  const { data: marks = {} } = useQuery({
    queryKey: ['alliance-marks'],
    queryFn: fetchMarks,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  // 데이터 패치
  useEffect(() => {
    if (!date) return
    const today = new Date().toISOString().split('T')[0]
    const dateStr = date.toISOString().split('T')[0]
    if (dateStr > today) { setRecords([]); return }

    const regionParam = warType === '점령전'
      ? region
      : NODE_GROUPS.find(g => g.label === region)?.regions.join(',') || region

    const q = new URLSearchParams({ date: format(date, 'yyyy-MM-dd'), region: regionParam, war_type: warType })

    const load = async () => {
      try {
        if (isOngoing() && warType === '거점전' && dateStr === today) {
          const r = await fetch(`/api/admin/war-records/load?${q}`)
          if (r.ok) {
            const d = await r.json()
            if (Array.isArray(d) && d.length > 0) {
              setRecords(d.filter((x: WarRecord) => x.alliance_name?.trim()).map((x: WarRecord, i: number) => ({
                id: i + 1000, war_type: warType, war_date: dateStr,
                alliance_name: x.alliance_name, occupied_area: x.occupied_area || '',
                result: x.result || '진행중', fort_stage: x.fort_stage || null,
                region: x.region || regionParam.split(',')[0],
              })))
              return
            }
          }
        }
        const r = await fetch(`/api/war-records/history?${q}`)
        const d = await r.json()
        setRecords(Array.isArray(d) ? d : [])
      } catch { setRecords([]) }
    }
    load()
  }, [date, region, warType])

  const regions = warType === '점령전' ? SIEGE_REGIONS : NODE_GROUPS.map(g => g.label)

  const grouped = warType === '거점전'
    ? NODE_GROUPS.find(g => g.label === region)?.regions.reduce((acc, r) => {
        const recs = records.filter(x => x.region === r)
        if (recs.length > 0) acc[r] = recs
        return acc
      }, {} as Record<string, WarRecord[]>) ?? {}
    : records.length > 0 ? { [region]: records } : {}

  const dateStr = date ? date.toISOString().split('T')[0] : ''
  const isFuture = dateStr > new Date().toISOString().split('T')[0]

  const sort = (recs: WarRecord[]) => [...recs].sort((a, b) => {
    if (a.result === '진행중' && b.result !== '진행중') return -1
    if (a.result !== '진행중' && b.result === '진행중') return 1
    if (a.result === '점령성공' && b.result !== '점령성공') return -1
    if (a.result !== '점령성공' && b.result === '점령성공') return 1
    return (b.fort_stage || 0) - (a.fort_stage || 0)
  })

  // 지역 이미지 가져오기
  const regionImg = (r: string) =>
    warType === '점령전' ? REGION_IMG[r] : GROUP_IMG[r]

  return (
    <div className="space-y-4">

      {/* ── 컨트롤 바 ── */}
      <div
        className="rounded-xl overflow-hidden border border-zinc-800/50"
        style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
      >
        {/* 전투 타입 + 날짜 */}
        <div
          className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-white/[0.06]"
          style={{ background: 'oklch(0.12 0.02 270)' }}
        >
          {/* 전투 타입 */}
          <div className="flex divide-x divide-zinc-700/50 rounded-lg overflow-hidden border border-zinc-700/50">
            {(['거점전', '점령전'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setWarType(t)
                  setDate(t === '점령전' ? latestSaturday() : defaultNodeDate())
                  setRegion(t === '점령전' ? '칼페온' : '발레노스/세렌디아')
                }}
                className={`px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  warType === t
                    ? 'bg-[oklch(0.85_0.18_200)] text-zinc-900'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{t === '거점전' ? '⚔️' : '🏰'}</span>
                {t}
              </button>
            ))}
          </div>

          {/* 날짜 선택 */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/60 transition-colors tabular-nums">
                📅 {date ? format(date, 'yyyy.MM.dd (eee)', { locale: ko }) : '날짜 선택'}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-zinc-800 z-50"
              style={{ background: 'oklch(0.12 0.015 270)' }}
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={d => d && setDate(d)}
                locale={ko}
                initialFocus
                disabled={d => {
                  const today = new Date(); today.setHours(0, 0, 0, 0)
                  if (d > today) return true
                  if (warType === '점령전') return d.getDay() !== 6
                  if (warType === '거점전') return d.getDay() === 6
                  return false
                }}
                classNames={{
                  day_selected: 'bg-[oklch(0.85_0.18_200)] text-zinc-900 font-bold',
                  day_disabled: 'text-zinc-700 opacity-40',
                }}
              />
            </PopoverContent>
          </Popover>

          <span className="ml-auto text-[11px] text-zinc-700 hidden sm:block">클릭해서 변경</span>
        </div>

        {/* 지역 선택 */}
        <div className="flex flex-wrap gap-2 px-5 py-3">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                region === r
                  ? 'bg-[oklch(0.85_0.18_200/0.1)] border-[oklch(0.85_0.18_200/0.4)] text-[oklch(0.85_0.18_200)]'
                  : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {regionImg(r) && (
                <img src={regionImg(r)} alt={r} className="w-4 h-4 object-contain" />
              )}
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── 결과 ── */}
      {isFuture ? (
        <EmptyState msg={warType === '거점전' ? '거점전은 매일 21시 ~ 22시에 진행됩니다.' : '점령전 진행 예정입니다.'} />
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState msg={`해당 날짜에 ${warType} 기록이 없습니다.`} />
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([label, recs]) => (
            <RegionSection
              key={label}
              label={label}
              date={date}
              warType={warType}
              records={sort(recs)}
              marks={marks}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// 서브 컴포넌트
// ──────────────────────────────────────────────

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="py-20 text-center text-zinc-700 text-sm">{msg}</div>
  )
}

function RegionSection({
  label, date, warType, records, marks,
}: {
  label: string
  date: Date | undefined
  warType: string
  records: WarRecord[]
  marks: Record<string, string>
}) {
  const shieldSrc = REGION_IMG[label]

  return (
    <div
      className="rounded-xl overflow-hidden border border-zinc-800/50"
      style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
    >
      {/* 섹션 헤더 */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        {shieldSrc && <img src={shieldSrc} alt={label} className="w-7 h-8 object-contain" />}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white">{label} {warType}</h3>
          <p className="text-[11px] text-zinc-600">
            {date ? format(date, 'yyyy년 MM월 dd일 (eee)', { locale: ko }) : ''}
          </p>
        </div>
        <span className="text-xs text-zinc-600 shrink-0">{records.length}팀</span>
      </div>

      {/* 기록 카드 목록 */}
      <div className="divide-y divide-white/[0.04]">
        {records.map(rec => {
          const cfg = RESULT_CONFIG[rec.result] ?? RESULT_CONFIG['점령실패']
          const areaRegion = Object.keys(REGION_IMG).find(r =>
            rec.occupied_area?.includes(r) || rec.region?.includes(r)
          )

          return (
            <div key={rec.id} className="flex items-stretch hover:bg-white/[0.025] transition-colors group">
              {/* 결과 컬러 사이드바 */}
              <div className={`w-1 shrink-0 ${cfg.bar}`} />

              {/* 본문 */}
              <div className="flex items-center gap-4 px-4 py-3 flex-1 min-w-0">
                {/* 연맹 마크 */}
                {marks[rec.alliance_name] ? (
                  <Image
                    src={marks[rec.alliance_name]}
                    alt={rec.alliance_name}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-zinc-500">{rec.alliance_name.charAt(0)}</span>
                  </div>
                )}

                {/* 연맹명 + 지역 */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/alliance/${encodeURIComponent(rec.alliance_name)}`}
                    className="text-sm font-semibold text-zinc-200 hover:text-[oklch(0.85_0.18_200)] transition-colors truncate block"
                  >
                    {rec.alliance_name}
                  </Link>
                  {rec.occupied_area?.trim() && (
                    <div className="flex items-center gap-1 mt-0.5">
                      {areaRegion && (
                        <img src={REGION_IMG[areaRegion]} alt={areaRegion} className="w-3 h-3 object-contain" />
                      )}
                      <span className="text-[11px] text-zinc-600">{rec.occupied_area}</span>
                    </div>
                  )}
                </div>

                {/* 성채단계 */}
                <div className="text-center shrink-0 hidden sm:block">
                  <p className="text-[10px] text-zinc-700 mb-0.5">성채</p>
                  <p className="text-sm font-bold tabular-nums" style={{ color: 'oklch(0.8 0.18 60)' }}>
                    {rec.fort_stage ?? '-'}
                  </p>
                </div>

                {/* 결과 배지 */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${cfg.badge}`}>
                  {rec.result}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
