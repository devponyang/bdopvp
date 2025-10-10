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
                        className="absolute opacity-70 pointer-events-none"
                        style={{
                          backgroundImage: `url('${getClassBackground(entry.class, entry.subclass || '')}')`,
                          backgroundSize: '350px auto',
                          backgroundPosition: 'right 22%',
                          backgroundRepeat: 'no-repeat',
                          left: '-200%',
                          right: '-190%',
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
                      <span className={`text-sm ${changeColor}`}>{change}</span>
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
                    className={`${idx < 3 ? 'py-8 px-6' : 'py-4 px-6'} font-bold cursor-pointer hover:text-blue-400 transition-all duration-300 hover:scale-105 relative z-10`}
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
                        <>
                          {entry.class === '샤이' && (
                            <Image
                              src="/ponyang/shai.png"
                              alt="샤이"
                              width={idx < 3 ? 40 : 28}
                              height={idx < 3 ? 40 : 28}
                              className="inline drop-shadow-lg"
                            />
                          )}
                          {entry.class === '스칼라' && (
                            <Image
                              src="/ponyang/scara.png"
                              alt="스칼라"
                              width={idx < 3 ? 40 : 28}
                              height={idx < 3 ? 40 : 28}
                              className="inline drop-shadow-lg"
                            />
                          )}
                          {entry.class === '아처' && (
                            <Image
                              src="/ponyang/archer.png"
                              alt="아처"
                              width={idx < 3 ? 40 : 28}
                              height={idx < 3 ? 40 : 28}
                              className="inline drop-shadow-lg"
                            />
                          )}
                          {entry.class === '오공' && (
                            <Image
                              src="/ponyang/ukong.png"
                              alt="오공"
                              width={idx < 3 ? 40 : 28}
                              height={idx < 3 ? 40 : 28}
                              className="inline drop-shadow-lg"
                            />
                          )}
                          {entry.class === '데드아이' && (
                            <Image
                              src="/ponyang/dead.png"
                              alt="데드아이"
                              width={idx < 3 ? 40 : 28}
                              height={idx < 3 ? 40 : 28}
                              className="inline drop-shadow-lg"
                            />
                          )}
                        </>
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

      {/* 모바일 카드 레이아웃 */}
      <div className="md:hidden space-y-3 p-2">
        {uniqueData.map((entry, idx) => {
          const tier = getTier(entry.score)
          const change = entry.rankChange || '-'
          let changeColor = 'text-gray-400'
          if (change.startsWith('▲')) changeColor = 'text-red-500'
          else if (change.startsWith('▼')) changeColor = 'text-blue-500'
          else if (change === 'NEW') changeColor = 'text-green-600'

          return (
            <div
              key={`mobile-${entry.name}-${entry.score}-${idx}`}
              className={`p-4 rounded-2xl border-2 shadow-xl transition-all duration-300 active:scale-95 ${
                idx < 3 ? "text-white relative overflow-hidden" : "bg-gradient-to-r from-slate-800/70 to-blue-900/70 border-white/20 text-white backdrop-blur-sm"
              }`}
              style={idx < 3 ? {
                backgroundImage: `url('/ponyang/${idx + 1}st-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
              } : {}}
              onClick={() => handleMobilePlayerClick(entry.name, entry.class)}
            >
              {/* 클래스 배경 오버레이 */}
              {idx < 3 && getClassBackground(entry.class, entry.subclass || '') && (
                <div 
                  className="absolute opacity-70 pointer-events-none"
                  style={{
                    backgroundImage: `url('${getClassBackground(entry.class, entry.subclass || '')}')`,
                    backgroundSize: '250px auto',
                    backgroundPosition: 'right 20%',
                    backgroundRepeat: 'no-repeat',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0
                  }}
                />
              )}
              {/* 상단: 순위, 가문명, 티어 */}
              <div className="flex items-start justify-between mb-3 relative z-10">
                {/* 좌측: 순위 */}
                <div className="flex flex-col items-center gap-1">
                  {idx < 3 ? (
                    <Image
                      src={`/ponyang/${idx + 1}st.png`}
                      alt={`${idx + 1}등`}
                      width={40}
                      height={40}
                      className="relative"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{idx + 1}</span>
                    </div>
                  )}
                  <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>
                </div>

                {/* 중앙: 가문명 및 클릭 힌트 */}
                <div className="flex-1 flex flex-col items-center gap-1 mx-2 mt-1">
                  <div className="text-xl font-bold text-white text-center leading-tight">
                    {entry.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-300">
                    <span>👆</span>
                    <span className="font-medium">특화 보기</span>
                  </div>
                </div>

                {/* 우측: 티어 */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-sm"></div>
                    <Image
                      src={idx === 0 && entry.score >= 2401 ? `/solare-icons/rank1.png` : `/solare-icons/${tier}.png`}
                      alt={idx === 0 && entry.score >= 2401 ? '1위 아이콘' : `${tier} 티어`}
                      width={40}
                      height={40}
                      className="relative z-10 drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* 중앙: 전승/각성 및 클래스 - 더 눈에 띄게 */}
              <div className="mb-3 py-2 px-3 bg-black/30 rounded-xl border border-white/20 relative z-10">
                <div className="flex items-center justify-center gap-2">
                  {/* 전승/각성 아이콘 - 크게 */}
                  <div className="flex flex-col items-center gap-1">
                    {entry.subclass === '전승' && (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md"></div>
                          <Image
                            src="/ponyang/ac.png"
                            alt="전승"
                            width={36}
                            height={36}
                            className="relative z-10 drop-shadow-lg"
                          />
                        </div>
                        <span className="text-xs font-bold text-blue-300">전승</span>
                      </>
                    )}
                    {entry.subclass === '각성' && (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-md"></div>
                          <Image
                            src="/ponyang/aw.png"
                            alt="각성"
                            width={36}
                            height={36}
                            className="relative z-10 drop-shadow-lg"
                          />
                        </div>
                        <span className="text-xs font-bold text-purple-300">각성</span>
                      </>
                    )}
                    {(!entry.subclass || (entry.subclass !== '전승' && entry.subclass !== '각성')) && (
                      <>
                        {entry.class === '샤이' && (
                          <>
                            <Image src="/ponyang/shai.png" alt="샤이" width={36} height={36} className="drop-shadow-lg" />
                            <span className="text-xs font-bold text-pink-300">샤이</span>
                          </>
                        )}
                        {entry.class === '스칼라' && (
                          <>
                            <Image src="/ponyang/scara.png" alt="스칼라" width={36} height={36} className="drop-shadow-lg" />
                            <span className="text-xs font-bold text-green-300">스칼라</span>
                          </>
                        )}
                        {entry.class === '아처' && (
                          <>
                            <Image src="/ponyang/archer.png" alt="아처" width={36} height={36} className="drop-shadow-lg" />
                            <span className="text-xs font-bold text-emerald-300">아처</span>
                          </>
                        )}
                        {entry.class === '오공' && (
                          <>
                            <Image src="/ponyang/ukong.png" alt="오공" width={36} height={36} className="drop-shadow-lg" />
                            <span className="text-xs font-bold text-yellow-300">오공</span>
                          </>
                        )}
                        {entry.class === '데드아이' && (
                          <>
                            <Image src="/ponyang/dead.png" alt="데드아이" width={36} height={36} className="drop-shadow-lg" />
                            <span className="text-xs font-bold text-red-300">데드아이</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* 구분선 */}
                  <div className="w-px h-8 bg-white/20"></div>
                  
                  {/* 클래스명 */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">클래스</span>
                    <span className="text-sm font-medium text-blue-200">{entry.class}</span>
                  </div>
                </div>
              </div>

              {/* 전적 정보 - 간격 조정 */}
              <div className="grid grid-cols-3 gap-3 mb-3 relative z-10">
                <div className="bg-black/20 rounded-lg p-2 border border-white/10 text-center">
                  <div className="text-gray-400 text-xs mb-0.5">승/무/패</div>
                  <div className="text-white font-bold text-base">{entry.wins}/{entry.draws}/{entry.losses}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-2 border border-white/10 text-center">
                  <div className="text-gray-400 text-xs mb-0.5">승률</div>
                  <div className="font-bold text-base">
                    {entry.wins + entry.draws + entry.losses > 0 ? (
                      (() => {
                        const winRate = Math.round((entry.wins / (entry.wins + entry.draws + entry.losses)) * 100)
                        if (winRate >= 80) {
                          return <span className="text-rose-400 font-bold">{winRate}%</span>
                        } else if (winRate >= 70) {
                          return <span className="text-yellow-300">{winRate}%</span>
                        } else {
                          return <span className="text-white">{winRate}%</span>
                        }
                      })()
                    ) : '-'}
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-2 border border-white/10 text-center">
                  <div className="text-gray-400 text-xs mb-0.5">점수</div>
                  <div className="text-yellow-300 font-bold text-base">{entry.score}</div>
                </div>
              </div>
              
              {/* 길드 정보 */}
              {entry.guild_name && (
                <div className="text-center py-2 px-3 bg-black/20 rounded-lg border border-white/10 relative z-10">
                  <div className="text-gray-400 text-xs mb-0.5">길드</div>
                  <Link 
                    href={`/guild/${encodeURIComponent(entry.guild_name)}`} 
                    className="text-blue-300 hover:text-blue-400 transition-colors font-semibold text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {entry.guild_name}
                  </Link>
                </div>
              )}
            </div>
          )
        })}
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
