// HTML 콘텐츠 렌더링 함수 (리치 텍스트 에디터용)
export function renderMarkdown(content: string): string {
  if (!content) return ''

  // 리치 텍스트 에디터에서 생성된 HTML을 그대로 사용
  // 보안을 위해 기본적인 정리만 수행
  let html = content

  // 이미지 스타일 정리 (기존 마크다운 이미지가 있을 경우)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="h-auto rounded-lg my-4 mx-auto block" style="width: 900px; max-width: 100%;" />'
  )

  // 비디오 파일을 video 태그로 변환
  html = html.replace(
    /<img([^>]*?)src="([^"]*\.(mp4|webm|ogg|mov|avi))"([^>]*?)>/gi,
    (_, before, src, ext, after) => {
      return `<video controls autoplay loop muted style="max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 8px; max-height: 400px; border: 1px solid #374151; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); background-color: #1f2937;" ${before}${after}><source src="${src}" type="video/${ext}">Your browser does not support the video tag.</video>`
    }
  )

  // 유튜브 링크를 임베드로 변환
  html = html.replace(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:\?[^<\s]*)?/g,
    (_, videoId) => {
      return `<div style="text-align: center; margin: 20px 0;"><iframe src="https://www.youtube.com/embed/${videoId}" title="유튜브 동영상" width="800" height="450" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    }
  )

  return html
}
