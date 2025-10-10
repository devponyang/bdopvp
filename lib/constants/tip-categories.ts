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

// 클래스별 아이콘 매핑
export const CLASS_ICONS: Record<string, string> = {
  '워리어': '/class-icons/warrior.png',
  '하사신': '/class-icons/hasasin.png',
  '세이지': '/class-icons/saji.png',
  '레인저': '/class-icons/ranger.png',
  '가디언': '/class-icons/gadi.png',
  '스칼라': '/class-icons/scara.png',
  '드라카니아': '/class-icons/draca.png',
  '소서러': '/class-icons/sor.png',
  '노바': '/class-icons/nova.png',
  '커세어': '/class-icons/cosair.png',
  '란': '/class-icons/lhan.png',
  '자이언트': '/class-icons/jai.png',
  '매구': '/class-icons/magu.png',
  '금수랑': '/class-icons/taimer.png',
  '샤이': '/class-icons/shai.png',
  '격투가': '/class-icons/fighter.png',
  '무사': '/class-icons/musa.png',
  '매화': '/class-icons/mahwa.png',
  '미스틱': '/class-icons/mistic.png',
  '발키리': '/class-icons/valc.png',
  '쿠노이치': '/class-icons/kuno.png',
  '닌자': '/class-icons/ninja.png',
  '다크나이트': '/class-icons/darknight.png',
  '위자드': '/class-icons/wizard.png',
  '아처': '/class-icons/archer.png',
  '우사': '/class-icons/usa.png',
  '위치': '/class-icons/witch.png',
  '도사': '/class-icons/dosa.png',
  '데드아이': '/class-icons/dead.png',
  '오공': '/class-icons/ukong.png'
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
