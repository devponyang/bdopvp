import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/iframemain.png', alt: '전승 다크나이트' },
  sections: [
    {
      id: 'guide-14-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요 무제한 공/거점 및 필드 아르샤에서 재미있게 놀고있는 pvp 전문길드{' '}
            <strong>Ctrl</strong>의 <strong>iframe</strong>입니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-14-section-2',
      title: '전승 다크나이트 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-14-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <strong>지속가능한 무적 슈아 판정</strong>으로 드리블과 어그로를 이끌고 풀어냄이
                있습니다.
              </li>
              <li>
                <strong>순간 진입기와 한방이 강해</strong> 적 딜러를 암살하는데 특화되어있습니다.
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-14-section-2-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                몸이 <strong>매우 약합니다</strong>. 스치기만 해도 억소리가 나는데요, 슈아피감도
                10퍼이기 때문에 무적판정으로 모든 스킬들을 흘려야 합니다.
              </li>
              <li>
                당연히 모든 스킬들을 피할 수는 없으니{' '}
                <strong>피감수정을 통해 이를 어느정도 보완</strong>합니다.
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-14-section-3',
      title: '거점(RVR) / 솔라레·길드리그 운영법',
      content: (
        <>
          {/* 거점전 */}
          <div className="article-card">
            <h3 id="guide-14-section-3-heading-1">
              <span>⚔️</span> 거점전(RVR)
            </h3>

            <div>
              <div className="article-callout">
                <h4 id="guide-14-section-3-heading-2">🎯 극사이드 운영</h4>
                <p>
                  몸이 매우 약해 <strong>본대로 합류하는 순간 스킬 1~2개 쓰고 산화</strong>합니다.
                </p>
                <p>(물론 성채를 때려야 할 때는 스킬 한 개라도 쓰러 들어갑니다)</p>
              </div>

              <div className="article-callout">
                <h4 id="guide-14-section-3-heading-3">🗡️ 사이드 플레이</h4>
                <p>
                  사이드에서는 <strong>아군 쪽으로 들어오는 상대를 카운터</strong> 먹이거나
                </p>
                <p>
                  그 외엔 <strong>상대 원거리 딜러들 암살</strong>하러 갑니다.
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-14-section-3-heading-4">💫 암살 전략</h4>
                <p>
                  <strong>꼭 죽일필요는 없습니다.</strong> 전승 다크나이트는 스킬 선딜이 좀 긴
                  애들이 있어서 쓰다가 잡히거나 죽기 때문에
                </p>
                <p>
                  <strong>빠르게 2cc까지만 먹이고 굴릴 스킬들 최대한 굴리고 드리블</strong>합니다.
                  딸피라면 아군에게 맡깁시다..
                </p>
              </div>
            </div>
          </div>

          {/* 솔라레 */}
          <div className="article-card">
            <h3 id="guide-14-section-3-heading-5">
              <span>🌟</span> 솔라레
            </h3>

            <div>
              <div className="article-callout">
                <h4 id="guide-14-section-3-heading-6">🌪️ 드리블 핵심</h4>
                <p>
                  전승 다크나이트는 <strong>드리블이 매우 좋습니다</strong>(몸이 약해 무적으로 잘
                  회피..)
                </p>
                <p>
                  아군이 무언가를 할(잡기 또는 cc) 기회를 잡기 편하도록{' '}
                  <strong>상대 진영으로 들어가 무적 슈아 드리블</strong>을 합니다.
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-14-section-3-heading-7">🛡️ 카운터 플레이</h4>
                <p>아군이 찍히는 조합이라면 (아처, 레인저, 데드아이 등)</p>
                <p>
                  찍히는 <strong>아군 근처에서 카운터 스킬들</strong>을 써줍니다. (환영의덫, 기균,
                  운수레 등)
                </p>
              </div>
            </div>
          </div>

          {/* 길드리그 */}
          <div className="article-card">
            <h3 id="guide-14-section-3-heading-8">
              <span>🏆</span> 길드리그
            </h3>

            <div>
              <div className="article-callout">
                <h4 id="guide-14-section-3-heading-9">🎯 사이드 중심</h4>
                <p>
                  이 때는 <strong>상대진영에서 드리블한다는 생각은 버리고</strong>
                </p>
                <p>
                  <strong>사이드를 돌며 상대방이 본대에 집중을 못 하게</strong> 합니다.
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-14-section-3-heading-10">⚡ 후방 커버</h4>
                <p>
                  아군이 본대싸움을 한다면 <strong>사이드에서 적 딜러들 뒤를 봅니다</strong>.
                </p>
                <p>
                  아군이 잡기를 성공했다면{' '}
                  <strong>죽일 수 있는 상대가 아니면 커버오는 상대 딜러 뒤를 잡습니다</strong>.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-14-section-4',
      title: 'PVP 콤보',
      content: (
        <>
          {/* PVP 진입 콤보 */}
          <div className="article-card">
            <h3 id="guide-14-section-4-heading-1">
              <span>🚀</span> PVP 진입 콤보
            </h3>
            <div className="article-callout">
              <div>
                <p>
                  • <strong>공습</strong>으로 진입
                </p>
                <p>
                  • <strong>황마참</strong> 또는 <strong>황질 공습</strong>
                </p>
                <p>
                  • <strong>환영의덫 커맨드 + 공습</strong>
                </p>
              </div>
            </div>
          </div>

          {/* 1:1 전용 쉬운 콤보 */}
          <div className="article-card">
            <h3 id="guide-14-section-4-heading-2">
              <span>⚡</span> 1:1 전용 쉬운 콤보
            </h3>

            <div className="article-callout">
              <p>
                첫 cc가 어떻든 <strong>2cc는 고정</strong>입니다.
              </p>
            </div>

            <div className="article-callout">
              <p>
                <strong>비수</strong> → <strong>스둠</strong>(1타) → <strong>집행</strong> →{' '}
                <strong>처형</strong>(2cc)
              </p>
            </div>

            <div className="article-callout">
              <p>
                그리고 <strong>2cc뒤로는 남아있는 스킬들 조합</strong>하여 씁니다.
              </p>
            </div>

            <div className="article-callout">
              <p>
                <strong>황마참</strong> → <strong>정령의 유산</strong> → <strong>할광</strong>(적이
                일어날 즈음 뺍니다)
              </p>
            </div>

            <div className="article-card">
              <p>
                <strong>💡 참고:</strong> 첫 cc가 공습 흐름을 제외하고는{' '}
                <strong>스둠을 2타까지 씁니다</strong>.
              </p>
              <p>
                정령의 유산을 맨뒤로 뺀 이유는 <strong>다운스메쉬를 노려보기 위함</strong>입니다.
              </p>
            </div>
          </div>

          {/* 황마참 시작 */}
          <div className="article-card">
            <h3 id="guide-14-section-4-heading-3">
              <span>🔥</span> 황마참 시작
            </h3>
            <div className="article-callout">
              <p>
                <strong>황마참</strong> → <strong>할광</strong> 2타 → <strong>비수</strong> →{' '}
                <strong>스둠</strong> 1타 → <strong>집행</strong> <strong>처형</strong>
              </p>
            </div>
            <div className="article-card">
              <p>황마참은 넉다운으로 CC가 길기 때문에 위와 같은 루트로 2cc를 시작합니다.</p>
            </div>
          </div>

          {/* 2.7cc 콤보 - 에어어택 */}
          <div className="article-card">
            <h3 id="guide-14-section-4-heading-4">
              <span>💎</span> 2.7cc 콤보 - 에어어택 (풀 슈아 전가 판정)
            </h3>
            <div className="article-callout">
              <p>
                <strong>공습 흐름</strong> → <strong>스둠</strong> 1타 → <strong>할광</strong> 1타 →{' '}
                <strong>진할광</strong>(할광 도중 S 추가 입력)(넉백 1.7cc) → <strong>운수레</strong>
                (2.7cc) → <strong>황마참</strong> → <strong>정령의 유산</strong> →{' '}
                <strong>베디르의 광기</strong> → <strong>야상곡</strong> A
              </p>
            </div>
            <div className="article-card">
              <p>
                <strong>💡 Tip:</strong> 3분이나 흑정으로 공속이 빠르다면{' '}
                <strong>할광을 2타까지 쓰고 진할광</strong>으로 넘어갑니다.
              </p>
            </div>
          </div>

          {/* 2.7cc 콤보 - 넉다운 */}
          <div className="article-card">
            <h3 id="guide-14-section-4-heading-5">
              <span>💚</span> 2.7cc 콤보 - 넉다운
            </h3>
            <div className="article-callout">
              <p>
                <strong>공습 흐름</strong> → <strong>스둠</strong> 1타 → <strong>할광</strong> 1타 →{' '}
                <strong>진할광</strong>(할광 도중 S 추가 입력)(넉백 1.7cc) → <strong>황마참</strong>
                (2.7cc) → <strong>베디르의 광기</strong> → <strong>야상곡</strong> A →{' '}
                <strong>정령의 유산</strong> → <strong>환영의 덫</strong> →{' '}
                <strong>칠흑의 잿더미</strong>
              </p>
            </div>
            <div className="article-card">
              <p>
                마찬가지로 3분이나 흑정으로 공속이 빠르다면{' '}
                <strong>할광을 2타까지 쓰고 진할광</strong>으로 넘어갑니다.
              </p>
            </div>
          </div>

          {/* 추가 팁 */}
          <div className="article-card">
            <h3 id="guide-14-section-4-heading-6">
              <span>💡</span> 콤보 추가 팁
            </h3>
            <div>
              <div className="article-callout">
                <p>
                  • 공습 흐름 외 1cc는 <strong>할광을 2타 넣고</strong> 공속이 높다면{' '}
                  <strong>할광 풀타</strong>를 넣습니다.
                </p>
              </div>
              <div className="article-callout">
                <p>
                  • <strong>야상곡 D(맨몸 뒤잡 cc)</strong>을 잘 활용하시면 좋습니다.
                </p>
              </div>
              <div className="article-callout">
                <p>
                  • 야상곡은 <strong>슬롯으로 사용</strong>하거나,{' '}
                  <strong>베디르의 광기 이후 우클릭</strong>, <strong>공습흐름 이후 우클릭</strong>
                  으로 발동 가능합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 다수전 */}
          <div className="article-card">
            <h3 id="guide-14-section-4-heading-7">
              <span>⚔️</span> 다수전 콤보
            </h3>
            <div className="article-callout">
              <p>
                다수전에서는 <strong>슈아만 굴리는 게 가장 좋습니다</strong>.
              </p>
              <p>
                첫 cc 이후에는 <strong>베디르의 광기</strong>를 씁니다.
              </p>
            </div>

            <div className="article-callout">
              <p>공습흐름으로 cc 먹였을 때:</p>
              <p>
                <strong>베디르의 광기</strong> → <strong>기균</strong> or <strong>황마참</strong>
                으로 2cc
              </p>
              <p>(운수레는 쓰지 말 것 - 공습흐름은 cc 이후 흐름 스킬의 후딜이 김)</p>
            </div>

            <div className="article-callout">
              <p>공습흐름 외 첫 cc:</p>
              <p>
                <strong>베디르의 광기</strong> → <strong>황마참</strong> or <strong>운수레</strong>{' '}
                or <strong>공습흐름</strong> 2cc → <strong>정령의 유산</strong> or{' '}
                <strong>할광</strong> 마무리
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-14-section-5',
      title: '베디르의 독선',
      content: (
        <>
          {/* 독선 이미지 */}
          <div className="article-card">
            <div>
              <GuideImage src="/tip-images/독선.png" alt="베디르의 독선" />
            </div>
          </div>

          <div className="article-card">
            <div>
              <p>베디르의 독선이 이번에 버프 받았는데요,</p>
              <p>
                활성화시{' '}
                <strong>
                  운명의 수레바퀴, 베디르의 광기, 칠흑의 잿더미, 집행 스킬들의 데미지가 10% 증폭
                </strong>
                되지만 <strong>2초당 정신력 소모 200</strong>이라는 큰 리스크를 가지고 있습니다.
              </p>
              <p>
                소모할 정신력이 없을 경우엔 첫 시전시와 같은 캔슬할 수 없는 모션이 나오는데{' '}
                <strong>시전시는 슈퍼아머</strong>이지만 <strong>꺼질 때는 맨몸</strong>입니다.
              </p>
              <p>⚠️ 매우 하이리스크 로우리턴이죠.</p>

              <div className="article-callout">
                <h4 id="guide-14-section-5-heading-1">💡 연구 결과</h4>
                <p>
                  독선은 <strong>거점전에서는 좀 유용</strong>하고 그나마{' '}
                  <strong>제한에서 더욱 빛을 발할 것</strong>이라고 생각하는데요,
                </p>
                <p>
                  그 이유는 <strong>타격당 정신력 회복 수정을 2개 채용</strong>할 수
                  있고(무제한에서는 피감또는 인추 수정을 낍니다)
                </p>

                <div className="article-card">
                  <h5>정신력 회복 스킬</h5>
                  <div className="article-grid">
                    {/* 어스름 */}
                    <div className="article-callout">
                      <div>
                        <GuideImage src="/tip-images/어스름.png" alt="어스름" />
                      </div>
                      <p>어스름</p>
                      <p>정신력 회복 60</p>
                    </div>

                    {/* 연 어스름 */}
                    <div className="article-callout">
                      <div>
                        <GuideImage src="/tip-images/연어스름.png" alt="연 어스름" />
                      </div>
                      <p>연 : 어스름</p>
                      <p>정신력 회복 40</p>
                    </div>

                    {/* 스며드는 어둠 */}
                    <div className="article-callout">
                      <div>
                        <GuideImage src="/tip-images/강스둠.png" alt="스며드는 어둠" />
                      </div>
                      <p>강 : 스며드는 어둠</p>
                      <p>사용시 160 + 타격시 160</p>
                    </div>
                  </div>
                </div>

                <p>
                  <strong>독선을 키고 위 스킬들을 쿨마다 사용하시면 계속해서 유지 가능</strong>
                  합니다.
                </p>
                <p>
                  하지만{' '}
                  <strong>
                    스며드는 어둠에도 지구력이 닳아서 결국 지구력이 먼저 말라 유지하질 못하는데요
                  </strong>
                  .
                </p>
                <p>💡 독선을 키고 들어가서 스킬 굴리고 다시 꺼주는 식으로 플레이 하셔야합니다.</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-14-section-6',
      title: '드리블',
      content: (
        <>
          <div className="article-card">
            <div className="article-callout">
              <h4 id="guide-14-section-6-heading-1">핵심 원리</h4>
              <p>
                <strong>어스름을 무적 끝까지 써야합니다.</strong> 질질 끌어야 한다 할까요?
              </p>
              <p>한번에 어스름을 다 쓰지 말고</p>
            </div>

            <div className="article-callout">
              <p>
                <strong>어스름</strong> → 슈아 → <strong>어스름</strong> → 슈아
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-14-section-7',
      title: 'PvP 특화 및 수정',
      content: (
        <>
          {/* 특화 이미지 */}
          <div>
            <h3 id="guide-14-section-7-heading-1">⚡ 특화</h3>
            <p>
              특화는 <strong>귀찮아서 하나로만 통일</strong>합니다.
            </p>
            <div>
              <GuideImage src="/tip-images/iframe.png" alt="특화" />
            </div>
          </div>

          <div className="article-card">
            <h3 id="guide-14-section-7-heading-2">💠 수정 및 광명석</h3>

            {/* 수정 이미지 */}
            <div>
              <GuideImage src="/tip-images/iframecri.png" alt="수정" />
            </div>

            <div>
              <div className="article-callout">
                <h4 id="guide-14-section-7-heading-3">기본 세팅</h4>
                <p>
                  • 수정: <strong>피감수정</strong> 하나만 사용
                  <br />• 광명석: <strong>서리방패</strong> 사용
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-14-section-7-heading-4">적중이 필요하다면</h4>
                <p>
                  • <strong>강 적중 하나</strong> 추가
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-14-section-7-heading-5">깡공이 필요하다면</h4>
                <p>
                  • 광명석: <strong>부패 3개 + 오색빛 광명석</strong>
                </p>
                <p>
                  • 부족하면 피감수정까지 빼고 <strong>인추와 마칼 채용</strong>
                </p>
              </div>
            </div>

            {/* 군왕 재련석 */}
            <div className="article-callout">
              <h4 id="guide-14-section-7-heading-6">⚔️ 군왕 재련석</h4>
              <div className="article-grid">
                <div className="article-callout">
                  <p>모든 공격력</p>
                </div>
                <div className="article-callout">
                  <p>백어택</p>
                </div>
                <div className="article-callout">
                  <p>치명타 확률</p>
                </div>
                <div className="article-callout">
                  <p>모든 피해 감소</p>
                </div>
                <div className="article-callout">
                  <p>다운어택 피해량</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-14-section-8',
      title: '하고 싶은 말 / 꿀팁',
      content: (
        <>
          <div className="article-card">
            <p>너무나도 적을 게 많지만 다 적기엔 하루종일 적어야 하기도 하고...</p>
            <p>
              <strong>전승 다크나이트 보다 더 좋은 캐릭이 많지만 마음이 시키는 걸 해야죠!</strong>
            </p>
            <p>
              그러니 <strong>꿀팁만 적겠습니다.</strong>
            </p>
          </div>

          {/* 꿀팁들 */}
          <div>
            <div className="article-callout">
              <h4 id="guide-14-section-8-heading-1">🎯 환영의 덫 활용법</h4>
              <p>
                • <strong>슬롯 스킬 사용시</strong>: 어스름을 사용하지 않습니다. 대신 거리가 짧음
              </p>
              <p>
                • <strong>커맨드 사용 시</strong>: 멀리 가지만 어스름을 사용합니다
              </p>
              <p>
                • 그래서 연 어스름이 쿨중이라면{' '}
                <strong>환영의덫 커맨드로 사용할 때 시작시 맨몸</strong>입니다
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-14-section-8-heading-2">⚡ 버프 유지</h4>
              <p>
                <strong>비수의 공속</strong>과 <strong>스둠(space)의 공격력 버프</strong>를 상시
                유지 해줍니다.
              </p>
              <p>
                스둠은 모든 스킬 쓰고 space누르면 되는데 이때{' '}
                <strong>스둠 모션 나가자마자 캔슬 가능</strong>합니다.
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-14-section-8-heading-3">🎮 옆공습</h4>
              <p>
                옆공습은 <strong>연습만이 답</strong>입니다.. 팁이랄 게 없어요.
              </p>
              <p>
                상대방 옆으로 공습을 쓰는데{' '}
                <strong>올려칠 때 화면을 돌려서 상대방 옆을 칩니다</strong>..
              </p>
            </div>
          </div>

          <div>
            <p>읽어주셔서 감사합니다 🙏</p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-14-references',
      title: '작성자 자료와 참고 영상',
      content: (
        <>
          <GuideVideo
            src="https://www.youtube.com/embed/dkK2IzLs5Dc"
            title="YouTube video player"
          />
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-14-section-2-heading-1',
      title: '장점',
      section: 'guide-14-section-2',
    },
    {
      id: 'guide-14-section-2-heading-2',
      title: '단점',
      section: 'guide-14-section-2',
    },
    {
      id: 'guide-14-section-3-heading-1',
      title: '거점전(RVR)',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-2',
      title: '극사이드 운영',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-3',
      title: '사이드 플레이',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-4',
      title: '암살 전략',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-5',
      title: '솔라레',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-6',
      title: '드리블 핵심',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-7',
      title: '카운터 플레이',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-8',
      title: '길드리그',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-9',
      title: '사이드 중심',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-3-heading-10',
      title: '후방 커버',
      section: 'guide-14-section-3',
    },
    {
      id: 'guide-14-section-4-heading-1',
      title: 'PVP 진입 콤보',
      section: 'guide-14-section-4',
    },
    {
      id: 'guide-14-section-4-heading-2',
      title: '1:1 전용 쉬운 콤보',
      section: 'guide-14-section-4',
    },
    {
      id: 'guide-14-section-4-heading-3',
      title: '황마참 시작',
      section: 'guide-14-section-4',
    },
    {
      id: 'guide-14-section-4-heading-4',
      title: '2.7cc 콤보 - 에어어택 (풀 슈아 전가 판정)',
      section: 'guide-14-section-4',
    },
    {
      id: 'guide-14-section-4-heading-5',
      title: '2.7cc 콤보 - 넉다운',
      section: 'guide-14-section-4',
    },
    {
      id: 'guide-14-section-4-heading-6',
      title: '콤보 추가 팁',
      section: 'guide-14-section-4',
    },
    {
      id: 'guide-14-section-4-heading-7',
      title: '다수전 콤보',
      section: 'guide-14-section-4',
    },
    {
      id: 'guide-14-section-5-heading-1',
      title: '연구 결과',
      section: 'guide-14-section-5',
    },
    {
      id: 'guide-14-section-6-heading-1',
      title: '핵심 원리',
      section: 'guide-14-section-6',
    },
    {
      id: 'guide-14-section-7-heading-1',
      title: '특화',
      section: 'guide-14-section-7',
    },
    {
      id: 'guide-14-section-7-heading-2',
      title: '수정 및 광명석',
      section: 'guide-14-section-7',
    },
    {
      id: 'guide-14-section-7-heading-3',
      title: '기본 세팅',
      section: 'guide-14-section-7',
    },
    {
      id: 'guide-14-section-7-heading-4',
      title: '적중이 필요하다면',
      section: 'guide-14-section-7',
    },
    {
      id: 'guide-14-section-7-heading-5',
      title: '깡공이 필요하다면',
      section: 'guide-14-section-7',
    },
    {
      id: 'guide-14-section-7-heading-6',
      title: '군왕 재련석',
      section: 'guide-14-section-7',
    },
    {
      id: 'guide-14-section-8-heading-1',
      title: '환영의 덫 활용법',
      section: 'guide-14-section-8',
    },
    {
      id: 'guide-14-section-8-heading-2',
      title: '버프 유지',
      section: 'guide-14-section-8',
    },
    {
      id: 'guide-14-section-8-heading-3',
      title: '옆공습',
      section: 'guide-14-section-8',
    },
  ],
}
export default content
