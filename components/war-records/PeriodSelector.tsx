'use client'

import { useState } from 'react'

interface Props {
  selected: string
  onChange: (value: string) => void
}

export default function PeriodSelector({ selected, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const options = ['주간', '월간', '연간']
  const selectedLabel = options.find((o) => {
    if (selected === 'weekly') return o === '주간'
    if (selected === 'monthly') return o === '월간'
    if (selected === 'yearly') return o === '연간'
    return false
  }) || '주간'

  const handleClick = (label: string) => {
    const valueMap: Record<string, string> = {
        주간: 'weekly',
        월간: 'monthly',
        연간: 'yearly',
      }
      onChange(valueMap[label])
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left w-full md:w-auto">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full justify-between items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600/30 shadow-xl hover:from-slate-600/80 hover:to-slate-700/80 transition-all duration-200 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            {selectedLabel}
          </span>
          <svg
            className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
        <div className="absolute z-[99999] top-0 left-full ml-2 w-48 origin-top-left bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-600/30 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-2">
            {options.map((label, index) => (
              <button
                key={label}
                onClick={() => handleClick(label)}
                className={`w-full px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                  label === selectedLabel 
                    ? 'text-blue-300 bg-blue-600/20 border-r-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="text-base">
                  {index === 0 ? '📊' : index === 1 ? '📈' : '📋'}
                </span>
                {label}
                {label === selectedLabel && (
                  <span className="ml-auto text-blue-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
