import Link from 'next/link'
import GuideImage from '@/components/portal/guide/GuideImage'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: { src: '/tip-images/wizardzzal.gif', alt: 'wizardzzal' },
  sections: [
    {
      id: 'guide-20-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요 <Link href="/guild/시바">시바</Link> 길드의 <strong>88o</strong> 입니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-20-section-2',
      title: '각성 위자드의 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-20-section-2-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <strong>딜압축이 좋고</strong> 방어판정이 안정적임
              </li>
              <li>
                샤이버프와 중첩되는 <strong>신속의 주문</strong> 보유
              </li>
              <li>
                거점전에서 <strong>광역힐</strong>로 본대라인 빠르게 회복시켜줄 수 있음
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-20-section-2-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                <strong>이동기가 구리다</strong> <br />
                장거리 이동하려면 반드시 맨몸달리기 해야하는데 매구 무사 매화 등 압도적 이동기 가진
                직업이 마크하면 교전위치에 합류 못함. 텔포로 합류하면 높은 확률로 잡기걸려서 죽음
              </li>
              <li>
                <strong>서포트형 기술(힐,신속)에 방어판정 없음</strong>
              </li>
              <li>
                <strong>구캐릭이라 주무기↔각성무기 스왑이 불편함</strong> <br />
                대부분 퀵슬롯으로 해야함
              </li>
              <li>
                맞을일이 많아서 <strong>슈아가속 심하게 영향받음</strong>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-20-section-3',
      title: '각성 위자드 운용법',
      content: (
        <>
          {/* 필수 퀵슬롯 */}
          <div className="article-card">
            <h3 id="guide-20-section-3-heading-1">
              <span>⚡</span> 필수 퀵슬롯
            </h3>

            <div>
              <GuideImage src="/tip-images/위자드퀵슬롯.png" alt="위자드 퀵슬롯" />
            </div>

            <div>
              <p>일단 퀵슬롯에 이거 다 올려야 함</p>

              <div className="article-callout">
                <h4 id="guide-20-section-3-heading-2">순간이동</h4>
                <p>
                  돌맹이 같은 오브젝트 앞에서 넘어졌을 때 커맨드로 쓰면 파쿠르 하다가 죽음. 그래서
                  방해물 있는 경우 슬롯으로 사용
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-20-section-3-heading-3">지진, 차가운안개, 유성낙하</h4>
                <p>퀵슬롯으로 비각 전환됨</p>
              </div>

              <div className="article-callout">
                <h4 id="guide-20-section-3-heading-4">물구슬, 아네, 마그소환</h4>
                <p>비각 → 각성 전환기, 아네마그는 슈아 유지 용도로 두 개 다 씀</p>
              </div>
            </div>
          </div>

          {/* 잠구는 스킬 */}
          <div className="article-card">
            <h3 id="guide-20-section-3-heading-5">
              <span>🔒</span> 잠구는 스킬
            </h3>

            <div>
              <div className="article-callout">
                <h4 id="guide-20-section-3-heading-6">아네, 마그 소환</h4>
                <p>
                  커맨드 잠구고 퀵슬롯 등록 해주세요
                  <br />
                  업화나 대재앙 쓸 때 <span>WF</span>, <span>Shift+F</span> 대신 <span>FW</span>,{' '}
                  <span>F+Shift</span> 로 누르면 삑사리 납니다
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-20-section-3-heading-7">용암지대</h4>
                <p>PvP 에서 쓸 일 없고 원소화랑 커맨드 겹칠 수 있어서 잠금</p>
              </div>
            </div>
          </div>

          {/* 커맨드로 사용시 이득이 있는 스킬 */}
          <div className="article-card">
            <h3 id="guide-20-section-3-heading-8">
              <span>⌨️</span> 커맨드로 사용시 이득이 있는 스킬
            </h3>

            <div className="article-callout">
              <h4 id="guide-20-section-3-heading-9">현자의 등대, 신속한 지진, 마나흡수</h4>
              <p>대부분의 비각기술 즉시 캔슬하고 발동됨</p>
              <p>(번개의창, 잔류번개, 지면의응답, 불비, 신속한지진은 캔슬불가)</p>
            </div>
          </div>

          {/* SC 스왑텔포 */}
          <div className="article-card">
            <h3 id="guide-20-section-3-heading-10">
              <span>🌀</span> SC 스왑텔포
            </h3>

            <div>
              <GuideImage src="/tip-images/위자드텔포.png" alt="위자드 텔포" />
            </div>

            <div>
              <p>공간이동 마우스 올려보면 커맨드가 3개 있음</p>

              <p>
                <span>Shift + Space</span>, <span>기술 사용중 Space</span>, <span>S+C</span>로
                사용하는 게 있는데
              </p>

              <div className="article-callout">
                <p>
                  <span>S+C</span>로 텔포 쓰면 비각→각성무기, 각성무기→비각무기로 바꾸면서 텔포
                </p>
                <p>
                  이거 모르면 보영쓰고 일반텔포 진입해서 업화로 스왑하다가 전방가드 뚫리고 바로
                  벌러덩하는 바보 위자드가 됩니다
                </p>
              </div>

              <div className="article-callout">
                <p>비각 슈아기술 안개, 지진에서 각성전환 하는데도 쓰입니다.</p>
                <p>⚠️ 필수로 익혀야 되는 커맨드!</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-20-section-4',
      title: 'PvP 콤보',
      content: (
        <>
          {/* 국룰 콤보 */}
          <div className="article-card">
            <h3 id="guide-20-section-4-heading-1">
              <span>🔥</span> 국룰콤보 (본: 파멸의불덩이 사용)
            </h3>

            <div className="article-callout">
              <div>
                <p className="command-line">
                  대재앙 → 업화 → 파멸의불덩이 → 용암폭렬 → 물의세례 → 수막폭렬 or 차가운파도
                </p>
                <div>
                  <p>💡 커맨드</p>
                  <p className="command-line">
                    Shift+F → W+F → S+F → 우클릭 유지 → 우클릭 유지 → Shift+좌클릭 or S+마우스
                    좌+우클릭
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 수막폭렬 콤보 */}
          <div className="article-card">
            <h3 id="guide-20-section-4-heading-2">
              <span>💧</span> 본: 수막폭렬 콤보 (솔라레/아르샤 등 소수전)
            </h3>

            <div>
              <div className="article-callout">
                <p>업화연계, 물구슬-물폭탄-물줄기 연계 등으로 피 압박</p>
              </div>

              <div className="article-callout">
                <h4 id="guide-20-section-4-heading-3">수막폭렬 경직 타이밍</h4>
                <p>
                  <strong>텔 or 원소화</strong> → <strong>수막폭렬</strong>
                </p>
                <p>
                  수막폭렬 경직 타이밍은 <strong>1타가 아니라 2타에서 경직생김</strong>
                </p>
                <p className="command-line">타/ → 타 ← /다다다닥</p>
              </div>

              <div className="article-callout">
                <h4 id="guide-20-section-4-heading-4">경직 걸리면 (0.7CC)</h4>
                <ul>
                  <li>
                    • <strong>마력회피 물줄기</strong> OR
                  </li>
                  <li>
                    • <strong>마력회피나 원소화 물구슬</strong> OR
                  </li>
                  <li>
                    • <strong>원소화 대재앙</strong> (1.4~1.7CC)
                  </li>
                </ul>
                <p>
                  연계가 빡빡하면 1차 라밤 힐(현자의 등대) 포기하고 라밤 화염구(현자의 심장)도
                  쓸만함
                </p>
              </div>

              <div className="article-callout">
                <h4 id="guide-20-section-4-heading-5">이후 남아있는 스킬로 연계</h4>
                <div>
                  <div className="article-callout">
                    <p>1순위</p>
                    <p>업화 → 파멸의불덩이 → 용암폭렬 → 파도 → 세례</p>
                  </div>
                  <div className="article-callout">
                    <p>2순위</p>
                    <p>대재앙 → 파도 → 세례</p>
                  </div>
                  <div className="article-callout">
                    <p>3순위 (진짜 스킬 아무것도 없을때)</p>
                    <p>물구슬 → 물구슬 → 물폭탄 → 용암폭렬 → 세례</p>
                    <p>
                      * 물구슬 2번 쓰는 이유: 물구슬→물폭탄 바로하면 에어스매쉬 터지고 넉다운
                      바로끝나버림
                    </p>
                  </div>
                </div>
              </div>

              <div className="article-callout">
                <p>
                  💡 본수막 빌드는 압박하면서 얻어 걸리는 경직에 연계하는 거라 스킬을 유동적으로
                  써야 함
                </p>
              </div>
            </div>
          </div>

          {/* 기타 짤팁 */}
          <div className="article-card">
            <h3 id="guide-20-section-4-heading-6">
              <span>💡</span> 기타 짤팁
            </h3>

            <div>
              {/* 팁 1 */}
              <div className="article-callout">
                <h4 id="guide-20-section-4-heading-7">1. 물의 세례 활용</h4>
                <p>물의 세례는 단독 사용해도 연계 속도에서 손해 없음</p>
                <p>
                  회피캐 상대로 슈아 유지할 때 <strong>대재앙→물의세례</strong> 이런 식으로 미리
                  회깎 묻혀 두면 좋음
                </p>
              </div>

              {/* 팁 2 */}
              <div className="article-callout">
                <h4 id="guide-20-section-4-heading-8">2. 파멸의 불덩이 팁</h4>
                <p>
                  업화/물줄기 연계로 파불 던지면 무조건 본인 발 바로 앞에 떨어지기 때문에 거리가
                  짧다
                </p>
                <p>
                  그래서 스탠딩 딜견제 할 때는 업화 파불 연계 잘 안 씀 (안 맞는 경우가 너무 많음)
                </p>
                <p>
                  업화 용암폭렬 정도만 쓰고 파불은 슈아 유지 스킬로 따로 굴리는 게 느려도 맞추는 건
                  더 잘 맞을 수 있음
                </p>
                <div>
                  <GuideImage src="/tip-images/위자드짤팁.png" alt="위자드 파불 사거리" />
                </div>
                <p>사거리 대충 이런 느낌</p>
              </div>

              {/* 팁 3 */}
              <div className="article-callout">
                <h4 id="guide-20-section-4-heading-9">3. 유성낙하</h4>
                <p>
                  <strong>진 유낙 찍지 말고 일반 유낙으로 사용</strong>
                </p>
                <div>
                  <div>
                    <span>❌</span>
                    <div>
                      <p>
                        <strong>진유낙</strong>
                      </p>
                      <p>
                        30초쿨, 시전 중 전방가드, <strong>공격 중 방어판정 없음</strong>
                      </p>
                    </div>
                  </div>
                  <div>
                    <span>✅</span>
                    <div>
                      <p>
                        <strong>일반 유낙</strong>
                      </p>
                      <p>
                        1분30초쿨, 시전 중 전방가드, <strong>공격 중 슈퍼아머</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 팁 4 */}
              <div className="article-callout">
                <h4 id="guide-20-section-4-heading-10">4. 맨몸 지팡이 WW이동</h4>
                <p>써보면 알겠지만 이게 속도 버프 다 땡기면 위자드 이동기 중에 제일 빠름</p>
                <p>
                  그래서 누운 아군 보이면 이거로 적당히 안 맞고 버프 넣을 만한 위치까지 가서 보영
                  써주면 좋음
                </p>
                <p>
                  자이한테 잡힌 아군한테 써줄 때는 굉장히 유용함. 우리 팀 잡고 있는 적 자이는 날 못
                  때리니까 (솔라레 이야기)
                </p>
                <p>⚠️ 거점에서는 눈먼 cc 맞을 수 있으니까 알잘딱하기</p>
                <div>
                  <GuideImage src="/tip-images/wwmove.png" alt="위자드 WW 이동" />
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-20-section-5',
      title: '특화 및 수정',
      content: (
        <>
          <div>
            {/* 특화 */}
            <div className="article-card">
              <h3 id="guide-20-section-5-heading-1">
                <span>⚡</span> 특화
              </h3>

              {/* 무제한 특화 */}
              <div>
                <h4 id="guide-20-section-5-heading-2">무제한 특화</h4>
                <div>
                  <GuideImage src="/tip-images/위자드특화.png" alt="위자드 특화" />
                </div>
              </div>

              {/* 솔라레 특화 */}
              <div>
                <h4 id="guide-20-section-5-heading-3">솔라레 특화</h4>
                <div>
                  <GuideImage src="/tip-images/위자드솔라레.png" alt="위자드 솔라레 특화" />
                </div>
              </div>
            </div>
          </div>

          {/* 수정 */}
          <div className="article-card">
            <h3 id="guide-20-section-5-heading-4">💠 수정</h3>

            <div>
              {/* 적중 세팅 */}
              <div>
                <h4 id="guide-20-section-5-heading-5">적중 세팅</h4>
                <div>
                  <GuideImage src="/tip-images/위자드적중.png" alt="위자드 적중 세팅" />
                </div>
              </div>

              {/* 국룰 세팅 */}
              <div>
                <h4 id="guide-20-section-5-heading-6">국룰 세팅</h4>
                <div>
                  <GuideImage src="/tip-images/위자드국룰.png" alt="위자드 국룰 세팅" />
                </div>
              </div>

              {/* 극공 세팅 */}
              <div>
                <h4 id="guide-20-section-5-heading-7">극공 세팅</h4>
                <div>
                  <GuideImage src="/tip-images/위자드극공.png" alt="위자드 극공 세팅" />
                </div>
              </div>
            </div>

            {/* 수정 설명 */}
            <div>
              <div className="article-callout">
                <h4 id="guide-20-section-5-heading-8">훔은 사용하지 않음</h4>
                <p>
                  위자드는 훔 쓴다고 생존력 크게 늘어나지 않음. 차라리 오는 적 죽이는 게 더 생존력
                  더 좋음
                </p>
                <p>훔 쓰실거면 피감 20퍼 Q피감 30인가 달린 각성 위치 하시면 됩니다.</p>
              </div>

              <div className="article-callout">
                <h4 id="guide-20-section-5-heading-9">1순위로 빼는 수정은 최대생명력 수정</h4>
                <p>이거 빼고 딜 투자 더해야 여러분이 생각하는 위자드 그 딜이 나옴</p>
                <p>빠진 체력은 강고래, 힐로 버티면 됨</p>
                <p>
                  <strong>본인이 강고래 안 먹는 쌀숭이다 = 최생 끼세요</strong>
                </p>
              </div>
            </div>
          </div>

          {/* 군왕 재련석 */}
          <div className="article-callout">
            <h4 id="guide-20-section-5-heading-10">⚔️ 군왕 재련석</h4>

            <div>
              <div className="article-callout">
                <h5>고정 추천</h5>
                <div className="article-grid">
                  <div className="article-callout">
                    <p>모든 공격력</p>
                  </div>
                  <div className="article-callout">
                    <p>모든 피해 감소</p>
                  </div>
                  <div className="article-callout">
                    <p>치명타 확률</p>
                  </div>
                </div>
              </div>

              <div className="article-callout">
                <h5>권장 (남은 두 슬롯)</h5>
                <div className="article-grid">
                  <div className="article-callout">
                    <p>치명타 피해</p>
                  </div>
                  <div className="article-callout">
                    <p>흑정 회복</p>
                  </div>
                </div>
              </div>

              <div className="article-callout">
                <h5>취향따라 선택</h5>
                <div className="article-grid">
                  <div className="article-callout">
                    <p>최대 생명력</p>
                  </div>
                  <div className="article-callout">
                    <p>적중력</p>
                  </div>
                  <div className="article-callout">
                    <p>다운피해</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-20-section-6',
      title: '하고싶은말',
      content: (
        <>
          <div className="article-card">
            <div>
              <p>
                <strong>SC 스왑텔포</strong>를 반드시 익히시고,
                <strong>슈아 유지</strong>를 통해 안정적인 딜링을 하세요.
              </p>
              <p>처음엔 어려울 수 있지만 포기하지 마시고 꾸준히 연습하시면 됩니다.</p>
            </div>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-20-section-2-heading-1',
      title: '장점',
      section: 'guide-20-section-2',
    },
    {
      id: 'guide-20-section-2-heading-2',
      title: '단점',
      section: 'guide-20-section-2',
    },
    {
      id: 'guide-20-section-3-heading-1',
      title: '필수 퀵슬롯',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-2',
      title: '순간이동',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-3',
      title: '지진, 차가운안개, 유성낙하',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-4',
      title: '물구슬, 아네, 마그소환',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-5',
      title: '잠구는 스킬',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-6',
      title: '아네, 마그 소환',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-7',
      title: '용암지대',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-8',
      title: '커맨드로 사용시 이득이 있는 스킬',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-9',
      title: '현자의 등대, 신속한 지진, 마나흡수',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-3-heading-10',
      title: 'SC 스왑텔포',
      section: 'guide-20-section-3',
    },
    {
      id: 'guide-20-section-4-heading-1',
      title: '국룰콤보 (본: 파멸의불덩이 사용)',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-2',
      title: '본: 수막폭렬 콤보 (솔라레/아르샤 등 소수전)',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-3',
      title: '수막폭렬 경직 타이밍',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-4',
      title: '경직 걸리면 (0.7CC)',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-5',
      title: '이후 남아있는 스킬로 연계',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-6',
      title: '기타 짤팁',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-7',
      title: '1. 물의 세례 활용',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-8',
      title: '2. 파멸의 불덩이 팁',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-9',
      title: '3. 유성낙하',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-4-heading-10',
      title: '4. 맨몸 지팡이 WW이동',
      section: 'guide-20-section-4',
    },
    {
      id: 'guide-20-section-5-heading-1',
      title: '특화',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-2',
      title: '무제한 특화',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-3',
      title: '솔라레 특화',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-4',
      title: '수정',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-5',
      title: '적중 세팅',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-6',
      title: '국룰 세팅',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-7',
      title: '극공 세팅',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-8',
      title: '훔은 사용하지 않음',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-9',
      title: '1순위로 빼는 수정은 최대생명력 수정',
      section: 'guide-20-section-5',
    },
    {
      id: 'guide-20-section-5-heading-10',
      title: '군왕 재련석',
      section: 'guide-20-section-5',
    },
  ],
}
export default content
