import { isArabic } from '@/i18n/lang'
import { translate } from '@/i18n/translator'

interface TooltipPayload {
  name?: string | number
  value?: number | string
  color?: string
  payload?: { fill?: string }
}

/** Shared Recharts tooltip with theme-aware styling. */
export function ChartTooltip({
  active, payload, label, formatter, labelFormatter,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string | number
  formatter?: (value: number | string, name: string) => string
  labelFormatter?: (label: string) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-36 rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      {label !== undefined && label !== '' && <div className="mb-1.5 font-medium text-foreground">{labelFormatter ? labelFormatter(String(label)) : label}</div>}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
              {p.name}
            </span>
            <span className="font-medium text-foreground tabular">{formatter ? formatter(p.value ?? 0, String(p.name)) : p.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Axis labels are translated before Recharts measures them, so tick spacing fits Arabic text. */
const chartText = (v: string | number): string => (isArabic() && typeof v === 'string' ? (translate(v) ?? v) : String(v))

export const axisProps = {
  tick: { fontSize: 12, fill: 'var(--muted-foreground)' },
  tickLine: false,
  axisLine: false,
  tickFormatter: chartText,
} as const

export const gridProps = { stroke: 'var(--border)', strokeDasharray: '3 3', vertical: false } as const

export function ChartLegend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px]" style={{ background: i.color }} />
          {i.label}
          {i.value && <span className="font-medium text-foreground">{i.value}</span>}
        </span>
      ))}
    </div>
  )
}
