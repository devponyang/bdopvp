// 페이지 추적을 위한 커스텀 훅
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export const usePageTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    // 개발 모드에서는 추적하지 않음
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // 페이지 변경 시 Google Analytics에 페이지뷰 전송
    const url = window.location.href;
    const title = document.title;
    
    // 약간의 지연을 두어 페이지가 완전히 로드된 후 추적
    const timeoutId = setTimeout(() => {
      trackPageView(url, title);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
};

