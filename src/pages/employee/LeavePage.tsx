import { CalendarDays, CalendarOff, CalendarPlus, Info, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { RequestLeaveModal } from '@/components/modals/RequestLeaveModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PUBLIC_HOLIDAYS } from '@/data/attendance'
import { EMPLOYEE_ID } from '@/data/employees'
import { ahmedLeaveBalances, LEAVE_POLICIES } from '@/data/leaves'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest } from '@/types'
import { formatDate, formatDateRange } from '@/utils/format'

const TONES = ['from-indigo-500 to-violet-500', 'from-sky-500 to-cyan-500', 'from-amber-500 to-orange-500']

export default function LeavePage() {
  const { requests } = useAppStore()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('all')
  const [viewing, setViewing] = useState<HRRequest | null>(null)
  const history = requests.filter((r) => r.employeeId === EMPLOYEE_ID && r.type === 'Leave')
  const filtered = tab === 'all' ? history : history.filter((r) => r.status.toLowerCase() === tab)
  const pendingDays = history.filter((r) => r.status === 'Pending').reduce((s, r) => s + (r.days ?? 0), 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Leave"
        description="Balances, history and new leave requests."
        actions={
          <Button onClick={() => setOpen(true)}>
            <CalendarPlus /> Request leave
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {ahmedLeaveBalances.map((b, i) => {
          const remaining = b.total - b.used
          return (
            <Card key={b.type} className="relative overflow-hidden p-5">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${TONES[i]}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium text-muted-foreground">{b.type}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight tabular">
                    {remaining}
                    <span className="text-base font-normal text-muted-foreground"> / {b.total} days</span>
                  </p>
                </div>
                <CalendarDays className="size-5 text-muted-foreground" />
              </div>
              <Progress value={(remaining / b.total) * 100} className="mt-4" indicatorClassName={b.color} />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{b.used} used</span>
                {b.type === 'Annual Leave' && pendingDays > 0 && <span className="text-amber-600 dark:text-amber-400">{pendingDays} pending approval</span>}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader className="flex-col sm:flex-row sm:items-center">
            <div>
              <CardTitle>Leave history</CardTitle>
              <CardDescription>All leave requests in 2026</CardDescription>
            </div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          {filtered.length === 0 ? (
            <EmptyState icon={CalendarOff} title="No leave requests" description="Nothing matches this filter yet." className="border-t" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setViewing(r)}>
                    <TableCell>
                      <div className="font-medium">{r.leaveType}</div>
                      <div className="max-w-56 truncate text-xs text-muted-foreground">{r.reason}</div>
                    </TableCell>
                    <TableCell className="tabular">{formatDateRange(r.startDate!, r.endDate!)}</TableCell>
                    <TableCell className="tabular">{r.days}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{formatDate(r.submittedAt.slice(0, 10))}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Public holidays</CardTitle>
                <CardDescription>Remaining in 2026</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[['2026-10-29', PUBLIC_HOLIDAYS['2026-10-29']], ['2026-12-25', 'Christmas Day (Dubai office)'], ['2027-01-07', 'Coptic Christmas']].map(([d, name]) => (
                <div key={d} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <PartyPopper className="size-4" />
                  </span>
                  <div>
                    <div className="text-[13px] font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(d, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Leave policy</CardTitle>
                <CardDescription>Northwind Group · Egypt</CardDescription>
              </div>
              <Info className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {LEAVE_POLICIES.slice(0, 4).map((p) => (
                <div key={p.type} className="text-[13px]">
                  <div className="flex justify-between font-medium">
                    <span>{p.type}</span>
                    <span className="tabular">{p.days} days</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <RequestLeaveModal open={open} onOpenChange={setOpen} />
      <RequestDetailModal request={viewing} onOpenChange={(o) => !o && setViewing(null)} />
    </div>
  )
}
