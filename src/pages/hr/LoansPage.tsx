import { Banknote, CalendarClock, Eye, HandCoins, Inbox, Plus, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { Field } from '@/components/forms/Field'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Progress } from '@/components/ui/misc'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEPARTMENT_LIST, employeeById } from '@/data/employees'
import { initialLoans, installmentAmount, outstanding } from '@/data/loans'
import { useRequestActions } from '@/hooks/useRequestActions'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest, Loan } from '@/types'
import { formatCurrency, formatDate, relativeTime } from '@/utils/format'

const LOAN_TYPES: Loan['type'][] = ['Salary Advance', 'Personal Loan']
/** First repayment month for anything approved today. */
const NEXT_MONTH = '2026-11'
const monthLabel = (ym: string) => formatDate(`${ym}-01`, { month: 'short', year: 'numeric' })

export default function LoansPage() {
  const { requests, employees } = useAppStore()
  const decide = useRequestActions()
  const [created, setCreated] = useState<Loan[]>([])
  const [tab, setTab] = useState<'active' | 'pending' | 'settled'>('active')
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState(ALL)
  const [viewing, setViewing] = useState<HRRequest | null>(null)
  const [newOpen, setNewOpen] = useState(false)

  const advanceRequests = requests.filter((r) => r.type === 'Salary Advance')
  const pending = advanceRequests.filter((r) => r.status === 'Pending')

  // Approved advance requests become active loans, repaid from next month's payroll.
  const fromRequests: Loan[] = advanceRequests
    .filter((r) => r.status === 'Approved')
    .map((r) => ({ id: `LN-${r.id.slice(4)}`, employeeId: r.employeeId, type: 'Salary Advance', amount: r.amount ?? 0, installments: r.installments ?? 1, paidInstallments: 0, startMonth: NEXT_MONTH, reason: r.reason, status: 'Active' }))
  const loans = [...created, ...fromRequests, ...initialLoans]

  const active = loans.filter((l) => l.status === 'Active')
  const totalOutstanding = active.reduce((s, l) => s + outstanding(l), 0)
  const monthlyRecovery = active.reduce((s, l) => s + installmentAmount(l), 0)

  const matches = (employeeId: string) => {
    const e = employeeById(employeeId)
    if (!e) return false
    return (department === ALL || e.department === department) && (!query || `${e.name} ${e.id}`.toLowerCase().includes(query.toLowerCase()))
  }
  const rows = loans.filter((l) => (tab === 'settled' ? l.status === 'Settled' : l.status === 'Active') && matches(l.employeeId))
  const pendingRows = pending.filter((r) => matches(r.employeeId))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary advances & loans"
        description="Advances and staff loans, recovered automatically through monthly payroll deductions."
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus /> New loan
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Outstanding balance" value={formatCurrency(totalOutstanding)} icon={Wallet} tone="indigo" hint={`${active.length} active loans`} />
        <StatCard label="Recovered this month" value={formatCurrency(monthlyRecovery)} icon={CalendarClock} tone="emerald" hint="via October payroll" />
        <StatCard label="Active loans" value={active.length} icon={Banknote} tone="sky" hint={`${active.filter((l) => l.type === 'Salary Advance').length} salary advances`} />
        <StatCard label="Pending requests" value={pending.length} icon={Inbox} tone="amber" hint="awaiting HR review" onClick={() => setTab('pending')} />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="active">{`Active (${active.length})`}</TabsTrigger>
            <TabsTrigger value="pending">{`Pending (${pending.length})`}</TabsTrigger>
            <TabsTrigger value="settled">{`Settled (${loans.length - active.length})`}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchInput value={query} onChange={setQuery} placeholder="Search employee…" />
          <FilterSelect value={department} onChange={setDepartment} options={DEPARTMENT_LIST} label="Departments" />
        </div>
      </div>

      <Card className="overflow-hidden">
        {tab === 'pending' ? (
          pendingRows.length === 0 ? (
            <EmptyState icon={HandCoins} title="No pending advance requests" description="New salary advance requests from employees will appear here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="hidden md:table-cell">Monthly installment</TableHead>
                  <TableHead className="hidden lg:table-cell">Reason</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <PersonCell name={r.employeeName} subtitle={`${r.department} · ${relativeTime(r.submittedAt)}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium tabular">{formatCurrency(r.amount ?? 0)}</div>
                      <div className="text-xs text-muted-foreground">{`${r.installments} months`}</div>
                    </TableCell>
                    <TableCell className="hidden tabular md:table-cell">{formatCurrency(Math.round((r.amount ?? 0) / (r.installments ?? 1)))}</TableCell>
                    <TableCell className="hidden max-w-72 truncate text-muted-foreground lg:table-cell">{r.reason}</TableCell>
                    <TableCell className="text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setViewing(r)}>
                          <Eye /> <span className="hidden md:inline">View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => decide(r, 'Rejected')}>
                          Reject
                        </Button>
                        <Button variant="success" size="sm" onClick={() => decide(r, 'Approved')}>
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : rows.length === 0 ? (
          <EmptyState icon={Banknote} title="No loans match your filters" description="Try another department or clear the search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Loan</TableHead>
                <TableHead className="hidden md:table-cell">Installment</TableHead>
                <TableHead className="hidden lg:table-cell">Repayment</TableHead>
                <TableHead className="text-end">Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((l) => {
                const e = employeeById(l.employeeId) ?? employees.find((x) => x.id === l.employeeId)!
                const pct = Math.round((l.paidInstallments / l.installments) * 100)
                return (
                  <TableRow key={l.id}>
                    <TableCell>
                      <PersonCell name={e.name} subtitle={`${e.id} · ${e.department}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium tabular">{formatCurrency(l.amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {l.type} · <span data-no-translate>{l.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="tabular">{formatCurrency(installmentAmount(l))}</div>
                      <div className="text-xs text-muted-foreground">{`from ${monthLabel(l.startMonth)}`}</div>
                    </TableCell>
                    <TableCell className="hidden w-56 lg:table-cell">
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-muted-foreground">{`${l.paidInstallments} of ${l.installments} paid`}</span>
                        <span className="font-semibold tabular">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" indicatorClassName={l.status === 'Settled' ? 'bg-success' : undefined} />
                    </TableCell>
                    <TableCell className="text-end">
                      {l.status === 'Settled' ? <StatusBadge status="Settled" /> : <span className="font-semibold tabular">{formatCurrency(outstanding(l))}</span>}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <NewLoanDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onCreate={(loan) => {
          setCreated((prev) => [loan, ...prev])
          setTab('active')
        }}
      />
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

let loanCounter = 400

function NewLoanDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (l: Loan) => void }) {
  const { employees } = useAppStore()
  const eligible = useMemo(() => employees.filter((e) => e.status === 'Active').sort((a, b) => a.name.localeCompare(b.name)), [employees])
  const [employeeId, setEmployeeId] = useState('')
  const [type, setType] = useState<Loan['type']>('Personal Loan')
  const [amount, setAmount] = useState('')
  const [installments, setInstallments] = useState('6')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const value = Number(amount)
  const count = Math.max(1, Number(installments) || 1)
  const monthly = value > 0 ? Math.round(value / count) : 0
  const emp = employees.find((e) => e.id === employeeId)

  const save = () => {
    const e: Record<string, string> = {}
    if (!employeeId) e.employee = 'Choose an employee'
    if (!amount || Number.isNaN(value) || value <= 0) e.amount = 'Enter a valid amount'
    if (count > 24) e.installments = 'Loans are repaid within 24 months'
    if (emp && monthly > emp.basicSalary * 0.25) e.installments = 'The installment must not exceed 25% of basic salary'
    setErrors(e)
    if (Object.keys(e).length) return
    onCreate({ id: `LN-${loanCounter++}`, employeeId, type, amount: value, installments: count, paidInstallments: 0, startMonth: NEXT_MONTH, reason: reason.trim() || '—', status: 'Active' })
    toast.success('Loan created', { description: `${formatCurrency(value)} · ${count} × ${formatCurrency(monthly)} from November payroll` })
    setEmployeeId('')
    setAmount('')
    setReason('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New loan</DialogTitle>
          <DialogDescription>The installment is deducted automatically from each payroll run.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field label="Employee" error={errors.employee} required>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger aria-invalid={!!errors.employee}>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {eligible.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {`${e.name} · ${e.department}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Type" required>
              <Select value={type} onValueChange={(v) => setType(v as Loan['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOAN_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Amount (EGP)" htmlFor="loan-amount" error={errors.amount} required>
              <Input id="loan-amount" type="number" min="0" step="500" value={amount} onChange={(ev) => setAmount(ev.target.value)} placeholder="0" aria-invalid={!!errors.amount} />
            </Field>
            <Field label="Installments" htmlFor="loan-count" error={errors.installments} required>
              <Input id="loan-count" type="number" min="1" max="24" value={installments} onChange={(ev) => setInstallments(ev.target.value)} aria-invalid={!!errors.installments} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted p-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Monthly installment</div>
              <div className="mt-0.5 font-semibold tabular">{formatCurrency(monthly)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Share of basic salary</div>
              <div className="mt-0.5 font-semibold tabular">{emp && monthly ? `${Math.round((monthly / emp.basicSalary) * 100)}%` : '—'}</div>
            </div>
          </div>
          <Field label="Reason" htmlFor="loan-reason">
            <Textarea id="loan-reason" value={reason} onChange={(ev) => setReason(ev.target.value)} placeholder="e.g. Home renovation" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Create loan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
