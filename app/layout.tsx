export const dynamic = 'force-dynamic'
export const revalidate = 0

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// app/layout.tsx에서 아래처럼 고쳐줘
import Navbar from "@/components/Navbar"
import { createIndexes } from '@/lib/db'
import { Providers } from './providers'
import { ReactNode } from 'react'
import TrafficTracker from './components/TrafficTracker'
import StructuredData from './components/StructuredData'
// import PageTracker from './components/PageTracker'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  verification: {
    google: 'GSkfBCQ-uXg_Dt1yM5NLV10CaFgvD-TxQ-qrJXHDoms',
  },
  icons: {
    icon: '/ponyang/ponyang-1.png',
    shortcut: '/ponyang/ponyang-1.png',
    apple: '/ponyang/ponyang-1.png',
  },
  title: {
    default: "포냥이 - 검은사막 정보 사이트",
    template: "%s | 포냥이"
  },
  description: "검은사막 온라인의 최신 정보를 제공하는 포냥이 사이트. 월드보스, 거점전, 솔라레의 창, 길드 리그 등 모든 정보를 한눈에 확인하세요.",
  keywords: ["검은사막", "BDO", "월드보스", "거점전", "솔라레의 창", "길드 리그", "포냥이", "게임 정보"],
  authors: [{ name: "포냥이" }],
  creator: "포냥이",
  publisher: "포냥이",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bdopvp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://bdopvp.com',
    title: '포냥이 - 검은사막 정보 사이트',
    description: '검은사막 온라인의 최신 정보를 제공하는 포냥이 사이트. 월드보스, 거점전, 솔라레의 창, 길드 리그 등 모든 정보를 한눈에 확인하세요.',
    siteName: '포냥이',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: '포냥이 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '포냥이 - 검은사막 정보 사이트',
    description: '검은사막 온라인의 최신 정보를 제공하는 포냥이 사이트',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // 앱 시작 시 인덱스 생성
  if (typeof window === 'undefined') {
    createIndexes().catch(console.error)
  }

  return (
    <html lang="ko" className="dark">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GK1BTTBNEF" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GK1BTTBNEF');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PTQT3NFW');`,
          }}
        />
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white dark`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PTQT3NFW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <TrafficTracker />
          {/* <PageTracker /> */}
          <Navbar />
          <main className="min-h-screen pb-24">
            {children}
          </main>
          <footer className="bg-zinc-900 border-t border-zinc-800 py-3 px-4 text-center text-xs text-zinc-400">
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-wrap justify-center gap-2 text-[13px] text-zinc-300">
                <a href="/site-info" className="hover:underline">사이트 소개</a>
                <span>|</span>
                <a href="/agreement" className="hover:underline">사이트 이용약관</a>
                <span>|</span>
                <a href="/privacy" className="hover:underline">개인정보처리방침</a>
                <span>|</span>
                <a href="https://discord.gg/mD37c4GEby" className="hover:underline">오류/건의</a>
                <span>|</span>
                <a href="/support" className="hover:underline">광고/후원문의</a>
              </div>
              <div className="text-[12px] mt-1">© 2025. BDOPonyang All rights reserved.</div>
              <div className="text-[12px] text-zinc-500">This site is not associated with Pearl Abyss.</div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
