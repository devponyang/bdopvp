'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

export default function RankTrendChart({ guildName }: { guildName: string }) {
  const [data, setData] = useState<{ date: string; rank: number }[]>([])
  const [isDark, setIsDark] = useState(true)

  // 테마 변경 감지
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // 테마 변경 감지
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/guild-rank-history?name=${encodeURIComponent(guildName)}`)
        const json = await res.json()

        // 항상 일주일 간격으로 데이터 선택 (모바일/데스크톱 구분 없이)
        const weeklyFiltered = json.filter((_: any, index: number) => index % 7 === 0)
        
        const formatted = weeklyFiltered.map((item: any) => {
          const utcDate = new Date(item.snapshot_date)
          const kst = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000)
          const mm = String(kst.getMonth() + 1).padStart(2, '0')
          const dd = String(kst.getDate()).padStart(2, '0')

          return {
            date: `${mm}-${dd}`, // 주 단위 날짜
            rank: Number(item.rank),
          }
        })
        
        setData(formatted)
      } catch (err) {
        console.error("🔥 길드리그 히스토리 오류:", err)
      }
    }

    fetchData()
  }, [guildName])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 15, right: 15, bottom: 10, left: 5 }}>
        <CartesianGrid stroke={isDark ? "#444" : "#cbd5e1"} strokeDasharray="0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 11, fill: isDark ? '#ffffff' : '#374151' }}
          axisLine={{ stroke: isDark ? '#666' : '#9ca3af' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          type="number"
          domain={[100, 1]}
          ticks={[1, 20, 40, 60, 80, 100]}
          allowDecimals={false}
          reversed
          tick={{ fill: isDark ? '#ffffff' : '#374151', fontSize: 11 }}
          axisLine={{ stroke: isDark ? '#666' : '#9ca3af' }}
          width={35}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: isDark ? 'black' : '#ffffff', 
            border: isDark ? 'none' : '1px solid #e5e7eb',
            color: isDark ? '#fff' : '#1f2937'
          }}
          labelStyle={{ color: isDark ? '#fff' : '#1f2937' }}
          formatter={(value) => `${value}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="rank"
          stroke={isDark ? "#ffffff" : "#1f2937"}
          strokeWidth={3}
          dot={{ 
            r: 5, 
            strokeWidth: 2, 
            stroke: isDark ? '#ffffff' : '#1f2937', 
            fill: isDark ? '#000000' : '#ffffff' 
          }}
          activeDot={{ r: 7 }}
          name="길드리그 순위"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
