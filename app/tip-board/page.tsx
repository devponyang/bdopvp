import Link from 'next/link'
import { db } from '@/lib/db'
import PonyangLoading from '../components/PonyangLoading'

interface TipPost {
  id: number
  title: string
  is_notice?: boolean
  author?: string
  created_at: string
}

export default async function TipBoardPage() {
  try {
    // 직접 데이터베이스에서 데이터 가져오기
    const result = await db.query('SELECT id, title, is_notice, author, created_at FROM tip_posts ORDER BY is_notice DESC, created_at DESC')
    const posts: TipPost[] = result.rows

    if (!posts) return <PonyangLoading />

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-blue-200 drop-shadow text-left">📝 팁 게시판</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-blue-300 text-sm">
                <th className="w-1/2 px-2">제목</th>
                <th className="w-1/6 px-2">작성자</th>
                <th className="w-1/6 px-2">작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 text-lg py-12">등록된 팁이 없습니다.</td></tr>
              )}
              {posts.map(post => (
                <tr key={post.id} className="bg-zinc-800 hover:bg-zinc-700 transition border-b border-zinc-700">
                  <td className="px-2 py-2">
                    <Link href={`/tip-board/${post.id}`} className="flex items-center gap-2 group">
                      {post.is_notice && <span className="px-2 py-1 bg-yellow-500 text-black rounded text-xs font-bold mr-2">공지</span>}
                      <span className="font-semibold text-blue-200 group-hover:text-blue-400 truncate">{post.title}</span>
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-300">{post.author || '-'}</td>
                  <td className="px-2 py-2 text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  } catch (error) {
    console.error('팁게시판 로딩 에러:', error)
    return <PonyangLoading />
  }
} 