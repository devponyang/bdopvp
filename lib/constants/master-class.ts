// 마스터클래스 클래스 목록 및 매핑
export const MASTER_CLASS_CLASSES = [
  '가디언', '격투가', '금수랑', '노바', '닌자', '다크나이트',
  '데드아이', '도사', '드라카니아', '란', '레인저', '매구',
  '매화', '무사', '미스틱', '발키리', '샤이', '세이지',
  '소서러', '스칼라', '아처', '오공', '우사', '워리어',
  '위자드', '위치', '자이언트', '커세어', '쿠노이치', '하사신'
]

export const CLASS_NAME_MAP: { [key: string]: string } = {
  '가디언': 'gadi',
  '격투가': 'fighter',
  '금수랑': 'taimer',
  '노바': 'nova',
  '닌자': 'ninja',
  '다크나이트': 'darknight',
  '데드아이': 'dead',
  '도사': 'dosa',
  '드라카니아': 'draca',
  '란': 'lhan',
  '레인저': 'ranger',
  '매구': 'magu',
  '매화': 'mahwa',
  '무사': 'musa',
  '미스틱': 'mistic',
  '발키리': 'valc',
  '샤이': 'shai',
  '세이지': 'saji',
  '소서러': 'sor',
  '스칼라': 'scara',
  '아처': 'archer',
  '오공': 'ukong',
  '우사': 'usa',
  '워리어': 'warrior',
  '위자드': 'wizard',
  '위치': 'witch',
  '자이언트': 'jai',
  '커세어': 'cosair',
  '쿠노이치': 'kuno',
  '하사신': 'hasasin'
}

export const getClassIcon = (className: string): string => {
  const iconName = CLASS_NAME_MAP[className] || className.toLowerCase()
  return `/class-icons/${iconName}.png`
}

export const getClassBg = (className: string): string => {
  return `/class-bg/${className}.png`
}

