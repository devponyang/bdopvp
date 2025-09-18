"use client";

import { useState, useEffect } from 'react';
import NoticeModal from './NoticeModal';

interface HomeWithNoticeProps {
  children: React.ReactNode;
}

export default function HomeWithNotice({ children }: HomeWithNoticeProps) {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // 오늘 날짜 확인
    const today = new Date().toDateString();
    const dismissedDate = localStorage.getItem('noticeDismissed');
    
    // 오늘 하루 보지 않기를 선택하지 않았으면 공지사항 표시
    if (dismissedDate !== today) {
      setShowNotice(true);
    }
  }, []);

  const handleCloseNotice = () => {
    setShowNotice(false);
  };

  return (
    <>
      {children}
      <NoticeModal
        title="🎉 BDOPVP-포냥이 MVP 오픈 안내"
        content={`안녕하세요! BDOPVP-포냥이를 개발 중인 개발자 디움입니다.

✅ 현재 구현된 주요 기능 

길드 상세 페이지
길드원 목록 / 입퇴장 히스토리 차트 / 길드리그 승률 / 생성일 등

솔라레 랭킹 (전체 TOP100 + 클래스별 TOP20)
티어 아이콘, 승률, 순위변동 (NEW/▲/▼) 표시

길드 리그 TOP100
순위변동 표시, 최근 업데이트 날짜 포함

거점전/점령전 현황
연맹 현황 성채단계, 승률 기록, 주/월/연 기준 랭킹 제공
(데이터 입력중 - 제공 : KOR BDO 검은사막 통합 디스코드)

✅왜 만들었냐면...

Garmoth나 Loawa 같은 사이트들이 너무 잘 만들어져 있어서 참고 많이 했습니다.
그런데 검은사막 쪽은 전적이나 히스토리를 확인 할 수 있는 사이트가 없더라고요.

그래서 가문/길드 단위로 전적을 쌓아가고 볼 수 있는 사이트를 만들어보자,
그리고 내가 좋아하는 검은사막을 위한 팬 콘텐츠로도 의미 있겠다고 생각해서 시작했습니다.

🙏 이런 피드백이 궁금합니다

사이트를 실제로 써보시고 불편한 점
기능이 부족하거나, 추가되면 좋겠는 부분
특히! 전적 관련해서 유저들이 자주 찾는 정보가 뭔지
혹은 그냥 응원 한 마디도 정말 큰 힘이 됩니다 🙏

피드백 남기기 (익명 가능)
댓글로 의견 주시기 부담스러우신 분들을 위해 간단한 익명 폼을 준비했습니다.

https://docs.google.com/forms/d/e/1FAIpQLSckAKl_RgBephxv_kmsdavfK1yRs6u4oVsXuCatxi173MW3_A/viewform?usp=sharing

궁금한 점이나 버그는 댓글이나 위 폼을 통해 꼭 알려주세요
일부 데이터 누락이 있을 수 있습니다.

모든 기능은 유저 편의를 위한 프로젝트입니다.
앞으로도 더 나은 서비스로 보답하겠습니다!`}
        isVisible={showNotice}
        onClose={handleCloseNotice}
      />
    </>
  );
}
