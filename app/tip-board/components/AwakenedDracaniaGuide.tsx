'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AwakenedDracaniaGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/31', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_31')
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
        await fetch('/api/tip-board/31/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/31/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_31', 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

  // ESC 키로 이미지 모달 닫기 및 휠로 확대/축소
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
        setImageScale(1)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (selectedImage) {
        e.preventDefault()
        const delta = e.deltaY * -0.001
        setImageScale(prev => {
          const newScale = prev + delta
          return Math.min(Math.max(0.5, newScale), 3)
        })
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('wheel', handleWheel, { passive: false })
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('wheel', handleWheel)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  useEffect(() => {
    setImageScale(1)
  }, [selectedImage])

  return (
    <>
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto"
          onClick={() => {
            setSelectedImage(null)
            setImageScale(1)
          }}
        >
          <div className="relative">
            <button
              onClick={() => {
                setSelectedImage(null)
                setImageScale(1)
              }}
              className="fixed top-4 right-4 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center text-xl font-medium transition-all duration-200 border border-gray-500 hover:border-gray-400 shadow-lg"
              title="닫기 (ESC)"
            >
              ×
            </button>
            
            <div className="fixed top-4 left-4 z-10 bg-black/70 text-white px-4 py-2 rounded-lg text-sm border border-gray-500">
              <div>🖱️ 마우스 휠: 확대/축소 ({Math.round(imageScale * 100)}%)</div>
              <div>🔍 현재 배율: {imageScale.toFixed(1)}x</div>
            </div>
            
            <div className="relative min-h-screen flex items-center justify-center p-20">
              <img 
                src={selectedImage} 
                alt="이미지 크게 보기" 
                style={{
                  transform: `scale(${imageScale})`,
                  transition: 'transform 0.1s ease-out',
                }}
                className="max-w-none h-auto rounded-lg shadow-2xl border border-gray-600 cursor-move"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />
            </div>
            
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/70 text-white/70 px-6 py-3 rounded-lg text-sm border border-gray-500">
              이미지를 클릭하거나 ESC 키를 눌러 닫을 수 있습니다 | 마우스 휠로 확대/축소
            </div>
          </div>
        </div>
      )}

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
            <img src="/class-icons/draca.png" alt="드라카니아" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              각성 드라카니아 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "용의 힘으로 적을 압도하는 전투의 지배자"
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

      {/* 작성자 정보 */}
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-800 to-blue-900/50 p-6 rounded-2xl mb-8 shadow-2xl border border-blue-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
            <span className="text-4xl">✍️</span>
          </div>
          <div>
            <p className="text-white text-xl font-semibold mb-2">
              <span className="text-gray-300">작성자:</span> <Link href="/guild/Ctrl" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">Ctrl</Link> 길드 <span className="text-blue-400 font-bold">도비뚜밥</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-lg shadow-lg">
              <img src="/class-icons/draca.png" alt="드라카니아" className="w-5 h-5 object-contain" />
              <p className="text-blue-300 font-bold text-sm">
                2025 솔라레의 창 시즌 2 - 드라카니아 랭킹 1위
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
        <div className="text-slate-200 text-lg leading-relaxed space-y-3">
          <p>
            안녕하세요, <strong className="text-purple-400">Ctrl 길드</strong>에서 각성 드라카니아를 플레이하고 있는 <strong className="text-blue-400">도비뚜밥</strong>입니다.
          </p>
        </div>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 각성 드라카니아 클래스의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-green-400">이동기가 많아 기동성이 좋음</strong></li>
            <li><strong className="text-green-400">굴절 잡기를 활용해서 창의적인 잡기각을 만들어낼 수 있음</strong></li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-red-400">전방가드 및 맨몸 판정 스킬이 많아 슈퍼아머 유지가 어려움</strong></li>
            <li><strong className="text-red-400">상대방 cc 및 뒤잡 스킬에 매우 취약함</strong></li>
          </ul>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 운영법
        </h2>
        
        {/* 1번째 줄: 솔라레의 창 운영법 */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 p-6 rounded-xl mb-6 border border-blue-400/30 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">🌟</span>
            </div>
            <h3 className="text-blue-200 text-xl font-bold">솔라레의 창 운영법</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-cyan-300 font-bold mb-2 text-lg">1. 드리블은 팀이 있는 쪽으로</h4>
              <p className="text-slate-200 text-base leading-relaxed">
                각성 드라카니아의 특성상 상대팀 입장에서 찍기 좋은 캐릭터중 하나이기 때문에 아마도 솔라레를 하시다보면 가장 먼저 찍히게 되는 상황이 많이 나오게 됩니다.
              </p>
              <p className="text-slate-200 text-base leading-relaxed">
                이때 드리블을 항상 미니맵을 보면서 팀이 있는 쪽으로 해주셔야 생존하실 수 있습니다.
              </p>
            </div>

            <div>
              <h4 className="text-cyan-300 font-bold mb-2 text-lg">2. 잡기 이후 무리하게 2cc를 넣을 필요 X</h4>
              <p className="text-slate-200 text-base leading-relaxed">
                각성 드라카니아의 경우 넉다운 cc 스킬들이 모두 맨몸 판정이기 때문에 잡기 이후 무리하게 2cc를 넣으실 필요는 없습니다.
              </p>
              <p className="text-slate-200 text-base leading-relaxed">
                잡기 성공 후 핑을 가장 먼저 찍으신 다음, 주변 상황을 보고 넉다운을 넣을 수 있으면 넣으시되 상대방의 커버가 바로 들어올거 같거나 난전중에 잡으셨다면 아군이 2cc를 넣어준다고 생각하시고 슈아 스킬을 쓰시거나 이동기를 통해 한번 흘려 주시는게 좋습니다. 만약 어떻게든 자신이 2cc를 넣어야 하는 상황이라면 본:격파의돌격(띄우기)으로 넣어주시면 됩니다.
              </p>
            </div>

            <div>
              <h4 className="text-cyan-300 font-bold mb-2 text-lg">3. 아군 핑이 찍혔을때</h4>
              <ul className="text-slate-200 text-base space-y-2 list-disc list-inside ml-4">
                <li>아군이 cc에 걸려서 핑이 찍힘 → 상대방 딜러를 커버잡</li>
                <li>아군이 상대팀에게 cc를 걸어서 핑이 찍힘 → 상대방 커버가 바로 들어올 수 없을 경우 딜링, 상대방 커버가 바로 들어올 수 있는 상황이면 커버 들어오는 상대방을 역잡</li>
              </ul>
            </div>

            <div>
              <h4 className="text-cyan-300 font-bold mb-2 text-lg">4. 상대방에 잡기 캐릭터가 있을경우 슈퍼아머 유지시 주의점</h4>
              <p className="text-slate-200 text-base leading-relaxed">
                슈퍼아머 스킬중 마룡폼 혼에 사무치는 원한 및 마인폼 척결은 스킬 사용후 딜레이가 길어 상대방에게 잡기각이 아주 쉽게 나오기 때문에 주의하셔야 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 2번째 줄: 거점전(RVR) 운영법 + 길드 리그 운영법 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 거점전(RVR) 운영법 */}
          <div className="bg-gradient-to-br from-red-900/20 to-rose-900/10 p-6 rounded-xl border border-red-400/30 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">⚔️</span>
              </div>
              <h3 className="text-red-200 text-xl font-bold">거점전(RVR) 운영법</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-200 text-lg leading-relaxed">
                메인 본대에서 플레이하기보다는 사이드 쪽에 펼쳐서 포지션을 잡는게 좋습니다.
              </p>
              <p className="text-slate-200 text-lg leading-relaxed">
                사이드 쪽에서 전방가드 스킬(마룡폼)으로 상대 라인을 견제해주다가 아군 딜러들에게 들어오는 상대방 암살자 캐릭터들을 잡기를 이용해서 잡아주시면 됩니다.
              </p>
              <p className="text-slate-200 text-lg leading-relaxed">
                성채 막타 경쟁 타이밍 때는 경쟁 연맹 뒷라인으로 먼저 들어가서 cc를 넣거나 아군 딜러들에게 들어오는 상대방 암살자 캐릭터를 보고 커버잡기를 해주시면 됩니다.
              </p>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mt-4">
                <p className="text-amber-300 font-semibold mb-2">⚠️ 주의사항</p>
                <p className="text-slate-200 text-base">
                  전방 및 맨몸 판정이 많은 각성 드라카니아의 특성상 무제한 거점전처럼 주로 3개 연맹이 성채 하나를 두고 대치하는 상황에선 할 수 있는게 거의 없기 때문에 추천드리지 않고, 1단거점처럼 소규모 교전이 많이 일어나는 곳에서 플레이하시는게 좋습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 길드 리그 운영법 */}
          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 p-6 rounded-xl border border-purple-400/30 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🏆</span>
              </div>
              <h3 className="text-purple-200 text-xl font-bold">길드 리그 운영법</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-200 text-lg leading-relaxed">
                솔라레 운영법과 거의 비슷하게 운영됩니다, 상대 주력 딜러들을 압박하면서 cc를 걸었을 때 핑을 찍어주시고(색깔핑 사용 권장) 아군이 cc에 걸렸을 때는 커버, 상대방 딜러가 cc에 걸렸을 때는 딜링 및 역잡각을 봐주시면 되겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚡</span> PVP 콤보
        </h2>
        
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mb-6">
          <p className="text-amber-300 text-base font-semibold">
            ※ 콤보는 참고용으로, 상황에 따라 유연하게 사용하시면 됩니다.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* 2CC 콤보 */}
          <div className="bg-gradient-to-br from-red-900/20 to-rose-900/10 p-6 rounded-xl border border-red-400/30 shadow-lg">
            <h3 className="text-red-300 text-2xl font-bold mb-4">2CC 콤보</h3>
            <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50" onClick={() => setSelectedImage('/tip-images/드카콤보1.png')}>
              <img src="/tip-images/드카콤보1.png" alt="2CC 콤보" className="w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
          
          {/* 2.7CC 콤보 */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 p-6 rounded-xl border border-blue-400/30 shadow-lg">
            <h3 className="text-blue-300 text-2xl font-bold mb-4">2.7CC 콤보</h3>
            <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50" onClick={() => setSelectedImage('/tip-images/드카콤보2.png')}>
              <img src="/tip-images/드카콤보2.png" alt="2.7CC 콤보" className="w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
          
          {/* 전승 스타트 2.7CC 콤보 */}
          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 p-6 rounded-xl border border-purple-400/30 shadow-lg">
            <h3 className="text-purple-300 text-2xl font-bold mb-4">전승 스타트 2.7CC 콤보</h3>
            <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50" onClick={() => setSelectedImage('/tip-images/드카콤보3.png')}>
              <img src="/tip-images/드카콤보3.png" alt="전승 스타트 2.7CC 콤보" className="w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. 진입기 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-cyan-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🚀</span> 주로 사용하는 진입기
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/10 p-6 rounded-xl border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500/80 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">1</span>
              </div>
              <p className="font-semibold text-blue-300 text-xl">진입기 1</p>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-lg border border-slate-500/50">
              <p className="text-slate-200 text-lg font-medium">마인 격파의 돌격 → 마룡 파멸의 인도자</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/10 p-6 rounded-xl border border-green-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500/80 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">2</span>
              </div>
              <p className="font-semibold text-green-300 text-xl">진입기 2</p>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-lg border border-slate-500/50">
              <p className="text-slate-200 text-lg font-medium">마인 폭풍의 습격 → 마룡 파멸의 인도자</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/20 to-violet-900/10 p-6 rounded-xl border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-500/80 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">3</span>
              </div>
              <p className="font-semibold text-purple-300 text-xl">진입기 3</p>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-lg border border-slate-500/50">
              <p className="text-slate-200 text-lg font-medium">마인 격파의 돌격 → 굴절 → 잡기</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-900/20 to-amber-900/10 p-6 rounded-xl border border-orange-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-500/80 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">4</span>
              </div>
              <p className="font-semibold text-orange-300 text-xl">진입기 4</p>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-lg border border-slate-500/50">
              <p className="text-slate-200 text-lg font-medium">마룡 역린 찌르기 → 흐름 구름끊기</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 수정 및 특화 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-pink-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> 수정 및 특화
        </h2>
        
        {/* 특화 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 rounded-xl mb-6 border border-slate-600 shadow-lg">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">특화</h3>
          <div className="space-y-6">
            {/* 솔라레 특화 */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 p-6 rounded-xl border border-blue-400/30 shadow-lg">
              <h4 className="text-blue-300 text-2xl font-bold mb-4">솔라레 특화</h4>
              <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50 mb-4" onClick={() => setSelectedImage('/tip-images/드라카니아특화1.png')}>
                <img src="/tip-images/드라카니아특화1.png" alt="솔라레 특화" className="w-full h-auto object-contain rounded-lg" />
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-500/50">
                <p className="text-slate-200 text-lg leading-relaxed">
                  솔라레 특화는 요즘 회피가 많아서 회깎을 넣었다는거, 그리고 잡기 이후 바로 척결을 사용하여 슈아로 끌어가는 상황이 많아서 척결에 특화를 넣었습니다.
                </p>
              </div>
            </div>
            
            {/* 범용성 특화 */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 p-6 rounded-xl border border-green-400/30 shadow-lg">
              <h4 className="text-green-300 text-2xl font-bold mb-4">범용성 특화</h4>
              <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50 mb-4" onClick={() => setSelectedImage('/tip-images/드라카니아특화2.png')}>
                <img src="/tip-images/드라카니아특화2.png" alt="범용성 특화" className="w-full h-auto object-contain rounded-lg" />
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-500/50">
                <p className="text-slate-200 text-lg leading-relaxed">
                  1:1콤보에 많이 들어가는 마룡 : 격파의 돌격 에 특화를 넣었었습니다, 다른 특화는 1:1 특화에 맞춰져있다고 보시면 될 것 같습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 수정 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 rounded-xl mb-6 border border-slate-600 shadow-lg">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">수정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50" onClick={() => setSelectedImage('/tip-images/드라카니아수정.png')}>
              <img src="/tip-images/드라카니아수정.png" alt="드라카니아 수정" className="w-full h-auto object-contain rounded-lg" />
            </div>
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-600/50">
              <div className="text-slate-200 text-lg space-y-4">
                <div>
                  <p className="mb-2"><strong className="text-green-300">강 : 조합 마력의 수정 훔</strong> x4</p>
                  <p className="mb-2"><strong className="text-blue-300">진 : 명예로운 영광의 수정</strong> x2</p>
                  <p className="mb-2"><strong className="text-yellow-300">명예로운 용기의 수정 - 올루카스</strong> x2</p>
                  <p className="mb-2"><strong className="text-red-300">붉은 정령의 수정</strong> x2</p>
                  <p className="mb-2"><strong className="text-orange-300">붉은 전장의 수정 - 살무사</strong> x2</p>
                  <p className="mb-2"><strong className="text-purple-300">검붉은 송곳니 - 철갑</strong> x2</p>
                  <p><strong className="text-cyan-300">부패의 수정</strong></p>
                  <p><strong className="text-emerald-300">해태의 눈물</strong></p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <p className="mb-2">무제한, 길드리그 - <strong className="text-yellow-300">강피감 2개</strong></p>
                  <p>그 외 필드 Pvp - <strong className="text-yellow-300">강피감 1개</strong> 채용</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 라밤 및 본 스킬 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 rounded-xl mb-6 border border-slate-600 shadow-lg">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">라밤 및 본 스킬</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50" onClick={() => setSelectedImage('/tip-images/드라카니아라밤.png')}>
              <img src="/tip-images/드라카니아라밤.png" alt="드라카니아 라밤" className="w-full h-auto object-contain rounded-lg" />
            </div>
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-600/50 flex flex-col justify-center">
              <div className="text-slate-200 text-lg">
                <p className="mb-3">본 스킬은 <strong className="text-green-300">마인 격파의돌격</strong> 사용</p>
              </div>
            </div>
          </div>
        </div>

        {/* 밸런스 세팅 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-slate-600 shadow-lg">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">밸런스 세팅에 관한 생각</h3>
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-6 rounded-xl border border-amber-400/40">
            <p className="text-slate-200 text-lg leading-relaxed">
              각성 드라카니아에게 밸셋말고는 의미가 없다고 생각합니다. 이유로는 각성 드라카니아가 cc를 거는 방법이 주로 2가지 (잡기와 마룡 역린찌르기)인데 딜러들에게 버티면서 cc각을 보려면 피감세팅은 필수적입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 7. 꿀팁 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-emerald-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💡</span> 하고싶은말 및 꿀팁
        </h2>
        
        {/* 팁 1 */}
        <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/10 p-6 rounded-xl mb-6 border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500/80 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">1</span>
            </div>
            <h3 className="text-emerald-300 text-2xl font-bold">팁 1. Q가드 이후 마인 격파의 돌격시 날개 펼치는 모션 캔슬</h3>
          </div>
          <div className="text-slate-200 text-lg space-y-3">
            <p>Q가드 이후 마인 격파의 돌격(W+E) 사용시 날개를 펼친 후 격파의 돌격이 나가게 되는데 Q가드 하실때 Q랑 같이 W를 누르고 계시다가 격파의 돌격을 사용하시면 날개 펼치는 모션 없이 바로 스킬 사용이 가능합니다.</p>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-lg border border-slate-500/50">
              <p className="text-blue-300 font-semibold">(가드를 그냥 QW로 하신다고 생각하시면 됩니다)</p>
            </div>
          </div>
        </div>

        {/* 팁 2 */}
        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/10 p-6 rounded-xl mb-6 border border-green-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-500/80 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">2</span>
            </div>
            <h3 className="text-emerald-300 text-2xl font-bold">팁 2. 굴절 및 용의발걸음은 최대한 길게 끌어주기</h3>
          </div>
          <div className="text-slate-200 text-lg space-y-3">
            <p>굴절이나 용의 발걸음 사용시 최대한 길게 끌어서 무적 및 슈퍼아머를 오래 유지한 후 스킬을 사용하시는게 좋습니다.</p>
          </div>
        </div>

        {/* 팁 3 */}
        <div className="bg-gradient-to-r from-purple-900/20 to-violet-900/10 p-6 rounded-xl mb-6 border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-500/80 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">3</span>
            </div>
            <h3 className="text-emerald-300 text-2xl font-bold">팁 3. 전승 스킬 활용하여 슈아 유지하기</h3>
          </div>
          <div className="text-slate-200 text-lg space-y-4">
            <p>각성 스킬만으로는 슈아 유지를 하는데 한계가 있어서 전승 스킬도 활용하시는게 좋습니다.</p>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-lg border border-slate-500/50">
              <p className="mb-2">전승 스킬 푸른맹습을 키슬롯에 등록하시면 각성폼에서 바로 전승으로 전환을 할 수 있으며 푸른맹습이 슈퍼아머에 경직cc가 달려있고 화면을 꺾으면서 사용하시면 상대방 전방가드 뒤쪽으로 들어가서 cc를 넣을 수 있기 때문에 잘 활용하시면 좋습니다.</p>
            </div>
            <div>
              <p className="font-semibold text-cyan-300 mb-2">전승 슈아 굴리는 법:</p>
              <ul className="space-y-2 ml-4">
                <li>• 푸른맹습 → 벼락불 작렬(Shift+RMB) → 각성폼 스왑</li>
                <li>• 푸른맹습 → 마크타난의 손짓(Shift+LMB) → 각성폼 스왑</li>
                <li>• 마크타난의 비늘(키슬롯에 두고 사용, 상대방 잡기 있으면 사용시 잡히니까 주의)</li>
                <li>• 용의 강습(라밤스킬, Shift+Z)</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40">
              <p className="text-yellow-300 font-semibold mb-2">※ 전승 - 각성 스왑하는 방법</p>
              <p className="text-slate-200">스왑(C) 이후 용의발걸음 사용 시 스왑모션 캔슬 가능</p>
            </div>
          </div>
        </div>

        {/* 하고싶은 말 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 rounded-xl mb-6 border border-slate-600 shadow-lg">
          <h3 className="text-emerald-300 text-2xl font-bold mb-4">하고싶은 말</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p>많이 부족하지만 읽어주셔서 감사드리고 궁금한 점 있으시다면 인게임 도비뚜밥 귓해주시면 답 해드리겠습니다!</p>
          </div>
        </div>

        {/* 추천 자료 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-blue-900/30 p-6 rounded-xl border border-blue-500/30 shadow-lg">
          <h3 className="text-emerald-300 text-2xl font-bold mb-6 flex items-center">
            <span className="mr-3 text-3xl">📚</span> 추천 유튜브
          </h3>
          <div className="text-slate-200 text-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-500 hover:border-red-400 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <img src="/tip-images/Youtube.png.png" alt="YouTube" className="w-8 h-8 object-contain" />
                  <a href="https://www.youtube.com/@Mirmulnir" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-colors">
                    미르뮬니르님
                  </a>
                </div>
                <p className="text-sm text-gray-400">YouTube 채널</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-500 hover:border-red-400 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <img src="/tip-images/Youtube.png.png" alt="YouTube" className="w-8 h-8 object-contain" />
                  <a href="https://www.youtube.com/@babibuubebo/videos" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-colors">
                    Bubie님
                  </a>
                </div>
                <p className="text-sm text-gray-400">YouTube 채널</p>
              </div>
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
    </>
  )
}
