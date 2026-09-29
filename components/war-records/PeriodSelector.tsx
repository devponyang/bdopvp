'use client'

interface Props {
  selected: string
  onChange: (value: string) => void
}

const options = [
  { label: '주간', value: 'weekly' },
  { label: '월간', value: 'monthly' },
  { label: '연간', value: 'yearly' },
]

export default function PeriodSelector({ selected, onChange }: Props) {
  return (
    <div className="flex divide-x divide-zinc-700/50 rounded-lg overflow-hidden border border-zinc-700/50">
      {options.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 text-xs font-medium transition-colors ${
            selected === value
              ? 'bg-[oklch(0.85_0.18_200)] text-zinc-900'
              : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
