'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useSearchParams } from 'next/navigation'
import PonyangLoading from '../components/PonyangLoading'
import { TIP_CATEGORIES, CLASS_GUIDE_CLASSES, CLASS_ICONS, getCategoryFromTags, getClassFromTags, type TipCategory, type ClassGuideClass } from '@/lib/constants/tip-categories'

interface TipPost {
  id: number
  title: string
  is_notice?: boolean
  author?: string
  source?: string
  created_at: string
  tags?: string[]
  view_count?: number
  like_count?: number
}

export default function TipBoardPage() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<TipPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | 'all'>('all')
  const [selectedClass, setSelectedClass] = useState<ClassGuideClass | 'all'>('all')
  const [showClassDropdown, setShowClassDropdown] = useState(false)

  // URL 파라미터 처리
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && Object.values(TIP_CATEGORIES).includes(categoryParam as TipCategory)) {
      setSelectedCategory(categoryParam as TipCategory)
      if (categoryParam === TIP_CATEGORIES.CLASS_GUIDE) {
        setShowClassDropdown(true)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/tip-board')
        const data = await response.json()
        
        // 데이터가 배열인지 확인
        if (Array.isArray(data)) {
          setPosts(data)
        } else {
          console.error('팁게시판 데이터가 배열이 아닙니다:', data)
          setPosts([])
        }
      } catch (error) {
        console.error('팁게시판 로딩 에러:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // 카테고리 필터링
    const postCategory = getCategoryFromTags(post.tags || [])
    const matchesCategory = selectedCategory === 'all' || postCategory === selectedCategory
    
    // 클래스 필터링 (클래스 가이드 카테고리일 때만)
    const postClass = getClassFromTags(post.tags || [])
    const matchesClass = selectedClass === 'all' || 
                        (selectedCategory !== TIP_CATEGORIES.CLASS_GUIDE) ||
                        postClass === selectedClass
    
    // 공지사항 필터링
    const matchesNotice = !post.is_notice || selectedCategory === 'all'
    
    return matchesSearch && matchesCategory && matchesClass && matchesNotice
  }) : []

  if (loading) return <PonyangLoading />

  return (
    <div className="p-3 md:p-6 max-w-full md:max-w-[1490px] mx-auto mt-6">
      {/* 메인 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-8">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/ponyang/tip-bg.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 35%"
          }}
        />
        
        {/* 콘텐츠 */}
        <div className="relative p-3 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center gap-6">
            {/* 왼쪽: 아이콘과 제목 */}
            <div className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-xl blur-sm"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg p-2">
          <img src="/icons/tip-icon.png" alt="팁게시판" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
              </div>
              
              {/* 제목 블록 */}
              <div className="px-4 py-3">
                <h1 className="text-4xl font-bold text-white">
                  팁 게시판
                </h1>
                <div className="text-lg text-white font-medium">
                  검은사막 유저들이 공유하는 유용한 팁과 정보
                </div>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden flex flex-col items-center text-center">
            <div>
              <h1 className="text-xl font-bold text-white">
                팁 게시판
              </h1>
              <div className="text-sm text-white font-medium mt-1">
                유용한 팁과 정보
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="mb-4 sm:mb-6">
        <div className="mb-3">
          <input
            type="text"
            placeholder="제목 또는 작성자로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
          />
        </div>
        
        {/* 대분류 필터 */}
        <div className="flex flex-wrap gap-2 mb-3 items-center">
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSelectedClass('all')
              setShowClassDropdown(false)
            }}
            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base ${
              selectedCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            전체
          </button>
          {Object.values(TIP_CATEGORIES).map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setSelectedClass('all')
                setShowClassDropdown(category === TIP_CATEGORIES.CLASS_GUIDE)
              }}
              className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
          
          {/* 클래스 가이드 서브카테고리 - 같은 줄에 배치 */}
          {selectedCategory === TIP_CATEGORIES.CLASS_GUIDE && (
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-zinc-700 text-gray-300 hover:bg-zinc-600 rounded-lg font-medium transition text-sm sm:text-base flex items-center gap-2"
              >
                {selectedClass === 'all' ? (
                  '전체 클래스'
                ) : (
                  <>
                    <img src={CLASS_ICONS[selectedClass]} alt={selectedClass} className="w-5 h-5 object-contain" />
                    {selectedClass}
                  </>
                )}
                <span className="text-xs">▼</span>
              </button>
              
              {showClassDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto w-64">
                  <button
                    onClick={() => {
                      setSelectedClass('all')
                      setShowClassDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition ${
                      selectedClass === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    전체 클래스
                  </button>
                  {CLASS_GUIDE_CLASSES.map(cls => (
                    <button
                      key={cls}
                      onClick={() => {
                        setSelectedClass(cls)
                        setShowClassDropdown(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition flex items-center gap-2 ${
                        selectedClass === cls ? 'bg-blue-600 text-white' : 'text-gray-300'
                      }`}
                    >
                      <img src={CLASS_ICONS[cls]} alt={cls} className="w-5 h-5 object-contain" />
                      <span>{cls}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="grid gap-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-2">
              {searchTerm || selectedCategory !== 'all' ? '검색 결과가 없습니다.' : '등록된 팁이 없습니다.'}
            </div>
            <p className="text-gray-500">다른 검색어를 시도해보세요.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <Link key={post.id} href={`/tip-board/${post.id}`}>
              <div className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-xl p-4 sm:p-6 transition-all duration-200 group">
                <div className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {post.is_notice && (
                        <span className="px-2 sm:px-3 py-1 bg-yellow-500 text-black rounded-full text-xs sm:text-sm font-bold self-start">
                          📢 공지
                        </span>
                      )}
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition leading-tight break-words">
                        {post.title}
                      </h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm text-gray-400">
                        {format(new Date(post.created_at), 'yyyy.MM.dd HH:mm', { locale: ko })}
                      </div>
                    </div>
                  </div>
                  
                  {/* 카테고리와 클래스 정보를 제목 아래로 이동 */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">
                      {getCategoryFromTags(post.tags || [])}
                    </span>
                    {getClassFromTags(post.tags || []) && (
                      <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs flex items-center gap-1">
                        <img src={CLASS_ICONS[getClassFromTags(post.tags || [])!]} alt={getClassFromTags(post.tags || [])!} className="w-4 h-4 object-contain" />
                        <span>{getClassFromTags(post.tags || [])}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      👤 {post.author || '익명'}
                    </span>
                  </div>
                  
                  {/* 통계 정보 */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      👁️ {post.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      👍 {post.like_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 통계 정보 */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        총 {posts.length}개의 팁이 있습니다
        {searchTerm && (
          <span> • "{searchTerm}" 검색 결과: {filteredPosts.length}개</span>
        )}
        {selectedCategory !== 'all' && (
          <span> • {selectedCategory} 카테고리: {filteredPosts.length}개</span>
        )}
        {selectedClass !== 'all' && (
          <span className="flex items-center gap-1">
            <span> • </span>
            <img src={CLASS_ICONS[selectedClass]} alt={selectedClass} className="w-4 h-4 object-contain inline-block" />
            <span>{selectedClass} 클래스: {filteredPosts.length}개</span>
          </span>
        )}
      </div>
    </div>
  )
} 