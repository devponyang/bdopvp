'use client'

import { useMemo, useState } from "react"
import NoticeModal from "@/app/components/NoticeModal"

interface SiteNotice {
  id: number
  title: string
  content: string
  is_published: boolean
  created_at: string
  updated_at: string
}

interface PonyangNoticeProps {
  notices: SiteNotice[]
}

export default function PonyangNotice({ notices }: PonyangNoticeProps) {
  const [selectedNotice, setSelectedNotice] = useState<SiteNotice | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sortedNotices = useMemo(
    () =>
      [...notices].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [notices]
  )

  const handleOpenNotice = (notice: SiteNotice) => {
    setSelectedNotice(notice)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNotice(null)
  }

  if (sortedNotices.length === 0) return null

  return (
    <>
      <div
        className="w-full max-w-[400px] rounded-xl overflow-hidden border border-zinc-800/50"
        style={{ background: 'oklch(0.1 0.015 270)', borderTop: '2px solid oklch(0.85 0.18 200)' }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.06]"
          style={{ background: 'oklch(0.12 0.02 270)' }}
        >
          <img
            src="/ponyang/ponyang-1.png"
            alt="포냥이 공지"
            className="w-5 h-5 object-contain"
          />
          <h2 className="text-sm font-bold text-white">포냥이 공지</h2>
        </div>

        {/* 공지 목록 */}
        <div className="divide-y divide-white/[0.05]">
          {sortedNotices.slice(0, 4).map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => handleOpenNotice(notice)}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group"
            >
              <span className="shrink-0 text-[11px] text-zinc-500 tabular-nums w-14">
                {formatDate(notice.created_at)}
              </span>
              <span className="text-xs text-zinc-300 group-hover:text-white transition-colors leading-tight line-clamp-2 flex-1 text-left">
                {notice.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedNotice && (
        <NoticeModal
          title={selectedNotice.title}
          content={selectedNotice.content}
          isVisible={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const day = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
  return `${mm}.${dd}(${day})`
}
