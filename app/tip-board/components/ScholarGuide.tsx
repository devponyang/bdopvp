'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ScholarGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/22', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_22')
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
        await fetch('/api/tip-board/22/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/22/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_22', 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

  // ESC 키로 이미지 모달 닫기 및 마우스 휠로 확대/축소
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
          // 최소 0.5배, 최대 3배로 제한
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

  // 이미지 변경 시 스케일 초기화
  useEffect(() => {
    setImageScale(1)
  }, [selectedImage])

  return (
    <>
      {/* 이미지 모달 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto"
          onClick={() => {
            setSelectedImage(null)
            setImageScale(1)
          }}
        >
          <div className="relative">
            {/* 닫기 버튼 */}
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
            
            {/* 확대/축소 안내 */}
            <div className="fixed top-4 left-4 z-10 bg-black/70 text-white px-4 py-2 rounded-lg text-sm border border-gray-500">
              <div>🖱️ 마우스 휠: 확대/축소 ({Math.round(imageScale * 100)}%)</div>
              <div>🔍 현재 배율: {imageScale.toFixed(1)}x</div>
            </div>
            
            {/* 이미지 */}
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
            
            {/* 하단 안내 */}
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
            <img src="/class-icons/scara.png" alt="스칼라" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              스칼라 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "고대의 지혜가 빛으로 현현한다."
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
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-800 to-cyan-900/50 p-6 rounded-2xl mb-8 shadow-2xl border border-cyan-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30">
            <span className="text-4xl">✍️</span>
          </div>
          <div>
            <p className="text-white text-xl font-semibold mb-2">
              <span className="text-gray-300">작성자:</span> <Link href="/guild/도란" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">도란</Link> 길드 <span className="text-blue-400 font-bold">마왕오리</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 rounded-lg shadow-lg">
              <span className="text-xl">🏆</span>
              <p className="text-yellow-300 font-bold text-sm">
                솔라레의 창 - 스칼라 랭킹 1위
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 */}
      <div className="mb-8 flex justify-center">
        <img 
          src="/tip-images/스칼라.png" 
          alt="스칼라" 
          className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setSelectedImage('/tip-images/스칼라.png')}
        />
      </div>

      {/* 1. 소개 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-blue-500">
        <h2 className="text-white text-3xl font-bold mb-4 flex items-center">
          <span className="mr-3 text-4xl">👋</span> 소개
        </h2>
        <p className="text-slate-200 text-lg">
          안녕하세요. 오직 망치 <strong>마왕오리</strong> 입니다.
        </p>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 스칼라의 장점과 단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed">
            스칼라의 장점은 다른 직업보다 상대적으로 <strong className="text-green-400">좋은 체급</strong>으로 생각보다 <strong className="text-green-400">강력한 딜링</strong>과 <strong className="text-green-400">단단함</strong>에 있습니다.
          </p>
        </div>

        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">❌</span> 단점
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed">
            단점으로는 <strong className="text-red-400">잡기를 제외한 모든 스킬이 전부 즉발성 CC가 없기</strong>에 상대방의 틈을 보더라도 구경만 해야한다는 점이 있습니다.
          </p>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-green-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 거점전 / 솔라레 or 길드리그 (소수전) 운영 방법
        </h2>
        
        {/* 거점전 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 거점전
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            거점전에서 운영방법은 스칼라 특성상 <strong className="text-yellow-300">광역 딜링으로 적진의 한가운데로 들어가서 상대방을 흔들거나</strong> 방어력이 약한 직업군들을 <strong className="text-red-300">빠르게 죽여주는 것</strong>에 있으며, 최대한 상대방의 부속을 최대한 HP를 빼내거나 파괴시키는데 의미가 있는 캐릭입니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            물론 상대방의 대포 파괴에도 스칼라 특성상 <strong className="text-cyan-300">높은 곳에 올라가기 편해서</strong> 좋습니다.
          </p>
          
          <p className="text-slate-200 text-lg mb-4">
            대략적인 운영은 아래 영상을 참고하세요.
          </p>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/PdLk-ADGZDg?start=139"
              title="스칼라 거점전 플레이"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>

        {/* 솔라레의 창 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 솔라레의 창 (소수전)
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            솔라레의 창에서는 최대한 <strong className="text-yellow-300">상대방 스킬이 그냥 슈아인지 슈아 CC인지 확실하게 확인</strong>한 이후에 <strong className="text-red-300">모든 첫 CC를 잡기로 이어가는 것이 중요</strong>하며, 잡기를 실패 했을 시 에는 느린 동작으로 인하여 선 CC는 거의 못 먹인다고 보시면 됩니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed">
            대신 대부분의 메인 스킬이 <strong className="text-purple-300">광역 슈아 넉다운 및 바운드</strong>라 아군의 1CC를 확인하고 도중에 넉다운을 박아주면 좋습니다.
          </p>
        </div>
      </div>

      {/* 4. 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-red-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> 콤보
        </h2>
        
        {/* 거점전 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔥</span> 거점전 콤보
          </h3>
          <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-red-500 font-mono text-sm">
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">흐름: 황금 천둥</strong> → 
              <strong className="text-orange-300"> 풍차 돌리기</strong> → 
              <strong className="text-purple-300"> 본: 걷잡을 수 없는 힘</strong> → 
              <strong className="text-yellow-300"> 장타</strong> → 
              <strong className="text-blue-300"> 흐름: 황금의 연쇄</strong>
            </p>
          </div>
        </div>

        {/* 1대1 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 1대1 콤보
          </h3>
          
          {/* 기본 1대1 콤보 */}
          <div className="bg-slate-600/50 p-5 rounded-xl mb-4 border-l-4 border-cyan-500">
            <h4 className="text-cyan-300 text-xl font-bold mb-3">잡기 시작 콤보</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-cyan-500 font-mono text-sm mb-3">
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-yellow-300">잡기</strong> → 
                <strong className="text-red-300"> 한계돌파</strong> → 
                <strong className="text-blue-300"> 진: 걷어 치기</strong> → 
                <strong className="text-green-300"> 진: 두 발 차기</strong> → 
                <strong className="text-purple-300"> 흐름: 황금 덩굴</strong> → 
                <strong className="text-orange-300"> 전율의 두드림</strong> → 
                <strong className="text-yellow-300"> 장타</strong> → 
                <strong className="text-cyan-300"> 슈퍼아머 판정있는 아무 스킬들 또는 상황보고 이탈</strong>
              </p>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-cyan-400">
              <p className="text-slate-200 text-base">
                <strong className="text-cyan-400">💡 참고:</strong> 1대1시에만 본 스킬로 <strong className="text-yellow-300">풍차 돌리기</strong>를 사용합니다. 잡기를 사용전에 맞추고 잡기를 사용해도 상관없고 잡기를 맞춘 이후에는 위에 스킬과 똑같이 운영합니다.
              </p>
            </div>
          </div>

          {/* 풍차 돌리기 시작 */}
          <div className="bg-slate-600/50 p-5 rounded-xl border-l-4 border-orange-500">
            <h4 className="text-orange-300 text-xl font-bold mb-3">풍차 돌리기 적중 시</h4>
            <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-yellow-400 mb-3">
              <p className="text-slate-200 text-base">
                <strong className="text-yellow-400">📌 본:</strong> 풍차돌리기 습득시에만 가능한 콤보라서 본 스킬 찍어 주셔야 합니다.
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-orange-500 font-mono text-sm mb-3">
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-orange-300">풍차 돌리기</strong> (적중) → 
                <strong className="text-cyan-300"> 흐름: 황금 천둥</strong> → 
                <strong className="text-red-300"> 한계돌파</strong> → 
                <strong className="text-blue-300"> 진: 걷어 치기</strong> → 
                <strong className="text-green-300"> 진: 두 발 차기</strong> → 
                <strong className="text-purple-300"> 흐름: 황금 덩굴</strong> → 
                <strong className="text-orange-300"> 전율의 두드림</strong> → 
                <strong className="text-yellow-300"> 장타</strong> → 
                <strong className="text-cyan-300"> 슈퍼아머 판정있는 아무 스킬들 또는 상황보고 이탈</strong>
              </p>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-orange-400">
              <p className="text-slate-200 text-base">
                잡기가 없는 상태에서 풍차 돌리기를 적중시키면 위 콤보로 연계합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4-1. 진입기/시동기 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🚀</span> 진입기 / 1cc 시동기 활용법 (이니시)
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-indigo-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 주요 이동기
          </h3>
          
          <div className="bg-slate-600/50 p-5 rounded-lg mb-4 border-l-4 border-indigo-400">
            <p className="text-slate-200 text-lg mb-3">
              진입기로는 스칼라에게는 이동기로 다음과 같은 스킬들을 사용합니다:
            </p>
            <ul className="space-y-2 text-slate-200 text-lg">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span><strong className="text-cyan-300">진: 뛰어 찍기</strong> (흐름 포함)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span><strong className="text-green-300">가속 돌진</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span><strong className="text-blue-300">진: 가벼운 도약</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span><strong className="text-purple-300">중력 회피</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span><strong className="text-yellow-300">물러서기</strong> (흐름 포함)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span><strong className="text-orange-300">진: 중력핵 설치</strong> 이후 다시 커맨드를 사용하여 <strong className="text-red-300">진: 인력생성</strong>, <strong className="text-pink-300">흐름: 중력 폭격</strong>, <strong className="text-cyan-300">흐름: 척력 생성</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span><strong className="text-indigo-300">역중력 도약</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-600/40">
            <h4 className="text-yellow-300 text-xl font-bold mb-3">💡 진입 운영법</h4>
            <p className="text-slate-200 text-lg leading-relaxed">
              <strong className="text-red-400">역중력 도약을 제외한</strong> 모든 이동기를 사용해서 상대방에게 최대한 접근하고 접근한 이후에 <strong className="text-cyan-300">역중력 도약</strong>으로 공중으로 올라간 뒤에 상황을 보고 <strong className="text-yellow-300">흐름: 황금 천둥</strong>을 사용해서 콤보를 이어갑니다.
            </p>
          </div>
        </div>
      </div>

      {/* 4-2. 잠금 스킬과 라밤 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-pink-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🔒</span> 잠금 스킬과 라밤
        </h2>
        
        {/* 잠금 스킬 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔒</span> 잠구는 스킬
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
            <ul className="space-y-2 text-slate-200 text-lg">
              <li className="flex items-start gap-2">
                <span className="text-red-400">▸</span>
                <span><strong className="text-yellow-300">흐름: 황금 궤적</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">▸</span>
                <span><strong className="text-blue-300">흐름: 황금 장벽</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">▸</span>
                <span><strong className="text-purple-300">진: 투구 부시기</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">▸</span>
                <span><strong className="text-cyan-300">회피 이동</strong></span>
              </li>
            </ul>
            <p className="text-gray-400 text-sm mt-3">
              회피 이동을 제외한 나머지는 취향입니다. (저는 언급한 4개는 잠구고 있습니다)
            </p>
          </div>
        </div>

        {/* 라밤 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-pink-300 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">✨</span> 라밤 (기술 심화)
          </h3>
          <div className="flex justify-center mb-4">
            <img 
              src="/tip-images/스칼라라밤.png" 
              alt="라밤" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/스칼라라밤.png')}
            />
          </div>
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-pink-400">
            <ul className="space-y-2 text-slate-200 text-lg text-center">
              <li>
                <strong className="text-cyan-300">중력 제어</strong>
              </li>
              <li>
                <strong className="text-yellow-300">흐름: 황금길</strong>
              </li>
              <li>
                <strong className="text-green-300">금빛 가호</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. PvP 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💎</span> PvP 특화 및 수정
        </h2>
        
        {/* 특화 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600 mb-6">
          <h3 className="text-2xl font-bold text-purple-300 mb-4">⚡ 특화</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 거점전 및 길드리그 특화 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSelectedImage('/tip-images/스칼라거점전특화.png')}>
                <img 
                  src="/tip-images/스칼라거점전특화.png" 
                  alt="거점전 및 길드리그 특화" 
                  className="rounded-lg max-w-full h-auto border border-slate-400 hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="text-red-300 text-lg font-bold">거점전 및 길드리그 특화</p>
            </div>

            {/* 솔라레 특화 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSelectedImage('/tip-images/스칼라솔라레특화.png')}>
                <img 
                  src="/tip-images/스칼라솔라레특화.png" 
                  alt="솔라레 특화" 
                  className="rounded-lg max-w-full h-auto border border-slate-400 hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="text-cyan-300 text-lg font-bold">솔라레 특화</p>
            </div>
          </div>
        </div>
        
        {/* 수정 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600 mb-6">
          <h3 className="text-blue-300 text-2xl font-bold mb-4">💠 수정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 무제한 거점전 수정 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSelectedImage('/tip-images/무제한스칼라.png')}>
                <img 
                  src="/tip-images/무제한스칼라.png" 
                  alt="무제한 거점전 수정" 
                  className="rounded-lg max-w-full h-auto border border-slate-400 hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="text-blue-300 text-lg font-bold">무제한 거점전 수정</p>
            </div>
            
            {/* 무제한 적중수정 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSelectedImage('/tip-images/무제한적중스칼라.png')}>
                <img 
                  src="/tip-images/무제한적중스칼라.png" 
                  alt="무제한 적중수정" 
                  className="rounded-lg max-w-full h-auto border border-slate-400 hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="text-green-300 text-lg font-bold">무제한 적중수정</p>
            </div>

            {/* 리그용 수정 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSelectedImage('/tip-images/스칼라리그용.png')}>
                <img 
                  src="/tip-images/스칼라리그용.png" 
                  alt="리그용 수정" 
                  className="rounded-lg max-w-full h-auto border border-slate-400 hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="text-purple-300 text-lg font-bold">리그용 수정</p>
            </div>
          </div>
        </div>

        {/* 유물 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600 mb-6">
          <h3 className="text-green-300 text-2xl font-bold mb-4">✨ 유물</h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-400 text-center">
            <p className="text-slate-200 text-lg">
              <strong className="text-blue-300">유물:</strong> <strong className="text-cyan-400">데키아 피해감소 유물</strong> + 광명석 <strong className="text-blue-400">서리방패</strong>
            </p>
          </div>
        </div>

        {/* 군왕 재련석 */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40 mb-6">
          <h4 className="text-red-300 text-2xl font-bold mb-4">⚔️ 군왕 재련석</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-red-400 font-bold">공격력</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-blue-400 font-bold">모든 피해 감소</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-green-400 font-bold">백어택 피해량 증가</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-purple-400 font-bold">다운어택 피해량 증가</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-yellow-400 font-bold">치명타 피해량 증가</p>
            </div>
          </div>
        </div>

        {/* 5-1. 극공/적중 외에 밸런스 세팅을 안쓰는 이유 */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40">
          <h3 className="text-red-300 text-2xl font-bold mb-4">⚠️ 극공/적중 외에 밸런스 세팅을 안쓰는 이유</h3>
          <div className="bg-slate-900/50 p-5 rounded-lg">
            <p className="text-slate-200 text-lg leading-relaxed mb-4">
              스칼라 특성상 <strong className="text-yellow-300">한번 CC 기회를 잡으면 한번에 딜을 넣어서 몰아쳐야 상대방을 죽일 수 있는데</strong> 피밸 세팅을 하면 어쩌다가 CC 기회를 잡아도 상대방을 죽일 딜이 안 나오게 됩니다.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed mb-4">
              스칼라가 탱 세팅을 해도 상대방에게 CC를 맞고 집중 포화를 당하게 된다면 죽는 건 똑같은데 피밸 세팅을 하면 <strong className="text-red-400">상대방만 못 잡는 상황이 너무 많이 나옵니다.</strong>
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              <strong className="text-cyan-300">무적-슈아 베이스의 캐릭</strong>이라서 무적으로 나머지 딜을 전부 흘린다고 생각하고 플레이해서 <strong className="text-yellow-300">최대한 기회가 있을 때 확실하게 상대방을 보내버릴 딜이 필요합니다.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 6. 꿀팁 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-yellow-500 mb-8">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💡</span> 꿀팁
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-600/40">
            <h4 className="text-yellow-300 text-xl font-bold mb-3">⚡ 공속 버프 유지</h4>
            <p className="text-slate-200 text-lg leading-relaxed">
              평소에 계속 <strong className="text-cyan-300">공속 15% 증가 버프</strong>를 돌리는 것이 중요합니다. <strong className="text-blue-300">진: 올려 찍기</strong>와 <strong className="text-purple-300">진: 중력핵 설치</strong>를 잘 사용해서 계속 유지를 해야 합니다.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-600/40">
            <h4 className="text-blue-300 text-xl font-bold mb-3">🛡️ 전방가드 스킬 주의</h4>
            <p className="text-slate-200 text-lg leading-relaxed">
              스칼라는 전방가드 스킬이 많이 존재하긴 하지만 대부분 느려서 상대방에게는 약점으로 보일 수 있으며 그로 인하여 <strong className="text-cyan-300">슈퍼아머가 붙은 스킬들만 주로 사용</strong>합니다.
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-600/40">
            <h4 className="text-red-300 text-xl font-bold mb-3">⚠️ 솔라레에서의 스칼라</h4>
            <p className="text-slate-200 text-lg leading-relaxed mb-3">
              스칼라 저점 자체는 매우 높은 편에 속합니다. 대신 고점 자체는 너무 낮아서 상위큐에 가면 갈수록 힘듭니다. 잡기 직업들도 물론 잡기가 매우 중요하긴 하지만, 스칼라는 그냥 솔라레에서 <strong className="text-red-400">잡기 실패시에는 없는 캐릭이나 다름없습니다.</strong> (나머지 스킬은 선딜이 너무 길어서 얻어 걸리는 거 아니면 CC 적중이 불가능합니다.)
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              팀에게나 적에게나 그냥 <strong className="text-gray-400">날아다니는 황금 파리</strong>입니다.
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
    </>
  )
}

