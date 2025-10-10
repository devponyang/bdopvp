'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AwakenedWizardGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/20', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_20')
          if (likedBefore === 'true') {
            setLiked(true)
          }
        }
      } catch (error) {
        console.error('게시글 로딩 에러:', error)
      }
    }
    fetchPost()
  }, [])

  // 조회수 증가
  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        await fetch('/api/tip-board/20/view', { method: 'POST' })
      } catch (error) {
        console.error('조회수 증가 실패:', error)
      }
    }
    incrementViewCount()
  }, [])

  const handleLike = async () => {
    if (liked || liking) return
    
    setLiking(true)
    try {
      const res = await fetch('/api/tip-board/20/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_20', 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

  return (
    <div className="max-w-full md:max-w-[1200px] mx-auto p-3 md:p-6">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <Link 
          href="/tip-board"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-zinc-800/60 to-zinc-700/60 hover:from-zinc-700/70 hover:to-zinc-600/70 text-blue-400 hover:text-blue-300 rounded-xl transition-all duration-300 border border-zinc-600/40 hover:border-zinc-500/60 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          ← 팁게시판으로 돌아가기
        </Link>
      </div>

      {/* 헤더 */}
      <div className="relative text-center py-16 px-8 rounded-3xl mb-8 shadow-2xl border border-slate-600 overflow-hidden">
        {/* 배경 이미지 레이어 (50% 불투명도) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/ponyang/tip-bg.png)',
            backgroundPosition: 'center 40%',
            opacity: 0.5,
            zIndex: 0,
          }}
        />
        {/* 텍스트 레이어 (100% 불투명도) */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/class-icons/wizard.png" alt="위자드" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              각성 위자드 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "마법의 힘으로 전장을 지배하다."
          </p>
        </div>
      </div>

      {/* 클래스 가이드 안내 */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-amber-400/30 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="text-amber-300 font-semibold mb-2">클래스 가이드 안내</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                이 글은 <strong>클래스 가이드</strong>로, 작성자의 <strong>개인적인 경험과 주관적인 의견</strong>이 포함되어 있습니다. 
                작성자만의 <strong>스타일과 팁</strong>을 공유하는 글이므로, 다른 플레이어들과는 다를 수 있습니다. 
                참고용으로 활용하시고, 자신에게 맞는 방식으로 적용해보세요.
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* 작성자 이미지 */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/tip-images/wizardzzal.gif" 
            alt="wizardzzal" 
            className="rounded-xl shadow-2xl max-w-2xl w-full h-auto border border-slate-600"
          />
        </div>

        {/* 작성자 정보 */}
        <div className="relative bg-gradient-to-r from-slate-800 via-slate-800 to-purple-900/50 p-6 rounded-2xl mb-8 shadow-2xl border border-purple-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30">
            <span className="text-4xl">✍️</span>
          </div>
          <div>
            <p className="text-white text-xl font-semibold mb-2">
              <span className="text-gray-300">작성자:</span> <Link href="/guild/아지다하카" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">아지다하카</Link> 길드 <span className="text-blue-400 font-bold">88o</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 rounded-lg shadow-lg">
              <img src="/class-icons/wizard.png" alt="위자드" className="w-5 h-5 object-contain" />
              <p className="text-purple-300 font-bold text-sm">
                솔라레의 창 - 각성 위자드 랭킹 1위
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. 소개 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-blue-500">
        <h2 className="text-white text-3xl font-bold mb-4 flex items-center">
          <span className="mr-3 text-4xl">👋</span> 소개
        </h2>
        <p className="text-slate-200 text-lg leading-relaxed">
          안녕하세요 <Link href="/guild/아지다하카" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors font-bold">아지다하카</Link> 길드의 <strong className="text-blue-400">88o</strong> 입니다.
        </p>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 각성 위자드의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6 list-decimal">
            <li><strong className="text-green-400">딜압축이 좋고</strong> 방어판정이 안정적임</li>
            <li>샤이버프와 중첩되는 <strong className="text-green-400">신속의 주문</strong> 보유</li>
            <li>거점전에서 <strong className="text-green-400">광역힐</strong>로 본대라인 빠르게 회복시켜줄 수 있음</li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6 list-decimal">
            <li><strong className="text-red-400">이동기가 구리다</strong> <br />
              장거리 이동하려면 반드시 맨몸달리기 해야하는데 매구 무사 매화 등 압도적 이동기 가진 직업이 마크하면 교전위치에 합류 못함. 
              텔포로 합류하면 높은 확률로 잡기걸려서 죽음
            </li>
            <li><strong className="text-red-400">서포트형 기술(힐,신속)에 방어판정 없음</strong></li>
            <li><strong className="text-red-400">구캐릭이라 주무기↔각성무기 스왑이 불편함</strong> <br />
              대부분 퀵슬롯으로 해야함
            </li>
            <li>맞을일이 많아서 <strong className="text-red-400">슈아가속 심하게 영향받음</strong></li>
          </ul>
        </div>
      </div>

      {/* 3. 각성 위자드 운용법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 각성 위자드 운용법
        </h2>
        
        {/* 필수 퀵슬롯 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-yellow-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 필수 퀵슬롯
          </h3>
          
          <div className="mb-6 flex justify-center">
            <img 
              src="/tip-images/위자드퀵슬롯.png" 
              alt="위자드 퀵슬롯" 
              className="rounded-lg shadow-lg max-w-full h-auto border border-slate-500"
            />
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-200 text-lg mb-4">일단 퀵슬롯에 이거 다 올려야 함</p>
            
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <h4 className="text-cyan-300 text-lg font-bold mb-2">순간이동</h4>
              <p className="text-slate-200">
                돌맹이 같은 오브젝트 앞에서 넘어졌을 때 커맨드로 쓰면 파쿠르 하다가 죽음. 그래서 방해물 있는 경우 슬롯으로 사용
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <h4 className="text-cyan-300 text-lg font-bold mb-2">지진, 차가운안개, 유성낙하</h4>
              <p className="text-slate-200">
                퀵슬롯으로 비각 전환됨
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <h4 className="text-cyan-300 text-lg font-bold mb-2">물구슬, 아네, 마그소환</h4>
              <p className="text-slate-200">
                비각 → 각성 전환기, 아네마그는 슈아 유지 용도로 두 개 다 씀
              </p>
            </div>
          </div>
        </div>

        {/* 잠구는 스킬 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-red-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔒</span> 잠구는 스킬
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="text-red-300 text-lg font-bold mb-2">아네, 마그 소환</h4>
              <p className="text-slate-200">
                커맨드 잠구고 퀵슬롯 등록 해주세요<br />
                업화나 대재앙 쓸 때 <span className="text-yellow-300 font-mono">WF</span>, <span className="text-yellow-300 font-mono">Shift+F</span> 대신 <span className="text-green-300 font-mono">FW</span>, <span className="text-green-300 font-mono">F+Shift</span> 로 누르면 삑사리 납니다
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="text-red-300 text-lg font-bold mb-2">용암지대</h4>
              <p className="text-slate-200">
                PvP 에서 쓸 일 없고 원소화랑 커맨드 겹칠 수 있어서 잠금
              </p>
            </div>
          </div>
        </div>

        {/* 커맨드로 사용시 이득이 있는 스킬 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-green-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⌨️</span> 커맨드로 사용시 이득이 있는 스킬
          </h3>
          
          <div className="bg-slate-600/50 p-4 rounded-lg">
            <h4 className="text-green-300 text-lg font-bold mb-2">현자의 등대, 신속한 지진, 마나흡수</h4>
            <p className="text-slate-200 mb-2">
              대부분의 비각기술 즉시 캔슬하고 발동됨
            </p>
            <p className="text-gray-400 text-sm">
              (번개의창, 잔류번개, 지면의응답, 불비, 신속한지진은 캔슬불가)
            </p>
          </div>
        </div>

        {/* SC 스왑텔포 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-purple-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🌀</span> SC 스왑텔포
          </h3>
          
          <div className="mb-6 flex justify-center">
            <img 
              src="/tip-images/위자드텔포.png" 
              alt="위자드 텔포" 
              className="rounded-lg shadow-lg max-w-full h-auto border border-slate-500"
            />
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-200 text-lg">
              공간이동 마우스 올려보면 커맨드가 3개 있음
            </p>
            
            <p className="text-slate-200 text-lg">
              <span className="text-yellow-300 font-mono">Shift + Space</span>, <span className="text-yellow-300 font-mono">기술 사용중 Space</span>, <span className="text-green-300 font-mono">S+C</span>로 사용하는 게 있는데
            </p>
            
            <div className="bg-purple-900/30 p-5 rounded-lg border-l-4 border-purple-400">
              <p className="text-purple-200 text-lg font-bold mb-2">
                <span className="text-green-300 font-mono">S+C</span>로 텔포 쓰면 비각→각성무기, 각성무기→비각무기로 바꾸면서 텔포
              </p>
              <p className="text-slate-200">
                이거 모르면 보영쓰고 일반텔포 진입해서 업화로 스왑하다가 전방가드 뚫리고 바로 벌러덩하는 바보 위자드가 됩니다
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <p className="text-slate-200">
                비각 슈아기술 안개, 지진에서 각성전환 하는데도 쓰입니다.
              </p>
              <p className="text-yellow-300 font-bold mt-2">
                ⚠️ 필수로 익혀야 되는 커맨드!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PvP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-orange-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> PvP 콤보
        </h2>
        
        {/* 국룰 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-orange-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔥</span> 국룰콤보 (본: 파멸의불덩이 사용)
          </h3>
          
          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-6 rounded-lg border-l-4 border-orange-400">
            <div className="text-center mb-4">
              <p className="text-white text-xl font-bold font-mono mb-3">
                대재앙 → 업화 → 파멸의불덩이 → 용암폭렬 → 물의세례 → 수막폭렬 or 차가운파도
              </p>
              <div className="pt-4 border-t border-orange-500/30">
                <p className="text-gray-300 text-sm mb-2">💡 커맨드</p>
                <p className="text-yellow-300 text-base font-mono">
                  Shift+F → W+F → S+F → 우클릭 유지 → 우클릭 유지 → Shift+좌클릭 or S+마우스 좌+우클릭
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 수막폭렬 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-blue-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">💧</span> 본: 수막폭렬 콤보 (솔라레/아르샤 등 소수전)
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <p className="text-slate-200 text-lg mb-2">
                업화연계, 물구슬-물폭탄-물줄기 연계 등으로 피 압박
              </p>
            </div>
            
            <div className="bg-blue-900/30 p-5 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-lg font-bold mb-3">수막폭렬 경직 타이밍</h4>
              <p className="text-slate-200 mb-2">
                <strong>텔 or 원소화</strong> → <strong>수막폭렬</strong>
              </p>
              <p className="text-slate-200 mb-2">
                수막폭렬 경직 타이밍은 <strong className="text-yellow-300">1타가 아니라 2타에서 경직생김</strong>
              </p>
              <p className="text-gray-300 font-mono text-sm">
                타/ → 타 ← /다다다닥
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <h4 className="text-cyan-300 text-lg font-bold mb-3">경직 걸리면 (0.7CC)</h4>
              <ul className="text-slate-200 space-y-2 pl-4">
                <li>• <strong className="text-green-300">마력회피 물줄기</strong> OR</li>
                <li>• <strong className="text-green-300">마력회피나 원소화 물구슬</strong> OR</li>
                <li>• <strong className="text-green-300">원소화 대재앙</strong> (1.4~1.7CC)</li>
              </ul>
              <p className="text-slate-200 mt-3">
                연계가 빡빡하면 1차 라밤 힐(현자의 등대) 포기하고 라밤 화염구(현자의 심장)도 쓸만함
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <h4 className="text-purple-300 text-lg font-bold mb-3">이후 남아있는 스킬로 연계</h4>
              <div className="space-y-3">
                <div className="bg-purple-900/20 p-3 rounded border-l-2 border-purple-400">
                  <p className="text-purple-200 font-semibold mb-1">1순위</p>
                  <p className="text-slate-200">업화 → 파멸의불덩이 → 용암폭렬 → 파도 → 세례</p>
                </div>
                <div className="bg-blue-900/20 p-3 rounded border-l-2 border-blue-400">
                  <p className="text-blue-200 font-semibold mb-1">2순위</p>
                  <p className="text-slate-200">대재앙 → 파도 → 세례</p>
                </div>
                <div className="bg-cyan-900/20 p-3 rounded border-l-2 border-cyan-400">
                  <p className="text-cyan-200 font-semibold mb-1">3순위 (진짜 스킬 아무것도 없을때)</p>
                  <p className="text-slate-200 mb-2">물구슬 → 물구슬 → 물폭탄 → 용암폭렬 → 세례</p>
                  <p className="text-yellow-300 text-sm">
                    * 물구슬 2번 쓰는 이유: 물구슬→물폭탄 바로하면 에어스매쉬 터지고 넉다운 바로끝나버림
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-200 font-semibold">
                💡 본수막 빌드는 압박하면서 얻어 걸리는 경직에 연계하는 거라 스킬을 유동적으로 써야 함
              </p>
            </div>
          </div>
        </div>

        {/* 기타 짤팁 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-yellow-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">💡</span> 기타 짤팁
          </h3>
          
          <div className="space-y-4">
            {/* 팁 1 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-cyan-400">
              <h4 className="text-cyan-300 text-lg font-bold mb-2">1. 물의 세례 활용</h4>
              <p className="text-slate-200 mb-2">
                물의 세례는 단독 사용해도 연계 속도에서 손해 없음
              </p>
              <p className="text-slate-200">
                회피캐 상대로 슈아 유지할 때 <strong className="text-cyan-300">대재앙→물의세례</strong> 이런 식으로 미리 회깎 묻혀 두면 좋음
              </p>
            </div>
            
            {/* 팁 2 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="text-orange-300 text-lg font-bold mb-2">2. 파멸의 불덩이 팁</h4>
              <p className="text-slate-200 mb-3">
                업화/물줄기 연계로 파불 던지면 무조건 본인 발 바로 앞에 떨어지기 때문에 거리가 짧다
              </p>
              <p className="text-slate-200 mb-3">
                그래서 스탠딩 딜견제 할 때는 업화 파불 연계 잘 안 씀 (안 맞는 경우가 너무 많음)
              </p>
              <p className="text-slate-200 mb-3">
                업화 용암폭렬 정도만 쓰고 파불은 슈아 유지 스킬로 따로 굴리는 게 느려도 맞추는 건 더 잘 맞을 수 있음
              </p>
              <div className="mt-3 flex justify-center">
                <img 
                  src="/tip-images/위자드짤팁.png" 
                  alt="위자드 파불 사거리" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-500"
                />
              </div>
              <p className="text-gray-400 text-center text-sm mt-2">사거리 대충 이런 느낌</p>
            </div>
            
            {/* 팁 3 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="text-purple-300 text-lg font-bold mb-2">3. 유성낙하</h4>
              <p className="text-slate-200 mb-3">
                <strong className="text-yellow-300">진 유낙 찍지 말고 일반 유낙으로 사용</strong>
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-red-400">❌</span>
                  <div>
                    <p className="text-slate-200"><strong>진유낙</strong></p>
                    <p className="text-gray-400 text-sm">30초쿨, 시전 중 전방가드, <strong className="text-red-300">공격 중 방어판정 없음</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✅</span>
                  <div>
                    <p className="text-slate-200"><strong>일반 유낙</strong></p>
                    <p className="text-gray-400 text-sm">1분30초쿨, 시전 중 전방가드, <strong className="text-green-300">공격 중 슈퍼아머</strong></p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 팁 4 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-lg font-bold mb-2">4. 맨몸 지팡이 WW이동</h4>
              <p className="text-slate-200 mb-3">
                써보면 알겠지만 이게 속도 버프 다 땡기면 위자드 이동기 중에 제일 빠름
              </p>
              <p className="text-slate-200 mb-3">
                그래서 누운 아군 보이면 이거로 적당히 안 맞고 버프 넣을 만한 위치까지 가서 보영 써주면 좋음
              </p>
              <p className="text-slate-200 mb-3">
                자이한테 잡힌 아군한테 써줄 때는 굉장히 유용함. 우리 팀 잡고 있는 적 자이는 날 못 때리니까 (솔라레 이야기)
              </p>
              <p className="text-yellow-300 mb-3">
                ⚠️ 거점에서는 눈먼 cc 맞을 수 있으니까 알잘딱하기
              </p>
              <div className="mt-3 flex justify-center">
                <img 
                  src="/tip-images/wwmove.png" 
                  alt="위자드 WW 이동" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-pink-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💎</span> 특화 및 수정
        </h2>
        
        <div className="space-y-6">
          {/* 특화 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-purple-400 text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">⚡</span> 특화
            </h3>
            
            {/* 무제한 특화 */}
            <div className="mb-6">
              <h4 className="text-red-400 text-lg font-bold mb-3">무제한 특화</h4>
              <div className="flex justify-center mb-4">
                <img 
                  src="/tip-images/위자드특화.png" 
                  alt="위자드 특화" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-600"
                />
              </div>
            </div>
            
            {/* 솔라레 특화 */}
            <div>
              <h4 className="text-blue-400 text-lg font-bold mb-3">솔라레 특화</h4>
              <div className="flex justify-center mb-4">
                <img 
                  src="/tip-images/위자드솔라레.png" 
                  alt="위자드 솔라레 특화" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 수정 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600 mt-6">
          <h3 className="text-blue-300 text-2xl font-bold mb-4">💠 수정</h3>
          
          <div className="space-y-6">
            {/* 적중 세팅 */}
            <div>
              <h4 className="text-green-400 text-lg font-bold mb-3">적중 세팅</h4>
              <div className="flex justify-center mb-4">
                <img 
                  src="/tip-images/위자드적중.png" 
                  alt="위자드 적중 세팅" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-600"
                />
              </div>
            </div>
            
            {/* 국룰 세팅 */}
            <div>
              <h4 className="text-orange-400 text-lg font-bold mb-3">국룰 세팅</h4>
              <div className="flex justify-center mb-4">
                <img 
                  src="/tip-images/위자드국룰.png" 
                  alt="위자드 국룰 세팅" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-600"
                />
              </div>
            </div>
            
            {/* 극공 세팅 */}
            <div>
              <h4 className="text-red-400 text-lg font-bold mb-3">극공 세팅</h4>
              <div className="flex justify-center mb-4">
                <img 
                  src="/tip-images/위자드극공.png" 
                  alt="위자드 극공 세팅" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-600"
                />
              </div>
            </div>
          </div>
          
          {/* 수정 설명 */}
          <div className="mt-6 space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="text-red-300 text-lg font-bold mb-2">훔은 사용하지 않음</h4>
              <p className="text-slate-200 text-base">
                위자드는 훔 쓴다고 생존력 크게 늘어나지 않음. 차라리 오는 적 죽이는 게 더 생존력 더 좋음
              </p>
              <p className="text-slate-200 text-base mt-2">
                훔 쓰실거면 피감 20퍼 Q피감 30인가 달린 각성 위치 하시면 됩니다.
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="text-yellow-300 text-lg font-bold mb-2">1순위로 빼는 수정은 최대생명력 수정</h4>
              <p className="text-slate-200 text-base">
                이거 빼고 딜 투자 더해야 여러분이 생각하는 위자드 그 딜이 나옴
              </p>
              <p className="text-slate-200 text-base mt-2">
                빠진 체력은 강고래, 힐로 버티면 됨
              </p>
              <p className="text-slate-200 text-base mt-2">
                <strong className="text-yellow-300">본인이 강고래 안 먹는 쌀숭이다 = 최생 끼세요</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 군왕 재련석 */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40 mt-6">
          <h4 className="text-red-300 text-2xl font-bold mb-4">⚔️ 군왕 재련석</h4>
          
          <div className="space-y-4">
            <div className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-red-400">
              <h5 className="text-red-400 text-lg font-bold mb-2">고정 추천</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-red-300 font-bold">모든 공격력</p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-red-300 font-bold">모든 피해 감소</p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-red-300 font-bold">치명타 확률</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-orange-400">
              <h5 className="text-orange-400 text-lg font-bold mb-2">권장 (남은 두 슬롯)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-orange-300 font-bold">치명타 피해</p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-orange-300 font-bold">흑정 회복</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-yellow-400">
              <h5 className="text-yellow-400 text-lg font-bold mb-2">취향따라 선택</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-yellow-300 font-bold">최대 생명력</p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-yellow-300 font-bold">적중력</p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                  <p className="text-yellow-300 font-bold">다운피해</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 하고싶은말 */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-900/30 p-8 rounded-2xl mb-8 shadow-xl border border-purple-500/30">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고싶은말
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <div className="text-center space-y-4">
            <p className="text-slate-200 text-lg leading-relaxed">
              <strong className="text-purple-400">SC 스왑텔포</strong>를 반드시 익히시고, 
              <strong className="text-blue-400">슈아 유지</strong>를 통해 안정적인 딜링을 하세요.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              처음엔 어려울 수 있지만 포기하지 마시고 꾸준히 연습하시면 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 게시글 통계 */}
      <div className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30 shadow-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{post?.view_count || 0}</div>
            <div className="text-sm text-gray-400">조회수</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{post?.like_count || 0}</div>
            <div className="text-sm text-gray-400">추천수</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleLike}
            disabled={liked || liking}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform ${
              liked 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-purple-500/30'
            }`}
          >
            {liked ? '✅ 추천 완료' : '👍 추천하기'}
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/tip-board"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-blue-500/30 hover:border-blue-400/50"
        >
          📝 다른 팁 보기
        </Link>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-3 bg-gradient-to-r from-zinc-700 via-zinc-800 to-gray-800 hover:from-zinc-600 hover:via-zinc-700 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-zinc-600/30 hover:border-zinc-500/50"
        >
          ⬆️ 맨 위로
        </button>
      </div>
    </div>
  )
}
