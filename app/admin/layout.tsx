'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 쿠키에서 인증 상태 확인
    const isAdmin = document.cookie.includes('isAdmin=true')
    setIsAuthenticated(isAdmin)
    setLoading(false)

    // 로그인 페이지가 아닌데 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAdmin && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [pathname, router])

  const handleLogout = () => {
    document.cookie = 'isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  // 로그인 페이지는 레이아웃 없이 렌더링
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-zinc-900 border-b border-zinc-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/admin/dashboard" className="text-xl font-bold text-blue-400">
              관리자 패널
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/admin/dashboard" 
                className={`px-3 py-2 rounded ${pathname === '/admin/dashboard' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                대시보드
              </Link>
              <Link 
                href="/admin/tip-board" 
                className={`px-3 py-2 rounded ${pathname === '/admin/tip-board' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                팁 게시판
              </Link>
              <Link 
                href="/admin/war-records" 
                className={`px-3 py-2 rounded ${pathname === '/admin/war-records' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                전투 기록
              </Link>
              <Link 
                href="/admin/guild-league" 
                className={`px-3 py-2 rounded ${pathname === '/admin/guild-league' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                길드 리그
              </Link>
              <Link 
                href="/admin/guild-league/seasons" 
                className={`px-3 py-2 rounded ${pathname === '/admin/guild-league/seasons' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                길드리그 시즌
              </Link>
              <Link 
                href="/admin/solare" 
                className={`px-3 py-2 rounded ${pathname === '/admin/solare' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                솔라레
              </Link>
              <Link 
                href="/admin/solare/seasons" 
                className={`px-3 py-2 rounded ${pathname === '/admin/solare/seasons' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                시즌 관리
              </Link>
              <Link 
                href="/admin/solare/specializations" 
                className={`px-3 py-2 rounded ${pathname === '/admin/solare/specializations' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                특화 관리
              </Link>
              <Link 
                href="/admin/master-class" 
                className={`px-3 py-2 rounded ${pathname === '/admin/master-class' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                마스터 클래스
              </Link>
              <Link 
                href="/admin/alliances" 
                className={`px-3 py-2 rounded ${pathname === '/admin/alliances' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}
              >
                연맹마크 관리
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="px-3 py-2 rounded hover:bg-zinc-800"
            >
              홈으로
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-2 rounded bg-red-600 hover:bg-red-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  )
} 