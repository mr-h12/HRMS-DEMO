import { AlarmClock, CalendarOff, Download, Fingerprint, TrendingUp, UserCheck, UserX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { MiniStat } from '@/components/cards/StatCard'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { SimpleBar, SimpleLine } from '@/components/reports/charts'
import { Pagination, paginate } from '@/components/tables/Pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { companyAttendanceByMonth, DEMO_TODAY, getDailyAttendance, lastWorkingDays } from '@/data/attendance'
import { DEPARTMENT_LIST, LOCATIONS } from '@/data/employees'
import { useAppStore } from '@/store/AppStore'
import type { DailyAttendanceRecord } from '@/types'
import { downloadFile, toCSV } from '@/utils/download'
import { formatDate } from '@/utils/format'

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Overtime', 'Missing Punch', 'On Leave']
const PAGE_SIZE = 12

export default function HRAttendancePage() {
  const { employees, openEmployee } = useAppStore()
  const days = lastWorkingDays(10).reverse()
  const [date, setDate] = useState(DEMO_TODAY)
  const [dept, setDept] = useState(ALL)
  const [location, setLocation] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [fixed, setFixed] = useState<Record<string, DailyAttendanceRecord>>({})
  const byId = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees])

  const records = useMemo(
    () => getDailyAttendance(date).filter((r) => byId.has(r.employeeId)).map((r) => fixed[`${date}:${r.employeeId}`] ?? r),
    [date, byId, fixed],
  )
  const filtered = records.filter((r) => {
    const e = byId.get(r.employeeId)!
    return (dept === ALL || e.department === dept) && (location === ALL || e.location === location) && (status === ALL || r.status === status) && (!query || e.name.toLowerCase().includes(query.toLowerCase()) || e.id.toLowerCase().includes(query.toLowerCase()))
  })
  useEffect(() => setPage(1), [date, dept, location, status, query])
  const scope = records.filter((r) => (dept === ALL || byId.get(r.employeeId)!.department === dept) && (location === ALL || byId.get(r.employeeId)!.location === location))
  const count = (s: string) => scope.filter((r) => r.status === s).length

  const byDept = DEPARTMENT_LIST.map((d) => {
    const rs = records.filter((r) => byId.get(r.employeeId)!.department === d)
    const present = rs.filter((r) => ['Present', 'Overtime', 'Late', 'Missing Punch'].includes(r.status)).length
    return { department: d.replace('Human Resources', 'HR').replace('Customer Success', 'Cust. Success'), rate: rs.length ? Math.round((present / rs.length) * 1000) / 10 : 0 }
  })

  const fixPunch = (r: DailyAttendanceRecord) => {
    setFixed((f) => ({ ...f, [`${date}:${r.employeeId}`]: { ...r, status: 'Present', checkOut: date === DEMO_TODAY ? undefined : '05:10 PM', hours: date === DEMO_TODAY ? 0 : 7.4 } }))
    toast.success('Punch corrected', { description: `${byId.get(r.employeeId)!.name} · ${formatDate(date)} · employee notified` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Company-wide attendance across all departments and locations."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              downloadFile(`attendance-${date}.csv`, toCSV(filtered.map((r) => ({ ID: r.employeeId, Name: byId.get(r.employeeId)!.name, Department: byId.get(r.employeeId)!.department, Status: r.status, 'Check-in': r.checkIn ?? '', 'Check-out': r.checkOut ?? '', Hours: r.hours }))), 'text/csv')
              toast.success('Attendance exported', { description: `${filtered.length} records · attendance-${date}.csv` })
            }}
          >
            <Download /> Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MiniStat label="Present" value={count('Present')} icon={UserCheck} tone="emerald" />
        <MiniStat label="Absent" value={count('Absent')} icon={UserX} tone="rose" />
        <MiniStat label="Late" value={count('Late')} icon={AlarmClock} tone="amber" />
        <MiniStat label="Overtime" value={count('Overtime')} icon={TrendingUp} tone="violet" />
        <MiniStat label="Missing punch" value={count('Missing Punch')} icon={Fingerprint} tone="slate" />
        <MiniStat label="On leave" value={count('On Leave')} icon={CalendarOff} tone="sky" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 xl:flex-row xl:items-center">
          <Select value={date} onValueChange={setDate}>
            <SelectTrigger className="w-full xl:w-52" aria-label="Date">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {formatDate(d, { weekday: 'short', month: 'short', day: 'numeric' })}
                  {d === DEMO_TODAY ? ' — Today' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SearchInput value={query} onChange={setQuery} placeholder="Search employee or ID…" className="xl:w-64" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:flex">
            <FilterSelect value={dept} onChange={setDept} options={DEPARTMENT_LIST} label="Departments" className="sm:w-full xl:w-44" />
            <FilterSelect value={location} onChange={setLocation} options={LOCATIONS} label="Locations" className="sm:w-full xl:w-40" />
            <FilterSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} label="Statuses" className="sm:w-full xl:w-40" />
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={UserCheck} title="No attendance records" description="No records match the selected filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead className="hidden sm:table-cell">Check-out</TableHead>
                <TableHead className="hidden sm:table-cell">Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginate(filtered, page, PAGE_SIZE).map((r) => {
                const e = byId.get(r.employeeId)!
                return (
                  <TableRow key={r.employeeId}>
                    <TableCell>
                      <PersonCell name={e.name} subtitle={e.id} onClick={() => openEmployee(e.id)} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{e.department}</TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">{e.location}</TableCell>
                    <TableCell className="tabular">{r.checkIn ?? '—'}</TableCell>
                    <TableCell className="hidden tabular sm:table-cell">{r.checkOut ?? (r.checkIn && date === DEMO_TODAY && r.status !== 'Missing Punch' ? 'Working' : '—')}</TableCell>
                    <TableCell className="hidden tabular sm:table-cell">{r.hours ? `${r.hours}h` : '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-end">
                      {r.status === 'Missing Punch' && (
                        <Button variant="outline" size="xs" onClick={() => fixPunch(r)}>
                          Fix punch
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Attendance by department</CardTitle>
              <CardDescription>{formatDate(date, { weekday: 'long', month: 'short', day: 'numeric' })} · % of employees present</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBar data={byDept} x="department" unit="%" series={[{ key: 'rate', label: 'Attendance rate', color: 'var(--chart-1)' }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly trend</CardTitle>
              <CardDescription>Attendance and late-arrival rate, last 12 months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleLine data={companyAttendanceByMonth} x="month" unit="%" series={[{ key: 'rate', label: 'Attendance rate', color: 'var(--chart-1)' }, { key: 'late', label: 'Late arrivals', color: 'var(--chart-2)' }]} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
