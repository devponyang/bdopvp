import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/musapick.JPG', alt: '전승 무사' },
  sections: [
    {
      id: 'guide-18-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요 무제한 공거점 <strong>Ctrl</strong> 길드에서 전승 무사를 주력으로 플레이하고
            있는 <strong>분야</strong>입니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-18-section-2',
      title: '전승 무사의 메커니즘',
      content: (
        <>
          <div className="article-card">
            <h3 id="guide-18-section-2-heading-1">
              <span>✨</span> "고요한 정신" (패시브)
            </h3>

            <div>
              <GuideImage src="/tip-images/goyo.JPG" alt="고요한 정신" />
            </div>

            <div className="article-callout">
              <p>
                <strong>획득:</strong> 고요한 정신을 획득하는 스킬 사용
              </p>
              <p>
                <strong>효과:</strong> 고요한 정신으로 <strong>개화, 격풍, 용오름화, 용염진</strong>
                을 쿨타임 중 사용 가능 (무쿨기)
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-18-section-2-heading-2">🔥 사냥 겸 무지성 딜링 콤보</h4>
              <p>(짱쿠 장인초대석 전승무사편 흉살 참조)</p>
              <div className="article-callout">
                <p>
                  <strong>각수</strong> → <strong>태풍</strong> → <strong>선풍참</strong> →{' '}
                  <strong>파훼</strong> → <strong>참수</strong> → <strong>개화</strong> →{' '}
                  <strong>격풍</strong> → <strong>선풍참</strong> → <strong>용오름</strong> →{' '}
                  <strong>태산가르기</strong> → <strong>격풍</strong> → <strong>선풍참</strong> →{' '}
                  <strong>역극</strong> → <strong>격풍</strong> → <strong>선풍참</strong> →{' '}
                  <strong>장님가르기</strong> → <strong>선풍참</strong> → <strong>개화</strong> →{' '}
                  <strong>선풍참</strong> → <strong>장님찌르기</strong> → <strong>격풍</strong> →{' '}
                  <strong>선풍참</strong> → <strong>강가름 1타</strong> (두번 베는 모션) →{' '}
                  <strong>개화</strong> → <strong>선풍참</strong> → <strong>역극</strong> →{' '}
                  <strong>격풍</strong> → <strong>선풍참</strong> → <strong>후퇴베기</strong> →{' '}
                  <strong>격풍</strong> → <strong>선풍참</strong> → <strong>각수</strong> →{' '}
                  <strong>태풍</strong> → <strong>개화</strong> → <strong>선풍참</strong> →
                  (파훼부터 반복)
                </p>
              </div>

              <div className="article-card">
                <p>
                  <strong>💡 중요:</strong> 전승 무사로 PVP하기 이전에{' '}
                  <strong>무지성 딜링 콤보를 자유결투장 허수아비로 연습</strong>하셔야 합니다.
                </p>
                <p>
                  <strong>"머슬메모리 장착 필수"</strong>
                </p>
                <p>
                  귀찮아도 머슬메모리로 익히셔야 어떤 상황에서든 딜을 욱여넣고 콤보를 이어나갈 수
                  있습니다.
                  <br />
                  <span>(저도 이 콤보로 자유결투장에서 1시간씩 연습했습니다.)</span>
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-18-section-3',
      title: '전승 무사 클래스의 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-18-section-3-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <span>▸</span>
                <span>
                  <strong>2.7cc 기반</strong>으로 콤보를 길게 가져갈 수 있습니다.
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  <strong>DPS가 높습니다.</strong>
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  <strong>기동성이 좋습니다.</strong> 무사의 이동스킬인 <strong>추격</strong>으로
                  진입/이탈이 좋고 포지션도 다양하게 잡을 수 있습니다.
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  스킬들이 <strong>스피디해서 짧은 시간 안에 강한 누킹딜</strong>을 넣을 수
                  있습니다.
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  스킬들의 <strong>선딜이 짧은 편</strong>이라 상대의 노림수를 카운터치기 좋습니다.
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  <strong>고점이 높습니다.</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-18-section-3-heading-2">
              <span>❌</span> 단점
            </h3>
            <ul>
              <li>
                <span>▸</span>
                <span>
                  <strong>몸이 약하고</strong> 슈아 기반 캐릭터로{' '}
                  <strong>비비기 싸움에 취약</strong>합니다.
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  <strong>슈아 CC기가 없습니다.</strong>
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  슈아 CC기가 없고 <strong>잡기가 없어 플레이메이킹이 힘듭니다.</strong>
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  <strong>상대하는 직업의 이해도가 있어야</strong> 전승 무사의 성능이 나옵니다.
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  <strong>유틸기와 무적스킬이 빈약</strong>하여 안정성이 떨어집니다.
                </span>
              </li>
              <li>
                <span>▸</span>
                <span>
                  <strong>저점이 낮습니다.</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* 전승무사 핵심 */}
          <div className="article-callout">
            <div>
              <div>💡</div>
              <div>
                <h3 id="guide-18-section-3-heading-3">전승 무사 핵심!</h3>
                <p>
                  좋은 기동력과 강한 딜로 상대를 압박하고 빈틈을 유도하는 플레이를 하시면 캐릭터의
                  고점을 뽑을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-18-section-4',
      title: '거점(RVR) / 솔라레 / 길드리그 운영법',
      content: (
        <>
          {/* 거점 */}
          <div className="article-card">
            <h3 id="guide-18-section-4-heading-1">
              <span>⚔️</span> 거점(RVR)
            </h3>
            <p>
              본대와 떨어져 <strong>사이드에서 상대 딜러들 암살</strong>하는 게 좋습니다.
              <br />
              <span>(꼬장조 가시는 게 좋습니다.)</span>
            </p>

            <div className="article-callout">
              <h4 id="guide-18-section-4-heading-2">핵심 운영</h4>
              <p>
                <strong>Q가드로 간을 보다</strong> 상태이상이 걸린 적 또는 무방비한 적에게
                <strong> 빠르게 딜을 욱여넣어 암살</strong>하는 플레이를 반복하면 됩니다.
              </p>
            </div>
          </div>

          {/* 솔라레 */}
          <div className="article-card">
            <h3 id="guide-18-section-4-heading-3">
              <span>⚡</span> 솔라레의 창 (소수전)
            </h3>

            <div className="article-callout">
              <h4 id="guide-18-section-4-heading-4">핵심 운영</h4>
              <p>
                상대의 <strong>빈틈을 유도해 카운터치고</strong>
                <strong> 강한 누킹딜로 압박</strong>하시면 좋습니다.
              </p>
            </div>

            <p>대략적인 운영은 아래 영상을 참고하세요.</p>
            <div>
              <GuideVideo
                src="https://www.youtube.com/embed/ptQIeGnRs4A"
                title="전승 무사 솔라레 플레이"
              />
            </div>
          </div>

          {/* 길드리그 */}
          <div className="article-card">
            <h3 id="guide-18-section-4-heading-5">
              <span>🛡️</span> 길드리그
            </h3>

            <div className="article-callout">
              <h4 id="guide-18-section-4-heading-6">핵심 운영</h4>
              <p>
                길드 전략에 맞춰 <strong>언제든지 딜 지원이 가능한 포지션</strong>에 있어야 합니다.
              </p>
            </div>

            <p>대략적인 운영은 아래 영상을 참고하세요.</p>
            <div>
              <GuideVideo
                src="https://www.youtube.com/embed/pJqJ3aJsXQA"
                title="전승 무사 길드리그 플레이"
              />
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-18-section-5',
      title: 'PVP 콤보',
      content: (
        <>
          <div className="article-card">
            <div className="article-callout">
              <p>전승 무사는 콤보랄 게 딱히 없습니다.</p>
              <p>
                그때그때 <strong>"상황에 맞춰 스킬을 욱여넣는 게 중요합니다."</strong>
              </p>
            </div>

            <h3 id="guide-18-section-5-heading-1">
              <span>🔥</span> 대표 콤보
            </h3>

            {/* 2.7cc 콤보 1 */}
            <div className="article-callout">
              <h4 id="guide-18-section-5-heading-2">2.7cc - 편전 시작</h4>
              <div className="article-callout">
                <p>
                  <strong>편전</strong> (경직) →<strong> 각수</strong> (띄우기) →
                  <strong> 개화</strong> →<strong> 격풍</strong> →<strong> 용오름화</strong> →
                  <strong> 돌아차기</strong> (넉다운) →<strong> 장님가르기</strong> →
                  <strong> 선풍참</strong> →<strong> 개화</strong> →<strong> 선풍참</strong> →
                  <strong> 역극</strong> →<strong> 격풍</strong> →<strong> 태산가르기</strong> →
                  <strong> 격풍</strong> →<strong> 선풍참</strong>
                </p>
              </div>
            </div>

            {/* 2.7cc 콤보 2 */}
            <div className="article-callout">
              <h4 id="guide-18-section-5-heading-3">2.7cc - 편전 + 역극</h4>
              <div className="article-callout">
                <p>
                  <strong>편전</strong> (경직) →<strong> 역극</strong> (기절) →
                  <strong> 빽추 </strong> →<strong> 격풍</strong> →<strong> 개화</strong> →
                  <strong> 격풍</strong> →<strong> 돌아차기</strong> (넉다운) 후 위 콤보와 동일
                </p>
              </div>
            </div>

            {/* 2.7cc 콤보 3 */}
            <div className="article-callout">
              <h4 id="guide-18-section-5-heading-4">2.7cc - 역극 시작</h4>
              <div className="article-callout">
                <p>
                  <strong>역극</strong> (기절) →<strong> 빽추 </strong> →<strong> 개화</strong> →
                  <strong> 격풍</strong> →<strong> 빽추</strong> →<strong> 장님찌르기</strong>{' '}
                  (경직) →<strong> 격풍</strong> →<strong> 용오름</strong> (용오름화 X) →
                  <strong> 돌아차기</strong> (넉다운) 후 위 콤보와 동일
                </p>
              </div>
            </div>

            {/* 슈아 콤보 */}
            <div className="article-callout">
              <h4 id="guide-18-section-5-heading-5">슈아 콤보 (짤딜용)</h4>

              <div className="article-callout">
                <p>
                  <strong>역극</strong> →<strong> 격풍</strong> →<strong> 태산</strong> →
                  <strong> 격풍</strong> →<strong> 용오름화 or 후퇴베기</strong> →
                  <strong> 격풍</strong>
                </p>
              </div>

              <div className="article-callout">
                <p>
                  <strong>각수</strong> →<strong> 개화</strong> →<strong> 격풍</strong> →
                  <strong> 태산가르기</strong> →<strong> 격풍</strong> →
                  <strong> 용오름화 or 후퇴베기</strong> →<strong> 격풍</strong>
                </p>
              </div>

              <div className="article-card">
                <p>
                  <strong>💡 참고:</strong> 용오름화는 후딜이 긴 스킬이기 때문에 상황을 보고 쓰시는
                  게 좋습니다.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-18-section-6',
      title: '진입기 / 1cc 시동기 활용법',
      content: (
        <>
          <div className="article-card">
            <h3 id="guide-18-section-6-heading-1">
              <span>⚡</span> 주요 진입기 및 1cc 시동기
            </h3>

            <div>
              <div className="article-callout">
                <p>
                  진입기 및 1cc 시동기: <strong>파훼</strong>, <strong>역극</strong>,{' '}
                  <strong>각수</strong>
                </p>
                <p>
                  <strong>각수는 맨몸</strong>이기에
                  <strong> 각수 → 개화 → 격풍</strong>으로 맨몸을 가려주는 게 좋습니다.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-18-section-7',
      title: 'PvP 특화 및 수정',
      content: (
        <>
          {/* 특화 이미지 */}
          <div>
            <h3 id="guide-18-section-7-heading-1">⚡ 특화</h3>
            <div>
              <GuideImage src="/tip-images/musa.JPG" alt="특화" />
            </div>
          </div>

          <div className="article-card">
            <h3 id="guide-18-section-7-heading-2">💠 수정</h3>

            <div>
              {/* 수정 1 */}
              <div className="article-callout">
                <h4 id="guide-18-section-7-heading-3">인추 세팅</h4>
                <div>
                  <GuideImage src="/tip-images/musacri1.JPG" alt="인추 세팅" />
                </div>
              </div>

              {/* 수정 2 */}
              <div className="article-callout">
                <h4 id="guide-18-section-7-heading-4">회피 밸런스 세팅</h4>
                <div>
                  <GuideImage src="/tip-images/musacri2.JPG" alt="회피 밸런스 세팅" />
                </div>
              </div>

              {/* 유물 3개 */}
              <div className="article-callout">
                <h4 id="guide-18-section-7-heading-5">참고</h4>
                <div>
                  <div className="article-card">
                    <p>
                      • 유물: <strong>모든 피해 감소</strong> + 광명석 <strong>서리방패</strong>
                    </p>
                  </div>
                  <div className="article-card">
                    <p>
                      • 유물: <strong>모든 피해 감소</strong> + 광명석 <strong>부패</strong>
                    </p>
                  </div>
                  <div className="article-card">
                    <p>
                      • 유물: <strong>모든 회피력</strong> + 광명석 <strong>켄타우로스</strong>
                    </p>
                  </div>
                  <p>상황에 맞게 선택</p>
                  <div></div>
                  <div className="article-card">
                    <p>
                      적중 필요시 <strong>2적중 ~ 3적중</strong> 착용
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 라밤 */}
          <div className="article-card">
            <h3 id="guide-18-section-7-heading-6">✨ 라밤</h3>
            <div>
              <GuideImage src="/tip-images/labam.JPG" alt="라밤" />
            </div>
          </div>

          {/* 재련석 */}
          <div className="article-callout">
            <h4 id="guide-18-section-7-heading-7">⚔️ 군왕 재련석</h4>
            <div className="article-grid">
              <div className="article-callout">
                <p>모든 공격력</p>
              </div>
              <div className="article-callout">
                <p>모든 피해 감소</p>
              </div>
              <div className="article-callout">
                <p>최대 생명력</p>
              </div>
              <div className="article-callout">
                <p>다운어택 피해량 증가</p>
              </div>
              <div className="article-callout">
                <p>백어택 피해량 증가</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-18-section-8',
      title: '하고 싶은 말 / 팁',
      content: (
        <>
          <div className="article-card">
            <p>
              솔직히 요새 전승 무사보다 DPS 좋고 무매보다도 짧은 거리를 순식간에 이동하는 직업들이
              많지만
              <strong> 전승 무사만의 매력과 장점</strong>이 있으니까
            </p>
            <p>전승 무사 플레이하는 거에 망설이고 계시다면 해보는 걸 추천드립니다.</p>
          </div>

          {/* 꿀팁들 */}
          <div>
            <div className="article-callout">
              <h4 id="guide-18-section-8-heading-1">🎯 필수 연습 콤보</h4>
              <div className="article-callout">
                <p>
                  <strong>옆장찌, 초열보</strong> +<strong> 옆장찌, 초열보</strong> +
                  <strong> 각수</strong>
                </p>
              </div>
              <p>
                <strong>이거는 무조건 연습.</strong>
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-18-section-8-heading-2">⚡ 슈아 끌기</h4>
              <div className="article-callout">
                <p>
                  <strong>격풍</strong>,<strong> 추격</strong>,<strong> 용오름화</strong>,
                  <strong> 후퇴베기</strong>
                </p>
              </div>
              <p>이 스킬들로 슈아를 끌어주시면 됩니다.</p>
            </div>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-18-section-2-heading-1',
      title: '고요한 정신" (패시브)',
      section: 'guide-18-section-2',
    },
    {
      id: 'guide-18-section-2-heading-2',
      title: '사냥 겸 무지성 딜링 콤보',
      section: 'guide-18-section-2',
    },
    {
      id: 'guide-18-section-3-heading-1',
      title: '장점',
      section: 'guide-18-section-3',
    },
    {
      id: 'guide-18-section-3-heading-2',
      title: '단점',
      section: 'guide-18-section-3',
    },
    {
      id: 'guide-18-section-3-heading-3',
      title: '전승 무사 핵심!',
      section: 'guide-18-section-3',
    },
    {
      id: 'guide-18-section-4-heading-1',
      title: '거점(RVR)',
      section: 'guide-18-section-4',
    },
    {
      id: 'guide-18-section-4-heading-2',
      title: '핵심 운영',
      section: 'guide-18-section-4',
    },
    {
      id: 'guide-18-section-4-heading-3',
      title: '솔라레의 창 (소수전)',
      section: 'guide-18-section-4',
    },
    {
      id: 'guide-18-section-4-heading-4',
      title: '핵심 운영',
      section: 'guide-18-section-4',
    },
    {
      id: 'guide-18-section-4-heading-5',
      title: '길드리그',
      section: 'guide-18-section-4',
    },
    {
      id: 'guide-18-section-4-heading-6',
      title: '핵심 운영',
      section: 'guide-18-section-4',
    },
    {
      id: 'guide-18-section-5-heading-1',
      title: '대표 콤보',
      section: 'guide-18-section-5',
    },
    {
      id: 'guide-18-section-5-heading-2',
      title: '2.7cc - 편전 시작',
      section: 'guide-18-section-5',
    },
    {
      id: 'guide-18-section-5-heading-3',
      title: '2.7cc - 편전 + 역극',
      section: 'guide-18-section-5',
    },
    {
      id: 'guide-18-section-5-heading-4',
      title: '2.7cc - 역극 시작',
      section: 'guide-18-section-5',
    },
    {
      id: 'guide-18-section-5-heading-5',
      title: '슈아 콤보 (짤딜용)',
      section: 'guide-18-section-5',
    },
    {
      id: 'guide-18-section-6-heading-1',
      title: '주요 진입기 및 1cc 시동기',
      section: 'guide-18-section-6',
    },
    {
      id: 'guide-18-section-7-heading-1',
      title: '특화',
      section: 'guide-18-section-7',
    },
    {
      id: 'guide-18-section-7-heading-2',
      title: '수정',
      section: 'guide-18-section-7',
    },
    {
      id: 'guide-18-section-7-heading-3',
      title: '인추 세팅',
      section: 'guide-18-section-7',
    },
    {
      id: 'guide-18-section-7-heading-4',
      title: '회피 밸런스 세팅',
      section: 'guide-18-section-7',
    },
    {
      id: 'guide-18-section-7-heading-5',
      title: '참고',
      section: 'guide-18-section-7',
    },
    {
      id: 'guide-18-section-7-heading-6',
      title: '라밤',
      section: 'guide-18-section-7',
    },
    {
      id: 'guide-18-section-7-heading-7',
      title: '군왕 재련석',
      section: 'guide-18-section-7',
    },
    {
      id: 'guide-18-section-8-heading-1',
      title: '필수 연습 콤보',
      section: 'guide-18-section-8',
    },
    {
      id: 'guide-18-section-8-heading-2',
      title: '슈아 끌기',
      section: 'guide-18-section-8',
    },
  ],
}
export default content
