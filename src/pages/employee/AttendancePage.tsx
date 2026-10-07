import { AlarmClock, CalendarCheck, CalendarX2, Clock, Download, Hourglass, MousePointerClick, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { MiniStat } from '@/components/cards/StatCard'
import { MonthCalendar } from '@/components/calendar/MonthCalendar'
import { axisProps, ChartLegend, ChartTooltip, gridProps } from '@/components/charts/ChartTooltip'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ahmedAttendance, DEMO_TODAY, PUBLIC_HOLIDAYS, summarizeMonth } from '@/data/attendance'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'
import { downloadFile, toCSV } from '@/utils/download'
import { formatDate } from '@/utils/format'

export const DAY_TONE: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20',
  Late: 'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20',
  Absent: 'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20',
  Overtime: 'bg-violet-50 border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20',
  'On Leave': 'bg-sky-50 border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20',
  Weekend: 'bg-muted/40',
  Holiday: 'bg-slate-100 dark:bg-slate-500/10',
  'Missing Punch': 'bg-rose-50 dark:bg-rose-500/10',
}

const DOT: Partial<Record<AttendanceStatus, string>> = {
  Present: 'bg-emerald-500', Late: 'bg-amber-500', Absent: 'bg-rose-500', Overtime: 'bg-violet-500', 'On Leave': 'bg-sky-500', Holiday: 'bg-slate-400',
}

