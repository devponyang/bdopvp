# Next.js Image Optimizer 400 에러 해결

## 🔍 문제 상황
```
GET http://localhost:3001/_next/image?url=%2Fapi%2Fimages%2Ftip-images%2F1759837633408_83771904e663514d.mov&w=750&q=75 400 (Bad Request)
```

비디오 파일(`.mov`)이 Next.js Image Optimizer를 통해 최적화되려고 해서 400 에러 발생

## 🎯 근본 원인
- Next.js는 기본적으로 모든 `<img>` 태그를 자동으로 최적화하려고 시도
- 비디오 파일(`.mov`, `.mp4` 등)은 이미지가 아니므로 Image Optimizer에서 처리할 수 없음
- GIF 파일도 대용량일 경우 최적화 문제 발생 가능

## 🛠️ 적용된 해결책

### 1. RichTextEditor에서 이미지 삽입 시
- `data-nimg` 속성 추가: Next.js Image Optimizer 비활성화
- `loading="lazy"` 속성 추가: 브라우저 네이티브 lazy loading 사용

### 2. lib/markdown.ts에서 비디오 변환 개선
- 비디오 파일을 `<img>` → `<video>` 태그로 정확히 변환
- MIME 타입 정확히 매핑 (MOV, MP4, WebM 등)
- `playsinline` 속성 추가: 모바일 브라우저 호환성

### 3. Next.js 설정 정리
- `next.config.ts`에서 불필요한 설정 제거
- 이미지 도메인 패턴 유지

## ✅ 해결 방법

### 즉시 적용
1. **서버 재시작** (필수!):
   ```bash
   # Ctrl+C로 서버 중지
   npm run dev
   ```

2. **브라우저 캐시 삭제**:
   - Ctrl + Shift + R (하드 리프레시)
   - 또는 개발자 도구 > Network 탭 > "Disable cache" 체크

### 테스트 방법
1. 팁게시판 글쓰기 페이지 접속
2. MOV 또는 GIF 파일 업로드
3. 브라우저 개발자 도구 > Console 탭 확인
4. 다음 메시지가 나와야 함:
   ```
   ✅ 이미지 로딩 성공: /api/images/tip-images/파일명
   ```

5. Network 탭에서 확인:
   - ❌ 잘못된 경로: `/_next/image?url=...` (400 에러)
   - ✅ 올바른 경로: `/api/images/tip-images/파일명` (200 성공)

## 🎬 비디오 파일 특별 처리

### 비디오 렌더링 방식
- MOV, MP4, WebM 등: `<video>` 태그로 자동 변환
- 자동 재생, 반복, 음소거 설정
- 모바일 호환성을 위한 `playsinline` 속성

### 브라우저 호환성
| 파일 형식 | Chrome | Firefox | Safari | Edge |
|----------|--------|---------|--------|------|
| MP4      | ✅     | ✅      | ✅     | ✅   |
| WebM     | ✅     | ✅      | ⚠️     | ✅   |
| MOV      | ⚠️     | ❌      | ✅     | ⚠️   |

**권장:** MP4 형식 사용 (가장 호환성 좋음)

## 🐛 여전히 문제가 있다면?

### 1. 콘솔 에러 확인
```
F12 > Console 탭
```

다음 메시지를 찾으세요:
- `❌ 이미지 로딩 실패:` → URL 문제
- `400 Bad Request` → Image Optimizer 문제 (서버 재시작 필요)

### 2. Network 탭 확인
- URL이 `/_next/image`로 시작하면 → 여전히 Image Optimizer 사용 중
- URL이 `/api/images`로 시작하면 → ✅ 정상

### 3. 완전 초기화
```bash
# 개발 서버 중지
# .next 폴더 삭제
Remove-Item -Recurse -Force .next

# 다시 시작
npm run dev
```

## 📋 체크리스트

- [ ] 서버 재시작 완료
- [ ] 브라우저 하드 리프레시 (Ctrl+Shift+R)
- [ ] Console에 "✅ 이미지 로딩 성공" 메시지 표시
- [ ] Network 탭에서 `/api/images/` 경로로 요청
- [ ] 비디오 파일이 `<video>` 태그로 표시
- [ ] GIF 파일이 정상 재생

모든 항목이 체크되면 문제 해결!











