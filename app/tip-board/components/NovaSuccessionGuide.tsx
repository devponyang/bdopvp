'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function NovaSuccessionGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/21', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_21')
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
        await fetch('/api/tip-board/21/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/21/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_21', 'true')
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
            <img src="/class-icons/nova.png" alt="노바" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              전승 노바 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "얼음과 눈보라의 지배자"
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

      {/* 작성자 사진 */}
      <div className="flex justify-center mb-6">
        <img 
          src="/tip-images/약주.png" 
          alt="약주님" 
          className="w-80 h-80 rounded-full border-4 border-blue-400/50 shadow-xl object-cover"
        />
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
              <span className="text-gray-300">작성자:</span> <Link href="/guild/Ctrl" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">Ctrl</Link> 길드 <span className="text-blue-400 font-bold">약주</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-lg shadow-lg">
              <img src="/class-icons/nova.png" alt="노바" className="w-5 h-5 object-contain" />
              <p className="text-blue-300 font-bold text-sm">
                2025 솔라레의 창 시즌 2 - 노바 랭킹 2위
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
          안녕하세요! <strong className="text-purple-400">Ctrl</strong> 길드에서 노바를 플레이하고 있는 <strong className="text-blue-400">약주</strong>입니다.
          <br />
          전승 노바를 즐기시는 분들에게 조금이나마 도움이 되었으면 합니다.
        </p>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 전승 노바 클래스의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-green-400">1. 최신AI 시스템(소환수)</strong>
              <ul className="text-slate-300 text-base mt-2 space-y-2 pl-4">
                <li>1) 크라툼의 깃든 병사가 소환되면, 적이 노바 근처에 있을 때 스스로 적을 포착하여 공격하고 경직(CC)을 걸어줍니다</li>
                <li>2) 노바의 생명력이 40% 미만으로 내려가면, 악시안이 폭주 상태(쿨타임 2분, 지속 1분)가 되어 노바에게 접근하는 모든 적을 공격하고 CC기를 넣습니다.</li>
                <li>저항이 사라진 현재 메타에서는, 이는 노바의 가장 큰 장점으로 작용합니다.</li>
              </ul>
            </li>
            <li><strong className="text-green-400">2. 방막캐릭</strong>
              <ul className="text-slate-300 text-base mt-2 space-y-2 pl-4">
                <li>노바는 검은사막에서 가장 단단한 캐릭터 중 하나로, 스킬 구조의 대부분이 슈퍼아머로 이루어져 있어 상대의 눈먼 CC가 잘 통하지 않습니다.</li>
              </ul>
            </li>
            <li><strong className="text-green-400">3. 빙결을 통한 재미</strong>
              <ul className="text-slate-300 text-base mt-2 space-y-2 pl-4">
                <li>노바는 세 가지의 빙결 스킬을 가지고 있으나, 일반적으로 두 가지만 사용합니다.</li>
                <li>(샛별의 결박: 빙결 4초 / 크라툼의 결박: 빙결 6초)</li>
                <li>빙결을 이용한 CC 초기화를 통해 상대에게 큰 압박과 무력감을 줄 수 있습니다.</li>
              </ul>
            </li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-red-400">1. 무적기</strong>
              <ul className="text-slate-300 text-base mt-2 space-y-2 pl-4">
                <li>노바의 무적기는 성릉sc 쿨 10초짜리 1개이기 때문에 잡기가 2개이거나, 한번에 강력하게 들어오는 딜에 약합니다.</li>
              </ul>
            </li>
            <li><strong className="text-yellow-400">2. 태생의 답답함</strong>
              <ul className="text-slate-300 text-base mt-2 space-y-2 pl-4">
                <li>여러 스킬을 동시에 사용하며 이동하는 운영이 가능하지만, 캐릭터 자체의 답답함은 개인에 따라 크게 체감됩니다.</li>
              </ul>
            </li>
            <li><strong className="text-orange-400">3. 잡기에 대한 의존도</strong>
              <ul className="text-slate-300 text-base mt-2 space-y-2 pl-4">
                <li>안정적인 CC 및 콤보 연계를 위해서는 잡기 숙련도가 중요하며, 잡기가 실패할 경우 상대를 CC하거나 압박할 수 있는 수단이 제한적입니다</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. 스킬 이해 및 운용 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 스킬 이해 및 운용
        </h2>
        
        {/* 기본tip */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔧</span> 기본tip
          </h3>
          
          <div className="space-y-6">
            {/* 항상 악시안 소환 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-cyan-400">
              <h4 className="text-cyan-300 text-xl font-bold mb-3">1. 항상 악시안 소환하기</h4>
              <p className="text-slate-200 text-lg mb-2">
                <strong className="text-cyan-300">항상 se(한빙의 감옥)또는 q후에 시프트+스페이스(죽은자들의 왕)를 눌러 악시안 소환해 놓기</strong>
              </p>
              <p className="text-slate-200 text-base leading-relaxed">
                소환이 되어있으면 내 캐릭터 옆에 하얀 구슬이 뜸, 1시간마다 초기화되며 채널이동, 죽음, 라운드 끝, 맵 이동 등 항상 구슬 확인
              </p>
            </div>

            {/* 잠구기 스킬들 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-3">2. 잠구기 스킬들</h4>
              <p className="text-slate-200 text-base leading-relaxed mb-2">
                형벌, 빙판의 입맛춤, 회피이동 잠구기
              </p>
            </div>

            {/* 슬롯 스킬 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-3">3. 슬롯 스킬</h4>
              <p className="text-slate-200 text-base leading-relaxed mb-2">
                명령:돌격, 강:일그러진 수호, 크라툼의 대지, 크라툼의 결박, 엄동의 방진
              </p>
            </div>

            {/* 라밤 스킬 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-purple-400">
              <h4 className="text-purple-300 text-xl font-bold mb-3">4. 라밤</h4>
              <p className="text-slate-200 text-base leading-relaxed">
                크라툼의 가시, 샛별의 결박, 크라툼의 대지
              </p>
            </div>
          </div>
        </div>

        {/* 이동기 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 이동기
          </h3>
          
          <p className="text-slate-200 text-lg mb-4">
            노바는 총 6가지의 이동기를 보유하고 있습니다.
          </p>
          
          <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-red-400">
            <p className="text-slate-200 text-base leading-relaxed mb-2">
              <strong className="text-red-300">WF(크라툼의 상승)</strong>이속버프, <strong className="text-red-300">Shift+W+화면 돌리기(크라툼의 돌격)</strong>, <strong className="text-red-300">SF(눈 위에 내린 서리)</strong>,
            </p>
            <p className="text-slate-200 text-base leading-relaxed mb-2">
              <strong className="text-red-300">SC(성릉)</strong> – 길게 눌렀다 떼기, <strong className="text-red-300">Shift+X(크라툼의 가시)</strong>, <strong className="text-red-300">Shift+방향키(기본 이동)</strong>
            </p>
            <p className="text-slate-200 text-base leading-relaxed">
              이 이동기들을 쿨타임에 맞춰 순차적으로 사용하면서, 상대의 CC나 딜을 흘리고 잡기 또는 CC로 역공을 노리는 운영이 필요합니다.
            </p>
          </div>
        </div>

        {/* 견제기 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-yellow-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🎯</span> 견제기
          </h3>
          
          <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-yellow-400">
            <p className="text-slate-200 text-base leading-relaxed mb-2">
              <strong className="text-yellow-300">se(한빙의 감옥), 슬롯(명령:돌격)</strong>
            </p>
            <p className="text-slate-200 text-base leading-relaxed mb-4">
              2가지 스킬은 이동기에 섞어 이동기+se, 이동기+슬롯(돌격) 꾸준하게 상대방에게 cc트라이를 해줍니다.
            </p>
            
            {/* 이동기견제기 영상 */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-5 rounded-lg border border-blue-400/40 shadow-lg">
              <p className="text-blue-300 font-semibold mb-2 text-lg">📹 이동기 견제 영상:</p>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <video
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  controls
                  preload="metadata"
                >
                  <source src="/tip-images/이동기견제.mp4" type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* 잡기 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-purple-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🎣</span> 잡기
          </h3>
          
          <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-purple-400">
            <p className="text-slate-200 text-base leading-relaxed mb-2">
              <strong className="text-purple-300">응징의 올가미(WE)</strong>
            </p>
            <p className="text-slate-200 text-base leading-relaxed mb-2">
              노바의 숙련도를 크게 끌어올려주는 핵심 스킬 운용법입니다.
            </p>
            <p className="text-slate-200 text-base leading-relaxed mb-2">
              선딜을 없애주는 스킬 사용 후 잡기를 입력하면, 잡기가 빠르게 발동됩니다.
            </p>
            <p className="text-slate-200 text-base leading-relaxed">
              예시) 명령: 돌격(슬롯), 한빙의 감옥(SE), 크라툼의 가시(Shift+X)등
            </p>
          </div>
        </div>

        {/* CC 스킬들 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-indigo-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> CC 스킬들
          </h3>
          
          <div className="space-y-4">
            {/* 넉다운 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-indigo-400">
              <h4 className="text-indigo-300 text-lg font-bold mb-2">넉다운</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 매서운 호령(S좌) 1타넉다운 - 상대방이 멀리서 cc에 걸린 경우 사용 (근거리에서는 맞지 않습니다)</li>
                <li>• 몰아치는샛별(쉽E) 마지막타격 넉다운 - 일반적으로 콤보에 넣지는 않으며 슈아유지+ 생명력 회복</li>
                <li>• 보복하는 샛별(w우) 3타넉다운 - 상대방이 멀리서 cc에 걸린 경우 사용 (근거리에서는 맞지 않습니다)</li>
              </ul>
            </div>

            {/* 띄우기 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-lg font-bold mb-2">띄우기</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 얼음가시(S우)1타 띄우기 - 일반적인 콤보에 제일 많이 쓰이는 2CC 넣는 스킬입니다.(맨몸 주의)</li>
                <li>• 응징의올가미(WE)잡기성공시 띄우기 - 잡기</li>
                <li>• 몰아치는사제(SHIFT+좌)마지막타격시 띄우기 - 솔라레 콤보에 쓰이는 2CC 슈아기 입니다.</li>
                <li>• 한빙의감옥(SE) 친위대 타격성공시 띄우기 - 이동기+ 견제 항상 써야하는 스킬</li>
              </ul>
            </div>

            {/* 기절 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="text-red-300 text-lg font-bold mb-2">기절</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 눈위에 내린서리 (SF) 1타기절 - 이동기 후 sf를 눌러 상대방에게 카운터 칠 때 많이 쓰이며, 노바 cc중에 제일 안정적으로 cc를 넣을 수 있는 스킬입니다.</li>
              </ul>
            </div>

            {/* 경직 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="text-yellow-300 text-lg font-bold mb-2">경직</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 보복하는 샛별(W우)1,2타 경직 - 잘 안 쓰이는 스킬</li>
                <li>• 마주하는 어둠(방호 사용 중 F)경직 - 이 스킬은 치명타 확률을 50% 증가시키므로, 1CC 이후 콤보 연계 시 핵심적으로 사용됩니다.</li>
                <li>• 돌격(슬롯)타격 성공 시 경직 - 상대방 뒤에서 병사가 경직 스킬을 사용해 적을 제압하는 스킬입니다.</li>
              </ul>
            </div>

            {/* 빙결 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-lg font-bold mb-2">빙결</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 한빙의감옥(SE) 타격 성공 시 빙결 - 빙결보다는 띄우기 cc용</li>
                <li>• 병탄할 표적(슬롯) - 슬롯에 넣어 쓸 수 있지만 활용도가 낮습니다.</li>
                <li>• 크라툼의 결박(슬롯) - 6초간 빙결</li>
                <li>• 샛별의 결박(쉽Z) - 4초간 빙결</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 디버프/버프/피흡/무적/슈아/전가 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚙️</span> 기타 스킬 효과들
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 디버프 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="text-red-300 text-lg font-bold mb-2">디버프</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 얼어붙는 대지(쉽+c) - 5초간 공속, 시전속도 감소 15% 감소</li>
                <li>• 부름받은 보병(스페이스) - 친위대 타격 성공 시 10초간 모든 방어 20% 감소, 5초간 이속 20% 감소</li>
                <li>• 죽은 자들의 왕(시프트 스페이스) - 타격 성공 시 10초간 모든 방어 20% 감소, 6초간 2초마다 200 고통 피해, 지상 소환 타격 성공 시 기절</li>
                <li>• 크라툼의 가시(쉽X) - 5초간 이속 감소 15%, 공속, 시전속도 15% 감소</li>
              </ul>
            </div>

            {/* 버프 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-lg font-bold mb-2">버프</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 얼음가시(S우) - 시전속도 +10%</li>
                <li>• 크라툼의상승(WF) - 이동 +10%</li>
                <li>• 마주하는어둠(방호상태f) - 치확 50%</li>
                <li>• 강:혹한의 어둠(쉽+우) - 10초간 모공 28 증가</li>
                <li>• 흑정령:한빙의감옥 - 치확 30%, 1분간 모공+30, 시전속도 증가 25%, 낙마가능</li>
                <li>• 크라툼의결박 - 2초간 모든 저항 무시 증가 30%</li>
                <li>• 일그러진 수호 - 생명 회복 1500, 생증 750, 30초간 모방 50%, 방어 감소 효과 적용 무시 + 삭제</li>
              </ul>
            </div>

            {/* 피흡 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-pink-400">
              <h4 className="text-pink-300 text-lg font-bold mb-2">피흡</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 몰아치는샛별(쉽E) - 생명 +120</li>
                <li>• 매서운호령(S좌) - 악시안 소환 중 타격 성공 시 타격마다 생명 +71</li>
                <li>• 얼음가시(S우) - 악시안 소환 중 타격 성공 시 타격마다 생명 +105</li>
                <li>• 덮치는고리(WC) - 악시안 소환 중 타격 성공 시 타격마다 생명 +125</li>
                <li>• 여제의징벌(e) - 타격마다 생명력 +160</li>
              </ul>
            </div>

            {/* 무적/슈아/전가 */}
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="text-purple-300 text-lg font-bold mb-2">무적/슈아/전가</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4">
                <li>• 무적 - 성릉(후방이동무적)</li>
                <li>• 슈아 - 크라툼의 돌격, 몰아치는샛별, 눈위에내린서리, 크라툼의상승, 당겨가르는샛별, 얼어붙는대지, 몰아치는사제, 혹한의어둠, 격돌하는기병, 옭아매는 얼음가시, 여제의징벌, 성릉, 일그러진 수호</li>
                <li>• 전가 - 덮치는고리, 명령:돌격, 크라툼의 가시</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 연계기 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-red-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> 연계기
        </h2>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            노바 스킬에는 기본적으로 선딜이 존재합니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            다만 히든 커맨드를 활용하면, 연계기를 알고 있는 유저는 선딜 없이 스킬을 즉시 사용할 수 있습니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            모든 연계기를 외울 필요는 없으며, 단순히 "이런 방식으로 사용할 수 있다"는 정도만 인지하면 됩니다.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <img 
              src="/tip-images/노바연계기1.jpg" 
              alt="노바 연계기 가이드 1" 
              className="max-w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/노바연계기1.jpg')}
            />
            <img 
              src="/tip-images/노바연계기2.jpg" 
              alt="노바 연계기 가이드 2" 
              className="max-w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/노바연계기2.jpg')}
            />
            <img 
              src="/tip-images/노바연계기3.jpg" 
              alt="노바 연계기 가이드 3" 
              className="max-w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/노바연계기3.jpg')}
            />
            <img 
              src="/tip-images/노바연계기4.jpg" 
              alt="노바 연계기 가이드 4" 
              className="max-w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/노바연계기4.jpg')}
            />
            <img 
              src="/tip-images/노바연계기5.jpg" 
              alt="노바 연계기 가이드 5" 
              className="max-w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage('/tip-images/노바연계기5.jpg')}
            />
          </div>
          
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
            <p className="text-slate-300 text-sm text-center">
              출처 : 악동 길드 에끌 님
            </p>
          </div>
        </div>
      </div>

      {/* 5. 한빙의 감옥 활용법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-cyan-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">❄️</span> 한빙의 감옥 활용법
        </h2>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            전노의 꽃 소환수 악시안 활용 법 입니다.
          </p>
          <p className="text-slate-200 text-lg leading-relaxed mb-4">
            초급님께서 나오신 장인 초대석에서 자세하게 다루어 보시면 도움이 많이 될겁니다.
          </p>
          
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/h456KnidlpU?si=WUuPHcp6gN-DL4kj&start=492"
              title="장인초대석 초급님 노바 가이드"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
            <p className="text-slate-300 text-sm text-center">
              출처 : <a href="https://www.youtube.com/channel/UCaVKbCOb0EvZ7u_QP4-10Fw" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">박짱쿠 유튜브</a> - 전승 노바 장인 초대석
            </p>
          </div>
        </div>
      </div>

      {/* 6. 거점(RVR) / 솔라레or길드리그(소수전) 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-green-500">
        <h2 className="text-white text-3xl font-bold mb-8 flex items-center">
          <span className="mr-3 text-4xl">🏰</span> 거점(RVR) / 솔라레or길드리그(소수전) 운영법
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 거점(RVR)운영법 */}
          <div className="bg-gradient-to-br from-red-900/20 to-rose-900/10 p-6 rounded-xl border border-red-400/30 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">⚔️</span>
              </div>
              <h3 className="text-red-200 text-xl font-bold">거점(RVR) 운영법</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-red-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">1</span>
                  </div>
                  <div>
                    <h4 className="text-red-200 font-semibold text-base mb-2">본대 방셋</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      노바는 앞라인에서 아군 딜러들이 안정적으로 딜을 넣을 수 있게 버텨주는 역할을 합니다.
                    </p>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-red-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">2</span>
                  </div>
                  <div>
                    <h4 className="text-red-200 font-semibold text-base mb-2">성채 점령 후</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      부활 무적 상태가 된 노바는, 성채를 공격 중인 적 딜러진에 진입해 CC기와 빙결로 상대를 무력화시키는 역할을 합니다.
                    </p>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-red-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">3</span>
                  </div>
                  <div>
                    <h4 className="text-red-200 font-semibold text-base mb-2">부속조, 수비조, 불퇴조</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      역할을 부여받은 경우, 들어오는 꼬장 캐릭을 잡아 우리 딜러들이 처치할 수 있도록 서포팅해야 합니다.
                    </p>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-red-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">4</span>
                  </div>
                  <div>
                    <h4 className="text-red-200 font-semibold text-base mb-2">꼬장조</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      역할을 부여 받은 경우 방셋 또는 밸셋으로 세팅 후 상대 불퇴쪽에서 끊임없이 견제 하시면 됩니다.
                    </p>
                  </div>
                </div>
            </div>
            
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 p-4 rounded-lg border border-yellow-400/40">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-yellow-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">⚠</span>
                  </div>
                  <div>
                    <h4 className="text-yellow-200 font-semibold text-base mb-2">제한 거점,공성</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      노바의 장점들이 모두 사라진다고 생각하여 제한 거점,공성에서는 전승노바는 좋은 직업이 아니라고 생각합니다.
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* 솔라레 운영법 */}
          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 p-6 rounded-xl border border-purple-400/30 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🌟</span>
              </div>
              <h3 className="text-purple-200 text-xl font-bold">솔라레 운영법</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-800/30 to-violet-800/20 p-4 rounded-lg border border-purple-400/40 mb-3">
                <div className="text-center">
                  <h4 className="text-purple-200 font-semibold text-base">4훔 또는 8훔 세팅</h4>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-purple-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">1</span>
                  </div>
                  <div>
                    <h4 className="text-purple-200 font-semibold text-base mb-2">아군 보호</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      노바는 아군이 죽으면 캐리하기 어려운 캐릭입니다. 따라서 아군을 보호하면서 상대의 빈틈을 노려 잡거나, CC기에 맞춰 아군 딜러가 딜을 넣을 수 있도록 도와주는 역할이 중요합니다.
                    </p>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-purple-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">2</span>
                  </div>
                  <div>
                    <h4 className="text-purple-200 font-semibold text-base mb-2">잡기 판정</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      노바는 혼자 남으면 캐리하기 어렵지만, 아군이 함께 있을 경우에는 충분히 캐리할 수 있는 캐릭터입니다. 이는 노바의 잡기 판정이 매우 우수하기 때문입니다.
                    </p>
                    <div className="bg-purple-900/30 p-2 rounded mt-2">
                      <p className="text-purple-200 text-xs font-medium">💡 잡기 성공 후 핑을 찍어 아군에게 알리는 것이 중요합니다!</p>
                    </div>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-purple-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">3</span>
                  </div>
                  <div>
                    <h4 className="text-purple-200 font-semibold text-base mb-2">3분 버프 활용</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      예전에는 3분 버프를 긴급 탈출이 빠진 후에 사용했지만, 제가 운영하는 방식은 다릅니다. 게임 시작 한 뒤 바로 3분 버프를 켜 상대의 어그로를 끌어 자신이 잡히더라도, 그 사이에 아군이 적의 뒤를 치거나 CC를 연계해 상대의 긴급 탈출을 빼내는 식으로 운영합니다.
                    </p>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-purple-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">4</span>
                  </div>
                  <div>
                    <h4 className="text-purple-200 font-semibold text-base mb-2">조합 분석</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      상대 팀의 조합에 따라 노바의 역할을 신중하게 판단하고, 그에 맞는 운영 방식을 고민하며 플레이합니다.
                    </p>
                    <div className="bg-purple-900/30 p-2 rounded mt-2">
                      <p className="text-purple-200 text-xs font-medium">🎯 게임 시작 전 조합을 보며 그림 짜기</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* 길드리그 운영법 */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 p-6 rounded-xl border border-blue-400/30 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🏆</span>
              </div>
              <h3 className="text-blue-200 text-xl font-bold">길드리그 운영법</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-blue-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">1</span>
                  </div>
                  <div>
                    <h4 className="text-blue-200 font-semibold text-base mb-3">포지션</h4>
                    <p className="text-slate-200 text-sm leading-relaxed mb-3">
                      노바의 포지션은 크게 두 가지입니다.
                    </p>
                    <ul className="text-slate-200 text-sm space-y-2 pl-4">
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>상대 극딜러를 끝까지 따라가서 끊거나 CC 넣기</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-300 mr-2">•</span>
                        <span>아군 사이드 라인을 지키면서 딜 넣는 적을 끊거나 CC 넣기</span>
                      </li>
              </ul>
                    <div className="bg-blue-900/30 p-3 rounded mt-3">
                      <p className="text-blue-200 text-sm font-medium">💡 대부분의 상황에서는 2번 포지션 위주로 플레이하시는 걸 추천드립니다.</p>
                    </div>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-blue-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">2</span>
                  </div>
                  <div>
                    <h4 className="text-blue-200 font-semibold text-base mb-2">세팅 및 운영</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      방셋 또는 밸셋으로 세팅한 뒤, 핑 색상을 정하고 상대 원딜이나 극딜러를 우선적으로 잡은 다음 핑을 찍어, 아군 딜러들이 상대를 처치할 수 있도록 지원합니다.
                    </p>
                  </div>
                </div>
            </div>
            
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/60 hover:border-blue-400/40 transition-colors">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500/80 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">3</span>
                  </div>
                  <div>
                    <h4 className="text-blue-200 font-semibold text-base mb-2">샤이 대처</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      샤이가 구름막이나 버프·디버프 스킬을 쓰는 타이밍에 노바의 3분 스킬을 사용하면, 들어오는 약화 효과를 지우면서 샤이를 끊어 버프나 디버프를 못 쓰게 만들 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-red-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> PVP 콤보
        </h2>

        {/* 기본콤보 */}
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-6 rounded-xl mb-6 border border-red-500/50 shadow-lg">
          <h3 className="text-red-400 text-2xl font-bold mb-4">기본콤보 (초급님 콤보)</h3>
          
          <div className="text-slate-200 text-base">
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <div>응징의 올가미</div>
                <div className="text-blue-300 text-base">WE(1CC)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>마주하는 어둠</div>
                <div className="text-blue-300 text-base">F(치확)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>옭아매는 얼음가시</div>
                <div className="text-blue-300 text-base">F</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>격돌하는 기병</div>
                <div className="text-blue-300 text-base">SHIFT+Q</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>얼음가시</div>
                <div className="text-blue-300 text-base">S+RMB(2CC)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>혹한의 어둠</div>
                <div className="text-blue-300 text-base">SHIFT+RMB</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>몰아치는 사제</div>
                <div className="text-blue-300 text-base">SHIFT+좌</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>크라툼의 대지</div>
                <div className="text-blue-300 text-base">슬롯</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>얼어붙는 대지</div>
                <div className="text-blue-300 text-base">SHIFT+C</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>성릉</div>
                <div className="text-blue-300 text-base">SC</div>
              </div>
            </div>
          </div>

          {/* 기본콤보 비디오 */}
          <div className="mt-6">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                controls
                preload="metadata"
              >
                <source src="/tip-images/기본콤보.mp4" type="video/mp4" />
                브라우저가 비디오를 지원하지 않습니다.
              </video>
            </div>
          </div>
        </div>

        {/* 원거리cc 콤보 */}
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-6 rounded-xl mb-6 border border-purple-500/50 shadow-lg">
          <h3 className="text-purple-400 text-2xl font-bold mb-4">원거리cc (nigrum님 콤보)</h3>
          <div className="bg-amber-900/20 p-3 rounded-lg mb-4 border border-amber-400/30">
            <p className="text-amber-300 text-base font-semibold"> ex) 멀리서 경직 걸리거나 cc걸린 경우</p>
          </div>
          
          <div className="text-slate-200 text-base">
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <div>원거리경직</div>
                <div className="text-blue-300 text-base">S좌(1CC)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>매서운 호령</div>
                <div className="text-blue-300 text-base">SHIFT+F</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>옭아매는 얼음가시</div>
                <div className="text-blue-300 text-base">SHIFT+Q</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>혹한의 어둠</div>
                <div className="text-blue-300 text-base">SHIFT+우</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>몰아치는 사제</div>
                <div className="text-blue-300 text-base">SHIFT+좌(2CC)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>크라툼의 대지</div>
                <div className="text-blue-300 text-base">슬롯</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>얼어붙는 대지</div>
                <div className="text-blue-300 text-base">SHIFT+C</div>
              </div>
          </div>
        </div>
      </div>

        {/* 솔라레 콤보 */}
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-xl mb-6 border border-green-500/50 shadow-lg">
          <h3 className="text-green-400 text-2xl font-bold mb-4">솔라레 콤보(초급님 콤보, 공속 7퍼이상)</h3>
          
          <div className="text-slate-200 text-base">
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <div>응징의올가미</div>
                <div className="text-blue-300 text-base">W+E</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>얼음안개</div>
                <div className="text-blue-300 text-base">SHIFT+좌우(이동기)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>옭아매는 얼음가시</div>
                <div className="text-blue-300 text-base">SHIFT+F</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>격돌하는기병</div>
                <div className="text-blue-300 text-base">SHIFT+Q</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>혹한의어둠</div>
                <div className="text-blue-300 text-base">SHIFT+우</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>몰아치는 사제(띄우기)</div>
                <div className="text-blue-300 text-base">SHIFT+좌</div>
              </div>
              <span className="text-yellow-400">→</span>
          <div className="text-center">
                <div>얼어붙는 대지</div>
                <div className="text-blue-300 text-base">SHIFT+C</div>
              </div>
          </div>
        </div>
      </div>

        {/* 빙결콤 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4">빙결콤</h3>
          <div className="bg-red-900/20 p-3 rounded-lg mb-4 border border-red-400/30">
            <p className="text-red-300 text-base font-semibold">⚠️ 마주하는 어둠후에 샛별의 결박을 쓰셔야 빙결이 걸립니다</p>
          </div>
          
          <div className="text-slate-200 text-base">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="text-center">
                <div>응징의 올가미</div>
                <div className="text-blue-300 text-base">W+E(1CC)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>마주하는 어둠</div>
                <div className="text-blue-300 text-base">경직</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>샛별의결박</div>
                <div className="text-blue-300 text-base">빙결(cc초기화)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>얼음가시</div>
                <div className="text-blue-300 text-base">1CC(띄우기)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>마주하는 어둠</div>
                <div className="text-blue-300 text-base">경직</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>크라툼의 결박</div>
                <div className="text-blue-300 text-base">빙결(cc초기화)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>눈위에내린 서리</div>
                <div className="text-blue-300 text-base">SF(1CC)</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>마주하는 어둠</div>
                <div className="text-blue-300 text-base">경직</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>응징의 올가미</div>
                <div className="text-blue-300 text-base">2CC</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>옭아매는 얼음가시</div>
                <div className="text-blue-300 text-base">SHIFT+F</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>격돌하는기병</div>
                <div className="text-blue-300 text-base">SHIFT+Q</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>혹한의 어둠</div>
                <div className="text-blue-300 text-base">SHIFT+우</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>몰아치는 사제</div>
                <div className="text-blue-300 text-base">SHIFT+좌</div>
              </div>
              <span className="text-yellow-400">→</span>
              <div className="text-center">
                <div>크라툼의 대지</div>
                <div className="text-blue-300 text-base">슬롯</div>
              </div>
            </div>
          </div>

          {/* 빙결콤보 비디오 */}
          <div className="mt-6">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                controls
                preload="metadata"
              >
                <source src="/tip-images/빙결콤보.mp4" type="video/mp4" />
                브라우저가 비디오를 지원하지 않습니다.
              </video>
            </div>
          </div>

          <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-400/30 mt-6">
            <h4 className="text-amber-300 text-lg font-bold mb-3">빙결콤 주의점과 tip</h4>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                <strong className="text-amber-300">1. 빙결 스킬은 상대의 CC를 초기화시켜주는 효과</strong>가 있습니다. 다만, 빙결을 맞은 적에게 다른 CC 스킬을 사용하면 빙결 효과는 사라집니다.
              </p>
              <p className="text-slate-200 text-base">
                따라서 빙결은 다음과 같은 상황에서 시간을 벌기 위한 용도로 사용합니다:
              </p>
              <ul className="text-slate-300 text-sm mt-2 pl-4 space-y-1">
                <li>• 내가 딜을 넣을 스킬이 쿨타임 중일 때</li>
                <li>• 주변에 아군이 없을때</li>
                <li>• 멀리서 병사나 악시안이 CC를 넣는 경우</li>
              </ul>
              <p className="text-slate-200 text-base">
                <strong className="text-amber-300">2. 악시안이 폭주 상태일 때</strong>(내 체력이 40% 이하, 캐릭터 옆에 빨간 구슬이 표시됨) 악시안이 자동으로 적에게 CC를 넣습니다. 이 경우 빙결을 사용해도 자동 CC가 발동하기 때문에 빙결 효과가 풀립니다.
              </p>
              <p className="text-slate-200 text-base">
                <strong className="text-amber-300">3. 빙결콤 사이에 cc또는 딜 스킬은 편한대로 바꿔서 쓰셔도 됩니다.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. 각캐릭간의 1:1 상성 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-yellow-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 각캐릭간의 1:1 상성(주관적)
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg leading-relaxed mb-6 text-center">
            다음은 작성자의 주관적인 의견입니다. 실제 경험과 상황에 따라 다를 수 있습니다.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 유리한 상성 */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 p-6 rounded-xl border border-green-400/40 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h4 className="text-green-300 text-xl font-bold">유리한 상성</h4>
              </div>
              
              <div className="space-y-3">
                {/* 워리어 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/warrior.png" alt="워리어" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">워리어</div>
                    <div className="text-slate-400 text-sm">잡기 싸움, 원거리 잡기인 노바 유리</div>
                  </div>
                </div>

                {/* 소서러 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/sor.png" alt="소서러" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">소서러</div>
                    <div className="text-slate-400 text-sm">원잡 쓸 때 카운터만 안당하면 노바 유리</div>
                  </div>
                </div>

                {/* 자이언트 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/jai.png" alt="자이언트" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">자이언트</div>
                    <div className="text-slate-400 text-sm">잡기 싸움, 프뚫+ 마컨이 안되는 현상황에서는 노바 유리</div>
                  </div>
                </div>

                {/* 매화 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/mahwa.png" alt="매화" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">매화</div>
                    <div className="text-slate-400 text-sm">무사랑 비슷하지만, 딜은 더 약해서 노바가 유리</div>
                  </div>
                </div>

                {/* 위자드 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/wizard.png" alt="위자드" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">위자드</div>
                    <div className="text-slate-400 text-sm">가끔 이동기 쓰고 훅 들어와서 잡는 위자드가 존재하지만 노바가 유리</div>
                  </div>
                </div>

                {/* 위치 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/witch.png" alt="위치" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">위치</div>
                    <div className="text-slate-400 text-sm">노바가 유리</div>
                  </div>
                </div>

                {/* 닌자 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/ninja.png" alt="닌자" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">닌자</div>
                    <div className="text-slate-400 text-sm">3분 킨 닌자에게는 많이 어렵고 힘듬</div>
                  </div>
                </div>

                {/* 아처 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/archer.png" alt="아처" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">아처</div>
                    <div className="text-slate-400 text-sm">도망 잘 다니는 아처는 슈아기 유지하면서 따라 가서 죽이는게 중요</div>
                  </div>
                </div>

                {/* 샤이 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/shai.png" alt="샤이" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">샤이</div>
                    <div className="text-slate-400 text-sm">빙결 콤으로 가지고 놀기 좋음</div>
                  </div>
                </div>

                {/* 가디언 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/gadi.png" alt="가디언" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">가디언</div>
                    <div className="text-slate-400 text-sm">각디언은 무적기가 많아 잡기 힘든 편이지만 노바가 유리하다고 생각</div>
                  </div>
                </div>

                {/* 하사신 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/hasasin.png" alt="하사신" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">하사신</div>
                    <div className="text-slate-400 text-sm">전사신 딜은 좋지만 어렵지 않고, 각사신은 원잡 판정이 좋아 각사신이 유리</div>
                  </div>
                </div>

                {/* 커세어 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/cosair.png" alt="커세어" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">커세어</div>
                    <div className="text-slate-400 text-sm">전커는 날파리 같은 존재 하지만 떼쟁 때는 가드를 부시기 때문에 피하는게 좋음, 각커는 유사 잡기로 잡는 경우가 있지만 노바가 유리</div>
                  </div>
                </div>

                {/* 드라카니아 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/draca.png" alt="드라카니아" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">드라카니아</div>
                    <div className="text-slate-400 text-sm">전드는 스킬 쓰는거 쳐다보다 잡으면 쉬움, 각드는 잡혀도 콤보에 전가 스킬이 있기때문에 잘 넘어져서 노바가 유리</div>
                  </div>
                </div>

                {/* 우사 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/usa.png" alt="우사" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">우사</div>
                    <div className="text-slate-400 text-sm">전우는 할거 하라고 두다가 스킬 쓸 때 잡으면 아주 쉬움, 각우는 잘 도망 다니기때문에 잡기각 잘 봐야함 하지만 딜 자체를 흘릴 수 있어서 노바가 유리</div>
                  </div>
                </div>

                {/* 매구 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/magu.png" alt="매구" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">매구</div>
                    <div className="text-slate-400 text-sm">전구는 멀리서 딜 하는걸 견제기로 cc넣고 분신 예측을 잘해서 잡으면 쉬운편, 각구는 들어오는거 보면서 카운터 잡기로 잡으면 쉬움</div>
                  </div>
                </div>

                {/* 도사 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/dosa.png" alt="도사" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">도사</div>
                    <div className="text-slate-400 text-sm">전도는 잘 잡히지는 않지만 딜을 흘릴 수 있어 슈아 유지 하다 잡으면 승리, 각도도 비슷</div>
                  </div>
                </div>

                {/* 데드아이 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-green-400/50 transition-colors">
                  <img src="/class-icons/dead.png" alt="데드아이" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">데드아이</div>
                    <div className="text-slate-400 text-sm">도사만큼 잡기 힘들진 않지만, 딜하면서 흘릴 수있는 직업이라 많이 아픈편 하지만 노바가 유리</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 반반 상성 */}
            <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/20 p-6 rounded-xl border border-yellow-400/40 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">⚖</span>
                </div>
                <h4 className="text-yellow-300 text-xl font-bold">반반 상성</h4>
              </div>
              
              <div className="space-y-3">
                {/* 금수랑 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-yellow-400/50 transition-colors">
                  <img src="/class-icons/taimer.png" alt="금수랑" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">금수랑</div>
                    <div className="text-slate-400 text-sm">콤보 딜이 생각 보다 쎄서, 잡기 싸움이 중요 반반 싸움</div>
                  </div>
                </div>

                {/* 다크나이트 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-yellow-400/50 transition-colors">
                  <img src="/class-icons/darknight.png" alt="다크나이트" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">다크나이트</div>
                    <div className="text-slate-400 text-sm">딜이 워낙 쎄서 카운터 치는거 조심하면서 거리 유지 후에 잡기! 반반 싸움</div>
                  </div>
                </div>

                {/* 미스틱 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-yellow-400/50 transition-colors">
                  <img src="/class-icons/mistic.png" alt="미스틱" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">미스틱</div>
                    <div className="text-slate-400 text-sm">잡기 싸움이며 전미는 50:50, 각미는 60:40으로 각미가 유리</div>
                  </div>
                </div>

                {/* 세이지 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-yellow-400/50 transition-colors">
                  <img src="/class-icons/saji.png" alt="세이지" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">세이지</div>
                    <div className="text-slate-400 text-sm">전세는 맵 보면서 이동하는 위치 확인 하면 쉽고, 각세는 잡기 싸움+ 각세 뒤잡아서 cc넣는게 중요! 반반 싸움</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 불리한 상성 */}
            <div className="bg-gradient-to-br from-red-900/30 to-rose-900/20 p-6 rounded-xl border border-red-400/40 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">✗</span>
            </div>
                <h4 className="text-red-300 text-xl font-bold">불리한 상성</h4>
          </div>
          
              <div className="space-y-3">
                {/* 레인저 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-red-400/50 transition-colors">
                  <img src="/class-icons/ranger.png" alt="레인저" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">레인저</div>
                    <div className="text-slate-400 text-sm">전렝은 따라가면서 패면 쉽고, 각렝은 무적기 많은 각렝이 더 유리하다고 생각</div>
                  </div>
                </div>

                {/* 무사 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-red-400/50 transition-colors">
                  <img src="/class-icons/musa.png" alt="무사" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">무사</div>
                    <div className="text-slate-400 text-sm">3분 한방딜이 너무 쎄, 잡기 하는데 각을 많이 봐야하며, 잡기가 빠진 상태에서 들어오면 한번에 죽을 수도 있음. 거리유지 핵심!</div>
                  </div>
                </div>

                {/* 발키리 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-red-400/50 transition-colors">
                  <img src="/class-icons/valc.png" alt="발키리" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">발키리</div>
                    <div className="text-slate-400 text-sm">잡기싸움, 생각 보다 각발 보다 전발이 더 상대하기 어려움</div>
                  </div>
                </div>

                {/* 쿠노이치 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-red-400/50 transition-colors">
                  <img src="/class-icons/kuno.png" alt="쿠노이치" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">쿠노이치</div>
                    <div className="text-slate-400 text-sm">쿠노이치는 쿠노이치 압승</div>
                  </div>
                </div>

                {/* 격투가 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-red-400/50 transition-colors">
                  <img src="/class-icons/fighter.png" alt="격투가" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">격투가</div>
                    <div className="text-slate-400 text-sm">이동기가 빠르며 잡기 2개 달린 각격은 각격이 유리</div>
                  </div>
                </div>

                {/* 란 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-red-400/50 transition-colors">
                  <img src="/class-icons/lhan.png" alt="란" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">란</div>
                    <div className="text-slate-400 text-sm">전란은 귀여운 친구, 각란은 잡기 모션이 워낙 좋아 각란이 유리</div>
                  </div>
                </div>

                {/* 스칼라 */}
                <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-red-400/50 transition-colors">
                  <img src="/class-icons/scara.png" alt="스칼라" className="w-8 h-8 object-contain mr-3" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">스칼라</div>
                    <div className="text-slate-400 text-sm">생각보다 콤딜이 엄청 아프며 원잡도 1대1일때 판정 괜찮은 편이라 스칼라가 유리</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-gray-400 mt-6">
            <div className="flex items-center">
              <img src="/class-icons/ukong.png" alt="오공" className="w-8 h-8 object-contain mr-3" />
            <p className="text-gray-300 text-sm">
              <strong>오공</strong> - 아직 까지 필드나 솔라레, 자결장에서 보지 못함.
            </p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-yellow-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> 솔라레 특화 / 거점or길드리그 무제한 특화 및 수정
        </h2>
        
        <div className="space-y-6">
          {/* 특화 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-red-400 text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">⚔️</span> 특화
            </h3>
            <p className="text-slate-200 text-base text-center">
              특화는 유저 입맛에 따라서 다르게 찍어도 무방합니다.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-blue-300 text-lg font-bold mb-3">1대1 특화</p>
                <p className="text-slate-200 text-sm mb-3">
                  개인 취향에 맞게 설정
                </p>
                <img 
                  src="/tip-images/노바1대1특화.png" 
                  alt="노바 1대1 특화" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바1대1특화.png')}
                />
              </div>
              
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-red-300 text-lg font-bold mb-3">RVR 특화</p>
                <p className="text-slate-200 text-sm mb-3">
                  거점전에 특화된 설정
                </p>
                <img 
                  src="/tip-images/노바RVR특화.png" 
                  alt="노바 RVR 특화" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바RVR특화.png')}
                />
          </div>
        </div>
      </div>

          {/* 수정 */}
          <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
            <h3 className="text-blue-300 text-2xl font-bold mb-4">💠 수정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1대1 기본 수정 */}
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-blue-300 text-lg font-bold mb-3">1대1 기본 수정</p>
                <p className="text-slate-200 text-sm mb-3">
                  붉정2, 붉살무사2, 붉아디1
                </p>
                <img 
                  src="/tip-images/노바1대1기본수정.png" 
                  alt="노바 1대1 기본 수정" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바1대1기본수정.png')}
                />
              </div>
              
              {/* 1대1 극딜 수정 */}
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-red-300 text-lg font-bold mb-3">1대1 극딜 수정 (인추세팅)</p>
                <p className="text-slate-200 text-sm mb-3">
                  붉정2, 붉살무사2, 붉아디1, 붉카르메1
                </p>
                <img 
                  src="/tip-images/노바1대1극딜.png" 
                  alt="노바 1대1 극딜 수정" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바1대1극딜.png')}
                />
              </div>
              
              {/* 1대1 피밸 수정 */}
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-green-300 text-lg font-bold mb-3">1대1 피밸 수정</p>
                <p className="text-slate-200 text-sm mb-3">
                  보통 필드에서 제일 많이 쓰는 수정입니다.<br />
                  붉정2, 1치명타피해
                </p>
                <img 
                  src="/tip-images/노바피밸.png" 
                  alt="노바 1대1 피밸 수정" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바피밸.png')}
                />
              </div>
              
              {/* 무제한 거점 방셋 수정 */}
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-purple-300 text-lg font-bold mb-3">무제한 거점 방셋 수정</p>
                <p className="text-slate-200 text-sm mb-3">
                  진마력하르퓌아1<br />
                  &nbsp;
                </p>
                <img 
                  src="/tip-images/노바방셋수정.png" 
                  alt="노바 무제한 거점 방셋 수정" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바방셋수정.png')}
                />
              </div>
              
              {/* 길드리그 수정1 */}
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-cyan-300 text-lg font-bold mb-3">길드리그 수정1(방셋)</p>
                <p className="text-slate-200 text-sm mb-3">
                  무제한 거점 방셋 수정과 동일합니다.
                </p>
                <img 
                  src="/tip-images/노바방셋수정.png" 
                  alt="노바 길드리그 수정1(방셋)" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바방셋수정.png')}
                />
              </div>
              
              {/* 길드리그 수정2 */}
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                <p className="text-yellow-300 text-lg font-bold mb-3">길드리그 수정2(밸셋)</p>
                <p className="text-slate-200 text-sm mb-3">
                  상황에 따라 아프다면, 모든공격력 수정을 피해감소 수정으로 바꾸셔도 됩니다.
                </p>
                <img 
                  src="/tip-images/노바피밸2.png" 
                  alt="노바 길드리그 수정2(밸셋)" 
                  className="w-full h-auto rounded-lg border border-slate-500 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/노바피밸2.png')}
                />
              </div>
            </div>
          </div>

          {/* 유물 */}
          <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
            <h3 className="text-green-300 text-2xl font-bold mb-4">✨ 유물</h3>
            <div className="flex justify-center">
              <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500 w-80">
                <p className="text-green-300 text-lg font-bold mb-2">데키아피감 + 서리방패</p>
          </div>
            </div>
          </div>

          {/* 군왕 재련석 */}
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40">
            <h4 className="text-red-300 text-2xl font-bold mb-4">⚔️ 군왕 재련석</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">피해감소</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">모든 공격력</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">치명타 피해</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">다운어택 피해</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold text-sm">최대 생명력</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10. 하고 싶은 말 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-yellow-500 mb-8">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고 싶은 말
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <p className="text-slate-200 text-lg leading-relaxed text-center">
            부족한 글 이지만 읽어주셔서 감사하고, 더 궁금한점 있으시면 <strong className="text-yellow-400 font-bold">약주</strong>로 귓 주세요!
            <br />
            <span className="text-blue-300 font-bold text-xl">노바 화이팅!!</span>
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
    </>
  )
}
