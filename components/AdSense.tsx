'use client'

import { useEffect, useRef } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  style = { display: 'block' }
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadAd = () => {
      if (!adRef.current) return
      
      // 컨테이너 크기 확인
      const rect = adRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        // 컨테이너가 준비되지 않았으면 잠시 후 다시 시도
        setTimeout(loadAd, 100)
        return
      }

      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }

    // 페이지 로드 완료 후 광고 로드
    if (document.readyState === 'complete') {
      loadAd()
    } else {
      window.addEventListener('load', loadAd)
      return () => window.removeEventListener('load', loadAd)
    }
  }, [])

  return (
    <div ref={adRef} style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ ...style, maxWidth: '100%' }}
        data-ad-client="ca-pub-7268080263912053"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
