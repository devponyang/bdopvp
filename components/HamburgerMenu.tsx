'use client'

interface HamburgerMenuProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export default function HamburgerMenu({ isOpen, onClick, className = '' }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col justify-center items-center w-8 h-8 space-y-1.5 p-1 ${className}`}
      aria-label="메뉴 열기/닫기"
    >
      <span
        className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  )
}
