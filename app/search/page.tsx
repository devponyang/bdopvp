'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { trackGuildSearch } from '@/lib/analytics'

type SearchResult = {
  type: 'guild'
  name: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 길드 검색 추적
        if (process.env.NODE_ENV !== 'development') {
          trackGuildSearch(query)
        }
        
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data: SearchResult[] = await res.json()
        
        // 검색 결과가 정확히 하나이고, 검색어와 정확히 일치하는 경우 바로 리다이렉트
        if (data.length === 1 && data[0].name.toLowerCase() === query.toLowerCase()) {
          router.replace(`/guild/${encodeURIComponent(data[0].name)}`)
          return
        }
        
        setResults(data)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    } else {
      setResults([])
      setLoading(false)
    }
  }, [query, router])

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-white">🔍 검색 결과: {query}</h1>

      {loading && <p className="text-gray-400">로딩 중...</p>}

      {!loading && results.length === 0 && (
        <p className="text-red-400">검색 결과가 없습니다.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item) => (
          <Link
            key={`${item.type}-${item.name}`}
            href={`/${item.type}/${encodeURIComponent(item.name)}`}
            className="bg-zinc-900 p-4 rounded-lg shadow hover:bg-zinc-800 transition block border border-zinc-700"
          >
            <h2 className="text-xl font-bold mb-2 text-white">
              🏰 길드 {item.name}
            </h2>
            <p className="text-sm text-zinc-400">클릭하여 상세 페이지로 이동</p>
          </Link>
        ))}
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-5xl mx-auto">
      <Suspense fallback={<p className="text-gray-400">검색어를 불러오는 중...</p>}>
        <SearchContent />
      </Suspense>
    </main>
  )
}
