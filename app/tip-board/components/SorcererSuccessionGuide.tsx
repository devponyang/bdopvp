'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SorcererSuccessionGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/32', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_32')
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
        await fetch('/api/tip-board/32/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/32/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_32', 'true')
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
            <img src="/class-icons/sor.png" alt="전승 소서러" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              전승 소서러 PvP 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "밤까마귀의 힘으로 적을 제압하는 어둠의 마법사"
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
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-800 to-purple-900/50 p-6 rounded-2xl mb-8 shadow-2xl border border-purple-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
            <span className="text-4xl">✍️</span>
          </div>
          <div>
            <p className="text-white text-xl font-semibold mb-2">
              <span className="text-gray-300">작성자:</span> <Link href="/guild/아지다하카" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">아지다하카</Link> 길드 <span className="text-purple-400 font-bold">동방</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-lg shadow-lg">
              <img src="/class-icons/sor.png" alt="전승 소서러" className="w-5 h-5 object-contain" />
              <p className="text-purple-300 font-bold text-sm">
                전승 소서러 장인
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. 소개 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-4 flex items-center">
          <span className="mr-3 text-4xl">👋</span> 소개
        </h2>
        <div className="text-slate-200 text-lg leading-relaxed space-y-3">
          <p>
            안녕하세요! 2020년 9월부터 전승 소서러를 플레이하는 <strong className="text-purple-400">아지다하카 길드 동방</strong>입니다! 
            <br></br>개인사정으로 작년 12월부터 올해 8월까지 쉬다가 9월부터 간간히 다시하고 있습니다.
          </p>
        </div>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 전승 소서러 클래스의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li>
              <strong className="text-green-400">무쿨 회피기(밤까마귀 - 이하 밤까)의 존재</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                검은사막내의 독보적인 회피기인 밤까마귀가 존재. 상대가 몇명이든 지구력과 파편이 있다면 무시 가능. 특히 상대 부속 증축이나 건설 때 꼬장이 매우 편함.
              </p>
            </li>
            <li>
              <strong className="text-green-400">이론상 영구적인 밤까마귀 사용 가능</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                어둠의 조각(이하 조각)을 확보하는 만큼 밤까마귀를 사용 가능. 이상적으로 타점이 있다면 어둠의 조각을 계속해서 회복할 수 있기 때문에 무한 밤까마귀 사용 가능.
              </p>
            </li>
            <li>
              <strong className="text-green-400">상황에 따른 유연한 대처가 가능</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                보유 스킬들이 연계 및 캔슬이 매우 자유롭기 때문에 파일럿에 따라 매우 다양하게 운영 가능.
              </p>
            </li>
            <li>
              <strong className="text-green-400">다양한 실용적인 CC 존재</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                넉다운 5개(강 : 해방된 어둠, 강 : 멸망의 꿈, 걍 : 핏빛재앙 2타, 극 : 그림자 분출, 차징 강 : 심연의 불꽃), 띄우기 2개(강 : 그림자 분출, 그림자 불꽃), 기절 2개(고통의 표식, 강 : 핏빛재앙 1타), 경직 2개(당겨진 멸망의 꿈, 즉발 강 : 심연의 불꽃), 넉백 1개(설치형 불길한 전조)
              </p>
            </li>
            <li>
              <strong className="text-green-400">딜 교환이 우수함</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                밤까-스킬-밤까의 구조를 지니고 있어서 상대의 스킬은 대부분 맞지 않으며 본인의 스킬을 상대에 다 꽂을 수 있음. 이로인한 딜적인 우위가 있음.
              </p>
            </li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li>
              <strong className="text-red-400">기동성</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                전승 소서러의 가장 큰 장벽 중 하나가 기동성임. 근래에 강 : 까마귀 돌진과 강 : 긴밤 지르기가 조각 사용 유무에 관계없이 거리 이동거리가 증가하는 버프를 받았지만, 여전히 부족함. 그리고 까마귀 돌진이 슈퍼아머 판정이 그렇게 길지 않기 때문에 타점 끝쪽에 스킬을 몰아 맞으면 슈퍼아머가 빨리 끊겨 cc맞음.
              </p>
              <p className="text-slate-300 text-base mt-1 ml-4">
                위의 말한 장점들이 기동성이라는 단점때문에 빛을 보지 못하는것도 있음. cc 및 딜교환 우수한 것도 결국 상대가 교전을 응해줘야하는데 멀리서 대치만 해버리면 맞기만 하고 cc를 걸지도 못하고 조각을 회복하지도 못함. 이는 아래 서술할 유지력 파트에서 한번 더 서술함.
              </p>
            </li>
            <li>
              <strong className="text-red-400">유지력</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                근래의 패치로 강 : 까마귀 불꽃 전방가드 → 슈퍼아머, 강 : 망자유린 전방가드 → 슈퍼아머로 바뀌어서 멀리서 타격하는 클래스나 거리를 내어주지 않는 클래스와의 대결이 매우 힘들어짐(eg 데드아이). 이전엔 전방가드로 스킬을 어느정도 막으면서 거리를 좁혔으나 이제는 멀리서 계속 맞아야함. 또한 어둠의 연격, 어둠의 업화의 쿨타임 증가 패치로 인한 전방가드 유지 자체가 많이 힘들어짐.
              </p>
              <p className="text-slate-300 text-base mt-1 ml-4">
                어둠 갈퀴 슈퍼아머 → 전방가드 로 바뀜. 어둠 갈퀴 같은 경우 강 : 어둠의 파도와 달리 화면에 따른 스킬 방향이 변하지 않아 사실상 쓰면 뒤를 잡아달라는 스킬이라 사실상 실전에서 사용하기 매우 어려워짐. 어둠 갈퀴는 1)체력 회복 2)조각회복 으로 중요한 역할을 하고 있었는데 사실상 산소통 1개가 사라진 상황.
              </p>
              <p className="text-slate-300 text-base mt-1 ml-4">
                또한 전승소서러의 핵심 cc 스킬인 강 : 까마귀 돌진 - 강 : 그림자 분출 연계로 cc를 걸 경우 조각 2개(파편 20개)를 사용하는데 맞추면 조각 +1개, 맞추지 못하면 조각 -2개라 사실상 밤까 횟수가 2번준다고 볼 수 있음. 예전에는 그나마 맞추기 편했으나 클래스들의 속도가 빨라지며 사실 맞추기 힘들어짐 → 유지력 감소
              </p>
            </li>
            <li>
              <strong className="text-red-400">이동기 규칙 패치로 인한 이질적인 조작감</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                소서러 클래스 자체가 밤까-스킬-밤까의 구조로 설계가 되어있음. 사실상 밤까마귀가 이동기라기보단 공격스킬의 하나라고 볼 수 있음. 하지만 이동기 규칙 패치로 인해 밤까가 스킬과 속도가 상이한 상황이 빈번해짐.
              </p>
            </li>
            <li>
              <strong className="text-red-400">몸이 매우 약함</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                전승 소서러는 회피캐릭터임에도 불구하고 맹공클래스로 분류되어 있음. 기동성이 낮은것과 시너지를 내어서 거리를 좁혀주지 않는 딜러들에게 매우 취약함.
              </p>
            </li>
            <li>
              <strong className="text-red-400">이해할 수 없는 패치내역</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                그림자 표적의 전방가드화, 조각 폭발의 슈퍼아머화와 같은, 패치 전에도 후에도 쓰지 않는 그냥 삭제를 해도 무방한 스킬들에 왜 패치를 하고 개선해줬다고 말하는지 이해가 안됨. 어둠의 뒷걸음 같은 사실상 도망가는데 사용하는 스킬을 전방가드 → 슈퍼아머로 바꾸면서 사실상 도망을 못가는 스킬로 바꾼다거나. 강 : 핏빛 재앙에 있던 적중 디버프를 완전 근접스킬인 강 : 까마귀 불꽃에 주거나(사실상 디버프를 쓸수가없음). 대치상황에서 전방가드로 사용하는 스킬인 강 : 어둠의 업화, 극 : 어둠의 업화를 딜로 쓰라고 계수를 올린다거나(해당 스킬은 딜로 쓰는 순간 전방가드기 부족해서 쓰임이 안됨)
              </p>
            </li>
            <li>
              <strong className="text-red-400">강 : 핏빛재앙의 2cc독점 및 까마귀 습격의 바운드 삭제</strong>
              <p className="text-slate-300 text-base mt-1 ml-4">
                핏빛 재앙에 1타기절 2타 넉다운이 들어오면서 사실상 cc 셔틀로 전락해버림. 기존의 까마귀 습격은 밤까 이후 변칙적인 움직임으로 근접한 상대에게 카운터를 칠 수 있던 무쿨 cc기 였는데 사실상 스킬이 삭제됨.
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 운영법
        </h2>
        
        {/* 거점전 */}
        <div className="bg-gradient-to-br from-red-900/20 to-rose-900/10 p-6 rounded-xl mb-6 border border-red-400/30 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">⚔️</span>
            </div>
            <h3 className="text-red-200 text-xl font-bold">거점</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-slate-200 text-lg leading-relaxed">
              신거점/구거점 모두 대부분 부속 증축/설치 꼬장에 사용. 기동성 부족 및 물몸으로 인해 본대합류 이슈가 있음. 전투에 합류할 경우 본대보다는 특임조 같은경우로 포지션을 선진입 포지션으로 잡아 강 : 핏빛재앙을 이용한 cc 셔틀로 사용함.
            </p>
          </div>
        </div>

        {/* 솔라레 */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 p-6 rounded-xl mb-6 border border-blue-400/30 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">🌟</span>
            </div>
            <h3 className="text-blue-200 text-xl font-bold">솔라레</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-slate-200 text-lg leading-relaxed">
              최대한 처음에 조각버프(공+30)을 팀원에게 주고, 근래에 버프를 받은 시전 중 슈퍼아머인 강 멸망의 꿈을 사용해 딜지원. 슬롯 강 :핏빛 재앙을 사용하여 카운터 cc도 가능. 마이크를 사용하며 cc카운트 해주는 식으로 플레이.
            </p>
          </div>
        </div>

        {/* 길드리그 */}
        <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 p-6 rounded-xl border border-purple-400/30 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-500/80 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">🏆</span>
            </div>
            <h3 className="text-purple-200 text-xl font-bold">길드리그</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-slate-200 text-lg leading-relaxed">
              기동성이 부족하기 때문에 현재 탱커 메타인 경우 사실상 픽하는것 자체가 매우 민폐인 클래스. 팀원들이 모두 본인의 발을 맞춰줘야 하는데 그것 자체가 쉽지 않음. 길드리그는 딜러 캐치게임이라서 특수함.
            </p>
          </div>
        </div>
      </div>

      {/* 4. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚡</span> PvP 콤보 및 이니시
        </h2>
        
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-4 rounded-lg border border-amber-400/40 mb-6">
          <p className="text-amber-300 text-base font-semibold">
            ※ 콤보는 참고용으로, 상황에 따라 유연하게 사용하시면 됩니다.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* PvP 콤보 */}
          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 p-6 rounded-xl border border-purple-400/30 shadow-lg">
            <h3 className="text-purple-300 text-2xl font-bold mb-4">PvP 콤보</h3>
            <div className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-600/50 mb-6" onClick={() => setSelectedImage('/tip-images/전승소서러pvp.png')}>
              <img src="/tip-images/전승소서러pvp.png" alt="전승 소서러 PvP 콤보" className="w-full h-auto object-contain rounded-lg" />
            </div>

            {/* 1cc 시작 콤보 */}
            <div className="bg-gradient-to-br from-red-900/20 to-rose-900/10 p-4 rounded-xl border border-red-400/30 shadow-lg mb-4">
              <h4 className="text-red-300 text-xl font-bold mb-3">1cc 시작 콤보</h4>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-500/50">
                <p className="text-slate-200 text-base leading-relaxed">
                  <strong className="text-red-400">1cc 시작</strong> (강멸꿈, 까돌-분출, 그불, 해둠, 핏재 1타) - 파도 1타 - 유린쓰면서 긴밤(0.7cc) - 연격 - 극분출(1cc) - 까불 - 부리차기 - 포획 - 심불 - 갈퀴 - 덮어
                </p>
              </div>
            </div>

            {/* 0.7cc 시작 콤보 */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 p-4 rounded-xl border border-blue-400/30 shadow-lg">
              <h4 className="text-blue-300 text-xl font-bold mb-3">0.7cc 시작 콤보</h4>
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-xl border border-slate-500/50">
                <p className="text-slate-200 text-base leading-relaxed">
                  <strong className="text-blue-400">0.7cc 시작</strong> (당멸) - 까돌(진입)- 분출(1cc) - 유린 - 업화1타 - 해둠(1cc) - 까불 - 부리차기 - 포획 - 심불 - 갈퀴 -덮어
                </p>
              </div>
            </div>
          </div>

          {/* 주로 사용하는 진입기 */}
          <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/10 p-6 rounded-xl border border-cyan-400/30 shadow-lg">
            <h3 className="text-cyan-300 text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3 text-3xl">🚀</span> 주로 사용하는 진입기
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/10 p-6 rounded-xl border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500/80 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg font-bold">1</span>
                  </div>
                  <p className="font-semibold text-blue-300 text-xl">진입기 1</p>
                </div>
                <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/40 p-4 rounded-lg border border-slate-500/50">
                  <p className="text-slate-200 text-lg font-medium">덮어(라밤 2차)</p>
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
                  <p className="text-slate-200 text-lg font-medium">강 : 까마귀 돌진(까돌)</p>
                </div>
                <p className="text-slate-300 text-sm mt-2">1cc 시동기는 대부분 까마귀 돌진-분출로 합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 수정 및 특화 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-pink-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> 수정 및 특화
        </h2>
        
        {/* 밸런스 세팅 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-slate-600 shadow-lg">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">밸런스 세팅</h3>
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 p-6 rounded-xl border border-amber-400/40">
            <p className="text-slate-200 text-lg leading-relaxed">
              전승 소서러가 밸런스 세팅을 하는 경우 정말 쓸모 없는 클래스라고 생각합니다. 유일한 장점이 딜인데 딜이 안되면 굳이..?
            </p>
          </div>
        </div>
      </div>

      {/* 7. 하고싶은 말 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-emerald-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💡</span> 하고싶은 말
        </h2>
        
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-slate-600 shadow-lg">
          <div className="text-slate-200 text-lg space-y-4 leading-relaxed">
            <p>
              사실 9월에 복귀후에 현실 이휴로 11월부터 솔라레도, 마클도, 파밍도, 거점/점령도 잘 못하고 있네요.. 분명한 딜적인 장점이 있음에도 불구하고 앞서말한 단점들이 그 부분들을 너무 크게 잡아먹어 현재 있는 유저도 줄고있는 마당입니다.
            </p>
            <p>
              유저가 떠나지 않도록 패치라도 캐릭터 특성에 맞게 해주면 좋겠는데 그 또한 이루어지지 않고 있어서 답답할 따름입니다.. 하지만 확실히 특색있는 클래스이고 손맛이라는 확실한 색채가 있는 클래스라 한번 빠지면 헤어나오기 어렵습니다.
            </p>
            <p className="text-purple-300 font-semibold text-xl mt-6">
              전승소서의 재미에 모두 빠져보세요!
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

