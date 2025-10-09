'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import AllianceDetailClient from "@/components/alliance/AllianceDetailClient"

interface AllianceDetail {
  name: string
  tiers: string[]
  isActive: boolean
  markUrl?: string
  totalGuilds: number
  totalMembers: number
  totalWins: number
  totalLosses: number
  totalWinRate: number
  guilds: Array<{
    name: string
    memberCount: number
    leader: string
    rank: number | null
    wins: number
    losses: number
    winRate: number
  }>
  recentWarRecords: Array<{
    warDate: string
    region: string
    occupiedArea: string
    result: string
    guildName: string
  }>
  recentVictories: Array<{
    warDate: string
    region: string
    occupiedArea: string
    result: string
    guildName: string
  }>
}

export default function AllianceDetailPage() {
  const { allianceName } = useParams() as { allianceName: string }
  const decodedAllianceName = decodeURIComponent(allianceName.toString())
  const [data, setData] = useState<AllianceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!decodedAllianceName) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/alliance-detail?name=${encodeURIComponent(decodedAllianceName)}`)
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('연맹을 찾을 수 없습니다.')
          } else {
            setError('데이터를 불러오는 중 오류가 발생했습니다.')
          }
          return
        }
        
        const allianceData = await res.json()
        setData(allianceData)
      } catch (err) {
        console.error('Failed to fetch alliance data:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [decodedAllianceName])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">연맹 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-red-400">오류 발생</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a 
            href="/war-records/summary" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            연맹 목록으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-4">연맹을 찾을 수 없습니다</h1>
          <p className="text-gray-400 mb-6">요청하신 연맹이 존재하지 않거나 비활성 상태입니다.</p>
          <a 
            href="/war-records/summary" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            연맹 목록으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return <AllianceDetailClient alliance={data} />
}
