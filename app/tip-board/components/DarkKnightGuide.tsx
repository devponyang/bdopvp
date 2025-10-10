'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DarkKnightGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/tip-board/14', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
          
          // 로컬 스토리지에서 추천 기록 확인
          const likedBefore = localStorage.getItem('tip_liked_14')
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
        await fetch('/api/tip-board/14/view', { method: 'POST' })
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
      const res = await fetch('/api/tip-board/14/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const data = await res.json()
        setPost({ ...post, like_count: data.like_count })
        setLiked(true)
        localStorage.setItem('tip_liked_14', 'true')
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🌑 전승 다크나이트 클래스 가이드
          </h1>
          <p className="text-xl text-slate-200">
            “빛의 끝에서 춤추는 그림자.”
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
          src="/tip-images/iframemain.png" 
          alt="전승 다크나이트" 
          className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
        />
      </div>

      {/* 1. 소개 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-blue-500">
        <h2 className="text-white text-3xl font-bold mb-4 flex items-center">
          <span className="mr-3 text-4xl">👋</span> 소개
        </h2>
        <p className="text-slate-200 text-lg">
          안녕하세요 무제한 공/거점 및 필드 아르샤에서 재미있게 놀고있는 pvp 전문길드 <strong>Ctrl</strong>의 <strong>iframe</strong>입니다.
        </p>
      </div>

      {/* 2. 장단점 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">⚖️</span> 전승 다크나이트 장/단점
        </h2>
        
        {/* 장점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">✅</span> 장점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li><strong className="text-green-400">지속가능한 무적 슈아 판정</strong>으로 드리블과 어그로를 이끌고 풀어냄이 있습니다.</li>
            <li><strong className="text-green-400">순간 진입기와 한방이 강해</strong> 적 딜러를 암살하는데 특화되어있습니다.</li>
          </ul>
        </div>
        
        {/* 단점 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <h3 className="text-white text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span> 단점
          </h3>
          <ul className="text-slate-200 text-lg space-y-3 pl-6">
            <li>몸이 <strong className="text-red-400">매우 약합니다</strong>. 스치기만 해도 억소리가 나는데요, 슈아피감도 10퍼이기 때문에 무적판정으로 모든 스킬들을 흘려야 합니다.</li>
            <li>당연히 모든 스킬들을 피할 수는 없으니 <strong className="text-yellow-400">피감수정을 통해 이를 어느정도 보완</strong>합니다.</li>
          </ul>
        </div>
      </div>

      {/* 3. 운영법 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-teal-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🎯</span> 거점(RVR) / 솔라레·길드리그 운영법
        </h2>
        
        {/* 거점전 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 거점전(RVR)
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="text-yellow-300 text-xl font-bold mb-2">🎯 극사이드 운영</h4>
              <p className="text-slate-200 text-lg mb-2">
                몸이 매우 약해 <strong className="text-yellow-300">본대로 합류하는 순간 스킬 1~2개 쓰고 산화</strong>합니다.
              </p>
              <p className="text-slate-200 text-lg">
                (물론 성채를 때려야 할 때는 스킬 한 개라도 쓰러 들어갑니다)
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="text-purple-300 text-xl font-bold mb-2">🗡️ 사이드 플레이</h4>
              <p className="text-slate-200 text-lg mb-2">
                사이드에서는 <strong className="text-purple-300">아군 쪽으로 들어오는 상대를 카운터</strong> 먹이거나
              </p>
              <p className="text-slate-200 text-lg">
                그 외엔 <strong className="text-purple-300">상대 원거리 딜러들 암살</strong>하러 갑니다.
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-2">💫 암살 전략</h4>
              <p className="text-slate-200 text-lg mb-2">
                <strong className="text-blue-300">꼭 죽일필요는 없습니다.</strong> 전승 다크나이트는 스킬 선딜이 좀 긴 애들이 있어서 쓰다가 잡히거나 죽기 때문에
              </p>
              <p className="text-slate-200 text-lg">
                <strong className="text-blue-300">빠르게 2cc까지만 먹이고 굴릴 스킬들 최대한 굴리고 드리블</strong>합니다. 딸피라면 아군에게 맡깁시다..
              </p>
            </div>
          </div>
        </div>
        
        {/* 솔라레 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-purple-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🌟</span> 솔라레
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-cyan-400">
              <h4 className="text-cyan-300 text-xl font-bold mb-2">🌪️ 드리블 핵심</h4>
              <p className="text-slate-200 text-lg mb-2">
                전승 다크나이트는 <strong className="text-cyan-300">드리블이 매우 좋습니다</strong>(몸이 약해 무적으로 잘 회피..)
              </p>
              <p className="text-slate-200 text-lg">
                아군이 무언가를 할(잡기 또는 cc) 기회를 잡기 편하도록 <strong className="text-cyan-300">상대 진영으로 들어가 무적 슈아 드리블</strong>을 합니다.
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-2">🛡️ 카운터 플레이</h4>
              <p className="text-slate-200 text-lg mb-2">
                아군이 찍히는 조합이라면 (아처, 레인저, 데드아이 등)
              </p>
              <p className="text-slate-200 text-lg">
                찍히는 <strong className="text-green-300">아군 근처에서 카운터 스킬들</strong>을 써줍니다. (환영의덫, 기균, 운수레 등)
              </p>
            </div>
          </div>
        </div>
        
        {/* 길드리그 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-orange-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🏆</span> 길드리그
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="text-orange-300 text-xl font-bold mb-2">🎯 사이드 중심</h4>
              <p className="text-slate-200 text-lg mb-2">
                이 때는 <strong className="text-orange-300">상대진영에서 드리블한다는 생각은 버리고</strong>
              </p>
              <p className="text-slate-200 text-lg">
                <strong className="text-orange-300">사이드를 돌며 상대방이 본대에 집중을 못 하게</strong> 합니다.
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-rose-400">
              <h4 className="text-rose-300 text-xl font-bold mb-2">⚡ 후방 커버</h4>
              <p className="text-slate-200 text-lg mb-2">
                아군이 본대싸움을 한다면 <strong className="text-rose-300">사이드에서 적 딜러들 뒤를 봅니다</strong>.
              </p>
              <p className="text-slate-200 text-lg">
                아군이 잡기를 성공했다면 <strong className="text-rose-300">죽일 수 있는 상대가 아니면 커버오는 상대 딜러 뒤를 잡습니다</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PVP 콤보 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-orange-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🥊</span> PVP 콤보
        </h2>
        
        {/* PVP 진입 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-indigo-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🚀</span> PVP 진입 콤보
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg">
            <div className="text-slate-200 text-lg space-y-2">
              <p>• <strong className="text-indigo-300">공습</strong>으로 진입</p>
              <p>• <strong className="text-indigo-300">황마참</strong> 또는 <strong className="text-indigo-300">황질 공습</strong></p>
              <p>• <strong className="text-indigo-300">환영의덫 커맨드 + 공습</strong></p>
            </div>
          </div>
        </div>
        
        {/* 1:1 전용 쉬운 콤보 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-blue-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚡</span> 1:1 전용 쉬운 콤보
          </h3>
          
          <div className="bg-slate-600/50 p-4 rounded-lg mb-4">
            <p className="text-slate-200 text-lg mb-2">
              첫 cc가 어떻든 <strong className="text-blue-400">2cc는 고정</strong>입니다.
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-blue-500 font-mono mb-4">
            <p className="text-lg text-center text-slate-200">
              <strong className="text-blue-300">비수</strong> → <strong className="text-blue-300">스둠</strong>(1타) → <strong className="text-blue-300">집행</strong> → <strong className="text-blue-300">처형</strong>(2cc)
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg mb-4">
            <p className="text-slate-200 text-lg">
              그리고 <strong className="text-purple-400">2cc뒤로는 남아있는 스킬들 조합</strong>하여 씁니다.
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-purple-500 font-mono mb-4">
            <p className="text-lg text-center text-slate-200">
              <strong className="text-purple-300">황마참</strong> → <strong className="text-purple-300">정령의 유산</strong> → <strong className="text-purple-300">할광</strong>(적이 일어날 즈음 뺍니다)
            </p>
          </div>
          
          <div className="bg-slate-700 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-slate-200 text-lg mb-2">
              <strong className="text-yellow-400">💡 참고:</strong> 첫 cc가 공습 흐름을 제외하고는 <strong className="text-yellow-400">스둠을 2타까지 씁니다</strong>.
            </p>
            <p className="text-slate-200 text-lg">
              정령의 유산을 맨뒤로 뺀 이유는 <strong className="text-yellow-400">다운스메쉬를 노려보기 위함</strong>입니다.
            </p>
          </div>
        </div>
        
        {/* 황마참 시작 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-orange-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">🔥</span> 황마참 시작
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-orange-500 font-mono mb-4">
            <p className="text-lg text-center text-slate-200">
              <strong className="text-orange-300">황마참</strong> → <strong className="text-orange-300">할광</strong> 2타 → <strong className="text-orange-300">비수</strong> → <strong className="text-orange-300">스둠</strong> 1타 → <strong className="text-orange-300">집행</strong> <strong className="text-orange-300">처형</strong>
            </p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-orange-400">
            <p className="text-slate-200 text-base">
              황마참은 넉다운으로 CC가 길기 때문에 위와 같은 루트로 2cc를 시작합니다.
            </p>
          </div>
        </div>
        
        {/* 2.7cc 콤보 - 에어어택 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-cyan-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">💎</span> 2.7cc 콤보 - 에어어택 (풀 슈아 전가 판정)
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-cyan-500 font-mono mb-4">
            <p className="text-lg leading-relaxed text-center text-slate-200">
              <strong className="text-cyan-300">공습 흐름</strong> → <strong className="text-cyan-300">스둠</strong> 1타 → <strong className="text-cyan-300">할광</strong> 1타 → <strong className="text-cyan-300">진할광</strong>(할광 도중 S 추가 입력)(넉백 1.7cc) → <strong className="text-cyan-300">운수레</strong>(2.7cc) → <strong className="text-cyan-300">황마참</strong> → <strong className="text-cyan-300">정령의 유산</strong> → <strong className="text-cyan-300">베디르의 광기</strong> → <strong className="text-cyan-300">야상곡</strong> A
            </p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base">
              <strong className="text-cyan-400">💡 Tip:</strong> 3분이나 흑정으로 공속이 빠르다면 <strong>할광을 2타까지 쓰고 진할광</strong>으로 넘어갑니다.
            </p>
          </div>
        </div>
        
        {/* 2.7cc 콤보 - 넉다운 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-emerald-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">💚</span> 2.7cc 콤보 - 넉다운
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-emerald-500 font-mono mb-4">
            <p className="text-lg leading-relaxed text-center text-slate-200">
              <strong className="text-emerald-300">공습 흐름</strong> → <strong className="text-emerald-300">스둠</strong> 1타 → <strong className="text-emerald-300">할광</strong> 1타 → <strong className="text-emerald-300">진할광</strong>(할광 도중 S 추가 입력)(넉백 1.7cc) → <strong className="text-emerald-300">황마참</strong>(2.7cc) → <strong className="text-emerald-300">베디르의 광기</strong> → <strong className="text-emerald-300">야상곡</strong> A → <strong className="text-emerald-300">정령의 유산</strong> → <strong className="text-emerald-300">환영의 덫</strong> → <strong className="text-emerald-300">칠흑의 잿더미</strong>
            </p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-emerald-400">
            <p className="text-slate-200 text-base">
              마찬가지로 3분이나 흑정으로 공속이 빠르다면 <strong className="text-emerald-400">할광을 2타까지 쓰고 진할광</strong>으로 넘어갑니다.
            </p>
          </div>
        </div>
        
        {/* 추가 팁 */}
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 shadow-lg border border-slate-600">
          <h3 className="text-pink-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">💡</span> 콤보 추가 팁
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <p className="text-slate-200 text-lg">
                • 공습 흐름 외 1cc는 <strong className="text-pink-400">할광을 2타 넣고</strong> 공속이 높다면 <strong className="text-pink-400">할광 풀타</strong>를 넣습니다.
              </p>
            </div>
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <p className="text-slate-200 text-lg">
                • <strong className="text-pink-400">야상곡 D(맨몸 뒤잡 cc)</strong>을 잘 활용하시면 좋습니다.
              </p>
            </div>
            <div className="bg-slate-600/50 p-4 rounded-lg">
              <p className="text-slate-200 text-lg">
                • 야상곡은 <strong className="text-pink-400">슬롯으로 사용</strong>하거나, <strong className="text-pink-400">베디르의 광기 이후 우클릭</strong>, <strong className="text-pink-400">공습흐름 이후 우클릭</strong>으로 발동 가능합니다.
              </p>
            </div>
          </div>
        </div>
        
        {/* 다수전 */}
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-red-400 text-2xl font-bold mb-4 flex items-center">
            <span className="mr-3">⚔️</span> 다수전 콤보
          </h3>
          <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-red-500 mb-4">
            <p className="text-slate-200 text-lg mb-2">
              다수전에서는 <strong className="text-red-400">슈아만 굴리는 게 가장 좋습니다</strong>.
            </p>
            <p className="text-slate-200 text-lg">
              첫 cc 이후에는 <strong className="text-red-400">베디르의 광기</strong>를 씁니다.
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-yellow-500 font-mono mb-4">
            <p className="text-slate-200 text-lg font-bold mb-3 text-center">
              공습흐름으로 cc 먹였을 때:
            </p>
            <p className="text-lg text-center text-slate-200">
              <strong className="text-yellow-300">베디르의 광기</strong> → <strong className="text-yellow-300">기균</strong> or <strong className="text-yellow-300">황마참</strong>으로 2cc
            </p>
            <p className="text-yellow-200 text-base mt-3 text-center">
              (운수레는 쓰지 말 것 - 공습흐름은 cc 이후 흐름 스킬의 후딜이 김)
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-green-500 font-mono">
            <p className="text-slate-200 text-lg font-bold mb-3 text-center">
              공습흐름 외 첫 cc:
            </p>
            <p className="text-lg text-center text-slate-200">
              <strong className="text-green-300">베디르의 광기</strong> → <strong className="text-green-300">황마참</strong> or <strong className="text-green-300">운수레</strong> or <strong className="text-green-300">공습흐름</strong> 2cc → <strong className="text-green-300">정령의 유산</strong> or <strong className="text-green-300">할광</strong> 마무리
            </p>
          </div>
        </div>
      </div>

      {/* 5. 드리블 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-indigo-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">🌪️</span> 드리블
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <div className="bg-slate-600/50 p-6 rounded-lg border-l-4 border-indigo-400 mb-4">
            <h4 className="text-indigo-300 text-xl font-bold mb-3">핵심 원리</h4>
            <p className="text-slate-200 text-lg mb-2">
              <strong className="text-indigo-300">어스름을 무적 끝까지 써야합니다.</strong> 질질 끌어야 한다 할까요?
            </p>
            <p className="text-slate-200 text-lg">
              한번에 어스름을 다 쓰지 말고
            </p>
          </div>
          
          <div className="bg-slate-600/50 p-4 rounded-lg border-2 border-indigo-500 font-mono text-center">
            <p className="text-xl font-bold text-slate-200">
              <strong className="text-indigo-300">어스름</strong> → 슈아 → <strong className="text-indigo-300">어스름</strong> → 슈아
            </p>
          </div>
        </div>
      </div>

      {/* 6. 특화 및 수정 */}
      <div className="bg-slate-800 p-8 rounded-2xl mb-8 shadow-xl border-l-4 border-purple-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💎</span> 솔라레 특화 / 거점·길드리그 무제한 특화 및 수정
        </h2>
        
        {/* 특화 이미지 */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-purple-300 mb-4">⚡ 특화</h3>
          <p className="text-slate-200 text-lg mb-4">
            특화는 <strong className="text-purple-400">귀찮아서 하나로만 통일</strong>합니다.
          </p>
          <div className="flex justify-center">
            <img 
              src="/tip-images/iframe.png" 
              alt="특화" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
            />
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-slate-600">
          <h3 className="text-blue-300 text-2xl font-bold mb-4">💠 수정 및 광명석</h3>
          
          {/* 수정 이미지 */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/tip-images/iframecri.png" 
              alt="수정" 
              className="rounded-xl shadow-2xl max-w-full h-auto border border-slate-600"
            />
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="text-blue-300 text-xl font-bold mb-2">기본 세팅</h4>
              <p className="text-slate-200 text-lg">
                • 수정: <strong className="text-blue-400">피감수정</strong> 하나만 사용<br/>
                • 광명석: <strong className="text-blue-400">서리방패</strong> 사용
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="text-green-300 text-xl font-bold mb-2">적중이 필요하다면</h4>
              <p className="text-slate-200 text-lg">
                • <strong className="text-green-400">강 적중 하나</strong> 추가
              </p>
            </div>
            
            <div className="bg-slate-600/50 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="text-orange-300 text-xl font-bold mb-2">깡공이 필요하다면</h4>
              <p className="text-slate-200 text-lg mb-2">
                • 광명석: <strong className="text-orange-400">부패 3개 + 오색빛 광명석</strong>
              </p>
              <p className="text-slate-200 text-lg">
                • 부족하면 피감수정까지 빼고 <strong className="text-orange-400">인추와 마칼 채용</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. 하고 싶은 말 / 꿀팁 */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-l-4 border-yellow-500">
        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3 text-4xl">💬</span> 하고 싶은 말 / 꿀팁
        </h2>
        
        <div className="bg-slate-700/50 p-6 rounded-xl mb-6 border border-slate-600">
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            너무나도 적을 게 많지만 다 적기엔 하루종일 적어야 하기도 하고...
          </p>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            <strong className="text-yellow-400">전승 다크나이트 보다 더 좋은 캐릭이 많지만 마음이 시키는 걸 해야죠!</strong>
          </p>
          <p className="text-slate-200 text-lg mb-6 leading-relaxed">
            그러니 <strong className="text-yellow-400">꿀팁만 적겠습니다.</strong>
          </p>
        </div>
        
        {/* 꿀팁들 */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-600/40">
            <h4 className="text-yellow-300 text-xl font-bold mb-3">🎯 환영의 덫 활용법</h4>
            <p className="text-slate-200 text-lg mb-2">
              • <strong className="text-yellow-400">슬롯 스킬 사용시</strong>: 어스름을 사용하지 않습니다. 대신 거리가 짧음
            </p>
            <p className="text-slate-200 text-lg mb-2">
              • <strong className="text-yellow-400">커맨드 사용 시</strong>: 멀리 가지만 어스름을 사용합니다
            </p>
            <p className="text-slate-200 text-lg">
              • 그래서 연 어스름이 쿨중이라면 <strong className="text-yellow-400">환영의덫 커맨드로 사용할 때 시작시 맨몸</strong>입니다
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-600/40">
            <h4 className="text-blue-300 text-xl font-bold mb-3">⚡ 버프 유지</h4>
            <p className="text-slate-200 text-lg mb-2">
              <strong className="text-blue-400">비수의 공속</strong>과 <strong className="text-blue-400">스둠(space)의 공격력 버프</strong>를 상시 유지 해줍니다.
            </p>
            <p className="text-slate-200 text-lg">
              스둠은 모든 스킬 쓰고 space누르면 되는데 이때 <strong className="text-blue-400">스둠 모션 나가자마자 캔슬 가능</strong>합니다.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-600/40">
            <h4 className="text-purple-300 text-xl font-bold mb-3">🎮 옆공습</h4>
            <p className="text-slate-200 text-lg mb-2">
              옆공습은 <strong className="text-purple-400">연습만이 답</strong>입니다.. 팁이랄 게 없어요.
            </p>
            <p className="text-slate-200 text-lg">
              상대방 옆으로 공습을 쓰는데 <strong className="text-purple-400">올려칠 때 화면을 돌려서 상대방 옆을 칩니다</strong>..
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-600/40">
            <h4 className="text-red-300 text-xl font-bold mb-3">⚔️ 군왕 재련</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">모든 공격력</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">백어택</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">치명타 확률</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">모든 피해 감소</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg text-center">
                <p className="text-red-400 font-bold">다운어택 피해량</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-white text-2xl font-bold">
            읽어주셔서 감사합니다 🙏
          </p>
        </div>
      </div>

      {/* YouTube 영상 */}
      <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-600">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl"
            src="https://www.youtube.com/embed/dkK2IzLs5Dc"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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

