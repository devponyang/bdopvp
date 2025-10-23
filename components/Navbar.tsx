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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showMobileMenu) {
        setShowMobileMenu(false)
      }
    }

    if (showMobileMenu) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [showMobileMenu])

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

        {/* 모바일 검색 아이콘과 햄버거 메뉴 */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-600 text-yellow-400 hover:text-yellow-300 hover:bg-zinc-700/50 transition-all duration-200"
          >
            🔍
          </button>
          <button
            onClick={() => {
              console.log('햄버거 메뉴 클릭됨, 현재 상태:', showMobileMenu)
              setShowMobileMenu(!showMobileMenu)
            }}
            className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-600 hover:bg-zinc-700/50 transition-all duration-200"
            aria-label="메뉴 열기/닫기"
          >
            <div className="flex flex-col justify-center items-center w-6 h-6 space-y-1">
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  showMobileMenu ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  showMobileMenu ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
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

        {/* 모바일 햄버거 메뉴 */}
        {showMobileMenu && (
          <div className="mobile-menu-container md:hidden bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-t border-zinc-600 shadow-lg">
            <div className="px-3 py-2">
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/home-icon.png" alt="홈" className="w-4 h-4 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-medium">홈</span>
                </Link>
                <Link 
                  href="/tip-board" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/tip-icon.png" alt="팁게시판" className="w-4 h-4 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-medium">팁게시판</span>
                </Link>
                <Link 
                  href="/guild-recruit" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/guild-icon.png" alt="길드모집" className="w-4 h-4 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-medium">길드모집</span>
                </Link>
                <Link 
                  href="/war-records" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/war-icon.png" alt="거점/점령전" className="w-4 h-4 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-medium">거점/점령전</span>
                </Link>
                <Link 
                  href="/guild-league" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/guild-league-icon.png" alt="길드리그" className="w-4 h-4 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-medium">길드리그</span>
                </Link>
                <Link 
                  href="/solare-league" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/rank1.png" alt="솔라레의 창" className="w-4 h-4 object-contain" />
                  <span className="text-sm font-medium">솔라레의 창</span>
                </Link>
                <Link 
                  href="/master-class" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/masterclass-icon.png" alt="마스터클래스" className="w-4 h-4 object-contain" />
                  <span className="text-sm font-medium">마스터클래스</span>
                </Link>
                <Link 
                  href="/statistics" 
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-zinc-600 hover:border-yellow-400 hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img src="/icons/tong-tip.png" alt="통계" className="w-4 h-4 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-medium">통계</span>
                </Link>
              </div>
            </div>
          </div>
        )}
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
                  📝 클래스 가이드 작성자 모집
                </div>
                
                {/* 메인 내용 */}
                <div className="space-y-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <h3 className="font-semibold text-gray-200 mb-2">🎯 모집 안내</h3>
                    <p className="text-sm leading-relaxed">
                      현재 각 클래스별 고수분들께 연락해서 PvP 가이드를 부탁 드리고 있으나 쉽지 않은 상황 입니다..
                      그래서 혹시 클래스별 PvP 가이드 작성을 해주실 분들은 포냥이 디스코드 티켓을 열어서 문의 해주시면 감사하겠습니다!
                    </p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-blue-400">
                    <h3 className="font-semibold text-gray-200 mb-3">🎮 모집 클래스</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {/* 워리어 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/warrior.png" alt="워리어" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">워리어</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 발키리 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/valc.png" alt="발키리" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">발키리</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 하사신 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/hasasin.png" alt="하사신" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">하사신</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 세이지 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/saji.png" alt="세이지" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">세이지</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 레인저 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/ranger.png" alt="레인저" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">레인저</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 드라카니아 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/draca.png" alt="드라카니아" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">드라카니아</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 소서러 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/sor.png" alt="소서러" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">소서러</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 노바 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/nova.png" alt="노바" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">노바</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 란 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/lhan.png" alt="란" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">란</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 매구 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/magu.png" alt="매구" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">매구</span>
                        <span className="text-xs text-center text-gray-400">전승</span>
                      </div>
                      {/* 금수랑 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/gadi.png" alt="금수랑" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">금수랑</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 격투가 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/fighter.png" alt="격투가" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">격투가</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 무사 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/musa.png" alt="무사" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">무사</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 매화 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/mahwa.png" alt="매화" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">매화</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 쿠노이치 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/kuno.png" alt="쿠노이치" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">쿠노이치</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 닌자 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/ninja.png" alt="닌자" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">닌자</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 미스틱 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/mistic.png" alt="미스틱" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">미스틱</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 다크나이트 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/darknight.png" alt="다크나이트" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">다크나이트</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 위치 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/witch.png" alt="위치" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">위치</span>
                        <span className="text-xs text-center text-gray-400">전승</span>
                      </div>
                      {/* 위자드 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/wizard.png" alt="위자드" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">위자드</span>
                        <span className="text-xs text-center text-gray-400">전승</span>
                      </div>
                      {/* 우사 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/usa.png" alt="우사" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">우사</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 도사 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/dosa.png" alt="도사" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">도사</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 오공 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/ukong.png" alt="오공" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">오공</span>
                        <span className="text-xs text-center text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-green-400">
                    <p className="text-sm leading-relaxed">
                      💬 <strong>문의 방법:</strong> 포냥이 디스코드에서 티켓을 생성하여 연락주시면 감사하겠습니다!
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border-l-4 border-purple-400">
                    <h3 className="font-semibold text-purple-300 mb-2">🎨 디자인 도움 주실 분 찾습니다!</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      포냥이 사이트의 <strong>길드리그, 솔라레 배너</strong> 등 다양한 디자인 작업을 도와주실 분들을 찾고 있습니다. 
                      UI/UX 디자인이나 그래픽 작업에 관심이 있으시다면 디스코드로 연락주세요!
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-4 border-l-4 border-amber-400">
                    <h3 className="font-semibold text-amber-300 mb-2">💰 구글 애드센스 광고 시작 안내</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      BDOPVP-포냥이 사이트의 <strong>서버 비용 충당</strong>을 위해 구글 애드센스 광고를 시작하게 되었습니다. 
                      사이트를 유지를 위해, 광고 수익을 서버 유지비에 사용할 예정입니다. 
                      애드블록 쓰셔도 컨텐츠는 정상적으로 표시 될 예정입니다. 양해 부탁드립니다! 🙏
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
                  localStorage.setItem('noticeDismissed_v2', today);
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
