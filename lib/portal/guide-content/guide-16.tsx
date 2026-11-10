import GuideImage from '@/components/portal/guide/GuideImage'
import GuideVideo from '@/components/portal/guide/GuideVideo'
import type { GuideContent } from '@/components/portal/guide/PublishedGuide'

const content: GuideContent = {
  cover: undefined,
  sections: [
    {
      id: 'guide-16-section-1',
      title: '소개',
      content: (
        <>
          <p>
            안녕하세요. <strong>무슨말</strong>입니다.
          </p>
        </>
      ),
    },
    {
      id: 'guide-16-section-2',
      title: '클래스 소개',
      content: (
        <>
          <div className="article-card">
            <p>
              데드아이는 전통적인 원거리 클래스보다 사거리가 짧지만, 근거리 클래스보다 길어{' '}
              <strong>중거리 싸움을 주도하는 원거리형 인파이터</strong>입니다.
            </p>
            <p>
              데드아이는 적진 후방의 원거리 적을 암살하거나, 전방의 근거리 적에게 지속적인 압박을
              가하는 등 <strong>다양한 상황에 유연하게 대응</strong>할 수 있습니다.
            </p>
            <p>
              또한 짧은 쿨타임의 이동기("미끄러지기", 재사용 대기시간 2초)를 통해{' '}
              <strong>높은 기동성</strong>을 지니며, 조작 난이도도 비교적 쉬워 검은사막을 처음
              시작하는 분들에게 추천할 만한 클래스입니다.
            </p>
            <p>
              데드아이는 <strong>리볼버(주무기), 릴 데블(각성무기), 샷건(보조무기)</strong>을
              사용하며, 두 가지 형태의 탄환인 <strong>"실탄"과 "마르니탄"</strong>을 활용해 전투를
              펼칩니다.
            </p>
          </div>

          <div className="article-grid">
            {/* 실탄 */}
            <div className="article-card">
              <h3 id="guide-16-section-2-heading-1">🔴 실탄</h3>
              <div>
                <div>
                  <h4 id="guide-16-section-2-heading-2">리볼버</h4>
                  <ul>
                    <li>
                      • 조준 도우미에 영향을 받아 <strong>유도탄 가능</strong>
                    </li>
                    <li>• 에임을 한번만 맞추면 이어서 사용하는 리볼버 스킬이 전부 유도</li>
                    <li>• 데드아이가 안정적인 카이팅이 가능하게 해주는 핵심 스킬</li>
                    <li>• 에임을 맞추지 않음으로써 이동 방향의 시야를 더 많이 확보 가능</li>
                  </ul>
                </div>
                <div>
                  <h4 id="guide-16-section-2-heading-3">샷건</h4>
                  <ul>
                    <li>
                      • <strong>거리에 따라 피해량 변화</strong> (가까울수록 ▲, 멀수록 ▼)
                    </li>
                    <li>• 슈아를 유지하는 경우 외에는 실탄 샷건으로 딜링을 하지 않음</li>
                  </ul>
                </div>
                <div>
                  <h4 id="guide-16-section-2-heading-4">릴데블</h4>
                  <ul>
                    <li>
                      • <strong>투사체 속도가 매우 빠름</strong> (피하기 힘듦)
                    </li>
                    <li>• 마르니탄보다 피해량이 크며, 범위도 좁아서 분산딜에 영향을 덜받음</li>
                    <li>• 사실상 더 큰 피해를 입힘</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 마르니탄 */}
            <div className="article-card">
              <h3 id="guide-16-section-2-heading-5">🔵 마르니탄</h3>
              <div>
                <div>
                  <h4 id="guide-16-section-2-heading-6">리볼버</h4>
                  <ul>
                    <li>
                      • 모험가에게 <strong>직접 에임을 맞춰야 타격 가능</strong>
                    </li>
                    <li>• 관통샷, 실탄보다 범위 넓음</li>
                    <li>• 딜보단 이동기 혹은 전방 범위기로 사용하는 편</li>
                  </ul>
                </div>
                <div>
                  <h4 id="guide-16-section-2-heading-7">샷건</h4>
                  <ul>
                    <li>
                      • <strong>거리에 상관없이 피해량 최대</strong>
                    </li>
                    <li>• 가장 가까이서 타격하는 실탄 샷건과 거의 동일한 데미지</li>
                    <li>• 실탄보다 범위 좌, 우로 넓음</li>
                    <li>
                      • <strong>RVR에서 주력 원거리 딜링기</strong>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 id="guide-16-section-2-heading-8">릴데블</h4>
                  <ul>
                    <li>
                      • <strong>투사체 속도가 매우 느림</strong>
                    </li>
                    <li>• 기동사격(마르니탄)을 이동기로 사용 가능</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="article-callout">
            <p>💡 대부분의 경우에 샷건은 마르니탄이 더 강력합니다.</p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-section-3',
      title: '데드아이 클래스의 장점/단점',
      content: (
        <>
          {/* 장점 */}
          <div className="article-card">
            <h3 id="guide-16-section-3-heading-1">
              <span>✅</span> 장점
            </h3>
            <ul>
              <li>
                <strong>
                  1. "후방 기동 포격(S+E, 10초)" 기술의 매우 빠르고 안정적인 공격과 수비 즉시 전환
                  가능
                </strong>
                <ul>
                  <li>무지성으로 들어갔다가, "아님말고~"가 가능하다.</li>
                  <li>
                    ※ 후방 기동 포격의 "무적"이 삭제되어도 여전히 속도 자체는 빠르기에 이동기로써
                    사용이 가능하며, 여전히 좋은 탈출기다.
                  </li>
                </ul>
              </li>
              <li>
                <strong>2. 대부분의 기술이 이동하면서 타격하기에 일방적인 딜링이 가능하다.</strong>
              </li>
              <li>
                <strong>
                  3. 주력 회피기(미끄러지기)의 쿨타임이 "2초"이기에 스킬 1개와 미끄러지기를 반복하는
                  등 슈퍼아머를 유지하는 것에 적응하기 쉽다.
                </strong>
              </li>
            </ul>
          </div>

          {/* 단점 */}
          <div className="article-card">
            <h3 id="guide-16-section-3-heading-2">
              <span>⚠️</span> 단점
            </h3>
            <ul>
              <li>
                <strong>
                  1. 데드아이의 폭발적인 딜링은 샷건에서 나오지만, 샷건 타격 타이밍을 조절할 수가
                  없어서 상대방이 데드아이의 모션을 보고 피하기 쉽다.
                </strong>
              </li>
              <li>
                <strong>
                  2. 데드아이의 샷건 기술뿐만 아니라 리볼버, 릴데블 기술 또한 상대의 전략에 따라
                  딜을 전혀 못하는 상황이 발생할 수 있어서 원거리 클래스다운 겸손한 딜링이 필요할 수
                  있다.
                </strong>
              </li>
            </ul>
          </div>

          {/* 그림1.gif */}
          <div className="article-card">
            <div>
              <GuideImage src="/tip-images/그림1.gif" alt="데드아이 석양 전방가드 뚫림" />
            </div>
            <p>상대 데드아이가 석양(전방가드)을 사용하자마자 전방가드 뚫림</p>
          </div>

          {/* TIP 섹션 */}
          <div className="article-callout">
            <h4 id="guide-16-section-3-heading-3">💡 TIP</h4>
            <ul>
              <li>
                • 데드아이의 샷건, 릴데블 기술은 모션이 커서 상대가 피하기 쉽고 데드아이의 기술을
                알고 있는 상대와는 전방가드를 주의해서 사용하는 것이 좋다.
              </li>
              <li>• 데드아이의 석양을 꿰뚫는 일격은 기술 시작 초반에 캔슬이 안된다.</li>
              <li>• 데드아이의 덮쳐오는 죽음의 2타격 시작 시 캔슬이 안된다.</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-section-4',
      title: '운영법',
      content: (
        <>
          <div className="article-callout">
            <p>※ 클래스 숙련도는 솔라레의 창에서 가장 빠르게 올릴 수 있습니다.</p>
          </div>

          {/* 1번째 줄: 거점전(RVR) 운영법 + 길드 리그(소수전) 운영법 */}
          <div className="article-grid">
            {/* 거점전(RVR) 운영법 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>⚔️</span>
                </div>
                <h3 id="guide-16-section-4-heading-1">거점전(RVR) 운영법</h3>
              </div>

              <div>
                <p>
                  데드아이는 거점전에서 적진 후방의 원거리 적을 암살하거나, 전방의 근거리 적에게
                  지속적인 딜 압박을 가할 수 있으며, 외곽에서 꼬장을 하기에도 좋습니다.
                </p>
                <p>
                  하지만 위 데드아이의 역할과 동일하게 아군 원거리를 암살하려고 들어오는
                  클래스들에게도 충분히 위협을 받을 수 있습니다.
                </p>
                <p>
                  따라서 샷건으로 딜 압박을 할 때 약간의 무빙으로 거리를 조절하여 거리에 따라
                  데미지가 바뀌지 않는 "마르니탄" 샷건으로 끝 사거리만 맞추어 최대한 안정적으로
                  딜링을 할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 길드 리그(소수전) 운영법 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>🏆</span>
                </div>
                <h3 id="guide-16-section-4-heading-2">길드 리그(소수전) 운영법</h3>
              </div>

              <div>
                <p>
                  길드리그는 팀데스매치로 킬 포인트를 1,000점을 먼저 획득하거나 20분 내에 더 많은
                  점수를 획득해야 승리할 수 있는 콘텐츠로 효율적인 딜 분배가 필요합니다.
                </p>
                <p>
                  필요에 따라서 전방 라인의 포커싱을 거점전과 동일하게 할 수 있지만, 대부분의 경우에
                  빠른 기동력으로 후방의 상대 원거리 딜러 혹은 상대의 주력 딜러를 포커싱합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 2번째 줄: 솔라레의 창 운영법 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>🌟</span>
              </div>
              <h3 id="guide-16-section-4-heading-3">솔라레의 창 운영법</h3>
            </div>

            <div>
              <p>
                거점전, 길드리그의 경우 본인 장비를 그대로 사용하기에 "지구력"에 부담이 없어서 그냥
                막써도 지구력이 남습니다. 하지만 솔라레의 창의 경우 전용 장비와 수정을 착용해서
                "지구력"이 매우 부족합니다. 즉, 공격과 수비 전환이 굉장히 빠른 데드아이의 장점이
                약화될 수 있으며, 이를 보완하기 위해 지구력 관리가 필수적입니다.
              </p>

              {/* 그림2.gif */}
              <div className="article-callout">
                <div>
                  <GuideImage src="/tip-images/그림2.gif" alt="솔라레의 창 데드아이 운영법" />
                </div>
              </div>

              <p>
                솔라레의 창에서 데드아이는 상대 주력 딜러와 딜교환을 하지 않으면서 일방적인 딜링과
                포커싱을 하는 것이 주 역할입니다.
              </p>

              <p>
                즉, 상대가 날 보고 있다고 느끼면(살기 감지) 언제든지 이동기를 사용할 준비가
                되어있으면서, 상대가 날 놓치고 있다고 느끼면 바로 딜링해주면 됩니다.
              </p>

              <p>
                일반적으로는 상대에게 무지성으로 갖다 박지 않습니다. 그럼에도 갖다박는 이유는 그게
                재밌어서이지 이기려면 갖다 박지 않는 것을 추천드립니다.
              </p>

              <div className="article-callout">
                <p>
                  <strong>Ex.</strong> 총잡이 나가신다 – 난장판 으로 뒤잡기 CC를 노릴 수 있지만
                  오히려 광역 딜링을 하는 클래스가 대응한다면 셀프 백어택을 내어주는 꼴이니까요..
                </p>
              </div>

              <div className="article-callout">
                <p>
                  ※ 이제는 후방 기동 포격(에코 궁)의 무적이 삭제되었으니 조금 더 조심해야되긴
                  합니다.
                </p>
              </div>
            </div>
          </div>

          {/* RVR 구체적인 운영법 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>⚔️</span>
              </div>
              <h3 id="guide-16-section-4-heading-4">RVR 구체적인 운영법</h3>
            </div>

            <div>
              {/* 샷건 운영 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>🔫</span>
                  </div>
                  <h4 id="guide-16-section-4-heading-5">샷건 운영</h4>
                </div>
                <p>
                  데드아이의 다대다 PVP 기조는{' '}
                  <strong>
                    치확 특화를 받아서 [총잡이 나가신다], [덮쳐오는 죽음]의 샷건 딜을 하다가 [가득한
                    고통]으로 CC 트라이
                  </strong>
                  를 해보며 걸리면 딜을 더하고 안걸리면 5초후에 다시 합니다.
                </p>
                <p>
                  적이 백업을 너무 많이 온다 싶으면{' '}
                  <strong>[미끄러지기] - [후방 기동 포격]으로 쭉 빠지면서 다시 포지셔닝</strong>하면
                  끝입니다. 안정적인 포지셔닝이된다면 한번씩 릴데블을 퍼부어도 좋습니다.
                </p>
                <div className="article-callout">
                  <div>
                    <span>💡</span>
                    <p>미끄러지기 활용 패턴</p>
                  </div>
                  <div className="article-callout">
                    <p>
                      <strong>
                        [미끄러지기] - [총잡이 나가신다] - [미끄러지기] - [덮쳐오는 죽음] - (적이
                        너무 많이옴 or 적이 날 보고있음) - [미끄러지기] - [후방 기동 포격]
                      </strong>
                    </p>
                  </div>
                  <p>
                    ※ 미끄러지기의 쿨타임이 2초밖에 안되서 슈퍼아머를 유지하는 행위가 없고 이전 공격
                    스킬의 모션이 끝나기도 전에 쿨타임이 돌아서 편하게 그냥 누르고 있어도 됩니다.
                  </p>
                </div>
              </div>

              {/* 릴데블 운영 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>🚀</span>
                  </div>
                  <h4 id="guide-16-section-4-heading-6">릴데블 운영</h4>
                </div>
                <p>쇠몽둥이 기술 캔슬 외에도 쿨타임 관련 팁이 있습니다.</p>
                <div className="article-grid">
                  <div className="article-callout">
                    <div>
                      <span>⏰</span>
                      <h5>쿨타임 정보</h5>
                    </div>
                    <ul>
                      <li>
                        <span>•</span>
                        <span>
                          <strong>[폭발 도약]</strong>: 10초
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <strong>[개척자]</strong>: 14초
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <strong>[공중 폭격]</strong>: 7초
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="article-callout">
                    <div>
                      <span>⚡</span>
                      <h5>효율적인 사용법</h5>
                    </div>
                    <p>
                      공중에서 딜링하는 스킬의 쿨타임이 7초이기에 굳이 이동기를 같이 쓸 필요가
                      없습니다.
                    </p>
                  </div>
                </div>
                <div className="article-callout">
                  <div>
                    <span>🎯</span>
                    <p>추천 연계</p>
                  </div>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>[폭발 도약] - [공중 폭격]</strong>
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>[개척자] - [공중 폭격]</strong>
                      </span>
                    </li>
                  </ul>
                  <p>
                    ※ 이동기의 쿨타임에 따라 나누고 커맨드로 스킬을 사용해주면 더 빠르게 공중 폭격을
                    거의 7초마다 안정적으로 사용할 수 있습니다.
                  </p>
                </div>
                <div className="article-callout">
                  <div>
                    <span>🔄</span>
                    <p>실탄 전환 팁</p>
                  </div>
                  <p>
                    적이 지금 도망가고있고, 현재 마르니탄을 들고 있다면
                    <strong>[미끄러지기] - [총탄 전환]</strong>으로 빠르게 실탄으로 전환하여
                    릴데블을 쏠 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 리볼버 운영 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>🎯</span>
                  </div>
                  <h4 id="guide-16-section-4-heading-7">리볼버 운영</h4>
                </div>
                <p>
                  마르니탄 기동사격은 가끔 적과의 거리가 애매하게 너무 위험할때 약간만 뒤로가고
                  싶을때 혹은 [후방 기동 포격]과 같은 지구력이 많이 드는 스킬을 사용하기 전에
                  [기동사격]으로 째면서 이동기로 사용하는 경우가 많습니다.
                </p>
                <div className="article-callout">
                  <div>
                    <span>💥</span>
                    <h5>가득한 고통 활용법</h5>
                  </div>
                  <p>
                    적의 빈틈이 나타날 타이밍에 맞춰 [가득한 고통]으로 빈틈을 노려줄 수 있습니다.
                  </p>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>좌, 우로 사용하고 커맨드를 유지하면 1타격(cc) 추가로 사용 가능</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        후방으로 사용시 커맨드를 유지하면 더 많은 거리를 이동하면서 추가 1타격을
                        사용
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>후방 사용시 스킬 하나로 2cc까지 넣을 수 있음</span>
                    </li>
                  </ul>
                </div>
                <div className="article-callout">
                  <div>
                    <span>⚡</span>
                    <p>추천 연계</p>
                  </div>
                  <div className="article-callout">
                    <p>
                      <strong>
                        [가득한 고통] - [기동사격] - [미소 짓는 기만] - [신속 사격] - [석양]
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-section-5',
      title: 'PVP 콤보',
      content: (
        <>
          <div className="article-callout">
            <p>
              ※ 콤보는 실사용을 위해 외우는 것이 아닌, 최소한의 "클래스 이해도를 올리기위해 기술을
              연계해보는 것" 그 이상 그 이하도 아닙니다.
            </p>
            <p>
              ※ 즉, 콤보는 상황에 따라 항상 바뀌어서 그대로 쓰는 것이 아니라 클래스에 적응하기 위한
              최소 정보로 보시면 좋을 것 같습니다.
            </p>
          </div>

          {/* 그림3.gif */}
          <div className="article-card">
            <div>
              <GuideImage src="/tip-images/그림3.gif" alt="데드아이 PVP 콤보" />
            </div>
          </div>

          {/* 2CC 콤보 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>⚔️</span>
              </div>
              <h3 id="guide-16-section-5-heading-1">2CC 콤보</h3>
            </div>
            <p>※ 적을 마무리하는 콤보라기 보다 안정적으로 딜을 넣는 콤보라고 봐주시면 좋아요.</p>

            <div>
              {/* 콤보 1 */}
              <div className="article-callout">
                <h4 id="guide-16-section-5-heading-2">
                  <span>
                    <span>1</span>
                  </span>
                  일반(공속 특화), (1 : 1 상황에서 추천)
                </h4>
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <div>총잡이 나가신다</div>
                      <div>진입기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>가득한 고통</div>
                      <div>기절 1CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>기동사격(4타격)</div>
                      <div>백어택 잡기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>미소 짓는 기만</div>
                      <div>전방가드</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>신속 사격</div>
                      <div>넉다운 2CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>석양을 꿰뚫는 일격</div>
                      <div>마무리</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 콤보 2 */}
              <div className="article-callout">
                <h4 id="guide-16-section-5-heading-3">
                  <span>
                    <span>2</span>
                  </span>
                  일반(공속 특화), (1 : 1 상황에서 추천)
                </h4>
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <div>총잡이 나가신다</div>
                      <div>진입기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>가득한 고통</div>
                      <div>기절 1CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>미소 짓는 기만</div>
                      <div>전방가드</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>속사</div>
                      <div>딜링</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>신속 사격</div>
                      <div>넉다운 2CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>석양을 꿰뚫는 일격</div>
                      <div>마무리</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 콤보 3 */}
              <div className="article-callout">
                <h4 id="guide-16-section-5-heading-4">
                  <span>
                    <span>3</span>
                  </span>
                  샤이 버프, (1 : 1 상황에서 추천)
                </h4>
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <div>총잡이 나가신다</div>
                      <div>진입기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>가득한 고통</div>
                      <div>기절 1CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>기동사격(4타격)</div>
                      <div>백어택 잡기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>미소 짓는 기만</div>
                      <div>전방가드</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>속사</div>
                      <div>딜링</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>신속 사격</div>
                      <div>넉다운 2CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>석양을 꿰뚫는 일격</div>
                      <div>마무리</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 설명 */}
            <div className="article-callout">
              <div>
                <span>💡</span>
                <h4 id="guide-16-section-5-heading-5">콤보 시작 방법</h4>
              </div>
              <p>
                <strong>[총잡이 나가신다]</strong> 혹은 <strong>[덮쳐오는 죽음]</strong>,{' '}
                <strong>[기동사격]</strong>를 이동기 또는 짤딜로 쓰다가{' '}
                <strong>[가득한 고통]</strong>으로 CC 트라이
              </p>
              <p>CC 적중시 이후 콤보 시작</p>
            </div>
          </div>

          {/* 추가 콤보 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>⚡</span>
              </div>
              <h3 id="guide-16-section-5-heading-6">추가 콤보</h3>
            </div>

            <div>
              {/* 콤보 4 */}
              <div className="article-callout">
                <h4 id="guide-16-section-5-heading-7">
                  <span>
                    <span>4</span>
                  </span>
                  일반(공속 특화), (백업 가능한 적이 주변에 있을때)
                </h4>
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <div>총잡이 나가신다</div>
                      <div>진입기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>가득한 고통</div>
                      <div>기절 1CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>미소 짓는 기만</div>
                      <div>전방가드</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>속사</div>
                      <div>딜링</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>난장판</div>
                      <div>기절 2CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>풍차걸음</div>
                      <div>딜링</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>피바람</div>
                      <div>딜링</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>미끄러지기</div>
                      <div>회피</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>후방 기동 포격</div>
                      <div>회피</div>
                    </div>
                  </div>
                </div>
                <div className="article-callout">
                  <p>
                    ※ 가득한 고통으로 CC 트라이 → CC 적중시 이후 콤보를 쓰다가 적이 백업 올것 같으면
                    미끄러지기 + 후방 기동 포격으로 회피
                  </p>
                </div>
              </div>

              {/* 콤보 5 */}
              <div className="article-callout">
                <h4 id="guide-16-section-5-heading-8">
                  <span>
                    <span>5</span>
                  </span>
                  일반(공속 특화), (백업 가능한 적이 주변에 있을때)
                </h4>
                <div className="article-callout">
                  <div>
                    <div className="article-callout">
                      <div>총잡이 나가신다</div>
                      <div>진입기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>난장판</div>
                      <div>기절 1CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>기동사격(4타격)</div>
                      <div>백어택 잡기</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>미소 짓는 기만</div>
                      <div>전방가드</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>가득한 고통</div>
                      <div>기절 2CC</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>풍차걸음</div>
                      <div>딜링</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>피바람</div>
                      <div>딜링</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>미끄러지기</div>
                      <div>회피</div>
                    </div>
                    <span>→</span>
                    <div className="article-callout">
                      <div>후방 기동 포격</div>
                      <div>회피</div>
                    </div>
                  </div>
                </div>
                <div className="article-callout">
                  <p>
                    ※ 첫 CC를 난장판으로 트라이하고 CC가 걸리면 약간의 딜 이후 후퇴 준비. 첫
                    난장판으로 안걸리면 기동사격으로 후퇴하거나 체력이 많이 빠질것 같으면 바로 후방
                    기동 포격으로 후퇴.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 콤보 영상 */}
          <div className="article-card">
            <h3 id="guide-16-section-5-heading-9">콤보 영상</h3>
            <div className="article-grid">
              <div>
                <GuideImage src="/tip-images/그림4.gif" alt="데드아이 진입기 1" />
              </div>
              <div>
                <GuideImage src="/tip-images/그림5.gif" alt="데드아이 진입기 2" />
              </div>
            </div>
          </div>

          {/* 주로 사용하는 진입기 */}
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>🎯</span>
              </div>
              <h3 id="guide-16-section-5-heading-10">주로 사용하는 진입기</h3>
            </div>
            <div className="article-grid">
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>1</span>
                  </div>
                  <p>미끄러지기 – 총잡이 나가신다</p>
                </div>
              </div>
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>2</span>
                  </div>
                  <p>미끄러지기 – 덮쳐오는 죽음</p>
                </div>
              </div>
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>3</span>
                  </div>
                  <p>미끄러지기 - 후방 기동 포격</p>
                </div>
              </div>
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>4</span>
                  </div>
                  <p>미끄러지기 – 폭발 도약</p>
                </div>
              </div>
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>5</span>
                  </div>
                  <p>미끄러지기 – 기동사격</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-section-6',
      title: '기술 캔슬 시스템',
      content: (
        <>
          <div className="article-callout">
            <p>
              ※ 기술 캔슬은 데드아이의 핵심 메커니즘으로, 선딜을 제거하여 더 빠르고 효율적인 전투가
              가능합니다.
            </p>
          </div>

          <div>
            {/* 쇠몽둥이 선딜 캔슬 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>🔨</span>
                </div>
                <h3 id="guide-16-section-6-heading-1">1. 쇠몽둥이 선딜 캔슬</h3>
              </div>
              <p>
                쇠몽둥이는 그냥 사용하면 선딜이 너무 길어서 몇몇 스킬을 앞에 사용하면 선딜이
                캔슬됩니다.
              </p>

              {/* 쇠몽둥이 캔슬 비교 비디오 */}
              <div className="article-grid">
                <div>
                  <h5>쇠몽둥이 캔슬 전</h5>
                  <video controls preload="none" playsInline>
                    <source src="/tip-images/쇠몽둥이캔슬전.mp4" type="video/mp4" />
                    브라우저가 비디오를 지원하지 않습니다.
                  </video>
                </div>
                <div>
                  <h5>쇠몽둥이 캔슬 후</h5>
                  <video controls preload="none" playsInline>
                    <source src="/tip-images/쇠몽둥이캔슬후.mp4" type="video/mp4" />
                    브라우저가 비디오를 지원하지 않습니다.
                  </video>
                </div>
              </div>

              <div className="article-grid">
                <div className="article-callout">
                  <div>
                    <span>⚡</span>
                    <h4 id="guide-16-section-6-heading-2">기본 캔슬 스킬</h4>
                  </div>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>폭발 도약 → 쇠몽둥이</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>공중 폭격 → 쇠몽둥이</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>파괴의 미학 → 쇠몽둥이</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>정밀 사격 → 쇠몽둥이</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>로켓 작열 → 쇠몽둥이</span>
                    </li>
                  </ul>
                </div>
                <div className="article-callout">
                  <div>
                    <span>⭐</span>
                    <h4 id="guide-16-section-6-heading-3">추천 캔슬 스킬</h4>
                  </div>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>미끄러지기 → 쇠몽둥이</strong>
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>총잡이 나가신다(리볼버까지) → 쇠몽둥이</strong>
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>덮쳐오는 죽음(1타격까지) → 쇠몽둥이</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="article-callout">
                <div>
                  <span>🚀</span>
                  <h4 id="guide-16-section-6-heading-4">릴데블 연계 (빠르게 쏘기)</h4>
                </div>

                {/* 릴데블연계.mp4 비디오 */}
                <div>
                  <video controls preload="none" playsInline>
                    <source src="/tip-images/릴데블연계.mp4" type="video/mp4" />
                    브라우저가 비디오를 지원하지 않습니다.
                  </video>
                </div>

                {/* 스킬 연계 표시 */}
                <div>
                  <div>
                    <span>영상 콤보 : </span>
                    <span>[폭발 도약]</span>
                    <span>→</span>
                    <span>[공중 폭격]</span>
                    <span>→</span>
                    <span>[쇠몽둥이]</span>
                    <span>→</span>
                    <span>[로켓 작열]</span>
                    <span>→</span>
                    <span>[정밀 사격]</span>
                  </div>
                </div>

                <ul>
                  <li>
                    <span>•</span>
                    <span>미끄러지기 → 쇠몽둥이 → 로켓 작열 → 정밀 사격</span>
                  </li>
                  <li>
                    <span>•</span>
                    <span>로켓 작열 → 정밀 사격 → 쇠몽둥이</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 속사 선딜 캔슬 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>⚡</span>
                </div>
                <h3 id="guide-16-section-6-heading-5">2. 속사 선딜 캔슬</h3>
              </div>
              <p>
                속사를 그냥 쓰면 오른손으로 총을 돌리는 모션이 추가되어 느려집니다. 몇몇 스킬을 앞에
                사용하면 선딜이 캔슬됩니다.
              </p>

              {/* 속사 캔슬 비교 비디오 */}
              <div className="article-grid">
                <div>
                  <h5>속사 캔슬 전</h5>
                  <video controls preload="none" playsInline>
                    <source src="/tip-images/속사캔슬전.mp4" type="video/mp4" />
                    브라우저가 비디오를 지원하지 않습니다.
                  </video>
                </div>
                <div>
                  <h5>속사 캔슬 후</h5>
                  <video controls preload="none" playsInline>
                    <source src="/tip-images/속사캔슬후.mp4" type="video/mp4" />
                    브라우저가 비디오를 지원하지 않습니다.
                  </video>
                  {/* 영상 콤보 표시 */}
                  <div>
                    <div>
                      <span>영상 콤보 : </span>
                      <span>[미끄러지기]</span>
                      <span>-</span>
                      <span>[속사]</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="article-grid">
                <div className="article-callout">
                  <div>
                    <span>⭐</span>
                    <h4 id="guide-16-section-6-heading-6">추천 캔슬 스킬</h4>
                  </div>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>미소 짓는 기만 → 속사</strong>
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>숨겨진 카드 → 속사</strong>
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>가득한 고통 → 속사</strong>
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>미끄러지기 → 속사</strong>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="article-callout">
                  <div>
                    <span>📋</span>
                    <h4 id="guide-16-section-6-heading-7">기타 캔슬 스킬</h4>
                  </div>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>신속 사격 → 속사</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>회피 사격 → 속사</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>흐름:연사 → 속사</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>뜨거운 숨결(라밤) → 속사</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>떨어지는 죽음(라밤) → 속사</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>커너리의 선물 → 속사</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 석양 선딜 캔슬 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>☀️</span>
                </div>
                <h3 id="guide-16-section-6-heading-8">3. 석양 선딜 캔슬</h3>
              </div>
              <p>석양을 꿰뚫는 일격의 선딜을 캔슬할 수 있는 스킬들입니다.</p>

              {/* 석양 캔슬 비디오 */}
              <div>
                <h5>석양 캔슬</h5>
                <video controls preload="none" playsInline>
                  <source src="/tip-images/석양캔슬.mp4" type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
                {/* 영상 콤보 표시 */}
                <div>
                  <div>
                    <span>영상 콤보 : </span>
                    <span>[미끄러지기]</span>
                    <span>-</span>
                    <span>[속사]</span>
                    <span>-</span>
                    <span>[석양]</span>
                  </div>
                </div>
              </div>

              <div className="article-grid">
                <div className="article-callout">
                  <div>
                    <span>⭐</span>
                    <h4 id="guide-16-section-6-heading-9">추천 캔슬 스킬</h4>
                  </div>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>속사 → 석양</strong>
                      </span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>
                        <strong>신속사격 → 석양</strong>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="article-callout">
                  <div>
                    <span>📋</span>
                    <h4 id="guide-16-section-6-heading-10">기타 캔슬 스킬</h4>
                  </div>
                  <ul>
                    <li>
                      <span>•</span>
                      <span>별빛 축포 → 석양</span>
                    </li>
                    <li>
                      <span>•</span>
                      <span>뜨거운 숨결(라밤) → 석양</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="article-callout">
                <div>
                  <span>⚠️</span>
                  <p>중요한 팁</p>
                </div>
                <p>
                  <strong>미끄러지기 → 석양</strong>은 석양의 선딜 캔슬이 안되므로,
                  <strong>미끄러지기 → 속사 → 석양</strong> 연계가 안전하고 빠르게 석양을 쓸 수
                  있습니다.
                </p>
              </div>
            </div>

            {/* 총잡이 나가신다 캔슬 */}
            <div className="article-callout">
              <div>
                <div className="article-callout">
                  <span>🎯</span>
                </div>
                <h3 id="guide-16-section-6-heading-11">4. 총잡이 나가신다 캔슬</h3>
              </div>
              <p>
                <span>[총잡이 나가신다]</span>의 마지막 샷건 모션은 아래의 기술로 캔슬할 수 있다.
              </p>

              <div className="article-callout">
                <div className="article-grid">
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 가득한 고통</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 덮쳐오는 죽음</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 폭발 도약</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 기동사격</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 난장판</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 풍차걸음</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 개척자</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 커너리의 선물</span>
                  </div>
                  <div>
                    <span>•</span>
                    <span>총잡이 나가신다 – 쇠몽둥이</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-section-7',
      title: '디테일',
      content: (
        <>
          <div className="article-callout">
            <div>
              <div className="article-callout">
                <span>🔧</span>
              </div>
              <div>
                <p>데드아이의 각 기술의 모든 연계와 세부 사항을 살펴봅니다.</p>
                <p>
                  ※ 문서화하지 않은 상태로 앉은 자리에서 생각나는 것을 작성한 것이라 빠진 부분이
                  있을 수 있습니다.
                </p>
              </div>
            </div>

            <div>
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>1</span>
                  </div>
                  <div>
                    <p>
                      <span>[폭발 도약]</span>은 마르니탄이 더 높이 뛴다. 여기서 더 높이 뛰려면
                      점프한 상태에서 Q를 입력하면 더 높이 뛴다.
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
                    <p>
                      <span>"실탄"</span> 샷건은 거리에 따라 데미지가 달라진다.
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
                    <p>
                      <span>"마르니탄"</span> 샷건은 거리에 상관없이 최대 데미지이다.
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
                    <p>
                      <span>[기동사격]</span>은 최소 4타격이며, 최대 8타격까지 사용할 수 있다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 지구력 관리 팁 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>5</span>
                  </div>
                  <div>
                    <p>
                      <span>지구력 관리 팁</span> (솔라레의 창에서 중요)
                    </p>
                    <ul>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[폭발 도약]</span> - <span>[개척자]</span>로 사용한 지구력을{' '}
                          <span>[개척자]</span> 사용 중 <span>[공중 폭격]</span>을 사용하면{' '}
                          <span>[공중 폭격]</span>의 슈퍼아머 판정이 지속되는 동안 소모한 지구력이
                          모두 회복
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[폭발 도약]</span> - <span>[공중 폭격]</span>을 사용하면 착지
                          시점부터 지구력이 회복
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[후방 기동포격]</span>을 사용하면 착지 시점부터 지구력이 회복
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[가득한 고통]</span> 사용시 모션이 진행되는 동안 지구력이 회복되지
                          않음. 그리고 이 모션은 슈퍼아머가 끝나도 오랫동안 지속
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[총잡이 나가신다]</span> 샷건 타격 이후 지구력이 회복
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[덮쳐오는 죽음]</span> 사용 시 1타격이 끝난 후, 샷건 모션이
                          시작되면서 지구력이 회복
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[난장판]</span>은 지구력이 소모되지 않는 이동기, 딜링기, CC기이자
                          낙하 모션이 발동되지 않는 스킬
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 고급 팁들 */}
              <div className="article-callout">
                <div>
                  <div className="article-callout">
                    <span>6</span>
                  </div>
                  <div>
                    <p>
                      <span>고급 팁들</span>
                    </p>
                    <ul>
                      <li>
                        <span>•</span>
                        <span>
                          공중에 가장 오랫동안 머무는 콤보는 <span>[폭발 도약]</span> -{' '}
                          <span>[개척자]</span> - <span>[공중 폭격]</span>
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>마르니탄이 실탄보다 범위가 더 크다</span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[후방 기동 포격]</span>의 마지막 도약 모션은 낙하 모션을 발동시키지
                          않는다
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[난장판]</span>, <span>[풍차걸음]</span>, <span>[총탄 폭풍]</span>,{' '}
                          <span>[제압 사격]</span>은 낙하 모션을 발동시키지 않는다
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          <span>[릴데블]</span>은 실탄 투사체의 속도가 마르니탄보다 훨씬 빠르다
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          리볼버 실탄은 첫 에임만 맞고 에임이 너무 벗어나지 않는 이상 조준 도우미의
                          영향을 받아 유도탄이 된다
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          실탄 <span>[릴데블]</span>은 범위가 좁아서 분산딜의 영향이 상대적으로
                          적기에 사실상 딜이 더 쌔다 (피해량 자체도 실탄이 더 쌔다)
                        </span>
                      </li>
                      <li>
                        <span>•</span>
                        <span>
                          마르니탄의 <span>[별빛축포]</span>가 실탄보다 모션이 훨씬 빨라서 급하게
                          전방가드를 사용할때 좋다
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-section-8',
      title: '거점/솔라레의 창/길드 리그 특화 및 수정',
      content: (
        <>
          {/* 특화 */}
          <div>
            <h3 id="guide-16-section-8-heading-1">특화</h3>
            <div className="article-card">
              <div>
                <GuideImage src="/tip-images/데드아이특화.png" alt="데드아이 특화" />
              </div>
              <p>
                특화는 거의 맨날 바뀌어서 솔라레의 창 랭킹에서 찾아서 보시는걸 추천 드립니다!
                10월23일 기준 이렇게 쓰고 있습니다
              </p>

              {/* 특화 설명 */}
              <div>
                <div className="article-grid">
                  <div>
                    <div className="article-callout">
                      <h5>총잡이 나가신다</h5>
                      <p>진입기 + 주력 특화(치명타 확률) 버프 수급 + 딜 압박</p>
                    </div>
                    <div className="article-callout">
                      <h5>가득한 고통</h5>
                      <p>변수 창출 + 기절 cc로 뒤잡기</p>
                    </div>
                    <div className="article-callout">
                      <h5>미소 짓는 기만</h5>
                      <p>전방가드로 버티면서 효율적인 딜교환을 위함</p>
                    </div>
                  </div>
                  <div>
                    <div className="article-callout">
                      <h5>기동사격</h5>
                      <p>효율적인 딜교환을 위한 가장 높은 우선순위의 특화 버프</p>
                    </div>
                    <div className="article-callout">
                      <h5>난장판</h5>
                      <p>
                        주력 딜링+진입+cc기로써 상대의 반응응 가능한 공격속도를 낮추기 위함+이동속도
                      </p>
                    </div>
                    <div className="article-callout">
                      <h5>공중 폭격</h5>
                      <p>
                        공중에서 안정적으로 특화 버프를 수급할 수 있어서 주력 딜링 특화(치명타 확률)
                        + 안정성(방어력) 특화 버프
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 수정 */}
          <div>
            <h3 id="guide-16-section-8-heading-2">수정</h3>
            <div className="article-grid">
              <div className="article-card">
                <div>
                  <GuideImage src="/tip-images/데드아이수정1.png" alt="데드아이 수정 1" />
                </div>
              </div>
              <div className="article-card">
                <div>
                  <GuideImage src="/tip-images/데드아이수정2.png" alt="데드아이 수정 2" />
                </div>
              </div>
            </div>
            <p>수정은 취향 차이입니다. 저는 훔을 더 선호하는 편 입니다</p>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-section-9',
      title: '하고싶은 말',
      content: (
        <>
          <div className="article-card">
            <div>
              <p>
                <strong>09/24, 데드아이의 릴데블 관련 패치</strong>
              </p>
              <p>
                <strong>10/22, 데드아이의 방어판정 추가적인 패치</strong>
              </p>
              <p>데드아이의 성능 관련해서 변경점들이 많았습니다.</p>
              <p>제 생각에는 아직 준수한 딜러로써 활동가능한 클래스 같습니다.</p>
              <p>
                거점전과 길드리그에서는 여전히 주력 딜러일 것이고, 솔라레의 창의 경우 전 시즌 기준
                성능이 약간 내려왔다고 볼 수 있으나 주변 클래스 들(각성 세이지, 전승 하사신)도
                너프가 이루어졌으며, 잡기 또한 너프를 당해서 이전과 똑같다고 생각합니다.
              </p>
              <p>
                즉, 이번 패치로 데드아이 클래스의 성능의 저점은 살짝 내려왔으나 고점은 그대로이고
                여전히 좋다.
              </p>
              <p>그럼 마스터 클래스 파이팅입니다.</p>

              {/* 무슨말.png 이미지 */}
              <div>
                <GuideImage src="/tip-images/무슨말.png" alt="무슨말" />
              </div>
            </div>

            <div className="article-callout">
              <p>검은사막 인벤, 데드아이 게시판 PVP가이드를 참고해도 좋습니다.</p>
              <p>
                <a
                  href="https://www.inven.co.kr/board/black/6337/498"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.inven.co.kr/board/black/6337/498
                </a>
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'guide-16-references',
      title: '작성자 자료와 참고 영상',
      content: (
        <>
          <GuideVideo
            src="https://www.youtube.com/embed/ryni1qwU1mI?si=qPLD7GAb_pNi4V4r"
            title="데드아이 가이드 영상"
          />
        </>
      ),
    },
  ],
  headings: [
    {
      id: 'guide-16-section-2-heading-1',
      title: '실탄',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-2-heading-2',
      title: '리볼버',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-2-heading-3',
      title: '샷건',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-2-heading-4',
      title: '릴데블',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-2-heading-5',
      title: '마르니탄',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-2-heading-6',
      title: '리볼버',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-2-heading-7',
      title: '샷건',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-2-heading-8',
      title: '릴데블',
      section: 'guide-16-section-2',
    },
    {
      id: 'guide-16-section-3-heading-1',
      title: '장점',
      section: 'guide-16-section-3',
    },
    {
      id: 'guide-16-section-3-heading-2',
      title: '단점',
      section: 'guide-16-section-3',
    },
    {
      id: 'guide-16-section-3-heading-3',
      title: 'TIP',
      section: 'guide-16-section-3',
    },
    {
      id: 'guide-16-section-4-heading-1',
      title: '거점전(RVR) 운영법',
      section: 'guide-16-section-4',
    },
    {
      id: 'guide-16-section-4-heading-2',
      title: '길드 리그(소수전) 운영법',
      section: 'guide-16-section-4',
    },
    {
      id: 'guide-16-section-4-heading-3',
      title: '솔라레의 창 운영법',
      section: 'guide-16-section-4',
    },
    {
      id: 'guide-16-section-4-heading-4',
      title: 'RVR 구체적인 운영법',
      section: 'guide-16-section-4',
    },
    {
      id: 'guide-16-section-4-heading-5',
      title: '샷건 운영',
      section: 'guide-16-section-4',
    },
    {
      id: 'guide-16-section-4-heading-6',
      title: '릴데블 운영',
      section: 'guide-16-section-4',
    },
    {
      id: 'guide-16-section-4-heading-7',
      title: '리볼버 운영',
      section: 'guide-16-section-4',
    },
    {
      id: 'guide-16-section-5-heading-1',
      title: '2CC 콤보',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-2',
      title: '1 일반(공속 특화), (1 : 1 상황에서 추천)',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-3',
      title: '2 일반(공속 특화), (1 : 1 상황에서 추천)',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-4',
      title: '3 샤이 버프, (1 : 1 상황에서 추천)',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-5',
      title: '콤보 시작 방법',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-6',
      title: '추가 콤보',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-7',
      title: '4 일반(공속 특화), (백업 가능한 적이 주변에 있을때)',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-8',
      title: '5 일반(공속 특화), (백업 가능한 적이 주변에 있을때)',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-9',
      title: '콤보 영상',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-5-heading-10',
      title: '주로 사용하는 진입기',
      section: 'guide-16-section-5',
    },
    {
      id: 'guide-16-section-6-heading-1',
      title: '1. 쇠몽둥이 선딜 캔슬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-2',
      title: '기본 캔슬 스킬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-3',
      title: '추천 캔슬 스킬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-4',
      title: '릴데블 연계 (빠르게 쏘기)',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-5',
      title: '2. 속사 선딜 캔슬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-6',
      title: '추천 캔슬 스킬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-7',
      title: '기타 캔슬 스킬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-8',
      title: '3. 석양 선딜 캔슬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-9',
      title: '추천 캔슬 스킬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-10',
      title: '기타 캔슬 스킬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-6-heading-11',
      title: '4. 총잡이 나가신다 캔슬',
      section: 'guide-16-section-6',
    },
    {
      id: 'guide-16-section-8-heading-1',
      title: '특화',
      section: 'guide-16-section-8',
    },
    {
      id: 'guide-16-section-8-heading-2',
      title: '수정',
      section: 'guide-16-section-8',
    },
  ],
}
export default content
