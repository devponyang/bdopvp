import React from "react";
import Image from "next/image";

export default function SupportPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">후원 및 광고 안내</h1>
            <p className="text-gray-400 text-sm">BDOPVP-포냥이를 함께 만들어가요</p>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🎯</span>
            사이트 소개
          </h2>
          <p className="text-gray-300 leading-relaxed">
            <b className="text-white">BDOPVP-포냥이</b>는 검은사막 모험가분들이 더 쉽고, 더 재미있게 게임을 즐기실 수 있도록 만든 비공식 개인 사이트입니다.<br /><br />
            사이트의 모든 서비스는 무료로 제공되며, 광고 및 후원은 사이트 운영비(서버비, 도메인, 개발 등)로만 사용됩니다.<br /><br />
            광고 게재, 후원, 제휴, 기타 문의는 아래 안내를 참고해 주세요.
          </p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-400">📢</span>
            광고 안내
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <span className="text-blue-400">🔸</span>
                자동 광고 (Google AdSense)
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>사이트 운영을 위해 Google AdSense를 통한 자동 광고를 표시합니다.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>사용자의 관심사에 맞는 맞춤형 광고가 표시될 수 있습니다.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>광고 차단 도구 사용 시 일부 기능에 제한이 있을 수 있습니다.</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <h3 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <span className="text-purple-400">🔸</span>
                직접 광고 문의
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>배너 광고, 제휴, 이벤트 등 다양한 형태의 광고 문의를 환영합니다.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>광고 단가, 위치, 기간 등은 협의 후 결정됩니다.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>광고는 검은사막 및 게이머 커뮤니티에 적합한 내용만 게재 가능합니다.</span>
                </div>
                <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <p className="text-xs text-yellow-200">
                    ⚠️ <strong>주의:</strong> 부적절한 광고(불법, 사행성, 선정성 등)는 사전 통보 없이 거절될 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">📐</span>
            배너 광고 사이즈 가이드라인
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <span className="text-cyan-400">🖼️</span>
                메인 배너 (홈페이지 상단)
              </h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>최적 비율:</strong> 16:9 또는 3:1</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>권장 해상도:</strong> 1200x400px ~ 1920x640px</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>최소 크기:</strong> 800x267px</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>파일 형식:</strong> JPG, PNG, WebP</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>파일 크기:</strong> 5MB 이하</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <span className="text-cyan-400">📱</span>
                기타 배너
              </h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>사이드바:</strong> 300x250px (4:3 비율)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>카드형:</strong> 400x200px (2:1 비율)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span><strong>문의 시 협의:</strong> 맞춤형 사이즈 가능</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-cyan-900/20 border border-cyan-600/30 rounded-lg">
            <p className="text-sm text-cyan-200 flex items-center gap-2">
              <span className="text-cyan-400">💡</span>
              <strong>배너 제작 팁:</strong> 가로가 긴 이미지가 가장 적합하며, 세로가 긴 이미지는 잘릴 수 있습니다.
            </p>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-purple-400">💝</span>
            후원 안내
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            BDOPVP-포냥이는 <b className="text-white">완전 무료</b>로 운영되는 사이트입니다. 후원은 전혀 강제하지 않으며, 
            사이트를 이용하시는 모든 분들께 동일한 서비스를 제공합니다.<br /><br />
            사이트 발전과 안정적인 운영을 위해 후원을 받고 있으며, 후원금은 사이트 운영비(서버, 도메인, 개발 등)로만 사용됩니다.
          </p>

          {/* 후원 계좌 정보 */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 text-center shadow-lg mb-6">
            <div className="text-sm text-purple-300 mb-2 flex items-center justify-center gap-2">
              <span className="text-purple-400">💳</span>
              후원 계좌
            </div>
            <div className="text-2xl font-bold tracking-widest text-white mb-2">새마을금고 9003-2947-5099-1</div>
            <div className="text-sm text-purple-200 mb-4">예금주: 김정수</div>
            <div className="bg-purple-800/30 border border-purple-400/30 rounded-lg p-3">
              <p className="text-xs text-purple-200">
                💡 <strong>중요:</strong> 길드마크/연맹마크 혜택을 위해 입금자명을 <b className="text-purple-100">길드명 또는 연맹명</b>으로 입력해주세요!
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-200">
              <strong>※ 입금 시 입금자명은 반드시 <span className="text-yellow-100">길드명 또는 연맹명</span>으로 입력해 주세요.</strong><br />
              (길드마크/연맹마크 달기 혜택을 위해 필요합니다. 가문명이 아닌 길드명 또는 연맹명으로 입력해주세요!)
            </p>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-yellow-400">🎁</span>
            후원자 혜택
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-bold text-xl">🏷️</span>
                <div>
                  <div className="font-semibold text-purple-300 mb-2">길드마크 달기</div>
                  <div className="text-sm text-gray-300">
                    후원 후 디스코드로 문의주시면 길드 정보에 길드마크를 달아드립니다!
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-bold text-xl">⚔️</span>
                <div>
                  <div className="font-semibold text-purple-300 mb-2">연맹마크 달기</div>
                  <div className="text-sm text-gray-300">
                    후원 후 디스코드로 문의주시면 연맹 정보에 연맹마크를 달아드립니다!
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
            <div className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <span className="text-purple-400">📝</span>
              신청 방법
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-sm text-gray-300">후원 후 입금자명을 <b className="text-purple-300">길드명</b>으로 입력</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-sm text-gray-300">디스코드에서 <b className="text-purple-300">@디움</b>에게 후원 완료 알림</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-sm text-gray-300">길드명/연맹명과 마크 이미지 전달</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                <span className="text-sm text-green-300"><b>1-2일 내에 길드/연맹 정보에 마크 추가 완료!</b></span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            주의사항
          </h2>
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
            <div className="space-y-2 text-sm text-red-200">
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>후원금은 환불이 불가하니 신중하게 결정해 주세요.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>부적절한 광고(불법, 사행성, 선정성 등)는 사전 통보 없이 거절될 수 있습니다.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>후원 및 광고 관련 문의는 이메일 또는 디스코드로 언제든 연락해 주세요.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">📞</span>
            문의 방법
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-blue-400 text-xl">📧</span>
                <span className="font-semibold text-blue-300">이메일</span>
              </div>
              <p className="text-sm text-gray-300">ponyang.dev@gmail.com</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-blue-400 text-xl">💬</span>
                <span className="font-semibold text-blue-300">디스코드</span>
              </div>
              <a 
                href="https://discord.gg/mD37c4GEby" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-300 hover:text-blue-200 underline transition-colors"
              >
                BDOPVP-포냥이 공식 디스코드
              </a>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <p className="text-sm text-blue-200">
              💡 <strong>문의 팁:</strong> 문의 시, 광고/후원/제휴 등 구체적인 내용을 함께 남겨주시면 더욱 빠른 안내가 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 