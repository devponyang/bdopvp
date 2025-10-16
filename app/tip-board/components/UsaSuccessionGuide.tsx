'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function UsaSuccessionGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/24', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_24')
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
        await fetch('/api/tip-board/24/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/24/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_24', 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

  // ESC 키로 이미지 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
        setImageScale(1)
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  // 마우스 휠로 이미지 확대/축소
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selectedImage) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setImageScale(prev => Math.max(0.1, Math.min(5, prev + delta)))
      }
    }

    if (selectedImage) {
      document.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      document.removeEventListener('wheel', handleWheel)
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
            <img src="/class-icons/usa.png" alt="전승 우사" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              전승 우사 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "검풍이 전장을 가른다."
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
              <span className="text-gray-300">작성자:</span> <Link href="/guild/너왜시비냐" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">너왜시비냐</Link> 길드 <span className="text-blue-400 font-bold">zrw</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-lg shadow-lg">
              <img src="/class-icons/usa.png" alt="우사" className="w-5 h-5 object-contain" />
              <p className="text-blue-300 font-bold text-sm">
                전승 우사 장인
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
            안녕하세요. <strong className="text-purple-400">너왜시비냐(와플 연맹)</strong>에서 공/거점 및 길드리그 등 각종 PvP 컨텐츠에 열심히 참여하고 있는 우사 유저 <strong className="text-blue-400">zrw</strong>라고 합니다.
          </p>
          <p>
            각종 단체 PvP 컨텐츠에서 오더도 진행하고, 개인컨텐츠인 붉전이나 솔라레에서 상위권을 기록했습니다.
          </p>
          <p>
            가끔씩 치지직에서 <a href="https://chzzk.naver.com/57b66b6b7e84994f6b2cc78aa6ce4aca" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline font-bold inline-flex items-center gap-1"><img src="/tip-images/chzzk.png" alt="치지직" className="w-4 h-4 object-contain" />알떱</a>이라는 이름으로 방송도 진행하며, 최근에 영상을 올리고 있진 않지만 <a href="https://www.youtube.com/@0711zrw" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline font-bold inline-flex items-center gap-1"><img src="/tip-images/youtube11.png" alt="YouTube" className="w-4 h-4 object-contain" />유튜브</a>도 운영 중입니다.
          </p>
        </div>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 전승 우사 클래스의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-green-400">강력하고 넓은 범위의 전방가드 기반의 딜링 스킬 다수 보유</strong></li>
            <li><strong className="text-green-400">광역 마법 방어력+방어력 감소 스킬 보유</strong></li>
            <li><strong className="text-green-400">직관적인 스킬, 어렵지 않은 커맨드 입력, 적당한 APM</strong></li>
            <li><strong className="text-green-400">타 딜러 대비 상대적으로 높은 체급과 유지력</strong></li>
            <li><strong className="text-green-400">전장 진입과 이탈이 매우 자유로움</strong></li>
            <li><strong className="text-green-400">다양한 컨텐츠에서 두루 활약할 수 있는 딜러</strong></li>
            <li><strong className="text-green-400">좋은 흑정령의 분노 100% 스킬 보유</strong></li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-red-400">1대1로 갈수록 한계와 약점이 명확한 스킬 구성</strong></li>
            <li><strong className="text-red-400">고저차와 지형지물에 데미지가 씹히는 스킬이 많음</strong></li>
            <li><strong className="text-red-400">2cc콤보를 사용할 때 필연적으로 맨몸 빈틈이 생김</strong></li>
            <li><strong className="text-red-400">선후딜 캔슬 관계를 모르면 DPS가 매우 크게 떨어짐</strong></li>
            <li><strong className="text-red-400">근접 극딜 캐릭터이므로 포지셔닝에 따라서 생존 여부가 크게 갈림</strong></li>
            <li><strong className="text-red-400">원거리 견제기가 한 개 뿐이고, 뒤를 내어주면 다른 클래스보다 cc에 매우 취약해짐</strong></li>
          </ul>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 거점전 운영법
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-red-300 text-2xl font-bold mb-4">⚔️ 거점전 운영</h3>
          <p className="text-slate-200 text-lg">
            거점 운영법의 가장 기본이 되는 것은 <strong className="text-red-300">스킬 배분과 맵리딩</strong>임
          </p>
          <p className="text-slate-200 text-lg">
            지속적으로 미니맵 혹은 좌우 시야를 살피면서 계속 뒤를 잡는 인원이 있는지 확인해야함
          </p>
          <ul className="text-slate-200 text-lg space-y-2 mt-3">
            <li><strong className="text-green-400">뒤가 안전하면</strong> - 전방가드 스킬</li>
            <li><strong className="text-yellow-400">뒤가 위험하면</strong> - 채널링 슈퍼아머 스킬 쓰면서 좌우 시야 확인</li>
            <li><strong className="text-red-400">상대가 많이 덮치면</strong> - 동이 혹은 양반걸음과 신선걸음으로 버티거나 나비구름으로 탈출</li>
            <li><strong className="text-purple-400">먼저 상대를 덮칠땐</strong> - 묵뢰, 구렁나비, 소낙비 등으로 광역 cc나 방깎으로 구도 만들기</li>
          </ul>
          <p className="text-yellow-300 font-semibold mt-2">⚠️ 이정도의 스킬 배분만 항상 신경쓰고 플레이하면 됨. 따라서 1대1 콤보 같은거에 집착할 필요가 없음</p>
          <p className="text-blue-300 font-semibold mt-3">💡 이동기를 남발하면 매우 오래 버티긴 하지만 지구력이 크게 마름, 이 때 지구력 수치가 20% 이하면 나비구름으로 빠져서 아군이 많은 곳에 합류해 지구력을 최대한 회복</p>
        </div>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-blue-300 text-2xl font-bold mb-4">ㄱ. 신거점</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p>본대 싸움의 중심에 있기엔 너무 몸이 약하고, 사이드로 빠지기엔 cc싸움에서 밀림</p>
            <p>따라서 적당히 교전 중심지와 사이드의 사이쯤 되는 인구 밀도에서 싸우는게 제일 이상적임</p>
            <p>뒤만 안잡히면서 앞에 딜을 계속 넣으면 됨</p>
            <p>신기전, 코끼리, 대포, 화염탑 등에 슈아브레이크 안 당하면서 눕지 않는게 이상적임</p>
            <p className="text-yellow-400 font-semibold">동이우사도 가능하나 개인적으로 오직 킬만을 위해 머리를 박는 것이므로 게임 자체의 재미를 저해한다 생각해서 추천하지 않음 (잘 쓰면 크랙 플레이라고 생각하긴 함)</p>
            <p>신거점에서 전승 우사는 그리 좋은 픽은 아니나, 개인의 역량에 따라 충분히 1인분 이상은 가능하다 생각함</p>
          </div>
        </div>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-green-300 text-2xl font-bold mb-4">ㄴ. 구거점</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p>본대보다는 꼬장조 및 상대 부속 파괴에 특화됨. 따라서 나비구름을 적절히 이용하여 바리케이트를 넘나들며 상대 부속의 체력을 갉아먹는게 중요함</p>
            <p>특히, 화탑 쏘는 타이밍마다 양반걸음 혹은 신선걸음을 사용하면 화탑을 한 번도 맞지 않고 지속적으로 부속 타격이 가능함</p>
            <p>주로 목책문이나 바리케이트 등을 등지고 안쪽으로 계속 전방가드 스킬을 사용하면 부속에 지대한 피해를 줄 수 있음</p>
            <p className="text-green-400 font-semibold">개인적으로 구거점에서 더 좋은 클래스가 전승우사라고 생각함</p>
          </div>
        </div>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-orange-300 text-2xl font-bold mb-4">ㄷ. 공성전</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p>구거점과 마찬가지로 전승우사가 신거점보다 더 활약하기 편함</p>
            <p>공성전에서도 여전히 꼬장히 좋지만 지역에 따라 본대 힘싸움이 더 나은 경우도 있음</p>
            <ul className="ml-4 space-y-2">
              <li><strong className="text-blue-400">발렌시아</strong> - 부속 꼬장이 더 좋음</li>
              <li><strong className="text-red-400">칼페온</strong> - 본대 힘싸움이 더 좋음</li>
              <li><strong className="text-purple-400">메디아</strong> - 외성문만 부수고 나면 뭘 하든 비슷함(빨리 끝내는데 기여도는 꼬장이 더 좋음)</li>
            </ul>
            <p>부속 꼬장을 하는 경우 위에 작성한 구거점과 비슷하게 플레이 하면 됨. 대신 구거점과 달리 수비 인력과 빌더의 빌딩 수준에 따라서 꼬장 난이도가 크게 달라짐</p>
            <p>본대 힘싸움을 하는 경우는 나비구름을 적극 활용해서 프리딜 하는 원딜들을 잘라먹거나, 빼내기 힘든 자리에 알박기 해서 딜 누적을 하면 됨</p>
          </div>
        </div>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-red-300 text-2xl font-bold mb-4">ㄹ. 수성전</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p className="text-yellow-400 font-semibold">우사로 수성 최고의 효율을 뽑는 방법은 외성문이 뚫리기 전에 각성우사로 플레이 하다가, 외성문이 터지면 전승우사로 프리셋 변경하는 것임(발렌/칼페/메디아 동일)</p>
            <p>기본적으로 앞서 설명한 뒤를 내주지 않고 딜을 한다는 기본 메커니즘과 동일하지만 지형지물이 더 많고, 많은 수의 상대가 끊임없이 들어오기 때문에 소위 꿀자리를 아는게 매우 중요함</p>
            <p className="text-blue-400 font-semibold">우사의 꿀자리는 기본적으로 ㄴ 혹은 ㄷ 모양 벽 사이에서 등을 맞대고 계속 전방으로 스킬을 쓰는 자리임</p>
            <p>대표적인 예시 몇가지로, 칼페온 지휘소 올라가는 계단, 발렌시아 지휘소 올라가는 왼쪽(직선)계단, 메디아 내성부활지 반대편 지붕 옆 첨탑 등이 일반적인 꿀자리</p>
            <p>꿀자리에서 버티기 방법은 피와 전방가드가 많으면 최고의 딜 효율대로 스킬 굴리면됨</p>
            <p>피가 없으면 벽에 머리박고 나비구름 혹은 양반걸음 등의 무적기 사용. 상대가 너무 몰려올 땐 동이 쓰고 버티다가 체력이 좀 깎이면 동이를 풀고 순간적인 딜 버스트 등 유기적으로 플레이 하면 됨</p>
            <p className="text-green-400 font-semibold">수성의 경우 거점과 달리 동이우사가 매우 고효율임. 취향에 맞다면 한 번 해보는 것도 괜찮음</p>
          </div>
        </div>
      </div>

      {/* 4. 솔라레/길드리그/붉전 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-cyan-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> 솔라레 · 길드리그 · 붉은전장 운영법
        </h2>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-cyan-300 text-2xl font-bold mb-4">솔라레의 창</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p>주도적인 cc는 불가능하나 소위 말하는 깜빡이 무적기를 잘 활용하여 상대의 빈틈에 곁차기, 소낙비 등의 cc를 노려볼 수 있음</p>
            <p>거점전과 달리 완벽하게 1대1 콤보와 스킬 선후딜 관계를 잘 숙지하고 있어야함</p>
            <p>소위 딜찍으로만 죽일 수 있는 풀슈아 클래스 상대로 매우 상성이 안좋음. 이유는 이러한 클래스가 보통 전방가드 뚫는 cc를 보유하거나 수싸움에서 우사가 불리함</p>
            <p>항상 잡기를 보유한 클래스와 기싸움은 하지 않되, 적당히 상대의 잡기 패턴을 외워서 적절히 카운터 치는 크랙 플레이도 필요함</p>
            <p>버티기 자체는 좋지만, 너무 자기만의 플레이를 하면 찍히기 쉬운 아군이 먼저 죽어서 3대2가 될 수 있음</p>
            <p className="text-yellow-400 font-semibold">다시말해 우사는 너무 자기 생존에만 신경쓰면, 끝까지 살아남으나</p>
            <p className="text-orange-500 text-xl font-bold">항상 딜량은 높지만 게임은 지는 전형적으로 지표만 좋은 딜러가 되는 함정에 빠질 수 있으니 주의할 것</p>
            <p>이를 방지하기 위해서 2명한테 쫓기는 아군이 있다면 남은 아군과 함께 확실히 상대를 2대1로 압박을 넣거나, 쫓기는 아군에게 스킬을 남발하는 상대의 뒷통수에 위협적으로 계속 압박을 줘야함</p>
            <p className="text-yellow-400 font-semibold">솔라레에서 주도적으로 할 수 없는 약캐임을 인정하되, 최대한 주도적으로 솔라레에서 할 수 있는 운영방법을 체득하면 적당히 높은 점수대에 갈 수 있음</p>
          </div>
        </div>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-purple-300 text-2xl font-bold mb-4">길드리그</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p className="text-green-400 font-semibold">길드리그는 구거점과 공성에 이어 우사가 활약하기 좋은 컨텐츠임</p>
            <p className="text-yellow-400 font-semibold">가장 우선적인 것은 해당 길드의 리그 전략에 맞춰서 행동하는게 좋음. 일단 이 사실이 더 중요함을 명심하고 아래 내용을 보면 됨</p>
            <p>리그는 거점과 달리 킬과 데스가 곧 승리 혹은 패배와 직결되므로 딜러인 우사는 cc에 걸리는 순간 쉽게 죽기 때문에 내 1데스의 영향력이 크다는 점을 늘 명심하고 플레이 해야함</p>
            <p>리그에서 우사는 상성이 괜찮은 딜러 상대가 아니면 절대 cc트라이를 막 갈기지 않는게 좋음. 소낙비와 곁차기를 제외하면 맨몸과 빈틈이 많기 때문에 확실한 각 아니면 두 스킬로 cc를 사용하는게 좋음</p>
            <p>넉다운을 이어야 하는 상황에서는 안전이 보장된게 아니면 스킬 하나를 덜 넣더라도 위치 이동후 물결구름을 사용하는게 이상적임</p>
            <p>리그에서 생존력과 기동성을 극단적으로 끌어올리려면 나비구름을 최대한 끌고, 최대한 자주 사용해야함. 비상시에 지구력이 없다면 마파람, 동이 등을 활용하면서 나비구름 한 번 쓸 각을 만들고 탈출하면 좋음</p>
            <p className="text-green-400 font-semibold">우사의 흑정 100%는 상당히 좋은 편이라 흑정을 받을 수 있으면 팀원에게 어필해서 받는게 좋음. 대신 자원을 받은 만큼 밥값을 해야한다는 점도 꼭 인지해야함</p>
            <p>피드백 과정에서 cc나 딜량 등의 지표에 크게 신경 쓸 필요는 없음.(상대가 지정한 목표 딜러에 따라 지표가 크게 달라지기 때문)그러나 데스가 많으면 즉각적인 피드백을 아군한테 받는게 좋음</p>
            <p>아군이 상대에게 cc기를 걸었을 때 완벽하게 cc상태를 아는게 아니면 절대 묵뢰와 곁차기를 박으면 안됨. 아군의 딜 사이클이 크게 꼬이거나 상대가 살아갈 확률이 올라감</p>
            <p className="text-blue-400 font-semibold">오더가 아니더라도 마이크를 켜고 자신의 상태를 팀원이 알 수 있게 적극적으로 브리핑 해주는게 중요함. ex) 흑정 100%, 컨디션 안좋아서 한 번 빼야함, 딜러 xx위주로 보겠다, 밸셋 oo는 유기하겠다 등등</p>
          </div>
        </div>

        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-red-300 text-2xl font-bold mb-4">붉은전장</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p>우사는 거점전과 길드리그 연습하기에 붉전이 제일 무난함 (아쉽게도 이벤트가 아니면 잘 열리진 않음)</p>
            <p className="text-green-400 font-semibold">빅데이터상으로 붉전에서 잘하는 우사는 보통 다른 컨텐츠에서도 1인분 이상을 잘 했음</p>
            <p>붉전에서 연습할 때 cc에 안 걸리고 선딜 없이 프리스타일로 스킬을 사용하는 것과, 지구력과 체력을 관리하면서 적당히 살아나오는 각을 보는 눈을 기르면 좋음</p>
            <p>발렌시아 붉전의 경우 나비구름으로 지붕 타면서 원딜 자르기, 뭉쳐있는 곳 흑정으로 다수 cc걸기, 소낙비로 cc걸고 위치 이동후 물결구름으로 2cc넣기, 동이로 버티기, 벽 등지고 전가스킬 유지하기 등 다양한 기믹과 운영법을 연습하면 좋음</p>
          </div>
        </div>
      </div>

      {/* 4. PVP 콤보 및 스킬 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚡</span> PVP 콤보 및 스킬
        </h2>

        {/* 4-1. PVP 콤보(소수전) */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-purple-300 text-2xl font-bold mb-4">4-1. PVP 콤보(소수전)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <img src="/tip-images/우사콤보1.png" alt="우사 콤보 1" className="w-full h-auto max-h-96 object-contain rounded" />
            </div>
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <img src="/tip-images/우사콤보2.png" alt="우사 콤보 2" className="w-full h-auto max-h-96 object-contain rounded" />
            </div>
          </div>
          <div className="bg-slate-600/50 p-4 rounded-lg">
            <h4 className="text-yellow-300 text-lg font-bold mb-3">콤보 사용시 참고사항</h4>
            <ul className="text-slate-200 text-lg space-y-2">
              <li>• 발따귀나 3분(나비의꿈) 사용했다면 콤보중에 발따귀 사용할 필요 없음</li>
              <li>• 잡기 클래스 상대로 끝까지 딱 붙어서 스킬 사용하지 말것 (역으로 잡힘)</li>
              <li>• 딜 넣는 중 후방을 노리는 상대가 있다면 전방가드 스킬 대신 슈퍼아머 스킬(나비호령, 나비돌개, 먹구름 등)로 딜링을 할 것</li>
              <li>• 아군이 cc를 걸었을 때 묵뢰로 호응하지 말 것</li>
              <li>• 발따귀는 맨몸이라 생략하더라도, 구렁나비는 1타라도 넣을 것</li>
            </ul>
          </div>
        </div>

        {/* 4-2. PVP 콤보2(다수전) */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-purple-300 text-2xl font-bold mb-4">4-2. PVP 콤보2(다수전)</h3>
          <div className="flex gap-6">
            <div className="w-1/2">
              <div className="flex flex-col">
                <img src="/tip-images/우사콤보3.png" alt="우사 콤보 3" className="w-full h-auto object-contain" />
                <img src="/tip-images/우사콤보4.png" alt="우사 콤보 4" className="w-full h-auto object-contain" />
                <img src="/tip-images/우사콤보5.png" alt="우사 콤보 5" className="w-full h-auto object-contain" />
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full overflow-y-auto">
                <h4 className="text-yellow-300 text-lg font-bold mb-3">스탠딩 콤보 가이드</h4>
                <div className="text-slate-200 text-lg space-y-3">
                  <div>
                    <h5 className="text-blue-300 font-bold mb-2">ㄱ. 스탠딩 콤보란?</h5>
                    <p className="mb-2">우사는 지속딜러로써 매우 우수한 성능을 지니고 있기 때문에</p>
                    <p className="mb-2">CC가 걸리지 않은 상대에게도 지속적으로 가드와 체력 압박을 주어야함</p>
                    <p className="mb-2">따라서 1대1 콤보 뿐만이 아니라, 스탠딩 콤보에 대해서도 숙지하고 있어야 함</p>
                    <p className="mb-2">거점전, 붉은전장, 길드리그, 솔라레의 창 등 거의 모든 컨텐츠에서 사용</p>
                    <div className="bg-slate-700/50 p-2 rounded border-l-4 border-green-400 mb-2">
                      <p className="text-green-300 font-semibold">1대1 콤보 핵심:</p>
                      <p className="text-base">CC연계를 통하여 최대의 딜을 넣어 상대를 죽이는 것</p>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded border-l-4 border-orange-400 mb-2">
                      <p className="text-orange-300 font-semibold">다수전 콤보 핵심:</p>
                      <p className="text-base">안전하게 적당히 딜을 넣고 생존하는 것</p>
                    </div>
                    <p className="text-base">이러한 차이 때문에 이동기를 섞을 수 있도록 콤보 길이도 짧은 편임</p>
                    <p className="text-base">취향에 맞는 콤보 몇개를 선택한 후 특화와 같이 세팅해서 사용하는 것이 일반적</p>
                  </div>
                  
                  <div>
                    <h5 className="text-purple-300 font-bold mb-2">ㄴ. 스탠딩 콤보 구성</h5>
                    <div className="bg-slate-700/50 p-2 rounded mb-2">
                      <p className="text-yellow-300 font-semibold text-lg">기본 개념:</p>
                      <p className="text-lg">스킬 2~3개 묶어쓰고 이동기 - 상황에 맞춰서</p>
                      <p className="text-lg">상대가 잘하면 2개쓰고 이동기, 압박이 없으면 3개쯤 쓰고 이동기</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-blue-300 font-semibold text-base">1) 발따귀 - 방막 (F-Q) / 발따귀-나비구름 (F-Shift-Space):</p>
                        <p className="text-base">진입 전 공격력 +20을 챙기기 위해서 사용하면 습관화 필수</p>
                      </div>
                      
                      <div>
                        <p className="text-green-300 font-semibold text-base">2) 안전한 딜 콤보 (A,B,C 중 하나 선택해서 사용)</p>
                        <div className="ml-2 space-y-3">
                          <div>
                            <p className="text-base"><span className="text-blue-300">A:</span> 사군자:국 - 사군자:난 - 나비호령 - (이동기) - 사군자:매 - 나비돌개</p>
                            <p className="text-base ml-6">이속버프/디버프 먼저 발동, 사군자 : 국 최대 데미지 거리 계산해서 사용가능</p>
                          </div>
                          
                          <div>
                            <p className="text-base"><span className="text-green-300">B:</span> 사군자:난 - 사군자:국 - 나비호령 - (이동기) - 사군자:매 - 나비돌개</p>
                            <p className="text-base ml-6">사군자 : 난 치명타 확률 100% - 특화를 깔끔하게 넣을 수 있음</p>
                          </div>
                          
                          <div>
                            <p className="text-base"><span className="text-purple-300">C:</span> 사군자:국 - 사군자:죽 - 나비호령 - (이동기) - 사군자:난 - 사군자:매 - 나비돌개</p>
                            <p className="text-base ml-6">회피 상대로 좋음, 오른쪽 왼쪽 딜 사이클 모두 밸런스가 좋음, 그러나 에임이 정확해야함</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-orange-300 font-semibold text-base">3) 짧은 에어어택 콤보와 방어+회깎 콤보</p>
                        <div className="ml-2 space-y-1">
                          <p className="text-base">에어어택 + 방깎 : 곁차기 - 구렁나비</p>
                          <p className="text-base">에어어택 + 공버프 : 곁차기 - 발따귀 - 사군자 : 매</p>
                          <p className="text-base">방깎 + 회깎 : 구렁나비 - 사군자 : 죽</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-red-300 font-semibold text-base">4) 단일로 자주 사용하는 스킬</p>
                        <div className="ml-2 space-y-1">
                          <p className="text-base"><span className="text-blue-300">소낙비:</span> 3단계 특화 활성화 + 광역 기절</p>
                          <p className="text-base"><span className="text-green-300">구렁나비:</span> 사군자 스킬과 연계하여 광역 방깎 -55</p>
                          <p className="text-base"><span className="text-purple-300">묵뢰:</span> 먹구름 활용을 통한 마방깎 + 원거리 바운드 + 진입전 2단계 특화 활성화</p>
                          <p className="text-base"><span className="text-orange-300">싹슬바람:</span> 첫 모션은 캔슬이 불가하고 범위가 생각보다 좁음</p>
                          <p className="text-base ml-2">벽을 등지고 사용하거나, 샤이 공속 버프로 다른 스킬들이 쿨일때 사용</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-3. 잠금 스킬 및 라밤 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-purple-300 text-2xl font-bold mb-4">4-3. 잠금 스킬 및 라밤</h3>
          
          {/* 1번째 사진 - 잠금 스킬 */}
          <div className="flex gap-6 mb-6">
            <div className="w-1/2">
              <img src="/tip-images/우사잠금.png" alt="우사 잠금 스킬" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <h4 className="text-blue-300 text-xl font-bold mb-3">잠금 스킬</h4>
                <div className="bg-slate-700/50 p-3 rounded border-l-4 border-blue-400">
                  <ul className="space-y-2 text-slate-200 text-lg">
                    <li><strong className="text-green-300">밑둥가르기*</strong></li>
                    <li><strong className="text-green-300">연:발따귀</strong></li>
                    <li><strong className="text-green-300">장못치기</strong></li>
                    <li><strong className="text-green-300">회피이동</strong></li>
                  </ul>
                  <p className="text-base text-yellow-300 mt-2">
                    *밑둥가르기는 마그누스 스킬 습득 시 커맨드 발동 안됨
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2번째 사진 - 퀵 슬롯 */}
          <div className="flex gap-6 mb-6">
            <div className="w-1/2">
              <img src="/tip-images/우사퀵슬롯.png" alt="우사 퀵슬롯" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <h4 className="text-purple-300 text-xl font-bold mb-3">퀵 슬롯</h4>
                <div className="bg-slate-700/50 p-3 rounded border-l-4 border-purple-400">
                  <ul className="space-y-2 text-slate-200 text-lg">
                    <li><strong className="text-green-300">나비의 꿈</strong></li>
                    <li><strong className="text-green-300">흐드러지게 핀 봄</strong></li>
                    <li><strong className="text-green-300">나비구름</strong></li>
                    <li><strong className="text-green-300">구름꽃*</strong></li>
                  </ul>
                  <p className="text-base text-yellow-300 mt-2">
                    *구름꽃은 사용 빈도가 매우 낮으므로 필요에 따라 슬롯에 올리세요
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3번째 사진 - 기술 심화(라밤) */}
          <div className="flex gap-6">
            <div className="w-1/2">
              <img src="/tip-images/우사라밤.png" alt="우사 라밤" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <h4 className="text-orange-300 text-xl font-bold mb-3">기술 심화(라밤)</h4>
                <div className="bg-slate-700/50 p-3 rounded border-l-4 border-orange-400">
                  <ul className="space-y-2 text-slate-200 text-lg">
                    <li><strong className="text-green-300">나비둥지</strong></li>
                    <li><strong className="text-green-300">물결구름</strong></li>
                    <li><strong className="text-green-300">흐드러지게 핀 봄</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-4. PVP 스킬 관련 참고사항 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-purple-300 text-2xl font-bold mb-4">4-4. PVP 스킬 관련 참고사항</h3>
          
          {/* 1번째 사진 - 주요 스킬 범위 (텍스트 없음) */}
          <div className="mb-6 flex justify-center">
            <img src="/tip-images/우사범위.png" alt="우사 범위" className="w-3/4 h-auto object-contain" />
          </div>

          {/* 2번째 사진 - 전방 가드(사군자) 스킬 */}
          <div className="flex gap-6 mb-6">
            <div className="w-1/2">
              <img src="/tip-images/우사전가.png" alt="우사 전가" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <h4 className="text-blue-300 text-xl font-bold mb-3">ㄱ. 전방 가드(사군자) 스킬</h4>
                <div className="bg-slate-700/50 p-3 rounded border-l-4 border-blue-400">
                  <ul className="space-y-2 text-slate-200 text-lg">
                    <li><strong className="text-green-300">사군자 : 매(S+LMB)</strong> - 높은 피흡 + 짧은 거리 + 선딜은 없지만 후딜 캔슬도 불가능</li>
                    <li><strong className="text-green-300">사군자 : 난(Shift+E)</strong> - 넓은 범위 + 다운스매시</li>
                    <li><strong className="text-green-300">사군자 : 국(Shift+F)</strong> - 이속 버프/디버프 + 상대 위치에 따라 매우 강력한 딜</li>
                    <li><strong className="text-green-300">사군자 : 죽(W+E)</strong> - 죽편 연계시 매우 강력한 딜 + 회깎 12</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3번째 사진 - 슈퍼 아머 스킬 */}
          <div className="flex gap-6 mb-6">
            <div className="w-1/2">
              <img src="/tip-images/우사슈아.png" alt="우사 슈아" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <h4 className="text-purple-300 text-xl font-bold mb-3">ㄴ. 슈퍼 아머 스킬</h4>
                <div className="bg-slate-700/50 p-3 rounded border-l-4 border-purple-400">
                  <p className="text-slate-200 text-lg mb-3">
                    뒤에서 날아올 수 있는 상대의 CC기를 무시하면서 정면에 있는 적을 타격하거나, 이동기와 섞어 쓰며 지구력 관리에 용이하나 쿨타임이 긴 편
                  </p>
                  <ul className="space-y-2 text-slate-200 text-lg">
                    <li><strong className="text-green-300">나비돌개(Shift + LMB)</strong> : 채널링 + 강력한 데미지</li>
                    <li><strong className="text-green-300">나비둥지(Shift + X)</strong> : 채널링 + 약한 데미지</li>
                    <li><strong className="text-green-300">먹구름(Shift + RMB)</strong> : 긴 채널링 + 적당한 데미지 + 상대 공격력 20 감소</li>
                    <li><strong className="text-green-300">소낙비(Shift + Q)</strong> : 긴 채널링 + 적당한 데미지 + 슈아 CC(기절)</li>
                    <li><strong className="text-green-300">나비호령(C)</strong> : 유일하게 채널링 아님 + 슈아끌기 가능 + 가드 20% 감소</li>
                  </ul>
                  <div className="mt-3 space-y-1 text-sm text-yellow-300">
                    <p>1) 슈퍼아머 유지가 목적이면 나비둥지 &gt; 먹구름-낙뢰 &gt; 나비돌개 &gt; 소낙비 순서로 사용. 이동기를 꼭 섞어줄 것</p>
                    <p>2) 소낙비의 경우 유일한 슈아 CC이기 때문에 빈틈을 노리거나 3단계 특화를 켜는 용도로 사용</p>
                    <p>3) 나비호령은 슈아끌기도 가능하지만 딜링 스킬로도 준수하기에 슈아 유지보다 딜콤보에 함께 섞어 쓰는것이 더 좋음</p>
                    <p>4) 나비돌개도 나비호령과 마찬가지로 뒤가 위험할 때 딜링 스킬로 이용</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4번째 사진 - CC 스킬 */}
          <div className="flex gap-6">
            <div className="w-1/2">
              <img src="/tip-images/우사cc.png" alt="우사 CC" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <h4 className="text-orange-300 text-xl font-bold mb-3">ㄷ. CC 스킬</h4>
                <div className="bg-slate-700/50 p-3 rounded border-l-4 border-orange-400">
                  <p className="text-slate-200 text-lg mb-3">
                    전반적으로 상대에게 위협적인 CC스킬이 부족하여 아군에게 의존하는 경우가 많지만 교전에서 상황에 맞는 CC기를 넣을 줄 알아야 고점을 높일 수 있음
                  </p>
                  <ul className="space-y-2 text-slate-200 text-lg">
                    <li><strong className="text-green-300">소낙비(Shift + Q)</strong> : 광역, 즉발, 전방향 기절로 사용하기 쉽고 강한 CC기</li>
                    <li><strong className="text-green-300">곁차기(W + RMB)</strong> : 근거리 +1, 2타격 띄우기 + 에어스메시<br/>
                    <span className="text-sm text-yellow-300">소낙비가 쿨일때 유일하게 리스크를 줄이면서 상대를 카운터 치는 용도</span></li>
                    <li><strong className="text-green-300">묵뢰(S+E)</strong> : 중거리~원거리 + 바운드 + 먹구름 설치 + 맨몸<br/>
                    <span className="text-sm text-yellow-300">근접에서 사용시 매우 위험하며 특화를 켜는 용도로도 자주 사용</span></li>
                    <li><strong className="text-green-300">물결구름(Shift + Z)</strong> : 근거리~중거리 + 넉다운 + 맨몸<br/>
                    <span className="text-sm text-yellow-300">범위도 넓고 선후딜도 길지 않아서 2cc로 가장 많이 사용</span></li>
                    <li><strong className="text-green-300">밑치기(E)</strong> : 근거리 + 넉다운 + 맨몸 + 매우 짧은 시전시간<br/>
                    <span className="text-sm text-yellow-300">짧은 덕분에 교전 중 2CC를 잇거나, 콤보중 공 버프를 받을 때 사용</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 전장 진입과 이탈 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🦋</span> 전장 진입과 이탈
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg mb-4">
            전장 진입과 이탈의 핵심은 <strong className="text-indigo-300">나비구름</strong>
          </p>
          <p className="text-slate-200 text-lg mb-4">
            쿨타임은 10초이고 최대한 끌면 4초간 사용하므로 6초만 시간을 벌면 다시 나비구름 쿨이 돎
          </p>
          <p className="text-slate-200 text-lg mb-4">
            따라서 이 6초간 딜타임을 갖되, 전방가드 스킬 사용시 뒤를 내어주지 않고, 상대가 나의 뒤를 노린다면 슈퍼아머 위주의 딜링을 할 것
          </p>
          <p className="text-slate-200 text-lg mb-4">
            앞서 설명했듯이 스킬이 나에게 집중되면 동이를 사용하거나 양반걸음/신선걸음을 사용해 딜을 적절히 흘리면 됨
          </p>
          <p className="text-slate-200 text-lg mb-4">
            이렇게 나비구름이 다시 쿨이 돈다면 전장 상황을 살펴보고 더 전투할 수 있다면 그대로 진행하고, 불가하다면 다시 나비구름으로 탈출하면 됨
          </p>
          <p className="text-slate-200 text-lg">
            이후 안전한 곳에서 지구력을 회복하고 이렇게 진입과 이탈을 무한히 반복 수행할 수 있음
          </p>
        </div>

        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <h3 className="text-indigo-300 text-xl font-bold mb-4">참고사항</h3>
          <ul className="text-slate-200 text-lg space-y-2">
            <li>• 나비구름으로 진입 전에는 발따귀를 꼭 써줄 것</li>
            <li>• 국을 사용하면 이속버프가 들어오는데 이는 나비구름 초반부 슈아구간 속도를 매우 빨라지게 함</li>
            <li>• 슬롯으로 나비구름을 사용하면 불퇴/성채 부활시 무기를 바로 뽑을 수 있음(무기 접혔을 때도 사용)</li>
            <li>• 슬롯으로 나비구름을 사용하면 커맨드가 꼬여서 점프가 나가는 일이 없음</li>
          </ul>
        </div>
      </div>

      {/* 6. 특화 및 수정 등 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-pink-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> 특화 및 수정 등
        </h2>
        
        {/* 특화 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">특화</h3>
          <div className="flex gap-6">
            <div className="w-1/2">
              <img src="/tip-images/우사특화.png" alt="우사 특화" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <div className="text-slate-200 text-lg space-y-3">
                  <p>
                    제일 중요한 것은 <strong className="text-pink-300">자신의 스킬 패턴을 파악</strong>해서 그에 맞게 특화를 해야함
                  </p>
                  <p>
                    영상 녹화 해서 돌려보며 pvp시 자신이 잘 맞추고 자주쓰는 스킬과 그렇지 못한 스킬 구분해서 항상 특화가 켜져있도록 개인에 맞게 세팅할 것
                  </p>
                  <p>
                    특화는 <strong className="text-green-300">방증, 공시속, 방깎, 치피/다운어택, 적중</strong>만 챙기면되지 어느 슬롯에 넣는지는 본인의 자유임
                  </p>
                  <p className="text-yellow-300 font-semibold">
                    단, 진: 나비돌개 사용시 치확 30% 꼭 달아줄 것
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수정 */}
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <h3 className="text-pink-300 text-2xl font-bold mb-4">수정</h3>
          <div className="flex gap-6">
            <div className="w-1/2">
              <img src="/tip-images/우사수정.png" alt="우사 수정" className="w-full h-auto object-contain" />
            </div>
            <div className="w-1/2">
              <div className="bg-slate-600/50 p-4 rounded-lg h-full flex flex-col justify-center">
                <div className="text-slate-200 text-lg space-y-3">
                  <p>
                    여기서 필요에 따라 본인 장비 스펙 기반으로 공구간 최대효율 계산하여
                  </p>
                  <p>
                    <strong className="text-green-300">강 새벽의 수정-적중</strong>을 <strong className="text-yellow-300">0/2/4/6 개 혹은 1/3/5</strong>로 적중세팅 준비해두고 필요에 따라 매크로(alt+지정키)로 스왑하면서 사용. <strong className="text-yellow-300">0/3/6</strong> 이런식으로 해도 됨
                  </p>
                  <p>
                    <strong className="text-blue-300">광명석&유물:</strong> 데키아 유물 고정+서리방패 // 부패(모추뎀)은 길드 단위 경쟁 컨텐츠가 아닐때만 재미로 사용함
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. 하고싶은 말 혹은 팁 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-emerald-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고싶은 말 혹은 팁
        </h2>
        
        {/* 팁 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-emerald-300 text-2xl font-bold mb-4">팁</h3>
          <div className="text-slate-200 text-lg space-y-3">
            <p>
              우사는 <strong className="text-red-300">소수전에서 별로임</strong>. <strong className="text-green-300">다수전에선 좋음</strong>. 벽이나 담벼락 같은 지형지물이 많을 수록 좋음.
            </p>
            <p>
              콤보는 참고하되, <strong className="text-emerald-300">프리스타일로 적재적소에 연속적으로 스킬 쓸 수 있도록 연습 많이 해야함</strong>
            </p>
            <p>
              상대 시야의 사각을 파고드는 플레이를 계속해야하고, 깜빡이 클래스의 장점을 살려 적극적으로 뒤잡기 및 전장 진입이탈을 시도해야함
            </p>
            <p>
              <strong className="text-yellow-300">진: 나비돌개가 강: 나비돌개보다 강력함</strong>
            </p>
            <p>
              <strong className="text-blue-300">우사의 기본이자 정점은 나비구름이라고 생각함</strong>
            </p>
          </div>
        </div>

        {/* 마지막으로 하고싶은 말 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-emerald-300 text-2xl font-bold mb-4">마지막으로 하고싶은 말</h3>
          <div className="text-slate-200 text-lg space-y-4">
            <p>
              PvE, PvP를 막론하고 여러 컨텐츠 두루두루 하고싶다면 이만한 클래스가 몇 없습니다. 그러나 1대1에서 정점을 찍고 싶다면 다른 클래스를 하는 것을 추천드립니다.
            </p>
            <p>
              전승 우사는 PvP에 입문하는 발판이 되어주기에 좋고, 마스터하기도 쉬운 클래스 중 하나입니다. 공략보고 몇 주만 연습하면 누구나 다 비슷한 숙련도를 낼 수 있습니다.
            </p>
            <p>
              다른 클래스와 달리 딱히 스승 같은 도제식 교육이 없어도 된다는게 하나의 큰 장점이라고 생각합니다.
            </p>
            <p>
              다만, 우사가 아무리 쉬운 클래스라 할지라도 사람은 변화를 싫어하기에 새로운 내용을 배우려고 하면 항상 어렵다고 느끼고 거부감이 듭니다.
            </p>
            <p>
              그러나 우사는 연습하는 만큼 숙련도가 빠르게 오르니 처음에 어렵다고 포기하지 마시고, 조금만 견디면 스킬 사용이 편안하다고 느끼는 시점이 금방 찾아올 것입니다.
            </p>
          </div>
        </div>

        {/* 추천자료 */}
        <div className="bg-gradient-to-r from-slate-700/50 to-blue-900/30 p-6 rounded-xl border border-blue-500/30 shadow-lg">
          <h3 className="text-emerald-300 text-2xl font-bold mb-6 flex items-center">
            <span className="mr-3 text-3xl">📚</span> 추천자료
          </h3>
          <div className="text-slate-200 text-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-600/50 p-4 rounded-lg border border-slate-500 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📝</span>
                  <a href="https://www.inven.co.kr/board/black/5994/2135" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-colors">
                    zrw의 전승우사 pvp 가이드
                  </a>
                </div>
                <p className="text-sm text-gray-400">인벤 공략 게시판</p>
              </div>
              
              <div className="bg-slate-600/50 p-4 rounded-lg border border-slate-500 hover:border-red-400 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <img src="/tip-images/youtube11.png" alt="YouTube" className="w-8 h-8 object-contain" />
                  <a href="https://youtu.be/_qMSAqzbhvU?si=hzmw6OeTuKnByyE8" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-colors">
                    선대의 전승우사 pvp 가이드
                  </a>
                </div>
                <p className="text-sm text-gray-400">YouTube 영상</p>
              </div>
              
              <div className="bg-slate-600/50 p-4 rounded-lg border border-slate-500 hover:border-red-400 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <img src="/tip-images/youtube11.png" alt="YouTube" className="w-8 h-8 object-contain" />
                  <a href="https://youtu.be/C5fOX9PnR9U?si=cTKZ3mBkayDBAbYr" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-colors">
                    짱쿠의 전승우사 장인 초대석
                  </a>
                </div>
                <p className="text-sm text-gray-400">YouTube 영상</p>
              </div>
              
              <div className="bg-slate-600/50 p-4 rounded-lg border border-slate-500 hover:border-red-400 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <img src="/tip-images/youtube11.png" alt="YouTube" className="w-8 h-8 object-contain" />
                  <a href="https://youtu.be/tYhoOznfJnU?si=-uXzRRrStGk4s0Xj" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-colors">
                    REED의 전승우사 pvp 꿀팁
                  </a>
                </div>
                <p className="text-sm text-gray-400">YouTube 영상</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border-l-4 border-yellow-400 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-yellow-300 font-semibold mb-2">참고사항</p>
                  <p className="text-sm mb-2">
                    위 자료들 모두 다 좋으나 <strong className="text-green-300">콤보나, 운영법 등만 참고</strong>하세요. 
                    <strong className="text-red-300">특화나 수정은 많이 바뀌어서 의미가 없습니다.</strong>
                  </p>
                  <p className="text-sm mb-2">
                    그 외에도 영상 찾아보시는 분들은 의미없는 지루한 부분만 편집된 <strong className="text-blue-300">풀영상 위주</strong>로 보시는 것을 추천드립니다.
                  </p>
                  <p className="text-sm">
                    과정이 너무 짧은 매드무비 혹은 montage 형식은 큰 도움이 되지 않을 수도 있습니다. (재미로만 보세요)
                  </p>
                </div>
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
