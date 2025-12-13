'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function MaeguSuccessionGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  // 이미지 확대/축소 핸들러
  useEffect(() => {
    if (!selectedImage) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setImageScale((prev) => Math.max(0.5, Math.min(3, prev + delta)))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
        setImageScale(1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  useEffect(() => {
    setImageScale(1)
  }, [selectedImage])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/19', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_19')
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
        await fetch('/api/tip-board/19/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/19/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_19', 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

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
              <img src="/class-icons/magu.png" alt="전승 매구" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                전승 매구 클래스 가이드
              </h1>
            </div>
            <p className="text-xl text-slate-200">
              "붉은 여우불이 춤추면, 세상이 환몽(幻夢)으로 물든다."
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
            src="/tip-images/2025-11-29_133529971.JPG" 
            alt="퇴마록님" 
            className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedImage('/tip-images/2025-11-29_133529971.JPG')}
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
                <span className="text-gray-300">작성자:</span> <Link href="/guild/Ctrl" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">Ctrl</Link> 길드 <span className="text-blue-400 font-bold">퇴마록</span> 님
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-lg shadow-lg">
                <span className="text-xl">💎</span>
                <p className="text-purple-300 font-bold text-sm">
                  마스터 클래스 - 매구 우승자
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
            안녕하세요 전승 매구를 플레이하고있는 <strong className="text-blue-400">퇴마록</strong>이라고합니다
          </p>
        </div>

        {/* 2. 장단점 */}
        <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3 text-4xl">⚖️</span> 전승 매구 클래스의 장/단점
          </h2>
          
          {/* 장점 */}
          <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
            <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3 text-3xl">✅</span> 장점
            </h3>
            <ul className="text-slate-200 text-lg space-y-3 pl-6">
              <li>분신으로 인해 다른 원거리클래스 대비 <strong className="text-green-400">뛰어난 생존능력</strong>을 가지고있습니다</li>
              <li>몇개의 스킬만으로도 <strong className="text-green-400">슈아유지가 가능</strong></li>
              <li>한풀이(EE), 발톱긋기를 사용해 순간적으로 진입할수있어서 아군이 cc를 건 곳에 <strong className="text-green-400">딜지원이 매우 용이</strong></li>
            </ul>
          </div>
          
          {/* 단점 */}
          <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
            <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3 text-3xl">⚠️</span> 단점
            </h3>
            <ul className="text-slate-200 text-lg space-y-3 pl-6">
              <li>스킬들의 시전시간이 길어 순간적인 DPS가 낮아 <strong className="text-red-400">1~2초의 짧은 딜교환에는 불리함</strong></li>
              <li>꽃놀이패, 화구 두가지 원거리cc,딜링기가 있지만 <strong className="text-red-400">맨몸에 선딜까지있어 쉽게 노려짐</strong></li>
              <li>다수전에서 2명이상 타격시 20%씩 데미지감소, 최소20% 피해가 들어가기때문에 <strong className="text-red-400">킬을 노리기 쉽지않은점</strong></li>
            </ul>
          </div>
        </div>

        {/* 3. 운영법 */}
        <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3 text-4xl">🎯</span> 거점(RVR) / 솔라레or길드리그(소수전) 운영법
          </h2>
          
          <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              현재 <strong className="text-teal-400">거점</strong>에서는 성채먹을때 머리박기말고 별다른게 없는거 같습니다
            </p>
            
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              <strong className="text-teal-400">솔라레</strong> 에서는 최대한 꽃놀이패 화구 쿨마다 굴려서 데미지를 많이 넣거나
            </p>
            
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              매화/무사/다크나이트/닌자/금수랑 같은 상대적으로 빠른공속의 캐릭들이 있을때는 최대한 <strong className="text-blue-400">슈아기만 굴려 안정적으로 플레이</strong>하고있습니다
            </p>
            
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              솔라레에서 노려지기 쉬운캐릭이기때문에 교전시 <strong className="text-yellow-400">제자리에서 1.5초이상 있지 않으려고 노력</strong>중입니다
            </p>
            
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              최대한 <strong className="text-teal-400">분신과 기만하는덫(s+우클)을 자주사용해 어그로를 뺴거나, 슈아유지 지구력관리</strong>를 하고
            </p>
            
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              상대에 잡기캐릭이 있을경우 캐릭마다 안정거리를 가상으로 설정해서 안정거리 안으로 들어올경우 <strong className="text-purple-400">신령던지기 무적회피</strong>를 사용합니다
            </p>
          </div>

          {/* 특정 클래스 상대법 */}
          <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
            <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3">⚔️</span> 특정 클래스 상대법
            </h3>
            
            <div className="space-y-4">
              <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-cyan-400">
                <h4 className="text-cyan-300 text-xl font-bold mb-3">닌자</h4>
                <p className="text-slate-200 text-base leading-relaxed">
                  기존 닌자들은 어느정도 은신범위가 예측이 가능해서 1:1은 거의 이기는 수준이었지만
                </p>
                <p className="text-slate-200 text-base leading-relaxed mt-2">
                  이번시즌에는 은신이후 달리기가 가능해져서 위치 예측이 거의 불가능합니다 그래서 상대하기 쉽지않았고 
                </p>
                <p className="text-slate-200 text-base leading-relaxed mt-2">
                  이기려는 마음가짐보다는 약간 먼곳에서 최대한 저를 노리게 만들고 슈아스킬만을 사용해서 닌자를 진입하게만든뒤 아군쪽에 합류해 딜링하는식으로 플레이
                </p>
              </div>

              <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-red-400">
                <h4 className="text-red-300 text-xl font-bold mb-3">전승 매화</h4>
                <p className="text-slate-200 text-base leading-relaxed">
                  상대에 전승매화가있다면 일단 <strong className="text-red-300">꽃놀이패,화구,섬돌뚫기 세가지스킬은 거의 봉인</strong>한다 생각해야합니다
                </p>
                <p className="text-slate-200 text-base leading-relaxed mt-2">
                  섬돌같은경우 사용한자리에 분신이남는데 매화가 추격을 사용해 분신남은자리까지와서 편전한방만 쏘면 분신을타도 캐치당하고 안타도 캐치당하는상황이 나옵니다
                </p>
                <p className="text-slate-200 text-base leading-relaxed mt-2">
                  그리고 근접상황에서 전방 꽃자욱 vs 붉은달 서로 동시에쓰면 꽃자욱이 뚤리기때문에 조심해야 합니다
                </p>
              </div>

              <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-orange-400">
                <h4 className="text-orange-300 text-xl font-bold mb-3">무사/매화</h4>
                <p className="text-slate-200 text-base leading-relaxed">
                  무사/매화 같은경우 공격템포가 아주빠르고 옆장찌,이리오너라 같은스킬로 매구의 전방가드스킬인 <strong className="text-orange-300">발톱빗 혼비백산을 카운터칠수있어</strong> 사용할때 주의가 필요합니다
                </p>
              </div>
            </div>
          </div>

          {/* 넋두리 팁 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-yellow-400 text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3">💡</span> 넋두리 팁
            </h3>
            <p className="text-slate-200 text-lg leading-relaxed">
              이번시즌 <strong className="text-yellow-400">넋두리(Shift+C)의 슈아시간이 엄청짧아진건지</strong> 넋두리이후 귀신회오리쓰려고하는데 자꾸 cc를 걸리더라고요
            </p>
            <p className="text-slate-200 text-lg leading-relaxed mt-2">
              그래서 넋두리는 <strong className="text-yellow-400">초반 공버프땡기는용으로만 사용</strong>
            </p>
          </div>
        </div>

        {/* 4. PVP 콤보 */}
        <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-pink-500">
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3 text-4xl">🎮</span> PVP 콤보
          </h2>
          
          <div className="space-y-6">
            {/* 원거리 콤보 */}
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
              <h3 className="text-pink-400 text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">🏹</span> 원거리에서
              </h3>
              
              <div className="space-y-4">
                <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-pink-400">
                  <p className="text-pink-300 font-semibold mb-2 text-lg">콤보 1:</p>
                  <p className="text-slate-200 text-base font-mono leading-relaxed">
                    꽃자욱(1cc) → 발톱빗 → 급살(0.7) → 화구or꽃놀이패(1cc) → 타오르는령,한풀이(ee로 진입) → 여우놀음 → 천도의춤 → 귀신회오리
                  </p>
                </div>

                <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-pink-400">
                  <p className="text-pink-300 font-semibold mb-2 text-lg">콤보 2:</p>
                  <p className="text-slate-200 text-base font-mono leading-relaxed">
                    화구or꽃놀이패 → 발톱빗 → E-E 진입 or 발톱긋기 → 여우놀음 → 급살 → 꽃자욱 or 귀천(기술심화 기절) → 천도의춤 → 귀신회오리
                  </p>
                </div>
              </div>
            </div>

            {/* 근거리 콤보 */}
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
              <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">⚔️</span> 근거리에서 cc캐치
              </h3>
              
              <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-red-400">
                <p className="text-red-300 font-semibold mb-2 text-lg">콤보:</p>
                <p className="text-slate-200 text-base font-mono leading-relaxed">
                  꽃자욱 → 발톱빗 → 여우놀음 → 급살 → 화구or꽃놀이패 → 타오르는령,한풀이(E-E로 진입) → 여우놀음 → 천도의춤 → 귀신회오리
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 진입기 및 이니시 */}
        <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3 text-4xl">🚀</span> 주로 사용하는 진입기라든가 1cc 시동기 활용법 (이니시)
          </h2>
          
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              대부분 <strong className="text-indigo-400">꽃자욱으로인한 씨씨로시작</strong>하고
            </p>
            
            <p className="text-slate-200 text-lg mb-4 leading-relaxed">
              특별한경우 상대의 전방가드타이밍에 <strong className="text-indigo-400">발톱긋기-귀천 콤보로 cc를 넣고</strong>있습니다
            </p>
            
            <p className="text-slate-200 text-lg leading-relaxed">
              여우놀음이나 꽃놀이패의경우 <strong className="text-indigo-400">우측발톱빗(D+좌클릭)1타이후 사용하면 선딜이제거</strong>되어 나가기때문에 항상 발톱빗이후 사용하고있습니다
            </p>
          </div>
        </div>

        {/* 6. 특화 */}
        <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-amber-500">
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3 text-4xl">⚙️</span> 솔라레 특화 / 거점or길드리그 무제한 특화 및 수정
          </h2>
          
          <div className="space-y-6">
            {/* 수정 이미지 */}
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
              <h3 className="text-amber-400 text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">🔧</span> 수정
              </h3>
              <div className="flex justify-center">
                <img 
                  src="/tip-images/전승매구수정.png" 
                  alt="전승 매구 수정" 
                  className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/전승매구수정.png')}
                />
              </div>
            </div>

            {/* 특화 이미지 */}
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
              <h3 className="text-amber-400 text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">⭐</span> 특화
              </h3>
              <div className="flex justify-center">
                <img 
                  src="/tip-images/전승매구특화.png" 
                  alt="전승 매구 특화" 
                  className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage('/tip-images/전승매구특화.png')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 7. 하고 싶으신 말 */}
        <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-green-500">
          <h2 className="text-white text-3xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-4xl">💬</span> 하고 싶으신 말
          </h2>
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <p className="text-slate-200 text-lg leading-relaxed mb-4">
              전승매구의 특성상 특별한게 별로없기때문에 뭐라 적을지 몰라 좀 오래걸렸네요.. 늦어지게되서 죄송합니다
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              <strong className="text-green-400">꽃놀이패 화구 분산딜좀 줄여줬으면하는 바람</strong>이있고
            </p>
            <p className="text-slate-200 text-lg leading-relaxed mt-2">
              <strong className="text-green-400">전승매구로 사냥도 즐길수있게 버프해줬으면 좋겠습니다.</strong>
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





