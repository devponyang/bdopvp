import GuideClip from '@/components/portal/guide/GuideClip'
import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'

export const rangerSections = [
  {
    id: 'introduction',
    title: '작성자 소개',
    content: (
      <>
        <p>
          안녕하세요 <strong>아지다하카</strong> 길드의 <strong>홍줭</strong>입니다!
          <br />
          저보다 잘 하시는 분들이 많은데도 이런 기회를 주셔서 감사하고, 알고 있는 지식은 최대한 다
          알려드리도록 노력할테니 도움이 되면 좋겠습니다!
        </p>
      </>
    ),
  },
  {
    id: 'strengths',
    title: '장점과 단점',
    content: (
      <>
        {/* 장점 */}
        <div className="article-card">
          <h3 id="ranger-strengths-1">
            <span>✅</span> 장점
          </h3>
          <ul>
            <li>
              <strong>원거리 딜링</strong>이 가능하고, <strong>지형 활용</strong>이 다른
              캐릭터들보다 좋은 편이라 포지셔닝이 잘 된다면 <strong>딜 포텐은 최상위권</strong>.
            </li>
          </ul>
        </div>

        {/* 단점 */}
        <div className="article-card">
          <h3 id="ranger-strengths-2">
            <span>⚠️</span> 단점
          </h3>
          <ul>
            <li>
              <strong>주력 딜링기들이 대부분 맨몸</strong>이라 잘 드러눕고 푹찍 당할 수 있음.
            </li>
            <li>
              공격쪽 투자 리턴이 높은만큼 <strong>약한 몸덩이</strong>.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'operation',
    title: '전장별 운영법',
    content: (
      <>
        <div className="article-card">
          <h3 id="ranger-operation-1">📝 짧은 요약</h3>
          <div>
            <div className="article-callout">
              <h4>⚔️ 거점 운영</h4>
              <p>
                앞라인 분들에게 감사하기 <strong>50%</strong>, 포지션이 <strong>40%</strong>, 나머지
                잡기술과 스킬 활용 등 <strong>10%</strong>.
              </p>
              <p>⚠️ 무리한 딜각 = 죽음</p>
            </div>

            <div className="article-callout">
              <h4>🌟 솔라레 & 길드리그 등의 소수전</h4>
              <p>
                최근 1년 넘게 소수전의 경험이 거의 없다보니 정보를 알려드리기엔 부족함이 많습니다.
              </p>
              <p>
                뇌피셜로 굴려보자면{' '}
                <strong>
                  방어쪽에 투자를 늘려 드리블의 안정성 높이면서 확실하고 안전한 딜각이 나올때만 딜
                  하는 방식
                </strong>
                으로 운영 할 것 같습니다. 부족한 부분은 추후에 보완하도록 하겠습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 3.1 공통 */}
        <div className="article-card">
          <h3 id="ranger-operation-2">
            <span>🔧</span> 3.1 공통
          </h3>

          <div>
            {/* 시야 넓히기 */}
            <div className="article-callout">
              <h4>3.1.1 시야 넓히기</h4>
              <p>
                <strong>연맹원, 파티원 이름 끄기 / 이펙트 최소화 / 미니맵 키우기</strong>
              </p>
              <p>
                화려한 이펙트들을 보면서 해도 좋지만, 눈에 들어오는 정보를 최소화 하면 상대방이 나를
                공격하러 오는지, 암살자가 보였는지 등의 구분이 빨라지고, 그로인해 반응속도도 빨라져{' '}
                <strong>상황 대응과 적군 포커싱(우선적으로 잡아야 할 상대 딜링)</strong>에도 도움이
                됩니다.
              </p>
            </div>

            {/* 프레임 올리기 */}
            <div className="article-callout">
              <h4>3.1.2 프레임 올리기</h4>
              <p>개인의 컴퓨터 사양과 상황에 맞게 프레임을 최대한 올려주는 세팅을 해줘야 합니다.</p>
              <p>
                <strong>
                  24.06.13일자 패치로 프레임이 높을수록 증가하던 공속의 증가폭이 줄었지만, 여전히
                  10% 이상의 차이가 날 수 있어요.
                </strong>
              </p>
            </div>

            {/* 텀벙이 입기 */}
            <div className="article-callout">
              <h4>3.1.3 텀벙이 입기, 키(커스터마이징) 키우기</h4>
              <ul>
                <li>• 점프력 상승과 수영속도 증가 펄옷으로 지형 활용에 도움!</li>
                <li>
                  • <strong>화살이 시작되는 z축이 올라가므로 상대 타격이 가능해져요!</strong>
                </li>
              </ul>
              <div>
                <GuideImage src="/tip-images/rangerh.png" alt="레인저 키 높이 예시" />
              </div>
            </div>
          </div>
        </div>

        {/* 3.2 딜링 */}
        <div className="article-card">
          <h3 id="ranger-operation-3">
            <span>⚔️</span> 3.2 딜링
          </h3>

          <div>
            {/* 기본은 미니맵 */}
            <div className="article-callout">
              <h4>3.2.1 기본은 모든 행동 중에 미니맵 보기</h4>
              <p>
                주력 딜링기들 대부분이 맨몸이라, 툭 치면 드러눕는 경우가 허다하기때문에,{' '}
                <strong>상대를 눕히고 딜을 하는 와중에도 미니맵 보고 냄새 맡기!</strong>
              </p>
            </div>

            {/* 포지션 잡기 */}
            <div className="article-callout">
              <h4>3.2.2 포지션 잡기</h4>
              <p>
                <strong>전장의 모든 지형 숙지는 필수!</strong> 유리한 지형 선정과 한타 중에도 안전한
                딜각 잡을 위치 잡기.
              </p>
              <div className="article-callout">
                <p>예시:</p>
                <p>
                  미리 거리 벌리기, 아군쪽으로 드리블하기, 구조물 올라가기, 화탑이나 코끼리 주변에
                  있기 등
                </p>
              </div>
              <p>
                거점을 예로 들자면 나무 위에서 공격할 수 있는 포인트들과, 상대방이 공격하기 어려운
                바위 등을 파악해두고 사거리가 어디까지 닿는지도 확인해두시면 좋습니다!
              </p>
              <p>
                💡 연맹 혹은 길드마다 조합과 스타일이 다르기때문에, 여러 시도를 통해 적절한 포지션을
                찾아가셔야 합니다!
              </p>
            </div>

            {/* 쿨 상황따라 스킬 사용 */}
            <div className="article-callout">
              <h4>3.2.3 쿨 상황따라 스킬 사용하기</h4>
              <p>
                정해진 콤보보다 <strong>스킬 쿨 상황에 맞게 조합해서 사용하기</strong>(자세한건 PVP
                콤보에).
              </p>
              <p>
                연달은 너프와 쿨타임 중 데미지 감소가 적용된 스킬들로 인해,{' '}
                <strong>쿨타임 안도는 스킬들 위주로 굴려주는게 강할때가 많아요</strong>.
              </p>
            </div>

            {/* 휠컨 */}
            <div className="article-callout">
              <h4>3.2.4 휠컨</h4>

              <div className="article-callout">
                <p>📹 휠컨 실전영상 클립:</p>
                <div className="article-grid">
                  {/* 클립 1 */}
                  <GuideClip
                    href="https://youtube.com/clip/UgkxixFXIxXNrZ1AwegEeZxHNcaOaA_gBN_0?si=uVFihKC-ThK6s61V"
                    thumbnail="/tip-images/ranger-clip1.png"
                    title="휠컨 예시 1"
                  />

                  {/* 클립 2 */}
                  <GuideClip
                    href="https://youtube.com/clip/Ugkxs3f6KKeqb-ktBzvTqcJhumj9QBSsfokc?si=om8bOEX1-ObAp_X_"
                    thumbnail="/tip-images/ranger-clip2.png"
                    title="휠컨 예시 2"
                  />
                </div>
              </div>

              <p>
                <strong>목적:</strong> 난간이나 구조물 끝에서 쓰다가 뒤로 밀리기 때문에 바로 아래
                적들은 공격 불가! 구조물 위에서 바깃 우직 바모만 쏘는게 아닌, 콤보 활용으로 딜량
                높이기!
              </p>
              <p>
                기능 단축키의 <strong>"이동중 카메라 시점만 이동"</strong> 단축키를 누른채로 스킬
                사용하기(디폴트가 휠클릭이라 휠컨이라 이름붙임)
              </p>
              <p>
                <strong>
                  전율, 재창조, 강극단명, 바깃, 초바모의 다발화살은 캐릭터 보는 방향으로 써짐
                </strong>
                (초바모는 추가3타 + 다발11타, 추가3타는 에임대로 나감)
              </p>
            </div>

            {/* 재창조 공속 자버프 */}
            <div className="article-callout">
              <h4>3.2.5 재창조 공속 자버프</h4>
              <p>
                안전한 상황에서 <strong>재창조 스킬버프(공속10%, 10초) 굴리기</strong>
              </p>
              <p>⚠️ 3분 or 흑정 흡수 등의 다른 스킬버프와는 중첩X</p>
            </div>
          </div>
        </div>

        {/* 3.3 생존 */}
        <div id="survival-section" className="article-card">
          <h3 id="ranger-operation-4">
            <span>🛡️</span> 3.3 생존
          </h3>

          <p>
            앞서 말한 미니맵 보기와 연결.{' '}
            <strong>스킬 사용중에도 바로 끊고, 생존기들 사용할 준비</strong>.
          </p>

          <div className="article-callout">
            <p>📹 생존기 종합 드리블 실전영상 클립:</p>
            <GuideClip
              href="https://youtube.com/clip/UgkxEbq0f8g4v0z8NmqqDEySG-BpWydDOFpi?si=Q0sdBaq6Ht4JLAP3"
              thumbnail="/tip-images/ranger-clip3.png"
              title="생존 드리블 종합"
            />
          </div>

          <div>
            {/* 무적과 슈퍼아머 스킬 */}
            <div className="article-callout">
              <h4>3.3.1 무적과 슈퍼아머 스킬</h4>

              <div>
                <p>우선 사용 추천</p>

                <div className="article-grid">
                  <div className="article-callout">
                    <div>
                      <GuideImage src="/tip-images/회피폭발.png" alt="회피 폭발 사격" />
                    </div>
                    <p>회피 폭발 사격</p>
                    <p>
                      무적기, 경직 CC가 있어 카운터 가능
                      <br />
                      <strong>회폭 끌기로 무적시간 늘리기 필수!</strong>
                    </p>
                  </div>

                  <div className="article-callout">
                    <div>
                      <GuideImage src="/tip-images/엇바.png" alt="엇갈리는 바람~바람타기" />
                    </div>
                    <p>엇갈리는 바람~바람타기</p>
                    <p>흐름기 처럼 사용하기.</p>
                  </div>

                  <div className="article-callout">
                    <div>
                      <GuideImage src="/tip-images/회피착지1.png" alt="회피 착지 사격" />
                    </div>
                    <p>회피 착지 사격</p>
                    <p>
                      회폭과 엇갈~바람, 초바모 중<br />
                      순간 무적이 필요할때도 사용 가능.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p>후순위 사용 추천</p>

                <div>
                  <div className="article-callout">
                    <p>🔸 하늘의 부름 + 공중 폭발 사격</p>
                    <p>
                      위의 세 가지 스킬이 다 쿨타임이라면 하늘의 부름(이하 하부.)활용. 하늘의 부름은{' '}
                      <strong>무쿨 슈아지만 끝판정이 살짝 비어있고</strong>, 최근 낙하모션
                      패치를해도 낙하 모션이 왕왕 발생하기 때문에 고지대→저지대에선 낙하모션 조심.
                    </p>
                    <p>
                      한턴이라도 안전하게 가져가려면 <strong>"하부+공중 폭발 사격+하부"</strong>{' '}
                      까진 슈아 유지가능. 이후 w+우클 유지한 상태면 네번째 점프에 회폭이
                      빠지게됨(쿨타임 고려 할 것)
                    </p>
                    <p>💡 쿨 계산이 어렵다면 하늘의 부름 단타로 끊어쓰기.</p>
                  </div>

                  <div className="article-callout">
                    <p>🔸 바람모아쏘기 차징</p>
                    <p>
                      제자리와 이동중에도 <strong>풀슈아 가능+카운터(넉백or넉다운) 가능</strong>.
                    </p>
                    <p>
                      (날먹(?)이지만 근접캐들 붙어서 비벼질때 스킬 모션 끝판정 보고 쓰면 가속이 걸려
                      cc가 들어가는걸 노려볼수도 있음.)
                    </p>
                    <p>
                      회폭, 엇갈~바람, 회피착지가 쿨일때 하부 쓰다가 바로 바모 차징하는식으로도 사용
                      가능.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 전방가드 스킬 */}
            <div className="article-callout">
              <h4>3.3.2 전방가드 스킬</h4>

              <p>
                무적, 슈아 굴리면서 드리블 중에 피가 적어 위험하거나, 스킬 쿨일때{' '}
                <strong>전방가드로 턴 버는 식으로 사용</strong>.
              </p>
              <p>⚠️ 전가 뚫거나, 빠른 뒤잡 캐릭들 상대로는 전가로 대치하는 상황은 지양하기.</p>

              <div>
                {/* 1줄: 강극단명, 전율 */}
                <div className="article-grid">
                  <a href="#pvp-skill-danmyung">
                    <div>
                      <img
                        src="/tip-images/단명.png"
                        alt="강극단명"
                        className="article-image"
                        loading="lazy"
                      />
                    </div>
                    <p>강극단명</p>
                    <p>👉 PVP 콤보에서 추가 설명 보기</p>
                  </a>

                  <div className="article-callout">
                    <div>
                      <GuideImage src="/tip-images/전율.png" alt="전율" />
                    </div>
                    <p>전율</p>
                    <p>방깎으로도 사용 가능</p>
                  </div>
                </div>

                {/* 2줄: 2차 라밤 */}
                <div className="article-callout">
                  <p>2차 라밤</p>
                  <div className="article-grid">
                    <div>
                      <div>
                        <GuideImage src="/tip-images/울림.png" alt="울림의 화살" />
                      </div>
                      <p>울림의 화살</p>
                      <p>전방 가드</p>
                    </div>
                    <div>
                      <p>취향대로 선택</p>
                    </div>
                    <div>
                      <div>
                        <GuideImage src="/tip-images/휘몰아.png" alt="휘몰아치는 화살" />
                      </div>
                      <p>휘몰아치는 화살</p>
                      <p>맨몸, 막타 넉다기</p>
                    </div>
                  </div>
                  <p>취향대로 선택</p>
                </div>

                {/* 3줄: 3차 라밤 */}
                <div className="article-callout">
                  <p>3차 라밤</p>
                  <div className="article-grid">
                    <div>
                      <div>
                        <GuideImage src="/tip-images/바람의지.png" alt="바람을 타는 의지" />
                      </div>
                      <p>바람을 타는 의지</p>
                      <p>
                        전가 유지 + 넉다운
                        <br />
                        바깃이랑 모션이 똑같아 낚시용으로도 사용 가능
                      </p>
                    </div>
                    <div>
                      <p>취향대로 선택</p>
                    </div>
                    <div>
                      <div>
                        <GuideImage src="/tip-images/바람폭발.png" alt="바람 폭발 사격" />
                      </div>
                      <p>바람 폭발 사격</p>
                      <p>생존기 늘리기, 끝슈아 비어있음</p>
                    </div>
                  </div>
                  <p>취향대로 선택</p>
                </div>

                {/* 4줄: 우직, 초바모 */}
                <div className="article-grid">
                  <a href="#pvp-skill-woojik">
                    <div>
                      <img
                        src="/tip-images/우직.png"
                        alt="우직한 칼날바람"
                        className="article-image"
                        loading="lazy"
                      />
                    </div>
                    <p>우직한 칼날바람</p>
                    <p>👉 PVP 콤보에서 추가 설명 보기</p>
                  </a>

                  <a href="#pvp-skill-chobamo">
                    <div>
                      <img
                        src="/tip-images/초바모.png"
                        alt="초 바람 모아쏘기"
                        className="article-image"
                        loading="lazy"
                      />
                    </div>
                    <p>강 : 초 바람 모아쏘기</p>
                    <p>👉 PVP 콤보에서 추가 설명 보기</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'combos',
    title: 'PvP 콤보와 스킬 연계',
    content: (
      <>
        {/* 주 사용 풀콤보 */}
        <div className="article-card">
          <h3 id="ranger-combos-1">주 사용 풀콤보</h3>

          <div className="article-callout">
            <p>콤보:</p>
            <p>
              단명(1cc,넉다운) - 우직 - 캔슬길여바(2cc,넉다운) - 선회 - 숨찢 - 초바모 - 옭아 -
              숨찢질풍(1차라밤)
            </p>
          </div>

          <div className="article-callout">
            <p>커맨드:</p>
            <p className="command-line">
              W(Q)좌클 - E 좌클 - 좌클유지중 SHIFT - SHIFT 누르자마자 우클릭 추가 - S먼저!누르고 E
              빠르게 따닥+좌클 - SPACE - F - SHIFT+X
            </p>
          </div>

          <div className="article-callout">
            <p>
              ⚠️ 주 사용 풀콤을 먼저 알려드리긴 했지만,{' '}
              <strong>단명/우직/초바모 등은 스킬 쿨이 거의 상시로 돌아가기 때문에</strong> 남아있는
              길여바/숨찢/옭아 등의 스킬을 연계하기 위한 선행이 필요해요. 앞에서 말한대로{' '}
              <strong>
                쿨 돌고있는 스킬을 쓰는거보다, 준비된 스킬 쓰는게 더 쎈 상황들이 많아요
              </strong>
              .
            </p>
          </div>
        </div>

        <p>스킬별 특징과, 연계를 어떻게 하는지 설명드릴게요.</p>

        {/* 스킬별 특징 */}
        <div>
          {/* 4.0 잠궈두는 스킬 */}
          <div className="article-card">
            <h3 id="ranger-combos-2">4.0 잠궈두는 스킬</h3>
            <p>약점 노리기, 회피 이동, 수호의 검, 반달차기, (회전 차기, 돌진차기)</p>
            <p>💡 회전 차기와 돌진차기는 약간의 쓰임이 있어서 숙련자라면 안잠궈두셔도 됩니다.</p>
          </div>

          {/* 4.1 캔슬선회하는바람 */}
          <div className="article-card">
            <h3 id="ranger-combos-3">4.1 (캔슬)선회하는바람</h3>
            <div>
              <p>
                보통 길여바 이후 선회를 사용하지만,{' '}
                <strong>단명/우직/숨찢질/회피착지 이후와 숨찢 도중에도 사용이 가능</strong>해요.
              </p>
              <p>바람모아쏘기의 특화가 선회로도 적용 가능.</p>
              <p>각각 연계 가능한 스킬마다 적용되는 커맨드가 달라요:</p>
              <div className="article-callout">
                <p>
                  • <strong>길여바:</strong> 좌클로 캔슬길여바가 시전된상태에서 우클추가
                </p>
                <p>
                  • <strong>단명:</strong> AorD 좌클+우클 유지.
                </p>
                <p>
                  • <strong>우직:</strong> 좌클 누른채로 우클 추가
                </p>
                <p>
                  • <strong>숨찢:</strong> 끊어 쓰면 2+2+1타. 5타격째에 뒤로 밀리니, 안밀리게 쓰려면
                  3~4타 모션에서 우클만 추가.
                </p>
                <p>
                  • <strong>숨찢질:</strong> SHIFT+X에서 SHIFT 누른채로 우클만 추가
                </p>
                <p>
                  • <strong>회피착지:</strong> 공중에서 내려오기전에 좌우클
                </p>
              </div>
              <p>이후 숨을 찢는 화살과 연계!</p>
            </div>
          </div>

          {/* 4.2 캔슬길여바 */}
          <div className="article-card">
            <h3 id="ranger-combos-4">4.2 (캔슬)길을 여는 바람</h3>
            <div>
              <p>
                <strong>
                  우직/숨찢/바모/옭아/2차라밤 둘 다/ 강극단명 막타 도중에 캔슬로 사용 가능
                </strong>
                해요.
              </p>
              <div className="article-callout">
                <p>
                  • <strong>우직:</strong> 모션 취한 상태~사용중 SHIFT+좌클
                </p>
                <p>
                  • <strong>숨찢:</strong> 모션 취한 상태~사용중 SHIFT+좌클
                </p>
                <p>
                  • <strong>바모:</strong> SHIFT+우클에서 우클만 놓았다 우클이면 캔슬길여바~선회까지
                  자동
                </p>
                <p>
                  • <strong>옭아:</strong> 스킬 나가고 SHIFT+좌클
                </p>
                <p>
                  • <strong>2차라밤:</strong> 울림의 화살은 스킬 발동후, 휘몰화살은 모션 취한
                  상태~사용중 SHIFT+좌클
                </p>
                <p>
                  • <strong>강극단명:</strong> 막타 나가고 SHIFT+좌클
                </p>
              </div>
              <p>💡 대부분의 스킬 사용중에 좌클 누르고 있는 상태라 SHIFT만 딸깍 추가로 가능.</p>
              <p>
                캔슬길여바가 불가능한 스킬들은 화살이 날라가는 도중에 F 회전차기나, WF 돌진차기를
                섞어주면 화살 맞으면서 타격판정이 들어가 캔슬 길여바가 가능해져요. 발차기로 직접
                타격하지 않아도 가능하지만 어마무시하게 쓸데없기 때문에{' '}
                <strong>빨간약은 그만!</strong>
              </p>
              <p>
                예전에 에어어택이 달려있을땐 괴랄한 순간폭딜이 나오는{' '}
                <strong>우직-선회-초바모-옭아-길여바-선회-숨찢</strong>을 썼지만 2cc가 띄우기로
                들어가서 우선순위가 높은 조합은 아니에요. 쿨 상황 맞으면 사용해도 괜찮아요.
              </p>
            </div>
          </div>

          {/* 4.3 숨을 찢는 화살 */}
          <div className="article-card">
            <h3 id="ranger-combos-5">4.3 숨을 찢는 화살</h3>
            <div>
              <p>
                차징과 대기중엔 슈아 상태. <strong>화살 쏘는동안만 맨몸</strong>.
              </p>
              <p>
                앞서 선회때도 말씀드린 구조 <strong>2+2+1타, 5타격째 뒤로 밀려요</strong>.
              </p>
              <p>
                이 스킬은 SE 누르는 타이밍이 조금만 늦어도 차징모션이 떠요.{' '}
                <strong>일반과 풀차징의 딜차이가 약 2배 정도!</strong>
                따라서 항상 차징모션 스킵하기 위해 타이밍을 잘 잡아줘야해요.
              </p>
              <p>
                선회와 연계시 마지노선은{' '}
                <strong>
                  오른발이 미세하게 앞으로 나가서 바닥에 닿기 직전까지 SE를 입력하면 풀차징으로
                  나가요
                </strong>
                . 그래서 좌단명 선회보다 우단명 선회가 판정이 유리해요.
              </p>
              <p>엇갈리는 바람, 바람타기, 회피 착지 사격 후에도 SE로 풀차징된 숨찢이 가능해요.</p>
              <p>
                ⚠️ 예전엔 쿨중딜감 적용이 없어서 DPS 1위 였지만{' '}
                <strong>지금은 숨찢 반복이 오히려 딜로스</strong>에요!
              </p>

              {/* 스플래시 데미지 내용 추가 */}
              <div className="article-callout">
                <h4>💥 스플래시 데미지의 범위 파악하기</h4>

                <div className="article-callout">
                  <p>📹 스플뎀 예시 영상:</p>
                  <div>
                    <GuideVideo
                      src="https://www.youtube.com/embed/Lcyc9gvND7U"
                      title="전승 레인저 스킬 연계 영상"
                    />
                  </div>
                  <div className="article-callout">
                    <p>
                      예시 영상에서 보시다시피 에임이 잡히지도 않은채로 벽에 쏘는데 히트 판정이
                      들어가는걸 보실 수 있어요.{' '}
                      <strong>
                        벽에서 터지는 스킬의 범위안에 적이 있다면 영상처럼 히트 판정이 들어갑니다!
                      </strong>
                    </p>
                    <p>
                      저런 난간벽 뒤가 아니더라도 높은 지붕위라서 사거리가 닿지 않아도,{' '}
                      <strong>
                        캐릭터의 발쪽 언저리에 에임을 두고 쏘면 스플래시로 히트 판정을 띄울 수
                        있어요!
                      </strong>
                    </p>
                    <p>
                      평지에서도 활용 할 수 있습니다!{' '}
                      <strong>
                        에임이 안잡히는 최대 사거리 밖이어도, 캐릭터의 발 앞쪽을 향해 쏘면
                        스플뎀으로 히트 판정이 들어가요!
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4.4 바깃 */}
          <div className="article-card">
            <h3 id="ranger-combos-6">4.4 바람을 타는 깃~강극바깃</h3>
            <div>
              <p>
                ⚠️ 이 스킬들은 손쉽게 킬하는게 가능한 스킬이면서 죽음과도 가까워지는 1순위 스킬.
                반드시 안전한 상태에서 사용하길 강요드립니다.
              </p>
              <p>
                하늘에서 떨어지는 판정이라{' '}
                <strong>
                  나보다 높은 지대에 있는 적들 혹은 적당히 낮은 구조물 뒤에 있는 적들도 타격 가능
                </strong>
                해요.
              </p>
              <p>
                개인적으로는 딜링보다 <strong>디버프특화 묻히기용으로 써요</strong>.
              </p>
              <p>
                ⚠️ <strong>바깃에만 바운드 CC 판정이 있고, 강극바깃에는 CC가 없어요!</strong> 암살자
                탐지하려고 쓰는거면 강극바깃타이밍에 조심해야해요!
              </p>
            </div>
          </div>

          {/* 4.5 우직한 칼날바람 */}
          <div id="pvp-skill-woojik" className="article-card">
            <h3 id="ranger-combos-7">4.5 우직한 칼날바람</h3>
            <div>
              <p>
                공속과 상대방과의 거리따라 <strong>0~12 + 1타</strong>.
              </p>
              <p>최대 사정거리에서 쓴다면 화살 날아가는 딜레이가 있어 CC연계 타이밍 생각하기.</p>
              <p>
                우직이 12타까진 2타씩x6번 연달아 우다다다 나가지만,{' '}
                <strong>13타를 쏘면서 오른무릎을 일으키기 때문에 후딜이 있습니다!</strong> 따라서
                13타까지 쏘게되면 연계 속도가 느려지는거 생각하고 계셔야해요.
              </p>
              <p>
                모션만 잡은채로 <strong>0타로 캔슬길여바가 가능</strong>해요.
              </p>
              <p>
                💎 PVP 계수가 무려 <strong>17867%로 제일 높지만 스킬 치명타 확률이 20%</strong>라
                버프와 재련석, 특화등을 잘 챙겨줘야 리턴값이 높아져요.
              </p>
              <p>
                <strong>
                  퀵슬롯 등록하고 사용하면 맨몸으로 달리다가도 바로 무기꺼내고 우직 모션 발동 가능
                </strong>
                해요.
              </p>

              {/* 스플뎀 내용 추가 */}
              <div className="article-callout">
                <p>
                  💥 <strong>우직도 숨찢처럼 스플뎀이 존재해요.</strong> 하지만 범위가 아주 좁다보니{' '}
                  <strong>써보시면서 감으로 익히는걸 추천드려요!</strong>
                </p>
              </div>
            </div>
          </div>

          {/* 4.6 강 극 단명 */}
          <div id="pvp-skill-danmyung" className="article-card">
            <h3 id="ranger-combos-8">4.6 강 극 단명</h3>
            <div>
              <p>
                퀵슬롯으로 사용하면 <strong>선행스킬없이 바로 발동</strong>되요.
              </p>
              <p>
                얘도 <strong>고저차 쥐약</strong>에, 범위가 아처 만개의 50%도 안나와요.
              </p>
              <p>
                장점은 <strong>다운어택+치확100%+계수 9500%로 높은편</strong> + 전가유지 딜링
                가능해서 근접 한정으로 활용 하면 좋아요.
              </p>
              <p>
                막타 이후 <strong>캔슬길여바로 연계</strong>도 가능해요.
              </p>
            </div>
          </div>

          {/* 4.7 초바모 */}
          <div id="pvp-skill-chobamo" className="article-card">
            <h3 id="ranger-combos-9">4.7 초 바람 모아쏘기</h3>
            <div>
              <p>⚠️ 바모 특화 안묻어요! 특화 발동이 안되는 스킬이에요.</p>
              <p>
                구조 자체가 괴랄한 놈이에요. <strong>추가 타격 3타+다발11타</strong> 로
                구성되어있는데 추가 3타가 먼저 딜이들어가요. 추가 3타는 에임 따라서 나가지만
                다발11타는 히트 범위가 세로로 긴 직사각형의 형태로 캐릭터 방향 고정으로 나가요.
                따라서 고저차 영향을 받고, 다발 11타 풀로 맞는 건 덩치 큰 보스들 뿐이라 대인전에선
                계수가 온전히 적용되지 못해요(약2~40%).
              </p>
              <p>
                후딜이 엄청 길어요. 전방가드지만 딜로스 줄이기 위해 주로{' '}
                <strong>옭아매는화살로 후딜 캔슬하거나 회피 착지로 거리벌리는 용으로 써요</strong>.
              </p>
            </div>
          </div>

          {/* 4.8 옭아매는화살 */}
          <div className="article-card">
            <h3 id="ranger-combos-10">4.8 옭아매는화살</h3>
            <div>
              <p>
                계수가 덩굴 추가 피해까지 4200% 정도로 딜량은 낮아서 주로{' '}
                <strong>초바모 후딜 캔슬용으로 써요</strong>.
              </p>
              <p>띄우기라 CC연계용으로는 추천도가 낮아요.</p>
            </div>
          </div>

          {/* 4.9 바람을 타는 의지 */}
          <div className="article-card">
            <h3 id="ranger-combos-11">4.9 바람을 타는 의지(3차라밤)</h3>
            <div>
              <p>
                <strong>전가+넉다+스킬방깎으로 활용 가능</strong>해요.
              </p>
              <p>
                바깃과 모션이 똑같아 <strong>낚시용으로 활용 가능</strong>해요.
              </p>
            </div>
          </div>

          {/* 4.10 바람의 의지 */}
          <div className="article-card">
            <h3 id="ranger-combos-12">4.10 바람의 의지</h3>
            <div>
              <p>
                근접상황+안전한 딜각 에서는 콤보에 추가해도 괜찮아요.{' '}
                <strong>단명(1cc)-DF-우직 순으로 연계해서 스킬방깎까지 걸고 시작하는 방식</strong>.
                AF는 딜레이가 미세하게 조금 더 있어서 DF로 사용 추천.
              </p>
            </div>
          </div>

          {/* 4.11 회피사격 추가 */}
          <div className="article-card">
            <h3 id="ranger-combos-13">4.11 회피사격</h3>
            <div>
              <p>
                <strong>
                  하늘의 부름, 엇갈리는 바람, 바람타기 중에 A or D + 좌클릭 으로 방향을 틀 수
                  있어요.
                </strong>
              </p>
              <p>
                포지션 잡거나 뒤잡기용으로 쓰이고 위치렉 유발(?)도 가능해요.{' '}
                <strong>단, 맨몸이라 조심하셔야해요!</strong>
              </p>

              {/* 회피사격 예시 영상 */}
              <div className="article-callout">
                <p>📹 회피사격 실전영상 클립:</p>
                <GuideClip
                  href="https://youtube.com/clip/UgkxbdSCtqhRn3RyrCUqci6T4O3tKlaTZQTF?si=cC2nWCG4_FP61xJ6"
                  thumbnail="/tip-images/ranger-clip4.png"
                  title="회피사격 예시"
                />
                <p>
                  회피 사격을 극단적으로 사용한 예시지만,{' '}
                  <strong>회폭 카운터, 바모 카운터, 전가로 턴 벌기</strong> 등의 디테일도 있어서
                  마무리 복습의 느낌으로 추가했어요!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 무호흡딜링 예시 */}
        <div className="article-callout">
          <h3 id="ranger-combos-14">🔥 이론상 무호흡딜링 예시</h3>
          <p>
            가만히 냅둘리 없겠지만 공격 안받길 기도하면서 써야 하기에{' '}
            <strong>어떤식으로 모든 쿨 돌리는지 알아두시는 정도만!</strong>
          </p>
          <div className="article-card">
            <p>
              단명 - 우직 - 길여바 - 선회 - 숨찢 - 초바모 - 옭아 - 숨찢질 - 재창조 - 바깃~강극바깃 -
              단명 - 우직 - 길여바 - 선회 - 숨찢 - 초바모 - 옭아 - 숨찢질 -
              2차라밤or강극단명(근접한정) - 바깃~강극바깃
            </p>
          </div>
          <p>
            이렇게 <strong>2사이클을 반복가능</strong>해요.
          </p>
          <p>
            쿨타임은 맞게 돌지만, 샤이공속버프나 3분버프가 있다면 이마저도 쿨타임이 모자라요ㅠㅠ
          </p>
          <p>⚠️ 실전성이 엄청 낮으니 그냥 알아만 두기!</p>
        </div>
      </>
    ),
  },
  {
    id: 'builds',
    title: '특화 · 수정 · 유물',
    content: (
      <>
        <div>
          {/* RVR 특화 */}
          <div className="article-card">
            <h3 id="ranger-builds-1">
              <span>⚔️</span> RVR 특화
            </h3>
            <div>
              <GuideImage src="/tip-images/홍줭무제한.png" alt="무제한 특화" />
            </div>
            <p>
              제한에서는 길여바에 <strong>회피 감소20, 다운어택 5%</strong>
            </p>
          </div>

          {/* 소수전 특화 */}
          <div className="article-card">
            <h3 id="ranger-builds-2">
              <span>🌟</span> 소수전 특화
            </h3>
            <div>
              <GuideImage src="/tip-images/홍줭소수전.png" alt="소수전 특화" />
            </div>
            <p>
              소수전 특화, <strong>바깃 대신 회폭 채용</strong>
            </p>
          </div>
        </div>

        {/* 수정 */}
        <div className="article-card">
          <h3 id="ranger-builds-3">💠 수정</h3>
          <div className="article-grid">
            {/* 무제한 PvP 수정 */}
            <div className="article-callout">
              <div>
                <GuideImage src="/tip-images/홍줭수정.png" alt="무제한 PvP 수정" />
              </div>
              <p>무제한 수정</p>
            </div>

            {/* 홍줭 제한 수정 */}
            <div className="article-callout">
              <div>
                <GuideImage src="/tip-images/홍줭제한수정.png" alt="홍줭 제한 수정" />
              </div>
              <p>제한 수정</p>
            </div>
          </div>
        </div>

        {/* 유물 */}
        <div className="article-card">
          <h3 id="ranger-builds-4">✨ 유물</h3>
          <div className="article-grid">
            {/* 무제한 PvP 유물 */}
            <div className="article-callout">
              <div>
                <GuideImage src="/tip-images/홍줭유물.png" alt="무제한 PvP 유물" />
              </div>
              <p>무제한 유물</p>
            </div>

            {/* 홍줭 제한 유물 */}
            <div className="article-callout">
              <div>
                <GuideImage src="/tip-images/홍줭제한유물.png" alt="홍줭 제한 유물" />
              </div>
              <p>제한 유물</p>
              <p>
                악어의 이빨 or 약점 공략보다 <strong>기술의 달인이 기댓값이 높음</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 군왕 재련석 */}
        <div className="article-callout">
          <h4>⚔️ 군왕 재련석</h4>
          <div className="article-grid">
            <div className="article-callout">
              <p>모든 공격력</p>
            </div>
            <div className="article-callout">
              <p>치명타 확률</p>
            </div>
            <div className="article-callout">
              <p>
                치명타 or 다운어택 <br></br>피해량
              </p>
            </div>
            <div className="article-callout">
              <p>백어택 피해량</p>
            </div>
            <div className="article-callout">
              <p>흑정령의 분노 회복량</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'questions',
    title: '자주 묻는 질문',
    content: (
      <>
        <div className="article-callout">
          <p>
            거점은 <strong>삼파전 이상을 기준</strong>으로 답변드립니다.
          </p>
        </div>

        <div>
          {/* Q. 성채 막타 */}
          <div className="article-card">
            <h3 id="ranger-questions-1">Q. 성채 막타 어떻게 먹나요?</h3>
            <div>
              <p>
                무슈 굴리다가 타이밍 최대한 맞추는 느낌으로 엇갈~바람, 하부로 들어가면서{' '}
                <strong>
                  "바모 차징/흑정궁/(우직모션)길여바-선회-숨찢(슈아유지로도 타이밍 재기)-초바모"
                </strong>{' '}
                사용하여 노립니다. 버티는 타이밍에 전가를 거의 못쓸 수준으로 드러눕는 경우가
                허다하긴해요.
              </p>
              <p>
                정면은 방셋들, 사이드와 후방은 암살자들 견제가 심할거에요ㅠㅠ 아군 연맹을 제외한 A,
                B 길드가 있을때 A연맹이 성채 주인이라면 B연맹의 인원이 셋 이상일때부터 드리블 해서{' '}
                <strong>인원 교환비 좋아지는 상황으로 만들려는 편</strong>이에요. 많으면 많을수록
                아군 연맹이 성채 막타먹을 확률이 높아진다고 생각해요.
              </p>
              <p>
                위의 <a href="#survival-section">&lt;3.3 생존&gt;</a>의 예시 영상에서도
                보여지는데요, "[와플] 연맹이 성채 주인이고 피가 얼마 안남은 상황인데 막타 안치러가고
                뭐하냐?" 라고 보실 수도 있지만, [우린잃을게없다] 연맹 3명의 어그로를 의도적으로 끌고
                있는 상황이에요. 이런 상황에서 무리해서 성채 막타 치러가면 오히려{' '}
                <strong>"뒷각 내주기 + 아군들의 딜로스"</strong>까지 유발 가능한 상황이 되어버려요.
              </p>
            </div>
          </div>

          {/* Q.2 성채 부활 */}
          <div className="article-card">
            <h3 id="ranger-questions-2">
              Q. 거점전에서 아군 연맹이 성채 주인일때, 성채 부활해서 1~2명 이라도 잡고 죽는게 나은
              선택일까요?
            </h3>
            <div>
              <p>
                상황마다 다르지만 <strong>오더를 따르는게 최우선</strong>입니다. 하지만 오더와
                다른행동을 하는게 더 낫다고 생각하는 확실한 근거와 판단이 있다면 시도해 보는걸
                추천드려요. 그러면서 경험 쌓고 피드백하면서 더 나은 방향으로 자리 잡아가는거죠.
              </p>
              <div className="article-callout">
                <p>예시:</p>
                <p>
                  성채 부활 무적9초 중 로딩,도핑(단축키사용), 성채와 같이 딜 안맞게 약간떨어진
                  포지션 잡는데까지 약2~3초.
                </p>
                <p>
                  남은 6초 안에 포지션잡고 상대 원거리나 물몸딜러들 위주로{' '}
                  <strong>
                    3명 이상 잡고 죽거나, 1~2명 잡고 무슈로 빠져나가기가 가능하다면 괜찮은 선택
                  </strong>
                  이라고 생각합니다만, 부활 대기 시간이 막 20초가 넘어간다면 약 30초 동안 2~3명을
                  잡는꼴.
                </p>
                <p>
                  하지만 그 30초에 불퇴 부활하고 사이드로 빠져, 적군 딜러 3명 이상의 딜로스를 유발할
                  각이 충분히 보인다? → 시도해 볼 만한 가치가 있다고 판단됩니다.
                </p>
                <p>
                  시간이 정해진 성채 기준은{' '}
                  <strong>
                    초 단위로 조금이라도 더 버텨서 점령 성공할 가능성이 있다면, 부활 박치기가 낫다는
                    생각
                  </strong>
                  입니다. 킬뎃은 중요하지 않아요.
                </p>
              </div>
            </div>
          </div>

          {/* Q.3 암살자 대처 */}
          <div className="article-card">
            <h3 id="ranger-questions-3">Q. 암살자들 대처 어떻게 해야하나요?</h3>
            <div>
              <p>
                저도 많이 부족하고 잘 죽어요ㅠㅠ 하지만 한가지 확실한건, 앞서 말씀드린{' '}
                <strong>"미니맵 보기"만 잘 되어도 생존율이 확 올라갑니다.</strong>
              </p>

              <div className="article-callout">
                <div>
                  <p>예시 1: 은신 캐릭터 탐지</p>
                  <p>
                    후방쪽이나 사이드에 흰점 잠깐 보였다 사라졌다? → 대부분 은신 캐릭이에요. 거리가
                    멀었다면 접근중일 확률이 높으니 <strong>바깃 한 번 날려줍니다.</strong>
                  </p>
                  <p>
                    쿠닌이면 바운드 맞고 누워서 은신 풀려서 대처 가능한 상황이 나옵니다.{' '}
                    <strong>주의할 점은 바깃만 사용!</strong> 바깃에만 바운드 cc가 있고, 강극바깃
                    cc가 없어 오히려 상대방의 진입각을 만들어주는 상황이 돼요.
                  </p>
                </div>

                <div>
                  <p>예시 2: 하사신 대처</p>
                  <p>
                    하사신이라면 모래 이펙트가 보일텐데요, 이펙트 최적화를 꺼두어도 간혹 모래가
                    안보일 때가 있어요. 하지만 <strong>허공에 히트판정이 뜬다?</strong> → 바로 슈아
                    생존기 쓰거나 바모 차징해서 대응하기!
                  </p>
                </div>

                <div>
                  <p>팁:</p>
                  <p>
                    암살자들 위치가 예상되거나 보였다면{' '}
                    <strong>바로 파티핑이든 연맹핑이든 찍어주기!</strong>
                  </p>
                </div>
              </div>

              <p>
                추가적으로{' '}
                <strong>연맹원 이름 끄기, 이펙트 최소화의 효과 체감이 가장 많이 되는 상황</strong>
                이에요. 적군에게 색깔 지정을 하더라도 아군 닉네임에 가려, 적군이 들어와있는지 구분이
                어려울 때가 있어요. 심지어 방셋이랑 암살자랑 같이 들어온 상황이면 대처가 더
                늦어지겠죠? <strong>암살자부터 빠르게 포커싱해서 잡아줘야 합니다!</strong> 바로
                옆에서 아군이 맞고 있는데도 구분이 늦어 눈앞에서 죽는게 보이면 슬픕니다ㅠㅠ
              </p>
            </div>
          </div>

          {/* Q.4 꿀자리 */}
          <div className="article-card">
            <h3 id="ranger-questions-4">Q. 꿀자리들 알려주세요!</h3>
            <div>
              <p>
                꿀통은 내 귀에 들어오는 순간 꿀통이 아니게 된다고 생각합니다!
                <br />
                (절대 알려주기 싫어서 안알려주는거 아님! 그랬으면 영상들도 안올렸겠죠?)
              </p>

              <div className="article-callout">
                <p>예시: 장미전쟁</p>
                <p>
                  카마실비아 진영 기준 → 오딜리타 공격할때, S9 칼크 위쪽 절벽자리. 여기서 원거리들
                  많이 보이는데 <strong>휠컨도 가능한 자리라 킬할 상황이 많이 나오는 편</strong>
                  이에요.
                </p>
                <p>
                  예전엔 견제가 적었지만, 요즘은 아예 방셋분들이 대기하고 있을 정도로 견제가
                  심합니다.(내 꿀통 ㅠㅠ)
                </p>
              </div>

              <p>
                그래서 위에서도 말씀드렸지만 <strong>"지형 숙지"</strong>. 시간 투자해서라도 괜찮아
                보이는 자리들을 미리 파악해 둘 만한 가치가 있어요.
              </p>
              <p>
                "오, 이자리 괜찮아 보이는데?" 라고 생각이 들어서 토론하는건 언제든 환영이니 편하게
                귓 주셔도 됩니다!
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'closing',
    title: '마치며',
    content: (
      <>
        <div className="article-card">
          <p>
            부족한게 많지만 도움되었길 바라며 마무리 하겠습니다.
            <br />
            <span>레인저 화이팅!!</span>
            <span>(살려주세요ㅠㅠ)</span>
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'video',
    title: '참고 영상',
    content: (
      <GuideVideo
        src="https://www.youtube.com/embed/lC42jTtzSCQ"
        title="홍줭의 전승 레인저 참고 영상"
      />
    ),
  },
]
export const rangerHeadings = [
  {
    id: 'ranger-strengths-1',
    title: '장점',
    section: 'strengths',
  },
  {
    id: 'ranger-strengths-2',
    title: '단점',
    section: 'strengths',
  },
  {
    id: 'ranger-operation-1',
    title: '짧은 요약',
    section: 'operation',
  },
  {
    id: 'ranger-operation-2',
    title: '3.1 공통',
    section: 'operation',
  },
  {
    id: 'ranger-operation-3',
    title: '3.2 딜링',
    section: 'operation',
  },
  {
    id: 'ranger-operation-4',
    title: '3.3 생존',
    section: 'operation',
  },
  {
    id: 'ranger-combos-1',
    title: '주 사용 풀콤보',
    section: 'combos',
  },
  {
    id: 'ranger-combos-2',
    title: '4.0 잠궈두는 스킬',
    section: 'combos',
  },
  {
    id: 'ranger-combos-3',
    title: '4.1 (캔슬)선회하는바람',
    section: 'combos',
  },
  {
    id: 'ranger-combos-4',
    title: '4.2 (캔슬)길을 여는 바람',
    section: 'combos',
  },
  {
    id: 'ranger-combos-5',
    title: '4.3 숨을 찢는 화살',
    section: 'combos',
  },
  {
    id: 'ranger-combos-6',
    title: '4.4 바람을 타는 깃~강극바깃',
    section: 'combos',
  },
  {
    id: 'ranger-combos-7',
    title: '4.5 우직한 칼날바람',
    section: 'combos',
  },
  {
    id: 'ranger-combos-8',
    title: '4.6 강 극 단명',
    section: 'combos',
  },
  {
    id: 'ranger-combos-9',
    title: '4.7 초 바람 모아쏘기',
    section: 'combos',
  },
  {
    id: 'ranger-combos-10',
    title: '4.8 옭아매는화살',
    section: 'combos',
  },
  {
    id: 'ranger-combos-11',
    title: '4.9 바람을 타는 의지(3차라밤)',
    section: 'combos',
  },
  {
    id: 'ranger-combos-12',
    title: '4.10 바람의 의지',
    section: 'combos',
  },
  {
    id: 'ranger-combos-13',
    title: '4.11 회피사격',
    section: 'combos',
  },
  {
    id: 'ranger-combos-14',
    title: '이론상 무호흡딜링 예시',
    section: 'combos',
  },
  {
    id: 'ranger-builds-1',
    title: 'RVR 특화',
    section: 'builds',
  },
  {
    id: 'ranger-builds-2',
    title: '소수전 특화',
    section: 'builds',
  },
  {
    id: 'ranger-builds-3',
    title: '수정',
    section: 'builds',
  },
  {
    id: 'ranger-builds-4',
    title: '유물',
    section: 'builds',
  },
  {
    id: 'ranger-questions-1',
    title: 'Q. 성채 막타 어떻게 먹나요?',
    section: 'questions',
  },
  {
    id: 'ranger-questions-2',
    title:
      'Q. 거점전에서 아군 연맹이 성채 주인일때, 성채 부활해서 1~2명 이라도 잡고 죽는게 나은 선택일까요?',
    section: 'questions',
  },
  {
    id: 'ranger-questions-3',
    title: 'Q. 암살자들 대처 어떻게 해야하나요?',
    section: 'questions',
  },
  {
    id: 'ranger-questions-4',
    title: 'Q. 꿀자리들 알려주세요!',
    section: 'questions',
  },
]
