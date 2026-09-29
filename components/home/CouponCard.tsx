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

const isNewCoupon = (createdAt?: string) => {
  if (!createdAt) return false
  const diffDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 7
}

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div
    className="w-full max-w-[400px] rounded-xl overflow-hidden border border-zinc-800/50"
    style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
  >
    {children}
  </div>
)

const CouponCard = ({ data }: CouponCardProps) => {
  const { data: coupons = data || [], isLoading, error } = useQuery({
    queryKey: ['coupons'],
    queryFn: fetchCoupons,
    staleTime: 3600 * 1000,
    gcTime: 3600 * 1000,
    initialData: data,
    enabled: !data,
  })

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      alert('쿠폰 코드가 복사되었습니다!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isLoading) return (
    <CardShell>
      <div
        className="px-4 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <div className="h-4 w-24 bg-zinc-700/60 rounded animate-pulse" />
      </div>
      <div className="px-4 py-3 space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-zinc-800/40 rounded-lg animate-pulse" />
        ))}
      </div>
    </CardShell>
  )

  if (error) return (
    <CardShell>
      <div className="py-10 text-center text-zinc-600 text-sm">
        쿠폰 정보를 불러오는데 실패했습니다.
      </div>
    </CardShell>
  )

  const activeCoupons = coupons.filter(c => c.status === 'active')

  return (
    <CardShell>
      {/* 헤더 */}
      <div
        className="flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.06]"
        style={{ background: 'oklch(0.12 0.02 270)' }}
      >
        <span className="text-base leading-none">🎫</span>
        <h2 className="text-sm font-bold text-white">최신 쿠폰</h2>
      </div>

      {/* 쿠폰 목록 */}
      <div className="divide-y divide-white/[0.05]">
        {activeCoupons.length === 0 ? (
          <div className="py-10 text-center text-zinc-600 text-sm">
            현재 활성화된 쿠폰이 없습니다.
          </div>
        ) : (
          activeCoupons.map((coupon) => (
            <div
              key={coupon.code}
              className="relative flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group"
            >
              {isNewCoupon(coupon.created_at) && (
                <span className="absolute top-2.5 right-3 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors break-all pr-8">
                  {coupon.code}
                </p>
                {coupon.description && (
                  <p className="text-[11px] text-zinc-500 line-clamp-1">{coupon.description}</p>
                )}
                <p className="text-[11px] text-zinc-600">{formatDate(coupon.end_date)} 까지</p>
              </div>
              <button
                onClick={() => copyToClipboard(coupon.code)}
                className="shrink-0 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-[11px] font-medium mt-0.5"
              >
                복사
              </button>
            </div>
          ))
        )}
      </div>
    </CardShell>
  )
}

export default CouponCard
