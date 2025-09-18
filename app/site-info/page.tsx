import React from "react";

export default function SiteInfoPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-zinc-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">사이트 소개</h1>
      <p className="mb-4">
        <b>BDOPonyang</b>은 검은사막을 사랑하는 모험가분들이 더 쉽고, 더 재미있게 게임을 즐기실 수 있도록 만든 비공식 개인 사이트입니다.<br /><br />
        <span className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mb-2 shadow-sm">
          <span className="font-semibold text-blue-300">개발자</span>
          <span className="font-bold text-white">디움</span>
          <span className="mx-2 text-zinc-500">|</span>
          <span className="font-semibold text-pink-300">아트(포냥이 사진)</span>
          <span className="font-bold text-white">교역</span>
        </span>
        <br />
        혼자서 개발·운영하고 있으며, 누구나 편하게 길드/솔라레 랭킹, 쿠폰, 거점전/점령전 기록, 팁게시판, 통계 등 다양한 정보를 한 곳에서 확인할 수 있도록 최선을 다하고 있습니다.<br /><br />
        <b>어제보다 오늘의 BDOPonyang이 더 도움이 되었다고 느끼실 수 있도록</b> 항상 발전하는 사이트가 되겠습니다.<br /><br />
        사이트 운영에 도움을 주신 후원금은 사이트 운영비로 사용됩니다.<br /><br />
        언제든 <a href="https://discord.gg/mD37c4GEby" className="text-blue-400 underline">디스코드</a>로 문의·피드백을 남겨주시면 감사하겠습니다.<br /><br />
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">📢 중요 공지</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
            <strong>본 콘텐츠는 펄어비스의 공식 자료가 아니며, 본 콘텐츠에는 펄어비스가 권리를 보유하고 있는 상표 또는 저작물이 포함되어 있습니다.</strong><br /><br />
            이 사이트는 검은사막 온라인을 사랑하는 팬이 제작한 비공식 팬메이드 사이트로, 펄어비스나 검은사막 공식 운영팀과는 무관합니다.
          </p>
        </div>
      </p>
    </div>
  );
} 