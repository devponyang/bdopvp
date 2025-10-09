'use client'

import { usePathname, useRouter } from 'next/navigation'
import classList from '@/lib/constants/class-list'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ClassSelectorProps {
  selectedSeasonId?: number | null
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

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm font-medium">클래스:</span>
      <Select value={currentClass && currentClass !== 'solare-league' ? currentClass : '전체'} onValueChange={handleClick}>
        <SelectTrigger className="w-48 bg-zinc-800 border-zinc-600 text-white">
          <SelectValue placeholder="클래스 선택" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-600" side="bottom" align="start" sideOffset={5} avoidCollisions={false}>
          <SelectItem value="전체" className="text-white hover:bg-zinc-700">
            전체
          </SelectItem>
          {classList.map((cls) => (
            <SelectItem 
              key={cls} 
              value={cls}
              className="text-white hover:bg-zinc-700"
            >
              {cls}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}