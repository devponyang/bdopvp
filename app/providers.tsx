'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
        refetchOnWindowFocus: false, // 윈도우 포커스시 자동 새로고침 비활성화
        refetchOnReconnect: false, // 네트워크 재연결시 자동 새로고침 비활성화
        retry: 1, // 재시도 횟수 제한
      },
    },
  }))

  return (
    <div className="dark">
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </div>
  )
} 