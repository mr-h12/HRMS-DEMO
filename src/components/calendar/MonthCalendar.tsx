import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { dateLocale } from '@/i18n/lang'
import { toISODate } from '@/utils/format'

// Sunday-first week; names come from the active locale (2026-10-04 is a Sunday).
const weekdays = (style: 'short' | 'narrow') =>
  Array.from({ length: 7 }, (_, i) => new Date(2026, 9, 4 + i).toLocaleDateString(dateLocale(), { weekday: style }))

export interface CalendarDayRender {
  /** Classes for the day cell (background/border tone). */
  className?: string
  /** Small content rendered under the day number. */
  content?: ReactNode
  disabled?: boolean
}

interface MonthCalendarProps {
  /** Month as YYYY-MM */
  month: string
  onMonthChange?: (month: string) => void
  minMonth?: string
  maxMonth?: string
  renderDay?: (iso: string) => CalendarDayRender
  selected?: string | null
  onSelect?: (iso: string) => void
  today?: string
  compact?: boolean
}

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString(dateLocale(), { month: 'long', year: 'numeric' })
}

export function MonthCalendar({ month, onMonthChange, minMonth, maxMonth, renderDay, selected, onSelect, today, compact }: MonthCalendarProps) {
  const [y, m] = month.split('-').map(Number)
  const first = new Date(y, m - 1, 1)
  const daysInMonth = new Date(y, m, 0).getDate()
  const cells: (string | null)[] = Array.from({ length: first.getDay() }, () => null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISODate(new Date(y, m - 1, d)))
  while (cells.length % 7) cells.push(null)

  return (
    <div>
      {onMonthChange && (
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold">{monthLabel(month)}</h4>
          <div className="flex gap-1">
            <Button variant="outline" size="icon-sm" disabled={!!minMonth && month <= minMonth} onClick={() => onMonthChange(shiftMonth(month, -1))} aria-label="Previous month">
              <ChevronLeft className="rtl:-scale-x-100" />
            </Button>
            <Button variant="outline" size="icon-sm" disabled={!!maxMonth && month >= maxMonth} onClick={() => onMonthChange(shiftMonth(month, 1))} aria-label="Next month">
              <ChevronRight className="rtl:-scale-x-100" />
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {weekdays('short').map((d, i) => (
          <div key={d} className="pb-1 text-center text-[11px] font-medium text-muted-foreground uppercase">
            <span className="sm:hidden">{weekdays('narrow')[i]}</span>
            <span className="hidden sm:inline">{d}</span>
          </div>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <div key={`e-${i}`} />
          const r = renderDay?.(iso) ?? {}
          const isSelected = selected === iso
          const isToday = today === iso
          return (
            <button
              key={iso}
              type="button"
              disabled={r.disabled || !onSelect}
              onClick={() => onSelect?.(iso)}
              className={cn(
                'relative flex flex-col items-start rounded-lg border border-transparent p-1.5 text-start transition sm:p-2',
                compact ? 'min-h-11' : 'min-h-12 sm:min-h-[72px]',
                onSelect && !r.disabled && 'hover:border-primary/40 hover:shadow-xs',
                r.className,
                isSelected && 'ring-2 ring-primary ring-offset-1 ring-offset-card',
                'disabled:cursor-default',
              )}
              aria-label={iso}
              aria-pressed={isSelected}
            >
              <span className={cn('flex size-6 items-center justify-center rounded-full text-xs font-medium tabular', isToday && 'bg-primary text-primary-foreground')}>{Number(iso.slice(8))}</span>
              {r.content && <div className="mt-auto w-full">{r.content}</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
