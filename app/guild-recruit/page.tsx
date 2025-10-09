'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'

interface RecruitPost {
  id: number
  guild_name: string
  title: string
  content: string
  contact_info: string
  requirements: string
  created_at: string
  updated_at: string
  author: string
  is_active: boolean
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function GuildRecruitPage() {
  const [posts, setPosts] = useState<RecruitPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage])

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/guild-recruit?page=${page}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('길드 모집 글 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredPosts = posts

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          🏰 길드 모집 게시판
        </h1>
        <p className="text-gray-400 text-lg">
          새로운 길드원을 찾고 계신가요? 함께할 길드를 찾고 계신가요?
        </p>
      </div>


      {/* 모집 글 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">불러오는 중...</div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-400 text-lg">
            등록된 모집 글이 없습니다.
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/guild-recruit/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 모집 글 작성하기
            </button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          {/* 데스크톱 테이블 */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-gray-300 font-semibold text-sm">번호</th>
                  <th className="text-left py-2 px-3 text-gray-300 font-semibold text-sm">길드명</th>
                  <th className="text-left py-2 px-3 text-gray-300 font-semibold text-sm">제목</th>
                  <th className="text-left py-2 px-3 text-gray-300 font-semibold text-sm">작성자</th>
                  <th className="text-left py-2 px-3 text-gray-300 font-semibold text-sm">작성일</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => (
                  <tr key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-3 text-gray-400 text-sm">
                      {pagination ? pagination.total - (pagination.page - 1) * pagination.limit - index : filteredPosts.length - index}
                    </td>
                    <td className="py-2 px-3">
                      <Link 
                        href={`/guild/${encodeURIComponent(post.guild_name)}`}
                        className="text-blue-300 hover:text-blue-400 transition-colors font-medium text-sm"
                      >
                        {post.guild_name}
                      </Link>
                    </td>
                    <td className="py-2 px-3">
                      <Link 
                        href={`/guild-recruit/${post.id}`}
                        className="text-white hover:text-blue-400 transition-colors font-medium text-sm"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-gray-300 text-sm">{post.author}</td>
                    <td className="py-2 px-3 text-gray-400 text-sm">{formatDate(post.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 목록 */}
          <div className="md:hidden space-y-3">
            {filteredPosts.map((post, index) => (
              <div key={post.id} className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">
                      #{pagination ? pagination.total - (pagination.page - 1) * pagination.limit - index : filteredPosts.length - index}
                    </span>
                    {post.is_active ? (
                      <span className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded">
                        모집중
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded">
                        모집완료
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Link 
                    href={`/guild/${encodeURIComponent(post.guild_name)}`}
                    className="text-blue-300 hover:text-blue-400 transition-colors text-sm font-medium"
                  >
                    {post.guild_name}
                  </Link>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{post.author}</span>
                </div>
                <h3 className="font-semibold text-white">
                  <Link 
                    href={`/guild-recruit/${post.id}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 페이지네이션 */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          className="my-6"
        />
      )}

      {/* 모집 글 작성 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/guild-recruit/new')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          📝 모집 글 작성하기
        </button>
      </div>

      {/* 안내 메시지 */}
      <Card className="p-6 bg-slate-800/30">
        <h3 className="text-lg font-semibold text-white mb-3">📋 이용 안내</h3>
        <div className="text-sm text-gray-400 space-y-2">
          <p>• 길드 모집 글은 길드 관련 정보만 게시해주세요.</p>
          <p>• 허위 정보나 광고성 글은 삭제될 수 있습니다.</p>
          <p>• 연락처는 게임 내 닉네임이나 디스코드 등을 이용해주세요.</p>
          <p>• 모집이 완료되면 모집 상태를 변경해주세요.</p>
        </div>
      </Card>
    </div>
  )
}
