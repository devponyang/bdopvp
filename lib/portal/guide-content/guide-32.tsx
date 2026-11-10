import GuideImage from '@/components/portal/guide/GuideImage'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: undefined,
  sections: [
    {
      id: 'guide-32-section-1',
      title: '소개',
      content: (
        <>
          <div>
            <p>
              안녕하세요! 2020년 9월부터 전승 소서러를 플레이하는{' '}
              <strong>아지다하카 길드 동방</strong>입니다!
              <br></br>개인사정으로 작년 12월부터 올해 8월까지 쉬다가 9월부터 간간히 다시하고
              있습니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-32-section-2',
      title: '전승소서란?',
      content: (
        <>
          <div>
            <p>
              전승소서는 <strong>하이브리드 캐릭터</strong>입니다. 기동성이 좋은편이 아니지만,
              근접전이나 다수전에서 강한 모습을 보입니다.
            </p>
            <p>
              근접전에서는 전승소서 특유의 빠른템포에 해둠, 유린등을 이용해서 더욱 강하게 상대를
              압박할 수 있습니다. 다수전에서는 역시 검은사막 최고회피기 밤까마귀가 있으니 어그로든,
              딜러든 1인분이 충분한 캐릭터입니다.
            </p>
            <p>
              전승소서는 뒷걸음 가드가 없는 캐릭터로서 플레이시 매우 높은 집중력을 요구한다고
              생각합니다. 스킬의 갯수가 단순하지만, 그만큼 상대방이 무엇을 할지 어느정도 예상을
              해야하고, 패턴을 파악하는 것이 중요합니다. 또한 이동기가 좋지 않지만 그만큼 붙어주는
              상대에 한해서 준영구로 밤까마귀를 사용할 수 있습니다.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-32-section-3',
      title: '전승 소서러 클래스의 장/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-32-section-3-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <strong>무쿨 회피기(밤까마귀 - 이하 밤까)의 존재</strong>
                <p>
                  검은사막내의 독보적인 회피기인 밤까마귀가 존재. 상대가 몇명이든 지구력과 파편이
                  있다면 무시 가능. 특히 상대 부속 증축이나 건설 때 꼬장이 매우 편함.
                </p>
              </li>
              <li>
                <strong>이론상 영구적인 밤까마귀 사용 가능</strong>
                <p>
                  어둠의 조각(이하 조각)을 확보하는 만큼 밤까마귀를 사용 가능. 이상적으로 타점이
                  있다면 어둠의 조각을 계속해서 회복할 수 있기 때문에 무한 밤까마귀 사용 가능.
                </p>
              </li>
              <li>
                <strong>상황에 따른 유연한 대처가 가능</strong>
                <p>
                  보유 스킬들이 연계 및 캔슬이 매우 자유롭기 때문에 파일럿에 따라 매우 다양하게 운영
                  가능.
                </p>
              </li>
              <li>
                <strong>다양한 실용적인 CC 존재</strong>
                <p>
                  넉다운 5개(강 : 해방된 어둠, 강 : 멸망의 꿈, 걍 : 핏빛재앙 2타, 극 : 그림자 분출,
                  차징 강 : 심연의 불꽃), 띄우기 2개(강 : 그림자 분출, 그림자 불꽃), 기절 2개(고통의
                  표식, 강 : 핏빛재앙 1타), 경직 2개(당겨진 멸망의 꿈, 즉발 강 : 심연의 불꽃), 넉백
                  1개(설치형 불길한 전조)
                </p>
              </li>
              <li>
                <strong>딜 교환이 우수함</strong>
                <p>
                  밤까-스킬-밤까의 구조를 지니고 있어서 상대의 스킬은 대부분 맞지 않으며 본인의
                  스킬을 상대에 다 꽂을 수 있음. 이로인한 딜적인 우위가 있음.
                </p>
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-32-section-3-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                <strong>기동성</strong>
                <p>
                  전승 소서러의 가장 큰 장벽 중 하나가 기동성임. 근래에 강 : 까마귀 돌진과 강 : 긴밤
                  지르기가 조각 사용 유무에 관계없이 거리 이동거리가 증가하는 버프를 받았지만,
                  여전히 부족함. 그리고 까마귀 돌진이 슈퍼아머 판정이 그렇게 길지 않기 때문에 타점
                  끝쪽에 스킬을 몰아 맞으면 슈퍼아머가 빨리 끊겨 cc맞음.
                </p>
                <p>
                  위의 말한 장점들이 기동성이라는 단점때문에 빛을 보지 못하는것도 있음. cc 및 딜교환
                  우수한 것도 결국 상대가 교전을 응해줘야하는데 멀리서 대치만 해버리면 맞기만 하고
                  cc를 걸지도 못하고 조각을 회복하지도 못함. 이는 아래 서술할 유지력 파트에서 한번
                  더 서술함.
                </p>
              </li>
              <li>
                <strong>유지력</strong>
                <p>
                  근래의 패치로 강 : 까마귀 불꽃 전방가드 → 슈퍼아머, 강 : 망자유린 전방가드 →
                  슈퍼아머로 바뀌어서 멀리서 타격하는 클래스나 거리를 내어주지 않는 클래스와의
                  대결이 매우 힘들어짐(eg 데드아이). 이전엔 전방가드로 스킬을 어느정도 막으면서
                  거리를 좁혔으나 이제는 멀리서 계속 맞아야함. 또한 어둠의 연격, 어둠의 업화의
                  쿨타임 증가 패치로 인한 전방가드 유지 자체가 많이 힘들어짐.
                </p>
                <p>
                  어둠 갈퀴 슈퍼아머 → 전방가드 로 바뀜. 어둠 갈퀴 같은 경우 강 : 어둠의 파도와 달리
                  화면에 따른 스킬 방향이 변하지 않아 사실상 쓰면 뒤를 잡아달라는 스킬이라 사실상
                  실전에서 사용하기 매우 어려워짐. 어둠 갈퀴는 1)체력 회복 2)조각회복 으로 중요한
                  역할을 하고 있었는데 사실상 산소통 1개가 사라진 상황.
                </p>
                <p>
                  또한 전승소서러의 핵심 cc 스킬인 강 : 까마귀 돌진 - 강 : 그림자 분출 연계로 cc를
                  걸 경우 조각 2개(파편 20개)를 사용하는데 맞추면 조각 +1개, 맞추지 못하면 조각
                  -2개라 사실상 밤까 횟수가 2번준다고 볼 수 있음. 예전에는 그나마 맞추기 편했으나
                  클래스들의 속도가 빨라지며 사실 맞추기 힘들어짐 → 유지력 감소
                </p>
              </li>
              <li>
                <strong>이동기 규칙 패치로 인한 이질적인 조작감</strong>
                <p>
                  소서러 클래스 자체가 밤까-스킬-밤까의 구조로 설계가 되어있음. 사실상 밤까마귀가
                  이동기라기보단 공격스킬의 하나라고 볼 수 있음. 하지만 이동기 규칙 패치로 인해
                  밤까가 스킬과 속도가 상이한 상황이 빈번해짐.
                </p>
              </li>
              <li>
                <strong>몸이 매우 약함</strong>
                <p>
                  전승 소서러는 회피캐릭터임에도 불구하고 맹공클래스로 분류되어 있음. 기동성이
                  낮은것과 시너지를 내어서 거리를 좁혀주지 않는 딜러들에게 매우 취약함.
                </p>
              </li>
              <li>
                <strong>이해할 수 없는 패치내역</strong>
                <p>
                  그림자 표적의 전방가드화, 조각 폭발의 슈퍼아머화와 같은, 패치 전에도 후에도 쓰지
                  않는 그냥 삭제를 해도 무방한 스킬들에 왜 패치를 하고 개선해줬다고 말하는지 이해가
                  안됨. 어둠의 뒷걸음 같은 사실상 도망가는데 사용하는 스킬을 전방가드 → 슈퍼아머로
                  바꾸면서 사실상 도망을 못가는 스킬로 바꾼다거나. 강 : 핏빛 재앙에 있던 적중
                  디버프를 완전 근접스킬인 강 : 까마귀 불꽃에 주거나(사실상 디버프를 쓸수가없음).
                  대치상황에서 전방가드로 사용하는 스킬인 강 : 어둠의 업화, 극 : 어둠의 업화를 딜로
                  쓰라고 계수를 올린다거나(해당 스킬은 딜로 쓰는 순간 전방가드기 부족해서 쓰임이
                  안됨)
                </p>
              </li>
              <li>
                <strong>강 : 핏빛재앙의 2cc독점 및 까마귀 습격의 바운드 삭제</strong>
                <p>
                  핏빛 재앙에 1타기절 2타 넉다운이 들어오면서 사실상 cc 셔틀로 전락해버림. 기존의
                  까마귀 습격은 밤까 이후 변칙적인 움직임으로 근접한 상대에게 카운터를 칠 수 있던
                  무쿨 cc기 였는데 사실상 스킬이 삭제됨.
                </p>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-32-section-4',
      title: '운영법',
      content: (
        <>
          {/* 거점전 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>⚔️</span>
              </div>
              <h3 id="guide-32-section-4-heading-1">거점</h3>
            </div>

            <div>
              <p>
                신거점/구거점 모두 대부분 부속 증축/설치 꼬장에 사용. 기동성 부족 및 물몸으로 인해
                본대합류 이슈가 있음. 전투에 합류할 경우 본대보다는 특임조 같은경우로 포지션을
                선진입 포지션으로 잡아 강 : 핏빛재앙을 이용한 cc 셔틀로 사용함.
              </p>
            </div>
          </div>

          {/* 솔라레 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>🌟</span>
              </div>
              <h3 id="guide-32-section-4-heading-2">솔라레</h3>
            </div>

            <div>
              <p>
                최대한 처음에 조각버프(공+30)을 팀원에게 주고, 근래에 버프를 받은 시전 중 슈퍼아머인
                강 멸망의 꿈을 사용해 딜지원. 슬롯 강 :핏빛 재앙을 사용하여 카운터 cc도 가능.
                마이크를 사용하며 cc카운트 해주는 식으로 플레이.
              </p>
            </div>
          </div>

          {/* 길드리그 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>🏆</span>
              </div>
              <h3 id="guide-32-section-4-heading-3">길드리그</h3>
            </div>

            <div>
              <p>
                기동성이 부족하기 때문에 현재 탱커 메타인 경우 사실상 픽하는것 자체가 매우 민폐인
                클래스. 팀원들이 모두 본인의 발을 맞춰줘야 하는데 그것 자체가 쉽지 않음. 길드리그는
                딜러 캐치게임이라서 특수함.
              </p>
            </div>
          </div>

          {/* 상황별 운영법 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>🎮</span>
              </div>
              <h3 id="guide-32-section-4-heading-4">상황별 운영법</h3>
            </div>

            {/* 1대1 */}
            <div className="article-callout">
              <h4 id="guide-32-section-4-heading-5">
                <span>⚔️</span> 1대1
              </h4>

              <div>
                <div className="article-card">
                  <p>
                    어떤 상대와 싸우든 <strong>긴밤지르기의 치명타확률 증가버프는 유지</strong>
                    하셔야합니다.
                  </p>
                </div>

                <div className="article-card">
                  <p>
                    상대가 빠른클래스면서 뒤를 잡기 용이한 클래스인 경우{' '}
                    <strong>어둠 갈퀴는 무조건 쓰지 않고</strong>,{' '}
                    <strong>어둠의 파도는 최대한 자제</strong>해서 사용해 줍시다.
                  </p>
                </div>

                <div className="article-card">
                  <p>
                    회피캐랑 붙는 경우 <strong>유린에 회깎을 무조건 붙여</strong> 줍시다.
                  </p>
                </div>

                <div className="article-card">
                  <p>
                    시속디버프를 고려한다면(특히 아르샤의 창){' '}
                    <strong>파도나 유린에 공시속디버프를 넣는것</strong>이 좋습니다. 파도에는 이미
                    공시속디버프가 존재하고, 유린은 슈퍼아머기 때문에 공시속디버프를 묻히기
                    쉽습니다.
                  </p>
                </div>

                <div className="article-card">
                  <p>
                    1대1시에 가장 중요한건 딜도 딜이지만{' '}
                    <strong>시속버프와 이속버프가 가장 중요</strong>합니다. 둘중에 하나라도 디버프를
                    맞을 경우 밤까-스킬-밤까의 구조를 지닌 소서러가 플레이하기 매우 힘든 상황이 오기
                    때문입니다. 최대한 디버프를 파도로 맞대응 해줍시다.
                  </p>
                </div>

                <div className="article-card">
                  <p>
                    그리고 어떤 스킬을 사용하든 <strong>최대한 상대를 맞추셔야합니다</strong>.
                    그래야 밤까마귀를 더 쓸 수 있습니다. 극분출, 극업화, 유린을 제외하곤 모두 조각이
                    회복되기 때문에 최대한 맞추는 버릇을 들이도록 합시다. 상대 가드를 깨는게 목적이
                    아닌 본인의 조각을 채우고 밤까를 더하기 위해.
                  </p>
                </div>

                <div className="article-card">
                  <p>
                    cc는{' '}
                    <strong>
                      밤까-그불-밤까, 밤까-해둠-밤까, 파도or연격or업화 - 극분출, 당멸, 핏재카운터,
                      까돌-분출
                    </strong>
                    로 걸어줍시다.
                  </p>
                  <p>
                    그리고 딜교시에 상대가 잡기가 빠지거나 본인이 시속버프가 충분하다면{' '}
                    <strong>유린으로 딜교</strong>를 해줍시다.
                  </p>
                </div>

                <div className="article-card">
                  <p>
                    방막캐와 상대할 시에는 상대 잡기가 빠진것을 보고 <strong>유린을 사용</strong>
                    하도록 합시다. 가드를 깨서 잡고싶으면 <strong>심불을 자주 써주면</strong>{' '}
                    됩니다.
                  </p>
                  <p>저는 심불을 그렇게 자주쓰는 스타일이 아니라서 이건 본인 스타일대로!</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-32-section-5',
      title: 'PvP 콤보 및 이니시',
      content: (
        <>
          <div className="article-callout">
            <p>※ 콤보는 참고용으로, 상황에 따라 유연하게 사용하시면 됩니다.</p>
          </div>

          <div>
            {/* PvP 콤보 */}
            <div className="article-callout">
              <h3 id="guide-32-section-5-heading-1">PvP 콤보</h3>
              <div className="article-callout">
                <GuideImage src="/tip-images/전승소서러pvp.png" alt="전승 소서러 PvP 콤보" />
              </div>

              {/* 1cc 시작 콤보 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-2">1cc 시작 콤보</h4>
                <div className="article-callout">
                  <p>
                    <strong>1cc 시작</strong> (강멸꿈, 까돌-분출, 그불, 해둠, 핏재 1타) - 파도 1타 -
                    유린쓰면서 긴밤(0.7cc) - 연격 - 극분출(1cc) - 까불 - 부리차기 - 포획 - 심불 -
                    갈퀴 - 덮어
                  </p>
                </div>
              </div>

              {/* 0.7cc 시작 콤보 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-3">0.7cc 시작 콤보</h4>
                <div className="article-callout">
                  <p>
                    <strong>0.7cc 시작</strong> (당멸) - 까돌(진입)- 분출(1cc) - 유린 - 업화1타 -
                    해둠(1cc) - 까불 - 부리차기 - 포획 - 심불 - 갈퀴 -덮어
                  </p>
                </div>
              </div>
            </div>

            {/* 주로 사용하는 진입기 */}
            <div className="article-callout">
              <h3 id="guide-32-section-5-heading-4">
                <span>🚀</span> 주로 사용하는 진입기
              </h3>

              <div className="article-grid">
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <span>1</span>
                    </div>
                    <p>진입기 1</p>
                  </div>
                  <div className="article-callout">
                    <p>덮어(라밤 2차)</p>
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
                    <p>강 : 까마귀 돌진(까돌)</p>
                  </div>
                  <p>1cc 시동기는 대부분 까마귀 돌진-분출로 합니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 스킬 활용 */}
          <div className="article-callout">
            <h3 id="guide-32-section-5-heading-5">
              <span>🎯</span> 스킬 활용
            </h3>

            <div>
              {/* 강 : 어둠의 파도 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-6">강 : 어둠의 파도</h4>
                <p>
                  각성소서의 카르티안의 악몽 포지션을 가지는 스킬입니다. 리부트이전에는 맨몸판정이라
                  1대1 콤보 초반에 사용했지만 리부트 이후에 전방가드 판정을 받으면서 전승소서의
                  핵심딜링스킬 중 하나가 되었습니다.
                </p>
                <p>
                  파도같은 경우 채널링스킬이며 전방가드스킬이기 때문에 각성위치의 고르굴리기를
                  쓰는방식과 비슷하게 벽을 등지고 쓰는게 가장 안정적입니다. 최대한 쓸 수 있다면
                  마지막 타격까지 쓰면 좋지만 굳이 꼭 막타를 쓸 필요는 없습니다.
                </p>
                <p>
                  사용은 대치할 때, 벽을 등질 때, 3분켰을 때 입니다. 눈앞에서 쓰면 생각보다 모션이
                  길기 때문에 잡기와 뒤잡히기에 취약한 상태가 됩니다. 가까이서 쓰는건 상대가 잡기가
                  빠졌거나, 조각이 없을 때 조각회복용도로 쓰시는 것을 추천드립니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 특화:</strong> 시속증가 특화가있으면 더욱 빠르게 딜을 넣을 수 있기
                    때문에 어떤 특화를 해도 파도 시속특화는 무조건 추천드립니다.
                  </p>
                </div>
              </div>

              {/* 강 : 해방된 어둠 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-7">강 : 해방된 어둠</h4>
                <p>
                  리메이크 이후 CC기면서 콤보 딜량의 큰 부분을 차지하는 스킬이 되었습니다. 비비면서
                  백어택 해둠이 딜이 정말 쏠쏨합니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 특화:</strong> 백어택피해량, 다운어택피해량, 치명타피해량 중 택2
                  </p>
                </div>
              </div>

              {/* 강 : 긴밤 지르기 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-8">강 : 긴밤 지르기</h4>
                <p>
                  전승소서 핵심스킬입니다. 이동기이기도하면서 버프스킬이기도 합니다. 치명타보정과
                  딜이 부족한 전승소서는 긴밤지르기 버프를 유지하는 것이 필수입니다. 대치중일 때
                  긴밤버프를 상시로 돌려줘야 쓸만한 딜이 나옵니다. 그래서 긴밤지르기 버프를 얼마나
                  잘 유지하냐가 숙련도를 나타낼 수 있는 지표라고 생각합니다. 교전시에 혹은 교전중에
                  긴밤버프를 유지할 수 있도록 연습을 충분히 하셔야 합니다. 저랑 자유결투장에서 혹은
                  제 영상을 보신분은 아시겠지만 제가 습관처럼 긴밤-업화 연계를 통해 긴밤의 치명타
                  버프를 유지하는것을 보셨을 겁니다. 전승소서의 가장 핵심스킬이기 때문에 최대한
                  유지하시는것을 추천드립니다.
                </p>
                <p>
                  이동기로 사용시에는 까돌을먼저 쓴 후 긴밤을 쓰는것이 낫습니다. 아니면 교전전에
                  치확버프를 땡기면서 합류할 때 사용하는 것이 좋습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 덮어-긴밤, 1cc이후 긴밤
                  </p>
                  <p>
                    <strong>추천 특화:</strong> X
                  </p>
                </div>
              </div>

              {/* 강 : 까마귀 돌진 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-9">강 : 까마귀 돌진</h4>
                <p>
                  강까돌은 전승소서의 유일한 이동기면서도 진입기입니다. 까돌-분출 연계기로 사용할 수
                  있으며 어떻게 보면 전승소서 cc 핵심위치에 있다고 볼 수 있습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 까돌-분출(CC), 덮어 - 까돌 - 긴밤(이동기)
                  </p>
                  <p>
                    <strong>추천 특화:</strong> X
                  </p>
                </div>
              </div>

              {/* 강 : 핏빛 재앙 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-10">강 : 핏빛 재앙</h4>
                <p>
                  핏재는 딜량이 정말 답이없기 때문에, 딜링보다는 CC를 걸거나 특화를 땡기는 식으로
                  사용합니다. 해당 스킬에 특화를 어떤것을 다냐에 따라 본인의 성향이 나타날 수
                  있습니다. 본인이 공격적인 성향이 강한 경우 공격적인 특화를, 서포팅적인 성향이 강한
                  경우 팀에게 유리한식으로 특화를 짤 수 있습니다. 어느것이든 좋았으니 입맛에 따라
                  하시면 될 것 같습니다.
                </p>
                <p>
                  핏재는 피흡 슈아스킬로 딜은 약하지만 다양하게 사용할 수 있습니다. 지구력이 없을 때
                  써주면 슈아를 최대한 끌어 쓸 수 있습니다.(지구력 회복은 안됨).
                </p>
                <p>사용방법은 퀵슬롯 핏빛재앙과 커맨드 핏빛재앙이 있습니다.</p>
                <p>
                  슬롯 핏재는 슈퍼아머 모션이 더 길어 슈아끌기가 가능하지만 순간적인 잡기에 취약해서
                  근처에 있을 경우 쓰는것은 좋지 않은 선택일 수 있습니다.(ex 작열잡기)
                </p>
                <p>
                  커맨드 핏재는 모션이 빠르다는 장점이 있습니다. 전소의 체력이 부족할 때 몹이나
                  유저에게 사용하면 빠르게 피를 회복할 수 있습니다. 단 슬롯 핏빛재앙보다 슈아모션이
                  짧습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 특화:</strong> 이속증가, 방어력증가, 방어력감소(다수전 시),
                    회피력감소(다수전시)
                  </p>
                </div>
              </div>

              {/* 강 : 어둠의 연격 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-11">강 : 어둠의 연격</h4>
                <p>
                  전승소서의 지구력을 버는 소중한 스킬들 중 하나입니다. 연격은 쓸 수 있을 때 최대한
                  써주는 것이 좋으며 3타까지 전방가드이기때문에 연격스킬을 3타까지 쓸 환경을 만들어
                  주는 것이 중요합니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 연계:</strong> 긴밤-연격3타, 포획-연격3타, 긴밤-연격3타-극분출
                  </p>
                  <p>
                    <strong>추천 특화:</strong> X
                  </p>
                </div>
              </div>

              {/* 강 : 어둠의 업화 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-12">강 : 어둠의 업화</h4>
                <p>
                  전승소서의 지구력을 버는 소중한 스킬들 중 하나입니다. 유린 뒤에 좌클릭을해서
                  추가타처럼 써도 되고, 긴밤-업화 연계로 안전하게 긴밤버프를 땡기는 식으로 사용할 수
                  있습니다. 저는 긴밤-업화를 자주 사용하네요. 업화 또한 마찬가지로 모션이 길기
                  때문에 상대방과의 거리가 멀때 혹은 뒤에 벽이있을 때 사용하는 것이 좋습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 긴밤-업화, 유린-업화
                  </p>
                  <p>
                    <strong>추천 특화:</strong> X
                  </p>
                </div>
              </div>

              {/* 전승 : 극 : 어둠의 업화 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-13">전승 : 극 : 어둠의 업화</h4>
                <p>
                  전승소서의 지구력을 버는 소중한 스킬들 중 하나입니다. 리부트 이전에는 넉다운 cc가
                  있어서 다가오는 상대한테 마컨으로 카운터cc를 넣을 수 있는데 패치이후로
                  전방가드용도 밖에 없습니다. 극업화는 긴밤 - 업화 - 극업화 연계로 긴밤버프와
                  조각버프를 모두 땡길 수 있는 수단입니다. 뒤에 벽이 있지않은이상 근접에서
                  사용하는것은 비추합니다. 모션이 크고 사용도중 밤까가 되지 않습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 긴밤-업화-극업화(거리벌렸을 때),
                    유린-업화-극업화(안전할 경우)
                  </p>
                  <p>
                    <strong>추천 특화:</strong> X
                  </p>
                </div>
              </div>

              {/* 전승 : 부리 차기 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-14">전승 : 부리 차기</h4>
                <p>
                  까불or그불-부리차기-포획 연계시 항상 사용하는 스킬입니다. 평상시 보다는 콤보시에
                  사용을 하는것을 추천합니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 까불-부리차기, 그불-부리차기
                  </p>
                  <p>
                    <strong>추천 특화:</strong> 회깎 치명타피해량
                  </p>
                </div>
              </div>

              {/* 강 : 까마귀 불꽃 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-15">강 : 까마귀 불꽃</h4>
                <p>
                  전승소서 핵심스킬중 하나입니다. 슈퍼아머로 패치되기 이전엔 까불을 잘쓰는 정도가
                  전승소서의 숙련도를 나타냈지만 이제는 디버프도 사라졌고 슈퍼아머로 바뀌었기 때문에
                  크게 문제될것이 아닙니다. 지구력 유지를 위해서 슈퍼아머 모션을 끄는것이
                  중요합니다.
                </p>
                <p>
                  또한 까마귀불꽃은 방어 뿐만아니라 다른스킬모션을 스킵하는데도 사용합니다. 당멸
                  이후 캐릭터가 밀려나는거나, 분출 후딜을 캔슬하는 등 여러가지 스킬들의 후딜레이를
                  줄일 수 있습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 밤까-까불-밤까
                  </p>
                  <p>
                    <strong>추천 특화:</strong> 적깎, 치피
                  </p>
                </div>
              </div>

              {/* 강 : 그림자 분출 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-16">강 : 그림자 분출</h4>
                <p>
                  전승소서의 cc핵심 스킬입니다. 기본적으로 밤까-분출-밤까의 메커니즘을 가지고 있고
                  툴팁에 적혀있는 것 처럼 까마귀돌진과 주로 사용합니다. 제가 자유결투장에서
                  직접만난분들에게는 많이 설명을 해드리긴했는데, 전승소서가 상대 뒤잡을 할 수 있는
                  유일한 스킬이 까마귀돌진-분출 연계입니다. 각성소서의 도약-긴밤처럼 사용이 가능하고
                  도약-긴밤보다 훨씬 안정적입니다. 이전에는 분출이 슈퍼아머라 안정적이었지만,
                  조각버프 갱신 및 전방가드로 바뀌면서 적절한 타이밍에 사용하는게 중요해졌습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬 연계:</strong> 분출-유린, 분출-까불, 분출-당멸-그불
                  </p>
                  <p>
                    <strong>추천 특화:</strong> 치확, 인추, 적중, 회깍, 방깍
                  </p>
                </div>
              </div>

              {/* 전승 : 극 : 그림자 분출 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-17">전승 : 극 : 그림자 분출</h4>
                <p>
                  전승소서의 CC스킬 중 하나입니다. 사정거리가 은근 길고, 범위도 매우 좋기 때문에
                  럭키 CC로 잘 걸립니다. 거리가 긴 이점을 사용하여 당멸 같이 원거리에서 경직을
                  넣는데 성공했을 경우 파도-극분출로 다음 cc를 이을 수 있습니다. 솔라레 시 팀원이
                  cc를 넣은거에 극분출을 통해 넉다운 cc를 추가로 넣어 보조를 할 수도 있습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>스킬 연계:</strong> 극:어둠의 업화 - 극분출(좌클), 까불 - 극분출(좌클),
                    연격3타 - 극분출(좌클), 파도 - 극분출(좌클)
                  </p>
                </div>
              </div>

              {/* 강 : 심연의 불꽃 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-18">강 : 심연의 불꽃</h4>
                <p>
                  전승소서 핵심스킬 중 하나입니다. 한방한방이 매우 강한스킬이고, 치명타보정도 매우
                  잘되어있기 때문에 특화가 따로 필요하지 않은 스킬입니다. 각성소서와 비교하자면 본을
                  찍지 않은 심판이라고 보면 될것 같습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 밤까-심불, 포획-심불
                  </p>
                  <p>
                    <strong>추천 특화:</strong> 치피, 시속, 방깎(1대1), 회깎(1대1)
                  </p>
                </div>
              </div>

              {/* 강 : 멸망의 꿈 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-19">강 : 멸망의 꿈</h4>
                <p>
                  전승소서 핵심스킬 중 하나입니다. 차징멸꿈 사용 시 매우 강력한 데미지를 낼 수
                  있습니다. 또한 당멸로 쓸 경우 즉발 광역 경직 cc라서 깜짝 cc로 사용 할 수 있습니다.
                  광역 스킬이기 때문에 디버프를 거는 용도로도 사용할 수 있습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 심불-멸꿈(심불로 특화땡기고 차징멸꿈), 분출-당멸
                  </p>
                  <p>
                    <strong>추천 특화:</strong> 치확, 방깎, 회깎, 공시속디버프
                  </p>
                </div>
              </div>

              {/* 강 : 망자 유린 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-20">강 : 망자 유린</h4>
                <p>
                  전승소서 핵심스킬 중 하나입니다. 전방가드 인 시절 쓸 때마다 뒤를 잡힐 위험이 있어
                  특화도 빼버리고 정말 안정적인 상황에서만 사용했는데, 이제 슈퍼아머기 때문에
                  자유롭게 사용해도 됩니다. 사용 시 지구력은 회복되진않지만, 다른 스킬들의 쿨타임을
                  벌 수 있습니다. 슈퍼아머 유지시간은 그리 넉넉한 편은 아닙니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬연계:</strong> 분출-유린, 덮어-유린
                  </p>
                  <p>
                    <strong>추천 특화:</strong> 방깎, 출혈(솔라레), 회깎, 치피
                  </p>
                </div>
              </div>

              {/* 강 : 그림자 포획 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-21">강 : 그림자 포획</h4>
                <p>
                  전승소서 콤보스킬 중 하나입니다. 회피율 감소 디버프가 있기 때문에 밤까-포획-밤까로
                  딜교를 해도 됩니다. 대신 후딜레이 캔슬이 다른 스킬들에 비해 느리기 때문에
                  연격3타나 덮어를 같이 쓰는 것이 좋습니다.
                </p>
                <div className="article-card">
                  <p>
                    <strong>추천 스킬 연계:</strong> 까불-부리 포획, 긴밤-포획-분출,
                    밤까-포획-연격3타-밤까, 밤까-포획-덮어
                  </p>
                  <p>
                    <strong>추천 특화:</strong> 회깎
                  </p>
                </div>
              </div>

              {/* 어둠 갈퀴 */}
              <div className="article-callout">
                <h4 id="guide-32-section-5-heading-22">어둠 갈퀴</h4>
                <p>
                  슈퍼아머 → 전방가드로 바뀐후 사장된 스킬이 되었습니다. 웬만하면 특화를 찍지
                  않는것을 추천드립니다. 사용할 때는 무조건 등을 지고 사용하는 것을 추천합니다.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-32-section-6',
      title: '수정 및 특화',
      content: (
        <>
          {/* 수정 */}
          <div className="article-callout">
            <h3 id="guide-32-section-6-heading-1">수정</h3>

            {/* 수정 이미지 */}
            <div className="article-callout">
              <GuideImage src="/ponyang/소서러수정.png" alt="소서러 수정" />
            </div>

            {/* 범용 세팅 */}
            <div className="article-callout">
              <h4 id="guide-32-section-6-heading-2">범용 세팅</h4>
              <p>기본적으로 위 이미지의 세팅을 사용합니다.</p>
            </div>

            {/* 적중이 필요한 경우 */}
            <div className="article-callout">
              <h4 id="guide-32-section-6-heading-3">적중이 필요한 경우</h4>
              <p>
                <strong>아디스 → 엘카르</strong>로 변경합니다.
              </p>
              <p>
                더 필요한 경우 <strong>강새벽적중</strong>을 추가합니다.
              </p>
            </div>

            {/* 공격이 더 필요한 경우 */}
            <div className="article-callout">
              <h4 id="guide-32-section-6-heading-4">공격이 더 필요한 경우</h4>
              <p>
                <strong>엘카르, 2혹한, 아디스</strong>를 빼고 <strong>4강마칼</strong>로 교체합니다.
              </p>
            </div>
          </div>

          {/* 특화 */}
          <div className="article-callout">
            <h3 id="guide-32-section-6-heading-5">특화</h3>

            {/* 특화 안내 */}
            <div className="article-callout">
              <p>
                말씀드리기에 앞서 특화는 본인의 취향을 매우 타는 영역입니다. 정답은 없으며 본인의
                플레이스타일을 정립하시고 그에 맞게 바꿔가시면 되겠습니다. 저같은 경우 특화를 짤 때
                제가 플레이 하는 영상을 계속해서 돌려보고 그에 맞게 짰습니다. 또한 본인의 역할군에
                따라 또 다르기 때문에! 무조건 직접 짜보길 추천드립니다.
              </p>

              <p>저는 특화를 짤 때 다음과 같은 것을 고려합니다.</p>

              <div>
                <div className="article-card">
                  <p>
                    • 전승소서에게 가장 필요한 특화는 무엇인가? 해당특화를 상시로 유지할 수 있는가?
                  </p>
                </div>
                <div className="article-card">
                  <p>• 해당 스킬의 치확보정은 어느정도 되어있는가?</p>
                </div>
                <div className="article-card">
                  <p>• 특화끼리 겹치치는 않는가?</p>
                </div>
                <div className="article-card">
                  <p>• 디버프가 있는가?</p>
                </div>
                <div className="article-card">
                  <p>• 처음에 사용하는 스킬인가?</p>
                </div>
              </div>

              <p>
                위와 같은 것들을 고려하고 현재 상황이 1대1(혹은 소수전)인지, 제한공성인지,
                다수전인지 까지고려합니다. 다수전일수록 디버프보다는 버프쪽으로 특화를 짭니다.
                왜냐하면 다수전인 경우 혼자하는 것이 아닌 여러명이 하는것이기 때문에, 본인이 특정
                클래스군을 잡는 특화를 짜지않는이상 디버프를 많이 두를 필요가없습니다. cc에
                성공할경우 여러명이 때리면 대부분 죽기 때문이죠.
              </p>

              <div className="article-callout">
                <p>저는 전승소서에게 가장 필요한 특화는 시전속도 증가라고 생각합니다.</p>
                <p>
                  멸꿈 치명타확률보정 상향전에는 치명타확률이 정말 중요하다고 생각했으나, 이제
                  치명타 보정이 파도를 제외하고 대부분 25% 이상이기 때문에 우선순위에서 밀립니다.
                </p>
              </div>

              <p>
                시전속도가 중요한 이유는 파도는 채널링 시간을 줄이기 위해서, 멸꿈은 차징시간을
                줄이기 위해서, 그리고 상대와 대치시에 압박을 쉽게 하기 위해서 입니다. 시속버프가
                없는 상황에서 시속 디버프를 맞으면 몽마도 없는 전소로서 상황을 타개하기 매우
                힘들어지는 것을 많이 느꼈습니다.
              </p>

              <p>
                디버프 같은 경우 유린 방깎, 출혈 파도 공시속감소, 부리차기 적깎, 포획 회깎 등이
                있는데 실질적으로 유린 방깎을 제외하곤 크게 유의미하지 않다고 생각합니다.
              </p>

              <p>
                처음 사용하는 스킬은 이건 개인마다 다를 수 있습니다. 또한 상황따라 다르기 때문에
                정해진 답이 정말 없는데요. 저 같은 경우 분출, 당멸, 해둠, 그불로 cc를 걸고 대부분
                상대랑 비비면서 특화를 땡기는 스타일이라 무엇을 해도 상관없는,,? 이건 개인의
                취향이라고 생각합니다.
              </p>

              <div className="article-callout">
                <p>
                  위의 고려할 것들과 제가 생각하는 것들을 종합하여 짠 특화는 다음과 같습니다.
                  고정적으로 어둠의 파도는 치명타확률 버프와 시속버프를 씁니다. 채널링 스킬이자
                  치명타 확률보정이 하나도 없는 주 딜링스킬이기 때문에 짧은시간내에 최대한 많이 딜을
                  우겨넣기 위해서입니다. 본인이 cc걸림 위험에서도, 상대를 킬할 수 있는 가능성
                  측면에서도 시속특화가 가장 좋게 느껴졌습니다.
                </p>
              </div>
            </div>

            <div className="article-callout">
              <p>
                ※ 멸꿈의 최근 상향으로 치명타 확률 보정 50%가 생겨 기존의 치명타 확률 증가 특화를
                넣을 필요가 사라졌습니다. 군중에 던지기 때문에 방깎은 그대로 두고, 치명타 확률
                보정이 좋으니 치명타 피해량으로 조정합니다.
              </p>
            </div>

            {/* RvR 특화 */}
            <div className="article-callout">
              <h4 id="guide-32-section-6-heading-6">
                <span>⚔️</span> RvR 특화
              </h4>
              <div>
                <div className="article-callout">
                  <p>
                    <strong>핏빛재앙</strong>: 피해 감소 +, 이동 속도 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>어둠의 파도</strong>: 시전속도 증가, 치명타 확률 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>멸망의 꿈</strong>: 피해 감소 -, 치명타 피해량 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>그림자 분출</strong>: 치명타 확률 증가, 적중력 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>해방된 어둠</strong>: 다운어택 피해량 증가, 백어택 피해량 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>망자 유린</strong>: 피해 감소 -, 모든 회피력 -
                  </p>
                </div>
              </div>
            </div>

            {/* 솔라레 특화 */}
            <div className="article-callout">
              <h4 id="guide-32-section-6-heading-7">
                <span>🌟</span> 솔라레 특화
              </h4>
              <div className="article-callout">
                <p>※ 현재는 RvR과 동일하나 아래처럼 바꿀 생각이 있습니다.</p>
              </div>
              <div>
                <div className="article-callout">
                  <p>
                    <strong>핏빛재앙</strong>: 피해 감소 -, 이동 속도 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>망자 유린</strong>: 피해 감소 -, 피해 감소 +
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>멸망의 꿈</strong>: 피해 감소 -, 회피력 -
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>해방된 어둠</strong>: 치명타 피해량 증가, 백어택 피해량 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>어둠의 파도</strong>: 시전 속도 증가, 다운어택 피해량 증가
                  </p>
                </div>
                <div className="article-callout">
                  <p>
                    <strong>그림자 분출</strong>: 치명타 확률 증가, 적중력 증가
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 밸런스 세팅 */}
          <div className="article-callout">
            <h3 id="guide-32-section-6-heading-8">밸런스 세팅</h3>
            <div className="article-callout">
              <p>
                전승 소서러가 밸런스 세팅을 하는 경우 정말 쓸모 없는 클래스라고 생각합니다. 유일한
                장점이 딜인데 딜이 안되면 굳이..?
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-32-section-7',
      title: '하고싶은 말',
      content: (
        <>
          <div className="article-callout">
            <div>
              <p>
                사실 9월에 복귀후에 현실 이휴로 11월부터 솔라레도, 마클도, 파밍도, 거점/점령도 잘
                못하고 있네요.. 분명한 딜적인 장점이 있음에도 불구하고 앞서말한 단점들이 그 부분들을
                너무 크게 잡아먹어 현재 있는 유저도 줄고있는 마당입니다.
              </p>
              <p>
                유저가 떠나지 않도록 패치라도 캐릭터 특성에 맞게 해주면 좋겠는데 그 또한 이루어지지
                않고 있어서 답답할 따름입니다.. 하지만 확실히 특색있는 클래스이고 손맛이라는 확실한
                색채가 있는 클래스라 한번 빠지면 헤어나오기 어렵습니다.
              </p>
              <p>전승소서의 재미에 모두 빠져보세요!</p>
            </div>
          </div>
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-32-section-3-heading-1',
      title: '장점',
      section: 'guide-32-section-3',
    },
    {
      id: 'guide-32-section-3-heading-2',
      title: '단점',
      section: 'guide-32-section-3',
    },
    {
      id: 'guide-32-section-4-heading-1',
      title: '거점',
      section: 'guide-32-section-4',
    },
    {
      id: 'guide-32-section-4-heading-2',
      title: '솔라레',
      section: 'guide-32-section-4',
    },
    {
      id: 'guide-32-section-4-heading-3',
      title: '길드리그',
      section: 'guide-32-section-4',
    },
    {
      id: 'guide-32-section-4-heading-4',
      title: '상황별 운영법',
      section: 'guide-32-section-4',
    },
    {
      id: 'guide-32-section-4-heading-5',
      title: '1대1',
      section: 'guide-32-section-4',
    },
    {
      id: 'guide-32-section-5-heading-1',
      title: 'PvP 콤보',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-2',
      title: '1cc 시작 콤보',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-3',
      title: '0.7cc 시작 콤보',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-4',
      title: '주로 사용하는 진입기',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-5',
      title: '스킬 활용',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-6',
      title: '강 : 어둠의 파도',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-7',
      title: '강 : 해방된 어둠',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-8',
      title: '강 : 긴밤 지르기',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-9',
      title: '강 : 까마귀 돌진',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-10',
      title: '강 : 핏빛 재앙',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-11',
      title: '강 : 어둠의 연격',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-12',
      title: '강 : 어둠의 업화',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-13',
      title: '전승 : 극 : 어둠의 업화',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-14',
      title: '전승 : 부리 차기',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-15',
      title: '강 : 까마귀 불꽃',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-16',
      title: '강 : 그림자 분출',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-17',
      title: '전승 : 극 : 그림자 분출',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-18',
      title: '강 : 심연의 불꽃',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-19',
      title: '강 : 멸망의 꿈',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-20',
      title: '강 : 망자 유린',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-21',
      title: '강 : 그림자 포획',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-5-heading-22',
      title: '어둠 갈퀴',
      section: 'guide-32-section-5',
    },
    {
      id: 'guide-32-section-6-heading-1',
      title: '수정',
      section: 'guide-32-section-6',
    },
    {
      id: 'guide-32-section-6-heading-2',
      title: '범용 세팅',
      section: 'guide-32-section-6',
    },
    {
      id: 'guide-32-section-6-heading-3',
      title: '적중이 필요한 경우',
      section: 'guide-32-section-6',
    },
    {
      id: 'guide-32-section-6-heading-4',
      title: '공격이 더 필요한 경우',
      section: 'guide-32-section-6',
    },
    {
      id: 'guide-32-section-6-heading-5',
      title: '특화',
      section: 'guide-32-section-6',
    },
    {
      id: 'guide-32-section-6-heading-6',
      title: 'RvR 특화',
      section: 'guide-32-section-6',
    },
    {
      id: 'guide-32-section-6-heading-7',
      title: '솔라레 특화',
      section: 'guide-32-section-6',
    },
    {
      id: 'guide-32-section-6-heading-8',
      title: '밸런스 세팅',
      section: 'guide-32-section-6',
    },
  ],
}
export default content
