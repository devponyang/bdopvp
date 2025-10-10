'use client'

import AdSense from './AdSense'

interface SidebarAdProps {
  position: 'left' | 'right'
}

export default function SidebarAd({ position }: SidebarAdProps) {
  return (
    <div 
      className={`hidden 2xl:block fixed top-24 ${position === 'left' ? 'left-4' : 'right-4'} w-[160px]`}
    >
      <div className="sticky top-24">
        <AdSense 
          adSlot="2507510429"
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

