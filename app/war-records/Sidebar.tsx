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
      {/* 모바일 가로 탭 */}
      <aside className="md:hidden">
        <div className="flex rounded-lg overflow-hidden border border-zinc-800/50" style={{ background: 'oklch(0.1 0.015 270)' }}>
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-medium text-center transition-colors',
                pathname === href
                  ? 'bg-[oklch(0.85_0.18_200)] text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </aside>

      {/* 데스크톱 세로 사이드바 */}
      <aside className="hidden md:block w-52 shrink-0 space-y-3">
        <div
          className="rounded-xl overflow-hidden border border-zinc-800/50"
          style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.06]"
            style={{ background: 'oklch(0.12 0.02 270)' }}
          >
            <span className="text-sm">⚔️</span>
            <h2 className="text-sm font-bold text-white">거점/점령전</h2>
          </div>
          <div className="p-2 space-y-0.5">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                  pathname === href
                    ? 'text-[oklch(0.85_0.18_200)] bg-[oklch(0.85_0.18_200/0.08)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                )}
              >
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full shrink-0',
                  pathname === href ? 'bg-[oklch(0.85_0.18_200)]' : 'bg-zinc-700'
                )} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <WarCorrespondents />
      </aside>
    </>
  )
}