export default function AttendancePage() {
  const [month, setMonth] = useState('2026-10')
  const [selected, setSelected] = useState<string | null>(DEMO_TODAY)
  const days = useMemo(() => ahmedAttendance[month] ?? [], [month])
  const summary = summarizeMonth(days)
  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days])
  const sel = selected ? byDate.get(selected) : undefined
  const workLog = days.filter((d) => !['Weekend'].includes(d.status)).reverse()
  const chartData = days
    .filter((d) => !['Weekend', 'Holiday'].includes(d.status) && d.date !== DEMO_TODAY)
    .map((d) => ({ day: Number(d.date.slice(8)), hours: d.hours, status: d.status }))

  const exportCsv = () => {
    downloadFile(
      `attendance-${month}-EMP-1042.csv`,
      toCSV(workLog.map((d) => ({ Date: d.date, Status: d.status, 'Check-in': d.checkIn ?? '', 'Check-out': d.checkOut ?? '', Hours: d.hours }))),
      'text/csv',
    )
    toast.success('Attendance exported', { description: `attendance-${month}-EMP-1042.csv` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Your check-ins, working hours and attendance history."
        actions={
          <>
            <Button variant="outline" onClick={exportCsv}>
              <Download /> Export
            </Button>
            <Button onClick={() => toast.success('Correction request sent', { description: 'Mohamed Ali will review your attendance correction.' })}>
              <AlarmClock /> Request correction
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MiniStat label="Present days" value={summary.present} icon={CalendarCheck} tone="emerald" />
        <MiniStat label="Absent" value={summary.absent} icon={CalendarX2} tone="rose" />
        <MiniStat label="Late arrivals" value={summary.late} icon={AlarmClock} tone="amber" />
        <MiniStat label="Overtime hours" value={`${summary.overtimeHours}h`} icon={TrendingUp} tone="violet" />
        <MiniStat label="Working hours" value={`${summary.hours}h`} icon={Hourglass} tone="sky" />
        <MiniStat label="Attendance rate" value={`${summary.rate}%`} icon={Clock} tone="indigo" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardContent className="pt-5">
            <MonthCalendar
              month={month}
              onMonthChange={(m) => { setMonth(m); setSelected(null) }}
              minMonth="2026-08"
              maxMonth="2026-10"
              today={DEMO_TODAY}
              selected={selected}
              onSelect={setSelected}
              renderDay={(iso) => {
                const d = byDate.get(iso)
                if (!d) return { disabled: true, className: 'opacity-40' }
                return {
                  className: DAY_TONE[d.status],
                  content:
                    d.status === 'Weekend' ? null : (
                      <div className="hidden items-center gap-1 sm:flex">
                        <span className={cn('size-1.5 shrink-0 rounded-full', DOT[d.status])} />
                        <span className="truncate text-[10px] text-muted-foreground">{d.checkIn ? d.checkIn.replace(' AM', '').replace(' PM', '') : d.status}</span>
                      </div>
                    ),
                }
              }}
            />
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
              {(['Present', 'Late', 'Overtime', 'Absent', 'On Leave', 'Holiday'] as AttendanceStatus[]).map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5">
                  <span className={cn('size-2 rounded-full', DOT[s])} /> {s}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Day details</CardTitle>
              <CardDescription>{selected ? formatDate(selected, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a day on the calendar'}</CardDescription>
            </div>
            {sel && <StatusBadge status={sel.status} />}
          </CardHeader>
          <CardContent>
            {!sel ? (
              <EmptyState icon={MousePointerClick} title="No day selected" description="Click any day in the calendar to see check-in, check-out and hours." />
            ) : sel.status === 'Weekend' || sel.status === 'Holiday' ? (
              <EmptyState icon={CalendarCheck} title={sel.status === 'Holiday' ? PUBLIC_HOLIDAYS[sel.date] : 'Weekend'} description="No attendance is required on this day." />
            ) : (
              <div className="space-y-3">
                {[
                  ['Check-in', sel.checkIn ?? '—'],
                  ['Check-out', sel.checkOut ?? (sel.date === DEMO_TODAY ? 'In progress' : '—')],
                  ['Hours worked', sel.date === DEMO_TODAY ? 'In progress' : `${sel.hours}h`],
                  ['Shift', '09:00 AM – 05:00 PM'],
                  ['Location', sel.status === 'On Leave' || sel.status === 'Absent' ? '—' : 'Cairo HQ — Tower B'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b pb-3 text-sm last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium tabular">{v}</span>
                  </div>
                ))}
                {sel.status === 'Late' && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">Arrived after the 09:15 AM grace period.</p>}
                {sel.status === 'Overtime' && <p className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-800 dark:bg-violet-500/10 dark:text-violet-300">{Math.round((sel.hours - 8) * 10) / 10}h overtime recorded and approved.</p>}
                <Button variant="outline" className="w-full" onClick={() => toast.success('Correction request sent', { description: `For ${formatDate(sel.date)} — pending manager review.` })}>
                  Request correction for this day
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Daily working hours</CardTitle>
              <CardDescription>Target 7h net per day (dashed line)</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="day" {...axisProps} />
                  <YAxis {...axisProps} domain={[0, 11]} />
                  <ReferenceLine y={7} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                  <Tooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltip formatter={(v) => `${v}h`} labelFormatter={(l) => `Day ${l}`} />} />
                  <Bar dataKey="hours" name="Hours" radius={[4, 4, 0, 0]} maxBarSize={18}>
                    {chartData.map((d) => (
                      <Cell key={d.day} fill={d.status === 'Overtime' ? 'var(--chart-5)' : d.status === 'Late' ? 'var(--chart-4)' : 'var(--chart-1)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3">
              <ChartLegend items={[{ label: 'Regular', color: 'var(--chart-1)' }, { label: 'Late arrival', color: 'var(--chart-4)' }, { label: 'Overtime', color: 'var(--chart-5)' }]} />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Attendance log</CardTitle>
              <CardDescription>{workLog.length} working-day records</CardDescription>
            </div>
          </CardHeader>
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead className="hidden sm:table-cell">Check-out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workLog.map((d) => (
                  <TableRow key={d.date} className="cursor-pointer" onClick={() => setSelected(d.date)}>
                    <TableCell className="font-medium">{formatDate(d.date, { weekday: 'short', month: 'short', day: 'numeric' })}</TableCell>
                    <TableCell className="tabular">{d.checkIn ?? '—'}</TableCell>
                    <TableCell className="hidden tabular sm:table-cell">{d.checkOut ?? '—'}</TableCell>
                    <TableCell className="tabular">{d.date === DEMO_TODAY ? '—' : `${d.hours}h`}</TableCell>
                    <TableCell>
                      <StatusBadge status={d.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
