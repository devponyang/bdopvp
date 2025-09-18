// Google Analytics 유틸리티 함수들

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics 페이지뷰 추적
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-GK1BTTBNEF', {
      page_location: url,
      page_title: title,
    });
  }
};

// 커스텀 이벤트 추적
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 길드 검색 이벤트 추적
export const trackGuildSearch = (guildName: string) => {
  trackEvent('guild_search', 'search', guildName);
};

// 길드 페이지 방문 추적
export const trackGuildPageView = (guildName: string) => {
  const url = `${window.location.origin}/guild/${encodeURIComponent(guildName)}`;
  trackPageView(url, `${guildName} - 길드 정보`);
  trackEvent('guild_page_view', 'guild', guildName);
};

