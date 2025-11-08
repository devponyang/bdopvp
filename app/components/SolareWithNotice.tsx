"use client";

import { useState, useEffect } from 'react';

interface SolareWithNoticeProps {
  children: React.ReactNode;
}

export default function SolareWithNotice({ children }: SolareWithNoticeProps) {
  const [showNotice, setShowNotice] = useState(false);

useEffect(() => {
  try {
    const todayString = new Date().toDateString();
    const dismissedDate = window.localStorage.getItem('solareNoticeDismissed');

    if (dismissedDate !== todayString) {
      setShowNotice(true);
    }
  } catch (error) {
    setShowNotice(true);
  }
}, []);

  const handleCloseNotice = () => {
    setShowNotice(false);
  };

  return (
    <>
      {children}
      {showNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-gray-600/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/ponyang/ponyang-1.png" 
                    alt="포냥이" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-300">솔라레의 창 공지</h2>
              </div>
              <button
                onClick={handleCloseNotice}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-6">
              <div className="text-gray-300 leading-relaxed">
                {/* 메인 내용 */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-4 border-l-4 border-amber-400">
                    <h3 className="font-semibold text-amber-300 mb-2 text-lg">⚠️ 클래스별 랭킹 업데이트 안내</h3>
                    <p className="text-sm leading-relaxed text-gray-200">
                      <strong>클래스별 20위 랭킹 작업</strong>이 1인 작업으로는 과도한 시간이 소요되어, 당분간 업데이트를 진행하지 못하게 되었습니다.<br />
                      <strong>솔라레의 창 in 100 랭킹은 정상적으로 계속 업데이트됩니다.</strong><br />
                    </p>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm leading-relaxed text-gray-300">
                      🙏 기다려주신 분들께 진심으로 죄송합니다.<br />
                      <strong>솔라레의 창 in 100</strong> 랭킹은 정상적으로 계속 업데이트됩니다.<br />
                      그 외 다른 데이터와 기능도 예정대로 유지하겠습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 모달 버튼들 */}
            <div className="flex gap-3 p-6 border-t border-slate-700/50">
              <button
                onClick={() => {
                  const today = new Date().toDateString();
                  localStorage.setItem('solareNoticeDismissed', today);
                  handleCloseNotice();
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                오늘 하루 보지 않기
              </button>
              <button
                onClick={handleCloseNotice}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
