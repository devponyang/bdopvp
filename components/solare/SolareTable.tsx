'use client'

import { useState, Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTier } from '@/lib/utils/tier'
import SpecializationModal from './SpecializationModal'

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

export default function SolareTable({ data }: Props) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)
  const [specializationData, setSpecializationData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mobileModalOpen, setMobileModalOpen] = useState(false)
  const [selectedMobilePlayer, setSelectedMobilePlayer] = useState({ name: '', class: '' })
  const [imagePopupOpen, setImagePopupOpen] = useState(false)
  const [popupImageUrl, setPopupImageUrl] = useState('')

  // 클래스 아이콘 매핑 함수
  const getClassIconPath = (className: string) => {
    const classMap: { [key: string]: string } = {
      '워리어': '/class-icons/warrior.png',
      '하사신': '/class-icons/hasasin.png',
      '세이지': '/class-icons/saji.png',
      '레인저': '/class-icons/ranger.png',
      '가디언': '/class-icons/gadi.png',
      '스칼라': '/class-icons/scara.png',
      '드라카니아': '/class-icons/draca.png',
      '소서러': '/class-icons/sor.png',
      '노바': '/class-icons/nova.png',
      '커세어': '/class-icons/cosair.png',
      '란': '/class-icons/lhan.png',
      '자이언트': '/class-icons/jai.png',
      '매구': '/class-icons/magu.png',
      '금수랑': '/class-icons/taimer.png',
      '샤이': '/class-icons/shai.png',
      '격투가': '/class-icons/fighter.png',
      '무사': '/class-icons/musa.png',
      '매화': '/class-icons/mahwa.png',
      '미스틱': '/class-icons/mistic.png',
      '발키리': '/class-icons/valc.png',
      '쿠노이치': '/class-icons/kuno.png',
      '닌자': '/class-icons/ninja.png',
      '다크나이트': '/class-icons/darknight.png',
      '위자드': '/class-icons/wizard.png',
      '아처': '/class-icons/archer.png',
      '우사': '/class-icons/usa.png',
      '위치': '/class-icons/witch.png',
      '도사': '/class-icons/dosa.png',
      '데드아이': '/class-icons/dead.png',
      '오공': '/class-icons/ukong.png'
    }
    return classMap[className] || `/class-icons/${className.toLowerCase()}.png`
  }

  // ✅ 중복 제거: name + score + class 조합으로 유일한 데이터만 남김
  const uniqueData = Array.from(
    new Map(data.map((d) => [`${d.name}-${d.score}-${d.class}`, d])).values()
  )

  // 데스크톱용 클릭 핸들러 (드롭다운)
  const handleDesktopPlayerClick = async (name: string, className: string) => {
    const playerKey = `${name}-${className}`
    
    if (expandedPlayer === playerKey) {
      // 이미 펼쳐진 플레이어를 다시 클릭하면 접기
      setExpandedPlayer(null)
      setSpecializationData(null)
      return
    }
    
    setExpandedPlayer(playerKey)
    setLoading(true)
    setSpecializationData(null)
    
    try {
      const res = await fetch(
        `/api/solare-league/specialization?player=${encodeURIComponent(name)}&class=${encodeURIComponent(className)}`
      )
      
      if (res.ok) {
        const data = await res.json()
        setSpecializationData(data)
      } else if (res.status === 404) {
        setSpecializationData({ error: '특화 정보가 등록되지 않았습니다.' })
      } else {
        setSpecializationData({ error: '특화 정보를 불러오는데 실패했습니다.' })
      }
    } catch (err) {
      setSpecializationData({ error: '네트워크 오류가 발생했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  // 모바일용 클릭 핸들러 (모달)
  const handleMobilePlayerClick = (name: string, className: string) => {
    setSelectedMobilePlayer({ name, class: className })
    setMobileModalOpen(true)
  }

  // 이미지 팝업 열기
  const handleImageClick = (imageUrl: string) => {
    setPopupImageUrl(imageUrl)
    setImagePopupOpen(true)
  }

  // 상위 3등 배경 스타일
  const rankStyles = [
    "text-white rank-header relative overflow-hidden py-16", // 1위 - 2배 높이
    "text-white rank-header relative overflow-hidden py-12",   // 2위 - 2배 높이
    "text-white rank-header relative overflow-hidden py-12", // 3위 - 2배 높이
  ]

  // 클래스별 배경 이미지 매핑 함수
  const getClassBackground = (className: string, _subclass: string) => {
    // 모든 클래스를 클래스이름.png 형식으로 처리
    const bgPath = `/class-bg/${className}.png`
    return bgPath
  }

  return (
    <div className="rounded-xl relative z-10">
      <style jsx>{`
        tr[data-class-bg]::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(var(--class-bg));
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.5;
          z-index: -1;
        }
        tr[data-class-bg] {
          position: relative;
        }
        tr[data-class-bg] > * {
          position: relative;
          z-index: 1;
        }
        div[data-class-bg]::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(var(--class-bg));
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.5;
          z-index: -1;
        }
        div[data-class-bg] {
          position: relative;
        }
        div[data-class-bg] > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-lg text-center solare-table">
        <thead className="bg-gradient-to-r from-slate-700/80 to-blue-800/80 backdrop-blur-sm border-b border-white/20">
          <tr>
            <th className="pl-6 pr-2 py-4 font-bold text-lg text-white">순위</th>
            <th className="pl-2 pr-6 py-4 font-bold text-lg text-white">티어</th>
            <th className="px-6 py-4 font-bold text-lg text-white">가문명</th>
            <th className="px-6 py-4 font-bold text-lg text-white">길드</th>
            <th className="px-6 py-4 font-bold text-lg text-white">전승/각성</th>
            <th className="px-6 py-4 font-bold text-lg text-white">클래스</th>
            <th className="px-6 py-4 font-bold text-lg text-white">승 / 무 / 패</th>
            <th className="px-6 py-4 font-bold text-lg text-white">승률</th>
            <th className="px-6 py-4 font-bold text-lg text-white">점수</th>
          </tr>
        </thead>
        <tbody>
          {uniqueData.map((entry, idx) => {
            const tier = getTier(entry.score)
            const change = entry.rankChange || '-'
            let changeColor = 'text-gray-400'
            if (change.startsWith('▲')) changeColor = 'text-red-500'
            else if (change.startsWith('▼')) changeColor = 'text-blue-500'
            else if (change === 'NEW') changeColor = 'text-green-600'

            return (
              <Fragment key={`${entry.name}-${entry.score}-${idx}`}>
                <tr 
                  className={`border-b border-white/10 transition-all duration-300 hover:bg-white/5 ${
                    idx < 3 ? rankStyles[idx] + ' relative' : "text-white hover:bg-slate-700/30"
                  }`}
                  style={idx < 3 ? {
                    backgroundImage: `url('/ponyang/${idx + 1}st-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  } : {}}
                >
                  <td className={`${idx < 3 ? 'py-8 pl-6 pr-2' : 'py-4 pl-6 pr-2'} font-bold relative`}>
                    {/* 클래스 배경 오버레이 - 테이블 전체 행을 덮음 */}
                    {idx < 3 && getClassBackground(entry.class, entry.subclass || '') && (
                      <div 
                        className="absolute opacity-100 pointer-events-none"
                        style={{
                          backgroundImage: `url('${getClassBackground(entry.class, entry.subclass || '')}')`,
                          backgroundSize: '460px auto',
                          backgroundPosition: 'right 22%',
                          backgroundRepeat: 'no-repeat',
                          left: '-200%',
                          right: '-220%',
                          top: 0,
                          bottom: 0,
                          zIndex: 0
                        }}
                      />
                    )}
                    <div className="flex items-center justify-center gap-2 relative z-10">
                      {idx < 3 ? (
                        <Image
                          src={`/ponyang/${idx + 1}st.png`}
                          alt={`${idx + 1}등`}
                          width={idx === 0 ? 80 : 60}
                          height={idx === 0 ? 80 : 60}
                          className="inline relative top-1"
                        />
                      ) : (
                        <span className="text-xl">{idx + 1}</span>
                      )}
                      <span className={`text-sm ${changeColor}`}>{idx < 3 ? '' : change}</span>
                    </div>
                  </td>
                  <td className={`${idx < 3 ? 'py-8 pl-2 pr-6' : 'py-4 pl-2 pr-6'} relative z-10`}>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-sm"></div>
                        <Image
                          src={idx === 0 && entry.score >= 2401 ? `/solare-icons/rank1.png` : `/solare-icons/${tier}.png`}
                          alt={idx === 0 && entry.score >= 2401 ? '1위 아이콘' : `${tier} 티어 아이콘`}
                          width={idx < 3 ? 72 : 36}
                          height={idx < 3 ? 72 : 36}
                          className="mx-auto relative z-10 drop-shadow-lg"
                        />
                      </div>
                    </div>
                  </td>
                  <td
                    className={`${idx < 3 ? 'py-8 pl-12 pr-6' : 'py-4 pl-12 pr-6'} font-bold cursor-pointer hover:text-blue-400 transition-all duration-300 hover:scale-105 relative z-10`}
                    onClick={() => handleDesktopPlayerClick(entry.name, entry.class)}
                    title="클릭하여 특화 정보 보기"
                  >
                    <span className={`text-white ${idx < 3 ? 'text-xl' : 'text-lg'}`}>
                      {entry.name}
                    </span>
                  </td>
                  <td className={`${idx < 3 ? 'py-8 px-6' : 'py-4 px-6'} font-bold relative z-10`}>
                        {entry.guild_name ? (
                      <Link href={`/guild/${encodeURIComponent(entry.guild_name)}`} className={`text-blue-300 hover:text-blue-400 transition-colors ${idx < 3 ? 'text-xl' : 'text-lg'}`}>
                        {entry.guild_name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className={`${idx < 3 ? 'py-8 px-6' : 'py-4 px-6'} font-bold relative z-10`}>
                    <div className="flex items-center justify-center gap-2">
                      {entry.subclass === '전승' && (
                        <>
                          <Image
                            src="/ponyang/ac.png"
                            alt="전승"
                            width={idx < 3 ? 40 : 28}
                            height={idx < 3 ? 40 : 28}
                            className="inline drop-shadow-lg"
                          />
                          <span className={`text-blue-300 ${idx < 3 ? 'text-xl' : 'text-lg'}`}>전승</span>
                        </>
                      )}
                      {entry.subclass === '각성' && (
                        <>
                          <Image
                            src="/ponyang/aw.png"
                            alt="각성"
                            width={idx < 3 ? 40 : 28}
                            height={idx < 3 ? 40 : 28}
                            className="inline drop-shadow-lg"
                          />
                          <span className={`text-red-300 ${idx < 3 ? 'text-xl' : 'text-lg'}`}>각성</span>
                        </>
                      )}
                      {(!entry.subclass || (entry.subclass !== '전승' && entry.subclass !== '각성')) && (
                        <Image
                          src={getClassIconPath(entry.class)}
                          alt={entry.class}
                          width={idx < 3 ? 40 : 28}
                          height={idx < 3 ? 40 : 28}
                          className="inline drop-shadow-lg"
                        />
                      )}
                    </div>
                  </td>
                  <td className={`${idx < 3 ? 'py-8 px-6' : 'py-4 px-6'} font-bold text-blue-300 ${idx < 3 ? 'text-xl' : 'text-lg'} relative z-10`}>{entry.class}</td>
                  <td className={`${idx < 3 ? 'py-8 px-6' : 'py-4 px-6'} font-bold text-white ${idx < 3 ? 'text-xl' : 'text-lg'} relative z-10`}>
                    {entry.wins}/{entry.draws}/{entry.losses}
                  </td>
                  <td className={`${idx < 3 ? 'py-8 px-6' : 'py-4 px-6'} font-bold relative z-10`}>
                    {entry.wins + entry.draws + entry.losses > 0 ? (
                      (() => {
                        const winRate = Math.round((entry.wins / (entry.wins + entry.draws + entry.losses)) * 100)
                        if (winRate >= 80) {
                          return <span className={`bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent font-bold ${idx < 3 ? 'text-2xl' : 'text-xl'}`}>{winRate}%</span>
                        } else if (winRate >= 70) {
                          return <span className={`bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold ${idx < 3 ? 'text-xl' : 'text-lg'}`}>{winRate}%</span>
                        } else {
                          return <span className={`text-white ${idx < 3 ? 'text-xl' : 'text-lg'}`}>{winRate}%</span>
                        }
                      })()
                    ) : '-'}
                  </td>
                  <td className={`${idx < 3 ? 'py-8 px-6' : 'py-4 px-6'} font-bold text-white ${idx < 3 ? 'text-2xl' : 'text-xl'} relative z-10`}>
                    {entry.score}
                  </td>
                </tr>
                {/* 특화 정보 드롭다운 행 */}
                {expandedPlayer === `${entry.name}-${entry.class}` && (
                  <tr className="bg-zinc-800/50">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        {loading ? (
                          <div className="flex items-center justify-center gap-2 text-gray-400 py-4">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                            로딩 중...
                          </div>
                        ) : specializationData?.error ? (
                          <div className="text-gray-400 text-sm text-center py-4">{specializationData.error}</div>
                        ) : specializationData ? (
                          <div className="space-y-3">
                            {specializationData.specialization_image_url && (
                              <div className="flex justify-center relative">
                                <div className="relative">
                                  <img
                                    src={specializationData.specialization_image_url}
                                    alt={`${entry.name}의 특화`}
                                    className="max-w-full max-h-[500px] rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => handleImageClick(specializationData.specialization_image_url)}
                                    title="클릭하여 크게 보기"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setExpandedPlayer(null)
                                      setSpecializationData(null)
                                    }}
                                    className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 border border-gray-600"
                                  >
                                    닫기
                                  </button>
                                </div>
                              </div>
                            )}
                            {specializationData.description && (
                              <div className="bg-zinc-700/50 rounded-lg p-3">
                                <p className="text-gray-300 text-sm">{specializationData.description}</p>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
        </table>
      </div>

      {/* 모바일 리스트형 레이아웃 - 한 줄에 모든 정보 */}
      <div className="md:hidden">
        <div className="space-y-1">
          {uniqueData.map((entry, idx) => {
            const tier = getTier(entry.score)
            const change = entry.rankChange || '-'
            let changeColor = 'text-gray-400'
            if (change.startsWith('▲')) changeColor = 'text-red-500'
            else if (change.startsWith('▼')) changeColor = 'text-blue-500'
            else if (change === 'NEW') changeColor = 'text-green-600'

            const winRate = entry.wins + entry.draws + entry.losses > 0
              ? Math.round((entry.wins / (entry.wins + entry.draws + entry.losses)) * 100)
              : 0

            return (
              <div
                key={`mobile-${entry.name}-${entry.score}-${idx}`}
                className={`flex items-center gap-2 px-3 py-2.5 border-b border-white/10 cursor-pointer transition-colors hover:bg-white/5 ${
                  idx < 3 ? 'bg-gradient-to-r from-amber-900/20 to-yellow-900/20' : 'bg-zinc-900/30'
                }`}
                style={idx < 3 ? {
                  backgroundImage: `url('/ponyang/${idx + 1}st-bg.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                } : {}}
                onClick={() => handleMobilePlayerClick(entry.name, entry.class)}
              >
                {/* 순위 */}
                <div className="flex-shrink-0 w-12 flex items-center justify-center gap-1">
                  {idx < 3 ? (
                    <Image src={`/ponyang/${idx + 1}st.png`} alt={`${idx + 1}등`} width={28} height={28} />
                  ) : (
                    <>
                      <span className="text-base font-bold text-white">{idx + 1}</span>
                      <span className={`text-xs ${changeColor}`}>{change}</span>
                    </>
                  )}
                </div>

                {/* 티어 아이콘 */}
                <div className="flex-shrink-0">
                  <Image
                    src={idx === 0 && entry.score >= 2401 ? `/solare-icons/rank1.png` : `/solare-icons/${tier}.png`}
                    alt={idx === 0 && entry.score >= 2401 ? '1위 아이콘' : `${tier} 티어`}
                    width={24}
                    height={24}
                    className="drop-shadow-lg"
                  />
                </div>

                {/* 가문명 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white leading-tight break-all">{entry.name}</span>
                  </div>
                </div>

                {/* 클래스명 및 전승/각성 */}
                <div className="flex-shrink-0 text-xs font-bold text-center min-w-[3rem]">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-blue-200">{entry.class}</span>
                    {entry.subclass && (entry.subclass === '전승' || entry.subclass === '각성') && (
                      <span className={`text-[10px] ${entry.subclass === '전승' ? 'text-blue-300' : 'text-purple-300'}`}>
                        {entry.subclass}
                      </span>
                    )}
                  </div>
                </div>

                {/* 승률 */}
                <div className="flex-shrink-0 w-11 text-right">
                  <div className={`text-xs font-bold ${
                    winRate >= 80 ? 'text-rose-400' : winRate >= 70 ? 'text-yellow-300' : 'text-white'
                  }`}>
                    {winRate > 0 ? `${winRate}%` : '-'}
                  </div>
                  <div className="text-xs text-gray-400">{entry.wins}/{entry.draws}/{entry.losses}</div>
                </div>

                {/* 점수 */}
                <div className="flex-shrink-0 w-12 text-right">
                  <div className="text-sm font-bold text-yellow-300">{entry.score}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-white/10">
          <div className="text-xs text-gray-400 text-center">
            💡 각 행을 클릭하면 특화 정보를 볼 수 있습니다
          </div>
        </div>
      </div>

      {/* 모바일 전용 특화 정보 모달 */}
      <SpecializationModal
        playerName={selectedMobilePlayer.name}
        className={selectedMobilePlayer.class}
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
      />

      {/* 이미지 확대 팝업 모달 */}
      {imagePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={popupImageUrl}
              alt="특화 이미지 크게 보기"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setImagePopupOpen(false)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 border border-gray-500"
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
