'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DeadEyeGuide() {
  const [post, setPost] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

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
            🔫 데드아이 클래스 가이드
          </h1>
          <p className="text-xl text-slate-200">
            “조준은 짧고, 죽음은 즉발이다.”
          </p>
        </div>
      </div>

      {/* 업데이트 예정 안내 */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-8 border border-blue-400/30 shadow-lg">
          <div className="text-center">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-3xl font-bold text-white mb-4">업데이트 예정</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              데드아이 클래스 가이드는 현재 작성 중입니다.
            </p>
            <p className="text-gray-400 text-base mb-6">
              곧 상세한 가이드를 만나보실 수 있습니다. 조금만 기다려주세요! 🙏
            </p>
            
            {/* 작성자 정보 */}
            <div className="mt-8 pt-6 border-t border-blue-400/30">
              <p className="text-gray-300 text-lg">
                <span className="text-blue-400 font-semibold">작성 예정:</span> Ctrl 길드 <strong className="text-white">무슨말</strong> 님
              </p>
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
  )
}




