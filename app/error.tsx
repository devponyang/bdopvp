'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <Image
          src="/ponyang/ponyang-9.png"
          alt="포냥이 에러"
          width={120}
          height={120}
          className="mb-6 opacity-80"
        />
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'oklch(0.65 0.25 25)' }}>
          오류가 발생했어요
        </h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          예상치 못한 문제가 발생했습니다.
          {error.digest && (
            <span className="block text-xs text-zinc-600 mt-2 font-mono">
              코드: {error.digest}
            </span>
          )}
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-zinc-600 hover:border-zinc-400 transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-zinc-900"
            style={{ background: 'oklch(0.85 0.18 200)' }}
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
