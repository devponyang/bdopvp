'use client'

import { useState, Fragment } from 'react'
import Image from 'next/image'
import { getTier } from '@/lib/utils/tier'
import SpecializationModal from './SpecializationModal'
import classList from '@/lib/constants/class-list'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  rankChange?: string
  guild_name?: string | null
}

interface Props {
  data: Entry[]
}

const CLASS_ICON_MAP: Record<string, string> = {
  '워리어': 'warrior', '하사신': 'hasasin', '세이지': 'saji',
  '레인저': 'ranger', '가디언': 'gadi', '스칼라': 'scara',
  '드라카니아': 'draca', '소서러': 'sor', '노바': 'nova',
  '커세어': 'cosair', '란': 'lhan', '자이언트': 'jai',
  '매구': 'magu', '금수랑': 'taimer', '샤이': 'shai',
  '격투가': 'fighter', '무사': 'musa', '매화': 'mahwa',
  '미스틱': 'mistic', '발키리': 'valc', '쿠노이치': 'kuno',
  '닌자': 'ninja', '다크나이트': 'darknight', '위자드': 'wizard',
  '아처': 'archer', '우사': 'usa', '위치': 'witch',
  '도사': 'dosa', '데드아이': 'dead', '오공': 'ukong',
}

const PODIUM = [
  { border: 'border-amber-500/30', bg: 'bg-amber-500/[0.06]', nameCls: 'text-amber-200', scoreCls: 'text-amber-400', glow: 'shadow-[0_0_24px_rgba(251,191,36,0.12)]', podiumH: 'h-10', podiumBg: 'bg-amber-500/10' },
  { border: 'border-zinc-400/20', bg: 'bg-zinc-400/[0.04]', nameCls: 'text-zinc-200', scoreCls: 'text-zinc-300', glow: '', podiumH: 'h-8', podiumBg: 'bg-zinc-400/[0.06]' },
  { border: 'border-orange-600/25', bg: 'bg-orange-700/[0.05]', nameCls: 'text-orange-200', scoreCls: 'text-orange-400', glow: '', podiumH: 'h-6', podiumBg: 'bg-orange-600/[0.06]' },
]

const RANK_ACCENT = [
  'text-amber-400',
  'text-zinc-300',
  'text-orange-400',
]

function WinRate({ wins, draws, losses }: { wins: number; draws: number; losses: number }) {
  const total = wins + draws + losses
  if (total === 0) return <span className="text-zinc-600">—</span>
  const rate = Math.round((wins / total) * 100)
  const cls = rate >= 80 ? 'text-rose-400' : rate >= 70 ? 'text-amber-400' : 'text-zinc-300'
  return <span className={`font-bold text-sm ${cls}`}>{rate}%</span>
}

interface PodiumCardProps {
  entry: Entry
  rank: number
  cardWidth: number
  cardHeight: number
  onSpecClick: (name: string, cls: string) => void
}

