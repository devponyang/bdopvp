'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function GiantGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/17', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_17')
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
        await fetch('/api/tip-board/17/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/17/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_17', 'true')
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
            <img src="/class-icons/jai.png" alt="자이언트" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              전승 자이언트 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "분노는 그를 움직이고, 대지는 그를 따랐다."
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
          src="/tip-images/ctrl.png" 
          alt="전승 자이언트" 
          className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
        />
      </div>

      {/* 작성자 정보 */}
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-800 to-amber-900/50 p-6 rounded-2xl mb-8 shadow-2xl border border-amber-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl border border-amber-400/30">
            <span className="text-4xl">✍️</span>
          </div>
          <div>
            <p className="text-white text-xl font-semibold mb-2">
              <span className="text-gray-300">작성자:</span> <Link href="/guild/Ctrl" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">Ctrl</Link> 길드 <span className="text-blue-400 font-bold">눈이와</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 rounded-lg shadow-lg">
              <span className="text-xl">🏆</span>
              <p className="text-yellow-300 font-bold text-sm">
                솔라레의 창 자이언트 랭킹 1위
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
          안녕하세요. <strong>퇴물자이</strong>입니다.
        </p>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 전승 자이언트 클래스의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="space-y-3 text-slate-200 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">▸</span>
              <span><strong>1대1에서도 무난하고, RVR 에서도 무난합니다.</strong></span>
            </li>
          </ul>
        </div>

        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">❌</span> 단점
          </h3>
          <ul className="space-y-3 text-slate-200 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-red-400 text-xl mt-1">▸</span>
              <span><strong>눈에 잘 뜁니다. 남들 3대 맞을 거 자이는 10대 맞습니다.</strong></span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. 거점/솔라레/길드리그 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-green-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 거점(RVR) / 솔라레 / 길드리그 운영법
        </h2>
        
        {/* 거점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-2xl">🏰</span> 거점 (RVR)
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed">
            신거점에서 <strong className="text-yellow-300">공포의 군림자 만 잘 써도 밥값은 합니다.</strong>
          </p>
        </div>

        {/* 솔라레 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-2xl">⚡</span> 솔라레의 창
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            아래 영상을 참고하세요.
          </p>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/Lgo8M7gKjXw"
              title="전승 자이언트 솔라레 플레이"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>

        {/* 길드리그 */}
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-2xl">🛡️</span> 길드리그
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            <strong className="text-yellow-300">방셋 입고 잡기 CC 셔틀</strong>하시면 됩니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            저는 잡고 나서 <strong className="text-purple-300">보라색 핑을 2~3번 찍고 마이크</strong>도 해서 
            <strong className="text-red-300"> 상대 핵심 멤버를 빠르게 죽이는 데 포인트</strong>를 두고 있습니다.
          </p>
          <div className="aspect-video mt-4">
            <iframe
              src="https://www.youtube.com/embed/kZFDjrzJNAQ"
              title="전승 자이언트 길드리그 플레이"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>

      {/* 4. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-red-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> PVP 콤보
        </h2>
        
        {/* 기본 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔥</span> 기본 콤보
          </h3>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-red-500 font-mono mb-4">
            <p className="text-lg leading-relaxed text-center text-slate-200">
              <strong className="text-blue-300">잡기</strong> → 
              <strong className="text-green-300"> 극 광분의 파괴자 2~3타</strong> <span className="text-gray-400">(디버프 걸렸을시 2타)</span> → 
              <strong className="text-purple-300"> 히든 몰벼+맹수의 습격</strong> → 
              <strong className="text-yellow-300"> 맹렬한 공격 1타</strong> → 
              <strong className="text-pink-300"> 고대의 파동</strong> → 
              <strong className="text-cyan-300"> 용암 뚫기 + 날짐승 바람 가르기 2타 or 3타</strong> → 
              <strong className="text-orange-300"> 바위 밀치기 2타</strong> <span className="text-gray-400">(취향)</span> → 
              <strong className="text-red-300"> 거암</strong>
            </p>
          </div>
        </div>

        {/* 핵심 스킬 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">💡</span> 핵심 스킬
          </h3>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-cyan-400">
            <p className="text-slate-200 text-lg mb-3">
              자이언트는 <strong className="text-cyan-300">뿌리치기가 핵심 스킬</strong>입니다. 거의 <strong className="text-yellow-300">쿨 돌 때마다</strong> 쓰면 됩니다.
            </p>
            <p className="text-slate-200 text-lg">
              <strong className="text-yellow-300">공포의 군림자(공군)</strong>은 상황 봐서 우겨넣기
            </p>
          </div>
        </div>
      </div>

      {/* 5. 진입기/시동기 활용법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🚀</span> 진입기 / 1cc 시동기 활용법
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-indigo-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 주로 사용하는 이니시에이팅
          </h3>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-indigo-500 font-mono text-center mb-4">
            <p className="text-xl font-bold text-slate-200">
              <strong className="text-cyan-300">용암 뚫기</strong> → 
              <strong className="text-purple-300"> 바위 밀치기</strong>
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-indigo-400">
            <p className="text-slate-200 text-lg mb-2">
              <strong className="text-yellow-300">적 뒤를 깊숙이 들어가서</strong> 다음 스킬 중 하나를 사용:
            </p>
            <div className="ml-4 mt-3 space-y-2">
              <p className="text-slate-200 text-lg">
                • <strong className="text-red-300">공포의 군림자(공군)</strong>
              </p>
              <p className="text-slate-200 text-lg">
                • <strong className="text-orange-300">포식자의 사냥</strong>
              </p>
            </div>
          </div>
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
              src="/tip-images/jangbi.png" 
              alt="특화" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
            />
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-blue-300 text-2xl font-bold mb-4">💠 수정</h3>
          
          <div className="space-y-6">
            {/* 피감 밸런스 세팅 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-3 text-center">피감 밸런스 세팅</h4>
              <div className="flex justify-center">
                <img 
                  src="/tip-images/jangbibal.png" 
                  alt="피감 밸런스 세팅" 
                  className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
                />
              </div>
            </div>
            
            {/* 피감 방어 세팅 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-3 text-center">피감 방어 세팅</h4>
              <div className="flex justify-center">
                <img 
                  src="/tip-images/jangbibang.png" 
                  alt="피감 방어 세팅" 
                  className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. 하고 싶은 말 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-yellow-500 mb-8">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고 싶은 말
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            <strong className="text-yellow-400">자이를 할 때 즐거워야 오래합니다.</strong>
          </p>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            복귀 전에 자이언트 유튜브 <strong className="text-blue-300">필우</strong>님 거 많이 보았습니다. 
            아르샤에서도 많이 싸웠구요.
          </p>
          <p className="text-slate-200 text-xl font-bold leading-relaxed" style={{ color: '#7dd3fc' }}>
            가슴이 시키는 직업을 하셨으면 좋겠습니다. 저는 그랬습니다.
          </p>
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




