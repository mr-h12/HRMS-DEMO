import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { AttendanceTrendPoint } from '@/types'
import { axisProps, ChartLegend, ChartTooltip, gridProps } from './ChartTooltip'

const SERIES = [
  { key: 'present', label: 'Present', color: 'var(--chart-1)' },
  { key: 'late', label: 'Late', color: 'var(--chart-4)' },
  { key: 'onLeave', label: 'On leave', color: 'var(--chart-3)' },
  { key: 'absent', label: 'Absent', color: 'var(--chart-2)' },
] as const

export function TeamAttendanceChart({ data, height = 260 }: { data: AttendanceTrendPoint[]; height?: number }) {
  const last = data[data.length - 1]
  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="day" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.6 }} content={<ChartTooltip />} />
            {SERIES.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                stackId="a"
                fill={s.color}
                stroke="var(--card)"
                strokeWidth={1}
                radius={i === SERIES.length - 1 ? [4, 4, 0, 0] : 0}
                maxBarSize={36}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <ChartLegend items={SERIES.map((s) => ({ label: s.label, color: s.color, value: last ? String(last[s.key]) : undefined }))} />
      </div>
    </div>
  )
}
