// /lib/constants/war-tiers.ts

// 6월 25일 이전 로테이션 (기존)
const OLD_REGION_TIERS = {
  '발레노스': '무제한',
  '세렌디아': '무제한',
  '메디아': '1단',
  '발렌시아': '1단',
  '칼페온': '2단',
  '카마실비아': '2단'
} as const

// 6월 25일 이후 로테이션 (신규)
const NEW_REGION_TIERS = {
  '발레노스': '1단',
  '세렌디아': '1단',
  '메디아': '2단',
  '발렌시아': '2단',
  '칼페온': '무제한',
  '카마실비아': '무제한',
} as const

// 날짜에 따라 적절한 로테이션 반환
export function getRegionTier(region: string, warDate: string): string | null {
  const date = new Date(warDate)
  const rotationDate = new Date('2025-06-25')
  
  if (date < rotationDate) {
    // 6월 25일 이전: 기존 로테이션
    return OLD_REGION_TIERS[region as keyof typeof OLD_REGION_TIERS] || null
  } else {
    // 6월 25일 이후: 신규 로테이션
    return NEW_REGION_TIERS[region as keyof typeof NEW_REGION_TIERS] || null
  }
}

// 기존 호환성을 위한 상수 (신규 로테이션 사용)
export const REGION_TIERS = NEW_REGION_TIERS