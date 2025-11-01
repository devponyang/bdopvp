'use client'

import Image from 'next/image'

const YOUTUBE_VIDEO_ID = 'srJbmOwCq0w'

export default function NodeWarVideo() {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`

  return (
    <section className="node-war-video-card bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden relative">
      <header className="px-3 md:px-6 py-3 md:py-4 border-b border-white/10">
        <h2 className="text-lg md:text-2xl font-bold text-white flex items-center justify-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/10">
            <Image
              src="/ponyang/masterclass.png"
              alt="마스터 클래스 아이콘"
              fill
              sizes="32px"
              className="object-contain"
            />
          </span>
          <span>BDOPVP-포냥이 : MasterClass</span>
        </h2>
      </header>

      <div className="px-3 md:px-6 py-3 md:py-6">
        <div
          className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black"
          style={{ paddingTop: '56.25%' }}
        >
          <iframe
            title="마스터 클래스 OST 영상"
            src={embedUrl}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <p className="mt-3 text-sm text-center text-gray-300">
          AI와 상상을 더해 완성한 마스터 클래스 테마 OST를 감상해 보세요.
        </p>
      </div>
    </section>
  )
}

