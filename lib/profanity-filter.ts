// 비속어 목록 (한국어)
const PROFANITY_WORDS = [
  // 성 관련 비속어
  '자지', '보지', '성기', '성교', '섹스', '야동', '포르노', 'porn', 'xxx',
  // 욕설
  '씨발', '씨팔', '개새끼', '병신', '지랄', '미친', '미친놈', '미친년',
  '꺼져', '죽어', '죽어라', '개놈', '개년', '등신', '멍청이', '바보',
  // 기타 부적절한 단어
  '꺼져', '닥쳐', '조까', '좆까', '좆', '좆같', '좆나', '좆망',
  '시발', '시팔', '지랄', '지랄하', '개소리', '헛소리',
  // 추가 비속어
  '제석', '재희', '대일', '애미', '에미', '앰이', '앰2', '엠이', '엠2', 
  '창년', '창놈', '페미', '생리'
]

// 비속어가 포함된 검색어인지 확인하는 함수
export function containsProfanity(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  
  const lowerText = text.toLowerCase().trim()
  
  // 정확한 단어 매칭을 위한 정규식 사용
  for (const profanity of PROFANITY_WORDS) {
    const lowerProfanity = profanity.toLowerCase()
    
    // 정확한 단어 매칭 (단어 경계 고려)
    const regex = new RegExp(`\\b${lowerProfanity}\\b`, 'i')
    if (regex.test(lowerText)) {
      return true
    }
    
    // 부분 문자열도 체크 (더 엄격한 필터링)
    if (lowerText.includes(lowerProfanity)) {
      return true
    }
  }
  
  // 특별한 경우 처리: 한글 자음/모음 분리되거나 변형된 경우만
  const specialCases = [
    // "생리" 관련 변형 패턴 (정상적인 "생일"은 제외)
    { pattern: /생ㅇ리|ㅇ리/, replacement: '생리' },
    // "자지" 관련 변형 패턴
    { pattern: /자ㅣㅈ|ㅈㅏㅣㅈ/, replacement: '자지' },
    // "보지" 관련 변형 패턴
    { pattern: /보ㅣㅈ|ㅂㅗㅣㅈ/, replacement: '보지' },
    // "씨발" 관련 변형 패턴
    { pattern: /씨ㅏㅂ|ㅆㅣㅏㅂ/, replacement: '씨발' },
    // "개새끼" 관련 변형 패턴
    { pattern: /개ㅅㅐㄲㅣ|ㅎㅐㅅㅐㄲㅣ/, replacement: '개새끼' }
  ]
  
  for (const specialCase of specialCases) {
    if (specialCase.pattern.test(lowerText)) {
      return true
    }
  }
  
  return false
}

// 검색어 목록에서 비속어가 포함된 것들을 필터링하는 함수
export function filterProfanity<T extends { query: string }>(items: T[]): T[] {
  return items.filter(item => !containsProfanity(item.query))
}

// 문자열 배열에서 비속어가 포함된 것들을 필터링하는 함수
export function filterProfanityStrings(strings: string[]): string[] {
  return strings.filter(str => !containsProfanity(str))
}

// 디버깅용: 비속어 필터링 테스트 함수
export function testProfanityFilter(testStrings: string[]): void {
  console.log('=== 비속어 필터링 테스트 ===')
  testStrings.forEach(str => {
    const isProfanity = containsProfanity(str)
    console.log(`"${str}" -> ${isProfanity ? '필터링됨' : '통과'}`)
  })
}
