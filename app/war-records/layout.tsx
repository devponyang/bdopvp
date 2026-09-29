// app/war-records/layout.tsx
import { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function WarRecordsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1490px] mx-auto px-4 pt-6 pb-12">
      {/* 배너 헤더 */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800/50 mb-6" style={{ background: 'oklch(0.1 0.015 270)' }}>
        <div
          className="absolute inset-0 bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/ponyang/war-bg.png')",
            backgroundSize: '100% auto',
            backgroundPosition: 'center 55%',
          }}
        />
        <div className="relative flex items-center gap-4 px-5 py-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'oklch(0.12 0.02 270)', border: '1px solid oklch(0.85 0.18 200 / 0.3)' }}
          >
            <img
              src="/icons/war-icon.png"
              alt="거점/점령전"
              className="w-5 h-5 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">거점/점령전</h1>
            <p className="text-xs text-zinc-500">전투 기록 및 순위</p>
          </div>
        </div>
      </div>

      {/* 모바일 탭 */}
      <div className="md:hidden mb-4">
        <Sidebar />
      </div>

      <div className="flex gap-5">
        {/* 데스크톱 사이드바 */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
