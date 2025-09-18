"use client";

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  width?: string;
  height?: string;
}

export default function SkeletonLoader({ 
  className = "", 
  lines = 1, 
  width = "100%", 
  height = "1rem" 
}: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-700 rounded"
          style={{
            width: index === lines - 1 ? "75%" : width,
            height: height,
            marginBottom: index < lines - 1 ? "0.5rem" : "0"
          }}
        />
      ))}
    </div>
  );
}

// 특화된 스켈레톤 컴포넌트들
export function CardSkeleton() {
  return (
    <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
      <div className="animate-pulse">
        <div className="bg-zinc-700 rounded h-3 w-3/4 mb-2"></div>
        <div className="bg-zinc-700 rounded h-2.5 w-1/2 mb-1.5"></div>
        <div className="bg-zinc-700 rounded h-2.5 w-2/3"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-700 rounded h-4 w-full mb-4"></div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4 mb-3">
          <div className="bg-gray-700 rounded h-3 w-8"></div>
          <div className="bg-gray-700 rounded h-3 w-32"></div>
          <div className="bg-gray-700 rounded h-3 w-24"></div>
          <div className="bg-gray-700 rounded h-3 w-16"></div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-zinc-700 rounded h-3 w-full mb-1.5"></div>
          <div className="bg-zinc-700 rounded h-2.5 w-2/3"></div>
        </div>
      ))}
    </div>
  );
}
