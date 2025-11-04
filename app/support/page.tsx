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
            <b className="text-white">BDOPVP-포냥이</b>는 검은사막 모험가분들이 더 쉽고, 더 재미있게 게임을 즐기실 수 있도록 만든 팬메이드 사이트입니다.<br /><br />
            사이트의 모든 서비스는 무료로 제공되며, 광고 및 후원은 사이트 운영비로 사용됩니다.<br /><br />
            광고 게재, 후원, 제휴, 기타 문의는 아래 안내를 참고해 주세요.
          </p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-400">📢</span>
            광고 안내
          </h2>
          
          {/* 사이트 통계 */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
              <span className="text-green-400">📊</span>
              사이트 통계 (Google Analytics 기준)
            </h3>
            <p className="text-sm text-green-200 mb-4">2025.11.04 기준</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">2024.09.20</div>
                <div className="text-sm text-gray-300">사이트 오픈</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">4,300명</div>
                <div className="text-sm text-gray-300">총 사용자</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">9.6만</div>
                <div className="text-sm text-gray-300">페이지뷰 (PV)</div>
              </div>
            </div>
          </div>
          
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
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <h3 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <span className="text-purple-400">🔸</span>
                배너 후원
              </h3>
              <div className="space-y-4 text-sm text-gray-300">
                <p className="leading-relaxed">
                  사이트 메인화면에 스트리머/유튜브 홍보 , 생일 축하, 길드 홍보, 이벤트 안내 등 배너를 게재해드립니다.
                </p>
                
                <div>
                  <h4 className="font-semibold text-purple-200 mb-2">배너 기능</h4>
                  <div className="space-y-2 ml-2">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        <strong>링크 연결</strong> - 클릭 시 길드 정보, 연맹 정보, 캐릭터 검색, 
                        치지직/트위치 방송 주소 등 새창으로 연결
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        <strong>상세 이미지 출력</strong> - 클릭 시 길드 포스터, 이벤트 상세 페이지 등 
                        배너 외 추가 이미지 출력
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-200">
                    <strong>후원금액은 3일(72시간)을 기준으로 10,000원입니다.</strong>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p>배너는 검은사막 및 게이머 커뮤니티에 적합한 내용만 게재 가능합니다.</p>
                  <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                    <p className="text-xs text-yellow-200">
                      ⚠️ <strong>주의:</strong> 부적절한 배너(불법, 사행성, 선정성 등)는 사전 통보 없이 거절될 수 있습니다.
                    </p>
                  </div>
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
                메인 배너
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
                  <span><strong>파일 크기:</strong> 1MB 이하</span>
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
            BDOPVP-포냥이는 <b className="text-white">무료</b>로 운영되는 사이트입니다. 후원은 전혀 강제하지 않으며, 
            사이트를 이용하시는 모든 분들께 동일한 서비스를 제공합니다.<br /><br />
            사이트 발전과 안정적인 운영을 위해 후원을 받고 있습니다. 
            <b className="text-white">커피 한 잔 값</b>이라도 정말 감사합니다! 😊<br /><br />
            후원금은 사이트 운영비(서버, 도메인 등)로 사용되며, 
            <b className="text-white">길드/연맹 후원</b>과 <b className="text-white">개인 후원</b> 모두 환영합니다!
          </p>

          {/* 후원 계좌 정보 */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 text-center shadow-lg mb-6">
            <div className="text-sm text-purple-300 mb-2 flex items-center justify-center gap-2">
              <span className="text-purple-400">💳</span>
              후원 계좌
            </div>
            <div className="text-2xl font-bold tracking-widest text-white mb-2">새마을금고 9003-2947-5099-1</div>
            <div className="text-sm text-purple-200 mb-4">예금주: 김정수</div>
            <div className="mt-4 p-3 bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-200">
                💡 <strong>입금자명은 자유롭게 입력하셔도 됩니다!</strong>
                <br />
                <span className="text-purple-300">(후원 정말 감사합니다 🙏)</span>
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-200">
              <strong>※ 길드/연맹 마크 혜택을 받으실 분들만 포냥이 디스코드에서 티켓 열어서 파일 전달 부탁드립니다.</strong>
              <br />
              <span className="text-yellow-300">개인 후원은 별도로 연락하실 필요 없습니다. 정말 감사합니다! 💙</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-yellow-400">🎁</span>
            후원 혜택
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
              길드/연맹 마크 신청 방법
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-sm text-gray-300">후원 후 포냥이 디스코드에서 <b className="text-purple-300">티켓 열기</b></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-sm text-gray-300">길드명/연맹명과 <b className="text-purple-300">마크 이미지 파일</b> 전달</span>
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