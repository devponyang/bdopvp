// 팁게시판 카테고리 상수 정의
export const TIP_CATEGORIES = {
  GENERAL: '📚 일반 팁',
  PVP: '⚔️ PVP 팁', 
  PVE: '🏰 PVE 팁',
  CLASS_GUIDE: '🎓 클래스 가이드'
} as const

export const CLASS_GUIDE_CLASSES = [
  '워리어', '하사신', '세이지', '레인저', '가디언', '스칼라', '드라카니아',
  '소서러', '노바', '커세어', '란', '자이언트', '매구', '금수랑', '샤이',
  '격투가', '무사', '매화', '미스틱', '발키리', '쿠노이치', '닌자', '다크나이트',
  '위자드', '아처', '우사', '위치', '도사', '데드아이', '오공'
] as const

// 클래스별 이모지 매핑
export const CLASS_EMOJIS: Record<string, string> = {
  '워리어': '🗡️',
  '하사신': '⚔️',
  '세이지': '🧙‍♂️',
  '레인저': '🏹',
  '가디언': '🛡️',
  '스칼라': '⚡',
  '드라카니아': '🐉',
  '소서러': '🔮',
  '노바': '🌟',
  '커세어': '⚓',
  '란': '🎭',
  '자이언트': '🗿',
  '매구': '🐱',
  '금수랑': '🦁',
  '샤이': '🎪',
  '격투가': '👊',
  '무사': '🥋',
  '매화': '🌸',
  '미스틱': '💫',
  '발키리': '⚔️',
  '쿠노이치': '🗡',
  '닌자': '⚔',
  '다크나이트': '⚫',
  '위자드': '🧙‍♂️',
  '아처': '🏹',
  '우사': '🐰',
  '위치': '🧙‍♀️',
  '도사': '🧘',
  '데드아이': '👁️',
  '오공': '🐒'
}

// 카테고리 타입 정의
export type TipCategory = typeof TIP_CATEGORIES[keyof typeof TIP_CATEGORIES]
export type ClassGuideClass = typeof CLASS_GUIDE_CLASSES[number]

// 카테고리별 필터링을 위한 헬퍼 함수
export const getCategoryFromTags = (tags: string[]): TipCategory => {
  if (tags.includes(TIP_CATEGORIES.CLASS_GUIDE)) return TIP_CATEGORIES.CLASS_GUIDE
  if (tags.includes(TIP_CATEGORIES.PVP)) return TIP_CATEGORIES.PVP
  if (tags.includes(TIP_CATEGORIES.PVE)) return TIP_CATEGORIES.PVE
  return TIP_CATEGORIES.GENERAL
}

export const getClassFromTags = (tags: string[]): ClassGuideClass | null => {
  return CLASS_GUIDE_CLASSES.find(cls => tags.includes(cls)) || null
}
