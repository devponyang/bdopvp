import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드 로깅 최적화
  logging: {
    fetches: {
      fullUrl: false, // API 요청 전체 URL 로깅 비활성화
    },
  },
};

export default nextConfig;
