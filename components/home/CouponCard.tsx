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
  created_at?: string
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

  // 7일 이내 추가된 쿠폰인지 확인
  const isNewCoupon = (createdAt?: string) => {
    if (!createdAt) return false
    const created = new Date(createdAt)
    const now = new Date()
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
        <div className="animate-pulse">
          <div className="bg-white/10 rounded h-6 w-3/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-lg h-16"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
        <div className="text-red-300 text-center py-4">
          쿠폰 정보를 불러오는데 실패했습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px]">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
        <span className="text-xl">🎫</span>
        최신 쿠폰
      </h2>
      <div className="space-y-2">
        {coupons
          .filter(c => c.status === 'active')
          .map((coupon) => (
          <div
            key={coupon.code}
            className="relative bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 hover:border-yellow-500/50 transition-all group"
          >
            {/* New 배지 */}
            {isNewCoupon(coupon.created_at) && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                NEW
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors break-all">
                    {coupon.code}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 rounded-lg text-yellow-400 transition-all text-xs font-bold border border-yellow-500/30"
                >
                  복사
                </button>
              </div>
              {coupon.description && (
                <p className="text-xs text-gray-400 line-clamp-2">{coupon.description}</p>
              )}
              <div className="text-xs text-gray-500">
                {formatDate(coupon.end_date)} 까지
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CouponCard