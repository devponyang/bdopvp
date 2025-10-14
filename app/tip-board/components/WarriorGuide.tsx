'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function WarriorGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/18', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_18')
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
        await fetch('/api/tip-board/18/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/18/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_18', 'true')
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
            <img src="/class-icons/musa.png" alt="무사" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              전승 무사 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "한 줄기 바람이 되어, 칼끝으로 세계를 가른다."
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
          src="/tip-images/musapick.JPG" 
          alt="전승 무사" 
          className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setSelectedImage('/tip-images/musapick.JPG')}
        />
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
              <span className="text-gray-300">작성자:</span> <Link href="/guild/Ctrl" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">Ctrl</Link> 길드 <span className="text-blue-400 font-bold">분야</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 rounded-lg shadow-lg">
              <span className="text-xl">🏆</span>
              <p className="text-yellow-300 font-bold text-sm">
                솔라레의 창 - 무사 랭킹 1위
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
          안녕하세요 무제한 공거점 <strong>Ctrl</strong> 길드에서 전승 무사를 주력으로 플레이하고 있는 <strong>분야</strong>입니다.
        </p>
      </div>

      {/* 1.5 전승무사의 메커니즘 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-cyan-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> 전승 무사의 메커니즘
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">✨</span> "고요한 정신" (패시브)
          </h3>
          
          <div className="flex justify-center mb-4">
            <img 
              src="/tip-images/goyo.JPG" 
              alt="고요한 정신" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/goyo.JPG')}
            />
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-cyan-400 mb-4">
            <p className="text-slate-200 text-lg mb-3">
              <strong className="text-cyan-300">획득:</strong> 고요한 정신을 획득하는 스킬 사용
            </p>
            <p className="text-slate-200 text-lg">
              <strong className="text-cyan-300">효과:</strong> 고요한 정신으로 <strong className="text-yellow-300">개화, 격풍, 용오름화, 용염진</strong>을 쿨타임 중 사용 가능 (무쿨기)
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40">
            <h4 className="text-red-300 text-xl font-bold mb-3">🔥 사냥 겸 무지성 딜링 콤보</h4>
            <p className="text-gray-300 text-sm mb-3">
              (짱쿠 장인초대석 전승무사편 흉살 참조)
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-red-500 font-mono text-sm leading-relaxed mb-4">
              <p className="text-slate-200">
                <strong className="text-blue-300">각수</strong> → <strong className="text-green-300">태풍</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-yellow-300">파훼</strong> → <strong className="text-pink-300">참수</strong> → <strong className="text-cyan-300">개화</strong> → <strong className="text-orange-300">격풍</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-red-300">용오름</strong> → <strong className="text-blue-300">태산가르기</strong> → <strong className="text-orange-300">격풍</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-yellow-300">역극</strong> → <strong className="text-orange-300">격풍</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-pink-300">장님가르기</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-cyan-300">개화</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-green-300">장님찌르기</strong> → <strong className="text-orange-300">격풍</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-yellow-300">강가름 1타</strong> (두번 베는 모션) → <strong className="text-cyan-300">개화</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-yellow-300">역극</strong> → <strong className="text-orange-300">격풍</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-blue-300">후퇴베기</strong> → <strong className="text-orange-300">격풍</strong> → <strong className="text-purple-300">선풍참</strong> → <strong className="text-blue-300">각수</strong> → <strong className="text-green-300">태풍</strong> → <strong className="text-cyan-300">개화</strong> → <strong className="text-purple-300">선풍참</strong> → (파훼부터 반복)
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="text-slate-200 text-lg mb-2">
                <strong className="text-yellow-400">💡 중요:</strong> 전승 무사로 PVP하기 이전에 <strong className="text-yellow-300">무지성 딜링 콤보를 자유결투장 허수아비로 연습</strong>하셔야 합니다.
              </p>
              <p className="text-slate-200 text-lg mb-2">
                <strong className="text-red-400">"머슬메모리 장착 필수"</strong>
              </p>
              <p className="text-slate-200 text-lg">
                귀찮아도 머슬메모리로 익히셔야 어떤 상황에서든 딜을 욱여넣고 콤보를 이어나갈 수 있습니다.
                <br/><span className="text-white">(저도 이 콤보로 자유결투장에서 1시간씩 연습했습니다.)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 전승 무사 클래스의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="space-y-3 text-slate-200 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">▸</span>
              <span><strong className="text-green-400">2.7cc 기반</strong>으로 콤보를 길게 가져갈 수 있습니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">▸</span>
              <span><strong className="text-green-400">DPS가 높습니다.</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">▸</span>
              <span><strong className="text-green-400">기동성이 좋습니다.</strong> 무사의 이동스킬인 <strong>추격</strong>으로 진입/이탈이 좋고 포지션도 다양하게 잡을 수 있습니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">▸</span>
              <span>스킬들이 <strong className="text-green-400">스피디해서 짧은 시간 안에 강한 누킹딜</strong>을 넣을 수 있습니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">▸</span>
              <span>스킬들의 <strong className="text-green-400">선딜이 짧은 편</strong>이라 상대의 노림수를 카운터치기 좋습니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">▸</span>
              <span><strong className="text-green-400">고점이 높습니다.</strong></span>
            </li>
          </ul>
        </div>

        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">❌</span> 단점
          </h3>
          <ul className="space-y-3 text-slate-200 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-red-400 text-xl mt-1">▸</span>
              <span><strong className="text-red-400">몸이 약하고</strong> 슈아 기반 캐릭터로 <strong className="text-red-400">비비기 싸움에 취약</strong>합니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 text-xl mt-1">▸</span>
              <span><strong className="text-red-400">슈아 CC기가 없습니다.</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 text-xl mt-1">▸</span>
              <span>슈아 CC기가 없고 <strong className="text-red-400">잡기가 없어 플레이메이킹이 힘듭니다.</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 text-xl mt-1">▸</span>
              <span><strong className="text-red-400">상대하는 직업의 이해도가 있어야</strong> 전승 무사의 성능이 나옵니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 text-xl mt-1">▸</span>
              <span><strong className="text-red-400">유틸기와 무적스킬이 빈약</strong>하여 안정성이 떨어집니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 text-xl mt-1">▸</span>
              <span><strong className="text-red-400">저점이 낮습니다.</strong></span>
            </li>
          </ul>
        </div>

        {/* 전승무사 핵심 */}
        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-6 rounded-xl shadow-xl border-2 border-yellow-500">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="text-yellow-300 text-2xl font-bold mb-3">전승 무사 핵심!</h3>
              <p className="text-slate-200 text-lg leading-relaxed">
                좋은 기동력과 강한 딜로 상대를 압박하고 빈틈을 유도하는 플레이를 하시면 캐릭터의 고점을 뽑을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-green-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 거점(RVR) / 솔라레 / 길드리그 운영법
        </h2>
        
        {/* 거점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 거점(RVR)
          </h3>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            본대와 떨어져 <strong className="text-yellow-300">사이드에서 상대 딜러들 암살</strong>하는 게 좋습니다.
            <br/><span className="text-gray-400">(꼬장조 가시는 게 좋습니다.)</span>
          </p>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="text-red-300 text-xl font-bold mb-2">핵심 운영</h4>
            <p className="text-slate-200 text-lg">
              <strong className="text-cyan-300">Q가드로 간을 보다</strong> 상태이상이 걸린 적 또는 무방비한 적에게 
              <strong className="text-red-300"> 빠르게 딜을 욱여넣어 암살</strong>하는 플레이를 반복하면 됩니다.
            </p>
          </div>
        </div>

        {/* 솔라레 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 솔라레의 창 (소수전)
          </h3>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-cyan-400 mb-4">
            <h4 className="text-cyan-300 text-xl font-bold mb-2">핵심 운영</h4>
            <p className="text-slate-200 text-lg">
              상대의 <strong className="text-yellow-300">빈틈을 유도해 카운터치고</strong> 
              <strong className="text-red-300"> 강한 누킹딜로 압박</strong>하시면 좋습니다.
            </p>
          </div>
          
          <p className="text-slate-200 text-lg mb-4">
            대략적인 운영은 아래 영상을 참고하세요.
          </p>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/ptQIeGnRs4A"
              title="전승 무사 솔라레 플레이"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>

        {/* 길드리그 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-purple-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🛡️</span> 길드리그
          </h3>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-purple-400 mb-4">
            <h4 className="text-purple-300 text-xl font-bold mb-2">핵심 운영</h4>
            <p className="text-slate-200 text-lg">
              길드 전략에 맞춰 <strong className="text-yellow-300">언제든지 딜 지원이 가능한 포지션</strong>에 있어야 합니다.
            </p>
          </div>
          
          <p className="text-slate-200 text-lg mb-4">
            대략적인 운영은 아래 영상을 참고하세요.
          </p>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/pJqJ3aJsXQA"
              title="전승 무사 길드리그 플레이"
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
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-600/40 mb-6">
            <p className="text-slate-200 text-xl font-bold text-center mb-2">
              전승 무사는 콤보랄 게 딱히 없습니다.
            </p>
            <p className="text-cyan-300 text-lg text-center">
              그때그때 <strong>"상황에 맞춰 스킬을 욱여넣는 게 중요합니다."</strong>
            </p>
          </div>

          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔥</span> 대표 콤보
          </h3>
          
          {/* 2.7cc 콤보 1 */}
          <div className="bg-slate-600/50 p-5 rounded-xl mb-4 border-l-4 border-red-500">
            <h4 className="text-red-300 text-xl font-bold mb-3">2.7cc - 편전 시작</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-red-500 font-mono text-sm mb-3">
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-blue-300">편전</strong> (경직) → 
                <strong className="text-green-300"> 각수</strong> (띄우기) → 
                <strong className="text-cyan-300"> 개화</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-yellow-300"> 용오름화</strong> → 
                <strong className="text-purple-300"> 돌아차기</strong> (넉다운) → 
                <strong className="text-pink-300"> 장님가르기</strong> → 
                <strong className="text-blue-300"> 선풍참</strong> → 
                <strong className="text-cyan-300"> 개화</strong> → 
                <strong className="text-blue-300"> 선풍참</strong> → 
                <strong className="text-yellow-300"> 역극</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-green-300"> 태산가르기</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-blue-300"> 선풍참</strong>
              </p>
            </div>
          </div>

          {/* 2.7cc 콤보 2 */}
          <div className="bg-slate-600/50 p-5 rounded-xl mb-4 border-l-4 border-orange-500">
            <h4 className="text-orange-300 text-xl font-bold mb-3">2.7cc - 편전 + 역극</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-orange-500 font-mono text-sm mb-3">
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-blue-300">편전</strong> (경직) → 
                <strong className="text-yellow-300"> 역극</strong> (기절) → 
                <strong className="text-purple-300"> 빽추 </strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-cyan-300"> 개화</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-purple-300"> 돌아차기</strong> (넉다운) 후 위 콤보와 동일
              </p>
            </div>
          </div>

          {/* 2.7cc 콤보 3 */}
          <div className="bg-slate-600/50 p-5 rounded-xl mb-4 border-l-4 border-yellow-500">
            <h4 className="text-yellow-300 text-xl font-bold mb-3">2.7cc - 역극 시작</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-yellow-500 font-mono text-sm mb-3">
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-yellow-300">역극</strong> (기절) → 
                <strong className="text-blue-300"> 빽추 </strong> → 
                <strong className="text-cyan-300"> 개화</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-blue-300"> 빽추</strong> → 
                <strong className="text-green-300"> 장님찌르기</strong> (경직) → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-blue-300"> 용오름</strong> (용오름화 X) → 
                <strong className="text-purple-300"> 돌아차기</strong> (넉다운) 후 위 콤보와 동일
              </p>
            </div>
          </div>

          {/* 슈아 콤보 */}
          <div className="bg-slate-600/50 p-5 rounded-xl border-l-4 border-cyan-500">
            <h4 className="text-cyan-300 text-xl font-bold mb-3">슈아 콤보 (짤딜용)</h4>
            
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-cyan-500 font-mono text-sm mb-3">
              <p className="text-slate-200 leading-relaxed mb-2">
                <strong className="text-yellow-300">역극</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-green-300"> 태산</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-blue-300"> 용오름화 or 후퇴베기</strong> → 
                <strong className="text-orange-300"> 격풍</strong>
              </p>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-cyan-500 font-mono text-sm">
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-blue-300">각수</strong> → 
                <strong className="text-cyan-300"> 개화</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-green-300"> 태산가르기</strong> → 
                <strong className="text-orange-300"> 격풍</strong> → 
                <strong className="text-blue-300"> 용오름화 or 후퇴베기</strong> → 
                <strong className="text-orange-300"> 격풍</strong>
              </p>
            </div>
            
            <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-cyan-400 mt-4">
              <p className="text-slate-200 text-base">
                <strong className="text-cyan-400">💡 참고:</strong> 용오름화는 후딜이 긴 스킬이기 때문에 상황을 보고 쓰시는 게 좋습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4.5 진입기/시동기 활용법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🚀</span> 진입기 / 1cc 시동기 활용법
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-indigo-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 주요 진입기 및 1cc 시동기
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-indigo-400">
              <p className="text-slate-200 text-lg mb-3">
                진입기 및 1cc 시동기: <strong className="text-cyan-300">파훼</strong>, <strong className="text-yellow-300">역극</strong>, <strong className="text-blue-300">각수</strong>
              </p>
              <p className="text-slate-200 text-lg">
                <strong className="text-red-400">각수는 맨몸</strong>이기에 
                <strong className="text-cyan-300"> 각수 → 개화 → 격풍</strong>으로 맨몸을 가려주는 게 좋습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💎</span> PvP 특화 및 수정
        </h2>
        
        {/* 특화 이미지 */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-purple-300 mb-4">⚡ 특화</h3>
          <div className="flex justify-center">
            <img 
              src="/tip-images/musa.JPG" 
              alt="특화" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/musa.JPG')}
            />
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-blue-300 text-2xl font-bold mb-4">💠 수정</h3>
          
          <div className="space-y-6">
            {/* 수정 1 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-3 text-center">인추 세팅</h4>
              <div className="flex justify-center">
                <img 
                  src="/tip-images/musacri1.JPG" 
                  alt="인추 세팅" 
                  className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/musacri1.JPG')}
                />
              </div>
            </div>
            
            {/* 수정 2 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-3 text-center">회피 밸런스 세팅</h4>
              <div className="flex justify-center">
                <img 
                  src="/tip-images/musacri2.JPG" 
                  alt="회피 밸런스 세팅" 
                  className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/musacri2.JPG')}
                />
              </div>
            </div>

            {/* 유물 3개 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-2 border-yellow-500">
              <h4 className="text-yellow-300 text-xl font-bold mb-4 text-center">참고</h4>
              <div className="space-y-3">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-200 text-lg text-center">
                    • 유물: <strong className="text-blue-400">모든 피해 감소</strong> + 광명석 <strong className="text-cyan-400">서리방패</strong>
                  </p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-200 text-lg text-center">
                    • 유물: <strong className="text-blue-400">모든 피해 감소</strong> + 광명석 <strong className="text-purple-400">부패</strong>
                  </p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-200 text-lg text-center">
                    • 유물: <strong className="text-green-400">모든 회피력</strong> + 광명석 <strong className="text-yellow-400">켄타우로스</strong>
                  </p>
                </div>
                <p className="text-gray-400 text-base text-center italic">상황에 맞게 선택</p>
                <div className="border-t border-slate-600 my-3"></div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-200 text-lg text-center">
                    적중 필요시 <strong className="text-yellow-400">2적중 ~ 3적중</strong> 착용
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 라밤 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600 mt-6">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">✨ 라밤</h3>
          <div className="flex justify-center">
            <img 
              src="/tip-images/labam.JPG" 
              alt="라밤" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/labam.JPG')}
            />
          </div>
        </div>

        {/* 재련석 */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40 mt-6">
          <h4 className="text-red-300 text-xl font-bold mb-3">⚔️ 군왕 재련석</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-red-400 font-bold">모든 공격력</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-blue-400 font-bold">모든 피해 감소</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-green-400 font-bold">최대 생명력</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-purple-400 font-bold">다운어택 피해량 증가</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-yellow-400 font-bold">백어택 피해량 증가</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 하고 싶은 말 / 팁 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-yellow-500 mb-8">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고 싶은 말 / 팁
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            솔직히 요새 전승 무사보다 DPS 좋고 무매보다도 짧은 거리를 순식간에 이동하는 직업들이 많지만 
            <strong className="text-yellow-400"> 전승 무사만의 매력과 장점</strong>이 있으니까
          </p>
          <p className="text-slate-200 text-xl font-bold leading-relaxed" style={{ color: '#7dd3fc' }}>
            전승 무사 플레이하는 거에 망설이고 계시다면 해보는 걸 추천드립니다.
          </p>
        </div>
        
        {/* 꿀팁들 */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-600/40">
            <h4 className="text-yellow-300 text-xl font-bold mb-3">🎯 필수 연습 콤보</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-yellow-500 font-mono text-center mb-3">
              <p className="text-slate-200 text-lg">
                <strong className="text-yellow-300">옆장찌, 초열보</strong> +
                <strong className="text-orange-300"> 옆장찌, 초열보</strong> + 
                <strong className="text-cyan-300"> 각수</strong>
              </p>
            </div>
            <p className="text-slate-200 text-lg">
              <strong className="text-red-400">이거는 무조건 연습.</strong>
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-600/40">
            <h4 className="text-blue-300 text-xl font-bold mb-3">⚡ 슈아 끌기</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-cyan-500 font-mono text-center">
              <p className="text-slate-200 text-lg">
                <strong className="text-orange-300">격풍</strong>, 
                <strong className="text-cyan-300"> 추격</strong>, 
                <strong className="text-yellow-300"> 용오름화</strong>, 
                <strong className="text-blue-300"> 후퇴베기</strong>
              </p>
            </div>
            <p className="text-gray-400 text-base mt-3 text-center">
              이 스킬들로 슈아를 끌어주시면 됩니다.
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




