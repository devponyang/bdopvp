'use client'

import AdSense from './AdSense'

export default function FooterAd() {
  return (
    <div className="w-full border-t border-zinc-800 bg-zinc-900/50 py-4">
      <div className="max-w-[1490px] mx-auto px-3 md:px-6">
        <AdSense 
          adSlot="2507510429"
          adFormat="auto"
          fullWidthResponsive={true}
        />
      </div>
    </div>
  )
}

