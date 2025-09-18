'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import Tooltip from '../app/components/Tooltip' // 더 이상 사용하지 않음
import ThemeToggle from '../app/components/ThemeToggle'

type SearchResult = {
  type: 'guild' | 'family'
  name: string
}

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const router = useRouter()

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

      if (exact) {
        router.push(`/${exact.type}/${encodeURIComponent(exact.name)}`)
      } else if (data.length === 1) {
        const result = data[0]
        router.push(`/${result.type}/${encodeURIComponent(result.name)}`)
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      }
    } catch (err) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 shadow-xl border-b border-zinc-700">
      <div className="flex items-center justify-between max-w-full md:max-w-7xl mx-auto px-4 md:px-8 py-4">
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
            포냥이
          </span>
        </a>

        {/* 검색창 - 데스크톱에서만 표시 */}
        <div className="relative flex-grow mx-2 md:mx-12 max-w-2xl hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="길드명을 입력하세요..."
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

        {/* 모바일 검색 아이콘 */}
        <div className="md:hidden block">
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-600 text-yellow-400 hover:text-yellow-300 hover:bg-zinc-700/50 transition-all duration-200"
          >
            🔍
          </button>
        </div>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-2 md:gap-4 text-white text-lg md:text-xl shrink-0">
          <ThemeToggle />
        </div>
      </div>

      {/* 모바일 검색창 - 메뉴바 위에 표시 */}
      {showMobileSearch && (
        <div className="md:hidden px-4 py-3 bg-zinc-800/95 border-t border-zinc-600">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="길드명을 입력하세요..."
                className="w-full px-4 py-3 rounded-xl bg-white/95 dark:bg-zinc-700/80 border-2 border-zinc-400 dark:border-zinc-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm backdrop-blur-sm transition-all duration-200 shadow-lg"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm"
                >
                  검색
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 메뉴바 */}
      <div className="bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-t border-zinc-600 shadow-lg">
        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex justify-between max-w-6xl mx-auto px-6 py-3 text-base font-semibold text-white">
          <Link href="/" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span>홈</span>
          </Link>
          <Link href="/tip-board" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <span className="text-lg">📝</span>
            <span>팁게시판</span>
          </Link>
          <Link href="/war-records" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <span className="text-lg">⚔️</span>
            <span>거점/점령전</span>
          </Link>
          <Link href="/guild-league" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span>길드 리그</span>
          </Link>
          <Link href="/solare-league" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <span className="text-lg">🌟</span>
            <span>솔라레의 창</span>
          </Link>
          <Link href="/statistics" className="px-4 py-2 rounded-lg hover:text-yellow-400 hover:bg-zinc-600/50 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span>통계</span>
          </Link>
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden">
          <div className="grid grid-cols-3 gap-1 px-2 py-2 text-xs font-semibold text-white">
            <Link href="/" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <span className="text-base">🏠</span>
              <span className="leading-tight">홈</span>
            </Link>
            <Link href="/tip-board" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <span className="text-base">📝</span>
              <span className="leading-tight">팁게시판</span>
            </Link>
            <Link href="/war-records" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <span className="text-base">⚔️</span>
              <span className="leading-tight">거점/점령전</span>
            </Link>
            <Link href="/guild-league" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <span className="text-base">🏆</span>
              <span className="leading-tight">길드리그</span>
            </Link>
            <Link href="/solare-league" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <span className="text-base">🌟</span>
              <span className="leading-tight">솔라레의 창</span>
            </Link>
            <Link href="/statistics" className="px-1 py-2 text-center rounded-lg hover:bg-zinc-600/50 hover:text-yellow-400 transition-all duration-200 flex flex-col items-center gap-0.5 min-h-0">
              <span className="text-base">📊</span>
              <span className="leading-tight">통계</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
