import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

interface TipPost {
  id: number
  title: string
  content: string
  tags: string[]
  image_urls: string[]
  created_at: string
  updated_at: string
}

export default async function TipPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const headersList = headers();
  const host = (await headersList).get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  // Ensure params is awaited properly
  const { id } = await params;
  if (!id) return notFound();

  const res = await fetch(`${protocol}://${host}/api/tip-board/${id}`, { cache: 'no-store' });
  if (!res.ok) return notFound();

  const post: TipPost = await res.json();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-400 mb-2">작성일: {new Date(post.created_at).toLocaleString('ko-KR')}</div>
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">#{tag}</span>
          ))}
        </div>
      )}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.image_urls.map((url, idx) => (
            <img key={idx} src={url} alt="팁 이미지" className="max-w-xs rounded border border-zinc-700" />
          ))}
        </div>
      )}
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}