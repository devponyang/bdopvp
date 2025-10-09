// 입력 검증 유틸리티

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>\"']/g, '') // HTML 태그 및 따옴표 제거
    .trim()
    .substring(0, 1000) // 최대 길이 제한
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return url.startsWith('http://') || url.startsWith('https://')
  } catch {
    return false
  }
}

export function validateNumeric(input: string | number): boolean {
  const num = typeof input === 'string' ? parseFloat(input) : input
  return !isNaN(num) && isFinite(num)
}

export function validatePositiveNumber(input: string | number): boolean {
  const num = typeof input === 'string' ? parseFloat(input) : input
  return validateNumeric(input) && num > 0
}

export function validateGuildName(name: string): boolean {
  // 길드명 검증: 한글, 영문, 숫자, 일부 특수문자만 허용
  const guildNameRegex = /^[가-힣a-zA-Z0-9\s\-_().]{2,20}$/
  return guildNameRegex.test(name)
}

export function validateSolareClass(className: string): boolean {
  const validClasses = [
    'solare-league', '전체', '각성 워리어', '워리어', '각성 레인저', '레인저',
    '각성 시프', '시프', '각성 자이언트', '자이언트', '각성 발키리', '발키리',
    '각성 소서러', '소서러', '각성 위저드', '위저드', '각성 쿠노이치', '쿠노이치',
    '각성 닌자', '닌자', '각성 베르세르크', '베르세르크', '각성 스트라이커', '스트라이커',
    '각성 무사', '무사', '각성 마에와', '마에와', '각성 블레이더', '블레이더',
    '각성 발크', '발크', '각성 스펙터', '스펙터', '각성 라흐', '라흐',
    '각성 섀도우나이트', '섀도우나이트', '각성 가디언', '가디언', '각성 해저드', '해저드',
    '각성 노바', '노바', '각성 사지', '사지', '각성 샤이', '샤이',
    '각성 코르사르', '코르사르', '각성 드라크니아', '드라크니아'
  ]
  return validClasses.includes(className)
}











































