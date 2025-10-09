# 파일 업로드 크기 제한 증가 (30MB → 100MB)

## 🔍 문제 상황
팁게시판에서 `.mov` 등의 비디오 파일 업로드 시 HTTP 413 오류 발생
- **오류 메시지**: "HTTP 413 오류 - Payload Too Large"
- **원인**: 파일 크기가 기존 30MB 제한을 초과

## 🛠️ 수정 내용

### 1. Next.js 설정 (`next.config.ts`)
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '100mb',  // 기본값 → 100MB
  },
}
```
- API 라우트의 body 크기 제한을 100MB로 증가

### 2. API 업로드 라우트 (`app/api/upload/route.ts`)
```typescript
// Content-Length 확인 (50MB → 100MB)
const contentLength = req.headers.get('content-length')
if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) {
  return NextResponse.json({ error: '파일 크기가 너무 큽니다 (100MB 제한)' }, { status: 413 })
}

// 파일 크기 검증 (30MB → 100MB)
const maxSize = 100 * 1024 * 1024 // 100MB
if (file.size > maxSize) {
  return NextResponse.json({ 
    error: `파일 크기는 100MB를 초과할 수 없습니다. 현재 파일 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
  }, { status: 413 })
}
```

### 3. 프론트엔드 파일 크기 검증 업데이트
다음 파일들의 제한을 30MB → 100MB로 증가:
- `app/admin/tip-board/write/page.tsx`
- `app/admin/tip-board/[id]/edit/page.tsx`
- `components/ImageUpload.tsx`

### 4. 사용자 친화적인 에러 메시지
```typescript
const fileInfo = oversizedFiles.map(f => 
  `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`
).join(', ')
alert(`다음 파일들의 크기가 너무 큽니다 (100MB 제한):\n${fileInfo}`)
```

## 🎯 지원 파일 타입
- **이미지**: JPG, PNG, GIF, WebP
- **비디오**: MP4, MOV, WebM, OGG, AVI

## ⚠️ 주의사항

### 서버 재시작 필수
`next.config.ts` 파일을 수정했으므로 **개발 서버를 재시작**해야 합니다:
```bash
# 개발 서버 중지 (Ctrl+C)
# 개발 서버 재시작
npm run dev
```

### 성능 고려사항
1. **네트워크 속도**: 대용량 파일 업로드는 느린 네트워크에서 시간이 오래 걸릴 수 있습니다
2. **서버 리소스**: 100MB 파일 처리는 서버 메모리를 더 많이 사용합니다
3. **스토리지 용량**: 대용량 파일들로 인해 스토리지 사용량이 증가할 수 있습니다

### 권장사항
1. **비디오 최적화**: 가능하면 업로드 전 비디오를 압축하는 것이 좋습니다
2. **진행 표시**: 대용량 파일 업로드 시 진행률 표시 추가 고려
3. **모니터링**: 서버 스토리지 및 대역폭 사용량 주기적 확인

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| Next.js body 크기 제한 | 기본값 (1MB) | 100MB |
| API Content-Length 제한 | 50MB | 100MB |
| API 파일 크기 검증 | 30MB | 100MB |
| 프론트엔드 사전 검증 | 30MB | 100MB |
| 에러 메시지 | 기본 메시지 | 파일명 및 크기 표시 |

## ✅ 테스트 방법

1. 개발 서버 재시작
2. 팁게시판 글쓰기 페이지 접속
3. 30MB 이상 100MB 이하의 비디오 파일 업로드 테스트
4. 100MB 초과 파일로 적절한 에러 메시지 표시 확인











