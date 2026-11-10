import GuideImage from '@/components/portal/guide/GuideImage'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: undefined,
  sections: [
    {
      id: 'guide-13-section-1',
      title: '소개',
      content: (
        <>
          <div>
            안녕하세요{' '}
            <img alt="치지직" src="/tip-images/chzzk.png" className="skill-icon" loading="lazy" />
            치지직에서 방송하고 있는 <GuideImage src="/tip-images/dasa.png" alt="사다새" />
            사다새라고 합니다.
          </div>
        </>
      ),
    },
    {
      id: 'guide-13-section-2',
      title: '각성 위치 장/단점 (PVP)',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-13-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <strong>광역 힐, 보호의 영역, 신속의 주문</strong> 등 아군에게 도움이 되는 스킬들이
                많습니다.
              </li>
              <li>
                RVR에서 <strong>콤보가 없을 뿐더러, 난이도가 매우 낮아</strong> 각성 위치로 사냥을
                할 수 있을 정도라면 크게 배울 것이 없습니다.
              </li>
              <li>
                RVR을 아예 처음한다면 <strong>각성위치로 입문 추천</strong>드립니다.
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-13-section-2-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                각성 위치는 정말 쉽지만 그만큼 <strong>고점이 너무나도 낮은편</strong>입니다.
              </li>
              <li>
                어떻게 보면 <strong>육각형 캐릭</strong>인 것 같지만 <strong>작은 육각형</strong>{' '}
                입니다.
              </li>
              <li>
                이것 저것 있을 것은 다 있지만 <strong>뭔가 아쉬운 캐릭터</strong>입니다.
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-13-section-3',
      title: '거점전 / 솔라레 운영법',
      content: (
        <>
          {/* 거점전 */}
          <div className="article-card">
            <h3 id="guide-13-section-3-heading-1">
              <span>⚔️</span> 거점전
            </h3>

            <div>
              <div className="article-callout">
                <h4 id="guide-13-section-3-heading-2">🎯 핵심 운영</h4>
                <p>
                  <strong>보호의 영역, 신속의 주문</strong>을 잘 써주는 것이 중요합니다.
                </p>
                <p>(Q가드도 틈틈히 사용)</p>
              </div>

              <div className="article-callout">
                <h4 id="guide-13-section-3-heading-3">🛡️ 생존 우선</h4>
                <p>
                  본인이 생존해야지 진입 상황에 맞게{' '}
                  <strong>보호의 영역과 아드혼의 정신 스킬</strong>을 사용 할 수 있습니다.
                </p>
                <p>
                  스킬을 보유하고 있다면 조금 <strong>안정적으로 플레이</strong> 해주는 것이
                  좋겠습니다.
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-13-section-3-heading-4">⚡ 진입 타이밍</h4>
                <p>
                  이런 스킬들을 소모하고 쿨타임일때는 본대에 크게 필요가 없어{' '}
                  <strong>들어갈때 확실히 진입</strong>해주는 것이 좋겠습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 솔라레 */}
          <div className="article-card">
            <h3 id="guide-13-section-3-heading-5">
              <span>🌟</span> 솔라레
            </h3>

            <div>
              <div className="article-callout">
                <h4 id="guide-13-section-3-heading-6">🚀 텔레포트 활용</h4>
                <p>
                  저도 잘 지키지 못하고 있지만{' '}
                  <strong>아군의 위치를 보고 텔레포트로 순식간에 합류</strong>하는 것이 좋은 것
                  같습니다.
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-13-section-3-heading-7">💫 역이용 전략</h4>
                <p>
                  일반적으로 위치가 잡기 캐릭들에게 쫓기는 상황이 연출되는데, 이러한 경우{' '}
                  <strong>이동기+무적기</strong>를 사용해서 보통 빠져나오는 경우가 많습니다.
                </p>
                <p>
                  이럴 때 <strong>이동기를 아군쪽으로 사용</strong>해서 순식간에{' '}
                  <strong>3:2 구도</strong>를 만드는 것이 중요한 것 같아요
                </p>
              </div>
            </div>
          </div>

          {/* 공통 팁 */}
          <div className="article-card">
            <h3 id="guide-13-section-3-heading-8">
              <span>💡</span> 공통 팁
            </h3>
            <p>
              거점전과 솔라레 둘다 적용되는 말인데 <strong>마그누스 스킬</strong>이 슈퍼아머 상태를
              오래 유지하게 해주어 <strong>자주 사용</strong>하는 것 같습니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-13-section-4',
      title: 'PVP 콤보',
      content: (
        <>
          <div className="article-card">
            <h3 id="guide-13-section-4-heading-1">
              <span>⚡</span> 기본 콤보
            </h3>
            <div className="article-callout">
              <p>
                텔레포트 → 전류파동 (경직+바운드 or 바운드) → 감벼락 → 균열의 파도 (넉다운) → 남는
                스킬
              </p>
            </div>
            <p>개인적으로 각성위치는 따로 콤보랄게 없는 것 같습니다.</p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-13-section-5',
      title: 'PvP 특화 및 수정',
      content: (
        <>
          {/* 특화 이미지 */}
          <div>
            <GuideImage src="/tip-images/sada.png" alt="특화" />
          </div>

          <div className="article-card">
            <p>특화는 계속 조금씩 변화를 주고 있어 바뀔 수 있습니다.</p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-13-section-6',
      title: '더 궁금하다면?',
      content: (
        <>
          <div className="article-card">
            <p>
              더 궁금한 것들은 <strong>방송에 오셔서 질문</strong>하셔도 됩니다.
            </p>
            <p>
              채팅이 엄청 매운편이기 때문에 불편하시다면 <strong>귓속말이나 디스코드</strong>로
              주셔도 됩니다.
            </p>

            <div>
              {/* 치지직 방송 링크 */}
              <a
                href="https://chzzk.naver.com/9cc4bda5d0387d211f9b2123895db58b"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="치지직"
                  src="/tip-images/chzzk.png"
                  className="skill-icon"
                  loading="lazy"
                />
                치지직 방송 바로가기
              </a>

              {/* 디스코드 */}
              <div className="article-callout">
                <p>
                  💬 Discord: <span>popopoooopo</span>
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-13-references',
      title: '작성자 자료와 참고 영상',
      content: (
        <>
          <a
            href="https://chzzk.naver.com/9cc4bda5d0387d211f9b2123895db58b"
            target="_blank"
            rel="noopener noreferrer"
          >
            스트리머
          </a>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-13-section-2-heading-1',
      title: '장점',
      section: 'guide-13-section-2',
    },
    {
      id: 'guide-13-section-2-heading-2',
      title: '단점',
      section: 'guide-13-section-2',
    },
    {
      id: 'guide-13-section-3-heading-1',
      title: '거점전',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-3-heading-2',
      title: '핵심 운영',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-3-heading-3',
      title: '생존 우선',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-3-heading-4',
      title: '진입 타이밍',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-3-heading-5',
      title: '솔라레',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-3-heading-6',
      title: '텔레포트 활용',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-3-heading-7',
      title: '역이용 전략',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-3-heading-8',
      title: '공통 팁',
      section: 'guide-13-section-3',
    },
    {
      id: 'guide-13-section-4-heading-1',
      title: '기본 콤보',
      section: 'guide-13-section-4',
    },
  ],
}
export default content
