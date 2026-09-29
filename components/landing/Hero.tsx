'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(springY, [-300, 300], [8, -8]);
  const rotateY = useTransform(springX, [-300, 300], [-8, 8]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[70vh] overflow-hidden select-none"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.12 0.03 270) 0%, oklch(0.06 0.01 270) 100%)' }}
    >
      {/* 배경 글로우 오브 */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'oklch(0.85 0.18 200)' }} />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'oklch(0.7 0.28 340)' }} />
      </div>

      {/* 포냥이 마스코트 */}
      <motion.div
        className="relative z-10 mb-6"
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative glow-pulse">
          <Image
            src="/ponyang/ponyang-8.png"
            alt="포냥이 마스코트"
            width={180}
            height={180}
            priority
            className="drop-shadow-[0_0_30px_oklch(0.85_0.18_200_/_0.6)]"
          />
        </div>
      </motion.div>

      {/* 헤드라인 */}
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 leading-tight">
          <span className="text-white">검은사막 </span>
          <span
            className="glow-text-cyan"
            style={{ color: 'oklch(0.85 0.18 200)' }}
          >
            PvP
          </span>
          <span className="text-white"> 정보의 중심</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-xl mx-auto">
          거점전 · 점령전 · 솔라레의 창 · 길드 리그 — 모든 PvP 정보를 한 곳에
        </p>
      </motion.div>

      {/* CTA 버튼 */}
      <motion.div
        className="relative z-10 flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/war-records"
          className="glow-border relative px-7 py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.85_0.18_200)]"
          style={{ background: 'oklch(0.85 0.18 200 / 0.15)', border: '1px solid oklch(0.85 0.18 200 / 0.4)' }}
        >
          전쟁 기록 보기
        </Link>
        <Link
          href="/guild-league/1"
          className="px-7 py-3 rounded-xl font-semibold text-zinc-300 text-sm sm:text-base border border-zinc-700 hover:border-zinc-500 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          길드 리그 순위
        </Link>
      </motion.div>

      {/* 스크롤 힌트 */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-zinc-600 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        aria-hidden="true"
      >
        <span>스크롤</span>
        <motion.div
          className="w-0.5 h-6 rounded-full"
          style={{ background: 'oklch(0.85 0.18 200 / 0.4)' }}
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
