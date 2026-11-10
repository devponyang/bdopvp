import MissingGuideVideo from '@/components/portal/guide/MissingGuideVideo'
import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/1759833294418_85ca54e3f199688b.JPG', alt: '각성 매구' },
  sections: [
    {
      id: 'guide-12-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요 각성 매구를 주력 클래스로 플레이하고 있는 <strong>격수</strong> 입니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-12-section-2',
      title: '클래스 개요',
      content: (
        <>
          <div className="article-card">
            <p>
              각성 매구는 <span>기동성과 생존력</span> 모두 뛰어난 근접 클래스 입니다.
            </p>
            <p>
              이동기와 무적 판정을 적극적으로 활용해 <span>진입과 이탈</span>이 모두 유연하며,
            </p>
            <p>
              스킬 구조가 단순해서 숙련도가 낮아도 <span>안정적인 성능(=높은 저점)</span>을
              보여줍니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-12-section-3',
      title: '각성 매구 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-12-section-3-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                이동기가 많고, 이동 중에도 <strong>무적 판정</strong>이 자주 붙어 스킬 흘리기에
                유리함
              </li>
              <li>
                이동기를 활용한 <strong>슈퍼아머 유지</strong>가 쉬워 대치 구도에서 안정적
              </li>
              <li>
                스킬 쿨이 짧고 구조가 단순해 <strong>운영이 쉽고 저점이 높음</strong>
              </li>
              <li>
                각성 및 라밤 스킬에 <strong>회복기</strong>가 있어 전장 이탈 후 피 채우기 편함
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-12-section-3-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                운영 구조가 단순해 <strong>숙련된 상대에게는 CC 넣기 어려움</strong>
              </li>
              <li>
                주요 딜링기 '<strong>도리깨연풍</strong>'은 전가 후 슈아로 전환되어 이 구간에서 역공
                위험 존재
              </li>
              <li>
                진입기 너프로 인해 딜레이가 생겨{' '}
                <strong>숙련자 상대로는 슈아로 대응당하기 쉬움</strong>
              </li>
            </ul>
          </div>

          {/* Tip */}
          <div className="article-card">
            <p>
              <strong>💡 Tip:</strong> 도리깨연풍 사용중 각이 애매하다고 느껴지면,{' '}
              <strong>귀신걸음으로 즉시 캔슬</strong> 후 이탈하는게 안전합니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-12-section-4',
      title: '운영법',
      content: (
        <>
          {/* RVR */}
          <div className="article-card">
            <h3 id="guide-12-section-4-heading-1">
              <span>⚔️</span> 거점전(RVR)
            </h3>
            <p>
              각성 매구는 <strong>공격속도 / 시전속도 버프 유무</strong>에 따라 체감이 크게
              달라집니다.
            </p>

            <div className="article-callout">
              <h4 id="guide-12-section-4-heading-2">🏃 기본 진입 루트</h4>
              <p>
                <strong>황천걸음 → 나빌레라</strong> 또는 <strong>황천걸음 → 맴체</strong>로 진입 후
                CC를 넣고 빠르게 이탈
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-12-section-4-heading-3">🏔️ 지형 활용</h4>
              <p>
                황천걸음은 언덕이나 돌 위에서도 사용 가능해서,{' '}
                <strong>고지대 원거리 캐릭터 견제</strong>에 효과적 입니다.
              </p>
            </div>

            {/* 예시 영상 */}
            <div>
              <MissingGuideVideo src="/tip-images/1759840074330_83771904e663514d__1_.mp4">
                브라우저가 동영상을 지원하지 않습니다.
              </MissingGuideVideo>
            </div>

            <div className="article-callout">
              <h4 id="guide-12-section-4-heading-4">🎯 운영 핵심</h4>
              <p>
                인원이 많은 전장에서는 <strong>진입 → 이탈 → 재진입</strong> 패턴으로 상대의 시선을
                분산 시키는 플레이가 중요합니다.
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-12-section-4-heading-5">⚠️ 주의할 점</h4>
              <p>
                최근 패치로 <strong>황천걸음 이후 맴체 / 나빌레라 모션캔슬이 불가능</strong>{' '}
                해졌습니다.
              </p>
              <p>
                이전보다 <strong>진입 타이밍 판단</strong>이 훨씬 중요해졌습니다.
              </p>
            </div>
          </div>

          {/* 솔라레 */}
          <div className="article-card">
            <h3 id="guide-12-section-4-heading-6">
              <span>🌟</span> 솔라레
            </h3>
            <p>
              인원이 적은 구도에서는 CC가 잘 안걸리기 때문에,
              <br />
              <strong>황천걸음 → 도리깨연풍</strong> 중심의 딜 누적형 운영을 합니다.
            </p>
            <p>
              무리한 진입보다는 <strong>팀 커버나, 사이드 견제</strong> 중심으로 플레이하는게 효율적
              입니다.
            </p>
            <p>
              숙련된 상대는 CC가 거의 안 걸리므로, <strong>위치 선정과 갉아 먹는 운영</strong>이
              핵심입니다.
            </p>
          </div>

          {/* 길드리그 */}
          <div className="article-card">
            <h3 id="guide-12-section-4-heading-7">
              <span>🏆</span> 길드리그
            </h3>
            <p>
              <strong>공/시속 버프 유지가 필수</strong>
              <br />
              유무에 따라 체급 차이가 확연하게 납니다.
            </p>
            <p>
              이동기가 좋아서 대치 중에도 <strong>순간 진입 → 딜링 → 이탈</strong> 패턴을 계속
              가져갈 수 있습니다.
            </p>
            <p>
              상황에 따라 팀원의 진입 후 <strong>추가 딜링 보조</strong> 또는{' '}
              <strong>황천걸음 → 나빌레라 선집입</strong>으로 메이킹 플레이를 노리는 것도 좋습니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-12-section-5',
      title: '콤보 및 진입기',
      content: (
        <>
          {/* 기본 콤보 */}
          <div className="article-card">
            <h3 id="guide-12-section-5-heading-1">
              <span>⚡</span> 기본 콤보
            </h3>
            <div className="article-callout">
              <p>
                황천 → 맴체 or 나빌레라 → 마파람사위 → (인중치기 → 꾸지람) → 앞발찢기 → 으름 →
                도리깨연풍 → 라밤 → 이탈
              </p>
            </div>
            <div className="article-callout">
              <p>
                <strong>참고.</strong> RVR 에서는 앞발찢기-으름 이 맨몸 스킬이라 위험합니다. 상황에
                맞게 적절하게 사용해야 합니다.
              </p>
            </div>
          </div>

          {/* 풀슈아 콤보 */}
          <div className="article-card">
            <h3 id="guide-12-section-5-heading-2">
              <span>🛡️</span> 풀슈아 콤보
            </h3>
            <div className="article-callout">
              <p>
                황천 → 맴체 or 나빌레라 → 마파람사위 → 맴체 or 나빌레라 (쿨 도는것중에 하나) →
                도리깨연풍 → 라밤 → 이탈
              </p>
            </div>
          </div>

          {/* 시동기 */}
          <div className="article-card">
            <h3 id="guide-12-section-5-heading-3">
              <span>🚀</span> 시동기 (진입 전 준비)
            </h3>
            <div className="article-grid">
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/1759841208703_image.png" alt="꾸지람" />
                </div>
                <p>꾸지람</p>
                <p>(공격력 +20)</p>
              </div>
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/1759841191770_image.png" alt="인중치기" />
                </div>
                <p>인중치기</p>
                <p>(치확+30%)</p>
              </div>
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/1759841175483_image.png" alt="발따귀" />
                </div>
                <p>발따귀</p>
                <p>(에어어택 +5%)</p>
              </div>
            </div>
            <p>
              이 세 스킬은 <strong>허공에 써도 버프 효과가 적용</strong>됩니다.
              <br />
              진입 전 상황에 맞게 미리 켜두면, 초반 교전에서 유리하게 시작할 수 있습니다.
            </p>
          </div>

          {/* 진입기 */}
          <div className="article-card">
            <h3 id="guide-12-section-5-heading-4">
              <span>🎯</span> 진입기
            </h3>
            <div className="article-callout">
              <p>
                <strong>황천 → 맴체</strong>
              </p>
              <p>
                <strong>황천 → 나빌레라</strong>
              </p>
              <p>
                또는 비각성 상태에서 <strong>화구</strong>를 쓰면 황천걸음으로 재진입 가능합니다.
              </p>
            </div>
            <div className="article-card">
              <p>
                <strong>💡 Tip.</strong> 천도의 춤을 잠구고 슬롯으로 쓴다면, 비각성 상태에서도{' '}
                <strong>W+우클릭</strong>으로 황천걸음 바로 사용 가능합니다
              </p>
            </div>
          </div>

          {/* 스킬 흘리기 */}
          <div className="article-card">
            <h3 id="guide-12-section-5-heading-5">
              <span>🌪️</span> 상대 스킬 흘리기 운영
            </h3>
            <p>
              <strong>귀신걸음 → 여우달음</strong> 연계 시 긴 무적 유지로 상대 스킬을 흘리기
              쉽습니다.
            </p>
            <p>
              또는 비각성 상태에서 <strong>신령던지기 → 귀신걸음</strong> 으로도 안정적인 회피
              운영이 가능합니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-12-section-6',
      title: 'PvP 특화 및 수정',
      content: (
        <>
          {/* 특화 이미지 */}
          <div>
            <h3 id="guide-12-section-6-heading-1">⚡ 특화</h3>
            <div>
              <GuideImage src="/tip-images/1759841480860_image.png" alt="특화" />
            </div>
          </div>

          {/* 수정 이미지들 */}
          <div>
            <h3 id="guide-12-section-6-heading-2">💠 수정</h3>
            <div className="article-grid">
              <div>
                <GuideImage src="/tip-images/1759841490242_image.png" alt="수정 1" />
              </div>
              <div>
                <GuideImage src="/tip-images/1759841493847_image.png" alt="수정 2" />
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-12-section-7',
      title: '하고 싶은 말',
      content: (
        <>
          <div className="article-card">
            <p>
              각성 매구는 <strong>낮은 진입장벽과 안정적인 생존력</strong>을 가진 클래스 입니다.
            </p>
            <p>
              스킬 구조가 단순하고 템포가 빨라서 <strong>PVP 입문자에게 정말 좋은 선택</strong>
              이에요
            </p>
            <p>다만 최근 패치로 일부 연계가 제한되면서, 고점 구간에서는 확실한 한계가 있습니다.</p>
            <p>
              그래도 손이 편하고 안정적인 전투를 원하신다면 <strong>각성 매구를 추천</strong>
              드립니다.
            </p>
            <p>
              반대로 더 높은 테크닉이나 콤보 중심의 플레이를 원한다면 다른 클래스를 고려해보는것도
              좋은 선택입니다.
            </p>
            <p>읽어주셔서 감사합니다 🙏</p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-12-references',
      title: '작성자 자료와 참고 영상',
      content: (
        <>
          <GuideVideo
            src="https://www.youtube.com/embed/dSE264dTl9E"
            title="YouTube video player"
          />
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-12-section-3-heading-1',
      title: '장점',
      section: 'guide-12-section-3',
    },
    {
      id: 'guide-12-section-3-heading-2',
      title: '단점',
      section: 'guide-12-section-3',
    },
    {
      id: 'guide-12-section-4-heading-1',
      title: '거점전(RVR)',
      section: 'guide-12-section-4',
    },
    {
      id: 'guide-12-section-4-heading-2',
      title: '기본 진입 루트',
      section: 'guide-12-section-4',
    },
    {
      id: 'guide-12-section-4-heading-3',
      title: '지형 활용',
      section: 'guide-12-section-4',
    },
    {
      id: 'guide-12-section-4-heading-4',
      title: '운영 핵심',
      section: 'guide-12-section-4',
    },
    {
      id: 'guide-12-section-4-heading-5',
      title: '주의할 점',
      section: 'guide-12-section-4',
    },
    {
      id: 'guide-12-section-4-heading-6',
      title: '솔라레',
      section: 'guide-12-section-4',
    },
    {
      id: 'guide-12-section-4-heading-7',
      title: '길드리그',
      section: 'guide-12-section-4',
    },
    {
      id: 'guide-12-section-5-heading-1',
      title: '기본 콤보',
      section: 'guide-12-section-5',
    },
    {
      id: 'guide-12-section-5-heading-2',
      title: '풀슈아 콤보',
      section: 'guide-12-section-5',
    },
    {
      id: 'guide-12-section-5-heading-3',
      title: '시동기 (진입 전 준비)',
      section: 'guide-12-section-5',
    },
    {
      id: 'guide-12-section-5-heading-4',
      title: '진입기',
      section: 'guide-12-section-5',
    },
    {
      id: 'guide-12-section-5-heading-5',
      title: '상대 스킬 흘리기 운영',
      section: 'guide-12-section-5',
    },
    {
      id: 'guide-12-section-6-heading-1',
      title: '특화',
      section: 'guide-12-section-6',
    },
    {
      id: 'guide-12-section-6-heading-2',
      title: '수정',
      section: 'guide-12-section-6',
    },
  ],
}
export default content
