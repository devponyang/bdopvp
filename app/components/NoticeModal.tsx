"use client";

import { useState } from 'react';

interface NoticeModalProps {
  title: string;
  content: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function NoticeModal({ title, content, isVisible, onClose }: NoticeModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleDontShowToday = () => {
    const today = new Date().toDateString();
    localStorage.setItem('noticeDismissed', today);
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-200 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">📢</span>
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-4">
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {content.split('\n').map((line, index) => {
              // URL 패턴 감지
              const urlPattern = /(https?:\/\/[^\s]+)/g;
              const parts = line.split(urlPattern);
              
              return (
                <div key={index}>
                  {parts.map((part, partIndex) => {
                    if (urlPattern.test(part)) {
                      return (
                        <a
                          key={partIndex}
                          href={part}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all"
                        >
                          {part}
                        </a>
                      );
                    }
                    return part;
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={handleDontShowToday}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
