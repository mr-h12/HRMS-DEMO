import { ArrowRight, CalendarRange } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MonthCalendar } from '@/components/calendar/MonthCalendar'
import { PageHeader } from '@/components/common/PageHeader'
import { UserAvatar } from '@/components/common/UserAvatar'
import { TeamLeaveList } from '@/components/manager/TeamLeaveList'
import { useTeamData } from '@/components/manager/useTeamData'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEMO_TODAY, isWeekend, PUBLIC_HOLIDAYS } from '@/data/attendance'
import { useRequestActions } from '@/hooks/useRequestActions'
import { cn } from '@/lib/utils'
import type { HRRequest } from '@/types'
import { formatDate, parseDate, pluralize } from '@/utils/format'

export default function TeamLeavePage() {
  const { team, teamRequests } = useTeamData()
  const decide = useRequestActions()
  const [month, setMonth] = useState('2026-10')
  const [selected, setSelected] = useState<string | null>(DEMO_TODAY)
  const [viewing, setViewing] = useState<HRRequest | null>(null)
  const leaves = useMemo(() => teamRequests.filter((r) => r.type === 'Leave' && r.status !== 'Rejected'), [teamRequests])
  const onDay = (iso: string) => leaves.filter((r) => r.startDate! <= iso && r.endDate! >= iso && !isWeekend(parseDate(iso)) && !PUBLIC_HOLIDAYS[iso])
  const selectedLeaves = selected ? onDay(selected) : []
  const upcoming = leaves.filter((r) => r.endDate! >= DEMO_TODAY).sort((a, b) => a.startDate!.localeCompare(b.startDate!))

  // Annual leave balances for the team (entitlement 21 days, used derived from approved leave in 2026).
  const balances = team.map((e, i) => {
    const used = teamRequests.filter((r) => r.employeeId === e.id && r.type === 'Leave' && r.leaveType === 'Annual Leave' && r.status === 'Approved').reduce((s, r) => s + (r.days ?? 0), 0) + ((i * 3) % 7)
    return { e, used: e.id === 'EMP-1042' ? 7 : Math.min(21, used) }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Leave"
        description="Who’s away, upcoming leave and team balances."
        actions={
          <Button asChild>
            <Link to="/manager/approvals">
              Pending leave requests <ArrowRight className="rtl:-scale-x-100" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardContent className="pt-5">
            <MonthCalendar
              month={month}
              onMonthChange={setMonth}
              minMonth="2026-09"
              maxMonth="2026-12"
              today={DEMO_TODAY}
              selected={selected}
              onSelect={setSelected}
              renderDay={(iso) => {
                const list = onDay(iso)
                if (isWeekend(parseDate(iso))) return { className: 'bg-muted/40' }
                if (PUBLIC_HOLIDAYS[iso]) return { className: 'bg-slate-100 dark:bg-slate-500/10', content: <span className="hidden truncate text-[10px] text-muted-foreground sm:block">Holiday</span> }
                if (!list.length) return {}
                const pending = list.some((r) => r.status === 'Pending')
                return {
                  className: pending ? 'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20' : 'bg-sky-50 border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20',
                  content: (
                    <div className="flex -space-x-1">
                      {list.slice(0, 3).map((r) => (
                        <UserAvatar key={r.id} name={r.employeeName} size="xs" ring className="hidden size-5 text-[8px] sm:inline-flex" />
                      ))}
                      <span className="text-[10px] font-medium text-muted-foreground sm:hidden">{list.length}</span>
                      {list.length > 3 && <span className="hidden ps-2 text-[10px] text-muted-foreground sm:inline">+{list.length - 3}</span>}
                    </div>
                  ),
                }
              }}
            />
            <div className="mt-4 flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-sky-400" /> Approved leave
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-amber-400" /> Includes pending requests
              </span>
              <span>Click a day to see who’s away</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{selected ? formatDate(selected, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select a day'}</CardTitle>
                <CardDescription>{selectedLeaves.length ? `${selectedLeaves.length} away` : 'Everyone is available'}</CardDescription>
              </div>
              <CalendarRange className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <TeamLeaveList entries={selectedLeaves} onView={setViewing} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Upcoming leave</CardTitle>
                <CardDescription>Next 60 days</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <TeamLeaveList entries={upcoming} onView={setViewing} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Annual leave balances</CardTitle>
            <CardDescription>21-day entitlement · encourage members with high balances to plan time off</CardDescription>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead className="hidden w-1/3 md:table-cell">Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map(({ e, used }) => (
              <TableRow key={e.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={e.name} size="sm" />
                    <span className="font-medium">{e.name}</span>
                  </div>
                </TableCell>
                <TableCell className="tabular">{pluralize(used, 'day')}</TableCell>
                <TableCell className={cn('font-medium tabular', 21 - used >= 16 && 'text-amber-600 dark:text-amber-400')}>{pluralize(21 - used, 'day')}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Progress value={(used / 21) * 100} className="h-1.5" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <RequestDetailModal
        request={viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        onDecide={(r, s) => {
          decide(r, s)
          setViewing(null)
        }}
      />
    </div>
  )
}
