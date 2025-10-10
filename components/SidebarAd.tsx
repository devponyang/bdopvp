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
      className={`hidden 2xl:block fixed top-40 ${position === 'left' ? 'left-4' : 'right-4'} w-[160px]`}
    >
      <div className="sticky top-40">
        <AdSense 
          adSlot={adSlot}
          style={{ 
            display: 'block',
            width: '160px',
            height: '600px'
          }}
        />
      </div>
    </div>
  )
}

