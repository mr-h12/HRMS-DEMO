import { BadgeCheck, Calculator, CircleDollarSign, Download, Landmark, Play, Users, Wallet } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { GeneratePayrollModal } from '@/components/modals/GeneratePayrollModal'
import { SimpleBar } from '@/components/reports/charts'
import { Pagination, paginate } from '@/components/tables/Pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEPARTMENT_LIST } from '@/data/employees'
import { NEXT_PAYROLL_DATE, PAYROLL_PERIOD, PAYROLL_TOTALS, payrollByDepartment, payrollEntries, payrollHistory } from '@/data/payroll'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import type { PayrollEntry } from '@/types'
import { downloadFile, toCSV } from '@/utils/download'
import { formatCurrency, formatDate, formatNumber } from '@/utils/format'

const PAGE_SIZE = 12
const STAGES = ['Draft', 'Generated', 'Approved'] as const

export default function PayrollPage() {
  const { payrollStatus, setPayrollStatus, pushNotification } = useAppStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState(ALL)
  const [page, setPage] = useState(1)

  const entries = useMemo<PayrollEntry[]>(
    () => payrollEntries.map((p) => ({ ...p, status: p.status === 'On Hold' ? 'On Hold' : payrollStatus === 'Draft' ? 'Pending' : 'Processed' })),
    [payrollStatus],
  )
  const filtered = entries.filter((p) => (dept === ALL || p.department === dept) && (!query || [p.employeeName, p.employeeId, p.position].some((v) => v.toLowerCase().includes(query.toLowerCase()))))
  useEffect(() => setPage(1), [query, dept])
  const onHold = entries.filter((p) => p.status === 'On Hold').length
  const deptData = payrollByDepartment().map((d) => ({ department: d.department.replace('Human Resources', 'HR').replace('Customer Success', 'Cust. Success'), total: d.total }))

  const approve = () => {
    setPayrollStatus('Approved')
    pushNotification({ role: 'employee', kind: 'payroll', title: 'October payroll approved', message: 'Your October 2026 salary will be paid on Oct 28.', link: '/employee/payslips' })
    toast.success('Payroll approved', { description: `${formatCurrency(PAYROLL_TOTALS.net)} scheduled for transfer on ${formatDate(NEXT_PAYROLL_DATE)}` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Payroll · ${PAYROLL_PERIOD}`}
        title="Payroll"
        description={`Pay date ${formatDate(NEXT_PAYROLL_DATE, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · cut-off Oct 25`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                downloadFile('payroll-register-2026-10.csv', toCSV(entries.map((p) => ({ ID: p.employeeId, Employee: p.employeeName, Department: p.department, Basic: p.basic, Allowances: p.allowances, Overtime: p.overtime, Deductions: p.deductions, Net: p.net, Status: p.status }))), 'text/csv')
                toast.success('Payroll register exported', { description: 'payroll-register-2026-10.csv · 524 rows' })
              }}
            >
              <Download /> Export register
            </Button>
            {payrollStatus === 'Draft' && (
              <Button onClick={() => setOpen(true)}>
                <Play /> Generate Payroll
              </Button>
            )}
            {payrollStatus === 'Generated' && (
              <Button variant="success" onClick={approve}>
                <BadgeCheck /> Approve & release
              </Button>
            )}
            {payrollStatus === 'Approved' && (
              <Button variant="soft" disabled>
                <BadgeCheck /> Approved
              </Button>
            )}
          </>
        }
      />

      <Card className="p-4 sm:p-5">
        <ol className="grid gap-3 sm:grid-cols-3">
          {STAGES.map((s, i) => {
            const idx = STAGES.indexOf(payrollStatus)
            const state = i < idx ? 'done' : i === idx ? 'current' : 'todo'
            return (
              <li key={s} className={cn('flex items-center gap-3 rounded-xl border p-3', state === 'current' && 'border-primary/40 bg-primary/5')}>
                <span className={cn('flex size-8 items-center justify-center rounded-full text-sm font-semibold', state === 'done' ? 'bg-emerald-500 text-white' : state === 'current' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                  {state === 'done' ? '✓' : i + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold">{['Draft — ready for processing', 'Generated — pending approval', 'Approved — payments scheduled'][i]}</div>
                  <div className="text-xs text-muted-foreground">{['Attendance locked Oct 25', '524 payslips created', `Bank transfer ${formatDate(NEXT_PAYROLL_DATE, { month: 'short', day: 'numeric' })}`][i]}</div>
                </div>
              </li>
            )
          })}
        </ol>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total payroll" value={formatCurrency(PAYROLL_TOTALS.gross)} icon={Wallet} tone="indigo" delta={{ value: '1.0%', positive: true }} hint="vs September" />
        <StatCard label="Employees" value={formatNumber(PAYROLL_TOTALS.employees)} icon={Users} tone="sky" hint={`${onHold} on hold`} />
        <StatCard label="Deductions" value={formatCurrency(PAYROLL_TOTALS.deductions)} icon={Landmark} tone="rose" hint="Tax, social & medical" />
        <StatCard label="Net payroll" value={formatCurrency(PAYROLL_TOTALS.net)} icon={CircleDollarSign} tone="emerald" hint="to be transferred" />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex-col gap-3 lg:flex-row lg:items-center">
          <div>
            <CardTitle>Payroll register</CardTitle>
            <CardDescription>Monthly amounts in USD</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <SearchInput value={query} onChange={setQuery} placeholder="Search employee…" className="sm:w-60" />
            <FilterSelect value={dept} onChange={setDept} options={DEPARTMENT_LIST} label="Departments" />
          </div>
        </CardHeader>
        {filtered.length === 0 ? (
          <EmptyState icon={Calculator} title="No payroll records" description="No employees match your filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-end">Basic Salary</TableHead>
                <TableHead className="hidden text-end md:table-cell">Allowances</TableHead>
                <TableHead className="hidden text-end lg:table-cell">Overtime</TableHead>
                <TableHead className="hidden text-end sm:table-cell">Deductions</TableHead>
                <TableHead className="text-end">Net Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginate(filtered, page, PAGE_SIZE).map((p) => (
                <TableRow key={p.employeeId}>
                  <TableCell>
                    <PersonCell name={p.employeeName} subtitle={`${p.employeeId} · ${p.department}`} />
                  </TableCell>
                  <TableCell className="text-end tabular">{formatCurrency(p.basic)}</TableCell>
                  <TableCell className="hidden text-end tabular md:table-cell">{formatCurrency(p.allowances)}</TableCell>
                  <TableCell className="hidden text-end tabular lg:table-cell">{p.overtime ? formatCurrency(p.overtime) : '—'}</TableCell>
                  <TableCell className="hidden text-end text-rose-600 tabular sm:table-cell dark:text-rose-400">−{formatCurrency(p.deductions)}</TableCell>
                  <TableCell className="text-end font-semibold tabular">{formatCurrency(p.net)}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Payroll by department</CardTitle>
              <CardDescription>October gross payroll</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBar data={deptData} x="department" unit="$" series={[{ key: 'total', label: 'Gross payroll', color: 'var(--chart-1)' }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Payroll trend</CardTitle>
              <CardDescription>Gross vs net, last 6 months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBar data={payrollHistory} x="month" unit="$" series={[{ key: 'gross', label: 'Gross', color: 'var(--chart-1)' }, { key: 'net', label: 'Net', color: 'var(--chart-3)' }]} />
          </CardContent>
        </Card>
      </div>

      <GeneratePayrollModal
        open={open}
        onOpenChange={setOpen}
        onComplete={() => {
          setPayrollStatus('Generated')
          toast.success('Payroll generated', { description: '524 payslips created · awaiting approval' })
        }}
      />
    </div>
  )
}
