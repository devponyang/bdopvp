import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/ctrl.png', alt: '전승 자이언트' },
  sections: [
    {
      id: 'guide-17-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요. <strong>퇴물자이</strong>입니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-17-section-2',
      title: '전승 자이언트 클래스의 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-17-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <span>▸</span>
                <span>
                  <strong>1대1에서도 무난하고, RVR 에서도 무난합니다.</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-17-section-2-heading-2">
              <span>❌</span> 단점
            </h3>
            <ul>
              <li>
                <span>▸</span>
                <span>
                  <strong>눈에 잘 뜁니다. 남들 3대 맞을 거 자이는 10대 맞습니다.</strong>
                </span>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-17-section-3',
      title: '거점(RVR) / 솔라레 / 길드리그 운영법',
      content: (
        <>
          {/* 거점 */}
          <div className="article-card">
            <h3 id="guide-17-section-3-heading-1">
              <span>🏰</span> 거점 (RVR)
            </h3>
            <p>
              신거점에서 <strong>공포의 군림자 만 잘 써도 밥값은 합니다.</strong>
            </p>
          </div>

          {/* 솔라레 */}
          <div className="article-card">
            <h3 id="guide-17-section-3-heading-2">
              <span>⚡</span> 솔라레의 창
            </h3>
            <p>아래 영상을 참고하세요.</p>
            <div>
              <GuideVideo
                src="https://www.youtube.com/embed/Lgo8M7gKjXw"
                title="전승 자이언트 솔라레 플레이"
              />
            </div>
          </div>

          {/* 길드리그 */}
          <div className="article-card">
            <h3 id="guide-17-section-3-heading-3">
              <span>🛡️</span> 길드리그
            </h3>
            <p>
              <strong>방셋 입고 잡기 CC 셔틀</strong>하시면 됩니다.
            </p>
            <p>
              저는 잡고 나서 <strong>보라색 핑을 2~3번 찍고 마이크</strong>도 해서
              <strong> 상대 핵심 멤버를 빠르게 죽이는 데 포인트</strong>를 두고 있습니다.
            </p>
            <div>
              <GuideVideo
                src="https://www.youtube.com/embed/kZFDjrzJNAQ"
                title="전승 자이언트 길드리그 플레이"
              />
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-17-section-4',
      title: 'PVP 콤보',
      content: (
        <>
          {/* 기본 콤보 */}
          <div className="article-card">
            <h3 id="guide-17-section-4-heading-1">
              <span>🔥</span> 기본 콤보
            </h3>

            <div className="article-callout">
              <p>
                <strong>잡기</strong> →<strong> 극 광분의 파괴자 2~3타</strong>{' '}
                <span>(디버프 걸렸을시 2타)</span> →<strong> 히든 몰벼+맹수의 습격</strong> →
                <strong> 맹렬한 공격 1타</strong> →<strong> 고대의 파동</strong> →
                <strong> 용암 뚫기 + 날짐승 바람 가르기 2타 or 3타</strong> →
                <strong> 바위 밀치기 2타</strong> <span>(취향)</span> →<strong> 거암</strong>
              </p>
            </div>
          </div>

          {/* 핵심 스킬 */}
          <div className="article-card">
            <h3 id="guide-17-section-4-heading-2">
              <span>💡</span> 핵심 스킬
            </h3>

            <div className="article-callout">
              <p>
                자이언트는 <strong>뿌리치기가 핵심 스킬</strong>입니다. 거의{' '}
                <strong>쿨 돌 때마다</strong> 쓰면 됩니다.
              </p>
              <p>
                <strong>공포의 군림자(공군)</strong>은 상황 봐서 우겨넣기
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-17-section-5',
      title: '진입기 / 1cc 시동기 활용법',
      content: (
        <>
          <div className="article-card">
            <h3 id="guide-17-section-5-heading-1">
              <span>⚡</span> 주로 사용하는 이니시에이팅
            </h3>

            <div className="article-callout">
              <p>
                <strong>용암 뚫기</strong> →<strong> 바위 밀치기</strong>
              </p>
            </div>

            <div className="article-callout">
              <p>
                <strong>적 뒤를 깊숙이 들어가서</strong> 다음 스킬 중 하나를 사용:
              </p>
              <div>
                <p>
                  • <strong>공포의 군림자(공군)</strong>
                </p>
                <p>
                  • <strong>포식자의 사냥</strong>
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-17-section-6',
      title: 'PvP 특화 및 수정',
      content: (
        <>
          {/* 특화 이미지 */}
          <div>
            <h3 id="guide-17-section-6-heading-1">⚡ 특화</h3>
            <div>
              <GuideImage src="/tip-images/jangbi.png" alt="특화" />
            </div>
          </div>

          <div className="article-card">
            <h3 id="guide-17-section-6-heading-2">💠 수정</h3>

            <div>
              {/* 피감 밸런스 세팅 */}
              <div className="article-callout">
                <h4 id="guide-17-section-6-heading-3">피감 밸런스 세팅</h4>
                <div>
                  <GuideImage src="/tip-images/jangbibal.png" alt="피감 밸런스 세팅" />
                </div>
              </div>

              {/* 피감 방어 세팅 */}
              <div className="article-callout">
                <h4 id="guide-17-section-6-heading-4">피감 방어 세팅</h4>
                <div>
                  <GuideImage src="/tip-images/jangbibang.png" alt="피감 방어 세팅" />
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-17-section-7',
      title: '하고 싶은 말',
      content: (
        <>
          <div className="article-card">
            <p>
              <strong>자이를 할 때 즐거워야 오래합니다.</strong>
            </p>
            <p>
              복귀 전에 자이언트 유튜브 <strong>필우</strong>님 거 많이 보았습니다. 아르샤에서도
              많이 싸웠구요.
            </p>
            <p>가슴이 시키는 직업을 하셨으면 좋겠습니다. 저는 그랬습니다.</p>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-17-section-2-heading-1',
      title: '장점',
      section: 'guide-17-section-2',
    },
    {
      id: 'guide-17-section-2-heading-2',
      title: '단점',
      section: 'guide-17-section-2',
    },
    {
      id: 'guide-17-section-3-heading-1',
      title: '거점 (RVR)',
      section: 'guide-17-section-3',
    },
    {
      id: 'guide-17-section-3-heading-2',
      title: '솔라레의 창',
      section: 'guide-17-section-3',
    },
    {
      id: 'guide-17-section-3-heading-3',
      title: '길드리그',
      section: 'guide-17-section-3',
    },
    {
      id: 'guide-17-section-4-heading-1',
      title: '기본 콤보',
      section: 'guide-17-section-4',
    },
    {
      id: 'guide-17-section-4-heading-2',
      title: '핵심 스킬',
      section: 'guide-17-section-4',
    },
    {
      id: 'guide-17-section-5-heading-1',
      title: '주로 사용하는 이니시에이팅',
      section: 'guide-17-section-5',
    },
    {
      id: 'guide-17-section-6-heading-1',
      title: '특화',
      section: 'guide-17-section-6',
    },
    {
      id: 'guide-17-section-6-heading-2',
      title: '수정',
      section: 'guide-17-section-6',
    },
    {
      id: 'guide-17-section-6-heading-3',
      title: '피감 밸런스 세팅',
      section: 'guide-17-section-6',
    },
    {
      id: 'guide-17-section-6-heading-4',
      title: '피감 방어 세팅',
      section: 'guide-17-section-6',
    },
  ],
}
export default content
