'use client'

import Link from 'next/link'

export default function AwakenedCorsairGuide() {
  return (
    <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
      {/* 뒤로가기 버튼 */}

      {/* 헤더 */}
      <div className="guide-cover">
        {/* 배경 이미지 레이어 (50% 불투명도) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/ponyang/tip-bg.png)',
            backgroundPosition: 'center 40%',
            opacity: 0.5,
            zIndex: 0,
          }}
        />
        {/* 텍스트 레이어 (100% 불투명도) */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="/class-icons/cosair.png"
              alt="각성 커세어"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              각성 커세어 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">"바다의 폭풍을 다루는 해적의 왕"</p>
        </div>
      </div>

      {/* 작성자 정보 */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-8 shadow-xl border border-slate-600">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✍️</span>
          <div>
            <p className="text-white text-lg">
              <strong>작성자:</strong>{' '}
              <Link
                href="/guild/페페"
                className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors"
              >
                페페
              </Link>{' '}
              길드 <span className="text-blue-400 font-bold">빠야</span> 님
            </p>
            <p className="text-gray-400 text-sm mt-1">끾끾끾끾끾끾끾끾끾</p>
          </div>
        </div>
      </div>

      {/* 업데이트 예정 안내 */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-8 border border-blue-400/30 shadow-lg">
          <div className="text-center">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-3xl font-bold text-white mb-4">업데이트 예정</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              각성 커세어 클래스 가이드는 현재 작성 중입니다.
            </p>
            <p className="text-gray-400 text-base mb-6">
              곧 상세한 가이드를 만나보실 수 있습니다. 조금만 기다려주세요! 🙏
            </p>
          </div>
        </div>
      </div>

      {/* 게시글 통계 */}
      <div className="data-notice section-gap">보관본에서는 조회수와 추천을 집계하지 않습니다.</div>

      {/* 하단 네비게이션 */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/tip-board"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-blue-500/30 hover:border-blue-400/50"
        >
          📝 다른 팁 보기
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-3 bg-gradient-to-r from-zinc-700 via-zinc-800 to-gray-800 hover:from-zinc-600 hover:via-zinc-700 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-zinc-600/30 hover:border-zinc-500/50"
        >
          ⬆️ 맨 위로
        </button>
      </div>
    </div>
  )
}
