'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import WarCorrespondents from '@/components/war-records/WarCorrespondents'

const navItems = [
  { href: '/war-records/summary', label: '전체 순위' },
  { href: '/war-records/history', label: '거점 기록' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* 모바일용 가로 배치 */}
      <aside className="md:hidden bg-slate-800/30 rounded-lg p-3">
        <div className="flex gap-2">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 px-3 py-2 rounded text-sm transition-all text-center',
                pathname === href 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </aside>
      
      {/* 데스크톱용 세로 배치 */}
      <aside className="hidden md:block p-4 w-80 space-y-4">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-600/30">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">⚔️</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">거점전</h2>
              <p className="text-xs text-gray-400">전투 기록 및 순위</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === href 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-300 hover:bg-slate-700/60 hover:text-white hover:translate-x-1'
                )}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  pathname === href 
                    ? 'bg-white' 
                    : 'bg-gray-500 group-hover:bg-blue-400'
                )} />
                {label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* 종군기자 섹션 */}
        <WarCorrespondents />
      </aside>
    </>
  )
}
