"use client";

import { useState, useEffect } from 'react';

interface HomeWithNoticeProps {
  children: React.ReactNode;
}

export default function HomeWithNotice({ children }: HomeWithNoticeProps) {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // 오늘 날짜 확인
    const today = new Date();
    const todayString = today.toDateString();
    const dismissedDate = localStorage.getItem('noticeDismissed_v2'); // v2로 변경하여 새 공지로 인식
    
    // 공지사항 표시 (오늘 하루 보지 않기를 선택하지 않았으면)
    if (dismissedDate !== todayString) {
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
                <h2 className="text-2xl font-bold text-gray-300">포냥이 업데이트 소식</h2>
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
                {/* 제목 */}
                <div className="text-xl font-bold text-yellow-400 text-center mb-6">
                  📝 클래스 가이드 작성자 모집
                </div>
                
                {/* 메인 내용 */}
                <div className="space-y-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <h3 className="font-semibold text-gray-200 mb-2">🎯 모집 안내</h3>
                    <p className="text-sm leading-relaxed">
                      현재 각 클래스별 고수분들께 연락해서 PvP 가이드를 부탁 드리고 있으나 쉽지 않은 상황 입니다..
                      그래서 혹시 클래스별 PvP 가이드 작성을 해주실 분들은 포냥이 디스코드 티켓을 열어서 문의 해주시면 감사하겠습니다!
                    </p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-blue-400">
                    <h3 className="font-semibold text-gray-200 mb-3">🎮 모집 클래스</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {/* 워리어 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/warrior.png" alt="워리어" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">워리어</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 발키리 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/valc.png" alt="발키리" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">발키리</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 하사신 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/hasasin.png" alt="하사신" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">하사신</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 세이지 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/saji.png" alt="세이지" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">세이지</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 레인저 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/ranger.png" alt="레인저" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">레인저</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 드라카니아 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/draca.png" alt="드라카니아" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">드라카니아</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 소서러 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/sor.png" alt="소서러" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">소서러</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 노바 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/nova.png" alt="노바" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">노바</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 란 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/lhan.png" alt="란" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">란</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 매구 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/magu.png" alt="매구" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">매구</span>
                        <span className="text-xs text-center text-gray-400">전승</span>
                      </div>
                      {/* 금수랑 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/gadi.png" alt="금수랑" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">금수랑</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 격투가 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/fighter.png" alt="격투가" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">격투가</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 무사 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/musa.png" alt="무사" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">무사</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 매화 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/mahwa.png" alt="매화" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">매화</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 쿠노이치 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/kuno.png" alt="쿠노이치" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">쿠노이치</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 닌자 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/ninja.png" alt="닌자" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">닌자</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 미스틱 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/mistic.png" alt="미스틱" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">미스틱</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 다크나이트 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/darknight.png" alt="다크나이트" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">다크나이트</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 위치 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/witch.png" alt="위치" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">위치</span>
                        <span className="text-xs text-center text-gray-400">전승</span>
                      </div>
                      {/* 위자드 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/wizard.png" alt="위자드" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">위자드</span>
                        <span className="text-xs text-center text-gray-400">전승</span>
                      </div>
                      {/* 우사 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/usa.png" alt="우사" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">우사</span>
                        <span className="text-xs text-center text-gray-400">각성</span>
                      </div>
                      {/* 도사 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/dosa.png" alt="도사" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">도사</span>
                        <span className="text-xs text-center text-gray-400">전승/각성</span>
                      </div>
                      {/* 오공 */}
                      <div className="flex flex-col items-center">
                        <img src="/class-icons/ukong.png" alt="오공" className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center text-gray-300">오공</span>
                        <span className="text-xs text-center text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-green-400">
                    <p className="text-sm leading-relaxed">
                      💬 <strong>문의 방법:</strong> 포냥이 디스코드에서 티켓을 생성하여 연락주시면 감사하겠습니다!
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border-l-4 border-purple-400">
                    <h3 className="font-semibold text-purple-300 mb-2">🎨 디자인 도움 주실 분 찾습니다!</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      포냥이 사이트의 <strong>길드리그, 솔라레 배너</strong> 등 다양한 디자인 작업을 도와주실 분들을 찾고 있습니다. 
                      UI/UX 디자인이나 그래픽 작업에 관심이 있으시다면 디스코드로 연락주세요!
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-4 border-l-4 border-amber-400">
                    <h3 className="font-semibold text-amber-300 mb-2">💰 구글 애드센스 광고 시작 안내</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      BDOPVP-포냥이 사이트의 <strong>서버 비용 충당</strong>을 위해 구글 애드센스 광고를 시작하게 되었습니다. 
                      사이트를 유지를 위해, 광고 수익을 서버 유지비에 사용할 예정입니다. 
                      애드블록 쓰셔도 컨텐츠는 정상적으로 표시 될 예정입니다. 양해 부탁드립니다! 🙏
                    </p>
                  </div>
                </div>
                
                {/* 디스코드 링크 */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-6">
                  <a 
                    href="https://discord.com/invite/mD37c4GEby" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 font-medium mb-2 hover:text-blue-200 transition-colors block text-center"
                  >
                    💬 포냥이 디스코드 참여하기
                  </a>
                  <p className="text-sm text-center text-gray-400">
                    공지사항 및 업데이트 내역을 확인하실 수 있습니다
                  </p>
                </div>
                
                {/* 하단 메시지 */}
                <div className="pt-4 text-center">
                  <p className="text-lg font-semibold text-gray-200">🎮 함께 만들어가는 포냥이</p>
                  <p className="text-sm text-gray-400 mt-2">- BDOPVP-포냥이 개발자 디움 -</p>
                </div>
              </div>
            </div>

            {/* 모달 버튼들 */}
            <div className="flex gap-3 p-6 border-t border-slate-700/50">
              <button
                onClick={() => {
                  const today = new Date().toDateString();
                  localStorage.setItem('noticeDismissed_v2', today);
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
