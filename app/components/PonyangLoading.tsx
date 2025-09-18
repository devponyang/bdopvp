"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const images = Array.from({ length: 9 }, (_, i) => `/ponyang/ponyang-${i + 1}.png`);

interface PonyangLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PonyangLoading({ message = "데이터를 불러오는 중...", size = 'md' }: PonyangLoadingProps) {
  const [idx, setIdx] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, 600); // 800ms -> 600ms로 빨라지게
    return () => clearInterval(timer);
  }, []);

  // 다음 이미지 preload
  useEffect(() => {
    const nextIdx = (idx + 1) % images.length;
    const img = new window.Image();
    img.src = images[nextIdx];
  }, [idx]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <div className="relative">
        <Image 
          src={images[idx]} 
          alt="로딩 중" 
          width={size === 'sm' ? 48 : size === 'md' ? 96 : 128}
          height={size === 'sm' ? 48 : size === 'md' ? 96 : 128}
          className={`${sizeClasses[size]} mb-3 animate-bounce`}
        />
        {/* 로딩 스피너 */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-gray-300 text-sm font-medium mb-2">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
} 