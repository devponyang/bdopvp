"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Traffic {
  today: number
  week: number
  month: number
  total: number
}

export default function AdminDashboard() {
  const [traffic, setTraffic] = useState<Traffic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/traffic')
      .then(res => res.json())
      .then(setTraffic)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h1 className="text-3xl font-bold mb-2 text-blue-200">관리자 대시보드</h1>
        <p className="text-gray-400">사이트 관리 및 데이터 업데이트를 위한 패널입니다.</p>
      </div>

      {/* 관리 기능 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/tip-board" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">팁 게시판</h3>
            </div>
            <p className="text-gray-400 text-sm">게임 팁 및 정보를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/war-records" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚔️</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">전투 기록</h3>
            </div>
            <p className="text-gray-400 text-sm">거점전 및 점령전 기록을 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/guild-league" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">길드 리그</h3>
            </div>
            <p className="text-gray-400 text-sm">길드 리그 순위 데이터를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/solare" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">솔라레의 창</h3>
            </div>
            <p className="text-gray-400 text-sm">솔라레의 창 랭킹 데이터를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/coupons" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎫</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">쿠폰 관리</h3>
            </div>
            <p className="text-gray-400 text-sm">게임 쿠폰 코드를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/banners" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">배너 관리</h3>
            </div>
            <p className="text-gray-400 text-sm">홈페이지 메인 배너를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/guild-marks" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏷️</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">길드마크 관리</h3>
            </div>
            <p className="text-gray-400 text-sm">후원자 길드마크를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/war-correspondents" className="group">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">📺</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">종군기자 관리</h3>
            </div>
            <p className="text-gray-400 text-sm">거점/점령전 옵저버 스트리머를 관리합니다.</p>
          </div>
        </Link>
      </div>

      {/* 트래픽 통계 */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-blue-300">📊 트래픽 통계</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            불러오는 중...
          </div>
        ) : traffic ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{traffic.today}</div>
              <div className="text-sm text-gray-400">오늘 방문자</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{traffic.week}</div>
              <div className="text-sm text-gray-400">이번 주 방문자</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{traffic.month}</div>
              <div className="text-sm text-gray-400">이번 달 방문자</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{traffic.total}</div>
              <div className="text-sm text-gray-400">전체 방문자</div>
            </div>
          </div>
        ) : (
          <div className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            ⚠️ 트래픽 정보를 불러올 수 없습니다.
          </div>
        )}
      </div>

      {/* 빠른 액션 */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-blue-300">⚡ 빠른 액션</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => window.open('/', '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            홈페이지 열기
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    </div>
  )
} 