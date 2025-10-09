// app/war-records/layout.tsx
import { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function WarRecordsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-screen-xl mx-auto p-4 mt-6">
      {/* 메인 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-8">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/ponyang/war-bg.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 55%"
          }}
        ></div>
        
        {/* 콘텐츠 */}
        <div className="relative p-3 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center gap-6">
            {/* 왼쪽: 아이콘과 제목 */}
            <div className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-orange-400/30 rounded-xl blur-sm"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-3xl">⚔️</div>
                </div>
              </div>
              
              {/* 제목 블록 */}
              <div className="px-4 py-3">
                <h1 className="text-4xl font-bold text-white">
                  거점/점령전
                </h1>
                <div className="text-lg text-white font-medium">
                  전투 기록 및 순위
                </div>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden flex flex-col items-center text-center">
            <div>
              <h1 className="text-xl font-bold text-white">
                거점/점령전
              </h1>
              <div className="text-xs text-white font-medium">
                전투 기록 및 순위
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일에서 상단에 표시 */}
      <div className="md:hidden mb-4">
        <Sidebar />
      </div>
      
      {/* 데스크톱과 모바일 레이아웃 */}
      <div className="flex gap-4">
        {/* 데스크톱에서만 사이드바 표시 */}
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
