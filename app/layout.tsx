import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Shell from '@/components/portal/Shell'
import { Providers } from './providers'
const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  weight: '45 920',
  display: 'swap',
  variable: '--font-pretendard',
  fallback: ['Arial', 'Malgun Gothic'],
  preload: true,
})
export const metadata: Metadata = {
  metadataBase: new URL('https://bdopvp.com'),
  title: { default: '포냥이 — 검은사막 PvP의 모든 순간', template: '%s | 포냥이' },
  description: '검은사막 솔라레의 창, 길드 리그, 거점·점령전과 클래스 가이드를 한곳에서.',
  icons: { icon: '/ponyang/ponyang-1.png' },
  openGraph: {
    title: 'PONYANG — 검은사막 PvP',
    locale: 'ko_KR',
    type: 'website',
    images: ['/ponyang/war-bg.png'],
  },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`dark ${pretendard.variable}`}>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  )
}
