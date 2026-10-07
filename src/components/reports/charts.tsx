import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisProps, ChartLegend, ChartTooltip, gridProps } from '@/components/charts/ChartTooltip'

type Row = object
interface Series {
  key: string
  label: string
  color: string
}

const fmt = (unit?: string) => (v: number | string) => (unit === '$' ? `$${Number(v).toLocaleString()}` : `${typeof v === 'number' ? v.toLocaleString() : v}${unit && unit !== '$' ? unit : ''}`)

export function SimpleBar({ data, x, series, unit, stacked, height = 260 }: { data: Row[]; x: string; series: Series[]; unit?: string; stacked?: boolean; height?: number }) {
  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: unit === '$' ? 8 : -16, bottom: 0 }} barGap={2}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={x} {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => (unit === '$' ? `$${Math.round(v / 1000)}K` : `${v}${unit ?? ''}`)} />
            <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.6 }} content={<ChartTooltip formatter={fmt(unit)} />} />
            {series.map((s, i) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} stackId={stacked ? 'a' : undefined} stroke={stacked ? 'var(--card)' : undefined} strokeWidth={stacked ? 1 : 0} radius={!stacked || i === series.length - 1 ? [4, 4, 0, 0] : 0} maxBarSize={32} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 && (
        <div className="mt-3">
          <ChartLegend items={series.map((s) => ({ label: s.label, color: s.color }))} />
        </div>
      )}
    </div>
  )
}

export function SimpleLine({ data, x, series, unit, height = 260, domain }: { data: Row[]; x: string; series: Series[]; unit?: string; height?: number; domain?: [number, number] }) {
  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={x} {...axisProps} />
            <YAxis {...axisProps} domain={domain ?? ['auto', 'auto']} tickFormatter={(v) => `${v}${unit ?? ''}`} />
            <Tooltip content={<ChartTooltip formatter={fmt(unit)} />} cursor={{ stroke: 'var(--border)' }} />
            {series.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 && (
        <div className="mt-3">
          <ChartLegend items={series.map((s) => ({ label: s.label, color: s.color }))} />
        </div>
      )}
    </div>
  )
}

export function SimpleArea({ data, x, dataKey, label, unit, height = 260, domain }: { data: Row[]; x: string; dataKey: string; label: string; unit?: string; height?: number; domain?: [number | string, number | string] }) {
  const id = `grad-${dataKey}`
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={x} {...axisProps} />
          <YAxis {...axisProps} domain={domain ?? ['auto', 'auto']} tickFormatter={(v) => (unit === '$' ? `$${Math.round(v / 1000)}K` : `${v}${unit ?? ''}`)} />
          <Tooltip content={<ChartTooltip formatter={fmt(unit)} />} cursor={{ stroke: 'var(--border)' }} />
          <Area type="monotone" dataKey={dataKey} name={label} stroke="var(--chart-1)" strokeWidth={2} fill={`url(#${id})`} activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
