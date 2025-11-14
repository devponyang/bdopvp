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

  if (sortedNotices.length === 0) {
    return null
  }

  return (
    <>
      <div className="bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-4 w-full max-w-[400px] text-sm text-gray-300">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
          <img
            src="/ponyang/ponyang-1.png"
            alt="포냥이 공지"
            className="w-7 h-7 object-contain"
          />
          포냥이 공지
        </h2>

        <div className="space-y-2">
          {sortedNotices.slice(0, 4).map((notice, idx) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => handleOpenNotice(notice)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                idx === 0
                  ? "bg-white/10 border-blue-500/50 hover:bg-white/15"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border border-blue-500/40">
                  {formatDate(notice.created_at)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-200 group-hover:text-blue-300 transition-colors text-xs leading-tight line-clamp-2">
                    {notice.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {sortedNotices.length > 4 && (
          <p className="mt-3 text-xs text-gray-500 text-center">
            이전 공지는 관리자 페이지에서 확인할 수 있습니다.
          </p>
        )}
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

