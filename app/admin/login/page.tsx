"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 로딩 시뮬레이션 (실제 인증 시간)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 입력 검증
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    // 비밀번호 검증 (환경변수에서 가져오는 것이 더 안전하지만, 현재는 하드코딩)
    const correctPassword = 'gortkdxks1@'
    
    console.log('입력된 비밀번호:', password)
    console.log('올바른 비밀번호:', correctPassword)
    console.log('비밀번호 길이 비교:', password.length, 'vs', correctPassword.length)
    
    // 타이밍 공격 방지를 위한 상수 시간 비교
    let isValid = true
    if (password.length !== correctPassword.length) {
      isValid = false
      console.log('비밀번호 길이가 다름')
    } else {
      for (let i = 0; i < password.length; i++) {
        if (password[i] !== correctPassword[i]) {
          isValid = false
          console.log(`비밀번호 ${i}번째 문자가 다름:`, password[i], 'vs', correctPassword[i])
          break
        }
      }
    }
    
    console.log('비밀번호 검증 결과:', isValid)

    if (isValid) {
      // 쿠키 설정 (HTTPS 환경 고려)
      document.cookie = `isAdmin=true; path=/; max-age=86400; SameSite=Lax`
      console.log('쿠키 설정 완료:', document.cookie)
      router.push('/admin/dashboard')
    } else {
      setError('비밀번호가 올바르지 않습니다.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700 p-8">
          {/* 로고/제목 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">관리자 로그인</h1>
            <p className="text-gray-400 text-sm">관리자 권한이 필요합니다</p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="관리자 비밀번호를 입력하세요"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          {/* 홈으로 가기 링크 */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← 홈페이지로 돌아가기
            </Link>
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            이 페이지는 관리자만 접근할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
} 