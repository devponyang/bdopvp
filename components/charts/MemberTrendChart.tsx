'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

interface MemberData {
  date: string
  join: number
  leave: number
}

export default function MemberTrendChart({
  data,
  currentMemberCount,
}: {
  data: MemberData[]
  currentMemberCount: number
}) {
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
  
  const formatted: (MemberData & { total: number })[] = []

  // 과거부터 누적 계산
  let total = 0
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (i === 0) {
      total = currentMemberCount - data.slice(i + 1).reduce((acc, d) => acc + (d.join || 0) - (d.leave || 0), 0)
    } else {
      total += (item.join || 0) - (item.leave || 0)
    }
    formatted.push({ ...item, total })
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={formatted}
        margin={{ top: 15, right: 15, bottom: 10, left: 5 }}
      >
        <CartesianGrid stroke={isDark ? "#444" : "#cbd5e1"} strokeDasharray="0" />

        <XAxis
          dataKey="date"
          tick={{ fill: isDark ? '#ffffff' : '#374151', fontSize: 11 }}
          axisLine={{ stroke: isDark ? '#666' : '#9ca3af' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: isDark ? '#ffffff' : '#374151', fontSize: 11 }}
          axisLine={{ stroke: isDark ? '#666' : '#9ca3af' }}
          tickLine={false}
          width={35}
        />

        <Tooltip
          contentStyle={{ 
            backgroundColor: isDark ? '#111' : '#ffffff', 
            border: isDark ? 'none' : '1px solid #e5e7eb',
            color: isDark ? '#ffffff' : '#1f2937'
          }}
          labelFormatter={(label) => `날짜: ${label}`}
          formatter={(value, name) => {
            if (name === 'total') return [`${value}명`, '전체 인원']
            if (name === 'join') return [`${value}명`, '가입']
            if (name === 'leave') return [`${value}명`, '탈퇴']
            return [value, name]
          }}
        />
        <Legend />

        <Bar dataKey="join" fill="#10b981" name="가입" barSize={15} />
        <Bar dataKey="leave" fill={isDark ? "#d1d5db" : "#ef4444"} name="탈퇴" barSize={15} />
        <Line
          type="monotone"
          dataKey="total"
          stroke={isDark ? "#ffffff" : "#1f2937"}
          strokeWidth={3}
          name="전체 인원"
          dot={{ 
            r: 5, 
            strokeWidth: 2, 
            stroke: isDark ? '#ffffff' : '#1f2937', 
            fill: isDark ? '#000000' : '#ffffff' 
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
