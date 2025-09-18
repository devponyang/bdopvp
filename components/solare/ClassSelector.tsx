'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import classList from '@/lib/constants/class-list'

interface ClassSelectorProps {
  selectedSeasonId?: number | null
}

export default function ClassSelector({ selectedSeasonId }: ClassSelectorProps = {}) {
  const pathname = usePathname()
  const router = useRouter()
  // 'solare-league'는 제외하고 currentClass 값 설정
  const currentClass = decodeURIComponent(pathname.split('/').pop() || '')
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleClick = (cls: string) => {
    let url = cls === '전체' ? '/solare-league' : `/solare-league/${encodeURIComponent(cls)}`
    
    // 선택된 시즌이 있으면 URL 파라미터로 추가
    if (selectedSeasonId !== undefined && selectedSeasonId !== null) {
      url += `?seasonId=${selectedSeasonId}`
    }
    
    router.push(url)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      
      // 아래쪽 공간이 부족하고 위쪽 공간이 더 많으면 위로 열기
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownDirection('up')
      } else {
        setDropdownDirection('down')
      }
    }
    setIsOpen(!isOpen)
    setFocusedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleDropdown()
      }
      return
    }

    const options = ['전체', ...classList]
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % options.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev - 1 + options.length) % options.length)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0) {
          handleClick(options[focusedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        buttonRef.current?.focus()
        break
    }
  }

  // 포커스된 옵션으로 스크롤
  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [focusedIndex])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left w-full md:w-auto">
      <div>
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex w-full justify-between px-4 md:px-24 py-2 text-sm font-medium text-black bg-white rounded-md md:rounded-none border border-gray-300 shadow-sm overflow-hidden text-ellipsis whitespace-nowrap"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`직업 선택: ${currentClass && currentClass !== 'solare-league' ? currentClass : '전체'}`}
        >
          {/* 'solare-league'가 아닌 값만 표시 */}
          {currentClass && currentClass !== 'solare-league' ? currentClass : '전체'}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.23a.75.75 0 011.06 0L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute right-0 md:right-0 left-0 md:left-auto z-50 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-[400px] overflow-hidden ${
            dropdownDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          role="listbox"
          aria-label="직업 선택 목록"
        >
          <div className="py-2 flex flex-col items-center max-h-[400px] overflow-y-auto" style={{scrollbarWidth: 'thin'}}>
            <button
              ref={el => { optionRefs.current[0] = el }}
              className={`text-gray-700 block w-full px-4 md:px-24 py-3 text-sm rounded-none md:rounded-none hover:bg-gray-100 min-h-[44px] flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis ${
                focusedIndex === 0 ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleClick('전체')}
              onKeyDown={handleKeyDown}
              role="option"
              aria-selected={currentClass === 'solare-league' || !currentClass}
              tabIndex={-1}
            >
              전체
            </button>
            {classList.map((cls, index) => (
              <button
                key={cls}
                ref={el => { optionRefs.current[index + 1] = el }}
                className={`text-gray-700 block w-full px-4 md:px-24 py-3 text-sm rounded-none md:rounded-none hover:bg-gray-100 min-h-[44px] flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis ${
                  focusedIndex === index + 1 ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleClick(cls)}
                onKeyDown={handleKeyDown}
                role="option"
                aria-selected={currentClass === cls}
                tabIndex={-1}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
