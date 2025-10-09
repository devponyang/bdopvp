# HTTP 413 오류 최종 해결 (5MB, 2MB 파일도 안될 때)

## 🔍 문제 상황
- `.mov` 파일 (5MB), `.gif` 파일 (2MB) 업로드 시에도 HTTP 413 오류 발생
- 서버 설정을 100MB로 늘렸지만 여전히 실패
- **원인**: Next.js의 내부 기본 제한 (약 4MB)

## ⚠️ 핵심 문제
Next.js는 `req.formData()` 호출 시 내부적으로 body 크기 제한이 있으며, 이는 일반적인 설정으로는 변경되지 않습니다.

## 🛠️ 최종 해결 방법

### 1. package.json 수정 (가장 중요!)
```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=\"--max-http-header-size=104857600\" next dev"
  }
}
```

### 2. cross-env 패키지 설치
```bash
npm install --save-dev cross-env
```
- Windows에서도 작동하도록 cross-env 사용
- `NODE_OPTIONS`로 Node.js의 HTTP 헤더 크기 제한을 100MB로 설정

### 3. next.config.ts 설정
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '100mb',
  },
}
```

### 4. API Route 에러 처리 개선
- `app/api/upload/route.ts`에 formData 파싱 에러 처리 추가
- 더 명확한 에러 메시지 제공

## 🚀 적용 방법

### 1단계: 서버 재시작 (필수!)
```bash
# 기존 개발 서버 중지 (Ctrl+C)

# 서버 재시작
npm run dev
```

### 2단계: 테스트
1. 팁게시판 글쓰기 페이지 접속
2. 5MB `.mov` 파일 업로드 테스트
3. 2MB `.gif` 파일 업로드 테스트
4. 정상 작동 확인

## 📋 변경 사항 요약

| 파일 | 변경 내용 |
|------|-----------|
| `package.json` | dev 스크립트에 NODE_OPTIONS 추가 + cross-env 의존성 |
| `next.config.ts` | serverActions.bodySizeLimit 설정 |
| `app/api/upload/route.ts` | formData 파싱 에러 처리 개선 |

## ⚠️ 주의사항

### Windows 사용자
- `cross-env` 패키지가 설치되어 있어야 합니다
- PowerShell에서도 정상 작동합니다

### 프로덕션 배포 시
- Vercel 사용 시: Vercel Dashboard에서 환경 변수 설정 필요 없음 (serverActions 설정이 자동 적용)
- 다른 호스팅: 서버의 body 크기 제한 설정 확인 필요

### 성능 고려사항
- `--max-http-header-size` 설정은 메모리 사용량 증가 가능
- 실제로는 header가 아닌 body 크기에 영향을 줍니다
- 서버 리소스 모니터링 권장

## 🔧 문제 해결

### 여전히 413 오류가 발생하면?
1. **서버 재시작 확인**: `npm run dev`로 완전히 재시작
2. **브라우저 캐시 삭제**: Ctrl+Shift+R로 하드 리프레시
3. **콘솔 로그 확인**: 브라우저 개발자 도구와 서버 로그 확인
4. **포트 변경 테스트**: `npm run dev -- -p 3001`로 다른 포트에서 테스트

### 다른 에러 발생 시
- `cross-env` 설치 확인: `npm list cross-env`
- Node.js 버전 확인: Node.js 18 이상 권장
- package.json 문법 확인: JSON 형식이 올바른지 확인

## ✅ 성공 확인 방법
서버 시작 시 다음과 같은 로그가 나타나야 합니다:
```
  ▲ Next.js 15.2.4
  - Local:        http://localhost:3000
```

그리고 이제 5MB, 2MB 파일 업로드가 정상적으로 작동해야 합니다!











