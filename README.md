# 포냥이 · 검은사막 PvP

Next.js App Router 기반 PvP 커뮤니티. 데이터베이스가 없어도 대시보드, 검색과 보관된 클래스 가이드가 동작합니다. 실제 랭킹과 전적은 데이터가 등록된 이후 표시됩니다.

## 시작

Node.js 22 이상에서:

```sh
npm ci
npm run dev
```

기본 주소는 http://localhost:3000 입니다. `.env.example`을 참고하세요. `DB_ENABLED=false`가 기본이며, DB 연결 정보 없이 실행할 수 있습니다.

## 검증

```sh
npm run typecheck
npm test
npm run build
npm run test:browser
```

브라우저 검사는 프로덕션 빌드 이후 실행합니다. 테스트가 127.0.0.1:3101에 임시 서버를 만들고 종료합니다. DB에 접속하거나 실제 계정을 만들지 않습니다.

## 운영 준비

- [단계별 업그레이드 계획](docs/upgrade-plan.md)
- [재구축 및 마이그레이션 안내](docs/rebuild.md)
- [빈 데이터 템플릿](docs/portal-data-template.json)

새 DB에 연결한 뒤 `npm run db:migrate`로 이번 재구축용 마이그레이션만 실행합니다. 기존 전체 마이그레이션 스크립트는 실행하지 마세요. 실제 데이터 복원, DNS/호스팅 설정, DDoS 방어와 외부 백업은 운영 환경에서 별도로 수행해야 합니다.

관리자는 구조화 폼 또는 JSON으로 초안을 작성하고 검증 후 게시합니다. 충돌하는 수정은 거절하며 이전 게시본은 DB 이력에 보관합니다. 과거 OCR·크롤링·업로드 API는 종료되어 있으며, 자세한 호환성 변경은 재구축 안내를 확인하세요.
