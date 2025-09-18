"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/card'
import Image from 'next/image'

interface GuildMark {
  id: number
  guild_name: string
  mark_url: string
  created_at: string
  updated_at: string
}

export default function GuildMarksSection() {
  const [guildMarks, setGuildMarks] = useState<GuildMark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuildMarks = async () => {
      try {
        const response = await fetch('/api/guild-marks')
        if (response.ok) {
          const data = await response.json()
          setGuildMarks(data)
        }
      } catch (error) {
        console.error('길드마크 목록을 불러오는데 실패했습니다:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGuildMarks()
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">길드마크를 불러오는 중...</span>
        </div>
      </Card>
    )
  }

  if (guildMarks.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏷️</div>
          <h3 className="text-xl font-bold text-purple-200 mb-2">후원자 길드마크</h3>
          <p className="text-gray-400">아직 등록된 길드마크가 없습니다.</p>
          <p className="text-sm text-gray-500 mt-2">
            후원 후 디스코드에서 @디움에게 길드마크 신청을 해보세요!
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-purple-200 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🏷️</span>
          후원자 길드마크
        </h3>
        <p className="text-gray-400">
          BDOPonyang을 후원해주신 길드들의 특별한 마크입니다
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {guildMarks.map((mark) => (
          <div 
            key={mark.id} 
            className="group relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
          >
            <div className="aspect-square w-full flex items-center justify-center mb-3">
              <Image
                src={mark.mark_url}
                alt={`${mark.guild_name} 길드마크`}
                width={80}
                height={80}
                className="object-contain max-w-full max-h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/guild-icons/default.png'
                }}
              />
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-purple-200 text-sm truncate group-hover:text-purple-100 transition-colors">
                {mark.guild_name}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(mark.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>

            {/* 호버 시 길드 페이지 링크 표시 */}
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <a
                href={`/guild/${encodeURIComponent(mark.guild_name)}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                길드 보기
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          💝 <a href="/support" className="text-purple-400 hover:text-purple-300 underline">
            후원하기
          </a>를 통해 여러분의 길드마크도 등록해보세요!
        </p>
      </div>
    </Card>
  )
}







