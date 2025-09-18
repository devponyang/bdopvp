/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // 도메인 설정 (필요시)
  // trailingSlash: true,
  // basePath: '',
  async headers() {
    // 개발 환경에서는 보안 헤더 없이 실행
    if (process.env.NODE_ENV === 'development') {
      return []
    }
    
    // 프로덕션 환경에서만 보안 헤더 적용
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fastly.jsdelivr.net",
              "connect-src 'self' https://api.chzzk.naver.com https://www.google-analytics.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          // X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Referrer-Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions-Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // X-XSS-Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 