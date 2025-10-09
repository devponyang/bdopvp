'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function WitchGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/13', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_13')
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
        await fetch('/api/tip-board/13/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/13/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_13', 'true')
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🔮 각성 위치 클래스 가이드
          </h1>
          <p className="text-xl text-slate-200">
          폭풍의 심장, 대지를 울리다
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

      {/* 1. 소개 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-blue-500">
        <h2 className="text-white text-3xl font-bold mb-4 flex items-center">
          <span className="mr-3 text-4xl">👋</span> 소개
        </h2>
        <p className="text-slate-200 text-lg mb-4">
          안녕하세요 <img src="/tip-images/chzzk.png" alt="치지직" className="w-6 h-6 inline mx-1" />치지직에서 방송하고 있는 <img src="/tip-images/dasa.png" alt="사다새" className="w-6 h-6 inline mx-1" />사다새라고 합니다.
        </p>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 각성 위치 장/단점 (PVP)
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-green-400">광역 힐, 보호의 영역, 신속의 주문</strong> 등 아군에게 도움이 되는 스킬들이 많습니다.</li>
            <li>RVR에서 <strong className="text-green-400">콤보가 없을 뿐더러, 난이도가 매우 낮아</strong> 각성 위치로 사냥을 할 수 있을 정도라면 크게 배울 것이 없습니다.</li>
            <li>RVR을 아예 처음한다면 <strong className="text-green-400">각성위치로 입문 추천</strong>드립니다.</li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li>각성 위치는 정말 쉽지만 그만큼 <strong className="text-red-400">고점이 너무나도 낮은편</strong>입니다.</li>
            <li>어떻게 보면 <strong className="text-yellow-400">육각형 캐릭</strong>인 것 같지만 <strong className="text-yellow-400">작은 육각형</strong> 입니다.</li>
            <li>이것 저것 있을 것은 다 있지만 <strong className="text-red-400">뭔가 아쉬운 캐릭터</strong>입니다.</li>
          </ul>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 거점전 / 솔라레 운영법
        </h2>
        
        {/* 거점전 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 거점전
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="text-yellow-300 text-xl font-bold mb-2">🎯 핵심 운영</h4>
              <p className="text-slate-200 text-lg mb-2">
                <strong className="text-yellow-300">보호의 영역, 신속의 주문</strong>을 잘 써주는 것이 중요합니다.
              </p>
              <p className="text-slate-200 text-lg">
                (Q가드도 틈틈히 사용)
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-2">🛡️ 생존 우선</h4>
              <p className="text-slate-200 text-lg mb-2">
                본인이 생존해야지 진입 상황에 맞게 <strong className="text-blue-300">보호의 영역과 아드혼의 정신 스킬</strong>을 사용 할 수 있습니다.
              </p>
              <p className="text-slate-200 text-lg">
                스킬을 보유하고 있다면 조금 <strong className="text-blue-300">안정적으로 플레이</strong> 해주는 것이 좋겠습니다.
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-2">⚡ 진입 타이밍</h4>
              <p className="text-slate-200 text-lg">
                이런 스킬들을 소모하고 쿨타임일때는 본대에 크게 필요가 없어 <strong className="text-green-300">들어갈때 확실히 진입</strong>해주는 것이 좋겠습니다.
              </p>
            </div>
          </div>
        </div>
        
        {/* 솔라레 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-purple-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🌟</span> 솔라레
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="text-purple-300 text-xl font-bold mb-2">🚀 텔레포트 활용</h4>
              <p className="text-slate-200 text-lg mb-2">
                저도 잘 지키지 못하고 있지만 <strong className="text-purple-300">아군의 위치를 보고 텔레포트로 순식간에 합류</strong>하는 것이 좋은 것 같습니다.
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-cyan-400">
              <h4 className="text-cyan-300 text-xl font-bold mb-2">💫 역이용 전략</h4>
              <p className="text-slate-200 text-lg mb-2">
                일반적으로 위치가 잡기 캐릭들에게 쫓기는 상황이 연출되는데, 이러한 경우 <strong className="text-cyan-300">이동기+무적기</strong>를 사용해서 보통 빠져나오는 경우가 많습니다.
              </p>
              <p className="text-slate-200 text-lg">
                이럴 때 <strong className="text-cyan-300">이동기를 아군쪽으로 사용</strong>해서 순식간에 <strong className="text-cyan-300">3:2 구도</strong>를 만드는 것이 중요한 것 같아요
              </p>
            </div>
          </div>
        </div>
        
        {/* 공통 팁 */}
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <h3 className="text-orange-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">💡</span> 공통 팁
          </h3>
          <p className="text-slate-200 text-lg">
            거점전과 솔라레 둘다 적용되는 말인데 <strong className="text-orange-300">마그누스 스킬</strong>이 슈퍼아머 상태를 오래 유지하게 해주어 <strong className="text-orange-300">자주 사용</strong>하는 것 같습니다.
          </p>
        </div>
      </div>

      {/* 4. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-orange-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🥊</span> PVP 콤보
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-orange-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 기본 콤보
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-orange-500 font-mono mb-4">
            <p className="text-orange-300 text-lg font-bold text-center">
              텔레포트 → 전류파동 (경직+바운드 or 바운드) → 감벼락 → 균열의 파도 (넉다운) → 남는 스킬
            </p>
          </div>
          <p className="text-slate-200 text-lg italic text-center">
            개인적으로 각성위치는 따로 콤보랄게 없는 것 같습니다.
          </p>
        </div>
      </div>

      {/* 5. 특화 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💎</span> 특화
        </h2>
        
        {/* 특화 이미지 */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/tip-images/sada.png" 
            alt="특화" 
            className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
          />
        </div>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg text-center border border-slate-600">
          <p className="text-slate-300 text-lg">
            특화는 계속 조금씩 변화를 주고 있어 바뀔 수 있습니다.
          </p>
        </div>
      </div>

      {/* 6. 추가 정보 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">📢</span> 더 궁금하다면?
        </h2>
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            더 궁금한 것들은 <strong className="text-purple-400">방송에 오셔서 질문</strong>하셔도 됩니다.
          </p>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            채팅이 엄청 매운편이기 때문에 불편하시다면 <strong className="text-blue-400">귓속말이나 디스코드</strong>로 주셔도 됩니다.
          </p>
          
          <div className="space-y-4">
            {/* 치지직 방송 링크 */}
            <a 
              href="https://chzzk.naver.com/9cc4bda5d0387d211f9b2123895db58b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <img src="/tip-images/chzzk.png" alt="치지직" className="w-6 h-6" />
              치지직 방송 바로가기
            </a>
            
            {/* 디스코드 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="text-purple-300 text-xl font-bold">
                💬 Discord: <span className="text-white">popopoooopo</span>
              </p>
            </div>
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

