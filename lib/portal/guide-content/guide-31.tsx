import GuideImage from '@/components/portal/guide/GuideImage'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: undefined,
  sections: [
    {
      id: 'guide-31-section-1',
      title: '소개',
      content: (
        <>
          <div>
            <p>
              안녕하세요, <strong>Ctrl 길드</strong>에서 각성 드라카니아를 플레이하고 있는{' '}
              <strong>도비뚜밥</strong>입니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-31-section-2',
      title: '각성 드라카니아 클래스의 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-31-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <strong>이동기가 많아 기동성이 좋음</strong>
              </li>
              <li>
                <strong>굴절 잡기를 활용해서 창의적인 잡기각을 만들어낼 수 있음</strong>
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-31-section-2-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                <strong>전방가드 및 맨몸 판정 스킬이 많아 슈퍼아머 유지가 어려움</strong>
              </li>
              <li>
                <strong>상대방 cc 및 뒤잡 스킬에 매우 취약함</strong>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-31-section-3',
      title: '운영법',
      content: (
        <>
          {/* 1번째 줄: 솔라레의 창 운영법 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>🌟</span>
              </div>
              <h3 id="guide-31-section-3-heading-1">솔라레의 창 운영법</h3>
            </div>

            <div>
              <div>
                <h4 id="guide-31-section-3-heading-2">1. 드리블은 팀이 있는 쪽으로</h4>
                <p>
                  각성 드라카니아의 특성상 상대팀 입장에서 찍기 좋은 캐릭터중 하나이기 때문에 아마도
                  솔라레를 하시다보면 가장 먼저 찍히게 되는 상황이 많이 나오게 됩니다.
                </p>
                <p>
                  이때 드리블을 항상 미니맵을 보면서 팀이 있는 쪽으로 해주셔야 생존하실 수 있습니다.
                </p>
              </div>

              <div>
                <h4 id="guide-31-section-3-heading-3">2. 잡기 이후 무리하게 2cc를 넣을 필요 X</h4>
                <p>
                  각성 드라카니아의 경우 넉다운 cc 스킬들이 모두 맨몸 판정이기 때문에 잡기 이후
                  무리하게 2cc를 넣으실 필요는 없습니다.
                </p>
                <p>
                  잡기 성공 후 핑을 가장 먼저 찍으신 다음, 주변 상황을 보고 넉다운을 넣을 수 있으면
                  넣으시되 상대방의 커버가 바로 들어올거 같거나 난전중에 잡으셨다면 아군이 2cc를
                  넣어준다고 생각하시고 슈아 스킬을 쓰시거나 이동기를 통해 한번 흘려 주시는게
                  좋습니다. 만약 어떻게든 자신이 2cc를 넣어야 하는 상황이라면
                  본:격파의돌격(띄우기)으로 넣어주시면 됩니다.
                </p>
              </div>

              <div>
                <h4 id="guide-31-section-3-heading-4">3. 아군 핑이 찍혔을때</h4>
                <ul>
                  <li>아군이 cc에 걸려서 핑이 찍힘 → 상대방 딜러를 커버잡</li>
                  <li>
                    아군이 상대팀에게 cc를 걸어서 핑이 찍힘 → 상대방 커버가 바로 들어올 수 없을 경우
                    딜링, 상대방 커버가 바로 들어올 수 있는 상황이면 커버 들어오는 상대방을 역잡
                  </li>
                </ul>
              </div>

              <div>
                <h4 id="guide-31-section-3-heading-5">
                  4. 상대방에 잡기 캐릭터가 있을경우 슈퍼아머 유지시 주의점
                </h4>
                <p>
                  슈퍼아머 스킬중 마룡폼 혼에 사무치는 원한 및 마인폼 척결은 스킬 사용후 딜레이가
                  길어 상대방에게 잡기각이 아주 쉽게 나오기 때문에 주의하셔야 합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 2번째 줄: 거점전(RVR) 운영법 + 길드 리그 운영법 */}
          <div className="article-grid">
            {/* 거점전(RVR) 운영법 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>⚔️</span>
                </div>
                <h3 id="guide-31-section-3-heading-6">거점전(RVR) 운영법</h3>
              </div>

              <div>
                <p>메인 본대에서 플레이하기보다는 사이드 쪽에 펼쳐서 포지션을 잡는게 좋습니다.</p>
                <p>
                  사이드 쪽에서 전방가드 스킬(마룡폼)으로 상대 라인을 견제해주다가 아군 딜러들에게
                  들어오는 상대방 암살자 캐릭터들을 잡기를 이용해서 잡아주시면 됩니다.
                </p>
                <p>
                  성채 막타 경쟁 타이밍 때는 경쟁 연맹 뒷라인으로 먼저 들어가서 cc를 넣거나 아군
                  딜러들에게 들어오는 상대방 암살자 캐릭터를 보고 커버잡기를 해주시면 됩니다.
                </p>
                <div className="article-callout">
                  <p>⚠️ 주의사항</p>
                  <p>
                    전방 및 맨몸 판정이 많은 각성 드라카니아의 특성상 무제한 거점전처럼 주로 3개
                    연맹이 성채 하나를 두고 대치하는 상황에선 할 수 있는게 거의 없기 때문에
                    추천드리지 않고, 1단거점처럼 소규모 교전이 많이 일어나는 곳에서 플레이하시는게
                    좋습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 길드 리그 운영법 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>🏆</span>
                </div>
                <h3 id="guide-31-section-3-heading-7">길드 리그 운영법</h3>
              </div>

              <div>
                <p>
                  솔라레 운영법과 거의 비슷하게 운영됩니다, 상대 주력 딜러들을 압박하면서 cc를
                  걸었을 때 핑을 찍어주시고(색깔핑 사용 권장) 아군이 cc에 걸렸을 때는 커버, 상대방
                  딜러가 cc에 걸렸을 때는 딜링 및 역잡각을 봐주시면 되겠습니다.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-31-section-4',
      title: 'PVP 콤보',
      content: (
        <>
          <div className="article-callout">
            <p>※ 콤보는 참고용으로, 상황에 따라 유연하게 사용하시면 됩니다.</p>
          </div>

          <div>
            {/* 2CC 콤보 */}
            <div className="article-callout">
              <h3 id="guide-31-section-4-heading-1">2CC 콤보</h3>
              <div className="article-callout">
                <GuideImage src="/tip-images/드카콤보1.png" alt="2CC 콤보" />
              </div>
            </div>

            {/* 2.7CC 콤보 */}
            <div className="article-callout">
              <h3 id="guide-31-section-4-heading-2">2.7CC 콤보</h3>
              <div className="article-callout">
                <GuideImage src="/tip-images/드카콤보2.png" alt="2.7CC 콤보" />
              </div>
            </div>

            {/* 전승 스타트 2.7CC 콤보 */}
            <div className="article-callout">
              <h3 id="guide-31-section-4-heading-3">전승 스타트 2.7CC 콤보</h3>
              <div className="article-callout">
                <GuideImage src="/tip-images/드카콤보3.png" alt="전승 스타트 2.7CC 콤보" />
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-31-section-5',
      title: '주로 사용하는 진입기',
      content: (
        <>
          <div className="article-grid">
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>1</span>
                </div>
                <p>진입기 1</p>
              </div>
              <div className="article-callout">
                <p>마인 격파의 돌격 → 마룡 파멸의 인도자</p>
              </div>
            </div>

            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>2</span>
                </div>
                <p>진입기 2</p>
              </div>
              <div className="article-callout">
                <p>마인 폭풍의 습격 → 마룡 파멸의 인도자</p>
              </div>
            </div>

            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>3</span>
                </div>
                <p>진입기 3</p>
              </div>
              <div className="article-callout">
                <p>마인 격파의 돌격 → 굴절 → 잡기</p>
              </div>
            </div>

            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>4</span>
                </div>
                <p>진입기 4</p>
              </div>
              <div className="article-callout">
                <p>마룡 역린 찌르기 → 흐름 구름끊기</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-31-section-6',
      title: '수정 및 특화',
      content: (
        <>
          {/* 특화 */}
          <div className="article-callout">
            <h3 id="guide-31-section-6-heading-1">특화</h3>
            <div>
              {/* 솔라레 특화 */}
              <div className="article-callout">
                <h4 id="guide-31-section-6-heading-2">솔라레 특화</h4>
                <div className="article-callout">
                  <GuideImage src="/tip-images/드라카니아특화1.png" alt="솔라레 특화" />
                </div>
                <div className="article-callout">
                  <p>
                    솔라레 특화는 요즘 회피가 많아서 회깎을 넣었다는거, 그리고 잡기 이후 바로 척결을
                    사용하여 슈아로 끌어가는 상황이 많아서 척결에 특화를 넣었습니다.
                  </p>
                </div>
              </div>

              {/* 범용성 특화 */}
              <div className="article-callout">
                <h4 id="guide-31-section-6-heading-3">범용성 특화</h4>
                <div className="article-callout">
                  <GuideImage src="/tip-images/드라카니아특화2.png" alt="범용성 특화" />
                </div>
                <div className="article-callout">
                  <p>
                    1:1콤보에 많이 들어가는 마룡 : 격파의 돌격 에 특화를 넣었었습니다, 다른 특화는
                    1:1 특화에 맞춰져있다고 보시면 될 것 같습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 수정 */}
          <div className="article-callout">
            <h3 id="guide-31-section-6-heading-4">수정</h3>
            <div className="article-grid">
              <div className="article-callout">
                <GuideImage src="/tip-images/드라카니아수정.png" alt="드라카니아 수정" />
              </div>
              <div className="article-callout">
                <div>
                  <div>
                    <p>
                      <strong>강 : 조합 마력의 수정 훔</strong> x4
                    </p>
                    <p>
                      <strong>진 : 명예로운 영광의 수정</strong> x2
                    </p>
                    <p>
                      <strong>명예로운 용기의 수정 - 올루카스</strong> x2
                    </p>
                    <p>
                      <strong>붉은 정령의 수정</strong> x2
                    </p>
                    <p>
                      <strong>붉은 전장의 수정 - 살무사</strong> x2
                    </p>
                    <p>
                      <strong>검붉은 송곳니 - 철갑</strong> x2
                    </p>
                    <p>
                      <strong>부패의 수정</strong>
                    </p>
                    <p>
                      <strong>해태의 눈물</strong>
                    </p>
                  </div>
                  <div>
                    <p>
                      무제한, 길드리그 - <strong>강피감 2개</strong>
                    </p>
                    <p>
                      그 외 필드 Pvp - <strong>강피감 1개</strong> 채용
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 라밤 및 본 스킬 */}
          <div className="article-callout">
            <h3 id="guide-31-section-6-heading-5">라밤 및 본 스킬</h3>
            <div className="article-grid">
              <div className="article-callout">
                <GuideImage src="/tip-images/드라카니아라밤.png" alt="드라카니아 라밤" />
              </div>
              <div className="article-callout">
                <div>
                  <p>
                    본 스킬은 <strong>마인 격파의돌격</strong> 사용
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 밸런스 세팅 */}
          <div className="article-callout">
            <h3 id="guide-31-section-6-heading-6">밸런스 세팅에 관한 생각</h3>
            <div className="article-callout">
              <p>
                각성 드라카니아에게 밸셋말고는 의미가 없다고 생각합니다. 이유로는 각성 드라카니아가
                cc를 거는 방법이 주로 2가지 (잡기와 마룡 역린찌르기)인데 딜러들에게 버티면서 cc각을
                보려면 피감세팅은 필수적입니다.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-31-section-7',
      title: '하고싶은말 및 꿀팁',
      content: (
        <>
          {/* 팁 1 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>1</span>
              </div>
              <h3 id="guide-31-section-7-heading-1">
                팁 1. Q가드 이후 마인 격파의 돌격시 날개 펼치는 모션 캔슬
              </h3>
            </div>
            <div>
              <p>
                Q가드 이후 마인 격파의 돌격(W+E) 사용시 날개를 펼친 후 격파의 돌격이 나가게 되는데
                Q가드 하실때 Q랑 같이 W를 누르고 계시다가 격파의 돌격을 사용하시면 날개 펼치는 모션
                없이 바로 스킬 사용이 가능합니다.
              </p>
              <div className="article-callout">
                <p>(가드를 그냥 QW로 하신다고 생각하시면 됩니다)</p>
              </div>
            </div>
          </div>

          {/* 팁 2 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>2</span>
              </div>
              <h3 id="guide-31-section-7-heading-2">
                팁 2. 굴절 및 용의발걸음은 최대한 길게 끌어주기
              </h3>
            </div>
            <div>
              <p>
                굴절이나 용의 발걸음 사용시 최대한 길게 끌어서 무적 및 슈퍼아머를 오래 유지한 후
                스킬을 사용하시는게 좋습니다.
              </p>
            </div>
          </div>

          {/* 팁 3 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>3</span>
              </div>
              <h3 id="guide-31-section-7-heading-3">팁 3. 전승 스킬 활용하여 슈아 유지하기</h3>
            </div>
            <div>
              <p>
                각성 스킬만으로는 슈아 유지를 하는데 한계가 있어서 전승 스킬도 활용하시는게
                좋습니다.
              </p>
              <div className="article-callout">
                <p>
                  전승 스킬 푸른맹습을 키슬롯에 등록하시면 각성폼에서 바로 전승으로 전환을 할 수
                  있으며 푸른맹습이 슈퍼아머에 경직cc가 달려있고 화면을 꺾으면서 사용하시면 상대방
                  전방가드 뒤쪽으로 들어가서 cc를 넣을 수 있기 때문에 잘 활용하시면 좋습니다.
                </p>
              </div>
              <div>
                <p>전승 슈아 굴리는 법:</p>
                <ul>
                  <li>• 푸른맹습 → 벼락불 작렬(Shift+RMB) → 각성폼 스왑</li>
                  <li>• 푸른맹습 → 마크타난의 손짓(Shift+LMB) → 각성폼 스왑</li>
                  <li>
                    • 마크타난의 비늘(키슬롯에 두고 사용, 상대방 잡기 있으면 사용시 잡히니까 주의)
                  </li>
                  <li>• 용의 강습(라밤스킬, Shift+Z)</li>
                </ul>
              </div>
              <div className="article-callout">
                <p>※ 전승 - 각성 스왑하는 방법</p>
                <p>스왑(C) 이후 용의발걸음 사용 시 스왑모션 캔슬 가능</p>
              </div>
            </div>
          </div>

          {/* 하고싶은 말 */}
          <div className="article-callout">
            <h3 id="guide-31-section-7-heading-4">하고싶은 말</h3>
            <div>
              <p>
                많이 부족하지만 읽어주셔서 감사드리고 궁금한 점 있으시다면 인게임 도비뚜밥
                귓해주시면 답 해드리겠습니다!
              </p>
            </div>
          </div>

          {/* 추천 자료 */}
          <div className="article-callout">
            <h3 id="guide-31-section-7-heading-5">
              <span>📚</span> 추천 유튜브
            </h3>
            <div>
              <div className="article-grid">
                <div className="article-callout">
                  <div>
                    <img
                      alt="YouTube"
                      src="/tip-images/Youtube.png.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <a
                      href="https://www.youtube.com/@Mirmulnir"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      미르뮬니르님
                    </a>
                  </div>
                  <p>YouTube 채널</p>
                </div>

                <div className="article-callout">
                  <div>
                    <img
                      alt="YouTube"
                      src="/tip-images/Youtube.png.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <a
                      href="https://www.youtube.com/@babibuubebo/videos"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Bubie님
                    </a>
                  </div>
                  <p>YouTube 채널</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-31-section-2-heading-1',
      title: '장점',
      section: 'guide-31-section-2',
    },
    {
      id: 'guide-31-section-2-heading-2',
      title: '단점',
      section: 'guide-31-section-2',
    },
    {
      id: 'guide-31-section-3-heading-1',
      title: '솔라레의 창 운영법',
      section: 'guide-31-section-3',
    },
    {
      id: 'guide-31-section-3-heading-2',
      title: '1. 드리블은 팀이 있는 쪽으로',
      section: 'guide-31-section-3',
    },
    {
      id: 'guide-31-section-3-heading-3',
      title: '2. 잡기 이후 무리하게 2cc를 넣을 필요 X',
      section: 'guide-31-section-3',
    },
    {
      id: 'guide-31-section-3-heading-4',
      title: '3. 아군 핑이 찍혔을때',
      section: 'guide-31-section-3',
    },
    {
      id: 'guide-31-section-3-heading-5',
      title: '4. 상대방에 잡기 캐릭터가 있을경우 슈퍼아머 유지시 주의점',
      section: 'guide-31-section-3',
    },
    {
      id: 'guide-31-section-3-heading-6',
      title: '거점전(RVR) 운영법',
      section: 'guide-31-section-3',
    },
    {
      id: 'guide-31-section-3-heading-7',
      title: '길드 리그 운영법',
      section: 'guide-31-section-3',
    },
    {
      id: 'guide-31-section-4-heading-1',
      title: '2CC 콤보',
      section: 'guide-31-section-4',
    },
    {
      id: 'guide-31-section-4-heading-2',
      title: '2.7CC 콤보',
      section: 'guide-31-section-4',
    },
    {
      id: 'guide-31-section-4-heading-3',
      title: '전승 스타트 2.7CC 콤보',
      section: 'guide-31-section-4',
    },
    {
      id: 'guide-31-section-6-heading-1',
      title: '특화',
      section: 'guide-31-section-6',
    },
    {
      id: 'guide-31-section-6-heading-2',
      title: '솔라레 특화',
      section: 'guide-31-section-6',
    },
    {
      id: 'guide-31-section-6-heading-3',
      title: '범용성 특화',
      section: 'guide-31-section-6',
    },
    {
      id: 'guide-31-section-6-heading-4',
      title: '수정',
      section: 'guide-31-section-6',
    },
    {
      id: 'guide-31-section-6-heading-5',
      title: '라밤 및 본 스킬',
      section: 'guide-31-section-6',
    },
    {
      id: 'guide-31-section-6-heading-6',
      title: '밸런스 세팅에 관한 생각',
      section: 'guide-31-section-6',
    },
    {
      id: 'guide-31-section-7-heading-1',
      title: '팁 1. Q가드 이후 마인 격파의 돌격시 날개 펼치는 모션 캔슬',
      section: 'guide-31-section-7',
    },
    {
      id: 'guide-31-section-7-heading-2',
      title: '팁 2. 굴절 및 용의발걸음은 최대한 길게 끌어주기',
      section: 'guide-31-section-7',
    },
    {
      id: 'guide-31-section-7-heading-3',
      title: '팁 3. 전승 스킬 활용하여 슈아 유지하기',
      section: 'guide-31-section-7',
    },
    {
      id: 'guide-31-section-7-heading-4',
      title: '하고싶은 말',
      section: 'guide-31-section-7',
    },
    {
      id: 'guide-31-section-7-heading-5',
      title: '추천 유튜브',
      section: 'guide-31-section-7',
    },
  ],
}
export default content
