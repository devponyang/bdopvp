import Link from 'next/link'
import { ArrowUpRight, Database, RefreshCw } from 'lucide-react'
import type { PortalState } from '@/lib/portal/schema'

export function PageHeading({
  label,
  title,
  description,
  children,
}: {
  label: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{label}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  )
}
export function SectionHeading({
  title,
  label,
  href,
}: {
  title: string
  label?: string
  href?: string
}) {
  return (
    <div className="section-heading">
      <h2>
        {title}
        {label && <span>{label}</span>}
      </h2>
      {href && (
        <Link href={href}>
          전체 보기 <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  )
}
export function DataNotice({ state }: { state: PortalState }) {
  if (state.status === 'live')
    return (
      <div className="data-caption">
        <span className="tiny-dot" />
        {state.data.season} ·{' '}
        {state.updatedAt &&
          new Intl.DateTimeFormat('ko-KR', {
            timeZone: 'Asia/Seoul',
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(state.updatedAt))}{' '}
        갱신
      </div>
    )
  return (
    <div className="data-notice">
      <RefreshCw size={15} />
      <span>
        {state.status === 'error'
          ? '데이터를 불러오지 못했습니다. 잠시 후 다시 방문해 주세요.'
          : state.status === 'empty'
            ? '새 시즌 데이터를 준비하고 있습니다. 등록이 완료되면 표시됩니다.'
            : '새로운 시작을 준비하고 있어요. 랭킹과 전투 기록은 데이터 재구축 후 제공됩니다.'}
      </span>
      <Link href="/site-info">
        안내 <ArrowUpRight size={13} />
      </Link>
    </div>
  )
}
export function EmptyState({
  title = '새로운 기록을 기다리고 있어요',
  description = '데이터가 등록되면 이곳에서 확인할 수 있습니다.',
  compact = false,
}: {
  title?: string
  description?: string
  compact?: boolean
}) {
  return (
    <div className={`empty-state ${compact ? 'compact' : ''}`}>
      <span className="empty-icon">
        <Database size={23} strokeWidth={1.3} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link href="/tip-board">
        클래스 가이드 둘러보기 <ArrowUpRight size={14} />
      </Link>
    </div>
  )
}
