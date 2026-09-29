# CLAUDE.md

> Claude Code 작업 지침서  
> 프로젝트: **BDOPVP-포냥이** 리모델링 (코드 + 스타일 전면 개편)  
> 운영자: 디움 (@kehakdwk1-pixel)

---

## 📌 프로젝트 개요

### 정체성
- **사이트명**: BDOPVP-포냥이
- **도메인**: bdopvp.com
- **장르**: 검은사막(Black Desert Online) **PvP 전문** 커뮤니티 사이트
- **마스코트**: 포냥이 (`/ponyang/ponyang-8.png`)
- **현재 상태**: DDoS로 DB 유실 후 운영 중단 → **부활 리모델링 진행 중**

### 부활 컨셉
- **PvP 전문성 강화** (경쟁 사이트 korbdo.co.kr는 통합 정보 사이트 → 포냥이는 깊이로 차별화)
- **다크 + 네온/글로우 게이밍 무드**
- **검은사막 단독**으로 운영 (붉은사막 분기 보류)
- 기존 길드별 탈퇴자 수 집계 기능 → **삭제** (DB 유실)
- 연맹/길드 검색 → **유지**

---

## 🛠 기술 스택 (현재 → 목표)

### 유지할 스택
| 항목 | 버전/도구 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| DB | PostgreSQL |
| 배포 | Netlify |
| 스타일 | Tailwind CSS |
| UI 컴포넌트 | shadcn/ui |
| 차트 | Chart.js, Recharts |
| 스크래핑 | Puppeteer, Cheerio |
| 인증 | bcryptjs |
| 상태/쿼리 | TanStack React Query |

### 최신화 목표
- **Tailwind CSS v4** (CSS-first config, `@theme` 디렉티브)
- **Framer Motion v12** (스크롤 패럴랙스, 마우스 트래킹 글로우)
- **OKLCH 컬러 시스템** (P3 와이드 색역 - 더 진한 네온)
- **shadcn/ui 최신** + Magic UI 모션 컴포넌트 (필요 시)
- **View Transitions API** (페이지 전환)
- **Variable font** + `text-balance`, `text-wrap: pretty`
- **CSS `mask` + `radial-gradient`** (네온 테두리/글로우)

---

## 🎯 작업 목표 (이번 리모델링 범위)

### 1순위: 메인 페이지 풀스크린 랜딩
- `/` 경로 → 게임 선택 랜딩 (현재는 `/bdo` 단독이지만 라우팅 구조는 확장 가능하게 유지)
- 다크 + 네온 + 포냥이 마스코트 활용
- 모바일 반응형 필수

### 2순위: 전체 코드 리모델링
- App Router 패턴 100% 준수
- Server Component 우선, Client Component는 명확한 이유 있을 때만
- 타입 안전성 강화 (any 제거, zod 도입 검토)
- 컴포넌트 디렉토리 구조 정리

### 3순위: 스타일 리모델링
- Tailwind v4 마이그레이션
- 다크 테마 기본
- 네온/글로우 디자인 시스템 정립
- 컴포넌트 디자인 토큰화

### 4순위 (이번 작업 범위 외, 추후)
- 랭킹 OCR 자동화 파이프라인
- 연구소 패치 아카이브
- 클래스 픽률 변화 추적

---

## 🎨 디자인 시스템

### 컬러 팔레트 (OKLCH 기반)
```css
@theme {
  /* Base */
  --color-bg-primary: oklch(0.08 0.01 270);      /* 거의 검정, 약간 보라끼 */
  --color-bg-secondary: oklch(0.12 0.015 270);   /* 카드 배경 */
  --color-bg-tertiary: oklch(0.16 0.02 270);     /* 호버/액티브 */
  
  /* Neon Accents */
  --color-neon-cyan: oklch(0.85 0.18 200);       /* 메인 강조 */
  --color-neon-magenta: oklch(0.7 0.28 340);     /* 서브 강조 */
  --color-neon-purple: oklch(0.65 0.25 290);     /* 포냥이 톤 */
  
  /* Functional */
  --color-text-primary: oklch(0.95 0.005 270);
  --color-text-muted: oklch(0.65 0.01 270);
  --color-border: oklch(0.25 0.02 270);
  
  /* Status */
  --color-success: oklch(0.75 0.18 150);
  --color-warning: oklch(0.8 0.18 80);
  --color-danger: oklch(0.65 0.25 25);
}
```

### 타이포그래피
- **헤딩**: Pretendard Variable (한글 최적화)
- **영문/숫자**: Geist Sans / Geist Mono
- **랭킹 숫자**: Geist Mono (고정폭, 시각적 안정감)

### 모션 원칙
- **이징**: `cubic-bezier(0.16, 1, 0.3, 1)` (감속 강조)
- **기본 duration**: 200ms (인터랙션), 400ms (페이지/큰 전환)
- **글로우 펄스**: 2~3초 사이클, `opacity` + `filter: blur()` 조합
- **마우스 트래킹**: 카드 호버 시 그라데이션 따라오기

