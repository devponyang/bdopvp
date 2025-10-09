'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/card'
import Link from 'next/link'
import { renderMarkdown } from '@/lib/markdown'
import ClickableContent from '@/components/ClickableContent'

interface RecruitPost {
  id: number
  guild_name: string
  title: string
  content: string
  requirements: string
  contact_info: string
  author: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function RecruitDetailPage() {
  const [post, setPost] = useState<RecruitPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/guild-recruit/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        setError('모집 글을 찾을 수 없습니다.')
      }
    } catch (error) {
      setError('모집 글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatContent = (content: string) => {
    return renderMarkdown(content)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400">불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={() => router.push('/guild-recruit')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* 뒤로가기 */}
      <div>
        <button
          onClick={() => router.push('/guild-recruit')}
          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      {/* 모집 글 헤더 */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.is_active ? (
            <span className="px-3 py-1 bg-green-600/20 text-green-300 text-sm rounded-lg">
              모집중
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-600/20 text-gray-400 text-sm rounded-lg">
              모집완료
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {post.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>길드: 
              <Link 
                href={`/guild/${encodeURIComponent(post.guild_name)}`}
                className="text-blue-400 hover:text-blue-300 transition-colors ml-1"
              >
                {post.guild_name}
              </Link>
            </span>
            <span>작성자: {post.author}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>작성일: {formatDate(post.created_at)}</span>
            {post.updated_at !== post.created_at && (
              <span>수정일: {formatDate(post.updated_at)}</span>
            )}
          </div>
        </div>
      </Card>

      {/* 모집 내용 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">📋 모집 내용</h2>
        <ClickableContent 
          content={formatContent(post.content)}
          className="text-gray-300 leading-relaxed"
        />
      </Card>

      {/* 모집 조건 */}
      {post.requirements && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">✅ 모집 조건</h2>
          <ClickableContent 
            content={formatContent(post.requirements)}
            className="text-gray-300 leading-relaxed"
          />
        </Card>
      )}

      {/* 연락처 */}
      {post.contact_info && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">📞 연락처</h2>
          <div className="text-gray-300">
            {post.contact_info}
          </div>
        </Card>
      )}

      {/* 안내 메시지 */}
      <Card className="p-6 bg-slate-800/30">
        <h3 className="text-lg font-semibold text-white mb-3">💡 지원 안내</h3>
        <div className="text-sm text-gray-400 space-y-2">
          <p>• 위 연락처로 직접 연락하여 지원해주세요.</p>
          <p>• 길드 가입 전 길드 규칙이나 활동 내용을 충분히 확인해보세요.</p>
          <p>• 허위 정보나 스팸성 연락은 피해주세요.</p>
        </div>
      </Card>

      {/* 하단 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push('/guild-recruit')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다른 모집 글 보기
        </button>
      </div>
    </div>
  )
}
