'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DeadEyeGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/16', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_16')
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
        await fetch('/api/tip-board/16/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/16/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_16', 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

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
            <img src="/class-icons/dead.png" alt="데드아이" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              데드아이 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "조준은 짧고, 죽음은 즉발이다."
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

      {/* 유튜브 영상 */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-6xl">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl border-4 border-blue-400/50 shadow-xl"
              src="https://www.youtube.com/embed/ryni1qwU1mI?si=qPLD7GAb_pNi4V4r"
              title="데드아이 가이드 영상"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
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
              <span className="text-gray-300">작성자:</span> <Link href="/guild/Ctrl" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">Ctrl</Link> 길드 <span className="text-blue-400 font-bold">무슨말</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-lg shadow-lg">
              <img src="/class-icons/dead.png" alt="데드아이" className="w-5 h-5 object-contain" />
              <p className="text-blue-300 font-bold text-sm">
                2025 솔라레의 창 시즌 2 - 데드아이 랭킹 1위
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
          안녕하세요. <strong className="text-purple-400">무슨말</strong>입니다.
        </p>
      </div>

      {/* 2. 클래스 소개 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 클래스 소개
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            데드아이는 전통적인 원거리 클래스보다 사거리가 짧지만, 근거리 클래스보다 길어 <strong className="text-blue-400">중거리 싸움을 주도하는 원거리형 인파이터</strong>입니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            데드아이는 적진 후방의 원거리 적을 암살하거나, 전방의 근거리 적에게 지속적인 압박을 가하는 등 <strong className="text-green-400">다양한 상황에 유연하게 대응</strong>할 수 있습니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            또한 짧은 쿨타임의 이동기("미끄러지기", 재사용 대기시간 2초)를 통해 <strong className="text-yellow-400">높은 기동성</strong>을 지니며, 조작 난이도도 비교적 쉬워 검은사막을 처음 시작하는 분들에게 추천할 만한 클래스입니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed">
            데드아이는 <strong className="text-red-400">리볼버(주무기), 릴 데블(각성무기), 샷건(보조무기)</strong>을 사용하며, 두 가지 형태의 탄환인 <strong className="text-cyan-400">"실탄"과 "마르니탄"</strong>을 활용해 전투를 펼칩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 실탄 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-red-400 text-xl font-bold mb-4">🔴 실탄</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-red-300 font-semibold mb-2">리볼버</h4>
                <ul className="text-slate-200 text-base space-y-1">
                  <li>• 조준 도우미에 영향을 받아 <strong className="text-red-300">유도탄 가능</strong></li>
                  <li>• 에임을 한번만 맞추면 이어서 사용하는 리볼버 스킬이 전부 유도</li>
                  <li>• 데드아이가 안정적인 카이팅이 가능하게 해주는 핵심 스킬</li>
                  <li>• 에임을 맞추지 않음으로써 이동 방향의 시야를 더 많이 확보 가능</li>
                </ul>
              </div>
              <div>
                <h4 className="text-red-300 font-semibold mb-2">샷건</h4>
                <ul className="text-slate-200 text-base space-y-1">
                  <li>• <strong className="text-red-300">거리에 따라 피해량 변화</strong> (가까울수록 ▲, 멀수록 ▼)</li>
                  <li>• 슈아를 유지하는 경우 외에는 실탄 샷건으로 딜링을 하지 않음</li>
                </ul>
              </div>
              <div>
                <h4 className="text-red-300 font-semibold mb-2">릴데블</h4>
                <ul className="text-slate-200 text-base space-y-1">
                  <li>• <strong className="text-red-300">투사체 속도가 매우 빠름</strong> (피하기 힘듦)</li>
                  <li>• 마르니탄보다 피해량이 크며, 범위도 좁아서 분산딜에 영향을 덜받음</li>
                  <li>• 사실상 더 큰 피해를 입힘</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 마르니탄 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-cyan-400 text-xl font-bold mb-4">🔵 마르니탄</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-cyan-300 font-semibold mb-2">리볼버</h4>
                <ul className="text-slate-200 text-base space-y-1">
                  <li>• 모험가에게 <strong className="text-cyan-300">직접 에임을 맞춰야 타격 가능</strong></li>
                  <li>• 관통샷, 실탄보다 범위 넓음</li>
                  <li>• 딜보단 이동기 혹은 전방 범위기로 사용하는 편</li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan-300 font-semibold mb-2">샷건</h4>
                <ul className="text-slate-200 text-base space-y-1">
                  <li>• <strong className="text-cyan-300">거리에 상관없이 피해량 최대</strong></li>
                  <li>• 가장 가까이서 타격하는 실탄 샷건과 거의 동일한 데미지</li>
                  <li>• 실탄보다 범위 좌, 우로 넓음</li>
                  <li>• <strong className="text-cyan-300">RVR에서 주력 원거리 딜링기</strong></li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan-300 font-semibold mb-2">릴데블</h4>
                <ul className="text-slate-200 text-base space-y-1">
                  <li>• <strong className="text-cyan-300">투사체 속도가 매우 느림</strong></li>
                  <li>• 기동사격(마르니탄)을 이동기로 사용 가능</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 p-4 rounded-lg border border-yellow-400/40 mt-6">
          <p className="text-yellow-300 text-base font-semibold">
            💡 대부분의 경우에 샷건은 마르니탄이 더 강력합니다.
          </p>
        </div>
      </div>

      {/* 3. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-green-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 데드아이 클래스의 장점/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-green-400">1. "후방 기동 포격(S+E, 10초)" 기술의 매우 빠르고 안정적인 공격과 수비 즉시 전환 가능</strong>
              <ul className="text-slate-300 text-base mt-2 space-y-2 pl-4">
                <li>무지성으로 들어갔다가, "아님말고~"가 가능하다.</li>
                <li>※ 후방 기동 포격의 "무적"이 삭제되어도 여전히 속도 자체는 빠르기에 이동기로써 사용이 가능하며, 여전히 좋은 탈출기다.</li>
              </ul>
            </li>
            <li><strong className="text-green-400">2. 대부분의 기술이 이동하면서 타격하기에 일방적인 딜링이 가능하다.</strong></li>
            <li><strong className="text-green-400">3. 주력 회피기(미끄러지기)의 쿨타임이 "2초"이기에 스킬 1개와 미끄러지기를 반복하는 등 슈퍼아머를 유지하는 것에 적응하기 쉽다.</strong></li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-red-400">1. 데드아이의 폭발적인 딜링은 샷건에서 나오지만, 샷건 타격 타이밍을 조절할 수가 없어서 상대방이 데드아이의 모션을 보고 피하기 쉽다.</strong></li>
            <li><strong className="text-red-400">2. 데드아이의 샷건 기술뿐만 아니라 리볼버, 릴데블 기술 또한 상대의 전략에 따라 딜을 전혀 못하는 상황이 발생할 수 있어서 원거리 클래스다운 겸손한 딜링이 필요할 수 있다.</strong></li>
          </ul>
        </div>

        {/* 그림1.gif */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <div className="flex justify-center mb-4">
            <img 
              src="/tip-images/그림1.gif" 
              alt="데드아이 석양 전방가드 뚫림" 
              className="w-full max-w-2xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => setSelectedImage('/tip-images/그림1.gif')}
            />
          </div>
          <p className="text-slate-200 text-center text-lg font-semibold">
            상대 데드아이가 석양(전방가드)을 사용하자마자 전방가드 뚫림
          </p>
        </div>

        {/* TIP 섹션 */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/20 p-6 rounded-xl border border-blue-400/40">
          <h4 className="text-blue-300 text-xl font-bold mb-4">💡 TIP</h4>
          <ul className="text-slate-200 space-y-2">
            <li>• 데드아이의 샷건, 릴데블 기술은 모션이 커서 상대가 피하기 쉽고 데드아이의 기술을 알고 있는 상대와는 전방가드를 주의해서 사용하는 것이 좋다.</li>
            <li>• 데드아이의 석양을 꿰뚫는 일격은 기술 시작 초반에 캔슬이 안된다.</li>
            <li>• 데드아이의 덮쳐오는 죽음의 2타격 시작 시 캔슬이 안된다.</li>
          </ul>
        </div>
      </div>

      {/* 4. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 운영법
        </h2>
        
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mb-6">
          <p className="text-amber-300 text-base font-semibold">
            ※ 클래스 숙련도는 솔라레의 창에서 가장 빠르게 올릴 수 있습니다.
          </p>
        </div>

        {/* 1번째 줄: 거점전(RVR) 운영법 + 길드 리그(소수전) 운영법 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                데드아이는 거점전에서 적진 후방의 원거리 적을 암살하거나, 전방의 근거리 적에게 지속적인 딜 압박을 가할 수 있으며, 외곽에서 꼬장을 하기에도 좋습니다.
              </p>
              <p className="text-slate-200 text-lg leading-relaxed">
                하지만 위 데드아이의 역할과 동일하게 아군 원거리를 암살하려고 들어오는 클래스들에게도 충분히 위협을 받을 수 있습니다.
              </p>
              <p className="text-slate-200 text-lg leading-relaxed">
                따라서 샷건으로 딜 압박을 할 때 약간의 무빙으로 거리를 조절하여 거리에 따라 데미지가 바뀌지 않는 "마르니탄" 샷건으로 끝 사거리만 맞추어 최대한 안정적으로 딜링을 할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 길드 리그(소수전) 운영법 */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 p-6 rounded-xl border border-blue-400/30 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🏆</span>
              </div>
              <h3 className="text-blue-200 text-xl font-bold">길드 리그(소수전) 운영법</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-200 text-lg leading-relaxed">
                길드리그는 팀데스매치로 킬 포인트를 1,000점을 먼저 획득하거나 20분 내에 더 많은 점수를 획득해야 승리할 수 있는 콘텐츠로 효율적인 딜 분배가 필요합니다.
              </p>
              <p className="text-slate-200 text-lg leading-relaxed">
                필요에 따라서 전방 라인의 포커싱을 거점전과 동일하게 할 수 있지만, 대부분의 경우에 빠른 기동력으로 후방의 상대 원거리 딜러 혹은 상대의 주력 딜러를 포커싱합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 2번째 줄: 솔라레의 창 운영법 */}
        <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 p-6 rounded-xl border border-purple-400/30 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">🌟</span>
            </div>
            <h3 className="text-purple-200 text-xl font-bold">솔라레의 창 운영법</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-200 text-lg leading-relaxed">
              거점전, 길드리그의 경우 본인 장비를 그대로 사용하기에 "지구력"에 부담이 없어서 그냥 막써도 지구력이 남습니다. 하지만 솔라레의 창의 경우 전용 장비와 수정을 착용해서 "지구력"이 매우 부족합니다. 즉, 공격과 수비 전환이 굉장히 빠른 데드아이의 장점이 약화될 수 있으며, 이를 보완하기 위해 지구력 관리가 필수적입니다.
            </p>
            
            {/* 그림2.gif */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <div className="flex justify-center mb-3">
                <img 
                  src="/tip-images/그림2.gif" 
                  alt="솔라레의 창 데드아이 운영법" 
                  className="w-full max-w-2xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedImage('/tip-images/그림2.gif')}
                />
              </div>
            </div>
            
            <p className="text-slate-200 text-lg leading-relaxed">
              솔라레의 창에서 데드아이는 상대 주력 딜러와 딜교환을 하지 않으면서 일방적인 딜링과 포커싱을 하는 것이 주 역할입니다.
            </p>
            
            <p className="text-slate-200 text-lg leading-relaxed">
              즉, 상대가 날 보고 있다고 느끼면(살기 감지) 언제든지 이동기를 사용할 준비가 되어있으면서, 상대가 날 놓치고 있다고 느끼면 바로 딜링해주면 됩니다.
            </p>
            
            <p className="text-slate-200 text-lg leading-relaxed">
              일반적으로는 상대에게 무지성으로 갖다 박지 않습니다. 그럼에도 갖다박는 이유는 그게 재밌어서이지 이기려면 갖다 박지 않는 것을 추천드립니다.
            </p>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <p className="text-slate-200 text-base leading-relaxed">
                <strong className="text-purple-300">Ex.</strong> 총잡이 나가신다 – 난장판 으로 뒤잡기 CC를 노릴 수 있지만 오히려 광역 딜링을 하는 클래스가 대응한다면 셀프 백어택을 내어주는 꼴이니까요..
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40">
              <p className="text-amber-300 text-base font-semibold">
                ※ 이제는 후방 기동 포격(에코 궁)의 무적이 삭제되었으니 조금 더 조심해야되긴 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* RVR 구체적인 운영법 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-8 rounded-2xl mt-6 border border-slate-600 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/80 to-orange-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl">⚔️</span>
            </div>
            <h3 className="text-white text-3xl font-bold">RVR 구체적인 운영법</h3>
          </div>
          
          <div className="space-y-8">
            {/* 샷건 운영 */}
            <div className="bg-gradient-to-r from-red-900/20 to-rose-900/10 p-6 rounded-xl border border-red-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🔫</span>
                </div>
                <h4 className="text-red-300 text-xl font-bold">샷건 운영</h4>
              </div>
              <p className="text-slate-200 text-lg leading-relaxed mb-4">
                데드아이의 다대다 PVP 기조는 <strong className="text-red-300">치확 특화를 받아서 [총잡이 나가신다], [덮쳐오는 죽음]의 샷건 딜을 하다가 [가득한 고통]으로 CC 트라이</strong>를 해보며 걸리면 딜을 더하고 안걸리면 5초후에 다시 합니다.
              </p>
              <p className="text-slate-200 text-lg leading-relaxed mb-4">
                적이 백업을 너무 많이 온다 싶으면 <strong className="text-red-300">[미끄러지기] - [후방 기동 포격]으로 쭉 빠지면서 다시 포지셔닝</strong>하면 끝입니다. 안정적인 포지셔닝이된다면 한번씩 릴데블을 퍼부어도 좋습니다.
              </p>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-5 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-3">
                  <span className="text-red-400 text-lg mr-2">💡</span>
                  <p className="text-slate-200 text-lg font-semibold">미끄러지기 활용 패턴</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/50">
                  <p className="text-slate-200 text-base font-medium">
                    <strong className="text-red-300">[미끄러지기] - [총잡이 나가신다] - [미끄러지기] - [덮쳐오는 죽음] - (적이 너무 많이옴 or 적이 날 보고있음) - [미끄러지기] - [후방 기동 포격]</strong>
                  </p>
                </div>
                <p className="text-slate-300 text-sm mt-3 italic">
                  ※ 미끄러지기의 쿨타임이 2초밖에 안되서 슈퍼아머를 유지하는 행위가 없고 이전 공격 스킬의 모션이 끝나기도 전에 쿨타임이 돌아서 편하게 그냥 누르고 있어도 됩니다.
                </p>
              </div>
            </div>

            {/* 릴데블 운영 */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/10 p-6 rounded-xl border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500/80 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🚀</span>
                </div>
                <h4 className="text-blue-300 text-xl font-bold">릴데블 운영</h4>
              </div>
              <p className="text-slate-200 text-lg leading-relaxed mb-4">
                쇠몽둥이 기술 캔슬 외에도 쿨타임 관련 팁이 있습니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-5 rounded-xl border border-slate-500/50 shadow-md">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-400 text-lg mr-2">⏰</span>
                    <h5 className="text-blue-300 font-semibold text-lg">쿨타임 정보</h5>
                  </div>
                  <ul className="text-slate-200 text-base space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">•</span>
                      <span><strong className="text-blue-300">[폭발 도약]</strong>: 10초</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">•</span>
                      <span><strong className="text-blue-300">[개척자]</strong>: 14초</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">•</span>
                      <span><strong className="text-blue-300">[공중 폭격]</strong>: 7초</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-5 rounded-xl border border-slate-500/50 shadow-md">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-400 text-lg mr-2">⚡</span>
                    <h5 className="text-blue-300 font-semibold text-lg">효율적인 사용법</h5>
                  </div>
                  <p className="text-slate-200 text-base">
                    공중에서 딜링하는 스킬의 쿨타임이 7초이기에 굳이 이동기를 같이 쓸 필요가 없습니다.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-5 rounded-xl border border-slate-500/50 shadow-md mb-4">
                <div className="flex items-center mb-3">
                  <span className="text-blue-400 text-lg mr-2">🎯</span>
                  <p className="text-slate-200 text-lg font-semibold">추천 연계</p>
                </div>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong className="text-blue-300">[폭발 도약] - [공중 폭격]</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong className="text-blue-300">[개척자] - [공중 폭격]</strong></span>
                  </li>
                </ul>
                <p className="text-slate-300 text-sm mt-3 italic">
                  ※ 이동기의 쿨타임에 따라 나누고 커맨드로 스킬을 사용해주면 더 빠르게 공중 폭격을 거의 7초마다 안정적으로 사용할 수 있습니다.
                </p>
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-5 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-3">
                  <span className="text-blue-400 text-lg mr-2">🔄</span>
                  <p className="text-slate-200 text-lg font-semibold">실탄 전환 팁</p>
                </div>
                <p className="text-slate-200 text-base">
                  적이 지금 도망가고있고, 현재 마르니탄을 들고 있다면 
                  <strong className="text-blue-300">[미끄러지기] - [총탄 전환]</strong>으로 빠르게 실탄으로 전환하여 릴데블을 쏠 수 있습니다.
                </p>
              </div>
            </div>

            {/* 리볼버 운영 */}
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/10 p-6 rounded-xl border border-green-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500/80 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <h4 className="text-green-300 text-xl font-bold">리볼버 운영</h4>
              </div>
              <p className="text-slate-200 text-lg leading-relaxed mb-4">
                마르니탄 기동사격은 가끔 적과의 거리가 애매하게 너무 위험할때 약간만 뒤로가고 싶을때 혹은 [후방 기동 포격]과 같은 지구력이 많이 드는 스킬을 사용하기 전에 [기동사격]으로 째면서 이동기로 사용하는 경우가 많습니다.
              </p>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-5 rounded-xl border border-slate-500/50 shadow-md mb-4">
                <div className="flex items-center mb-3">
                  <span className="text-green-400 text-lg mr-2">💥</span>
                  <h5 className="text-green-300 font-semibold text-lg">가득한 고통 활용법</h5>
                </div>
                <p className="text-slate-200 text-base mb-3">
                  적의 빈틈이 나타날 타이밍에 맞춰 [가득한 고통]으로 빈틈을 노려줄 수 있습니다.
                </p>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">•</span>
                    <span>좌, 우로 사용하고 커맨드를 유지하면 1타격(cc) 추가로 사용 가능</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">•</span>
                    <span>후방으로 사용시 커맨드를 유지하면 더 많은 거리를 이동하면서 추가 1타격을 사용</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">•</span>
                    <span>후방 사용시 스킬 하나로 2cc까지 넣을 수 있음</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-5 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-3">
                  <span className="text-green-400 text-lg mr-2">⚡</span>
                  <p className="text-slate-200 text-lg font-semibold">추천 연계</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/50">
                  <p className="text-slate-200 text-base font-medium">
                    <strong className="text-green-300">[가득한 고통] - [기동사격] - [미소 짓는 기만] - [신속 사격] - [석양]</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-red-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> PVP 콤보
        </h2>

        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mb-6">
          <p className="text-amber-300 text-base font-semibold">
            ※ 콤보는 실사용을 위해 외우는 것이 아닌, 최소한의 "클래스 이해도를 올리기위해 기술을 연계해보는 것" 그 이상 그 이하도 아닙니다.
          </p>
          <p className="text-amber-300 text-base font-semibold mt-2">
            ※ 즉, 콤보는 상황에 따라 항상 바뀌어서 그대로 쓰는 것이 아니라 클래스에 적응하기 위한 최소 정보로 보시면 좋을 것 같습니다.
          </p>
        </div>

        {/* 그림3.gif */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <div className="flex justify-center mb-4">
            <img 
              src="/tip-images/그림3.gif" 
              alt="데드아이 PVP 콤보" 
              className="w-full max-w-2xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => setSelectedImage('/tip-images/그림3.gif')}
            />
          </div>
        </div>

        {/* 2CC 콤보 */}
        <div className="bg-gradient-to-r from-red-900/20 to-rose-900/10 p-8 rounded-2xl mb-8 border border-red-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/80 to-pink-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl">⚔️</span>
            </div>
            <h3 className="text-red-300 text-3xl font-bold">2CC 콤보</h3>
          </div>
          <p className="text-slate-200 text-lg mb-6 leading-relaxed">
            ※ 적을 마무리하는 콤보라기 보다 안정적으로 딜을 넣는 콤보라고 봐주시면 좋아요.
          </p>
          
          <div className="space-y-6">
            {/* 콤보 1 */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="text-red-300 text-xl font-bold mb-4 flex items-center">
                <span className="bg-red-500/20 px-3 py-1 rounded-full border border-red-400/50 mr-3">
                  <span className="text-red-300 font-bold">1</span>
                </span>
                일반(공속 특화), (1 : 1 상황에서 추천)
              </h4>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-red-300 text-lg font-bold">총잡이 나가신다</div>
                    <div className="text-blue-300 text-sm mt-1">진입기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-red-300 text-lg font-bold">가득한 고통</div>
                    <div className="text-blue-300 text-sm mt-1">기절 1CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-red-300 text-lg font-bold">기동사격(4타격)</div>
                    <div className="text-blue-300 text-sm mt-1">백어택 잡기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-red-300 text-lg font-bold">미소 짓는 기만</div>
                    <div className="text-blue-300 text-sm mt-1">전방가드</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-red-300 text-lg font-bold">신속 사격</div>
                    <div className="text-blue-300 text-sm mt-1">넉다운 2CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-red-300 text-lg font-bold">석양을 꿰뚫는 일격</div>
                    <div className="text-blue-300 text-sm mt-1">마무리</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 콤보 2 */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="text-blue-300 text-xl font-bold mb-4 flex items-center">
                <span className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/50 mr-3">
                  <span className="text-blue-300 font-bold">2</span>
                </span>
                일반(공속 특화), (1 : 1 상황에서 추천)
              </h4>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-blue-300 text-lg font-bold">총잡이 나가신다</div>
                    <div className="text-blue-300 text-sm mt-1">진입기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-blue-300 text-lg font-bold">가득한 고통</div>
                    <div className="text-blue-300 text-sm mt-1">기절 1CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-blue-300 text-lg font-bold">미소 짓는 기만</div>
                    <div className="text-blue-300 text-sm mt-1">전방가드</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-blue-300 text-lg font-bold">속사</div>
                    <div className="text-blue-300 text-sm mt-1">딜링</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-blue-300 text-lg font-bold">신속 사격</div>
                    <div className="text-blue-300 text-sm mt-1">넉다운 2CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-blue-300 text-lg font-bold">석양을 꿰뚫는 일격</div>
                    <div className="text-blue-300 text-sm mt-1">마무리</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 콤보 3 */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="text-green-300 text-xl font-bold mb-4 flex items-center">
                <span className="bg-green-500/20 px-3 py-1 rounded-full border border-green-400/50 mr-3">
                  <span className="text-green-300 font-bold">3</span>
                </span>
                샤이 버프, (1 : 1 상황에서 추천)
              </h4>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-green-300 text-lg font-bold">총잡이 나가신다</div>
                    <div className="text-blue-300 text-sm mt-1">진입기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-green-300 text-lg font-bold">가득한 고통</div>
                    <div className="text-blue-300 text-sm mt-1">기절 1CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-green-300 text-lg font-bold">기동사격(4타격)</div>
                    <div className="text-blue-300 text-sm mt-1">백어택 잡기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-green-300 text-lg font-bold">미소 짓는 기만</div>
                    <div className="text-blue-300 text-sm mt-1">전방가드</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-green-300 text-lg font-bold">속사</div>
                    <div className="text-blue-300 text-sm mt-1">딜링</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-green-300 text-lg font-bold">신속 사격</div>
                    <div className="text-blue-300 text-sm mt-1">넉다운 2CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-green-300 text-lg font-bold">석양을 꿰뚫는 일격</div>
                    <div className="text-blue-300 text-sm mt-1">마무리</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 추가 설명 */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md mt-6">
            <div className="flex items-center mb-4">
              <span className="text-red-400 text-lg mr-2">💡</span>
              <h4 className="text-red-300 font-semibold text-lg">콤보 시작 방법</h4>
            </div>
            <p className="text-slate-200 text-base leading-relaxed">
              <strong className="text-red-300">[총잡이 나가신다]</strong> 혹은 <strong className="text-red-300">[덮쳐오는 죽음]</strong>, <strong className="text-red-300">[기동사격]</strong>를 이동기 또는 짤딜로 쓰다가 <strong className="text-red-300">[가득한 고통]</strong>으로 CC 트라이
            </p>
            <p className="text-slate-200 text-base leading-relaxed mt-2">
              CC 적중시 이후 콤보 시작
            </p>
          </div>
        </div>

        {/* 추가 콤보 */}
        <div className="bg-gradient-to-r from-purple-900/20 to-violet-900/10 p-8 rounded-2xl mb-8 border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/80 to-violet-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="text-purple-300 text-3xl font-bold">추가 콤보</h3>
          </div>
          
          <div className="space-y-6">
            {/* 콤보 4 */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="text-purple-300 text-xl font-bold mb-4 flex items-center">
                <span className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/50 mr-3">
                  <span className="text-purple-300 font-bold">4</span>
                </span>
                일반(공속 특화), (백업 가능한 적이 주변에 있을때)
              </h4>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">총잡이 나가신다</div>
                    <div className="text-blue-300 text-sm mt-1">진입기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">가득한 고통</div>
                    <div className="text-blue-300 text-sm mt-1">기절 1CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">미소 짓는 기만</div>
                    <div className="text-blue-300 text-sm mt-1">전방가드</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">속사</div>
                    <div className="text-blue-300 text-sm mt-1">딜링</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">난장판</div>
                    <div className="text-blue-300 text-sm mt-1">기절 2CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">풍차걸음</div>
                    <div className="text-blue-300 text-sm mt-1">딜링</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">피바람</div>
                    <div className="text-blue-300 text-sm mt-1">딜링</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">미끄러지기</div>
                    <div className="text-blue-300 text-sm mt-1">회피</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-purple-300 text-lg font-bold">후방 기동 포격</div>
                    <div className="text-blue-300 text-sm mt-1">회피</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mt-4">
                <p className="text-slate-200 text-sm">
                  ※ 가득한 고통으로 CC 트라이 → CC 적중시 이후 콤보를 쓰다가 적이 백업 올것 같으면 미끄러지기 + 후방 기동 포격으로 회피
                </p>
              </div>
            </div>

            {/* 콤보 5 */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="text-orange-300 text-xl font-bold mb-4 flex items-center">
                <span className="bg-orange-500/20 px-3 py-1 rounded-full border border-orange-400/50 mr-3">
                  <span className="text-orange-300 font-bold">5</span>
                </span>
                일반(공속 특화), (백업 가능한 적이 주변에 있을때)
              </h4>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">총잡이 나가신다</div>
                    <div className="text-blue-300 text-sm mt-1">진입기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">난장판</div>
                    <div className="text-blue-300 text-sm mt-1">기절 1CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">기동사격(4타격)</div>
                    <div className="text-blue-300 text-sm mt-1">백어택 잡기</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">미소 짓는 기만</div>
                    <div className="text-blue-300 text-sm mt-1">전방가드</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">가득한 고통</div>
                    <div className="text-blue-300 text-sm mt-1">기절 2CC</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">풍차걸음</div>
                    <div className="text-blue-300 text-sm mt-1">딜링</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">피바람</div>
                    <div className="text-blue-300 text-sm mt-1">딜링</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">미끄러지기</div>
                    <div className="text-blue-300 text-sm mt-1">회피</div>
                  </div>
                  <span className="text-yellow-400 text-2xl">→</span>
                  <div className="text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 min-w-[120px]">
                    <div className="text-orange-300 text-lg font-bold">후방 기동 포격</div>
                    <div className="text-blue-300 text-sm mt-1">회피</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mt-4">
                <p className="text-slate-200 text-sm">
                  ※ 첫 CC를 난장판으로 트라이하고 CC가 걸리면 약간의 딜 이후 후퇴 준비. 첫 난장판으로 안걸리면 기동사격으로 후퇴하거나 체력이 많이 빠질것 같으면 바로 후방 기동 포격으로 후퇴.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 콤보 영상 */}
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 mb-8">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">콤보 영상</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <img 
                src="/tip-images/그림4.gif" 
                alt="데드아이 진입기 1" 
                className="w-full max-w-2xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage('/tip-images/그림4.gif')}
              />
            </div>
            <div className="flex justify-center">
              <img 
                src="/tip-images/그림5.gif" 
                alt="데드아이 진입기 2" 
                className="w-full max-w-2xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage('/tip-images/그림5.gif')}
              />
            </div>
          </div>
        </div>

        {/* 주로 사용하는 진입기 */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/10 p-8 rounded-2xl mb-8 border border-cyan-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/80 to-blue-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h3 className="text-cyan-300 text-3xl font-bold">주로 사용하는 진입기</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/50">
                  <span className="text-cyan-300 font-bold text-lg">1</span>
                </div>
                <p className="text-cyan-300 font-semibold text-lg">미끄러지기 – 총잡이 나가신다</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/50">
                  <span className="text-cyan-300 font-bold text-lg">2</span>
                </div>
                <p className="text-cyan-300 font-semibold text-lg">미끄러지기 – 덮쳐오는 죽음</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/50">
                  <span className="text-cyan-300 font-bold text-lg">3</span>
                </div>
                <p className="text-cyan-300 font-semibold text-lg">미끄러지기 - 후방 기동 포격</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/50">
                  <span className="text-cyan-300 font-bold text-lg">4</span>
                </div>
                <p className="text-cyan-300 font-semibold text-lg">미끄러지기 – 폭발 도약</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/50">
                  <span className="text-cyan-300 font-bold text-lg">5</span>
                </div>
                <p className="text-cyan-300 font-semibold text-lg">미끄러지기 – 기동사격</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 기술 캔슬 시스템 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚡</span> 기술 캔슬 시스템
        </h2>
        
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mb-6">
          <p className="text-amber-300 text-base font-semibold">
            ※ 기술 캔슬은 데드아이의 핵심 메커니즘으로, 선딜을 제거하여 더 빠르고 효율적인 전투가 가능합니다.
            </p>
          </div>

        <div className="space-y-8">
          {/* 쇠몽둥이 선딜 캔슬 */}
          <div className="bg-gradient-to-r from-red-900/20 to-rose-900/10 p-8 rounded-2xl border border-red-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🔨</span>
        </div>
              <h3 className="text-red-300 text-3xl font-bold">1. 쇠몽둥이 선딜 캔슬</h3>
            </div>
            <p className="text-slate-200 text-lg mb-6 leading-relaxed">
              쇠몽둥이는 그냥 사용하면 선딜이 너무 길어서 몇몇 스킬을 앞에 사용하면 선딜이 캔슬됩니다.
            </p>
            
            {/* 쇠몽둥이 캔슬 비교 비디오 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center">
                <h5 className="text-red-300 font-semibold text-lg mb-3">쇠몽둥이 캔슬 전</h5>
                <video 
                  className="w-full max-w-xl mx-auto rounded-lg border border-slate-500 shadow-lg"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/tip-images/쇠몽둥이캔슬전.mp4" type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
              <div className="text-center">
                <h5 className="text-red-300 font-semibold text-lg mb-3">쇠몽둥이 캔슬 후</h5>
                <video 
                  className="w-full max-w-xl mx-auto rounded-lg border border-slate-500 shadow-lg"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/tip-images/쇠몽둥이캔슬후.mp4" type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-red-400 text-lg mr-2">⚡</span>
                  <h4 className="text-red-300 font-semibold text-lg">기본 캔슬 스킬</h4>
                </div>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span>폭발 도약 → 쇠몽둥이</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span>공중 폭격 → 쇠몽둥이</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span>파괴의 미학 → 쇠몽둥이</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span>정밀 사격 → 쇠몽둥이</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span>로켓 작열 → 쇠몽둥이</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-red-400 text-lg mr-2">⭐</span>
                  <h4 className="text-red-300 font-semibold text-lg">추천 캔슬 스킬</h4>
                </div>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span><strong className="text-red-300">미끄러지기 → 쇠몽둥이</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span><strong className="text-red-300">총잡이 나가신다(리볼버까지) → 쇠몽둥이</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-400">•</span>
                    <span><strong className="text-red-300">덮쳐오는 죽음(1타격까지) → 쇠몽둥이</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
              <div className="flex items-center justify-center mb-4">
                <span className="text-red-400 text-lg mr-2">🚀</span>
                <h4 className="text-red-300 font-semibold text-lg">릴데블 연계 (빠르게 쏘기)</h4>
              </div>
              
              {/* 릴데블연계.mp4 비디오 */}
              <div className="mb-6">
                <video 
                  className="w-full max-w-2xl mx-auto rounded-lg border border-slate-500 shadow-lg"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/tip-images/릴데블연계.mp4" type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
              
              {/* 스킬 연계 표시 */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-red-300 font-bold text-lg">영상 콤보 : </span>
                  <span className="text-red-300 font-bold text-lg">[폭발 도약]</span>
                  <span className="text-yellow-400 text-xl">→</span>
                  <span className="text-red-300 font-bold text-lg">[공중 폭격]</span>
                  <span className="text-yellow-400 text-xl">→</span>
                  <span className="text-red-300 font-bold text-lg">[쇠몽둥이]</span>
                  <span className="text-yellow-400 text-xl">→</span>
                  <span className="text-red-300 font-bold text-lg">[로켓 작열]</span>
                  <span className="text-yellow-400 text-xl">→</span>
                  <span className="text-red-300 font-bold text-lg">[정밀 사격]</span>
                </div>
              </div>
              
              <ul className="text-slate-200 text-base space-y-2 text-center">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-red-400">•</span>
                  <span>미끄러지기 → 쇠몽둥이 → 로켓 작열 → 정밀 사격</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-red-400">•</span>
                  <span>로켓 작열 → 정밀 사격 → 쇠몽둥이</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 속사 선딜 캔슬 */}
          <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/10 p-8 rounded-2xl border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-blue-300 text-3xl font-bold">2. 속사 선딜 캔슬</h3>
            </div>
            <p className="text-slate-200 text-lg mb-6 leading-relaxed">
              속사를 그냥 쓰면 오른손으로 총을 돌리는 모션이 추가되어 느려집니다. 몇몇 스킬을 앞에 사용하면 선딜이 캔슬됩니다.
            </p>
            
            {/* 속사 캔슬 비교 비디오 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <h5 className="text-blue-300 font-semibold text-lg mb-3">속사 캔슬 전</h5>
                <video 
                  className="w-full max-w-xl mx-auto rounded-lg border border-slate-500 shadow-lg"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/tip-images/속사캔슬전.mp4" type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
              <div className="text-center">
                <h5 className="text-blue-300 font-semibold text-lg mb-3">속사 캔슬 후</h5>
                <video 
                  className="w-full max-w-xl mx-auto rounded-lg border border-slate-500 shadow-lg"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/tip-images/속사캔슬후.mp4" type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
                {/* 영상 콤보 표시 */}
                <div className="mt-3">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-blue-300 font-bold text-lg">영상 콤보 : </span>
                    <span className="text-blue-300 font-bold text-lg">[미끄러지기]</span>
                    <span className="text-yellow-400 text-xl">-</span>
                    <span className="text-blue-300 font-bold text-lg">[속사]</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-blue-400 text-lg mr-2">⭐</span>
                  <h4 className="text-blue-300 font-semibold text-lg">추천 캔슬 스킬</h4>
                </div>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong className="text-blue-300">미소 짓는 기만 → 속사</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong className="text-blue-300">숨겨진 카드 → 속사</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong className="text-blue-300">가득한 고통 → 속사</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong className="text-blue-300">미끄러지기 → 속사</strong></span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-blue-400 text-lg mr-2">📋</span>
                  <h4 className="text-blue-300 font-semibold text-lg">기타 캔슬 스킬</h4>
                </div>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>신속 사격 → 속사</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>회피 사격 → 속사</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>흐름:연사 → 속사</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>뜨거운 숨결(라밤) → 속사</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>떨어지는 죽음(라밤) → 속사</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>커너리의 선물 → 속사</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 석양 선딜 캔슬 */}
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/10 p-8 rounded-2xl border border-yellow-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">☀️</span>
              </div>
              <h3 className="text-yellow-300 text-3xl font-bold">3. 석양 선딜 캔슬</h3>
            </div>
            <p className="text-slate-200 text-lg mb-6 leading-relaxed">
              석양을 꿰뚫는 일격의 선딜을 캔슬할 수 있는 스킬들입니다.
            </p>
            
            {/* 석양 캔슬 비디오 */}
            <div className="mb-6 text-center">
              <h5 className="text-yellow-300 font-semibold text-lg mb-3">석양 캔슬</h5>
              <video 
                className="w-full max-w-2xl mx-auto rounded-lg border border-slate-500 shadow-lg"
                controls
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/tip-images/석양캔슬.mp4" type="video/mp4" />
                브라우저가 비디오를 지원하지 않습니다.
              </video>
              {/* 영상 콤보 표시 */}
              <div className="mt-3">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-yellow-300 font-bold text-lg">영상 콤보 : </span>
                  <span className="text-yellow-300 font-bold text-lg">[미끄러지기]</span>
                  <span className="text-yellow-400 text-xl">-</span>
                  <span className="text-yellow-300 font-bold text-lg">[속사]</span>
                  <span className="text-yellow-400 text-xl">-</span>
                  <span className="text-yellow-300 font-bold text-lg">[석양]</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 text-lg mr-2">⭐</span>
                  <h4 className="text-yellow-300 font-semibold text-lg">추천 캔슬 스킬</h4>
          </div>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">•</span>
                    <span><strong className="text-yellow-300">속사 → 석양</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">•</span>
                    <span><strong className="text-yellow-300">신속사격 → 석양</strong></span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 text-lg mr-2">📋</span>
                  <h4 className="text-yellow-300 font-semibold text-lg">기타 캔슬 스킬</h4>
                </div>
                <ul className="text-slate-200 text-base space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>별빛 축포 → 석양</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>뜨거운 숨결(라밤) → 석양</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-6 rounded-xl border border-amber-400/40 shadow-md">
              <div className="flex items-center mb-3">
                <span className="text-yellow-400 text-lg mr-2">⚠️</span>
                <p className="text-slate-200 text-lg font-semibold">중요한 팁</p>
              </div>
              <p className="text-slate-200 text-base leading-relaxed">
                <strong className="text-yellow-300">미끄러지기 → 석양</strong>은 석양의 선딜 캔슬이 안되므로, 
                <strong className="text-yellow-300">미끄러지기 → 속사 → 석양</strong> 연계가 안전하고 빠르게 석양을 쓸 수 있습니다.
              </p>
            </div>
          </div>

          {/* 총잡이 나가신다 캔슬 */}
          <div className="bg-gradient-to-r from-purple-900/20 to-violet-900/10 p-8 rounded-2xl border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-purple-300 text-3xl font-bold">4. 총잡이 나가신다 캔슬</h3>
            </div>
            <p className="text-slate-200 text-lg mb-6 leading-relaxed">
              <span className="text-purple-300 font-semibold text-2xl">[총잡이 나가신다]</span>의 마지막 샷건 모션은 아래의 기술로 캔슬할 수 있다.
            </p>
            
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-500/50 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 가득한 고통</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 덮쳐오는 죽음</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 폭발 도약</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 기동사격</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 난장판</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 풍차걸음</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 개척자</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 커너리의 선물</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span className="font-semibold text-slate-300 text-lg">총잡이 나가신다 – 쇠몽둥이</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 디테일 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-cyan-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🔧</span> 디테일
        </h2>
        
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-8 rounded-2xl border border-slate-600 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/80 to-blue-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl">🔧</span>
            </div>
          <div>
              <p className="text-slate-200 text-xl leading-relaxed font-semibold">
                데드아이의 각 기술의 모든 연계와 세부 사항을 살펴봅니다.
              </p>
              <p className="text-slate-300 text-base mt-2 italic">
                ※ 문서화하지 않은 상태로 앉은 자리에서 생각나는 것을 작성한 것이라 빠진 부분이 있을 수 있습니다.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/10 p-8 rounded-2xl border border-cyan-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-400/50 shadow-md">
                  <span className="text-cyan-300 font-bold text-xl">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-xl leading-relaxed">
                    <span className="text-cyan-300 font-semibold text-2xl">[폭발 도약]</span>은 마르니탄이 더 높이 뛴다. 여기서 더 높이 뛰려면 점프한 상태에서 Q를 입력하면 더 높이 뛴다.
                  </p>
          </div>
        </div>
      </div>

            <div className="bg-gradient-to-r from-red-900/20 to-rose-900/10 p-8 rounded-2xl border border-red-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 px-4 py-2 rounded-full border border-red-400/50 shadow-md">
                  <span className="text-red-300 font-bold text-xl">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-xl leading-relaxed">
                    <span className="text-red-400 font-semibold text-2xl">"실탄"</span> 샷건은 거리에 따라 데미지가 달라진다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/10 p-8 rounded-2xl border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/50 shadow-md">
                  <span className="text-blue-300 font-bold text-xl">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-xl leading-relaxed">
                    <span className="text-blue-400 font-semibold text-2xl">"마르니탄"</span> 샷건은 거리에 상관없이 최대 데미지이다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/10 p-8 rounded-2xl border border-green-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-400/50 shadow-md">
                  <span className="text-green-300 font-bold text-xl">4</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-xl leading-relaxed">
                    <span className="text-green-300 font-semibold text-2xl">[기동사격]</span>은 최소 4타격이며, 최대 8타격까지 사용할 수 있다.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 지구력 관리 팁 */}
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/10 p-8 rounded-2xl border border-green-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-400/50 shadow-md">
                  <span className="text-green-300 font-bold text-xl">5</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-xl leading-relaxed mb-6">
                    <span className="text-green-300 font-semibold text-2xl">지구력 관리 팁</span> (솔라레의 창에서 중요)
                  </p>
                  <ul className="text-slate-300 text-lg space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-green-300 font-bold">[폭발 도약]</span> - <span className="text-green-300 font-bold">[개척자]</span>로 사용한 지구력을 <span className="text-green-300 font-bold">[개척자]</span> 사용 중 <span className="text-green-300 font-bold">[공중 폭격]</span>을 사용하면 <span className="text-green-300 font-bold">[공중 폭격]</span>의 슈퍼아머 판정이 지속되는 동안 소모한 지구력이 모두 회복</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-green-300 font-bold">[폭발 도약]</span> - <span className="text-green-300 font-bold">[공중 폭격]</span>을 사용하면 착지 시점부터 지구력이 회복</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-green-300 font-bold">[후방 기동포격]</span>을 사용하면 착지 시점부터 지구력이 회복</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-green-300 font-bold">[가득한 고통]</span> 사용시 모션이 진행되는 동안 지구력이 회복되지 않음. 그리고 이 모션은 슈퍼아머가 끝나도 오랫동안 지속</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-green-300 font-bold">[총잡이 나가신다]</span> 샷건 타격 이후 지구력이 회복</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-green-300 font-bold">[덮쳐오는 죽음]</span> 사용 시 1타격이 끝난 후, 샷건 모션이 시작되면서 지구력이 회복</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-green-300 font-bold">[난장판]</span>은 지구력이 소모되지 않는 이동기, 딜링기, CC기이자 낙하 모션이 발동되지 않는 스킬</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 고급 팁들 */}
            <div className="bg-gradient-to-r from-purple-900/20 to-violet-900/10 p-8 rounded-2xl border border-purple-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/50 shadow-md">
                  <span className="text-purple-300 font-bold text-xl">6</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-xl leading-relaxed mb-6">
                    <span className="text-purple-300 font-semibold text-2xl">고급 팁들</span>
                  </p>
                  <ul className="text-slate-300 text-lg space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold">공중에 가장 오랫동안 머무는 콤보는 <span className="text-purple-300 font-bold">[폭발 도약]</span> - <span className="text-purple-300 font-bold">[개척자]</span> - <span className="text-purple-300 font-bold">[공중 폭격]</span></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold">마르니탄이 실탄보다 범위가 더 크다</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-purple-300 font-bold">[후방 기동 포격]</span>의 마지막 도약 모션은 낙하 모션을 발동시키지 않는다</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-purple-300 font-bold">[난장판]</span>, <span className="text-purple-300 font-bold">[풍차걸음]</span>, <span className="text-purple-300 font-bold">[총탄 폭풍]</span>, <span className="text-purple-300 font-bold">[제압 사격]</span>은 낙하 모션을 발동시키지 않는다</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold"><span className="text-purple-300 font-bold">[릴데블]</span>은 실탄 투사체의 속도가 마르니탄보다 훨씬 빠르다</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold">리볼버 실탄은 첫 에임만 맞고 에임이 너무 벗어나지 않는 이상 조준 도우미의 영향을 받아 유도탄이 된다</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold">실탄 <span className="text-purple-300 font-bold">[릴데블]</span>은 범위가 좁아서 분산딜의 영향이 상대적으로 적기에 사실상 딜이 더 쌔다 (피해량 자체도 실탄이 더 쌔다)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl mt-1">•</span>
                      <span className="font-semibold">마르니탄의 <span className="text-purple-300 font-bold">[별빛축포]</span>가 실탄보다 모션이 훨씬 빨라서 급하게 전방가드를 사용할때 좋다</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> 7. 거점/솔라레의 창/길드 리그 특화 및 수정
        </h2>
        
        {/* 특화 */}
        <div className="mb-8">
          <h3 className="text-purple-300 text-2xl font-bold mb-4">특화</h3>
          <div className="bg-slate-700/50 p-6 rounded-xl mb-4 border border-slate-600">
            <div className="flex justify-center mb-4">
              <img 
                src="/tip-images/데드아이특화.png" 
                alt="데드아이 특화" 
                className="w-full max-w-2xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage('/tip-images/데드아이특화.png')}
              />
            </div>
            <p className="text-slate-200 text-center text-lg leading-relaxed mb-6">
              특화는 거의 맨날 바뀌어서 솔라레의 창 랭킹에서 찾아서 보시는걸 추천 드립니다! 10월23일 기준 이렇게 쓰고 있습니다
            </p>
            
            {/* 특화 설명 */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-slate-600/50 p-4 rounded-lg">
                    <h5 className="text-red-300 text-lg font-semibold mb-2">총잡이 나가신다</h5>
                    <p className="text-slate-200 text-base">진입기 + 주력 특화(치명타 확률) 버프 수급 + 딜 압박</p>
                  </div>
                  <div className="bg-slate-600/50 p-4 rounded-lg">
                    <h5 className="text-red-300 text-lg font-semibold mb-2">가득한 고통</h5>
                    <p className="text-slate-200 text-base">변수 창출 + 기절 cc로 뒤잡기</p>
                  </div>
                  <div className="bg-slate-600/50 p-4 rounded-lg">
                    <h5 className="text-red-300 text-lg font-semibold mb-2">미소 짓는 기만</h5>
                    <p className="text-slate-200 text-base">전방가드로 버티면서 효율적인 딜교환을 위함</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-600/50 p-4 rounded-lg">
                    <h5 className="text-red-300 text-lg font-semibold mb-2">기동사격</h5>
                    <p className="text-slate-200 text-base">효율적인 딜교환을 위한 가장 높은 우선순위의 특화 버프</p>
                  </div>
                  <div className="bg-slate-600/50 p-4 rounded-lg">
                    <h5 className="text-red-300 text-lg font-semibold mb-2">난장판</h5>
                    <p className="text-slate-200 text-base">주력 딜링+진입+cc기로써 상대의 반응응 가능한 공격속도를 낮추기 위함+이동속도</p>
                  </div>
                  <div className="bg-slate-600/50 p-4 rounded-lg">
                    <h5 className="text-red-300 text-lg font-semibold mb-2">공중 폭격</h5>
                    <p className="text-slate-200 text-base">공중에서 안정적으로 특화 버프를 수급할 수 있어서 주력 딜링 특화(치명타 확률) + 안정성(방어력) 특화 버프</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수정 */}
        <div>
          <h3 className="text-purple-300 text-2xl font-bold mb-4">수정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
              <div className="flex justify-center">
                <img 
                  src="/tip-images/데드아이수정1.png" 
                  alt="데드아이 수정 1" 
                  className="w-full max-w-xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedImage('/tip-images/데드아이수정1.png')}
                />
              </div>
            </div>
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
              <div className="flex justify-center">
                <img 
                  src="/tip-images/데드아이수정2.png" 
                  alt="데드아이 수정 2" 
                  className="w-full max-w-xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedImage('/tip-images/데드아이수정2.png')}
                />
              </div>
            </div>
          </div>
          <p className="text-slate-200 text-lg  leading-relaxed text-center">
            수정은 취향 차이입니다. 저는 훔을 더 선호하는 편 입니다
            </p>
          </div>

      </div>

      {/* 8. 하고싶은 말 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-yellow-500 mb-8">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고싶은 말
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <div className="space-y-4">
            <p className="text-slate-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">09/24, 데드아이의 릴데블 관련 패치</strong>
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">10/22, 데드아이의 방어판정 추가적인 패치</strong>
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              데드아이의 성능 관련해서 변경점들이 많았습니다.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              제 생각에는 아직 준수한 딜러로써 활동가능한 클래스 같습니다.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              거점전과 길드리그에서는 여전히 주력 딜러일 것이고, 솔라레의 창의 경우 전 시즌 기준 성능이 약간 내려왔다고 볼 수 있으나 주변 클래스 들(각성 세이지, 전승 하사신)도 너프가 이루어졌으며, 잡기 또한 너프를 당해서 이전과 똑같다고 생각합니다.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              즉, 이번 패치로 데드아이 클래스의 성능의 저점은 살짝 내려왔으나 고점은 그대로이고 여전히 좋다.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              그럼 마스터 클래스 파이팅입니다.
            </p>
            
            {/* 무슨말.png 이미지 */}
            <div className="flex justify-center mt-6 mb-4">
              <img 
                src="/tip-images/무슨말.png" 
                alt="무슨말" 
                className="w-full max-w-2xl h-auto rounded-lg border border-slate-500 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage('/tip-images/무슨말.png')}
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <p className="text-slate-300 text-sm text-center">
              검은사막 인벤, 데드아이 게시판 PVP가이드를 참고해도 좋습니다.
            </p>
            <p className="text-blue-400 text-sm text-center mt-2">
              <a href="https://www.inven.co.kr/board/black/6337/498" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 underline">
                https://www.inven.co.kr/board/black/6337/498
              </a>
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