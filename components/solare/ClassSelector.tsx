'use client'

import { usePathname, useRouter } from 'next/navigation'
import classList from '@/lib/constants/class-list'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

interface ClassSelectorProps {
  selectedSeasonId?: number | null
}

const CLASS_ICON_MAP: Record<string, string> = {
  '워리어': 'warrior', '하사신': 'hasasin', '세이지': 'saji',
  '레인저': 'ranger', '가디언': 'gadi', '스칼라': 'scara',
  '드라카니아': 'draca', '소서러': 'sor', '노바': 'nova',
  '커세어': 'cosair', '란': 'lhan', '자이언트': 'jai',
  '매구': 'magu', '금수랑': 'taimer', '샤이': 'shai',
  '격투가': 'fighter', '무사': 'musa', '매화': 'mahwa',
  '미스틱': 'mistic', '발키리': 'valc', '쿠노이치': 'kuno',
  '닌자': 'ninja', '다크나이트': 'darknight', '위자드': 'wizard',
  '아처': 'archer', '우사': 'usa', '위치': 'witch',
  '도사': 'dosa', '데드아이': 'dead', '오공': 'ukong',
}

export default function ClassSelector({ selectedSeasonId }: ClassSelectorProps = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const currentClass = decodeURIComponent(pathname.split('/').pop() || '')
  const selectedValue = currentClass && currentClass !== 'solare-league' ? currentClass : '전체'
  const iconName = selectedValue !== '전체' ? (CLASS_ICON_MAP[selectedValue] || selectedValue.toLowerCase()) : null

  const handleClick = (cls: string) => {
    let url = cls === '전체' ? '/solare-league' : `/solare-league/${encodeURIComponent(cls)}`
    if (selectedSeasonId !== undefined && selectedSeasonId !== null) url += `?seasonId=${selectedSeasonId}`
    router.push(url)
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">클래스</span>
      <Select value={selectedValue} onValueChange={handleClick}>
        <SelectTrigger className="w-48 text-sm text-zinc-200 bg-zinc-900 border-zinc-700 hover:border-cyan-500/50 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-colors">
          <div className="flex items-center gap-2">
            {iconName ? (
              <img
                src={`/class-icons/${iconName}.png`}
                alt={selectedValue}
                className="w-4 h-4 object-contain brightness-0 invert opacity-60"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            )}
            <span>{selectedValue}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700">
          <SelectItem value="전체" className="text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              전체
            </div>
          </SelectItem>
          {classList.map((cls) => {
            const icon = CLASS_ICON_MAP[cls] || cls.toLowerCase()
            return (
              <SelectItem key={cls} value={cls} className="text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={`/class-icons/${icon}.png`}
                    alt={cls}
                    className="w-4 h-4 object-contain brightness-0 invert opacity-60"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  {cls}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
