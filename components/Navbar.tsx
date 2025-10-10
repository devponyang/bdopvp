'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import Tooltip from '../app/components/Tooltip' // 더 이상 사용하지 않음
import FavoriteMenu from './FavoriteMenu'
import { TIP_CATEGORIES } from '@/lib/constants/tip-categories'

type SearchResult = {
  type: 'guild' | 'family' | 'alliance'
  name: string
}

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showTipDropdown, setShowTipDropdown] = useState(false)
  const [tipDropdownTimeout, setTipDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const router = useRouter()

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (tipDropdownTimeout) {
        clearTimeout(tipDropdownTimeout)
      }
    }
  }, [tipDropdownTimeout])

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim().normalize('NFC')
    if (!trimmed) return

    // 검색 후 모바일 검색창 닫기
    setShowMobileSearch(false)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      const data: SearchResult[] = await res.json()

      const exact = data.find(
        (item) => item.name.normalize('NFC') === trimmed
      )

      // 정확히 일치하는 항목이 여러 개인 경우 (연맹명과 길드명이 동일한 경우) 검색 결과 페이지로 이동
      const exactMatches = data.filter(
        (item) => item.name.normalize('NFC') === trimmed
      )

      if (exactMatches.length > 1) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      } else if (exact) {
        if (exact.type === 'guild' || exact.type === 'family') {
          router.push(`/${exact.type}/${encodeURIComponent(exact.name)}`)
        } else if (exact.type === 'alliance') {
          router.push(`/alliance/${encodeURIComponent(exact.name)}`)
        }
      } else if (data.length === 1) {
        const result = data[0]
        if (result.type === 'guild' || result.type === 'family') {
          router.push(`/${result.type}/${encodeURIComponent(result.name)}`)
        } else if (result.type === 'alliance') {
          router.push(`/alliance/${encodeURIComponent(result.name)}`)
        }
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      }
    } catch (err) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 shadow-xl border-b border-zinc-700">
      <div className="flex items-center max-w-full md:max-w-[1490px] mx-auto px-4 md:px-8 py-4">
        {/* 로고 */}
        <a href="/" className="flex items-center gap-2 md:gap-3 shrink-0 group">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={32}
              className="object-contain rounded-lg w-10 h-8 md:w-14 md:h-12 transition-transform duration-200 group-hover:scale-105 shadow-lg"
              priority
            />
            <div className="absolute inset-0 rounded-lg bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
          <span className="text-xl md:text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-200">
            BDOPVP-포냥이
          </span>
        </a>

        {/* 검색창 - 데스크톱에서만 표시 */}
        <div className="relative flex-1 mx-8 md:mx-12 max-w-2xl hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="길드명 또는 연맹명을 검색해주세요"
                className="w-full px-4 md:px-6 py-3 rounded-xl bg-white/95 dark:bg-zinc-800/80 border-2 border-zinc-400 dark:border-zinc-600 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm md:text-base backdrop-blur-sm transition-all duration-200 shadow-lg"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  검색
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 알림 아이콘 */}
        <div className="hidden md:block">
          <button 
            onClick={() => setShowNoticeModal(true)}
            className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-600 text-yellow-400 hover:text-yellow-300 hover:bg-zinc-700/50 transition-all duration-200 relative"
          >
            🔔
            {/* 새 공지가 있을 때 빨간 점 표시 */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* 모바일 검색 아이콘 */}
        <div className="md:hidden block ml-auto">
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-600 text-yellow-400 hover:text-yellow-300 hover:bg-zinc-700/50 transition-all duration-200"
          >
            🔍
          </button>
        </div>

      </div>

      {/* 모바일 검색창 - 메뉴바 위에 표시 */}
      {showMobileSearch && (
        <div className="md:hidden px-3 sm:px-4 py-3 bg-zinc-800/95 border-t border-zinc-600 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="길드명 또는 연맹명을 검색해주세요"
                className="w-full px-3 sm:px-4 py-3 rounded-xl bg-white/95 dark:bg-zinc-700/80 border-2 border-zinc-400 dark:border-zinc-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base backdrop-blur-sm transition-all duration-200 shadow-lg"
                autoFocus
              />
              <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2">
                <button
                  type="submit"
                  className="px-2 sm:px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs sm:text-sm"
                >
                  검색
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 즐겨찾기 섹션 */}
      <FavoriteMenu />

      {/* 메뉴바 */}
      <div className="bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-t border-zinc-600 shadow-lg">
        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex justify-between max-w-[1490px] mx-auto px-6 py-3 text-base font-semibold text-white">
          <Link href="/" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <img src="/icons/home-icon.png" alt="홈" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>홈</span>
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => {
              if (tipDropdownTimeout) {
                clearTimeout(tipDropdownTimeout)
                setTipDropdownTimeout(null)
              }
              setShowTipDropdown(true)
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => {
                setShowTipDropdown(false)
              }, 150) // 150ms 지연
              setTipDropdownTimeout(timeout)
            }}
          >
            <Link href="/tip-board" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
              <img src="/icons/tip-icon.png" alt="팁게시판" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span>팁게시판</span>
              <span className="text-xs">▼</span>
            </Link>
            
            {/* 드롭다운 메뉴 */}
            {showTipDropdown && (
              <div 
                className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-600 rounded-lg shadow-xl z-50 min-w-48"
                onMouseEnter={() => {
                  if (tipDropdownTimeout) {
                    clearTimeout(tipDropdownTimeout)
                    setTipDropdownTimeout(null)
                  }
                  setShowTipDropdown(true)
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setShowTipDropdown(false)
                  }, 150) // 150ms 지연
                  setTipDropdownTimeout(timeout)
                }}
              >
                <div className="py-2">
                  <Link 
                    href="/tip-board" 
                    className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 hover:text-yellow-400 transition-colors duration-200"
                    onClick={() => setShowTipDropdown(false)}
                  >
                    📝 전체
                  </Link>
                  {Object.values(TIP_CATEGORIES).map(category => (
                    <Link 
                      key={category}
                      href={`/tip-board?category=${encodeURIComponent(category)}`}
                      className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 hover:text-yellow-400 transition-colors duration-200"
                      onClick={() => setShowTipDropdown(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/guild-recruit" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <img src="/icons/guild-icon.png" alt="길드모집" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>길드모집</span>
          </Link>
          <Link href="/war-records" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <img src="/icons/war-icon.png" alt="거점/점령전" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>거점/점령전</span>
          </Link>
          <Link href="/guild-league" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <img src="/icons/guild-league-icon.png" alt="길드 리그" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>길드 리그</span>
          </Link>
          <Link href="/solare-league" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <img src="/icons/rank1.png" alt="솔라레의 창" className="w-6 h-6 object-contain" />
            <span>솔라레의 창</span>
          </Link>
          <Link href="/master-class" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <img src="/icons/masterclass-icon.png" alt="마스터 클래스" className="w-6 h-6 object-contain" />
            <span>마스터 클래스</span>
          </Link>
          <Link href="/statistics" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <img src="/icons/tong-tip.png" alt="통계" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>통계</span>
          </Link>
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden">
          <div className="grid grid-cols-3 gap-1 px-2 py-2 text-xs font-semibold text-white">
            <Link href="/" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/home-icon.png" alt="홈" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="leading-tight">홈</span>
            </Link>
            <Link href="/tip-board" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/tip-icon.png" alt="팁게시판" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="leading-tight">팁게시판</span>
            </Link>
            <Link href="/guild-recruit" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/guild-icon.png" alt="길드모집" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="leading-tight">길드모집</span>
            </Link>
            <Link href="/war-records" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/war-icon.png" alt="거점/점령전" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="leading-tight">거점/점령전</span>
            </Link>
            <Link href="/guild-league" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/guild-league-icon.png" alt="길드리그" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="leading-tight">길드리그</span>
            </Link>
            <Link href="/solare-league" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/rank1.png" alt="솔라레의 창" className="w-6 h-6 object-contain" />
              <span className="leading-tight">솔라레의 창</span>
            </Link>
            <Link href="/master-class" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/masterclass-icon.png" alt="마스터클래스" className="w-6 h-6 object-contain" />
              <span className="leading-tight">마스터클래스</span>
            </Link>
            <Link href="/statistics" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <img src="/icons/tong-tip.png" alt="통계" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="leading-tight">통계</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 공지사항 모달 */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-gray-600/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/ponyang/ponyang-1.png" 
                    alt="포냥이" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-300">포냥이 업데이트 소식</h2>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-6">
              <div className="text-gray-300 leading-relaxed">
                {/* 제목 */}
                <div className="text-xl font-bold text-yellow-400 text-center mb-6">
                  📝 클래스 가이드 업데이트 예정
                </div>
                
                {/* 메인 내용 */}
                <div className="space-y-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <h3 className="font-semibold text-gray-200 mb-2">🎯 업데이트 계획</h3>
                    <p className="text-sm leading-relaxed">
                      각 클래스별로 고수분들께 인터뷰를 통해 PVP 가이드 최신화를 할 계획을 가지고 있습니다.
                    </p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-blue-400">
                    <p className="text-sm leading-relaxed">
                      최대한 빠른 시일 내에 인터뷰 후 업데이트를 진행하고 싶으나, 
                      개인적으로 연락 하여서 답변을 받아야 하기 때문에 시간이 다소 걸릴 수 있습니다.
                    </p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-green-400">
                    <p className="text-sm leading-relaxed">
                      혹시 클래스별 가이드를 작성 하고 싶으신 분들은 포냥이 디스코드로 티켓 생성해서 연락주시면 감사하겠습니다.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border-l-4 border-purple-400">
                    <h3 className="font-semibold text-purple-300 mb-2">🎨 디자인 도움 주실 분 찾습니다!</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      포냥이 사이트의 <strong>길드리그, 솔라레 배너</strong> 등 다양한 디자인 작업을 도와주실 분들을 찾고 있습니다. 
                      UI/UX 디자인이나 그래픽 작업에 관심이 있으시다면 디스코드로 연락주세요!
                    </p>
                  </div>
                </div>
                
                {/* 디스코드 링크 */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-6">
                  <a 
                    href="https://discord.com/invite/mD37c4GEby" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 font-medium mb-2 hover:text-blue-200 transition-colors block text-center"
                  >
                    💬 포냥이 디스코드 참여하기
                  </a>
                  <p className="text-sm text-center text-gray-400">
                    공지사항 및 업데이트 내역을 확인하실 수 있습니다
                  </p>
                </div>
                
                {/* 하단 메시지 */}
                <div className="pt-4 text-center">
                  <p className="text-lg font-semibold text-gray-200">🎮 함께 만들어가는 포냥이</p>
                  <p className="text-sm text-gray-400 mt-2">- BDOPVP-포냥이 개발자 디움 -</p>
                </div>
              </div>
            </div>

            {/* 모달 버튼들 */}
            <div className="flex gap-3 p-6 border-t border-slate-700/50">
              <button
                onClick={() => {
                  const today = new Date().toDateString();
                  localStorage.setItem('noticeDismissed', today);
                  setShowNoticeModal(false);
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                오늘 하루 보지 않기
              </button>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
