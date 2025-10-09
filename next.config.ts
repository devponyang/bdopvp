import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드 로깅 최적화
  logging: {
    fetches: {
      fullUrl: false, // API 요청 전체 URL 로깅 비활성화
    },
  },
  // 청크 로딩 문제 해결을 위한 설정
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // 실험적 기능 설정
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // 빌드 시 메모리 사용량 줄이기
    cpus: 1, // 워커 프로세스를 1개로 제한
    webpackBuildWorker: false, // 웹팩 빌드 워커 비활성화
  },
  // 정적 파일 서빙 설정
  async headers() {
    return [
      {
        source: '/guild-icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/solare-images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/banner-images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/guild-promotion-images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/tip-images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'image/png, image/jpeg, image/jpg, image/gif, image/webp',
          },
        ],
      },
    ]
  },
  // 이미지 도메인 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nng-phinf.pstatic.net',
      },
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 도메인 허용 (배너 이미지용)
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
