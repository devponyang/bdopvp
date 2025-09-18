// ✅ 경로: app/guild/[guildName]/page.tsx
'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import GuildDetailClient from "@/components/guild/GuildDetailClient"
import { getGuildDetailClient } from "@/actions/guild/get-detail-client"
import { trackGuildPageView } from "@/lib/analytics"

export default function GuildDetailPage() {
    const { guildName } = useParams() as { guildName: string }


  const decodedGuildName = decodeURIComponent(guildName.toString())

  const [data, setData] = useState(null)

  useEffect(() => {
    if (!decodedGuildName) return

    const fetchData = async () => {
      const res = await getGuildDetailClient(decodedGuildName)
      setData(res)
    }

    fetchData()
  }, [decodedGuildName])

  // Google Analytics 길드 페이지 추적
  useEffect(() => {
    if (decodedGuildName && data) {
      // 개발 모드에서는 추적하지 않음
      if (process.env.NODE_ENV !== 'development') {
        trackGuildPageView(decodedGuildName)
      }
    }
  }, [decodedGuildName, data])

  if (!data) return <p className="text-center mt-10 text-gray-400">불러오는 중...</p>

  return <GuildDetailClient guild={data} />
}
