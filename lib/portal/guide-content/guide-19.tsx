import GuideImage from '@/components/portal/guide/GuideImage'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/2025-11-29_133529971.JPG', alt: '퇴마록님' },
  sections: [
    {
      id: 'guide-19-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요 전승 매구를 플레이하고있는 <strong>퇴마록</strong>이라고합니다
          </p>
        </>
      ),
    },
    {
      id: 'guide-19-section-2',
      title: '전승 매구 클래스의 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-19-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                분신으로 인해 다른 원거리클래스 대비 <strong>뛰어난 생존능력</strong>을
                가지고있습니다
              </li>
              <li>
                몇개의 스킬만으로도 <strong>슈아유지가 가능</strong>
              </li>
              <li>
                한풀이(EE), 발톱긋기를 사용해 순간적으로 진입할수있어서 아군이 cc를 건 곳에{' '}
                <strong>딜지원이 매우 용이</strong>
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-19-section-2-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                스킬들의 시전시간이 길어 순간적인 DPS가 낮아{' '}
                <strong>1~2초의 짧은 딜교환에는 불리함</strong>
              </li>
              <li>
                꽃놀이패, 화구 두가지 원거리cc,딜링기가 있지만{' '}
                <strong>맨몸에 선딜까지있어 쉽게 노려짐</strong>
              </li>
              <li>
                다수전에서 2명이상 타격시 20%씩 데미지감소, 최소20% 피해가 들어가기때문에{' '}
                <strong>킬을 노리기 쉽지않은점</strong>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-19-section-3',
      title: '거점(RVR) / 솔라레or길드리그(소수전) 운영법',
      content: (
        <>
          <div className="article-card">
            <p>
              현재 <strong>거점</strong>에서는 성채먹을때 머리박기말고 별다른게 없는거 같습니다
            </p>

            <p>
              <strong>솔라레</strong> 에서는 최대한 꽃놀이패 화구 쿨마다 굴려서 데미지를 많이 넣거나
            </p>

            <p>
              매화/무사/다크나이트/닌자/금수랑 같은 상대적으로 빠른공속의 캐릭들이 있을때는 최대한{' '}
              <strong>슈아기만 굴려 안정적으로 플레이</strong>하고있습니다
            </p>

            <p>
              솔라레에서 노려지기 쉬운캐릭이기때문에 교전시{' '}
              <strong>제자리에서 1.5초이상 있지 않으려고 노력</strong>중입니다
            </p>

            <p>
              최대한{' '}
              <strong>
                분신과 기만하는덫(s+우클)을 자주사용해 어그로를 뺴거나, 슈아유지 지구력관리
              </strong>
              를 하고
            </p>

            <p>
              상대에 잡기캐릭이 있을경우 캐릭마다 안정거리를 가상으로 설정해서 안정거리 안으로
              들어올경우 <strong>신령던지기 무적회피</strong>를 사용합니다
            </p>
          </div>

          {/* 특정 클래스 상대법 */}
          <div className="article-card">
            <h3 id="guide-19-section-3-heading-1">
              <span>⚔️</span> 특정 클래스 상대법
            </h3>

            <div>
              <div className="article-callout">
                <h4 id="guide-19-section-3-heading-2">닌자</h4>
                <p>
                  기존 닌자들은 어느정도 은신범위가 예측이 가능해서 1:1은 거의 이기는 수준이었지만
                </p>
                <p>
                  이번시즌에는 은신이후 달리기가 가능해져서 위치 예측이 거의 불가능합니다 그래서
                  상대하기 쉽지않았고
                </p>
                <p>
                  이기려는 마음가짐보다는 약간 먼곳에서 최대한 저를 노리게 만들고 슈아스킬만을
                  사용해서 닌자를 진입하게만든뒤 아군쪽에 합류해 딜링하는식으로 플레이
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-19-section-3-heading-3">전승 매화</h4>
                <p>
                  상대에 전승매화가있다면 일단{' '}
                  <strong>꽃놀이패,화구,섬돌뚫기 세가지스킬은 거의 봉인</strong>한다 생각해야합니다
                </p>
                <p>
                  섬돌같은경우 사용한자리에 분신이남는데 매화가 추격을 사용해 분신남은자리까지와서
                  편전한방만 쏘면 분신을타도 캐치당하고 안타도 캐치당하는상황이 나옵니다
                </p>
                <p>
                  그리고 근접상황에서 전방 꽃자욱 vs 붉은달 서로 동시에쓰면 꽃자욱이 뚤리기때문에
                  조심해야 합니다
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-19-section-3-heading-4">무사/매화</h4>
                <p>
                  무사/매화 같은경우 공격템포가 아주빠르고 옆장찌,이리오너라 같은스킬로 매구의
                  전방가드스킬인 <strong>발톱빗 혼비백산을 카운터칠수있어</strong> 사용할때 주의가
                  필요합니다
                </p>
              </div>
            </div>
          </div>

          {/* 넋두리 팁 */}
          <div className="article-card">
            <h3 id="guide-19-section-3-heading-5">
              <span>💡</span> 넋두리 팁
            </h3>
            <p>
              이번시즌 <strong>넋두리(Shift+C)의 슈아시간이 엄청짧아진건지</strong> 넋두리이후
              귀신회오리쓰려고하는데 자꾸 cc를 걸리더라고요
            </p>
            <p>
              그래서 넋두리는 <strong>초반 공버프땡기는용으로만 사용</strong>
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-19-section-4',
      title: 'PVP 콤보',
      content: (
        <>
          <div>
            {/* 원거리 콤보 */}
            <div className="article-card">
              <h3 id="guide-19-section-4-heading-1">
                <span>🏹</span> 원거리에서
              </h3>

              <div>
                <div className="article-callout">
                  <p>콤보 1:</p>
                  <p className="command-line">
                    꽃자욱(1cc) → 발톱빗 → 급살(0.7) → 화구or꽃놀이패(1cc) → 타오르는령,한풀이(ee로
                    진입) → 여우놀음 → 천도의춤 → 귀신회오리
                  </p>
                </div>

                <div className="article-callout">
                  <p>콤보 2:</p>
                  <p className="command-line">
                    화구or꽃놀이패 → 발톱빗 → E-E 진입 or 발톱긋기 → 여우놀음 → 급살 → 꽃자욱 or
                    귀천(기술심화 기절) → 천도의춤 → 귀신회오리
                  </p>
                </div>
              </div>
            </div>

            {/* 근거리 콤보 */}
            <div className="article-card">
              <h3 id="guide-19-section-4-heading-2">
                <span>⚔️</span> 근거리에서 cc캐치
              </h3>

              <div className="article-callout">
                <p>콤보:</p>
                <p className="command-line">
                  꽃자욱 → 발톱빗 → 여우놀음 → 급살 → 화구or꽃놀이패 → 타오르는령,한풀이(E-E로 진입)
                  → 여우놀음 → 천도의춤 → 귀신회오리
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-19-section-5',
      title: '주로 사용하는 진입기라든가 1cc 시동기 활용법 (이니시)',
      content: (
        <>
          <div className="article-card">
            <p>
              대부분 <strong>꽃자욱으로인한 씨씨로시작</strong>하고
            </p>

            <p>
              특별한경우 상대의 전방가드타이밍에 <strong>발톱긋기-귀천 콤보로 cc를 넣고</strong>
              있습니다
            </p>

            <p>
              여우놀음이나 꽃놀이패의경우{' '}
              <strong>우측발톱빗(D+좌클릭)1타이후 사용하면 선딜이제거</strong>되어 나가기때문에 항상
              발톱빗이후 사용하고있습니다
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-19-section-6',
      title: '솔라레 특화 / 거점or길드리그 무제한 특화 및 수정',
      content: (
        <>
          <div>
            {/* 수정 이미지 */}
            <div className="article-card">
              <h3 id="guide-19-section-6-heading-1">
                <span>🔧</span> 수정
              </h3>
              <div>
                <GuideImage src="/tip-images/전승매구수정.png" alt="전승 매구 수정" />
              </div>
            </div>

            {/* 특화 이미지 */}
            <div className="article-card">
              <h3 id="guide-19-section-6-heading-2">
                <span>⭐</span> 특화
              </h3>
              <div>
                <GuideImage src="/tip-images/전승매구특화.png" alt="전승 매구 특화" />
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-19-section-7',
      title: '하고 싶으신 말',
      content: (
        <>
          <div className="article-card">
            <p>
              전승매구의 특성상 특별한게 별로없기때문에 뭐라 적을지 몰라 좀 오래걸렸네요..
              늦어지게되서 죄송합니다
            </p>
            <p>
              <strong>꽃놀이패 화구 분산딜좀 줄여줬으면하는 바람</strong>이있고
            </p>
            <p>
              <strong>전승매구로 사냥도 즐길수있게 버프해줬으면 좋겠습니다.</strong>
            </p>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-19-section-2-heading-1',
      title: '장점',
      section: 'guide-19-section-2',
    },
    {
      id: 'guide-19-section-2-heading-2',
      title: '단점',
      section: 'guide-19-section-2',
    },
    {
      id: 'guide-19-section-3-heading-1',
      title: '특정 클래스 상대법',
      section: 'guide-19-section-3',
    },
    {
      id: 'guide-19-section-3-heading-2',
      title: '닌자',
      section: 'guide-19-section-3',
    },
    {
      id: 'guide-19-section-3-heading-3',
      title: '전승 매화',
      section: 'guide-19-section-3',
    },
    {
      id: 'guide-19-section-3-heading-4',
      title: '무사/매화',
      section: 'guide-19-section-3',
    },
    {
      id: 'guide-19-section-3-heading-5',
      title: '넋두리 팁',
      section: 'guide-19-section-3',
    },
    {
      id: 'guide-19-section-4-heading-1',
      title: '원거리에서',
      section: 'guide-19-section-4',
    },
    {
      id: 'guide-19-section-4-heading-2',
      title: '근거리에서 cc캐치',
      section: 'guide-19-section-4',
    },
    {
      id: 'guide-19-section-6-heading-1',
      title: '수정',
      section: 'guide-19-section-6',
    },
    {
      id: 'guide-19-section-6-heading-2',
      title: '특화',
      section: 'guide-19-section-6',
    },
  ],
}
export default content
