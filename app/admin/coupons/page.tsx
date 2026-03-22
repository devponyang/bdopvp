'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Coupon {
  id: number
  code: string
  end_date: string
}

export default function CouponAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons')
      const data = await response.json()
      setCoupons(data)
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: newCoupon.code,
          title: '쿠폰',
          description: '게임 내 쿠폰 입력창에서 등록해주세요.',
          start_date: new Date().toISOString().split('T')[0],
          end_date: newCoupon.end_date
        }),
      })

      if (response.ok) {
        setNewCoupon({})
        setError(null)
        fetchCoupons()
      } else {
        const data = await response.json()
        setError(data.error || '쿠폰 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to create coupon:', error)
      setError('쿠폰 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 쿠폰을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCoupons()
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎫</span>
          </div>
          <h1 className="text-3xl font-bold text-white">쿠폰 관리</h1>
        </div>
      </div>

      {/* 쿠폰 추가 폼 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">새 쿠폰 추가</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">쿠폰 코드</label>
              <Input
                type="text"
                value={newCoupon.code || ''}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                placeholder="쿠폰 코드를 입력하세요"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">종료일</label>
              <Input
                type="date"
                value={newCoupon.end_date || ''}
                onChange={(e) => setNewCoupon({ ...newCoupon, end_date: e.target.value })}
                className="bg-slate-700/50 border-slate-600 text-white focus:border-green-500"
                required
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? '추가 중...' : '🎫 쿠폰 추가'}
          </Button>
        </form>
      </div>

      {/* 쿠폰 목록 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">쿠폰 목록</h2>
        
        {coupons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎫</div>
            <p className="text-gray-400 text-lg">등록된 쿠폰이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {coupons
              .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
              .map((coupon) => (
                <Card key={coupon.id} className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-bold text-xl text-white">{coupon.code}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          new Date(coupon.end_date) < new Date() 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {new Date(coupon.end_date) < new Date() ? '만료' : '활성'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>📅</span>
                        <span>종료일: {coupon.end_date}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(coupon.id)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all"
                    >
                      🗑️ 삭제
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  )
} 