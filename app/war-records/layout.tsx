// app/war-records/layout.tsx
import { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function WarRecordsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
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
