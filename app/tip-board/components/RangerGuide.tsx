'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function RangerGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/15', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_15')
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
        await fetch('/api/tip-board/15/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/15/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_15', 'true')
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/class-icons/ranger.png" alt="레인저" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              전승 레인저 클래스 가이드
            </h1>
          </div>
          <p className="text-xl text-slate-200">
            "자연과 하나 되어, 바람의 화살을 쏘다."
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

      {/* 작성자 이미지 */}
      <div className="mb-8 flex justify-center">
        <img 
          src="/tip-images/홍줭.png" 
          alt="홍줭" 
          className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
        />
      </div>

      {/* 작성자 정보 */}
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-800 to-green-900/50 p-6 rounded-2xl mb-8 shadow-2xl border border-green-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
            <span className="text-4xl">✍️</span>
          </div>
          <div>
            <p className="text-white text-xl font-semibold mb-2">
              <span className="text-gray-300">작성자:</span> <Link href="/guild/아지다하카" className="text-purple-400 hover:text-purple-300 underline hover:no-underline transition-colors">아지다하카</Link> 길드 <span className="text-blue-400 font-bold">홍줭</span> 님
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-lg shadow-lg">
              <img src="/class-icons/ranger.png" alt="레인저" className="w-5 h-5 object-contain" />
              <p className="text-green-300 font-bold text-sm">
                전승 레인저 장인
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
          안녕하세요 <strong className="text-purple-400">아지다하카</strong> 길드의 <strong className="text-blue-400">홍줭</strong>입니다!
          <br />
          저보다 잘 하시는 분들이 많은데도 이런 기회를 주셔서 감사하고, 알고있는 지식은 최대한 다 알려드리도록 노력할테니 도움이 되면 좋겠습니다!
        </p>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 전승 레인저 클래스의 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-green-400">원거리 딜링</strong>이 가능하고, <strong className="text-green-400">지형 활용</strong>이 다른 캐릭터들보다 좋은 편이라 포지셔닝이 잘 된다면 <strong className="text-green-400">딜 포텐은 최상위권</strong>.</li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-red-400">주력 딜링기들이 대부분 맨몸</strong>이라 잘 드러눕고 푹찍 당할 수 있음.</li>
            <li>공격쪽 투자 리턴이 높은만큼 <strong className="text-yellow-400">약한 몸덩이</strong>.</li>
          </ul>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 거점 · 솔라레 · 길드리그 운영법
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-yellow-300 text-2xl font-bold mb-4">📝 짧은 요약</h3>
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="text-red-300 text-xl font-bold mb-2">⚔️ 거점 운영</h4>
              <p className="text-slate-200 text-lg">
                앞라인 분들에게 감사하기 <strong className="text-red-300">50%</strong>, 포지션이 <strong className="text-red-300">40%</strong>, 나머지 잡기술과 스킬 활용 등 <strong className="text-red-300">10%</strong>.
              </p>
              <p className="text-yellow-300 font-semibold mt-2">⚠️ 무리한 딜각 = 죽음</p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="text-purple-300 text-xl font-bold mb-2">🌟 솔라레 & 길드리그 등의 소수전</h4>
              <p className="text-slate-200 text-lg mb-2">
                최근 1년 넘게 소수전의 경험이 거의 없다보니 정보를 알려드리기엔 부족함이 많습니다.
              </p>
              <p className="text-slate-200 text-lg">
                뇌피셜로 굴려보자면 <strong className="text-purple-300">방어쪽에 투자를 늘려 드리블의 안정성 높이면서 확실하고 안전한 딜각이 나올때만 딜 하는 방식</strong>으로 운영 할 것 같습니다. 부족한 부분은 추후에 보완하도록 하겠습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 3.1 공통 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔧</span> 3.1 공통
          </h3>
          
          <div className="space-y-6">
            {/* 시야 넓히기 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-cyan-400">
              <h4 className="text-cyan-300 text-xl font-bold mb-3">3.1.1 시야 넓히기</h4>
              <p className="text-slate-200 text-lg mb-2">
                <strong className="text-cyan-300">연맹원, 파티원 이름 끄기 / 이펙트 최소화 / 미니맵 키우기</strong>
              </p>
              <p className="text-slate-200 text-base leading-relaxed">
                화려한 이펙트들을 보면서 해도 좋지만, 눈에 들어오는 정보를 최소화 하면 상대방이 나를 공격하러 오는지, 암살자가 보였는지 등의 구분이 빨라지고, 그로인해 반응속도도 빨라져 <strong className="text-cyan-300">상황 대응과 적군 포커싱(우선적으로 잡아야 할 상대 딜링)</strong>에도 도움이 됩니다.
              </p>
            </div>

            {/* 프레임 올리기 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-3">3.1.2 프레임 올리기</h4>
              <p className="text-slate-200 text-base leading-relaxed mb-2">
                개인의 컴퓨터 사양과 상황에 맞게 프레임을 최대한 올려주는 세팅을 해줘야 합니다.
              </p>
              <p className="text-slate-200 text-base leading-relaxed">
                <strong className="text-blue-300">24.06.13일자 패치로 프레임이 높을수록 증가하던 공속의 증가폭이 줄었지만, 여전히 10% 이상의 차이가 날 수 있어요.</strong>
              </p>
            </div>

            {/* 텀벙이 입기 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-3">3.1.3 텀벙이 입기, 키(커스터 마이징) 키우기</h4>
              <ul className="text-slate-200 text-base space-y-2 pl-4 mb-4">
                <li>• 점프력 상승과 수영속도 증가 펄옷으로 지형 활용에 도움!</li>
                <li>• <strong className="text-green-300">화살이 시작되는 z축이 올라가므로 상대 타격이 가능해져요!</strong></li>
              </ul>
              <div className="flex justify-center">
                <img 
                  src="/tip-images/rangerh.png" 
                  alt="레인저 키 높이 예시" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3.2 딜링 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 3.2 딜링
          </h3>
          
          <div className="space-y-6">
            {/* 기본은 미니맵 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-yellow-400">
              <h4 className="text-yellow-300 text-xl font-bold mb-3">3.2.1 기본은 모든 행동중에 미니맵 보기</h4>
              <p className="text-slate-200 text-base leading-relaxed">
                주력 딜링기들 대부분이 맨몸이라, 툭 치면 드러눕는 경우가 허다하기때문에, <strong className="text-yellow-300">상대를 눕히고 딜을 하는 와중에도 미니맵 보고 냄새 맡기!</strong>
              </p>
            </div>

            {/* 포지션 잡기 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-purple-400">
              <h4 className="text-purple-300 text-xl font-bold mb-3">3.2.2 포지션 잡기</h4>
              <p className="text-slate-200 text-base mb-3">
                <strong className="text-purple-300">전장의 모든 지형 숙지는 필수!</strong> 유리한 지형 선정과 한타 중에도 안전한 딜각 잡을 위치 잡기.
              </p>
              <div className="bg-slate-500/30 p-3 rounded mb-3">
                <p className="text-slate-300 text-sm font-semibold mb-2">예시:</p>
                <p className="text-slate-200 text-sm">미리 거리 벌리기, 아군쪽으로 드리블하기, 구조물 올라가기, 화탑이나 코끼리 주변에 있기 등</p>
              </div>
              <p className="text-slate-200 text-base mb-2">
                거점을 예로들자면 나무 위에서 공격할수 있는 포인트들과, 상대방이 공격하기 어려운 바위 등을 파악해두고 사거리가 어디까지 닿는지도 확인해두시면 좋습니다!
              </p>
              <p className="text-amber-300 text-sm italic">
                💡 연맹 혹은 길드마다 조합과 스타일이 다르기때문에, 여러 시도를 통해 적절한 포지션을 찾아가셔야 합니다!
              </p>
            </div>

            {/* 쿨 상황따라 스킬 사용 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-3">3.2.3 쿨 상황따라 스킬 사용하기</h4>
              <p className="text-slate-200 text-base mb-2">
                정해진 콤보보다 <strong className="text-blue-300">스킬 쿨 상황에 맞게 조합해서 사용하기</strong>(자세한건 PVP 콤보에).
              </p>
              <p className="text-slate-200 text-base">
                연달은 너프와 쿨타임 중 데미지 감소가 적용된 스킬들로 인해, <strong className="text-blue-300">쿨타임 안도는 스킬들 위주로 굴려주는게 강할때가 많아요</strong>.
              </p>
            </div>

            {/* 휠컨 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-3">3.2.4 휠컨</h4>
              
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-5 rounded-lg mb-4 border border-blue-400/40 shadow-lg">
                <p className="text-blue-300 font-semibold mb-2 text-lg">📹 휠컨 실전영상 클립:</p>
                <p className="text-yellow-300 text-sm mb-4 text-center">💡 클릭하시면 새 탭에서 YouTube 클립이 재생됩니다</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 클립 1 */}
                  <a 
                    href="https://youtube.com/clip/UgkxixFXIxXNrZ1AwegEeZxHNcaOaA_gBN_0?si=uVFihKC-ThK6s61V" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg border-2 border-red-600 hover:border-red-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    <div className="relative aspect-video bg-black">
                      {/* 썸네일 이미지 배경 */}
                      <img 
                        src="/tip-images/ranger-clip1.png" 
                        alt="휠컨 예시 클립 1"
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      {/* 오버레이 */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600/90 rounded-full p-4 group-hover:scale-125 transition-transform duration-300 shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* CLIP 배지 */}
                      <div className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">
                        YouTube CLIP
                      </div>
                      {/* 하단 제목 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                        <p className="text-white font-bold text-sm">휠컨 예시 1</p>
                      </div>
                    </div>
                  </a>

                  {/* 클립 2 */}
                  <a 
                    href="https://youtube.com/clip/Ugkxs3f6KKeqb-ktBzvTqcJhumj9QBSsfokc?si=om8bOEX1-ObAp_X_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg border-2 border-red-600 hover:border-red-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    <div className="relative aspect-video bg-black">
                      {/* 썸네일 이미지 배경 */}
                      <img 
                        src="/tip-images/ranger-clip2.png" 
                        alt="휠컨 예시 클립 2"
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      {/* 오버레이 */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600/90 rounded-full p-4 group-hover:scale-125 transition-transform duration-300 shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* CLIP 배지 */}
                      <div className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">
                        YouTube CLIP
                      </div>
                      {/* 하단 제목 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                        <p className="text-white font-bold text-sm">휠컨 예시 2</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              <p className="text-slate-200 text-base mb-3">
                <strong className="text-green-300">목적:</strong> 난간이나 구조물 끝에서 쓰다가 뒤로 밀리기 때문에 바로 아래 적들은 공격 불가! 구조물 위에서 바깃 우직 바모만 쏘는게 아닌, 콤보 활용으로 딜량 높이기!
              </p>
              <p className="text-slate-200 text-base mb-3">
                기능 단축키의 <strong className="text-green-300">"이동중 카메라 시점만 이동"</strong> 단축키를 누른채로 스킬 사용하기(디폴트가 휠클릭이라 휠컨이라 이름붙임)
              </p>
              <p className="text-slate-200 text-base">
                <strong className="text-green-300">전율, 재창조, 강극단명, 바깃, 초바모의 다발화살은 캐릭터 보는 방향으로 써짐</strong>(초바모는 추가3타 + 다발11타, 추가3타는 에임대로 나감)
              </p>
            </div>

            {/* 재창조 공속 자버프 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-indigo-400">
              <h4 className="text-indigo-300 text-xl font-bold mb-3">3.2.5 재창조 공속 자버프</h4>
              <p className="text-slate-200 text-base mb-2">
                안전한 상황에서 <strong className="text-indigo-300">재창조 스킬버프(공속10%, 10초) 굴리기</strong>
              </p>
              <p className="text-yellow-300 text-sm">⚠️ 3분 or 흑정 흡수 등의 다른 스킬버프와는 중첩X</p>
            </div>
          </div>
        </div>

        {/* 3.3 생존 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-green-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🛡️</span> 3.3 생존
          </h3>
          
          <p className="text-slate-200 text-lg mb-4">
            앞서 말한 미니맵 보기와 연결. <strong className="text-green-300">스킬 사용중에도 바로 끊고, 생존기들 사용할 준비</strong>.
          </p>

          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-5 rounded-lg mb-6 border border-blue-400/40 shadow-lg">
            <p className="text-blue-300 font-semibold mb-2 text-lg">📹 생존기 종합 드리블 실전영상 클립:</p>
            <p className="text-yellow-300 text-sm mb-4 text-center">💡 클릭하시면 새 탭에서 YouTube 클립이 재생됩니다</p>
            <a 
              href="https://youtube.com/clip/UgkxEbq0f8g4v0z8NmqqDEySG-BpWydDOFpi?si=Q0sdBaq6Ht4JLAP3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg border-2 border-green-600 hover:border-green-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl block"
            >
              <div className="relative aspect-video bg-black">
                {/* 썸네일 이미지 배경 */}
                <img 
                  src="/tip-images/ranger-clip3.png" 
                  alt="생존 드리블 종합 클립"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-600/90 rounded-full p-4 group-hover:scale-125 transition-transform duration-300 shadow-2xl">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                {/* CLIP 배지 */}
                <div className="absolute top-2 right-2 bg-green-600 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">
                  YouTube CLIP
                </div>
                {/* 하단 제목 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  <p className="text-white font-bold text-sm">생존 드리블 종합</p>
                </div>
              </div>
            </a>
          </div>

          <div className="space-y-6">
            {/* 무적과 슈퍼아머 스킬 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-emerald-400">
              <h4 className="text-emerald-300 text-xl font-bold mb-4">3.3.1 무적과 슈퍼아머 스킬</h4>
              
              <div className="mb-6">
                <p className="text-emerald-300 font-semibold mb-4 text-lg">우선 사용 추천</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                    <div className="h-[28rem] flex items-center justify-center mb-3">
                      <img 
                        src="/tip-images/회피폭발.png" 
                        alt="회피 폭발 사격" 
                        className="rounded-lg max-h-full w-auto border border-slate-400"
                      />
                    </div>
                    <p className="text-emerald-300 text-lg font-bold mb-2">회피 폭발 사격</p>
                    <p className="text-slate-200 text-sm">
                      무적기, 경직 CC가 있어 카운터 가능<br />
                      <strong className="text-emerald-300">회폭 끌기로 무적시간 늘리기 필수!</strong>
                    </p>
                  </div>
                  
                  <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                    <div className="h-[28rem] flex items-center justify-center mb-3">
                      <img 
                        src="/tip-images/엇바.png" 
                        alt="엇갈리는 바람~바람타기" 
                        className="rounded-lg max-h-full w-auto border border-slate-400"
                      />
                    </div>
                    <p className="text-cyan-300 text-lg font-bold mb-2">엇갈리는 바람~바람타기</p>
                    <p className="text-slate-200 text-sm">흐름기 처럼 사용하기.</p>
                  </div>
                  
                  <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                    <div className="h-[28rem] flex items-center justify-center mb-3">
                      <img 
                        src="/tip-images/회피착지1.png" 
                        alt="회피 착지 사격" 
                        className="rounded-lg max-h-full w-auto border border-slate-400"
                      />
                    </div>
                    <p className="text-blue-300 text-lg font-bold mb-2">회피 착지 사격</p>
                    <p className="text-slate-200 text-sm">
                      회폭과 엇갈~바람, 초바모 중<br />
                      순간 무적이 필요할때도 사용 가능.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-yellow-300 font-semibold mb-3 text-lg">후순위 사용 추천</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-500/30 p-4 rounded">
                    <p className="text-white font-semibold mb-2 text-base">🔸 하늘의 부름 + 공중 폭발 사격</p>
                    <p className="text-slate-200 text-base mb-2">
                      위의 세 가지 스킬이 다 쿨타임이라면 하늘의 부름(이하 하부.)활용. 하늘의 부름은 <strong className="text-yellow-300">무쿨 슈아지만 끝판정이 살짝 비어있고</strong>, 최근 낙하모션 패치를해도 낙하 모션이 왕왕 발생하기 때문에 고지대→저지대에선 낙하모션 조심.
                    </p>
                    <p className="text-slate-200 text-base mb-2">
                      한턴이라도 안전하게 가져가려면 <strong className="text-yellow-300">"하부+공중 폭발 사격+하부"</strong> 까진 슈아 유지가능. 이후 w+우클 유지한 상태면 네번째 점프에 회폭이 빠지게됨(쿨타임 고려 할 것)
                    </p>
                    <p className="text-amber-300 text-base italic">💡 쿨 계산이 어렵다면 하늘의 부름 단타로 끊어쓰기.</p>
                  </div>
                  
                  <div className="bg-slate-500/30 p-4 rounded">
                    <p className="text-white font-semibold mb-2 text-base">🔸 바람모아쏘기 차징</p>
                    <p className="text-slate-200 text-base mb-2">
                      제자리와 이동중에도 <strong className="text-yellow-300">풀슈아 가능+카운터(넉백or넉다운) 가능</strong>.
                    </p>
                    <p className="text-slate-200 text-base mb-2">
                      (날먹(?)이지만 근접캐들 붙어서 비벼질때 스킬 모션 끝판정 보고 쓰면 가속이 걸려 cc가 들어가는걸 노려볼수도 있음.)
                    </p>
                    <p className="text-slate-200 text-base">
                      회폭, 엇갈~바람, 회피착지가 쿨일때 하부 쓰다가 바로 바모 차징하는식으로도 사용 가능.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 전방가드 스킬 */}
            <div className="bg-slate-600/50 p-5 rounded-lg border-l-4 border-orange-400">
              <h4 className="text-orange-300 text-xl font-bold mb-4">3.3.2 전방가드 스킬</h4>
              
              <p className="text-slate-200 text-base mb-4">
                무적, 슈아 굴리면서 드리블중에 피가 적어 위험하거나, 스킬 쿨일때 <strong className="text-orange-300">전방가드로 턴 버는 식으로 사용</strong>.
              </p>
              <p className="text-yellow-300 text-sm mb-4">⚠️ 전가 뚫거나, 빠른 뒤잡 캐릭들 상대로는 전가로 대치하는 상황은 지양하기.</p>

              <div className="space-y-4">
                {/* 1줄: 강극단명, 전율 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                    <div className="h-[28rem] flex items-center justify-center mb-3">
                      <img 
                        src="/tip-images/단명.png" 
                        alt="강극단명" 
                        className="rounded-lg max-h-full w-auto border border-slate-400"
                      />
                    </div>
                    <p className="text-orange-300 text-lg font-bold mb-2">강극단명</p>
                    <p className="text-slate-200 text-sm">
                      전가 유지 + 퀵 슬롯(필수!)에 두고 사용시 바로 사용가능
                    </p>
                  </div>
                  
                  <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                    <div className="h-[28rem] flex items-center justify-center mb-3">
                      <img 
                        src="/tip-images/전율.png" 
                        alt="전율" 
                        className="rounded-lg max-h-full w-auto border border-slate-400"
                      />
                    </div>
                    <p className="text-red-300 text-lg font-bold mb-2">전율</p>
                    <p className="text-slate-200 text-sm">방깎으로도 사용 가능</p>
                  </div>
                </div>
                
                {/* 2줄: 2차 라밤 */}
                <div className="bg-slate-600 p-4 rounded-lg shadow-lg border border-slate-500">
                  <p className="text-purple-300 text-2xl font-bold mb-4 text-center">2차 라밤</p>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 mb-4 items-center">
                    <div className="flex flex-col items-center">
                      <div className="h-[28rem] flex items-center justify-center mb-2">
                        <img 
                          src="/tip-images/울림.png" 
                          alt="울림의 화살" 
                          className="rounded-lg max-h-full w-auto border border-slate-400"
                        />
                      </div>
                      <p className="text-purple-300 text-base font-bold mb-2">울림의 화살</p>
                      <p className="text-slate-200 text-sm text-center">전방 가드</p>
                    </div>
                    <div className="hidden md:flex items-center justify-center px-4">
                      <p className="text-yellow-300 text-base font-bold whitespace-nowrap">취향대로 선택</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-[28rem] flex items-center justify-center mb-2">
                        <img 
                          src="/tip-images/휘몰아.png" 
                          alt="휘몰아치는 화살" 
                          className="rounded-lg max-h-full w-auto border border-slate-400"
                        />
                      </div>
                      <p className="text-purple-300 text-base font-bold mb-2">휘몰아치는 화살</p>
                      <p className="text-slate-200 text-sm text-center">맨몸, 막타 넉다기</p>
                    </div>
                  </div>
                  <p className="text-slate-200 text-base text-center md:hidden">
                    취향대로 선택
                  </p>
                </div>
                
                {/* 3줄: 3차 라밤 */}
                <div className="bg-slate-600 p-4 rounded-lg shadow-lg border border-slate-500">
                  <p className="text-indigo-300 text-2xl font-bold mb-4 text-center">3차 라밤</p>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 mb-4 items-center">
                    <div className="flex flex-col items-center">
                      <div className="h-[28rem] flex items-center justify-center mb-2">
                        <img 
                          src="/tip-images/바람의지.png" 
                          alt="바람을 타는 의지" 
                          className="rounded-lg max-h-full w-auto border border-slate-400"
                        />
                      </div>
                      <p className="text-indigo-300 text-base font-bold mb-2">바람을 타는 의지</p>
                      <p className="text-slate-200 text-sm text-center">
                        전가 유지+ 넉다운<br />
                        바깃이랑 모션이 똑같아 낚시용으로도 사용 가능
                      </p>
                    </div>
                    <div className="hidden md:flex items-center justify-center px-4">
                      <p className="text-yellow-300 text-base font-bold whitespace-nowrap">취향대로 선택</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-[28rem] flex items-center justify-center mb-2">
                        <img 
                          src="/tip-images/바람폭발.png" 
                          alt="바람 폭발 사격" 
                          className="rounded-lg max-h-full w-auto border border-slate-400"
                        />
                      </div>
                      <p className="text-indigo-300 text-base font-bold mb-2">바람 폭발 사격</p>
                      <p className="text-slate-200 text-sm text-center">생존기 늘리기, 끝슈아 비어있음</p>
                    </div>
                  </div>
                  <p className="text-slate-200 text-base text-center leading-relaxed md:hidden">
                    취향대로 선택
                  </p>
                </div>
                
                {/* 4줄: 우직, 초바모 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                    <div className="h-[28rem] flex items-center justify-center mb-3">
                      <img 
                        src="/tip-images/우직.png" 
                        alt="우직한 칼날바람" 
                        className="rounded-lg max-h-full w-auto border border-slate-400"
                      />
                    </div>
                    <p className="text-blue-300 text-lg font-bold mb-2">우직한 칼날바람</p>
                    <p className="text-slate-200 text-sm">상시로 쿨 돌고있는 수준이라 추가 설명 없음.</p>
                  </div>
                  
                  <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
                    <div className="h-[28rem] flex items-center justify-center mb-3">
                      <img 
                        src="/tip-images/초바모.png" 
                        alt="초 바람 모아쏘기" 
                        className="rounded-lg max-h-full w-auto border border-slate-400"
                      />
                    </div>
                    <p className="text-green-300 text-lg font-bold mb-2">강 : 초 바람 모아쏘기</p>
                    <p className="text-slate-200 text-sm">상시로 쿨 돌고있는 수준이라 추가 설명 없음.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-red-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚔️</span> 4. PVP 콤보
        </h2>

        {/* 주 사용 풀콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4">주 사용 풀콤보</h3>
          
          <div className="bg-red-900/20 p-4 rounded-lg mb-4 border border-red-400/30">
            <p className="text-white font-semibold mb-2">콤보:</p>
            <p className="text-slate-200 text-lg">
              단명(1cc,넉다운) - 우직 - 캔슬길여바(2cc,넉다운) - 선회 - 숨찢 - 초바모 - 옭아 - 숨찢질풍(1차라밤)
            </p>
          </div>

          <div className="bg-blue-900/20 p-4 rounded-lg mb-4 border border-blue-400/30">
            <p className="text-blue-300 font-semibold mb-2">커맨드:</p>
            <p className="text-slate-200 font-mono text-sm break-all">
              W(Q)좌클 - E 좌클 - 좌클유지중 SHIFT - SHIFT 누르자마자 우클릭 추가 - S먼저!누르고 E 빠르게 따닥+좌클 - SPACE - F - SHIFT+X
            </p>
          </div>

          <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-400/30">
            <p className="text-amber-300 text-base leading-relaxed">
              ⚠️ 주 사용 풀콤을 먼저 알려드리긴 했지만, <strong>단명/우직/초바모 등은 스킬 쿨이 거의 상시로 돌아가기때문에</strong> 남아있는 길여바/숨찢/옭아 등의 스킬을 연계하기 위한 선행이 필요해요. 앞에서 말한대로 <strong>쿨 돌고있는 스킬을 쓰는거보다, 준비된 스킬 쓰는게 더 쎈 상황들이 많아요</strong>.
            </p>
          </div>
        </div>

        <p className="text-slate-300 text-lg mb-6">
          이제 연계기들과 선행스킬들 어떻게 사용하는지와 스킬별 특징 설명드릴게요.
        </p>

        {/* 스킬별 특징 */}
        <div className="space-y-6">
          {/* 4.0 잠궈두는 스킬 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-white-400 text-xl font-bold mb-3">4.0 잠궈두는 스킬</h3>
            <p className="text-slate-200 text-base">
              약점 노리기, 회피 이동, 수호의 검, 반달차기, (회전 차기, 돌진차기)
            </p>
            <p className="text-slate-400 text-sm italic mt-2">
              💡 회전 차기와 돌진차기는 약간의 쓰임이 있어서 숙련자라면 안잠궈두셔도 됩니다.
            </p>
          </div>

          {/* 4.1 캔슬선회하는바람 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-cyan-400 text-xl font-bold mb-3">4.1 (캔슬)선회하는바람</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                보통 길여바 이후 선회를 사용하지만, <strong className="text-cyan-300">단명/우직/숨찢질/회피착지 이후와 숨찢 도중에도 사용이 가능</strong>해요.
              </p>
              <p className="text-slate-200 text-base">
                바람모아쏘기의 특화가 선회로도 적용 가능.
              </p>
              <p className="text-slate-200 text-base mb-3">
                각각 연계 가능한 스킬마다 적용되는 커맨드가 달라요:
              </p>
              <div className="bg-slate-600/50 p-4 rounded space-y-2 text-sm">
                <p className="text-slate-200">• <strong>길여바:</strong> 좌클로 캔슬길여바가 시전된상태에서 우클추가</p>
                <p className="text-slate-200">• <strong>단명:</strong> AorD 좌클+우클 유지.</p>
                <p className="text-slate-200">• <strong>우직:</strong> 좌클 누른채로 우클 추가</p>
                <p className="text-slate-200">• <strong>숨찢:</strong> 끊어 쓰면 2+2+1타. 5타격째에 뒤로 밀리니, 안밀리게 쓰려면 3~4타 모션에서 우클만 추가.</p>
                <p className="text-slate-200">• <strong>숨찢질:</strong> SHIFT+X에서 SHIFT 누른채로 우클만 추가</p>
                <p className="text-slate-200">• <strong>회피착지:</strong> 공중에서 내려오기전에 좌우클</p>
              </div>
              <p className="text-cyan-300 text-base mt-3">이후 숨을 찢는 화살과 연계!</p>
            </div>
          </div>

          {/* 4.2 캔슬길여바 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-purple-400 text-xl font-bold mb-3">4.2 (캔슬)길을 여는 바람</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                <strong className="text-purple-300">우직/숨찢/바모/옭아/2차라밤 둘 다/ 강극단명 막타 도중에 캔슬로 사용 가능</strong>해요.
              </p>
              <div className="bg-slate-600/50 p-4 rounded space-y-2 text-sm">
                <p className="text-slate-200">• <strong>우직:</strong> 모션 취한 상태~사용중 SHIFT+좌클</p>
                <p className="text-slate-200">• <strong>숨찢:</strong> 모션 취한 상태~사용중 SHIFT+좌클</p>
                <p className="text-slate-200">• <strong>바모:</strong> SHIFT+우클에서 우클만 놓았다 우클이면 캔슬길여바~선회까지 자동</p>
                <p className="text-slate-200">• <strong>옭아:</strong> 스킬 나가고 SHIFT+좌클</p>
                <p className="text-slate-200">• <strong>2차라밤:</strong> 울림의 화살은 스킬 발동후, 휘몰화살은 모션 취한 상태~사용중 SHIFT+좌클</p>
                <p className="text-slate-200">• <strong>강극단명:</strong> 막타 나가고 SHIFT+좌클</p>
              </div>
              <p className="text-slate-300 text-sm mt-3">
                💡 대부분의 스킬 사용중에 좌클 누르고 있는 상태라 SHIFT만 딸깍 추가로 가능.
              </p>
              <p className="text-slate-200 text-base mt-3">
                캔슬길여바가 불가능한 스킬들은 화살이 날라가는 도중에 F 회전차기나, WF 돌진차기를 섞어주면 화살 맞으면서 타격판정이 들어가 캔슬 길여바가 가능해져요. 발차기로 직접 타격하지 않아도 가능하지만 어마무시하게 쓸데없기 때문에 <strong className="text-red-400">빨간약은 그만!</strong>
              </p>
              <p className="text-slate-200 text-base mt-3">
                예전에 에어어택이 달려있을땐 괴랄한 순간폭딜이 나오는 <strong>우직-선회-초바모-옭아-길여바-선회-숨찢</strong>을 썼지만 2cc가 띄우기로 들어가서 우선순위가 높은 조합은 아니에요. 쿨 상황 맞으면 사용해도 괜찮아요.
              </p>
            </div>
          </div>

          {/* 4.3 숨을 찢는 화살 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-red-400 text-xl font-bold mb-3">4.3 숨을 찢는 화살</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                차징과 대기중엔 슈아 상태. <strong className="text-red-300">화살 쏘는동안만 맨몸</strong>.
              </p>
              <p className="text-slate-200 text-base">
                앞서 선회때도 말씀드린 구조 <strong className="text-red-300">2+2+1타, 5타격째 뒤로 밀려요</strong>.
              </p>
              <p className="text-slate-200 text-base">
                얘는 SE 누르는 타이밍이 조금만 늦어도 차징모션이 떠요. <strong className="text-red-300">일반과 풀차징의 딜차이가 약 2배 정도!</strong>
                따라서 항상 차징모션 스킵하기 위해 타이밍을 잘 잡아줘야해요.
              </p>
              <p className="text-slate-200 text-base">
                선회와 연계시 마지노선은 <strong className="text-red-300">오른발이 미세하게 앞으로 나가서 바닥에 닿기 직전까지 SE를 입력하면 풀차징으로 나가요</strong>. 그래서 좌단명 선회보다 우단명 선회가 판정이 유리해요.
              </p>
              <p className="text-slate-200 text-base">
                엇갈리는 바람, 바람타기, 회피 착지 사격 후에도 SE로 풀차징된 숨찢이 가능해요.
              </p>
              <p className="text-yellow-300 text-base">
                ⚠️ 예전엔 쿨중딜감 적용이 없어서 DPS 1위 였지만 <strong>지금은 숨찢 반복이 오히려 딜로스</strong>에요!
              </p>

              {/* 스플래시 데미지 내용 추가 */}
              <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 p-5 rounded-lg border border-amber-400/30 mt-4">
                <h4 className="text-amber-300 text-lg font-bold mb-3">💥 스플래시 데미지의 범위 파악하기</h4>
                
                <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 p-4 rounded-lg border border-red-400/40">
                  <p className="text-red-300 font-semibold mb-3 text-base">📹 스플뎀 예시 영상:</p>
                  <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/Lcyc9gvND7U"
                      title="숨찢 스플뎀 예시 영상"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600">
                    <p className="text-slate-200 text-base mb-2">
                      예시 영상에서 보시다시피 에임이 잡히지도 않은채로 벽에 쏘는데 히트 판정이 들어가는걸 보실 수 있어요. <strong className="text-amber-300">벽에서 터지는 스킬의 범위안에 적이 있다면 영상처럼 히트 판정이 들어갑니다!</strong>
                    </p>
                    <p className="text-slate-200 text-base">
                      저런 난간벽 뒤가 아니더라도 높은 지붕위라서 사거리가 닿지 않아도, <strong className="text-amber-300">캐릭터의 발쪽 언저리에 에임을 두고 쏘면 스플래시로 히트 판정을 띄울 수 있어요!</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4.4 바깃 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-yellow-400 text-xl font-bold mb-3">4.4 바람을 타는 깃~강극바깃</h3>
            <div className="space-y-3">
              <p className="text-red-400 text-base font-semibold">
                ⚠️ 얘는 손쉽게 킬하는게 가능한 스킬이면서 죽음과도 가까워지는 1순위 스킬.
                반드시 안전한 상태에서 사용하길 강요드립니다.
              </p>
              <p className="text-slate-200 text-base">
                하늘에서 떨어지는 판정이라 <strong className="text-yellow-300">나보다 높은 지대에 있는 적들 혹은 적당히 낮은 구조물 뒤에 있는 적들도 타격 가능</strong>해요.
              </p>
              <p className="text-slate-200 text-base">
                개인적으로는 딜링보다 <strong className="text-yellow-300">디버프특화 묻히기용으로 써요</strong>.
              </p>
            </div>
          </div>

          {/* 4.5 우직한 칼날바람 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-blue-400 text-xl font-bold mb-3">4.5 우직한 칼날바람</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                공속과 상대방과의 거리따라 <strong className="text-blue-300">0~12 + 1타</strong>.
              </p>
              <p className="text-slate-200 text-base">
                최대 사정거리에서 쓴다면 화살 날라가는 딜레이가 있어 CC연계 생각하기.
              </p>
              <p className="text-slate-200 text-base">
                우직이 12타까진 2타씩x6번 연달아 우다다다 나가지만, <strong className="text-blue-300">13타를 쏘면서 오른무릎을 일으키기 떄문에 후딜이 있습니다!</strong> 따라서 13타까지 쏘게되면 연계 속도가 느려지는거 생각하고 계셔야해요.
              </p>
              <p className="text-slate-200 text-base">
                모션만 잡은채로 <strong className="text-blue-300">0타로 캔슬길여바가 가능</strong>해요.
              </p>
              <p className="text-green-300 text-base">
                💎 PVP 계수가 무려 <strong>17867%로 제일 높지만 치확이 20%</strong>라 스킬버프와 재련석, 특화등을 잘 챙겨주면 그만큼 리턴값이 높아져요.
              </p>
              <p className="text-slate-200 text-base">
                <strong className="text-cyan-300">퀵슬롯 등록하고 사용하면 맨몸으로 달리다가도 바로 무기꺼내고 우직 모션 발동 가능</strong>해요.
              </p>

              {/* 스플뎀 내용 추가 */}
              <div className="bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400 mt-3">
                <p className="text-blue-300 text-base">
                  💥 <strong>우직도 숨찢처럼 스플뎀이 존재해요.</strong> 하지만 범위가 아주 좁다보니 <strong className="text-blue-300">써보시면서 감으로 익히는걸 추천드려요!</strong>
                </p>
              </div>
            </div>
          </div>

          {/* 4.6 강 극 단명 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-purple-400 text-xl font-bold mb-3">4.6 강 극 단명</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                퀵슬롯으로 사용하면 <strong className="text-blue-300">선행스킬없이 바로 발동</strong>되요.
              </p>
              <p className="text-slate-200 text-base">
                얘도 <strong className="text-red-300">고저차 쥐약</strong>에, 범위가 아처 만개의 50%도 안나와요.
              </p>
              <p className="text-slate-200 text-base">
                장점은 <strong className="text-green-300">다운어택+치확100%+계수 9500%로 높은편</strong> + 전가유지 딜링 가능해서 근접 한정으로 활용 하면 좋아요.
              </p>
              <p className="text-slate-200 text-base">
                막타 이후 <strong className="text-blue-300">캔슬길여바로 연계</strong>도 가능해요.
              </p>
            </div>
          </div>

          {/* 4.7 초바모 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-green-400 text-xl font-bold mb-3">4.7 초 바람 모아쏘기</h3>
            <div className="space-y-3">
              <p className="text-red-300 text-base font-semibold">
                ⚠️ 바모 특화 안묻어요! 특화 발동이 안되는 스킬이에요.
              </p>
              <p className="text-slate-200 text-base">
                구조 자체가 괴랄한 놈이에요. <strong className="text-green-300">추가 타격 3타+다발11타</strong> 로 구성되어있는데 추가 3타가 먼저 딜이들어가요. 추가 3타는 에임 따라서 나가지만 다발11타는 히트 범위가 세로로 긴 직사각형의 형태로 캐릭터 방향 고정으로 나가요. 따라서 고저차 영향을 받고, 다발 11타 풀로 맞는 건 덩치 큰 보스들 뿐이라 대인전에선 계수가 온전히 적용되지 못해요(약2~40%).
              </p>
              <p className="text-slate-200 text-base">
                후딜이 엄청 길어요. 전방가드지만 딜로스 줄이기 위해 주로 <strong className="text-green-300">옭아매는화살로 후딜 캔슬하거나 회피 착지로 거리벌리는 용으로 써요</strong>.
              </p>
            </div>
          </div>

          {/* 4.8 옭아매는화살 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-emerald-400 text-xl font-bold mb-3">4.8 옭아매는화살</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                계수가 덩굴 추가 피해까지 4200% 정도로 딜량은 낮아서 주로 <strong className="text-emerald-300">초바모 후딜 캔슬용으로 써요</strong>.
              </p>
              <p className="text-slate-200 text-base">
                띄우기라 CC연계용으로는 추천도가 낮아요.
              </p>
            </div>
          </div>

          {/* 4.9 바람을 타는 의지 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-indigo-400 text-xl font-bold mb-3">4.9 바람을 타는 의지(3차라밤)</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                <strong className="text-indigo-300">전가+넉다+스킬방깎으로 활용 가능</strong>해요.
              </p>
              <p className="text-slate-200 text-base">
                바깃과 모션이 똑같아 <strong className="text-indigo-300">낚시용으로 활용 가능</strong>해요.
              </p>
            </div>
          </div>

          {/* 4.10 바람의 의지 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-teal-400 text-xl font-bold mb-3">4.10 바람의 의지</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                근접상황+안전한 딜각 에서는 콤보에 추가해도 괜찮아요. <strong className="text-teal-300">단명(1cc)-DF-우직 순으로 연계해서 스킬방깎까지 걸고 시작하는 방식</strong>. AF는 딜레이가 미세하게 조금 더 있어서 DF로 사용 추천.
              </p>
            </div>
          </div>

          {/* 4.11 회피사격 추가 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-pink-400 text-xl font-bold mb-3">4.11 회피사격</h3>
            <div className="space-y-3">
              <p className="text-slate-200 text-base">
                <strong className="text-pink-300">하늘의 부름, 엇갈리는 바람, 바람타기 중에 A or D + 좌클릭 으로 방향을 틀 수 있어요.</strong>
              </p>
              <p className="text-slate-200 text-base">
                포지션 잡거나 뒤잡기용으로 쓰이고 위치렉 유발(?)도 가능해요. <strong className="text-yellow-300">단, 맨몸이라 조심하셔야해요!</strong>
              </p>

              {/* 회피사격 예시 영상 */}
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-5 rounded-lg border border-blue-400/40 shadow-lg mt-4">
                <p className="text-blue-300 font-semibold mb-2 text-lg">📹 회피사격 실전영상 클립:</p>
                <p className="text-yellow-300 text-sm mb-4 text-center">💡 클릭하시면 새 탭에서 YouTube 클립이 재생됩니다</p>
                <a 
                  href="https://youtube.com/clip/UgkxbdSCtqhRn3RyrCUqci6T4O3tKlaTZQTF?si=cC2nWCG4_FP61xJ6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-lg border-2 border-green-600 hover:border-green-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl block"
                >
                  <div className="relative aspect-video bg-black">
                    {/* 썸네일 이미지 배경 */}
                    <img 
                      src="/tip-images/ranger-clip4.png" 
                      alt="회피사격 예시 클립"
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-green-600/90 rounded-full p-4 group-hover:scale-125 transition-transform duration-300 shadow-2xl">
                          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* CLIP 배지 */}
                    <div className="absolute top-2 right-2 bg-green-600 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">
                      YouTube CLIP
                    </div>
                    {/* 하단 제목 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                      <p className="text-white font-bold text-sm">회피사격 예시</p>
                    </div>
                  </div>
                </a>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  회피 사격을 극단적으로 사용한 예시지만, <strong className="text-pink-300">회폭 카운터, 바모 카운터, 전가로 턴 벌기</strong> 등의 디테일도 있어서 마무리 복습의 느낌으로 추가했어요!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 무호흡딜링 예시 */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl mt-8 border border-purple-400/30">
          <h3 className="text-purple-300 text-2xl font-bold mb-4">🔥 이론상 무호흡딜링 예시</h3>
          <p className="text-slate-300 text-base mb-4">
            가만히 냅둘리 없겠지만 공격 안받길 기도하면서 써야기에 <strong>어떤식으로 모든 쿨 돌리는지 알아두시는 정도만!</strong>
          </p>
          <div className="bg-slate-700/50 p-4 rounded-lg mb-4">
            <p className="text-white text-sm leading-relaxed break-words">
              단명 - 우직 - 길여바 - 선회 - 숨찢 - 초바모 - 옭아 - 숨찢질 - 재창조 - 바깃~강극바깃 - 단명 - 우직 - 길여바 - 선회 - 숨찢 - 초바모 - 옭아 - 숨찢질 - 2차라밤or강극단명(근접한정) - 바깃~강극바깃 
            </p>
          </div>
          <p className="text-slate-300 text-sm mb-2">
            이렇게 <strong className="text-purple-300">2사이클을 반복가능</strong>해요.
          </p>
          <p className="text-slate-300 text-sm mb-3">
            쿨타임은 맞게돌지만, 샤이공속버프나 3분버프가 있다면 이마저도 쿨타임이 모자라요ㅠㅠ
          </p>
          <p className="text-yellow-300 text-sm italic">
            ⚠️ 실전성이 엄청 낮으니 그냥 알아만 두기!
          </p>
        </div>
      </div>

      {/* 5. 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-yellow-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> 5. 솔라레 · 거점 · 길드리그 특화 및 수정
        </h2>
        
        <div className="space-y-6">
          {/* RVR 특화 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-red-400 text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">⚔️</span> RVR 특화
            </h3>
            <div className="flex justify-center mb-4">
              <img 
                src="/tip-images/홍줭무제한.png" 
                alt="무제한 특화" 
                className="rounded-lg shadow-lg max-w-full h-auto border border-slate-600"
              />
            </div>
            <p className="text-slate-200 text-base text-center">
              제한에서는 길여바에 <strong className="text-red-300">회피 감소20, 다운어택 5%</strong>
            </p>
          </div>

          {/* 소수전 특화 */}
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-purple-400 text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🌟</span> 소수전 특화
            </h3>
            <div className="flex justify-center mb-4">
              <img 
                src="/tip-images/홍줭소수전.png" 
                alt="소수전 특화" 
                className="rounded-lg shadow-lg max-w-full h-auto border border-slate-600"
              />
            </div>
            <p className="text-slate-200 text-base text-center">
              소수전 특화, <strong className="text-purple-300">바깃 대신 회폭 채용</strong>
            </p>
          </div>
        </div>

        {/* 수정 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600 mt-6">
          <h3 className="text-blue-300 text-2xl font-bold mb-4">💠 수정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 무제한 PvP 수정 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/tip-images/홍줭수정.png" 
                  alt="무제한 PvP 수정" 
                  className="rounded-lg max-w-full h-auto border border-slate-400"
                />
              </div>
              <p className="text-blue-300 text-lg font-bold">무제한 수정</p>
            </div>
            
            {/* 홍줭 제한 수정 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/tip-images/홍줭제한수정.png" 
                  alt="홍줭 제한 수정" 
                  className="rounded-lg max-w-full h-auto border border-slate-400"
                />
              </div>
              <p className="text-cyan-300 text-lg font-bold">제한 수정</p>
            </div>
          </div>
        </div>

        {/* 유물 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600 mt-6">
          <h3 className="text-green-300 text-2xl font-bold mb-4">✨ 유물</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 무제한 PvP 유물 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/tip-images/홍줭유물.png" 
                  alt="무제한 PvP 유물" 
                  className="rounded-lg max-w-full h-auto border border-slate-400"
                />
              </div>
              <p className="text-green-300 text-lg font-bold">무제한 유물</p>
            </div>
            
            {/* 홍줭 제한 유물 */}
            <div className="bg-slate-600 p-4 rounded-lg text-center shadow-lg border border-slate-500">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/tip-images/홍줭제한유물.png" 
                  alt="홍줭 제한 유물" 
                  className="rounded-lg max-w-full h-auto border border-slate-400"
                />
              </div>
              <p className="text-amber-300 text-lg font-bold mb-2">제한 유물</p>
              <p className="text-slate-200 text-sm">
                악어의 이빨 or 약점 공략보다 <strong className="text-yellow-300">기술의 달인이 기댓값이 높음</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 군왕 재련석 */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40 mt-6">
          <h4 className="text-red-300 text-2xl font-bold mb-4">⚔️ 군왕 재련석</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-red-400 font-bold">모든 공격력</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-red-400 font-bold">치명타 확률</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-red-400 font-bold">치명타 or 다운어택 <br></br>피해량</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-red-400 font-bold">백어택 피해량</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg text-center">
              <p className="text-red-400 font-bold text-sm">흑정령의 분노 회복량</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 하고 싶은 말 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-yellow-500 mb-8">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고 싶은 말
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
          <p className="text-slate-200 text-lg leading-relaxed text-center">
            부족한게 많지만 도움되었길 바라며 마무리 하겠습니다. 
            <br />
            <span className="text-green-300 font-bold text-xl">레인저 화이팅!!</span>
            <span className="text-white-400">(살려주세요ㅠㅠ)</span>
          </p>
        </div>
      </div>

      {/* YouTube 영상 */}
      <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-600">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl"
            src="https://www.youtube.com/embed/lC42jTtzSCQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
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
