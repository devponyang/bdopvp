'use client'

import AdSense from './AdSense'

interface SidebarAdProps {
  position: 'left' | 'right'
}

export default function SidebarAd({ position }: SidebarAdProps) {
  // 좌우 사이드바에 다른 광고 슬롯 사용
  const adSlot = position === 'left' ? '8498203708' : '2507510429'
  
  return (
    <div 
      className={`sidebar-ad-container fixed top-40 ${position === 'left' ? 'left-4' : 'right-4'} z-10`}
    >
      <div className="sticky top-40">
        <AdSense 
          adSlot={adSlot}
          style={{ 
            display: 'block',
            width: '100%',
            maxWidth: '160px',
            height: '600px',
            overflow: 'hidden'
          }}
        />
      </div>
    </div>
  )
}
