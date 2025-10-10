'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import PonyangLoading from '../../components/PonyangLoading'
import { renderMarkdown } from '@/lib/markdown'
import MaeguGuide from '../components/MaeguGuide'
import WitchGuide from '../components/WitchGuide'
import DarkKnightGuide from '../components/DarkKnightGuide'
import RangerGuide from '../components/RangerGuide'
import DeadEyeGuide from '../components/DeadEyeGuide'
import GiantGuide from '../components/GiantGuide'
import WarriorGuide from '../components/WarriorGuide'
import MaeguSuccessionGuide from '../components/MaeguSuccessionGuide'

interface TipPost {
  id: number
  title: string
  content: string
  tags: string[]
  image_urls: string[]
  created_at: string
  updated_at: string
  author?: string
  source?: string
  is_notice?: boolean
  view_count?: number
  like_count?: number
}

export default function TipPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<TipPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { id } = await params
        if (!id) {
          notFound()
          return
        }

        setPostId(id)

        // 매구 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '12') {
          setLoading(false)
          return
        }

        // 각성 위치 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '13') {
          setLoading(false)
          return
        }

        // 전승 다크나이트 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '14') {
          setLoading(false)
          return
        }

        // 전승 레인저 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '15') {
          setLoading(false)
          return
        }

        // 데드아이 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '16') {
          setLoading(false)
          return
        }

        // 전승 자이언트 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '17') {
          setLoading(false)
          return
        }

        // 전승 무사 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '18') {
          setLoading(false)
          return
        }

        // 전승 매구 클래스 가이드는 전용 컴포넌트 렌더링
        if (id === '19') {
          setLoading(false)
          return
        }

        const res = await fetch(`/api/tip-board/${id}`, { cache: 'no-store' })
        if (!res.ok) {
          notFound()
          return
        }

        const postData = await res.json()
        setPost(postData)
      } catch (error) {
        console.error('팁 상세 로딩 에러:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params])

  // 조회수 증가
  useEffect(() => {
    if (post?.id) {
      const incrementViewCount = async () => {
        try {
          await fetch(`/api/tip-board/${post.id}/view`, {
            method: 'POST',
          })
        } catch (error) {
          console.error('조회수 증가 실패:', error)
        }
      }
      incrementViewCount()
    }
  }, [post?.id])

  // 추천 기능
  const handleLike = async () => {
    if (!post?.id || liked || liking) return

    setLiking(true)
    try {
      const response = await fetch(`/api/tip-board/${post.id}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        setPost(prev => prev ? { ...prev, like_count: result.like_count } : null)
        setLiked(true)
        
        // 로컬 스토리지에 추천 기록 저장
        localStorage.setItem(`tip_liked_${post.id}`, 'true')
      }
    } catch (error) {
      console.error('추천 실패:', error)
    } finally {
      setLiking(false)
    }
  }

  // 로컬 스토리지에서 추천 기록 확인
  useEffect(() => {
    if (post?.id) {
      const likedBefore = localStorage.getItem(`tip_liked_${post.id}`)
      if (likedBefore === 'true') {
        setLiked(true)
      }
    }
  }, [post?.id])

  // ESC 키로 이미지 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
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

  // 본문 내 이미지 클릭을 위한 전역 함수 설정
  useEffect(() => {
    (window as any).openImageModal = (imageUrl: string) => {
      setSelectedImage(imageUrl)
    }

    return () => {
      delete (window as any).openImageModal
    }
  }, [])

  if (loading) return <PonyangLoading />
  
  // 매구 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '12') {
    return <MaeguGuide />
  }
  
  // 각성 위치 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '13') {
    return <WitchGuide />
  }
  
  // 전승 다크나이트 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '14') {
    return <DarkKnightGuide />
  }
  
  // 전승 레인저 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '15') {
    return <RangerGuide />
  }

  // 데드아이 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '16') {
    return <DeadEyeGuide />
  }

  // 전승 자이언트 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '17') {
    return <GiantGuide />
  }

  // 전승 무사 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '18') {
    return <WarriorGuide />
  }

  // 전승 매구 클래스 가이드는 전용 컴포넌트 렌더링
  if (postId === '19') {
    return <MaeguSuccessionGuide />
  }
  
  if (!post) return notFound()

  return (
    <>
      {/* 이미지 모달 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center text-xl font-medium transition-all duration-200 border border-gray-500 hover:border-gray-400 shadow-lg"
              title="닫기 (ESC)"
            >
              ×
            </button>
            
            {/* 이미지 */}
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="팁 이미지 크게 보기" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-gray-600"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* 하단 안내 */}
            <div className="mt-4 text-center text-white/70 text-sm">
              이미지를 클릭하거나 ESC 키를 눌러 닫을 수 있습니다
            </div>
          </div>
        </div>
      )}

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

        {/* 헤더 섹션 */}
        <div className="relative overflow-hidden mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-700"></div>
          <div className="relative bg-gradient-to-r from-slate-800/90 to-blue-900/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 group-hover:border-white/30 transition-all duration-300">
            <div className="flex flex-col space-y-4">
              {/* 공지 배지와 제목 */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                {post.is_notice && (
                  <span className="px-4 py-2 bg-yellow-500 text-black rounded-full text-sm font-bold shadow-lg">
                    📢 공지
                  </span>
                )}
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent break-words hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 transition-all duration-300 drop-shadow-lg">
                  {post.title}
                </h1>
              </div>

              {/* 메타 정보 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1 px-3 py-1 bg-blue-600/40 rounded-full border border-blue-400/40 hover:bg-blue-600/60 hover:border-blue-400/60 transition-all duration-200 shadow-lg hover:shadow-blue-500/20">
                  👤 {post.author || '익명'}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-purple-600/40 rounded-full border border-purple-400/40 hover:bg-purple-600/60 hover:border-purple-400/60 transition-all duration-200 shadow-lg hover:shadow-purple-500/20">
                  📅 {format(new Date(post.created_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-green-600/40 rounded-full border border-green-400/40 hover:bg-green-600/60 hover:border-green-400/60 transition-all duration-200 shadow-lg hover:shadow-green-500/20">
                  👀 {post.view_count || 0} 조회
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-pink-600/40 rounded-full border border-pink-400/40 hover:bg-pink-600/60 hover:border-pink-400/60 transition-all duration-200 shadow-lg hover:shadow-pink-500/20">
                  👍 {post.like_count || 0} 추천
                </span>
                {post.updated_at !== post.created_at && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-orange-600/40 rounded-full border border-orange-400/40 hover:bg-orange-600/60 hover:border-orange-400/60 transition-all duration-200 shadow-lg hover:shadow-orange-500/20 text-xs">
                    ✏️ 수정: {format(new Date(post.updated_at), 'MM/dd HH:mm', { locale: ko })}
                  </span>
                )}
              </div>

              {/* 태그 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-200 rounded-full text-sm border border-blue-400/40 hover:from-blue-500/50 hover:to-purple-500/50 hover:border-blue-400/60 transition-all duration-200 shadow-lg hover:shadow-blue-500/20 hover:scale-105">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 클래스 가이드 안내 문구 */}
        {post.tags && post.tags.some(tag => tag.includes('클래스 가이드')) && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-amber-400/30 shadow-lg">
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
        )}

        {/* 이미지 갤러리 */}
        {post.image_urls && post.image_urls.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-slate-800/60 to-blue-900/60 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/10 mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                📷 첨부 이미지 ({post.image_urls.length}개)
              </h3>
            </div>
            <div className="space-y-6">
              {post.image_urls.map((url, idx) => (
                <div 
                  key={idx} 
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(url)}
                >
                  {imageErrors.has(url) ? (
                    <div className="w-full h-64 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">🖼️</div>
                        <div className="text-sm">이미지를 불러올 수 없습니다</div>
                        <div className="text-xs mt-1 text-gray-500 break-all">{url}</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={url} 
                        alt={`팁 이미지 ${idx + 1}`}
                        className="w-full h-auto max-h-[1200px] object-contain rounded-lg border border-zinc-700 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-[1.02] shadow-lg"
                        onError={() => {
                          console.error('이미지 로드 실패:', url)
                          setImageErrors(prev => new Set(prev).add(url))
                        }}
                        onLoad={() => {
                          console.log('이미지 로드 성공:', url)
                          setImageErrors(prev => {
                            const newSet = new Set(prev)
                            newSet.delete(url)
                            return newSet
                          })
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 text-lg font-medium bg-black/50 px-4 py-2 rounded-lg">
                          🔍 클릭하여 크게 보기
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 본문 내용 */}
        <div className="relative bg-gradient-to-br from-slate-800/50 via-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="bg-zinc-800/60 rounded-xl p-6 md:p-8 overflow-visible relative">
          <div 
            className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-white prose-strong:font-semibold prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300 prose-blockquote:border-l-blue-500 prose-blockquote:bg-zinc-800/30 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-code:text-blue-300 prose-code:bg-zinc-900 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-pre:rounded-lg prose-table:text-gray-300 prose-th:bg-zinc-800 prose-td:border-t prose-td:border-zinc-700 prose-hr:border-zinc-600"
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(post.content)
                .replace(
                  /<img([^>]*?)>/gi, 
                  `<div style="width:100%; margin:20px 0; text-align:center; height:auto; max-height:none; overflow:visible;"><img$1 onerror="console.error('본문 이미지 로드 실패:', this.src); this.style.display='none'" onload="console.log('본문 이미지 로드 성공:', this.src)" onclick="window.openImageModal && window.openImageModal(this.src)" style="max-width:100% !important; width:auto !important; height:auto !important; max-height:1200px !important; display:inline-block !important; margin:0 auto !important; cursor:pointer; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.3); object-fit:contain;" /></div>`
                )
        .replace(
          /<iframe([^>]*?)src="https:\/\/www\.youtube\.com\/embed\/([^"]*?)"([^>]*?)><\/iframe>/gi,
          `<div class="youtube-embed-container" style="margin: 20px 0; text-align: center; background: #000; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.3);"><iframe$1src="https://www.youtube.com/embed/$2?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"$3 style="width: 100%; height: 315px; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen loading="lazy"></iframe></div>`
        )
            }} 
          />
          
          <style jsx global>{`
            .prose img {
              max-width: 100% !important;
              width: auto !important;
              height: auto !important;
              max-height: 1200px !important;
              display: inline-block !important;
              margin: 20px auto !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
              cursor: pointer !important;
              transition: transform 0.2s ease, box-shadow 0.2s ease !important;
              object-fit: contain !important;
            }
            .prose img:hover {
              transform: scale(1.02) !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
            }
            .prose video {
              max-width: 100% !important;
              width: 100% !important;
              height: auto !important;
              max-height: 600px !important;
              display: block !important;
              margin: 20px auto !important;
              cursor: pointer !important;
              transition: transform 0.2s ease, box-shadow 0.2s ease !important;
              object-fit: contain !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
            }
            .prose video:hover {
              transform: scale(1.02) !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
            }
            /* 유튜브 임베드 스타일 */
            .youtube-embed-container {
              position: relative;
              width: 100%;
              max-width: 800px;
              height: 0;
              padding-bottom: 56.25%; /* 16:9 비율 */
              margin: 20px auto !important;
              background: #000;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            .youtube-embed-container iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100% !important;
              height: 100% !important;
              border: none;
            }
            /* 컨테이너 높이 제한 제거 */
            .prose div {
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
            }
            /* prose 컨테이너 자체의 높이 제한도 제거 */
            .prose {
              max-height: none !important;
              overflow: visible !important;
            }
          `}</style>
          </div>
        </div>

        {/* 출처 정보 */}
        {post.source && (
          <div className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 shadow-lg">
            <div className="flex items-center gap-2 text-blue-300">
              <span className="text-lg">🔗</span>
              <span className="font-semibold">출처:</span>
              <a 
                href={post.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors"
              >
                {post.source}
              </a>
            </div>
          </div>
        )}

        {/* 요약 섹션 */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
            💡 팁 요약
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="text-gray-400 mb-1">📝 카테고리</div>
              <div className="text-white font-medium">
                {post.tags && post.tags.length > 0 ? post.tags[0] : '일반'}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="text-gray-400 mb-1">👤 작성자</div>
              <div className="text-white font-medium">{post.author || '익명'}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="text-gray-400 mb-1">📅 게시일</div>
              <div className="text-white font-medium">
                {format(new Date(post.created_at), 'MM/dd', { locale: ko })}
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 통계 */}
        <div className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30 shadow-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{post.view_count || 0}</div>
              <div className="text-sm text-gray-400">조회수</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{post.like_count || 0}</div>
              <div className="text-sm text-gray-400">추천수</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleLike}
              disabled={liked || liking}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 ${
                liked 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30 hover:shadow-green-500/50' 
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-purple-500/30'
              } ${liking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {liking ? '⏳ 처리 중...' : liked ? '✅ 추천됨' : '👍 추천하기'}
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

        {/* 하단 정보 */}
        <div className="mt-8 text-center text-gray-500 text-sm border-t border-zinc-800 pt-6">
          <p>이 팁이 도움이 되었다면 다른 유저들과 공유해보세요!</p>
          <div className="mt-2 flex justify-center gap-4">
            <span className="flex items-center gap-1">
              👀 조회수: {post.view_count || 0}
            </span>
            <span className="flex items-center gap-1">
              👍 추천: {post.like_count || 0}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}