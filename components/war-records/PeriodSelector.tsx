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
          className="inline-flex w-full justify-between px-4 md:px-20 py-2 text-sm font-medium text-black bg-white rounded-md md:rounded-none border border-gray-300 shadow-sm overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {selectedLabel}
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
        <div className="absolute right-0 md:right-0 left-0 md:left-auto z-50 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-2 flex flex-col items-center">
            {options.map((label) => (
              <button
                key={label}
                onClick={() => handleClick(label)}
                className="text-gray-700 block w-full px-4 md:px-20 py-3 text-sm rounded-none md:rounded-none hover:bg-gray-100 min-h-[44px] flex items-center justify-center"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
