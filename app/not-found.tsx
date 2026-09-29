import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="relative mb-6">
          <Image
            src="/ponyang/ponyang-9.png"
            alt="포냥이 404"
            width={140}
            height={140}
            className="drop-shadow-[0_0_20px_oklch(0.7_0.28_340_/_0.5)]"
            priority
          />
        </div>
        <p className="text-8xl font-black mb-4 tracking-tighter" style={{ color: 'oklch(0.85 0.18 200 / 0.3)' }}>
          404
        </p>
        <h1 className="text-2xl font-bold mb-3">페이지를 찾을 수 없어요</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          요청하신 페이지가 없거나 이동됐을 수 있습니다.
        </p>
        <Link
          href="/"
          className="px-8 py-3 rounded-xl font-semibold text-zinc-900 transition-transform hover:scale-105"
          style={{ background: 'oklch(0.85 0.18 200)' }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
