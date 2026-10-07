import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisProps, ChartLegend, ChartTooltip, gridProps } from './ChartTooltip'

const SERIES = [
  { key: 'goals', label: 'Goal achievement', color: 'var(--chart-1)' },
  { key: 'performance', label: 'Performance', color: 'var(--chart-2)' },
  { key: 'productivity', label: 'Productivity', color: 'var(--chart-3)' },
] as const

type Point = { month: string; goals: number; performance: number; productivity: number }

export function PerformanceTrendChart({ data, height = 260 }: { data: Point[]; height?: number }) {
  const last = data[data.length - 1]
  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} domain={[60, 100]} unit="%" />
            <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} cursor={{ stroke: 'var(--border)' }} />
            {SERIES.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <ChartLegend items={SERIES.map((s) => ({ label: s.label, color: s.color, value: `${last[s.key]}%` }))} />
      </div>
    </div>
  )
}
