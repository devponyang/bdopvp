"use client";

import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setTheme(initialTheme);
    
    // 초기 테마 적용
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove('light', 'dark');
    root.classList.add(initialTheme);
    
    body.classList.remove('light', 'dark');
    body.classList.add(initialTheme);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // DOM 업데이트 - html과 body 모두 적용
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    
    body.classList.remove('light', 'dark');
    body.classList.add(newTheme);
    
    // localStorage 저장
    localStorage.setItem('theme', newTheme);
    
    // 툴팁 상태 유지 및 자동 숨김
    setShowTooltip(true);
    hideTooltipAfterDelay();
  };

  const handleMouseEnter = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const hideTooltipAfterDelay = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
    const timeout = setTimeout(() => {
      setShowTooltip(false);
    }, 2000); // 2초 후 자동 숨김
    setTooltipTimeout(timeout);
  };

  // 마운트 전에는 기본 버튼 표시
  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800">
        <svg
          className="w-6 h-6 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
        aria-label={theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
      >
        {theme === 'dark' ? (
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>
      {showTooltip && (
        <div className="absolute z-[9999] px-3 py-2 text-sm text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-lg whitespace-nowrap top-full left-1/2 transform -translate-x-1/2 mt-2 border border-gray-300 dark:border-gray-600">
          {theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-white dark:border-b-gray-800 w-0 h-0 border-4"></div>
        </div>
      )}
    </div>
  );
}