### 글로우 효과 (재사용 클래스)
```css
.glow-cyan {
  box-shadow: 
    0 0 20px oklch(0.85 0.18 200 / 0.3),
    0 0 40px oklch(0.85 0.18 200 / 0.15),
    inset 0 0 20px oklch(0.85 0.18 200 / 0.05);
}

.glow-border {
  position: relative;
}
.glow-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, var(--color-neon-cyan), var(--color-neon-magenta));
  -webkit-mask: 
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

---

## 📁 디렉토리 구조 (목표)

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타)
│   ├── page.tsx                # 메인 랜딩 (풀스크린)
│   ├── globals.css             # Tailwind v4 + @theme + 글로우
│   ├── (bdo)/                  # BDO 라우트 그룹
│   │   ├── ranking/
│   │   ├── guild/
│   │   ├── solare/
│   │   └── league/
│   └── api/                    # API 라우트
├── components/
│   ├── ui/                     # shadcn/ui 베이스
│   ├── landing/                # 랜딩 전용 (Hero, GameCard 등)
│   ├── motion/                 # Framer Motion 래퍼
│   └── shared/                 # 공통 (Header, Footer, Logo)
├── lib/
│   ├── db/                     # Postgres 쿼리
│   ├── utils.ts                # cn, formatters
│   └── constants.ts            # 클래스/시즌/설정값
├── types/                      # 전역 타입
└── hooks/                      # 커스텀 훅
```

---

## ✅ 작업 규칙

### 코드 작성 시 반드시 지킬 것
1. **Server Component 우선** — `'use client'`는 인터랙션/상태/브라우저 API 필요할 때만
2. **타입 우선** — any 금지, 추론 가능하면 명시 생략, 외부 데이터는 zod로 파싱
3. **`cn()` 유틸 사용** — Tailwind 클래스 조건부 병합
4. **이미지** — `next/image` 필수, 포냥이는 priority 옵션
5. **메타데이터** — 페이지마다 `generateMetadata` 또는 `metadata` 객체
6. **에러 처리** — `error.tsx`, `not-found.tsx`, `loading.tsx` 라우트별 배치
7. **접근성** — `aria-label`, 키보드 포커스 스타일, 색 대비 WCAG AA

### 커밋 컨벤션
```
feat: 새 기능
fix: 버그 수정
style: 스타일/디자인 변경
refactor: 코드 구조 변경 (동작 동일)
chore: 빌드/설정 변경
docs: 문서 변경
```

### 작업 단위
- 한 번에 한 영역씩 (메인 → 헤더 → 푸터 → 카드 → ...)
- 큰 변경 전 사용자 확인 받기
- 기존 라우트 깨뜨리지 않기 (이동 시 redirect 처리)

---

## 🚫 하지 말 것

- ❌ Pages Router 패턴 사용 (App Router 전용)
- ❌ 인라인 스타일 남발 (Tailwind 클래스 우선)
- ❌ `<a>` 태그로 내부 링크 (Next `<Link>` 사용)
- ❌ Client Component에 무거운 의존성 import
- ❌ DB 쿼리 직접 컴포넌트에서 (lib/db 거쳐서)
- ❌ 환경변수 클라이언트 노출 (`NEXT_PUBLIC_` 접두사 신중히)
- ❌ 포냥이 마스코트 톤 망가뜨리기 (귀여움 + 게이밍 무드 공존)

---

## 🐱 포냥이 마스코트 활용 가이드

- 메인 랜딩 히어로 영역에 등장 (글로우 효과 동반)
- 404/에러 페이지에 표정 다른 버전 활용
- 호버 시 살짝 떠오르거나 빛나는 인터랙션
- **너무 귀엽게만 가지 말 것** — PvP 사이트 정체성 유지, 시크함 섞기

---

## 🎯 첫 작업 순서 제안

Claude Code가 이 파일을 읽고 시작할 때 추천 순서:

1. **현황 파악**
   - `package.json` 읽고 현재 의존성 버전 확인
   - `src/app/page.tsx` 현재 메인 구조 분석
   - `tailwind.config.*` 현재 토큰 확인
   
2. **의존성 업데이트 계획 제시**
   - 사용자 승인 받고 진행
   
3. **디자인 토큰 설정**
   - `globals.css`에 `@theme` 정의
   - 글로우 유틸리티 클래스 추가
   
4. **메인 페이지 리모델링**
   - Server Component 메인 + Client Component 인터랙션 분리
   - 풀스크린 히어로 + 포냥이 + 글로우
   
5. **공통 컴포넌트 정리**
   - Header / Footer / Logo
   
6. **하위 페이지 점진 리모델링**
   - 랭킹 → 길드 → 솔라레 → 길드 리그 순

---

## 📞 운영자와 소통 시

- 큰 결정 (라이브러리 추가/제거, 라우트 구조 변경)은 **반드시 사전 승인**
- 작업 완료 후 **변경 사항 요약** (어떤 파일 / 왜 / 영향 범위)
- 호환성 깨질 변경은 **마이그레이션 가이드** 함께 제시
- 한국어로 소통

---

**마지막 업데이트**: 2026-05-18  
**작성자**: 디움 (with Claude)
