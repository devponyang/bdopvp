'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'

interface SpecializationData {
  player_name: string
  class: string
  specialization_image_url?: string
  description?: string
  updated_at: string
}

interface SpecializationModalProps {
  playerName: string
  className: string
  isOpen: boolean
  onClose: () => void
}

export default function SpecializationModal({
  playerName,
  className,
  isOpen,
  onClose,
}: SpecializationModalProps) {
  const [specialization, setSpecialization] = useState<SpecializationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen && playerName && className) {
      fetchSpecialization()
      
      // 모달 내용 스크롤을 맨 위로
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.scrollTop = 0
        }
      }, 100)
    }
  }, [isOpen, playerName, className])

  const fetchSpecialization = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(
        `/api/solare-league/specialization?player=${encodeURIComponent(playerName)}&class=${encodeURIComponent(className)}`
      )
      
      if (res.ok) {
        const data = await res.json()
        setSpecialization(data)
      } else if (res.status === 404) {
        setError('특화 정보가 등록되지 않았습니다.')
      } else {
        setError('특화 정보를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        overflow: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}
      onClick={onClose}
      onTouchMove={(e) => {
        // 배경 터치 이동 막기
        if (e.target === e.currentTarget) {
          e.preventDefault()
        }
      }}
    >
      <div className="h-full w-full flex items-center justify-center p-4" style={{ overflow: 'hidden' }}>
        <div 
          ref={modalRef}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10 relative"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {playerName}의 특화 정보
            </h2>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          <div className="mb-4">
            <span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              {className}
            </span>
          </div>

          {/* 내용 */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mb-3"></div>
              <div className="text-gray-400">로딩 중...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-400 text-lg">{error}</p>
            </div>
          ) : specialization ? (
            <div className="space-y-4">
              {/* 특화 이미지 */}
              {specialization.specialization_image_url && (
                <div className="relative rounded-xl overflow-hidden bg-black/30 p-2">
                  <img
                    src={specialization.specialization_image_url}
                    alt={`${playerName}의 특화`}
                    className="w-full h-auto mx-auto rounded-lg shadow-2xl"
                    style={{ maxHeight: '70vh' }}
                  />
                </div>
              )}

              {/* 설명 */}
              {specialization.description && (
                <div className="bg-gradient-to-br from-zinc-700/80 to-zinc-800/80 rounded-xl p-4 border border-white/10">
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span>💬</span>
                    <span>특화 설명</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{specialization.description}</p>
                </div>
              )}

              {/* 업데이트 시간 */}
              <div className="text-xs text-gray-500 text-center py-2">
                <span className="bg-zinc-700/50 px-3 py-1 rounded-full">
                  마지막 업데이트: {new Date(specialization.updated_at).toLocaleString('ko-KR')}
                </span>
              </div>

              {!specialization.specialization_image_url && !specialization.description && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-gray-400 text-lg">등록된 특화 정보가 없습니다.</p>
                </div>
              )}
            </div>
          ) : null}

          {/* 닫기 버튼 */}
          <div className="flex justify-center mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95"
            >
              닫기
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}





























