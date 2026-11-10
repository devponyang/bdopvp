# 포냥이 재구축 / 2026-11-04

## 실행

Node.js 22와 기존 package-lock.json을 사용합니다.

```sh
npm ci
npm run dev
npm run typecheck
node scripts/check-rebuild.cjs
npm run build
npm start
```

DB_ENABLED가 정확히 `true`일 때만 새 공개 화면이 DB를 조회합니다. 기본 상태에서는 .env에 과거 DB 주소가 남아 있어도 접속하지 않습니다. 포트는 Next.js 기본값 3000입니다.

## 이번 개편의 범위

- 공통 상단 내비게이션 / 모바일 모달 메뉴 / 검색 / 푸터 / 디자인 토큰 교체. 후속 디자인 재설계에서 고정 사이드바를 제거하고 차콜·오렌지의 검색 중심 화면으로 변경했습니다. 공개 의견과 설계 판단은 [디자인 조사 기록](design-research.md)에 있습니다.
- 홈, 솔라레, 길드 리그, 전투 기록, 검색, 길드·모험가 프로필, 모집, 대회, 통계, 안내, 로그인 및 관리자 화면 교체.
- DB가 없어도 페이지를 표시하고, 유실된 데이터와 실제 0건을 구분.
- 코드에 남은 클래스 공략 21개 보존. 공략 상세는 해당 파일만 동적으로 가져옵니다. 조회수·추천·관련 DB 요청은 제거했습니다. 내용은 기존 보관본이며 최신 게임 패치 검증은 수행하지 않았습니다.
- 관리자: HttpOnly 서명 세션(4시간), 서버 비밀번호 검증, 동일 출처 쓰기 검사, JSON 스키마 검증, 1MB 입력 제한, 이전 게시본 DB 이력 보관.
- 광고·분석 스크립트, 페이지 렌더링 시 인덱스 생성, 브라우저에 포함된 관리자 비밀번호 제거.

## 기능 변경 / 호환성

기존 페이지 주소는 유지합니다. 과거 관리자 하위 주소는 새 콘텐츠 운영 화면을 표시합니다. `/master-class`는 대회 화면을 표시합니다. `/guild-league/[page]`의 예전 번호는 수용하지만 새 페이지 이동은 목록 내부에서 처리합니다.

옛 `/api/*`는 **410 Gone**으로 종료합니다. 새 API는 `/api/session`, `/api/v2/admin`, `/api/v2/admin/history`, `/api/v2/health`입니다. Next.js 16의 proxy와 각 옛 핸들러 양쪽에서 차단하므로 쿠키를 바꾸거나 옛 URL로 직접 접근해도 기존 데이터 쓰기·크롤링·업로드·알림 발송을 실행하지 않습니다. 예전 서버 액션도 종료했습니다. 외부 크롤러/봇/스케줄러가 옛 API를 호출한다면 새 게시 방식으로 별도 이전해야 합니다.

현재 운영 입력은 관리자 구조화 폼 또는 JSON으로 초안을 작성하고 검증한 뒤 게시하는 방식입니다. 기존 OCR, 배너·쿠폰 관리, 특화 이미지 업로드, 시즌별 이력 탐색, 대진표 편집, 참가 신청 폼은 새 저장 구조에 연결하지 않았으며 종전 기능이 그대로 복원된 것은 아닙니다. 대회는 일정·설명, 모집은 운영자 검토 후 게시를 제공합니다. 길드 탈퇴자 수는 제공하지 않습니다. 연맹 관계와 게임 내 전적은 추정해서 만들지 않습니다.

## 새 DB 준비

**옛 `lib/db/schema.sql`이나 일괄 마이그레이션 스크립트를 실행하지 마세요.** 삭제 구문과 존재하지 않는 테이블에 대한 ALTER가 섞여 있습니다. 이번 전용 마이그레이션은 새 사이트에 필요한 두 테이블만 생성하며, 이전 데이터를 복원하지 않습니다.

