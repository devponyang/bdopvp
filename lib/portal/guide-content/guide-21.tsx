import MissingGuideVideo from '@/components/portal/guide/MissingGuideVideo'
import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/약주.png', alt: '약주님' },
  sections: [
    {
      id: 'guide-21-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요! <strong>Ctrl</strong> 길드에서 노바를 플레이하고 있는 <strong>약주</strong>
            입니다.
            <br />
            전승 노바를 즐기시는 분들에게 조금이나마 도움이 되었으면 합니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-21-section-2',
      title: '전승 노바 클래스의 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-21-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <strong>1. 최신AI 시스템(소환수)</strong>
                <ul>
                  <li>
                    1) 크라툼의 깃든 병사가 소환되면, 적이 노바 근처에 있을 때 스스로 적을 포착하여
                    공격하고 경직(CC)을 걸어줍니다
                  </li>
                  <li>
                    2) 노바의 생명력이 40% 미만으로 내려가면, 악시안이 폭주 상태(쿨타임 2분, 지속
                    1분)가 되어 노바에게 접근하는 모든 적을 공격하고 CC기를 넣습니다.
                  </li>
                  <li>저항이 사라진 현재 메타에서는, 이는 노바의 가장 큰 장점으로 작용합니다.</li>
                </ul>
              </li>
              <li>
                <strong>2. 방막캐릭</strong>
                <ul>
                  <li>
                    노바는 검은사막에서 가장 단단한 캐릭터 중 하나로, 스킬 구조의 대부분이
                    슈퍼아머로 이루어져 있어 상대의 눈먼 CC가 잘 통하지 않습니다.
                  </li>
                </ul>
              </li>
              <li>
                <strong>3. 빙결을 통한 재미</strong>
                <ul>
                  <li>
                    노바는 세 가지의 빙결 스킬을 가지고 있으나, 일반적으로 두 가지만 사용합니다.
                  </li>
                  <li>(샛별의 결박: 빙결 4초 / 크라툼의 결박: 빙결 6초)</li>
                  <li>
                    빙결을 이용한 CC 초기화를 통해 상대에게 큰 압박과 무력감을 줄 수 있습니다.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-21-section-2-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                <strong>1. 무적기</strong>
                <ul>
                  <li>
                    노바의 무적기는 성릉sc 쿨 10초짜리 1개이기 때문에 잡기가 2개이거나, 한번에
                    강력하게 들어오는 딜에 약합니다.
                  </li>
                </ul>
              </li>
              <li>
                <strong>2. 태생의 답답함</strong>
                <ul>
                  <li>
                    여러 스킬을 동시에 사용하며 이동하는 운영이 가능하지만, 캐릭터 자체의 답답함은
                    개인에 따라 크게 체감됩니다.
                  </li>
                </ul>
              </li>
              <li>
                <strong>3. 잡기에 대한 의존도</strong>
                <ul>
                  <li>
                    안정적인 CC 및 콤보 연계를 위해서는 잡기 숙련도가 중요하며, 잡기가 실패할 경우
                    상대를 CC하거나 압박할 수 있는 수단이 제한적입니다
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-3',
      title: '스킬 이해 및 운용',
      content: (
        <>
          {/* 기본tip */}
          <div className="article-card">
            <h3 id="guide-21-section-3-heading-1">
              <span>🔧</span> 기본tip
            </h3>

            <div>
              {/* 항상 악시안 소환 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-2">1. 항상 악시안 소환하기</h4>
                <p>
                  <strong>
                    항상 se(한빙의 감옥)또는 q후에 시프트+스페이스(죽은자들의 왕)를 눌러 악시안
                    소환해 놓기
                  </strong>
                </p>
                <p>
                  소환이 되어있으면 내 캐릭터 옆에 하얀 구슬이 뜸, 1시간마다 초기화되며 채널이동,
                  죽음, 라운드 끝, 맵 이동 등 항상 구슬 확인
                </p>
              </div>

              {/* 잠구기 스킬들 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-3">2. 잠구기 스킬들</h4>
                <p>형벌, 빙판의 입맛춤, 회피이동 잠구기</p>
              </div>

              {/* 슬롯 스킬 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-4">3. 슬롯 스킬</h4>
                <p>명령:돌격, 강:일그러진 수호, 크라툼의 대지, 크라툼의 결박, 엄동의 방진</p>
              </div>

              {/* 라밤 스킬 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-5">4. 라밤</h4>
                <p>크라툼의 가시, 샛별의 결박, 크라툼의 대지</p>
              </div>
            </div>
          </div>

          {/* 이동기 */}
          <div className="article-card">
            <h3 id="guide-21-section-3-heading-6">
              <span>⚔️</span> 이동기
            </h3>

            <p>노바는 총 6가지의 이동기를 보유하고 있습니다.</p>

            <div className="article-callout">
              <p>
                <strong>WF(크라툼의 상승)</strong>이속버프,{' '}
                <strong>Shift+W+화면 돌리기(크라툼의 돌격)</strong>,{' '}
                <strong>SF(눈 위에 내린 서리)</strong>,
              </p>
              <p>
                <strong>SC(성릉)</strong> – 길게 눌렀다 떼기,{' '}
                <strong>Shift+X(크라툼의 가시)</strong>, <strong>Shift+방향키(기본 이동)</strong>
              </p>
              <p>
                이 이동기들을 쿨타임에 맞춰 순차적으로 사용하면서, 상대의 CC나 딜을 흘리고 잡기 또는
                CC로 역공을 노리는 운영이 필요합니다.
              </p>
            </div>
          </div>

          {/* 견제기 */}
          <div className="article-card">
            <h3 id="guide-21-section-3-heading-7">
              <span>🎯</span> 견제기
            </h3>

            <div className="article-callout">
              <p>
                <strong>se(한빙의 감옥), 슬롯(명령:돌격)</strong>
              </p>
              <p>
                2가지 스킬은 이동기에 섞어 이동기+se, 이동기+슬롯(돌격) 꾸준하게 상대방에게
                cc트라이를 해줍니다.
              </p>

              {/* 이동기견제기 영상 */}
              <div className="article-callout">
                <p>📹 이동기 견제 영상:</p>
                <div>
                  <MissingGuideVideo src="/tip-images/이동기견제.mp4">
                    브라우저가 비디오를 지원하지 않습니다.
                  </MissingGuideVideo>
                </div>
              </div>
            </div>
          </div>

          {/* 잡기 */}
          <div className="article-card">
            <h3 id="guide-21-section-3-heading-8">
              <span>🎣</span> 잡기
            </h3>

            <div className="article-callout">
              <p>
                <strong>응징의 올가미(WE)</strong>
              </p>
              <p>노바의 숙련도를 크게 끌어올려주는 핵심 스킬 운용법입니다.</p>
              <p>선딜을 없애주는 스킬 사용 후 잡기를 입력하면, 잡기가 빠르게 발동됩니다.</p>
              <p>예시) 명령: 돌격(슬롯), 한빙의 감옥(SE), 크라툼의 가시(Shift+X)등</p>
            </div>
          </div>

          {/* CC 스킬들 */}
          <div className="article-card">
            <h3 id="guide-21-section-3-heading-9">
              <span>⚡</span> CC 스킬들
            </h3>

            <div>
              {/* 넉다운 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-10">넉다운</h4>
                <ul>
                  <li>
                    • 매서운 호령(S좌) 1타넉다운 - 상대방이 멀리서 cc에 걸린 경우 사용 (근거리에서는
                    맞지 않습니다)
                  </li>
                  <li>
                    • 몰아치는샛별(쉽E) 마지막타격 넉다운 - 일반적으로 콤보에 넣지는 않으며
                    슈아유지+ 생명력 회복
                  </li>
                  <li>
                    • 보복하는 샛별(w우) 3타넉다운 - 상대방이 멀리서 cc에 걸린 경우 사용
                    (근거리에서는 맞지 않습니다)
                  </li>
                </ul>
              </div>

              {/* 띄우기 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-11">띄우기</h4>
                <ul>
                  <li>
                    • 얼음가시(S우)1타 띄우기 - 일반적인 콤보에 제일 많이 쓰이는 2CC 넣는
                    스킬입니다.(맨몸 주의)
                  </li>
                  <li>• 응징의올가미(WE)잡기성공시 띄우기 - 잡기</li>
                  <li>
                    • 몰아치는사제(SHIFT+좌)마지막타격시 띄우기 - 솔라레 콤보에 쓰이는 2CC 슈아기
                    입니다.
                  </li>
                  <li>
                    • 한빙의감옥(SE) 친위대 타격성공시 띄우기 - 이동기+ 견제 항상 써야하는 스킬
                  </li>
                </ul>
              </div>

              {/* 기절 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-12">기절</h4>
                <ul>
                  <li>
                    • 눈위에 내린서리 (SF) 1타기절 - 이동기 후 sf를 눌러 상대방에게 카운터 칠 때
                    많이 쓰이며, 노바 cc중에 제일 안정적으로 cc를 넣을 수 있는 스킬입니다.
                  </li>
                </ul>
              </div>

              {/* 경직 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-13">경직</h4>
                <ul>
                  <li>• 보복하는 샛별(W우)1,2타 경직 - 잘 안 쓰이는 스킬</li>
                  <li>
                    • 마주하는 어둠(방호 사용 중 F)경직 - 이 스킬은 치명타 확률을 50% 증가시키므로,
                    1CC 이후 콤보 연계 시 핵심적으로 사용됩니다.
                  </li>
                  <li>
                    • 돌격(슬롯)타격 성공 시 경직 - 상대방 뒤에서 병사가 경직 스킬을 사용해 적을
                    제압하는 스킬입니다.
                  </li>
                </ul>
              </div>

              {/* 빙결 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-14">빙결</h4>
                <ul>
                  <li>• 한빙의감옥(SE) 타격 성공 시 빙결 - 빙결보다는 띄우기 cc용</li>
                  <li>• 병탄할 표적(슬롯) - 슬롯에 넣어 쓸 수 있지만 활용도가 낮습니다.</li>
                  <li>• 크라툼의 결박(슬롯) - 6초간 빙결</li>
                  <li>• 샛별의 결박(쉽Z) - 4초간 빙결</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 디버프/버프/피흡/무적/슈아/전가 */}
          <div className="article-card">
            <h3 id="guide-21-section-3-heading-15">
              <span>⚙️</span> 기타 스킬 효과들
            </h3>

            <div className="article-grid">
              {/* 디버프 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-16">디버프</h4>
                <ul>
                  <li>• 얼어붙는 대지(쉽+c) - 5초간 공속, 시전속도 감소 15% 감소</li>
                  <li>
                    • 부름받은 보병(스페이스) - 친위대 타격 성공 시 10초간 모든 방어 20% 감소, 5초간
                    이속 20% 감소
                  </li>
                  <li>
                    • 죽은 자들의 왕(시프트 스페이스) - 타격 성공 시 10초간 모든 방어 20% 감소,
                    6초간 2초마다 200 고통 피해, 지상 소환 타격 성공 시 기절
                  </li>
                  <li>• 크라툼의 가시(쉽X) - 5초간 이속 감소 15%, 공속, 시전속도 15% 감소</li>
                </ul>
              </div>

              {/* 버프 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-17">버프</h4>
                <ul>
                  <li>• 얼음가시(S우) - 시전속도 +10%</li>
                  <li>• 크라툼의상승(WF) - 이동 +10%</li>
                  <li>• 마주하는어둠(방호상태f) - 치확 50%</li>
                  <li>• 강:혹한의 어둠(쉽+우) - 10초간 모공 28 증가</li>
                  <li>
                    • 흑정령:한빙의감옥 - 치확 30%, 1분간 모공+30, 시전속도 증가 25%, 낙마가능
                  </li>
                  <li>• 크라툼의결박 - 2초간 모든 저항 무시 증가 30%</li>
                  <li>
                    • 일그러진 수호 - 생명 회복 1500, 생증 750, 30초간 모방 50%, 방어 감소 효과 적용
                    무시 + 삭제
                  </li>
                </ul>
              </div>

              {/* 피흡 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-18">피흡</h4>
                <ul>
                  <li>• 몰아치는샛별(쉽E) - 생명 +120</li>
                  <li>• 매서운호령(S좌) - 악시안 소환 중 타격 성공 시 타격마다 생명 +71</li>
                  <li>• 얼음가시(S우) - 악시안 소환 중 타격 성공 시 타격마다 생명 +105</li>
                  <li>• 덮치는고리(WC) - 악시안 소환 중 타격 성공 시 타격마다 생명 +125</li>
                  <li>• 여제의징벌(e) - 타격마다 생명력 +160</li>
                </ul>
              </div>

              {/* 무적/슈아/전가 */}
              <div className="article-callout">
                <h4 id="guide-21-section-3-heading-19">무적/슈아/전가</h4>
                <ul>
                  <li>• 무적 - 성릉(후방이동무적)</li>
                  <li>
                    • 슈아 - 크라툼의 돌격, 몰아치는샛별, 눈위에내린서리, 크라툼의상승,
                    당겨가르는샛별, 얼어붙는대지, 몰아치는사제, 혹한의어둠, 격돌하는기병, 옭아매는
                    얼음가시, 여제의징벌, 성릉, 일그러진 수호
                  </li>
                  <li>• 전가 - 덮치는고리, 명령:돌격, 크라툼의 가시</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-4',
      title: '연계기',
      content: (
        <>
          <div className="article-card">
            <p>노바 스킬에는 기본적으로 선딜이 존재합니다.</p>
            <p>
              다만 히든 커맨드를 활용하면, 연계기를 알고 있는 유저는 선딜 없이 스킬을 즉시 사용할 수
              있습니다.
            </p>
            <p>
              모든 연계기를 외울 필요는 없으며, 단순히 "이런 방식으로 사용할 수 있다"는 정도만
              인지하면 됩니다.
            </p>

            <div>
              <GuideImage src="/tip-images/노바연계기1.jpg" alt="노바 연계기 가이드 1" />
              <GuideImage src="/tip-images/노바연계기2.jpg" alt="노바 연계기 가이드 2" />
              <GuideImage src="/tip-images/노바연계기3.jpg" alt="노바 연계기 가이드 3" />
              <GuideImage src="/tip-images/노바연계기4.jpg" alt="노바 연계기 가이드 4" />
              <GuideImage src="/tip-images/노바연계기5.jpg" alt="노바 연계기 가이드 5" />
            </div>

            <div className="article-callout">
              <p>출처 : 악동 길드 에끌 님</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-5',
      title: '한빙의 감옥 활용법',
      content: (
        <>
          <div className="article-card">
            <p>전노의 꽃 소환수 악시안 활용 법 입니다.</p>
            <p>초급님께서 나오신 장인 초대석에서 자세하게 다루어 보시면 도움이 많이 될겁니다.</p>

            <div>
              <GuideVideo
                src="https://www.youtube.com/embed/h456KnidlpU?si=WUuPHcp6gN-DL4kj&start=492"
                title="장인초대석 초급님 노바 가이드"
              />
            </div>

            <div className="article-callout">
              <p>
                출처 :{' '}
                <a
                  href="https://www.youtube.com/channel/UCaVKbCOb0EvZ7u_QP4-10Fw"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  박짱쿠 유튜브
                </a>{' '}
                - 전승 노바 장인 초대석
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-6',
      title: '거점(RVR) / 솔라레or길드리그(소수전) 운영법',
      content: (
        <>
          <div className="article-grid">
            {/* 거점(RVR)운영법 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>⚔️</span>
                </div>
                <h3 id="guide-21-section-6-heading-1">거점(RVR) 운영법</h3>
              </div>

              <div>
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>1</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-2">본대 방셋</h4>
                      <p>
                        노바는 앞라인에서 아군 딜러들이 안정적으로 딜을 넣을 수 있게 버텨주는 역할을
                        합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>2</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-3">성채 점령 후</h4>
                      <p>
                        부활 무적 상태가 된 노바는, 성채를 공격 중인 적 딜러진에 진입해 CC기와
                        빙결로 상대를 무력화시키는 역할을 합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>3</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-4">부속조, 수비조, 불퇴조</h4>
                      <p>
                        역할을 부여받은 경우, 들어오는 꼬장 캐릭을 잡아 우리 딜러들이 처치할 수
                        있도록 서포팅해야 합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>4</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-5">꼬장조</h4>
                      <p>
                        역할을 부여 받은 경우 방셋 또는 밸셋으로 세팅 후 상대 불퇴쪽에서 끊임없이
                        견제 하시면 됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>⚠</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-6">제한 거점,공성</h4>
                      <p>
                        노바의 장점들이 모두 사라진다고 생각하여 제한 거점,공성에서는 전승노바는
                        좋은 직업이 아니라고 생각합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 솔라레 운영법 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>🌟</span>
                </div>
                <h3 id="guide-21-section-6-heading-7">솔라레 운영법</h3>
              </div>

              <div>
                <div className="article-callout">
                  <div>
                    <h4 id="guide-21-section-6-heading-8">4훔 또는 8훔 세팅</h4>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>1</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-9">아군 보호</h4>
                      <p>
                        노바는 아군이 죽으면 캐리하기 어려운 캐릭입니다. 따라서 아군을 보호하면서
                        상대의 빈틈을 노려 잡거나, CC기에 맞춰 아군 딜러가 딜을 넣을 수 있도록
                        도와주는 역할이 중요합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>2</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-10">잡기 판정</h4>
                      <p>
                        노바는 혼자 남으면 캐리하기 어렵지만, 아군이 함께 있을 경우에는 충분히
                        캐리할 수 있는 캐릭터입니다. 이는 노바의 잡기 판정이 매우 우수하기
                        때문입니다.
                      </p>
                      <div className="article-callout">
                        <p>💡 잡기 성공 후 핑을 찍어 아군에게 알리는 것이 중요합니다!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>3</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-11">3분 버프 활용</h4>
                      <p>
                        예전에는 3분 버프를 긴급 탈출이 빠진 후에 사용했지만, 제가 운영하는 방식은
                        다릅니다. 게임 시작 한 뒤 바로 3분 버프를 켜 상대의 어그로를 끌어 자신이
                        잡히더라도, 그 사이에 아군이 적의 뒤를 치거나 CC를 연계해 상대의 긴급 탈출을
                        빼내는 식으로 운영합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>4</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-12">조합 분석</h4>
                      <p>
                        상대 팀의 조합에 따라 노바의 역할을 신중하게 판단하고, 그에 맞는 운영 방식을
                        고민하며 플레이합니다.
                      </p>
                      <div className="article-callout">
                        <p>🎯 게임 시작 전 조합을 보며 그림 짜기</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 길드리그 운영법 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>🏆</span>
                </div>
                <h3 id="guide-21-section-6-heading-13">길드리그 운영법</h3>
              </div>

              <div>
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>1</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-14">포지션</h4>
                      <p>노바의 포지션은 크게 두 가지입니다.</p>
                      <ul>
                        <li>
                          <span>•</span>
                          <span>상대 극딜러를 끝까지 따라가서 끊거나 CC 넣기</span>
                        </li>
                        <li>
                          <span>•</span>
                          <span>아군 사이드 라인을 지키면서 딜 넣는 적을 끊거나 CC 넣기</span>
                        </li>
                      </ul>
                      <div className="article-callout">
                        <p>
                          💡 대부분의 상황에서는 2번 포지션 위주로 플레이하시는 걸 추천드립니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>2</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-15">세팅 및 운영</h4>
                      <p>
                        방셋 또는 밸셋으로 세팅한 뒤, 핑 색상을 정하고 상대 원딜이나 극딜러를
                        우선적으로 잡은 다음 핑을 찍어, 아군 딜러들이 상대를 처치할 수 있도록
                        지원합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>3</span>
                    </div>
                    <div>
                      <h4 id="guide-21-section-6-heading-16">샤이 대처</h4>
                      <p>
                        샤이가 구름막이나 버프·디버프 스킬을 쓰는 타이밍에 노바의 3분 스킬을
                        사용하면, 들어오는 약화 효과를 지우면서 샤이를 끊어 버프나 디버프를 못 쓰게
                        만들 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-7',
      title: 'PVP 콤보',
      content: (
        <>
          {/* 기본콤보 */}
          <div className="article-callout">
            <h3 id="guide-21-section-7-heading-1">기본콤보 (초급님 콤보)</h3>

            <div>
              <div>
                <div>
                  <div>응징의 올가미</div>
                  <div>WE(1CC)</div>
                </div>
                <span>→</span>
                <div>
                  <div>마주하는 어둠</div>
                  <div>F(치확)</div>
                </div>
                <span>→</span>
                <div>
                  <div>옭아매는 얼음가시</div>
                  <div>F</div>
                </div>
                <span>→</span>
                <div>
                  <div>격돌하는 기병</div>
                  <div>SHIFT+Q</div>
                </div>
                <span>→</span>
                <div>
                  <div>얼음가시</div>
                  <div>S+RMB(2CC)</div>
                </div>
                <span>→</span>
                <div>
                  <div>혹한의 어둠</div>
                  <div>SHIFT+RMB</div>
                </div>
                <span>→</span>
                <div>
                  <div>몰아치는 사제</div>
                  <div>SHIFT+좌</div>
                </div>
                <span>→</span>
                <div>
                  <div>크라툼의 대지</div>
                  <div>슬롯</div>
                </div>
                <span>→</span>
                <div>
                  <div>얼어붙는 대지</div>
                  <div>SHIFT+C</div>
                </div>
                <span>→</span>
                <div>
                  <div>성릉</div>
                  <div>SC</div>
                </div>
              </div>
            </div>

            {/* 기본콤보 비디오 */}
            <div>
              <div>
                <MissingGuideVideo src="/tip-images/기본콤보.mp4">
                  브라우저가 비디오를 지원하지 않습니다.
                </MissingGuideVideo>
              </div>
            </div>
          </div>

          {/* 원거리cc 콤보 */}
          <div className="article-callout">
            <h3 id="guide-21-section-7-heading-2">원거리cc (nigrum님 콤보)</h3>
            <div className="article-callout">
              <p> ex) 멀리서 경직 걸리거나 cc걸린 경우</p>
            </div>

            <div>
              <div>
                <div>
                  <div>원거리경직</div>
                  <div>S좌(1CC)</div>
                </div>
                <span>→</span>
                <div>
                  <div>매서운 호령</div>
                  <div>SHIFT+F</div>
                </div>
                <span>→</span>
                <div>
                  <div>옭아매는 얼음가시</div>
                  <div>SHIFT+Q</div>
                </div>
                <span>→</span>
                <div>
                  <div>혹한의 어둠</div>
                  <div>SHIFT+우</div>
                </div>
                <span>→</span>
                <div>
                  <div>몰아치는 사제</div>
                  <div>SHIFT+좌(2CC)</div>
                </div>
                <span>→</span>
                <div>
                  <div>크라툼의 대지</div>
                  <div>슬롯</div>
                </div>
                <span>→</span>
                <div>
                  <div>얼어붙는 대지</div>
                  <div>SHIFT+C</div>
                </div>
              </div>
            </div>
          </div>

          {/* 솔라레 콤보 */}
          <div className="article-callout">
            <h3 id="guide-21-section-7-heading-3">솔라레 콤보(초급님 콤보, 공속 7퍼이상)</h3>

            <div>
              <div>
                <div>
                  <div>응징의올가미</div>
                  <div>W+E</div>
                </div>
                <span>→</span>
                <div>
                  <div>얼음안개</div>
                  <div>SHIFT+좌우(이동기)</div>
                </div>
                <span>→</span>
                <div>
                  <div>옭아매는 얼음가시</div>
                  <div>SHIFT+F</div>
                </div>
                <span>→</span>
                <div>
                  <div>격돌하는기병</div>
                  <div>SHIFT+Q</div>
                </div>
                <span>→</span>
                <div>
                  <div>혹한의어둠</div>
                  <div>SHIFT+우</div>
                </div>
                <span>→</span>
                <div>
                  <div>몰아치는 사제(띄우기)</div>
                  <div>SHIFT+좌</div>
                </div>
                <span>→</span>
                <div>
                  <div>얼어붙는 대지</div>
                  <div>SHIFT+C</div>
                </div>
              </div>
            </div>
          </div>

          {/* 빙결콤 */}
          <div className="article-card">
            <h3 id="guide-21-section-7-heading-4">빙결콤</h3>
            <div className="article-callout">
              <p>⚠️ 마주하는 어둠후에 샛별의 결박을 쓰셔야 빙결이 걸립니다</p>
            </div>

            <div>
              <div>
                <div>
                  <div>응징의 올가미</div>
                  <div>W+E(1CC)</div>
                </div>
                <span>→</span>
                <div>
                  <div>마주하는 어둠</div>
                  <div>경직</div>
                </div>
                <span>→</span>
                <div>
                  <div>샛별의결박</div>
                  <div>빙결(cc초기화)</div>
                </div>
                <span>→</span>
                <div>
                  <div>얼음가시</div>
                  <div>1CC(띄우기)</div>
                </div>
                <span>→</span>
                <div>
                  <div>마주하는 어둠</div>
                  <div>경직</div>
                </div>
                <span>→</span>
                <div>
                  <div>크라툼의 결박</div>
                  <div>빙결(cc초기화)</div>
                </div>
                <span>→</span>
                <div>
                  <div>눈위에내린 서리</div>
                  <div>SF(1CC)</div>
                </div>
                <span>→</span>
                <div>
                  <div>마주하는 어둠</div>
                  <div>경직</div>
                </div>
                <span>→</span>
                <div>
                  <div>응징의 올가미</div>
                  <div>2CC</div>
                </div>
                <span>→</span>
                <div>
                  <div>옭아매는 얼음가시</div>
                  <div>SHIFT+F</div>
                </div>
                <span>→</span>
                <div>
                  <div>격돌하는기병</div>
                  <div>SHIFT+Q</div>
                </div>
                <span>→</span>
                <div>
                  <div>혹한의 어둠</div>
                  <div>SHIFT+우</div>
                </div>
                <span>→</span>
                <div>
                  <div>몰아치는 사제</div>
                  <div>SHIFT+좌</div>
                </div>
                <span>→</span>
                <div>
                  <div>크라툼의 대지</div>
                  <div>슬롯</div>
                </div>
              </div>
            </div>

            {/* 빙결콤보 비디오 */}
            <div>
              <div>
                <MissingGuideVideo src="/tip-images/빙결콤보.mp4">
                  브라우저가 비디오를 지원하지 않습니다.
                </MissingGuideVideo>
              </div>
            </div>

            <div className="article-callout">
              <h4 id="guide-21-section-7-heading-5">빙결콤 주의점과 tip</h4>
              <div>
                <p>
                  <strong>1. 빙결 스킬은 상대의 CC를 초기화시켜주는 효과</strong>가 있습니다. 다만,
                  빙결을 맞은 적에게 다른 CC 스킬을 사용하면 빙결 효과는 사라집니다.
                </p>
                <p>따라서 빙결은 다음과 같은 상황에서 시간을 벌기 위한 용도로 사용합니다:</p>
                <ul>
                  <li>• 내가 딜을 넣을 스킬이 쿨타임 중일 때</li>
                  <li>• 주변에 아군이 없을때</li>
                  <li>• 멀리서 병사나 악시안이 CC를 넣는 경우</li>
                </ul>
                <p>
                  <strong>2. 악시안이 폭주 상태일 때</strong>(내 체력이 40% 이하, 캐릭터 옆에 빨간
                  구슬이 표시됨) 악시안이 자동으로 적에게 CC를 넣습니다. 이 경우 빙결을 사용해도
                  자동 CC가 발동하기 때문에 빙결 효과가 풀립니다.
                </p>
                <p>
                  <strong>3. 빙결콤 사이에 cc또는 딜 스킬은 편한대로 바꿔서 쓰셔도 됩니다.</strong>
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-8',
      title: '각캐릭간의 1:1 상성(주관적)',
      content: (
        <>
          <div className="article-card">
            <p>다음은 작성자의 주관적인 의견입니다. 실제 경험과 상황에 따라 다를 수 있습니다.</p>

            <div className="article-grid">
              {/* 유리한 상성 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>✓</span>
                  </div>
                  <h4 id="guide-21-section-8-heading-1">유리한 상성</h4>
                </div>

                <div>
                  {/* 워리어 */}
                  <div className="article-callout">
                    <img
                      alt="워리어"
                      src="/class-icons/warrior.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>워리어</div>
                      <div>잡기 싸움, 원거리 잡기인 노바 유리</div>
                    </div>
                  </div>

                  {/* 소서러 */}
                  <div className="article-callout">
                    <img
                      alt="소서러"
                      src="/class-icons/sor.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>소서러</div>
                      <div>원잡 쓸 때 카운터만 안당하면 노바 유리</div>
                    </div>
                  </div>

                  {/* 자이언트 */}
                  <div className="article-callout">
                    <img
                      alt="자이언트"
                      src="/class-icons/jai.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>자이언트</div>
                      <div>잡기 싸움, 프뚫+ 마컨이 안되는 현상황에서는 노바 유리</div>
                    </div>
                  </div>

                  {/* 매화 */}
                  <div className="article-callout">
                    <img
                      alt="매화"
                      src="/class-icons/mahwa.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>매화</div>
                      <div>무사랑 비슷하지만, 딜은 더 약해서 노바가 유리</div>
                    </div>
                  </div>

                  {/* 위자드 */}
                  <div className="article-callout">
                    <img
                      alt="위자드"
                      src="/class-icons/wizard.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>위자드</div>
                      <div>가끔 이동기 쓰고 훅 들어와서 잡는 위자드가 존재하지만 노바가 유리</div>
                    </div>
                  </div>

                  {/* 위치 */}
                  <div className="article-callout">
                    <img
                      alt="위치"
                      src="/class-icons/witch.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>위치</div>
                      <div>노바가 유리</div>
                    </div>
                  </div>

                  {/* 닌자 */}
                  <div className="article-callout">
                    <img
                      alt="닌자"
                      src="/class-icons/ninja.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>닌자</div>
                      <div>3분 킨 닌자에게는 많이 어렵고 힘듬</div>
                    </div>
                  </div>

                  {/* 아처 */}
                  <div className="article-callout">
                    <img
                      alt="아처"
                      src="/class-icons/archer.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>아처</div>
                      <div>도망 잘 다니는 아처는 슈아기 유지하면서 따라 가서 죽이는게 중요</div>
                    </div>
                  </div>

                  {/* 샤이 */}
                  <div className="article-callout">
                    <img
                      alt="샤이"
                      src="/class-icons/shai.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>샤이</div>
                      <div>빙결 콤으로 가지고 놀기 좋음</div>
                    </div>
                  </div>

                  {/* 가디언 */}
                  <div className="article-callout">
                    <img
                      alt="가디언"
                      src="/class-icons/gadi.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>가디언</div>
                      <div>각디언은 무적기가 많아 잡기 힘든 편이지만 노바가 유리하다고 생각</div>
                    </div>
                  </div>

                  {/* 하사신 */}
                  <div className="article-callout">
                    <img
                      alt="하사신"
                      src="/class-icons/hasasin.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>하사신</div>
                      <div>
                        전사신 딜은 좋지만 어렵지 않고, 각사신은 원잡 판정이 좋아 각사신이 유리
                      </div>
                    </div>
                  </div>

                  {/* 커세어 */}
                  <div className="article-callout">
                    <img
                      alt="커세어"
                      src="/class-icons/cosair.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>커세어</div>
                      <div>
                        전커는 날파리 같은 존재 하지만 떼쟁 때는 가드를 부시기 때문에 피하는게 좋음,
                        각커는 유사 잡기로 잡는 경우가 있지만 노바가 유리
                      </div>
                    </div>
                  </div>

                  {/* 드라카니아 */}
                  <div className="article-callout">
                    <img
                      alt="드라카니아"
                      src="/class-icons/draca.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>드라카니아</div>
                      <div>
                        전드는 스킬 쓰는거 쳐다보다 잡으면 쉬움, 각드는 잡혀도 콤보에 전가 스킬이
                        있기때문에 잘 넘어져서 노바가 유리
                      </div>
                    </div>
                  </div>

                  {/* 우사 */}
                  <div className="article-callout">
                    <img
                      alt="우사"
                      src="/class-icons/usa.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>우사</div>
                      <div>
                        전우는 할거 하라고 두다가 스킬 쓸 때 잡으면 아주 쉬움, 각우는 잘 도망
                        다니기때문에 잡기각 잘 봐야함 하지만 딜 자체를 흘릴 수 있어서 노바가 유리
                      </div>
                    </div>
                  </div>

                  {/* 매구 */}
                  <div className="article-callout">
                    <img
                      alt="매구"
                      src="/class-icons/magu.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>매구</div>
                      <div>
                        전구는 멀리서 딜 하는걸 견제기로 cc넣고 분신 예측을 잘해서 잡으면 쉬운편,
                        각구는 들어오는거 보면서 카운터 잡기로 잡으면 쉬움
                      </div>
                    </div>
                  </div>

                  {/* 도사 */}
                  <div className="article-callout">
                    <img
                      alt="도사"
                      src="/class-icons/dosa.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>도사</div>
                      <div>
                        전도는 잘 잡히지는 않지만 딜을 흘릴 수 있어 슈아 유지 하다 잡으면 승리,
                        각도도 비슷
                      </div>
                    </div>
                  </div>

                  {/* 데드아이 */}
                  <div className="article-callout">
                    <img
                      alt="데드아이"
                      src="/class-icons/dead.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>데드아이</div>
                      <div>
                        도사만큼 잡기 힘들진 않지만, 딜하면서 흘릴 수있는 직업이라 많이 아픈편
                        하지만 노바가 유리
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 반반 상성 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>⚖</span>
                  </div>
                  <h4 id="guide-21-section-8-heading-2">반반 상성</h4>
                </div>

                <div>
                  {/* 금수랑 */}
                  <div className="article-callout">
                    <img
                      alt="금수랑"
                      src="/class-icons/taimer.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>금수랑</div>
                      <div>콤보 딜이 생각 보다 쎄서, 잡기 싸움이 중요 반반 싸움</div>
                    </div>
                  </div>

                  {/* 다크나이트 */}
                  <div className="article-callout">
                    <img
                      alt="다크나이트"
                      src="/class-icons/darknight.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>다크나이트</div>
                      <div>
                        딜이 워낙 쎄서 카운터 치는거 조심하면서 거리 유지 후에 잡기! 반반 싸움
                      </div>
                    </div>
                  </div>

                  {/* 미스틱 */}
                  <div className="article-callout">
                    <img
                      alt="미스틱"
                      src="/class-icons/mistic.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>미스틱</div>
                      <div>잡기 싸움이며 전미는 50:50, 각미는 60:40으로 각미가 유리</div>
                    </div>
                  </div>

                  {/* 세이지 */}
                  <div className="article-callout">
                    <img
                      alt="세이지"
                      src="/class-icons/saji.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>세이지</div>
                      <div>
                        전세는 맵 보면서 이동하는 위치 확인 하면 쉽고, 각세는 잡기 싸움+ 각세
                        뒤잡아서 cc넣는게 중요! 반반 싸움
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 불리한 상성 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>✗</span>
                  </div>
                  <h4 id="guide-21-section-8-heading-3">불리한 상성</h4>
                </div>

                <div>
                  {/* 레인저 */}
                  <div className="article-callout">
                    <img
                      alt="레인저"
                      src="/class-icons/ranger.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>레인저</div>
                      <div>
                        전렝은 따라가면서 패면 쉽고, 각렝은 무적기 많은 각렝이 더 유리하다고 생각
                      </div>
                    </div>
                  </div>

                  {/* 무사 */}
                  <div className="article-callout">
                    <img
                      alt="무사"
                      src="/class-icons/musa.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>무사</div>
                      <div>
                        3분 한방딜이 너무 쎄, 잡기 하는데 각을 많이 봐야하며, 잡기가 빠진 상태에서
                        들어오면 한번에 죽을 수도 있음. 거리유지 핵심!
                      </div>
                    </div>
                  </div>

                  {/* 발키리 */}
                  <div className="article-callout">
                    <img
                      alt="발키리"
                      src="/class-icons/valc.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>발키리</div>
                      <div>잡기싸움, 생각 보다 각발 보다 전발이 더 상대하기 어려움</div>
                    </div>
                  </div>

                  {/* 쿠노이치 */}
                  <div className="article-callout">
                    <img
                      alt="쿠노이치"
                      src="/class-icons/kuno.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>쿠노이치</div>
                      <div>쿠노이치는 쿠노이치 압승</div>
                    </div>
                  </div>

                  {/* 격투가 */}
                  <div className="article-callout">
                    <img
                      alt="격투가"
                      src="/class-icons/fighter.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>격투가</div>
                      <div>이동기가 빠르며 잡기 2개 달린 각격은 각격이 유리</div>
                    </div>
                  </div>

                  {/* 란 */}
                  <div className="article-callout">
                    <img
                      alt="란"
                      src="/class-icons/lhan.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>란</div>
                      <div>전란은 귀여운 친구, 각란은 잡기 모션이 워낙 좋아 각란이 유리</div>
                    </div>
                  </div>

                  {/* 스칼라 */}
                  <div className="article-callout">
                    <img
                      alt="스칼라"
                      src="/class-icons/scara.png"
                      className="skill-icon"
                      loading="lazy"
                    />
                    <div>
                      <div>스칼라</div>
                      <div>
                        생각보다 콤딜이 엄청 아프며 원잡도 1대1일때 판정 괜찮은 편이라 스칼라가 유리
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="article-callout">
              <div>
                <img
                  alt="오공"
                  src="/class-icons/ukong.png"
                  className="skill-icon"
                  loading="lazy"
                />
                <p>
                  <strong>오공</strong> - 아직 까지 필드나 솔라레, 자결장에서 보지 못함.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-9',
      title: '솔라레 특화 / 거점or길드리그 무제한 특화 및 수정',
      content: (
        <>
          <div>
            {/* 특화 */}
            <div className="article-card">
              <h3 id="guide-21-section-9-heading-1">
                <span>⚔️</span> 특화
              </h3>
              <p>특화는 유저 입맛에 따라서 다르게 찍어도 무방합니다.</p>

              <div className="article-grid">
                <div className="article-callout">
                  <p>1대1 특화</p>
                  <p>개인 취향에 맞게 설정</p>
                  <GuideImage src="/tip-images/노바1대1특화.png" alt="노바 1대1 특화" />
                </div>

                <div className="article-callout">
                  <p>RVR 특화</p>
                  <p>거점전에 특화된 설정</p>
                  <GuideImage src="/tip-images/노바RVR특화.png" alt="노바 RVR 특화" />
                </div>
              </div>
            </div>

            {/* 수정 */}
            <div className="article-card">
              <h3 id="guide-21-section-9-heading-2">💠 수정</h3>
              <div className="article-grid">
                {/* 1대1 기본 수정 */}
                <div className="article-callout">
                  <p>1대1 기본 수정</p>
                  <p>붉정2, 붉살무사2, 붉아디1</p>
                  <GuideImage src="/tip-images/노바1대1기본수정.png" alt="노바 1대1 기본 수정" />
                </div>

                {/* 1대1 극딜 수정 */}
                <div className="article-callout">
                  <p>1대1 극딜 수정 (인추세팅)</p>
                  <p>붉정2, 붉살무사2, 붉아디1, 붉카르메1</p>
                  <GuideImage src="/tip-images/노바1대1극딜.png" alt="노바 1대1 극딜 수정" />
                </div>

                {/* 1대1 피밸 수정 */}
                <div className="article-callout">
                  <p>1대1 피밸 수정</p>
                  <p>
                    보통 필드에서 제일 많이 쓰는 수정입니다.
                    <br />
                    붉정2, 1치명타피해
                  </p>
                  <GuideImage src="/tip-images/노바피밸.png" alt="노바 1대1 피밸 수정" />
                </div>

                {/* 무제한 거점 방셋 수정 */}
                <div className="article-callout">
                  <p>무제한 거점 방셋 수정</p>
                  <p>
                    진마력하르퓌아1
                    <br />
                    &nbsp;
                  </p>
                  <GuideImage src="/tip-images/노바방셋수정.png" alt="노바 무제한 거점 방셋 수정" />
                </div>

                {/* 길드리그 수정1 */}
                <div className="article-callout">
                  <p>길드리그 수정1(방셋)</p>
                  <p>무제한 거점 방셋 수정과 동일합니다.</p>
                  <GuideImage src="/tip-images/노바방셋수정.png" alt="노바 길드리그 수정1(방셋)" />
                </div>

                {/* 길드리그 수정2 */}
                <div className="article-callout">
                  <p>길드리그 수정2(밸셋)</p>
                  <p>상황에 따라 아프다면, 모든공격력 수정을 피해감소 수정으로 바꾸셔도 됩니다.</p>
                  <GuideImage src="/tip-images/노바피밸2.png" alt="노바 길드리그 수정2(밸셋)" />
                </div>
              </div>
            </div>

            {/* 유물 */}
            <div className="article-card">
              <h3 id="guide-21-section-9-heading-3">✨ 유물</h3>
              <div>
                <div className="article-callout">
                  <p>데키아피감 + 서리방패</p>
                </div>
              </div>
            </div>

            {/* 군왕 재련석 */}
            <div className="article-callout">
              <h4 id="guide-21-section-9-heading-4">⚔️ 군왕 재련석</h4>
              <div className="article-grid">
                <div className="article-callout">
                  <p>피해감소</p>
                </div>
                <div className="article-callout">
                  <p>모든 공격력</p>
                </div>
                <div className="article-callout">
                  <p>치명타 피해</p>
                </div>
                <div className="article-callout">
                  <p>다운어택 피해</p>
                </div>
                <div className="article-callout">
                  <p>최대 생명력</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-21-section-10',
      title: '하고 싶은 말',
      content: (
        <>
          <div className="article-card">
            <p>
              부족한 글 이지만 읽어주셔서 감사하고, 더 궁금한점 있으시면 <strong>약주</strong>로 귓
              주세요!
              <br />
              <span>노바 화이팅!!</span>
            </p>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-21-section-2-heading-1',
      title: '장점',
      section: 'guide-21-section-2',
    },
    {
      id: 'guide-21-section-2-heading-2',
      title: '단점',
      section: 'guide-21-section-2',
    },
    {
      id: 'guide-21-section-3-heading-1',
      title: '기본tip',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-2',
      title: '1. 항상 악시안 소환하기',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-3',
      title: '2. 잠구기 스킬들',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-4',
      title: '3. 슬롯 스킬',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-5',
      title: '4. 라밤',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-6',
      title: '이동기',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-7',
      title: '견제기',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-8',
      title: '잡기',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-9',
      title: 'CC 스킬들',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-10',
      title: '넉다운',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-11',
      title: '띄우기',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-12',
      title: '기절',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-13',
      title: '경직',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-14',
      title: '빙결',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-15',
      title: '기타 스킬 효과들',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-16',
      title: '디버프',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-17',
      title: '버프',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-18',
      title: '피흡',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-3-heading-19',
      title: '무적/슈아/전가',
      section: 'guide-21-section-3',
    },
    {
      id: 'guide-21-section-6-heading-1',
      title: '거점(RVR) 운영법',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-2',
      title: '본대 방셋',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-3',
      title: '성채 점령 후',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-4',
      title: '부속조, 수비조, 불퇴조',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-5',
      title: '꼬장조',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-6',
      title: '제한 거점,공성',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-7',
      title: '솔라레 운영법',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-8',
      title: '4훔 또는 8훔 세팅',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-9',
      title: '아군 보호',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-10',
      title: '잡기 판정',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-11',
      title: '3분 버프 활용',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-12',
      title: '조합 분석',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-13',
      title: '길드리그 운영법',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-14',
      title: '포지션',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-15',
      title: '세팅 및 운영',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-6-heading-16',
      title: '샤이 대처',
      section: 'guide-21-section-6',
    },
    {
      id: 'guide-21-section-7-heading-1',
      title: '기본콤보 (초급님 콤보)',
      section: 'guide-21-section-7',
    },
    {
      id: 'guide-21-section-7-heading-2',
      title: '원거리cc (nigrum님 콤보)',
      section: 'guide-21-section-7',
    },
    {
      id: 'guide-21-section-7-heading-3',
      title: '솔라레 콤보(초급님 콤보, 공속 7퍼이상)',
      section: 'guide-21-section-7',
    },
    {
      id: 'guide-21-section-7-heading-4',
      title: '빙결콤',
      section: 'guide-21-section-7',
    },
    {
      id: 'guide-21-section-7-heading-5',
      title: '빙결콤 주의점과 tip',
      section: 'guide-21-section-7',
    },
    {
      id: 'guide-21-section-8-heading-1',
      title: '유리한 상성',
      section: 'guide-21-section-8',
    },
    {
      id: 'guide-21-section-8-heading-2',
      title: '반반 상성',
      section: 'guide-21-section-8',
    },
    {
      id: 'guide-21-section-8-heading-3',
      title: '불리한 상성',
      section: 'guide-21-section-8',
    },
    {
      id: 'guide-21-section-9-heading-1',
      title: '특화',
      section: 'guide-21-section-9',
    },
    {
      id: 'guide-21-section-9-heading-2',
      title: '수정',
      section: 'guide-21-section-9',
    },
    {
      id: 'guide-21-section-9-heading-3',
      title: '유물',
      section: 'guide-21-section-9',
    },
    {
      id: 'guide-21-section-9-heading-4',
      title: '군왕 재련석',
      section: 'guide-21-section-9',
    },
  ],
}
export default content
