'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import WarCorrespondents from '@/components/war-records/WarCorrespondents'

const navItems = [
  { href: '/war-records/summary', label: '전체 순위' },
  { href: '/war-records/history', label: '전투 기록 보기' },
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
        <div className="space-y-3">
          <h2 className="text-base font-semibold mb-4 text-white">
            📋 거점전
          </h2>
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'block px-4 py-3 rounded text-sm transition-all',
                pathname === href 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        
        {/* 종군기자 섹션 */}
        <WarCorrespondents />
      </aside>
    </>
  )
}