1. 별도 PostgreSQL DB와 최소 권한 계정을 준비합니다.
2. 아래 파일만 DB 관리자 도구나 psql에서 실행합니다.

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/migrations/20261022000000_portal_rebuild.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/migrations/20261104000000_portal_revisions.sql
```

3. `.env.example`의 설정을 실제 배포 환경변수에 등록합니다. `DATABASE_URL`에 공급자가 요구하는 TLS 설정을 포함하세요. 기존 DB_* 변수와 혼용하지 않는 편이 좋습니다.
4. `DB_ENABLED=true`를 설정하고 서버를 재시작합니다.
5. `/admin/login` → `/admin/dashboard`에서 JSON 파일을 가져와 검증한 후 게시합니다. 게시 시 전체 공개 데이터가 교체됩니다. 이전 게시본은 같은 트랜잭션 안에서 `portal_snapshot_history`에 보관됩니다.

## 관리자 설정

`SESSION_SECRET`은 32자 이상의 충분히 무작위인 값이어야 합니다. 생성 예:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

`ADMIN_PASSWORD_HASH`에는 bcrypt 해시를 사용합니다. 비밀번호를 소스나 명령 이력에 넣지 말고 비밀 관리 도구에서 설정하세요. bcryptjs의 `hash(password, 12)`로 생성할 수 있습니다. 운영에서는 HTTPS와 정확한 `SITE_ORIGIN`이 필요합니다. SESSION_SECRET을 교체하면 기존 세션은 무효화됩니다. 이전 비밀번호 및 DB 접속 정보가 실제로 사용됐다면 별도로 교체해야 합니다.

## 데이터 형식

빈 템플릿은 `docs/portal-data-template.json`입니다. 실제 이름과 전적이 없는 상태가 기본입니다. 스키마의 원본은 `lib/portal/schema.ts`이며 관리자와 서버가 같은 스키마를 사용합니다.

| 항목 | 필드 |
|---|---|
| season | 시즌 이름 문자열 |
| solare / league | name, class, guild, specialization, score, wins, losses, draws |
| wars | id, date(YYYY-MM-DD), region, tier, winner, type(거점전/점령전) |
| recruits | id, name, title, description, tags(문자열 배열), contact(HTTPS URL) |
| tournaments | id, title, date, description, status(예정/진행 중/종료) |
| notices | id, title, content, date |

등록 이름과 ID의 중복, 음수 전적, 잘못된 날짜 및 비 HTTPS 연락처를 거절합니다. 점수 내림차순으로 순위를 계산하며, 동점은 등록 순서를 유지합니다. 승률은 승 / (승+무+패)입니다. 별도의 공식 동점 규칙을 구현한 것은 아닙니다.

## 운영 전 필요한 일

- 실제 DB에서 마이그레이션·게시·이력 복원 검증. 이 작업에서는 운영 DB가 없어 실행하지 않았습니다.
- 외부 저장소에 자동 백업 및 복원 연습. 같은 DB의 게시 이력은 재해 복구용 백업이 아닙니다.
- 호스팅/CDN 측 DDoS 방어, 공유 로그인 속도 제한, 원본 서버 접근 제한. 앱의 로그인 제한은 단일 프로세스 보조 수단으로 다중 인스턴스나 재시작 시 공유되지 않습니다.
- 공개 전 개인정보 처리방침과 이용약관을 실제 호스팅 로그·외부 콘텐츠 정책에 맞춰 검토. 이번에는 기존 문서를 보존하고 화면 스타일만 변경했습니다.
- 외부 영상과 일부 옛 이미지 링크의 유효성 및 공략 최신성 검토.

프론트 개편만으로 DDoS 방어가 완성되는 것은 아닙니다. 배포, DNS 변경, 실제 DB 생성이나 데이터 복원은 이 코드 변경에 포함되지 않습니다.

## 2026-11-04 업그레이드

- Next.js 16.4.5 / React 19.3.1 / Tailwind CSS 4.3.4로 갱신했습니다. 실제 설치 버전은 package-lock.json에 고정됩니다.
- `middleware.ts`를 `proxy.ts`로 이전하고 Turbopack 기본 빌드를 사용합니다. 달력의 최신 API도 적용했습니다.
- 일반 입력 폼으로 랭킹·전투·모집·대회·공지를 추가/수정/제외할 수 있습니다. 게시 전까지는 초안입니다.
- If-Match 버전 검사를 통해 오래된 창에서 덮어쓰는 게시를 409로 거절합니다. 충돌 시 초안을 파일로 보관한 후 최신 내용을 불러와 병합하세요.
- 게시 이력은 최근 20개 목록에서 초안으로 불러올 수 있습니다. 검증·게시 단계를 다시 거쳐야 공개됩니다.
- 공개 데이터 조회는 30초 캐시를 공유하며 게시 후 무효화합니다. 관리자 조회는 캐시하지 않습니다.
- `/api/v2/health`는 프로세스 생존 여부와 설정 모드만 반환합니다. DB 접속이나 복구 상태를 검증하는 엔드포인트는 아닙니다.
- `npm run db:migrate`는 재구축용 두 SQL만 실행합니다. 운영 DB에 자동 실행하지 않았습니다.
- `npm run test:db`는 TEST_DATABASE_URL이 ponyang_test로 시작하는 별도 DB만 허용합니다. 격리된 임시 스키마에서 게시·이력·충돌·복원 후 스키마를 제거합니다.
- GitHub Actions는 PostgreSQL 17 테스트 서비스를 만들어 DB 통합 검사까지 실행하도록 구성했습니다. 로컬에서는 PGlite 임베디드 PostgreSQL로 같은 SQL 게시·이력 복원 검사를 통과했습니다. 별도 서버 DB 및 원격 CI는 아직 실행하지 않았습니다.
- TypeScript는 테스트 로더의 compiler API와 호환되는 5.x를 유지했습니다. 사용하지 않는 옛 AI/HTTP/크롤링 의존성은 제거했습니다.

`npm test`는 DB 설정 없이 임베디드 PostgreSQL 검사를 함께 실행합니다. 테스트 데이터는 메모리에만 존재하고 종료 시 폐기합니다. 운영 DB에 접속하지 않습니다.
