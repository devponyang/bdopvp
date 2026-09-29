"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const images = Array.from({ length: 9 }, (_, i) => `/ponyang/ponyang-${i + 1}.png`);

interface PonyangLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 48, md: 96, lg: 128 };
const sizeClasses = { sm: 'w-12 h-12', md: 'w-24 h-24', lg: 'w-32 h-32' };

export default function PonyangLoading({ message = "데이터를 불러오는 중...", size = 'md' }: PonyangLoadingProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((prev) => (prev + 1) % images.length), 600);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.src = images[(idx + 1) % images.length];
  }, [idx]);

  const px = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4" suppressHydrationWarning>
      <div className="relative">
        <Image
          src={images[idx]}
          alt="로딩 중"
          width={px}
          height={px}
          className={`${sizeClasses[size]} mb-3 animate-bounce`}
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-gray-300 text-sm font-medium mb-2">{message}</p>
        <div className="flex space-x-1 justify-center">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
