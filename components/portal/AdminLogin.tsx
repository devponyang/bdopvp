'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
export default function AdminLogin() {
  const [password, setPassword] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false)
  const router = useRouter()
  return (
    <form
      className="panel admin-form"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        setMessage('')
        try {
          const res = await fetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)
          setPassword('')
          router.replace('/admin/dashboard')
          router.refresh()
        } catch (error) {
          setMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.')
        } finally {
          setBusy(false)
        }
      }}
    >
      <ShieldCheck size={28} color="var(--accent)" />
      <span className="eyebrow block mt-5">PONYANG ADMIN</span>
      <h1>운영자 로그인</h1>
      <p>등록된 관리자 계정으로 안전하게 접속합니다.</p>
      <label htmlFor="admin-password">
        비밀번호
        <input
          id="admin-password"
          className="field"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="button w-full" disabled={busy}>
        {busy ? '확인 중…' : '로그인'}
      </button>
      {message && (
        <p className="form-message" role="alert">
          {message}
        </p>
      )}
    </form>
  )
}
