// components/home/CouponCard.tsx
'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'

interface Coupon {
  code: string
  title: string
  description: string
  start_date: string
  end_date: string
  status: 'active' | 'expired'
}

type CouponCardProps = { data?: Coupon[] }

async function fetchCoupons(): Promise<Coupon[]> {
  const res = await fetch('/api/coupons')
  if (!res.ok) throw new Error('Failed to fetch coupons')
  return res.json()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const CouponCard = ({ data }: CouponCardProps) => {
  const { data: coupons = data || [], isLoading, error } = useQuery({
    queryKey: ['coupons'],
    queryFn: fetchCoupons,
    staleTime: 3600 * 1000, // 1시간
    gcTime: 3600 * 1000, // 1시간
    initialData: data,
    enabled: !data, // 초기 데이터가 있으면 쿼리 비활성화
  })

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      alert('쿠폰 코드가 복사되었습니다!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-slate-700/50 rounded w-1/2 animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-200">
        쿠폰 정보를 불러오는데 실패했습니다.
      </div>
    )
  }

  return (
    <div className="bg-zinc-800 rounded-xl border border-black dark:border-zinc-700 shadow px-4 py-5 w-full max-w-[400px]">
      <div className="px-4 py-3 border-b border-slate-700/50 rounded-t-xl -mx-4 -mt-5 mb-4">
        <h2 className="flex items-center justify-center gap-2 text-[20px] text-slate-300 font-bold tracking-wide">
          <span className="text-yellow-500 text-[22px]">🛠️</span>
          최신 쿠폰
        </h2>
      </div>
      <div className="space-y-2">
        {coupons
          .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
          .map((coupon) => (
          <div
            key={coupon.code}
            className={`group ${
              coupon.status === 'active'
                ? ''
                : 'opacity-50'
            }`}
          >
            <div className="flex items-center justify-between py-1.5">
              <div className="flex-shrink min-w-0 space-y-0.5">
                <p className="text-[13px] font-medium text-slate-200 tracking-wide group-hover:text-yellow-500 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                  {coupon.code}
                </p>
                <div className="text-[11px] text-slate-500 tracking-wide">
                  {formatDate(coupon.end_date)} 까지
                </div>
              </div>
              {coupon.status === 'active' && (
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="flex-shrink-0 ml-2 px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 rounded text-yellow-500 transition-colors text-[11px] font-medium tracking-wide"
                >
                  복사
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CouponCard