'use client'
import * as React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'

function Calendar({ className, classNames, components, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker showOutsideDays={showOutsideDays} className={cn('p-3 rounded-lg bg-bg-secondary text-text-primary', className)} classNames={{
    months: 'flex flex-col sm:flex-row gap-4', month: 'relative', month_caption: 'flex justify-center items-center h-10', caption_label: 'text-sm font-semibold',
    nav: 'absolute inset-x-3 top-3 flex justify-between', button_previous: 'size-8 grid place-items-center rounded hover:bg-white/10', button_next: 'size-8 grid place-items-center rounded hover:bg-white/10',
    month_grid: 'border-collapse', weekdays: 'flex', weekday: 'w-9 text-xs text-text-muted text-center', week: 'flex mt-1', day: 'size-9 text-center text-sm', day_button: 'size-9 rounded hover:bg-white/10',
    selected: 'bg-neon-cyan text-bg-primary rounded', today: 'font-bold underline', outside: 'opacity-40', disabled: 'opacity-30', hidden: 'invisible', range_middle: 'bg-neon-cyan/20', range_start: 'rounded-l', range_end: 'rounded-r', ...classNames,
  }} components={{ Chevron: ({ className, orientation, size = 16 }) => { const Icon = orientation === 'left' ? ChevronLeft : orientation === 'up' ? ChevronUp : orientation === 'down' ? ChevronDown : ChevronRight; return <Icon className={className} size={size} /> }, ...components }} {...props}/>
}
export { Calendar }
