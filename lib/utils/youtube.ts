// 유튜브 URL을 임베드 URL로 변환하는 유틸리티 함수

export interface YouTubeVideo {
  id: string
  title?: string
  thumbnail?: string
}

/**
 * 유튜브 URL에서 비디오 ID를 추출
 * @param url 유튜브 URL
 * @returns 비디오 ID 또는 null
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * 유튜브 URL을 임베드 URL로 변환
 * @param url 유튜브 URL
 * @returns 임베드 URL 또는 null
 */
export function convertToEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null

  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * 유튜브 URL이 유효한지 확인
 * @param url 유튜브 URL
 * @returns 유효한 URL인지 여부
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}

/**
 * 유튜브 썸네일 URL 생성
 * @param videoId 유튜브 비디오 ID
 * @param quality 썸네일 품질 (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns 썸네일 URL
 */
export function getYouTubeThumbnail(videoId: string, quality: string = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * 유튜브 비디오 정보 추출 (제목, 썸네일 등)
 * @param url 유튜브 URL
 * @returns 비디오 정보
 */
export function getYouTubeVideoInfo(url: string): YouTubeVideo | null {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null

  return {
    id: videoId,
    thumbnail: getYouTubeThumbnail(videoId)
  }
}
