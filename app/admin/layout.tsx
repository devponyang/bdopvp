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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <nav className="bg-gradient-to-br from-zinc-900/95 to-slate-900/95 backdrop-blur-sm border-b border-white/10 shadow-xl sticky top-0 z-50">
        <div className="max-w-[1490px] mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-xl">⚙️</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  관리자 패널
                </span>
              </Link>
              <div className="hidden lg:flex space-x-1">
                <Link 
                  href="/admin/dashboard" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname === '/admin/dashboard' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  🏠 대시보드
                </Link>
                <Link 
                  href="/admin/tip-board" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname.startsWith('/admin/tip-board')
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  💡 팁
                </Link>
                <Link 
                  href="/admin/war-records" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname === '/admin/war-records' 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  ⚔️ 전투기록
                </Link>
                <Link 
                  href="/admin/guild-league" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname.startsWith('/admin/guild-league')
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 shadow-lg shadow-yellow-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  🏆 길드리그
                </Link>
                <Link 
                  href="/admin/solare" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname.startsWith('/admin/solare')
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  ⚡ 솔라레
                </Link>
                <Link 
                  href="/admin/alliances" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname === '/admin/alliances' || pathname === '/admin/guild-marks'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  🤝 동맹
                </Link>
                <Link 
                  href="/admin/banners" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname.startsWith('/admin/banners') || pathname === '/admin/war-correspondents'
                      ? 'bg-gradient-to-r from-pink-600 to-pink-700 shadow-lg shadow-pink-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  🎨 배너
                </Link>
                <Link 
                  href="/admin/coupons" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname === '/admin/coupons' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 shadow-lg shadow-green-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  🎫 쿠폰
                </Link>
                <Link 
                  href="/admin/master-class" 
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    pathname === '/admin/master-class' 
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg shadow-orange-500/30' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  🎯 마스터
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg transition-all"
              >
                🚪 로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-[1490px] mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
} 