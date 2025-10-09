import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-zinc-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">개인정보 처리방침</h1>
      <p className="mb-2 text-sm text-zinc-600 dark:text-gray-400">최종 업데이트: 2025년 09월 18일</p>
      <p className="mb-4">
        본 개인정보 처리방침은 BDOPonyang(이하 "사이트")에서 귀하의 개인정보를 어떻게 수집, 이용, 보관, 보호하는지 안내합니다. 본 사이트를 이용함으로써 본 방침에 동의하는 것으로 간주합니다.
      </p>
      <h2 className="font-semibold mt-6 mb-2">1. 총칙</h2>
      <p className="mb-2">
        본 사이트는 1인 개발자가 운영하는 비공식 게임 정보/커뮤니티 서비스입니다. 이용자 중심의 편리한 기능 제공을 목표로 하고 있습니다. 본 방침은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보 보호법 등 관련 법령을 준수합니다.
      </p>
      <h2 className="font-semibold mt-6 mb-2">2. 개인정보 수집에 대한 동의</h2>
      <p className="mb-2">
        사이트는 이용자가 사이트를 이용함으로써 개인정보 처리방침에 동의한 것으로 간주합니다. 이용자는 사이트 이용 시 자동으로 수집되는 기본적인 개인정보(IP 주소, 브라우저 정보 등)에 대해 동의한 것으로 봅니다.
      </p>
      <h2 className="font-semibold mt-6 mb-2">3. 수집하는 개인정보 항목 및 수집·이용 목적</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>서비스 이용 시: IP 주소, 브라우저/기기 정보, 방문 기록, 검색어</li>
        <li>관리자 로그인 시: 비밀번호 (관리자만 해당)</li>
        <li>테마 설정: 사용자 테마 선택 정보 (localStorage 저장)</li>
        <li>게임 데이터: 길드명, 길드장명, 길드원 가문명, 솔라레 플레이어 닉네임 (공개 정보)</li>
        <li>후원 정보: 후원자명, 후원금액, 메시지 (후원 시에만)</li>
      </ul>
      <p className="mb-2">수집된 정보는 서비스 제공, 통계 분석, 사이트 개선, 보안 및 부정 이용 방지 목적으로만 사용됩니다.</p>
      <h2 className="font-semibold mt-6 mb-2">4. 개인정보 보유 및 이용 기간</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>방문 통계 데이터: 서비스 운영 기간 동안 보관</li>
        <li>검색 로그: 1년간 보관 후 자동 삭제</li>
        <li>테마 설정: 사용자가 변경하거나 브라우저 데이터 삭제 시까지</li>
        <li>게임 데이터: 공개 정보이므로 서비스 운영 기간 동안 보관</li>
        <li>후원 정보: 관련 법령에 따라 5년간 보관</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">5. 개인정보의 제3자 제공 및 처리위탁</h2>
      <p className="mb-2">원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 후원 처리 시 은행을 통한 결제 정보는 해당 은행의 개인정보 처리방침을 따릅니다.</p>
      <h2 className="font-semibold mt-6 mb-2">6. 개인정보의 파기 절차 및 방법</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>전자적 파일 형태는 복구 불가능한 방법으로 즉시 삭제</li>
        <li>게시글, 댓글 등은 삭제 요청 시 즉시 파기</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">7. 쿠키 및 로컬 스토리지</h2>
      <p className="mb-2">사이트는 서비스 개선을 위해 다음과 같은 기술을 사용합니다:</p>
      <ul className="list-disc pl-6 mb-2">
        <li>쿠키: 관리자 인증 상태 저장 (관리자만 해당)</li>
        <li>로컬 스토리지: 사용자 테마 설정 저장</li>
        <li>세션 스토리지: 임시 데이터 저장</li>
      </ul>
      <p className="mb-2">이용자는 브라우저 설정을 통해 쿠키 및 로컬 스토리지 저장을 거부할 수 있습니다. 단, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.</p>
      <h2 className="font-semibold mt-6 mb-2">8. 광고 서비스</h2>
      <p className="mb-2">본 사이트는 서비스 운영을 위해 다음과 같은 광고 서비스를 이용할 수 있습니다:</p>
      <ul className="list-disc pl-6 mb-2">
        <li><strong>Google AdSense:</strong> Google에서 제공하는 광고 서비스로, 사용자의 관심사에 맞는 광고를 표시합니다.</li>
        <li><strong>쿠키 및 추적 기술:</strong> 광고 개인화 및 효과 측정을 위해 쿠키, 웹 비콘 등을 사용할 수 있습니다.</li>
        <li><strong>개인화 광고:</strong> 사용자의 웹 사이트 방문 기록을 바탕으로 맞춤형 광고가 표시될 수 있습니다.</li>
        <li><strong>광고 차단:</strong> 사용자는 브라우저 설정 또는 광고 차단 도구를 통해 광고 표시를 제한할 수 있습니다.</li>
        <li><strong>개인화 광고 거부:</strong> Google 광고 설정(www.google.com/settings/ads)에서 개인화 광고를 거부할 수 있습니다.</li>
      </ul>
      <p className="mb-4 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 p-3 rounded">
        <strong>참고:</strong> 광고 서비스 제공업체는 자체 개인정보 처리방침을 가지고 있으며, 해당 업체의 정책에 따라 개인정보가 처리될 수 있습니다. 자세한 내용은 각 업체의 개인정보 처리방침을 확인해 주세요.
      </p>
      
      <h2 className="font-semibold mt-6 mb-2">9. 외부 서비스</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>Discord: 사용자 문의 및 소통</li>
        <li>은행 시스템: 후원 처리 (후원 시에만)</li>
        <li>Google Analytics: 웹사이트 이용 통계 분석</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">10. 정보보호 및 안전성</h2>
      <p className="mb-2">사이트는 개인정보 보호를 위해 합리적인 기술적/관리적 보호조치를 시행합니다. 단, 해킹, 비인가 접근 등 예기치 못한 사고에 대해서는 100% 보안을 보장할 수 없습니다.</p>
      <h2 className="font-semibold mt-6 mb-2">11. 이용자의 권리</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>개인정보 수집, 이용, 제공에 대한 동의 철회</li>
        <li>개인정보 열람, 정정·삭제 요구</li>
        <li>개인정보 처리정지 요구</li>
        <li>개인정보 관련 문의는 아래 연락처로 문의해 주세요.</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">12. 방침 변경 안내</h2>
      <p className="mb-2">본 방침은 법령, 서비스 정책 변경에 따라 사전 고지 없이 변경될 수 있습니다. 변경 시 본 페이지에 즉시 반영하며, 상단의 "최종 업데이트" 날짜를 확인해 주세요.</p>
      <h2 className="font-semibold mt-6 mb-2">13. 문의처</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>이메일: ponyang.dev@gmail.com</li>
        <li>Discord 문의: <a href="https://discord.gg/mD37c4GEby" className="text-blue-400 underline">BDOPonyang 공식 디스코드</a></li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">14. 정보 주체의 권익침해에 대한 구제방법</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>개인정보 침해신고센터 (한국인터넷진흥원): privacy.kisa.or.kr / 국번없이 118</li>
        <li>개인정보 분쟁조정위원회: www.kopico.go.kr / 02-2100-2499</li>
        <li>대검찰청 사이버범죄수사단: www.spo.go.kr / 02-3480-3571</li>
        <li>경찰청 사이버안전국: cyberbureau.police.go.kr / 국번없이 182</li>
      </ul>
    </div>
  );
} 