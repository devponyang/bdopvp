'use client'

import AdSense from './AdSense'

export default function FooterAd() {
  return (
    <div className="w-full border-t border-zinc-800 bg-zinc-900/50 py-2">
      <div className="max-w-[1490px] mx-auto px-3 md:px-6">
        <div className="max-h-[100px] overflow-hidden">
          <AdSense 
            adSlot="2507510429"
            adFormat="horizontal"
            fullWidthResponsive={true}
            style={{
              display: 'block',
              maxHeight: '100px'
            }}
          />
        </div>
      </div>
    </div>
  )
}

