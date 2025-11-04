import React from "react";
import Image from "next/image";

export default function SiteInfoPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-zinc-800 dark:text-white">
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image
              src="/ponyang/ponyang-2.png"
              alt="포냥이"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">BDOPVP-포냥이 소개</h1>
            <p className="text-gray-400 text-sm">검은사막을 사랑하는 모든 모험가를 위한 비공식 팬사이트</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">🎯</span>
              사이트 목적
            </h2>
            <p className="text-gray-300 leading-relaxed">
              <b className="text-white">BDOPVP-포냥이</b>는 검은사막을 사랑하는 모험가분들이 더 쉽고, 더 재미있게 게임을 즐기실 수 있도록 만든 팬메이드 사이트입니다.
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">👤</span>
              개발자
            </h2>
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Image
                    src="/ponyang/ponyang-7.png"
                    alt="포냥이"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <span className="font-semibold text-blue-300 text-lg">개발 및 운영</span>
                  <div className="font-bold text-white text-xl">디움</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Email : ponyang.dev@gmail.com
              </p>
              <p className="text-gray-300 leading-relaxed">
                DISCORD : __dejavu__
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/30 mt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Image
                    src="/ponyang/ponyang-4.png"
                    alt="포냥이"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <span className="font-semibold text-pink-300 text-lg">디자인 도움</span>
                  <div className="font-bold text-white text-xl">교역</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                포냥이 디자인을 제공해주신 분입니다. 귀여운 포냥이 덕분에 사이트가 더욱 특별해졌습니다.
              </p>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⚡</span>
              주요 기능
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400">🏆</span>
                  <span className="text-gray-300">길드 리그 랭킹</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">⚔️</span>
                  <span className="text-gray-300">솔라레 리그 랭킹</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-400">🗡️</span>
                  <span className="text-gray-300">전투 기록 (거점전/점령전)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">🎫</span>
                  <span className="text-gray-300">쿠폰 정보</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400">💡</span>
                  <span className="text-gray-300">팁 게시판 및 클래스 가이드</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400">📊</span>
                  <span className="text-gray-300">통계 정보</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-400">🔍</span>
                  <span className="text-gray-300">길드/연맹 검색</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400">📅</span>
                  <span className="text-gray-300">전투 일정</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-emerald-400">🚀</span>
              지속적인 발전
            </h2>
            <p className="text-gray-300 leading-relaxed">
              혼자서 개발·운영하고 있으며, 누구나 편하게 다양한 정보를 한 곳에서 확인할 수 있도록 최선을 다하고 있습니다.<br /><br />
              <b className="text-white">어제보다 오늘의 BDOPVP-포냥이가 더 도움이 되었다고 느끼실 수 있도록</b> 항상 발전하는 사이트가 되겠습니다.
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-400">💝</span>
              후원 및 문의
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                사이트 운영에 도움을 주신 후원금은 사이트 운영비로 사용됩니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="/support" 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  💝 후원하기
                </a>
                <a 
                  href="https://discord.gg/mD37c4GEby" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  💬 디스코드 문의
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm rounded-2xl border border-yellow-600/30 p-6 mt-6 shadow-xl">
        <h3 className="font-bold text-yellow-300 mb-4 flex items-center gap-2">
          <span className="text-yellow-400">📢</span>
          중요 공지
        </h3>
        <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-600/30">
          <p className="text-sm text-yellow-200 leading-relaxed">
            <strong className="text-yellow-100">본 콘텐츠는 펄어비스의 공식 자료가 아니며, 본 콘텐츠에는 펄어비스가 권리를 보유하고 있는 상표 또는 저작물이 포함되어 있습니다.</strong><br /><br />
          이 사이트는 검은사막 온라인을 사랑하는 팬이 제작한 비공식 팬메이드 사이트로, 펄어비스나 검은사막 공식 운영팀과는 무관합니다.
        </p>
        </div>
      </div>
    </div>
  );
} 