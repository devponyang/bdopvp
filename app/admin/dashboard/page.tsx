"use client"
import Link from 'next/link'

export default function AdminDashboard() {

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">관리자 대시보드</h1>
            <p className="text-gray-400 mt-1">사이트 관리 및 데이터 업데이트를 위한 패널입니다.</p>
          </div>
        </div>
      </div>

      {/* 관리 기능 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <Link href="/admin/tip-board" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">팁 게시판</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">게임 팁 및 정보를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/war-records" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚔️</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-red-400 transition-colors">전투 기록</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">거점전 및 점령전 기록을 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/guild-league" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-yellow-400 transition-colors">길드 리그</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">길드 리그 순위 및 시즌 관리</p>
          </div>
        </Link>

        <Link href="/admin/solare" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">솔라레의 창</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">솔라레 랭킹, 시즌, 전문화 관리</p>
          </div>
        </Link>

        <Link href="/admin/coupons" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-all hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎫</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-green-400 transition-colors">쿠폰 관리</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">게임 쿠폰 코드를 관리합니다.</p>
          </div>
        </Link>

        <Link href="/admin/banners" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-pink-400 transition-colors">배너 & 종군기자</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">배너 및 종군기자 스트리머 관리</p>
          </div>
        </Link>

        <Link href="/admin/alliances" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">동맹 & 길드마크</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">동맹 정보 및 후원 길드마크 관리</p>
          </div>
        </Link>

        <Link href="/admin/master-class" className="group">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <img 
                  src="/ponyang/masterclass.png" 
                  alt="마스터클래스" 
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="text-lg font-bold group-hover:text-amber-400 transition-colors">마스터클래스</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">2025 마스터클래스 대회 정보 관리</p>
          </div>
        </Link>
      </div>
    </div>
  )
} 