function PodiumCard({ entry, rank, cardWidth, cardHeight, onSpecClick }: PodiumCardProps) {
  const tier = getTier(entry.score)
  const p = PODIUM[rank - 1]
  const iconName = CLASS_ICON_MAP[entry.class] || entry.class.toLowerCase()
  const total = entry.wins + entry.draws + entry.losses
  const winRate = total > 0 ? Math.round((entry.wins / total) * 100) : 0
  const winColor = winRate >= 80 ? '#f87171' : winRate >= 70 ? '#fbbf24' : '#a1a1aa'

  return (
    <div className="flex flex-col items-center" style={{ width: cardWidth }}>
      <div
        className={`relative flex flex-col items-center overflow-hidden rounded-2xl border ${p.border} ${p.bg} ${p.glow} w-full cursor-pointer hover:brightness-110 transition-all duration-200`}
        style={{ height: cardHeight }}
        onClick={() => onSpecClick(entry.name, entry.class)}
        title="클릭하여 특화 보기"
      >
        {/* Class art background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url('/class-bg/${entry.class}.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.13,
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-1.5 p-4 w-full">
          <Image
            src={`/ponyang/${rank}st.png`}
            alt={`${rank}위`}
            width={rank === 1 ? 68 : 50}
            height={rank === 1 ? 68 : 50}
          />
          <Image
            src={rank === 1 && entry.score >= 2401 ? '/solare-icons/rank1.png' : `/solare-icons/${tier}.png`}
            alt={tier}
            width={rank === 1 ? 40 : 32}
            height={rank === 1 ? 40 : 32}
            className="object-contain drop-shadow-lg"
          />
          <span className={`font-bold text-center leading-tight ${rank === 1 ? 'text-lg' : 'text-sm'} ${p.nameCls}`}>
            {entry.name}
          </span>
          {entry.guild_name && (
            <span className="text-xs text-sky-400/70 truncate max-w-full px-2">{entry.guild_name}</span>
          )}
          <div className="flex items-center gap-1.5">
            <img
              src={`/class-icons/${iconName}.png`}
              alt={entry.class}
              className="w-4 h-4 object-contain brightness-0 invert opacity-50"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <span className="text-xs text-zinc-400">
              {entry.class}
              {entry.subclass === '전승' && <span className="text-cyan-400 ml-1">전승</span>}
              {entry.subclass === '각성' && <span className="text-fuchsia-400 ml-1">각성</span>}
            </span>
          </div>
          <span className={`font-bold font-mono ${rank === 1 ? 'text-2xl' : 'text-xl'} ${p.scoreCls}`}>
            {entry.score}
          </span>
          <span className="text-xs font-mono text-zinc-500">
            <span className="text-emerald-400/80">{entry.wins}</span>
            <span className="text-zinc-700">/</span>
            {entry.draws}
            <span className="text-zinc-700">/</span>
            <span className="text-rose-400/60">{entry.losses}</span>
          </span>
          {total > 0 && (
            <span className="text-sm font-bold" style={{ color: winColor }}>{winRate}%</span>
          )}
        </div>
      </div>

      <div className={`w-full rounded-b-lg flex items-center justify-center ${p.podiumH} ${p.podiumBg}`}>
        <span className={`text-xs font-bold ${p.scoreCls} opacity-60`}>{rank}위</span>
      </div>
    </div>
  )
}

export default function SolareTable({ data }: Props) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)
  const [specializationData, setSpecializationData] = useState<any>(null)
  const [specLoading, setSpecLoading] = useState(false)
  const [mobileModalOpen, setMobileModalOpen] = useState(false)
  const [selectedMobile, setSelectedMobile] = useState({ name: '', class: '' })
  const [imagePopupOpen, setImagePopupOpen] = useState(false)
  const [popupImageUrl, setPopupImageUrl] = useState('')

  const uniqueData = Array.from(
    new Map(data.map((d) => [`${d.name}-${d.score}-${d.class}`, d])).values()
  )

  const top3 = uniqueData.slice(0, 3)

  const rankedClasses = new Set(uniqueData.map(e => e.class))
  const missingClasses = classList.filter(cls => !rankedClasses.has(cls))

  const handleSpecClick = async (name: string, className: string) => {
    const key = `${name}-${className}`
    if (expandedPlayer === key) { setExpandedPlayer(null); setSpecializationData(null); return }
    setExpandedPlayer(key); setSpecLoading(true); setSpecializationData(null)
    try {
      const res = await fetch(`/api/solare-league/specialization?player=${encodeURIComponent(name)}&class=${encodeURIComponent(className)}`)
      if (res.ok) setSpecializationData(await res.json())
      else if (res.status === 404) setSpecializationData({ error: '특화 정보가 등록되지 않았습니다.' })
      else setSpecializationData({ error: '특화 정보를 불러오는데 실패했습니다.' })
    } catch { setSpecializationData({ error: '네트워크 오류가 발생했습니다.' }) }
    finally { setSpecLoading(false) }
  }

  const handleMobileClick = (name: string, className: string) => {
    setSelectedMobile({ name, class: className }); setMobileModalOpen(true)
  }

  return (
    <div>
      {/* ══ DESKTOP ══ */}
      <div className="hidden md:block">

        {/* ── Podium top 3 ── */}
        {top3.length > 0 && (
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-end justify-center gap-4">
              {top3[1] && <PodiumCard entry={top3[1]} rank={2} cardWidth={230} cardHeight={240} onSpecClick={handleSpecClick} />}
              {top3[0] && <PodiumCard entry={top3[0]} rank={1} cardWidth={270} cardHeight={300} onSpecClick={handleSpecClick} />}
              {top3[2] && <PodiumCard entry={top3[2]} rank={3} cardWidth={210} cardHeight={220} onSpecClick={handleSpecClick} />}
            </div>

            {expandedPlayer && top3.some(e => `${e.name}-${e.class}` === expandedPlayer) && (
              <div className="mt-4 bg-zinc-900/80 border border-zinc-800 rounded-xl px-5 py-4">
                <div className="border-l-2 border-cyan-500/40 pl-4">
                  {specLoading ? (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      불러오는 중...
                    </div>
                  ) : specializationData?.error ? (
                    <div className="text-zinc-500 text-sm py-2">{specializationData.error}</div>
                  ) : specializationData?.specialization_image_url ? (
                    <div className="relative inline-block">
                      <img
                        src={specializationData.specialization_image_url}
                        alt="특화"
                        className="max-w-full max-h-[500px] rounded-lg border border-zinc-700/50 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => { setPopupImageUrl(specializationData.specialization_image_url); setImagePopupOpen(true) }}
                      />
                      <button
                        onClick={() => { setExpandedPlayer(null); setSpecializationData(null) }}
                        className="absolute bottom-2 right-2 bg-zinc-900/90 text-zinc-300 hover:text-white px-3 py-1 rounded-md text-xs border border-zinc-700/50"
                      >
                        닫기
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Full ranking table (1-100) ── */}
        <div className="border-t border-zinc-800/80 mt-2">
          <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900/40">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest">전체 순위</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60 bg-zinc-900/30">
                <th className="pl-5 pr-3 py-2.5 text-left text-[10px] font-bold text-zinc-600 uppercase tracking-widest">순위</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">티어</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-zinc-600 uppercase tracking-widest">가문명</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-zinc-600 uppercase tracking-widest">길드</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">전승/각성</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-zinc-600 uppercase tracking-widest">클래스</th>
                <th className="px-4 py-2.5 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">승/무/패</th>
                <th className="px-4 py-2.5 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">승률</th>
                <th className="pl-4 pr-5 py-2.5 text-right text-[10px] font-bold text-zinc-600 uppercase tracking-widest">점수</th>
              </tr>
            </thead>
            <tbody>
              {uniqueData.map((entry, idx) => {
                const tier = getTier(entry.score)
                const change = entry.rankChange || '-'
                const changeColor = change.startsWith('▲') ? 'text-rose-400' : change.startsWith('▼') ? 'text-sky-400' : change === 'NEW' ? 'text-emerald-400' : 'text-zinc-700'
                const iconName = CLASS_ICON_MAP[entry.class] || entry.class.toLowerCase()
                const playerKey = `${entry.name}-${entry.class}`
                const isExpanded = expandedPlayer === playerKey
                const rankNum = idx + 1
                const isTop3 = idx < 3

                return (
                  <Fragment key={`${entry.name}-${entry.score}-${idx}`}>
                    <tr className={`border-b border-zinc-800/40 transition-colors duration-100 group ${isTop3 ? 'bg-zinc-800/10' : 'hover:bg-zinc-800/20'}`}>
                      {/* Rank */}
                      <td className="py-3 pl-5 pr-3">
                        <div className="flex items-center gap-1.5">
                          {isTop3 ? (
                            <Image src={`/ponyang/${rankNum}st.png`} alt={`${rankNum}위`} width={20} height={20} className="flex-shrink-0" />
                          ) : (
                            <span className="text-zinc-400 font-bold font-mono text-sm w-7 text-right">{rankNum}</span>
                          )}
                          {change !== '-' && (
                            <span className={`text-[10px] ${changeColor}`}>{change}</span>
                          )}
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-3 px-3 text-center">
                        <Image
                          src={`/solare-icons/${tier}.png`}
                          alt={tier}
                          width={28}
                          height={28}
                          className="object-contain mx-auto"
                        />
                      </td>

                      {/* Name */}
                      <td
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => handleSpecClick(entry.name, entry.class)}
                        title="클릭하여 특화 보기"
                      >
                        <span className={`font-semibold text-sm hover:text-cyan-400 transition-colors group-hover:text-cyan-400/80 ${isTop3 ? RANK_ACCENT[idx] : 'text-zinc-200'}`}>
                          {entry.name}
                        </span>
                      </td>

                      {/* Guild */}
                      <td className="py-3 px-4">
                        {entry.guild_name
                          ? <span className="text-sky-400/70 text-xs">{entry.guild_name}</span>
                          : <span className="text-zinc-700">—</span>
                        }
                      </td>

                      {/* Subclass */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {entry.subclass === '전승' && (
                            <>
                              <Image src="/ponyang/ac.png" alt="전승" width={18} height={18} />
                              <span className="text-cyan-400 text-xs">전승</span>
                            </>
                          )}
                          {entry.subclass === '각성' && (
                            <>
                              <Image src="/ponyang/aw.png" alt="각성" width={18} height={18} />
                              <span className="text-fuchsia-400 text-xs">각성</span>
                            </>
                          )}
                          {(!entry.subclass || (entry.subclass !== '전승' && entry.subclass !== '각성')) && (
                            <span className="text-zinc-700">—</span>
                          )}
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={`/class-icons/${iconName}.png`}
                            alt={entry.class}
                            className="w-4 h-4 object-contain brightness-0 invert opacity-40"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                          />
                          <span className="text-zinc-400 text-xs">{entry.class}</span>
                        </div>
                      </td>

                      {/* W/D/L */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono text-xs">
                          <span className="text-emerald-400/80">{entry.wins}</span>
                          <span className="text-zinc-700">/</span>
                          <span className="text-zinc-500">{entry.draws}</span>
                          <span className="text-zinc-700">/</span>
                          <span className="text-rose-400/60">{entry.losses}</span>
                        </span>
                      </td>

                      {/* Win rate */}
                      <td className="py-3 px-4 text-center">
                        <WinRate wins={entry.wins} draws={entry.draws} losses={entry.losses} />
                      </td>

                      {/* Score */}
                      <td className="py-3 pl-4 pr-5 text-right">
                        <span className={`font-bold font-mono text-sm ${isTop3 ? RANK_ACCENT[idx] : 'text-zinc-300'}`}>{entry.score}</span>
                      </td>
                    </tr>

                    {/* Specialization dropdown */}
                    {isExpanded && (
                      <tr className="bg-zinc-900/60 border-b border-zinc-800/40">
                        <td colSpan={9} className="px-5 py-3">
                          <div className="border-l-2 border-cyan-500/40 pl-4">
                            {specLoading ? (
                              <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                불러오는 중...
                              </div>
                            ) : specializationData?.error ? (
                              <div className="text-zinc-500 text-sm py-2">{specializationData.error}</div>
                            ) : specializationData?.specialization_image_url ? (
                              <div className="relative inline-block">
                                <img
                                  src={specializationData.specialization_image_url}
                                  alt={`${entry.name}의 특화`}
                                  className="max-w-full max-h-[500px] rounded-lg border border-zinc-700/50 cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => { setPopupImageUrl(specializationData.specialization_image_url); setImagePopupOpen(true) }}
                                />
                                <button
                                  onClick={() => { setExpandedPlayer(null); setSpecializationData(null) }}
                                  className="absolute bottom-2 right-2 bg-zinc-900/90 text-zinc-300 hover:text-white px-3 py-1 rounded-md text-xs border border-zinc-700/50"
                                >
                                  닫기
                                </button>
                              </div>
                            ) : specializationData?.description ? (
                              <p className="text-zinc-400 text-sm">{specializationData.description}</p>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}

              {/* ── Missing classes ── */}
              {missingClasses.length > 0 && (
                <>
                  <tr>
                    <td colSpan={9} className="px-6 py-3 bg-zinc-900/40">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-zinc-800" />
                        <span className="text-[11px] text-zinc-600 font-semibold uppercase tracking-widest">순위권 외 직업</span>
                        <div className="h-px flex-1 bg-zinc-800" />
                      </div>
                    </td>
                  </tr>
                  {missingClasses.map(cls => {
                    const iconName = CLASS_ICON_MAP[cls] || cls.toLowerCase()
                    return (
                      <tr key={cls} className="border-b border-zinc-800/20 opacity-40">
                        <td className="py-2.5 pl-5 pr-3">
                          <span className="text-zinc-600 font-mono text-xs">—</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Image src="/solare-icons/null.png" alt="미진입" width={22} height={22} className="object-contain mx-auto" />
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="text-zinc-600 text-sm">—</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="text-zinc-700 text-xs">—</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-zinc-700">—</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={`/class-icons/${iconName}.png`}
                              alt={cls}
                              className="w-4 h-4 object-contain brightness-0 invert opacity-30"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                            />
                            <span className="text-zinc-500 text-xs">{cls}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="text-zinc-700 text-xs">—</span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="text-zinc-700 text-xs">—</span>
                        </td>
                        <td className="py-2.5 pl-4 pr-5 text-right">
                          <span className="text-zinc-600 text-xs">미진입</span>
                        </td>
                      </tr>
                    )
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ MOBILE ══ */}
      <div className="md:hidden divide-y divide-zinc-800/60">
        {uniqueData.map((entry, idx) => {
          const tier = getTier(entry.score)
          const change = entry.rankChange || '-'
          const changeColor = change.startsWith('▲') ? 'text-rose-400' : change.startsWith('▼') ? 'text-sky-400' : change === 'NEW' ? 'text-emerald-400' : 'text-zinc-700'
          const total = entry.wins + entry.draws + entry.losses
          const winRate = total > 0 ? Math.round((entry.wins / total) * 100) : 0
          const isTop = idx < 3
          const p = isTop ? PODIUM[idx] : null

          return (
            <div
              key={`m-${entry.name}-${entry.score}-${idx}`}
              className={`flex items-center gap-2.5 px-3 py-3 cursor-pointer transition-colors hover:bg-zinc-800/30 ${isTop ? p!.bg : ''}`}
              style={isTop ? { borderLeft: `2px solid ${['rgba(251,191,36,0.4)', 'rgba(212,212,212,0.3)', 'rgba(205,133,63,0.35)'][idx]}` } : { borderLeft: '2px solid transparent' }}
              onClick={() => handleMobileClick(entry.name, entry.class)}
            >
              <div className="flex-shrink-0 w-10 flex items-center justify-center">
                {isTop ? (
                  <Image src={`/ponyang/${idx + 1}st.png`} alt={`${idx + 1}등`} width={28} height={28} />
                ) : (
                  <div className="text-center">
                    <div className="text-sm font-bold font-mono text-zinc-400">{idx + 1}</div>
                    {change !== '-' && <div className={`text-[9px] ${changeColor}`}>{change}</div>}
                  </div>
                )}
              </div>

              <Image
                src={idx === 0 && entry.score >= 2401 ? '/solare-icons/rank1.png' : `/solare-icons/${tier}.png`}
                alt={tier} width={22} height={22} className="flex-shrink-0 object-contain"
              />

              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold truncate ${isTop ? p!.nameCls : 'text-zinc-300'}`}>{entry.name}</div>
                <div className={`text-[10px] truncate ${entry.guild_name ? 'text-sky-400/60' : 'text-zinc-700'}`}>
                  {entry.guild_name ?? '—'}
                </div>
              </div>

              <div className="flex-shrink-0 text-center min-w-[52px]">
                <div className="text-xs text-zinc-400">{entry.class}</div>
                {entry.subclass === '전승' && <div className="text-[9px] text-cyan-400">전승</div>}
                {entry.subclass === '각성' && <div className="text-[9px] text-fuchsia-400">각성</div>}
              </div>

              <div className="flex-shrink-0 w-11 text-right">
                <div className={`text-xs font-bold ${winRate >= 80 ? 'text-rose-400' : winRate >= 70 ? 'text-amber-400' : 'text-zinc-300'}`}>
                  {winRate > 0 ? `${winRate}%` : '—'}
                </div>
                <div className="text-[9px] text-zinc-600 font-mono">{entry.wins}/{entry.draws}/{entry.losses}</div>
              </div>

              <div className="flex-shrink-0 w-12 text-right">
                <div className={`text-sm font-bold font-mono ${isTop ? p!.scoreCls : 'text-zinc-300'}`}>{entry.score}</div>
              </div>
            </div>
          )
        })}

        {/* Missing classes (mobile) */}
        {missingClasses.length > 0 && (
          <>
            <div className="px-3 py-2.5 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-widest">순위권 외 직업</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
            </div>
            {missingClasses.map(cls => {
              const iconName = CLASS_ICON_MAP[cls] || cls.toLowerCase()
              return (
                <div key={`m-missing-${cls}`} className="flex items-center gap-2.5 px-3 py-2.5 opacity-35">
                  <div className="flex-shrink-0 w-10 text-center">
                    <span className="text-zinc-600 text-xs font-mono">—</span>
                  </div>
                  <Image src="/solare-icons/null.png" alt="미진입" width={20} height={20} className="flex-shrink-0 object-contain" />
                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    <img
                      src={`/class-icons/${iconName}.png`}
                      alt={cls}
                      className="w-4 h-4 object-contain brightness-0 invert opacity-40 flex-shrink-0"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                    <span className="text-xs text-zinc-500">{cls}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 flex-shrink-0">미진입</span>
                </div>
              )
            })}
          </>
        )}

        <div className="px-3 py-2.5 bg-zinc-900/20 text-center text-[10px] text-zinc-600">
          카드를 터치하면 특화 정보를 볼 수 있습니다
        </div>
      </div>

      {/* Mobile modal */}
      <SpecializationModal
        playerName={selectedMobile.name}
        className={selectedMobile.class}
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
      />

      {/* Image popup */}
      {imagePopupOpen && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={() => setImagePopupOpen(false)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]" onClick={e => e.stopPropagation()}>
            <img
              src={popupImageUrl}
              alt="특화 크게 보기"
              className="max-w-full max-h-full object-contain rounded-xl border border-zinc-700/50"
            />
            <button
              onClick={() => setImagePopupOpen(false)}
              className="absolute top-3 right-3 bg-zinc-900/90 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm border border-zinc-700/50"
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
