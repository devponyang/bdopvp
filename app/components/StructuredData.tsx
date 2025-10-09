"use client"

import { useEffect, useState } from 'react'

interface StructuredDataProps {
  type: 'website' | 'article' | 'organization';
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const [structuredData, setStructuredData] = useState<string | null>(null)

  useEffect(() => {
    const getStructuredData = (): any => {
      const baseUrl = 'https://bdopvp.com';
      
      switch (type) {
        case 'website':
          return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "포냥이",
            "alternateName": "BDOPonyang",
            "url": baseUrl,
            "description": "검은사막 온라인의 최신 정보를 제공하는 포냥이 사이트",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "포냥이",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            }
          };
          
        case 'organization':
          return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "포냥이",
            "alternateName": "BDOPonyang",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`,
            "description": "검은사막 온라인 게임 정보를 제공하는 커뮤니티 사이트",
            "sameAs": [
              // 소셜 미디어 링크가 있다면 여기에 추가
            ]
          };
          
        case 'article':
          return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": data?.title || "포냥이 게임 정보",
            "description": data?.description || "검은사막 온라인 게임 정보",
            "author": {
              "@type": "Organization",
              "name": "포냥이"
            },
            "publisher": {
              "@type": "Organization",
              "name": "포냥이",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            },
            "datePublished": data?.datePublished || "2025-01-01T00:00:00.000Z",
            "dateModified": data?.dateModified || "2025-01-01T00:00:00.000Z",
            "url": data?.url || baseUrl
          };
          
        default:
          return null;
      }
    };

    const data = getStructuredData();
    if (data) {
      setStructuredData(JSON.stringify(data, null, 2));
    }
  }, [type, data]);

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: structuredData
      }}
    />
  );
}
























