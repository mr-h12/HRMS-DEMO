import { AlarmClock, CalendarOff, Download, UserCheck, UserX, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { MiniStat } from '@/components/cards/StatCard'
import { TeamAttendanceChart } from '@/components/charts/TeamAttendanceChart'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { useTeamData } from '@/components/manager/useTeamData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEMO_TODAY, getDailyAttendance, lastWorkingDays, teamAttendanceTrend } from '@/data/attendance'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import { downloadFile, toCSV } from '@/utils/download'
import { formatDate } from '@/utils/format'

export default function TeamAttendancePage() {
  const { openEmployee } = useAppStore()
  const { team } = useTeamData()
  const days = lastWorkingDays(7)
  const [date, setDate] = useState(DEMO_TODAY)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(ALL)
  const ids = useMemo(() => new Set(team.map((e) => e.id)), [team])
  const records = useMemo(() => getDailyAttendance(date).filter((r) => ids.has(r.employeeId)), [date, ids])
  const byId = new Map(team.map((e) => [e.id, e]))
  const filtered = records.filter((r) => (status === ALL || r.status === status) && byId.get(r.employeeId)!.name.toLowerCase().includes(query.toLowerCase()))
  const count = (...s: string[]) => records.filter((r) => s.includes(r.status)).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Attendance"
        description="Attendance for your 18 direct reports only."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              downloadFile(`team-attendance-${date}.csv`, toCSV(records.map((r) => ({ ID: r.employeeId, Name: byId.get(r.employeeId)!.name, Status: r.status, 'Check-in': r.checkIn ?? '', 'Check-out': r.checkOut ?? '', Hours: r.hours }))), 'text/csv')
              toast.success('Attendance exported', { description: `team-attendance-${date}.csv` })
            }}
          >
            <Download /> Export day
          </Button>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {days.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDate(d)}
            className={cn('flex min-w-20 flex-col items-center rounded-xl border bg-card px-3 py-2 transition', d === date ? 'border-primary bg-primary/5 text-primary' : 'hover:border-primary/40')}
          >
            <span className="text-[11px] font-medium text-muted-foreground uppercase">{formatDate(d, { weekday: 'short' })}</span>
            <span className="text-sm font-semibold">{formatDate(d, { month: 'short', day: 'numeric' })}</span>
            {d === DEMO_TODAY && <span className="text-[10px] font-medium text-primary">Today</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <MiniStat label="Team members" value={team.length} icon={Users} tone="indigo" />
        <MiniStat label="Present" value={count('Present', 'Overtime', 'Missing Punch')} icon={UserCheck} tone="emerald" />
        <MiniStat label="Late" value={count('Late')} icon={AlarmClock} tone="amber" />
        <MiniStat label="On leave" value={count('On Leave')} icon={CalendarOff} tone="sky" />
        <MiniStat label="Absent" value={count('Absent')} icon={UserX} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="overflow-hidden xl:col-span-3">
          <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>{formatDate(date, { weekday: 'long', month: 'long', day: 'numeric' })}</CardTitle>
              <CardDescription>Shift 09:00 AM – 05:00 PM · grace period 15 min</CardDescription>
            </div>
          </CardHeader>
          <div className="flex flex-col gap-3 border-y px-5 py-3 sm:flex-row">
            <SearchInput value={query} onChange={setQuery} placeholder="Search team member…" className="sm:w-60" />
            <FilterSelect value={status} onChange={setStatus} options={['Present', 'Late', 'Overtime', 'On Leave', 'Absent', 'Missing Punch']} label="Statuses" />
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No records match" description="Try a different status or search." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead className="hidden sm:table-cell">Check-out</TableHead>
                  <TableHead className="hidden md:table-cell">Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const e = byId.get(r.employeeId)!
                  return (
                    <TableRow key={r.employeeId} className="cursor-pointer" onClick={() => openEmployee(e.id)}>
                      <TableCell>
                        <PersonCell name={e.name} subtitle={e.position} />
                      </TableCell>
                      <TableCell className="tabular">{r.checkIn ?? '—'}</TableCell>
                      <TableCell className="hidden tabular sm:table-cell">{r.checkOut ?? (date === DEMO_TODAY && r.checkIn ? 'Working' : '—')}</TableCell>
                      <TableCell className="hidden tabular md:table-cell">{r.hours ? `${r.hours}h` : '—'}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Card>
        <Card className="h-fit xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Last 7 working days</CardTitle>
              <CardDescription>Daily team attendance breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TeamAttendanceChart data={teamAttendanceTrend} height={280} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
