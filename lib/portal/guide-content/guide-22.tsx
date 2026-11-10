import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/스칼라.png', alt: '스칼라' },
  sections: [
    {
      id: 'guide-22-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요. 오직 망치 <strong>마왕오리</strong> 입니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-22-section-2',
      title: '스칼라의 장점과 단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-22-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <p>
              스칼라의 장점은 다른 직업보다 상대적으로 <strong>좋은 체급</strong>으로 생각보다{' '}
              <strong>강력한 딜링</strong>과 <strong>단단함</strong>에 있습니다.
            </p>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-22-section-2-heading-2">
              <span>❌</span> 단점
            </h3>
            <p>
              단점으로는 <strong>잡기를 제외한 모든 스킬이 전부 즉발성 CC가 없기</strong>에 상대방의
              틈을 보더라도 구경만 해야한다는 점이 있습니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-22-section-3',
      title: '거점전 / 솔라레 or 길드리그 (소수전) 운영 방법',
      content: (
        <>
          {/* 거점전 */}
          <div className="article-card">
            <h3 id="guide-22-section-3-heading-1">
              <span>⚔️</span> 거점전
            </h3>
            <p>
              거점전에서 운영방법은 스칼라 특성상{' '}
              <strong>광역 딜링으로 적진의 한가운데로 들어가서 상대방을 흔들거나</strong> 방어력이
              약한 직업군들을 <strong>빠르게 죽여주는 것</strong>에 있으며, 최대한 상대방의 부속을
              최대한 HP를 빼내거나 파괴시키는데 의미가 있는 캐릭입니다.
            </p>
            <p>
              물론 상대방의 대포 파괴에도 스칼라 특성상 <strong>높은 곳에 올라가기 편해서</strong>{' '}
              좋습니다.
            </p>

            <p>대략적인 운영은 아래 영상을 참고하세요.</p>
            <div>
              <GuideVideo
                src="https://www.youtube.com/embed/PdLk-ADGZDg?start=139"
                title="스칼라 거점전 플레이"
              />
            </div>
          </div>

          {/* 솔라레의 창 */}
          <div className="article-card">
            <h3 id="guide-22-section-3-heading-2">
              <span>⚡</span> 솔라레의 창 (소수전)
            </h3>
            <p>
              솔라레의 창에서는 최대한{' '}
              <strong>상대방 스킬이 그냥 슈아인지 슈아 CC인지 확실하게 확인</strong>한 이후에{' '}
              <strong>모든 첫 CC를 잡기로 이어가는 것이 중요</strong>하며, 잡기를 실패 했을 시 에는
              느린 동작으로 인하여 선 CC는 거의 못 먹인다고 보시면 됩니다.
            </p>
            <p>
              대신 대부분의 메인 스킬이 <strong>광역 슈아 넉다운 및 바운드</strong>라 아군의 1CC를
              확인하고 도중에 넉다운을 박아주면 좋습니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-22-section-4',
      title: '콤보',
      content: (
        <>
          {/* 거점전 콤보 */}
          <div className="article-card">
            <h3 id="guide-22-section-4-heading-1">
              <span>🔥</span> 거점전 콤보
            </h3>
            <div className="article-callout">
              <p>
                <strong>흐름: 황금 천둥</strong> →<strong> 풍차 돌리기</strong> →
                <strong> 본: 걷잡을 수 없는 힘</strong> →<strong> 장타</strong> →
                <strong> 흐름: 황금의 연쇄</strong>
              </p>
            </div>
          </div>

          {/* 1대1 콤보 */}
          <div className="article-card">
            <h3 id="guide-22-section-4-heading-2">
              <span>⚡</span> 1대1 콤보
            </h3>

            {/* 기본 1대1 콤보 */}
            <div className="article-callout">
              <h4 id="guide-22-section-4-heading-3">잡기 시작 콤보</h4>
              <div className="article-callout">
                <p>
                  <strong>잡기</strong> →<strong> 한계돌파</strong> →<strong> 진: 걷어 치기</strong>{' '}
                  →<strong> 진: 두 발 차기</strong> →<strong> 흐름: 황금 덩굴</strong> →
                  <strong> 전율의 두드림</strong> →<strong> 장타</strong> →
                  <strong> 슈퍼아머 판정있는 아무 스킬들 또는 상황보고 이탈</strong>
                </p>
              </div>
              <div className="article-card">
                <p>
                  <strong>💡 참고:</strong> 1대1시에만 본 스킬로 <strong>풍차 돌리기</strong>를
                  사용합니다. 잡기를 사용전에 맞추고 잡기를 사용해도 상관없고 잡기를 맞춘 이후에는
                  위에 스킬과 똑같이 운영합니다.
                </p>
              </div>
            </div>

            {/* 풍차 돌리기 시작 */}
            <div className="article-callout">
              <h4 id="guide-22-section-4-heading-4">풍차 돌리기 적중 시</h4>
              <div className="article-card">
                <p>
                  <strong>📌 본:</strong> 풍차돌리기 습득시에만 가능한 콤보라서 본 스킬 찍어 주셔야
                  합니다.
                </p>
              </div>
              <div className="article-callout">
                <p>
                  <strong>풍차 돌리기</strong> (적중) →<strong> 흐름: 황금 천둥</strong> →
                  <strong> 한계돌파</strong> →<strong> 진: 걷어 치기</strong> →
                  <strong> 진: 두 발 차기</strong> →<strong> 흐름: 황금 덩굴</strong> →
                  <strong> 전율의 두드림</strong> →<strong> 장타</strong> →
                  <strong> 슈퍼아머 판정있는 아무 스킬들 또는 상황보고 이탈</strong>
                </p>
              </div>
              <div className="article-card">
                <p>잡기가 없는 상태에서 풍차 돌리기를 적중시키면 위 콤보로 연계합니다.</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-22-section-5',
      title: '진입기 / 1cc 시동기 활용법 (이니시)',
      content: (
        <>
          <div className="article-card">
            <h3 id="guide-22-section-5-heading-1">
              <span>⚡</span> 주요 이동기
            </h3>

            <div className="article-callout">
              <p>진입기로는 스칼라에게는 이동기로 다음과 같은 스킬들을 사용합니다:</p>
              <ul>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>진: 뛰어 찍기</strong> (흐름 포함)
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>가속 돌진</strong>
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>진: 가벼운 도약</strong>
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>중력 회피</strong>
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>물러서기</strong> (흐름 포함)
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>진: 중력핵 설치</strong> 이후 다시 커맨드를 사용하여{' '}
                    <strong>진: 인력생성</strong>, <strong>흐름: 중력 폭격</strong>,{' '}
                    <strong>흐름: 척력 생성</strong>
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>역중력 도약</strong>
                  </span>
                </li>
              </ul>
            </div>

            <div className="article-callout">
              <h4 id="guide-22-section-5-heading-2">💡 진입 운영법</h4>
              <p>
                <strong>역중력 도약을 제외한</strong> 모든 이동기를 사용해서 상대방에게 최대한
                접근하고 접근한 이후에 <strong>역중력 도약</strong>으로 공중으로 올라간 뒤에 상황을
                보고 <strong>흐름: 황금 천둥</strong>을 사용해서 콤보를 이어갑니다.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-22-section-6',
      title: '잠금 스킬과 라밤',
      content: (
        <>
          {/* 잠금 스킬 */}
          <div className="article-card">
            <h3 id="guide-22-section-6-heading-1">
              <span>🔒</span> 잠구는 스킬
            </h3>
            <div className="article-callout">
              <ul>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>흐름: 황금 궤적</strong>
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>흐름: 황금 장벽</strong>
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>진: 투구 부시기</strong>
                  </span>
                </li>
                <li>
                  <span>▸</span>
                  <span>
                    <strong>회피 이동</strong>
                  </span>
                </li>
              </ul>
              <p>회피 이동을 제외한 나머지는 취향입니다. (저는 언급한 4개는 잠구고 있습니다)</p>
            </div>
          </div>

          {/* 라밤 */}
          <div className="article-card">
            <h3 id="guide-22-section-6-heading-2">
              <span>✨</span> 라밤 (기술 심화)
            </h3>
            <div>
              <GuideImage src="/tip-images/스칼라라밤.png" alt="라밤" />
            </div>
            <div className="article-callout">
              <ul>
                <li>
                  <strong>중력 제어</strong>
                </li>
                <li>
                  <strong>흐름: 황금길</strong>
                </li>
                <li>
                  <strong>금빛 가호</strong>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-22-section-7',
      title: 'PvP 특화 및 수정',
      content: (
        <>
          {/* 특화 */}
          <div className="article-card">
            <h3 id="guide-22-section-7-heading-1">⚡ 특화</h3>
            <div className="article-grid">
              {/* 거점전 및 길드리그 특화 */}
              <div className="article-callout">
                <div>
                  <GuideImage
                    src="/tip-images/스칼라거점전특화.png"
                    alt="거점전 및 길드리그 특화"
                  />
                </div>
                <p>거점전 및 길드리그 특화</p>
              </div>

              {/* 솔라레 특화 */}
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/스칼라솔라레특화.png" alt="솔라레 특화" />
                </div>
                <p>솔라레 특화</p>
              </div>
            </div>
          </div>

          {/* 수정 */}
          <div className="article-card">
            <h3 id="guide-22-section-7-heading-2">💠 수정</h3>
            <div className="article-grid">
              {/* 무제한 거점전 수정 */}
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/무제한스칼라.png" alt="무제한 거점전 수정" />
                </div>
                <p>무제한 거점전 수정</p>
              </div>

              {/* 무제한 적중수정 */}
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/무제한적중스칼라.png" alt="무제한 적중수정" />
                </div>
                <p>무제한 적중수정</p>
              </div>

              {/* 리그용 수정 */}
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/스칼라리그용.png" alt="리그용 수정" />
                </div>
                <p>리그용 수정</p>
              </div>
            </div>
          </div>

          {/* 유물 */}
          <div className="article-card">
            <h3 id="guide-22-section-7-heading-3">✨ 유물</h3>
            <div className="article-callout">
              <p>
                <strong>유물:</strong> <strong>데키아 피해감소 유물</strong> + 광명석{' '}
                <strong>서리방패</strong>
              </p>
            </div>
          </div>

          {/* 군왕 재련석 */}
          <div className="article-callout">
            <h4 id="guide-22-section-7-heading-4">⚔️ 군왕 재련석</h4>
            <div className="article-grid">
              <div className="article-callout">
                <p>공격력</p>
              </div>
              <div className="article-callout">
                <p>모든 피해 감소</p>
              </div>
              <div className="article-callout">
                <p>백어택 피해량 증가</p>
              </div>
              <div className="article-callout">
                <p>다운어택 피해량 증가</p>
              </div>
              <div className="article-callout">
                <p>치명타 피해량 증가</p>
              </div>
            </div>
          </div>

          {/* 5-1. 극공/적중 외에 밸런스 세팅을 안쓰는 이유 */}
          <div className="article-callout">
            <h3 id="guide-22-section-7-heading-5">⚠️ 극공/적중 외에 밸런스 세팅을 안쓰는 이유</h3>
            <div className="article-callout">
              <p>
                스칼라 특성상{' '}
                <strong>
                  한번 CC 기회를 잡으면 한번에 딜을 넣어서 몰아쳐야 상대방을 죽일 수 있는데
                </strong>{' '}
                피밸 세팅을 하면 어쩌다가 CC 기회를 잡아도 상대방을 죽일 딜이 안 나오게 됩니다.
              </p>
              <p>
                스칼라가 탱 세팅을 해도 상대방에게 CC를 맞고 집중 포화를 당하게 된다면 죽는 건
                똑같은데 피밸 세팅을 하면{' '}
                <strong>상대방만 못 잡는 상황이 너무 많이 나옵니다.</strong>
              </p>
              <p>
                <strong>무적-슈아 베이스의 캐릭</strong>이라서 무적으로 나머지 딜을 전부 흘린다고
                생각하고 플레이해서{' '}
                <strong>최대한 기회가 있을 때 확실하게 상대방을 보내버릴 딜이 필요합니다.</strong>
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-22-section-8',
      title: '꿀팁',
      content: (
        <>
          <div>
            <div className="article-callout">
              <h4 id="guide-22-section-8-heading-1">⚡ 공속 버프 유지</h4>
              <p>
                평소에 계속 <strong>공속 15% 증가 버프</strong>를 돌리는 것이 중요합니다.{' '}
                <strong>진: 올려 찍기</strong>와 <strong>진: 중력핵 설치</strong>를 잘 사용해서 계속
                유지를 해야 합니다.
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-22-section-8-heading-2">🛡️ 전방가드 스킬 주의</h4>
              <p>
                스칼라는 전방가드 스킬이 많이 존재하긴 하지만 대부분 느려서 상대방에게는 약점으로
                보일 수 있으며 그로 인하여 <strong>슈퍼아머가 붙은 스킬들만 주로 사용</strong>
                합니다.
              </p>
            </div>

            <div className="article-callout">
              <h4 id="guide-22-section-8-heading-3">⚠️ 솔라레에서의 스칼라</h4>
              <p>
                스칼라 저점 자체는 매우 높은 편에 속합니다. 대신 고점 자체는 너무 낮아서 상위큐에
                가면 갈수록 힘듭니다. 잡기 직업들도 물론 잡기가 매우 중요하긴 하지만, 스칼라는 그냥
                솔라레에서 <strong>잡기 실패시에는 없는 캐릭이나 다름없습니다.</strong> (나머지
                스킬은 선딜이 너무 길어서 얻어 걸리는 거 아니면 CC 적중이 불가능합니다.)
              </p>
              <p>
                팀에게나 적에게나 그냥 <strong>날아다니는 황금 파리</strong>입니다.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-22-section-2-heading-1',
      title: '장점',
      section: 'guide-22-section-2',
    },
    {
      id: 'guide-22-section-2-heading-2',
      title: '단점',
      section: 'guide-22-section-2',
    },
    {
      id: 'guide-22-section-3-heading-1',
      title: '거점전',
      section: 'guide-22-section-3',
    },
    {
      id: 'guide-22-section-3-heading-2',
      title: '솔라레의 창 (소수전)',
      section: 'guide-22-section-3',
    },
    {
      id: 'guide-22-section-4-heading-1',
      title: '거점전 콤보',
      section: 'guide-22-section-4',
    },
    {
      id: 'guide-22-section-4-heading-2',
      title: '1대1 콤보',
      section: 'guide-22-section-4',
    },
    {
      id: 'guide-22-section-4-heading-3',
      title: '잡기 시작 콤보',
      section: 'guide-22-section-4',
    },
    {
      id: 'guide-22-section-4-heading-4',
      title: '풍차 돌리기 적중 시',
      section: 'guide-22-section-4',
    },
    {
      id: 'guide-22-section-5-heading-1',
      title: '주요 이동기',
      section: 'guide-22-section-5',
    },
    {
      id: 'guide-22-section-5-heading-2',
      title: '진입 운영법',
      section: 'guide-22-section-5',
    },
    {
      id: 'guide-22-section-6-heading-1',
      title: '잠구는 스킬',
      section: 'guide-22-section-6',
    },
    {
      id: 'guide-22-section-6-heading-2',
      title: '라밤 (기술 심화)',
      section: 'guide-22-section-6',
    },
    {
      id: 'guide-22-section-7-heading-1',
      title: '특화',
      section: 'guide-22-section-7',
    },
    {
      id: 'guide-22-section-7-heading-2',
      title: '수정',
      section: 'guide-22-section-7',
    },
    {
      id: 'guide-22-section-7-heading-3',
      title: '유물',
      section: 'guide-22-section-7',
    },
    {
      id: 'guide-22-section-7-heading-4',
      title: '군왕 재련석',
      section: 'guide-22-section-7',
    },
    {
      id: 'guide-22-section-7-heading-5',
      title: '극공/적중 외에 밸런스 세팅을 안쓰는 이유',
      section: 'guide-22-section-7',
    },
    {
      id: 'guide-22-section-8-heading-1',
      title: '공속 버프 유지',
      section: 'guide-22-section-8',
    },
    {
      id: 'guide-22-section-8-heading-2',
      title: '전방가드 스킬 주의',
      section: 'guide-22-section-8',
    },
    {
      id: 'guide-22-section-8-heading-3',
      title: '솔라레에서의 스칼라',
      section: 'guide-22-section-8',
    },
  ],
}
export default content
