import React from "react";

export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-zinc-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">광고 · 후원 안내 및 문의</h1>
      <p className="mb-4">
        <b>BDOPonyang</b>은 검은사막 모험가분들이 더 쉽고, 더 재미있게 게임을 즐기실 수 있도록 만든 비공식 개인 사이트입니다.<br /><br />
        사이트의 모든 서비스는 무료로 제공되며, 광고 및 후원은 사이트 운영비(서버비, 도메인, 개발 등)로만 사용됩니다.<br /><br />
        광고 게재, 후원, 제휴, 기타 문의는 아래 안내를 참고해 주세요.
      </p>

      <h2 className="font-semibold mt-8 mb-2">광고 안내</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-2 text-blue-600 dark:text-blue-300">🔸 자동 광고 (Google AdSense)</h3>
        <p className="mb-2 text-sm pl-4">
          - 사이트 운영을 위해 Google AdSense를 통한 자동 광고를 표시합니다.<br />
          - 사용자의 관심사에 맞는 맞춤형 광고가 표시될 수 있습니다.<br />
          - 광고 차단 도구 사용 시 일부 기능에 제한이 있을 수 있습니다.<br />
        </p>
        
        <h3 className="font-medium mb-2 mt-4 text-purple-600 dark:text-purple-300">🔸 직접 광고 문의</h3>
        <p className="mb-2 text-sm pl-4">
          - 배너 광고, 제휴, 이벤트 등 다양한 형태의 광고 문의를 환영합니다.<br />
          - 광고 단가, 위치, 기간 등은 협의 후 결정됩니다.<br />
          - 광고는 검은사막 및 게이머 커뮤니티에 적합한 내용만 게재 가능합니다.<br />
          <span className="text-zinc-600 dark:text-gray-400 text-sm">※ 부적절한 광고(불법, 사행성, 선정성 등)는 사전 통보 없이 거절될 수 있습니다.</span>
        </p>
      </div>

      {/* 배너 사이즈 가이드라인 */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-3">📐 배너 광고 사이즈 가이드라인</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-700 dark:text-blue-200 mb-2">메인 배너 (홈페이지 상단)</h4>
            <ul className="text-sm text-blue-600 dark:text-blue-100 space-y-1">
              <li>• <strong>최적 비율:</strong> 16:9 또는 3:1</li>
              <li>• <strong>권장 해상도:</strong> 1200x400px ~ 1920x640px</li>
              <li>• <strong>최소 크기:</strong> 800x267px</li>
              <li>• <strong>파일 형식:</strong> JPG, PNG, WebP</li>
              <li>• <strong>파일 크기:</strong> 5MB 이하</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 dark:text-blue-200 mb-2">기타 배너</h4>
            <ul className="text-sm text-blue-600 dark:text-blue-100 space-y-1">
              <li>• <strong>사이드바:</strong> 300x250px (4:3 비율)</li>
              <li>• <strong>카드형:</strong> 400x200px (2:1 비율)</li>
              <li>• <strong>문의 시 협의:</strong> 맞춤형 사이즈 가능</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-800/30 rounded border border-blue-400/20">
          <p className="text-xs text-blue-600 dark:text-blue-200">
            💡 <strong>배너 제작 팁:</strong> 가로가 긴 이미지가 가장 적합하며, 세로가 긴 이미지는 잘릴 수 있습니다. 
            텍스트는 이미지 내에 포함하지 말고 별도로 제공해주세요.
          </p>
        </div>
      </div>

      <h2 className="font-semibold mt-8 mb-2">후원 안내</h2>
      <p className="mb-4">
        BDOPonyang은 <b>완전 무료</b>로 운영되는 사이트입니다. 후원은 전혀 강제하지 않으며, 
        사이트를 이용하시는 모든 분들께 동일한 서비스를 제공합니다.<br /><br />
        사이트 발전과 안정적인 운영을 위해 후원을 받고 있으며, 후원금은 사이트 운영비(서버, 도메인, 개발 등)로만 사용됩니다.
      </p>

      {/* 후원 계좌 정보 */}
      <div className="my-4 flex items-center justify-center">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg px-6 py-4 text-center shadow-md">
          <div className="text-sm text-purple-600 dark:text-purple-300 mb-1">💳 후원 계좌</div>
          <div className="text-lg font-bold tracking-widest text-white">새마을금고 9003-2947-5099-1</div>
          <div className="text-sm text-purple-700 dark:text-purple-200 mt-1">예금주: 김정수</div>
          <div className="text-xs text-purple-600 dark:text-purple-300 mt-2">
            💡 길드마크 혜택을 위해 입금자명을 <b>길드명</b>으로 입력해주세요!
          </div>
        </div>
      </div>
      <div className="mb-4 text-zinc-600 dark:text-gray-400 text-sm">
        <b>※ 입금 시 입금자명은 반드시 <span className="text-purple-300">길드명</span>으로 입력해 주세요.</b><br />
        (길드마크 달기 혜택을 위해 필요합니다. 가문명이 아닌 길드명으로 입력해주세요!)
      </div>

      {/* 후원자 혜택 */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <h3 className="text-purple-600 dark:text-purple-300 font-medium mb-3">🎁 후원자 혜택</h3>
        <div className="text-sm text-purple-700 dark:text-purple-100 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-purple-400 font-bold text-lg">🏷️</span>
            <div>
              <div className="font-medium text-purple-700 dark:text-purple-200">길드마크 달기</div>
              <div className="text-purple-600 dark:text-purple-100 text-xs mt-1">
                후원 후 디스코드로 문의주시면 길드 정보에 길드마크를 달아드립니다!
              </div>
            </div>
          </div>
          
          <div className="bg-purple-800/30 rounded-lg p-4">
            <div className="font-medium text-purple-700 dark:text-purple-200 mb-3 flex items-center gap-2">
              <span>📝</span> 신청 방법
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>후원 후 입금자명을 <b className="text-purple-700 dark:text-purple-200">길드명</b>으로 입력</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>디스코드에서 <b className="text-purple-700 dark:text-purple-200">@디움</b>에게 후원 완료 알림</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>길드명과 길드마크 이미지 전달</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                <span className="text-green-600 dark:text-green-300"><b>1-2일 내에 길드 정보에 길드마크 추가 완료!</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-semibold mt-8 mb-2">주의사항</h2>
      <div className="mb-4 text-zinc-600 dark:text-gray-400 text-sm">
        <b>※ 광고/후원 주의사항</b><br />
        - 후원금은 환불이 불가하니 신중하게 결정해 주세요.<br />
        - 부적절한 광고(불법, 사행성, 선정성 등)는 사전 통보 없이 거절될 수 있습니다.<br />
        - 후원 및 광고 관련 문의는 이메일 또는 디스코드로 언제든 연락해 주세요.<br />
      </div>

      <h2 className="font-semibold mt-8 mb-2">문의 방법</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>이메일: <b>ponyang.dev@gmail.com</b></li>
        <li>디스코드: <a href="https://discord.gg/mD37c4GEby" className="text-blue-400 underline">BDOPonyang 공식 디스코드</a></li>
      </ul>
      <p className="mb-2 text-zinc-400 text-sm">
        문의 시, 광고/후원/제휴 등 구체적인 내용을 함께 남겨주시면 더욱 빠른 안내가 가능합니다.
      </p>
    </div>
  );
} 