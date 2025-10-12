'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function MaeguGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/12', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_12')
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
        await fetch('/api/tip-board/12/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/12/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_12', 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

  return (
    <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
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
            <img src="/class-icons/magu.png" alt="매구" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              각성 매구 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "푸른 폭풍 속에서 춤추는 여우."
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

      {/* 이미지 */}
      <div className="mb-8 flex justify-center">
        <img 
          src="/tip-images/1759833294418_85ca54e3f199688b.JPG" 
          alt="각성 매구" 
          className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
        />
      </div>

      {/* 작성자 정보 */}
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-800 to-blue-900/50 p-6 rounded-2xl mb-8 shadow-2xl border border-blue-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
            <span className="text-4xl">✍️</span>
          </div>
          <div>
            <p className="text-white text-xl font-semibold mb-2">
              <span className="text-gray-300">작성자:</span> <Link href="/guild/포도당" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">포도당</Link> 길드 <span className="text-blue-400 font-bold">격수</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-lg shadow-lg">
              <span className="text-xl">💎</span>
              <p className="text-purple-300 font-bold text-sm">
                각성 매구 장인
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
        <p className="text-slate-200 text-lg">
          안녕하세요 각성 매구를 주력 클래스로 플레이하고 있는 <strong>격수</strong> 입니다.
        </p>
      </div>

      {/* 2. 클래스 개요 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-green-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">📋</span> 클래스 개요
        </h2>
        <div className="bg-slate-700/50 p-6 rounded-xl">
          <p className="text-slate-200 text-lg mb-3">
            각성 매구는 <span className="text-blue-400 font-bold">기동성과 생존력</span> 모두 뛰어난 근접 클래스 입니다.
          </p>
          <p className="text-slate-200 text-lg mb-3">
            이동기와 무적 판정을 적극적으로 활용해 <span className="text-blue-400 font-bold">진입과 이탈</span>이 모두 유연하며,
          </p>
          <p className="text-slate-200 text-lg">
            스킬 구조가 단순해서 숙련도가 낮아도 <span className="text-blue-400 font-bold">안정적인 성능(=높은 저점)</span>을 보여줍니다.
          </p>
        </div>
      </div>

      {/* 3. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 각성 매구 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li>이동기가 많고, 이동 중에도 <strong>무적 판정</strong>이 자주 붙어 스킬 흘리기에 유리함</li>
            <li>이동기를 활용한 <strong>슈퍼아머 유지</strong>가 쉬워 대치 구도에서 안정적</li>
            <li>스킬 쿨이 짧고 구조가 단순해 <strong>운영이 쉽고 저점이 높음</strong></li>
            <li>각성 및 라밤 스킬에 <strong>회복기</strong>가 있어 전장 이탈 후 피 채우기 편함</li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li>운영 구조가 단순해 <strong>숙련된 상대에게는 CC 넣기 어려움</strong></li>
            <li>주요 딜링기 '<strong>도리깨연풍</strong>'은 전가 후 슈아로 전환되어 이 구간에서 역공 위험 존재</li>
            <li>진입기 너프로 인해 딜레이가 생겨 <strong>숙련자 상대로는 슈아로 대응당하기 쉬움</strong></li>
          </ul>
        </div>
        
        {/* Tip */}
        <div className="bg-slate-700 p-4 rounded-xl border-l-4 border-blue-400">
          <p className="text-slate-200 text-lg">
            <strong className="text-blue-400">💡 Tip:</strong> 도리깨연풍 사용중 각이 애매하다고 느껴지면, <strong>귀신걸음으로 즉시 캔슬</strong> 후 이탈하는게 안전합니다.
          </p>
        </div>
      </div>

      {/* 4. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 운영법
        </h2>
        
        {/* RVR */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-600 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 거점전(RVR)
          </h3>
          <p className="text-slate-200 text-lg mb-4">
            각성 매구는 <strong className="text-red-600">공격속도 / 시전속도 버프 유무</strong>에 따라 체감이 크게 달라집니다.
          </p>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-yellow-400 mb-4">
            <h4 className="text-yellow-300 text-xl font-bold mb-2">🏃 기본 진입 루트</h4>
            <p className="text-yellow-200 text-lg">
              <strong>황천걸음 → 나빌레라</strong> 또는 <strong>황천걸음 → 맴체</strong>로 진입 후 CC를 넣고 빠르게 이탈
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
            <h4 className="text-blue-300 text-xl font-bold mb-2">🏔️ 지형 활용</h4>
            <p className="text-blue-200 text-lg">
              황천걸음은 언덕이나 돌 위에서도 사용 가능해서, <strong>고지대 원거리 캐릭터 견제</strong>에 효과적 입니다.
            </p>
          </div>
          
          {/* 예시 영상 */}
          <div className="mb-4 flex justify-center">
            <video 
              autoPlay
              loop
              muted
              playsInline
              controls 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-500"
              style={{ maxHeight: '500px' }}
            >
              <source src="/tip-images/1759840074330_83771904e663514d__1_.mp4" type="video/mp4" />
              브라우저가 동영상을 지원하지 않습니다.
            </video>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-600 mb-4">
            <h4 className="text-green-300 text-xl font-bold mb-2">🎯 운영 핵심</h4>
            <p className="text-green-200 text-lg">
              인원이 많은 전장에서는 <strong>진입 → 이탈 → 재진입</strong> 패턴으로 상대의 시선을 분산 시키는 플레이가 중요합니다.
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-600">
            <h4 className="text-red-300 text-xl font-bold mb-2">⚠️ 주의할 점</h4>
            <p className="text-red-200 text-lg mb-2">
              최근 패치로 <strong>황천걸음 이후 맴체 / 나빌레라 모션캔슬이 불가능</strong> 해졌습니다.
            </p>
            <p className="text-red-200 text-lg">
              이전보다 <strong>진입 타이밍 판단</strong>이 훨씬 중요해졌습니다.
            </p>
          </div>
        </div>
        
        {/* 솔라레 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-purple-600 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🌟</span> 솔라레
          </h3>
          <p className="text-slate-200 text-lg mb-3">
            인원이 적은 구도에서는 CC가 잘 안걸리기 때문에,<br />
            <strong className="text-purple-600">황천걸음 → 도리깨연풍</strong> 중심의 딜 누적형 운영을 합니다.
          </p>
          <p className="text-slate-200 text-lg mb-3">
            무리한 진입보다는 <strong className="text-purple-600">팀 커버나, 사이드 견제</strong> 중심으로 플레이하는게 효율적 입니다.
          </p>
          <p className="text-slate-200 text-lg">
            숙련된 상대는 CC가 거의 안 걸리므로, <strong className="text-purple-600">위치 선정과 갉아 먹는 운영</strong>이 핵심입니다.
          </p>
        </div>
        
        {/* 길드리그 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-blue-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🏆</span> 길드리그
          </h3>
          <p className="text-slate-200 text-lg mb-3">
            <strong className="text-blue-400">공/시속 버프 유지가 필수</strong><br />
            유무에 따라 체급 차이가 확연하게 납니다.
          </p>
          <p className="text-slate-200 text-lg mb-3">
            이동기가 좋아서 대치 중에도 <strong className="text-blue-400">순간 진입 → 딜링 → 이탈</strong> 패턴을 계속 가져갈 수 있습니다.
          </p>
          <p className="text-slate-200 text-lg">
            상황에 따라 팀원의 진입 후 <strong className="text-blue-400">추가 딜링 보조</strong> 또는 <strong className="text-blue-400">황천걸음 → 나빌레라 선집입</strong>으로 메이킹 플레이를 노리는 것도 좋습니다.
          </p>
        </div>
      </div>

      {/* 5. 콤보 및 진입기 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-orange-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🥊</span> 콤보 및 진입기
        </h2>
        
        {/* 기본 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-orange-600 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 기본 콤보
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-orange-500 font-mono">
            <p className="text-orange-300 text-lg font-bold text-center">
              황천 → 맴체 or 나빌레라 → 마파람사위 → (인중치기 → 꾸지람) → 앞발찢기 → 으름 → 도리깨연풍 → 라밤 → 이탈
            </p>
          </div>
          <div className="bg-slate-600/50 p-3 rounded-lg border-l-4 border-red-400">
            <p className="text-red-300 text-base">
              <strong>참고.</strong> RVR 에서는 앞발찢기-으름 이 맨몸 스킬이라 위험합니다. 상황에 맞게 적절하게 사용해야 합니다.
            </p>
          </div>
        </div>
        
        {/* 풀슈아 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-purple-600 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🛡️</span> 풀슈아 콤보
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-purple-500 font-mono mb-4">
            <p className="text-purple-300 text-lg font-bold text-center">
              황천 → 맴체 or 나빌레라 → 마파람사위 → 맴체 or 나빌레라 (쿨 도는것중에 하나) → 도리깨연풍 → 라밤 → 이탈
            </p>
          </div>
          
        </div>
        
        {/* 시동기 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-teal-600 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🚀</span> 시동기 (진입 전 준비)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="h-96 flex items-center justify-center mb-3">
                <img 
                  src="/tip-images/1759841208703_image.png" 
                  alt="꾸지람" 
                  className="rounded-lg max-h-full w-auto border border-slate-400"
                />
              </div>
              <p className="text-orange-300 text-lg font-bold">꾸지람</p>
              <p className="text-orange-200 text-sm">(공격력 +20)</p>
            </div>
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="h-96 flex items-center justify-center mb-3">
                <img 
                  src="/tip-images/1759841191770_image.png" 
                  alt="인중치기" 
                  className="rounded-lg max-h-full w-auto border border-slate-400"
                />
              </div>
              <p className="text-red-300 text-lg font-bold">인중치기</p>
              <p className="text-red-200 text-sm">(치확+30%)</p>
            </div>
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="h-96 flex items-center justify-center mb-3">
                <img 
                  src="/tip-images/1759841175483_image.png" 
                  alt="발따귀" 
                  className="rounded-lg max-h-full w-auto border border-slate-400"
                />
              </div>
              <p className="text-purple-300 text-lg font-bold">발따귀</p>
              <p className="text-purple-200 text-sm">(에어어택 +5%)</p>
            </div>
          </div>
          <p className="text-slate-200 text-lg">
            이 세 스킬은 <strong className="text-teal-600">허공에 써도 버프 효과가 적용</strong>됩니다.<br />
            진입 전 상황에 맞게 미리 켜두면, 초반 교전에서 유리하게 시작할 수 있습니다.
          </p>
        </div>
        
        {/* 진입기 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-blue-600 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🎯</span> 진입기
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg mb-3">
            <p className="text-blue-300 text-lg font-bold mb-2"><strong>황천 → 맴체</strong></p>
            <p className="text-blue-300 text-lg font-bold mb-2"><strong>황천 → 나빌레라</strong></p>
            <p className="text-blue-300 text-lg">
              또는 비각성 상태에서 <strong>화구</strong>를 쓰면 황천걸음으로 재진입 가능합니다.
            </p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-blue-400">
            <p className="text-slate-200 text-base">
              <strong className="text-blue-400">💡 Tip.</strong> 천도의 춤을 잠구고 슬롯으로 쓴다면, 비각성 상태에서도 <strong>W+우클릭</strong>으로 황천걸음 바로 사용 가능합니다
            </p>
          </div>
        </div>
        
        {/* 스킬 흘리기 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-green-600 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🌪️</span> 상대 스킬 흘리기 운영
          </h3>
          <p className="text-slate-200 text-lg mb-3">
            <strong className="text-green-600">귀신걸음 → 여우달음</strong> 연계 시 긴 무적 유지로 상대 스킬을 흘리기 쉽습니다.
          </p>
          <p className="text-slate-200 text-lg">
            또는 비각성 상태에서 <strong className="text-green-600">신령던지기 → 귀신걸음</strong> 으로도 안정적인 회피 운영이 가능합니다.
          </p>
        </div>
      </div>

      {/* 6. 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💎</span> PvP 특화 및 수정
        </h2>
        
        {/* 특화 이미지 */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-purple-300 mb-4">⚡ 특화</h3>
          <div className="flex justify-center">
            <img 
              src="/tip-images/1759841480860_image.png" 
              alt="특화" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
            />
          </div>
        </div>
        
        {/* 수정 이미지들 */}
        <div>
          <h3 className="text-2xl font-bold text-blue-300 mb-4">💠 수정</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <img 
                src="/tip-images/1759841490242_image.png" 
                alt="수정 1" 
                className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
              />
            </div>
            <div className="flex justify-center">
              <img 
                src="/tip-images/1759841493847_image.png" 
                alt="수정 2" 
                className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. 하고 싶은 말 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고 싶은 말
        </h2>
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            각성 매구는 <strong className="text-blue-400">낮은 진입장벽과 안정적인 생존력</strong>을 가진 클래스 입니다.
          </p>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            스킬 구조가 단순하고 템포가 빨라서 <strong className="text-blue-400">PVP 입문자에게 정말 좋은 선택</strong>이에요
          </p>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            다만 최근 패치로 일부 연계가 제한되면서, 고점 구간에서는 확실한 한계가 있습니다.
          </p>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            그래도 손이 편하고 안정적인 전투를 원하신다면 <strong className="text-blue-400">각성 매구를 추천</strong>드립니다.
          </p>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            반대로 더 높은 테크닉이나 콤보 중심의 플레이를 원한다면 다른 클래스를 고려해보는것도 좋은 선택입니다.
          </p>
          <p className="text-white text-2xl font-bold text-center mt-6">
            읽어주셔서 감사합니다 🙏
          </p>
        </div>
      </div>

      {/* YouTube 영상 */}
      <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-600">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl"
            src="https://www.youtube.com/embed/dSE264dTl9E"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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
