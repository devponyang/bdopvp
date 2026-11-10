'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Home,
  Menu,
  Search,
  Shield,
  Swords,
  Trophy,
  Users,
  X,
} from 'lucide-react'

const navigation = [
  { href: '/', label: '홈', icon: Home },
  { href: '/solare-league', label: '솔라레의 창', icon: Swords },
  { href: '/guild-league', label: '길드 리그', icon: Shield },
  { href: '/war-records', label: '거점 · 점령전', icon: Trophy },
  { href: '/tip-board', label: '클래스 가이드', icon: BookOpen },
  { href: '/guild-recruit', label: '길드 모집', icon: Users },
  { href: '/Tournament', label: '대회', icon: Trophy },
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    if (open) dialog.current?.showModal()
    else dialog.current?.close()
    const previous = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])
  const links = navigation.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      className={`nav-item ${href === '/' ? (pathname === '/' ? 'active' : '') : pathname.startsWith(href) ? 'active' : ''}`}
      aria-current={
        (href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined
      }
    >
      <Icon size={18} />
      <span>{label}</span>
      <ChevronRight className="nav-chevron" size={14} />
    </Link>
  ))
  return (
    <div className="portal-shell">
      <a href="#main-content" className="skip-link">
        본문으로 이동
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand">
            <Image src="/ponyang/ponyang-1.png" width={38} height={38} alt="" priority />
            <span>
              PONYANG<span className="brand-sub">검은사막 PvP 커뮤니티</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="주 메뉴">
            {links}
          </nav>
          <a
            className="community-link"
            href="https://discord.gg/mD37c4GEby"
            target="_blank"
            rel="noreferrer"
          >
            디스코드 <ArrowUpRight size={16} />
          </a>
          <button
            className="icon-button mobile-menu"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <div className="portal-body">
        {pathname !== '/' && (
          <div className="utility-bar">
            <Link href="/" className="utility-home">
              포냥이 / 전적과 공략
            </Link>
            <form action="/search" className="global-search">
              <Search size={17} />
              <input
                name="q"
                aria-label="길드, 모험가, 클래스 검색"
                placeholder="길드, 모험가, 클래스 검색"
                maxLength={100}
                required
              />
              <button type="submit" aria-label="검색">
                <ChevronRight size={18} />
              </button>
            </form>
          </div>
        )}
        <main id="main-content" className="page-content">
          {children}
        </main>
        <footer className="portal-footer">
          <span>
            © {new Date().getFullYear()} PONYANG <small>검은사막 PvP 커뮤니티</small>
          </span>
          <div>
            <Link href="/agreement">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/support">문의</Link>
            <Link href="/admin/login">관리자</Link>
          </div>
          <p>본 사이트는 펄어비스와 관련이 없는 팬 사이트입니다.</p>
        </footer>
      </div>
      <dialog
        ref={dialog}
        className="mobile-dialog"
        aria-label="전체 메뉴"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false)
        }}
      >
        <div className="mobile-dialog-content">
          <div className="section-heading">
            <strong>PONYANG</strong>
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="메뉴 닫기">
              <X />
            </button>
          </div>
          <nav aria-label="모바일 주 메뉴">{links}</nav>
          <Link className="button secondary" href="/site-info" onClick={() => setOpen(false)}>
            서비스 안내
          </Link>
        </div>
      </dialog>
    </div>
  )
}
