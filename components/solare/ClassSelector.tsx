'use client'

import { usePathname, useRouter } from 'next/navigation'
import classList from '@/lib/constants/class-list'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ClassSelectorProps {
  selectedSeasonId?: number | null
}

// 클래스명을 영문 파일명으로 매핑
const getClassIconName = (className: string) => {
  const classMap: { [key: string]: string } = {
    '워리어': 'warrior',
    '하사신': 'hasasin',
    '세이지': 'saji',
    '레인저': 'ranger',
    '가디언': 'gadi',
    '스칼라': 'scara',
    '드라카니아': 'draca',
    '소서러': 'sor',
    '노바': 'nova',
    '커세어': 'cosair',
    '란': 'lhan',
    '자이언트': 'jai',
    '매구': 'magu',
    '금수랑': 'taimer',
    '샤이': 'shai',
    '격투가': 'fighter',
    '무사': 'musa',
    '매화': 'mahwa',
    '미스틱': 'mistic',
    '발키리': 'valc',
    '쿠노이치': 'kuno',
    '닌자': 'ninja',
    '다크나이트': 'darknight',
    '위자드': 'wizard',
    '아처': 'archer',
    '우사': 'usa',
    '위치': 'witch',
    '도사': 'dosa',
    '데드아이': 'dead',
    '오공': 'ukong'
  }
  return classMap[className] || className.toLowerCase()
}

export default function ClassSelector({ selectedSeasonId }: ClassSelectorProps = {}) {
  const pathname = usePathname()
  const router = useRouter()
  // 'solare-league'는 제외하고 currentClass 값 설정
  const currentClass = decodeURIComponent(pathname.split('/').pop() || '')

  const handleClick = (cls: string) => {
    let url = cls === '전체' ? '/solare-league' : `/solare-league/${encodeURIComponent(cls)}`
    
    // 선택된 시즌이 있으면 URL 파라미터로 추가
    if (selectedSeasonId !== undefined && selectedSeasonId !== null) {
      url += `?seasonId=${selectedSeasonId}`
    }
    
    router.push(url)
  }

  const selectedValue = currentClass && currentClass !== 'solare-league' ? currentClass : '전체'

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm font-medium">클래스:</span>
      <Select value={selectedValue} onValueChange={handleClick}>
        <SelectTrigger className="w-48 bg-zinc-800 border-zinc-600 text-white">
          <div className="flex items-center gap-2">
            {selectedValue === '전체' ? (
              <span className="text-lg">📋</span>
            ) : (
              <img 
                src={`/class-icons/${getClassIconName(selectedValue)}.png`} 
                alt={selectedValue}
                className="w-4 h-4 object-contain brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <span>{selectedValue}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-600" side="bottom" align="start" sideOffset={5} avoidCollisions={false}>
          <SelectItem value="전체" className="text-white hover:bg-zinc-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span>전체</span>
            </div>
          </SelectItem>
          {classList.map((cls) => (
            <SelectItem 
              key={cls} 
              value={cls}
              className="text-white hover:bg-zinc-700"
            >
              <div className="flex items-center gap-2">
                <img 
                  src={`/class-icons/${getClassIconName(cls)}.png`} 
                  alt={cls}
                  className="w-5 h-5 object-contain brightness-0 invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span>{cls}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}