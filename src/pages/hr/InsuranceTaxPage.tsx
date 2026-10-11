import { Building2, Calculator, CalendarClock, Download, FileCheck2, Info, Landmark, ShieldCheck, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { Field } from '@/components/forms/Field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEMO_TODAY } from '@/data/attendance'
import { daysUntil } from '@/data/contracts'
import { DEPARTMENT_LIST, employees } from '@/data/employees'
import { initialOffboarding } from '@/data/offboarding'
import { caseForCandidate, probationCases } from '@/data/onboarding'
import { payrollEntries } from '@/data/payroll'
import { useAppStore } from '@/store/AppStore'
import { formatCompactCurrency, formatCurrency, formatDate, parseDate, toISODate } from '@/utils/format'
import { downloadFile, toCSV } from '@/utils/download'
import { breakdown, INSURANCE_RULES, TAX_RULES } from '@/utils/egyptPayroll'

/** Contributions for a month are paid to NOSI by the 15th of the following month. */
const PAYMENT_DUE = '2026-11-15'

interface InsuranceForm {
  id: string
  form: 'Form 1' | 'Form 2' | 'Form 6'
  purpose: string
  name: string
  subtitle: string
  dueDate: string
  submitted: boolean
}

const shift = (iso: string, days: number) => {
  const d = parseDate(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export default function InsuranceTaxPage() {
  const { candidates } = useAppStore()
  const [tab, setTab] = useState<'contributions' | 'forms' | 'calculator'>('contributions')
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState(ALL)
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const rows = useMemo(() => payrollEntries.map((p) => ({ entry: p, b: breakdown(p.basic + p.allowances) })), [])
  const totals = rows.reduce(
    (s, r) => ({ insurable: s.insurable + r.b.insurableWage, employee: s.employee + r.b.employeeInsurance, employer: s.employer + r.b.employerInsurance, tax: s.tax + r.b.monthlyTax }),
    { insurable: 0, employee: 0, employer: 0, tax: 0 },
  )
  const filtered = rows.filter(({ entry }) => (department === ALL || entry.department === department) && (!query || `${entry.employeeName} ${entry.employeeId}`.toLowerCase().includes(query.toLowerCase())))

  // Form 1 (registration) for every new hire, Form 6 (termination) for every leaver, Form 2 (wage change) for this year's promotions.
  const forms: InsuranceForm[] = [
    ...candidates.filter((c) => c.stage === 'Hired').map((c, i) => caseForCandidate(c, i)).map((c) => ({ id: `F1-${c.id}`, form: 'Form 1' as const, purpose: 'Registration of a new employee', name: c.name, subtitle: `${c.position} · starts ${formatDate(c.startDate)}`, dueDate: c.startDate, submitted: false })),
    ...probationCases.map((c, i) => ({ id: `F1-${c.id}`, form: 'Form 1' as const, purpose: 'Registration of a new employee', name: c.name, subtitle: `${c.position} · joined ${formatDate(c.startDate)}`, dueDate: c.startDate, submitted: i % 4 !== 1 })),
    ...initialOffboarding.map((c) => {
      const e = employees.find((x) => x.id === c.employeeId)!
      return { id: `F6-${c.id}`, form: 'Form 6' as const, purpose: 'End of service notification', name: e.name, subtitle: `${c.type} · last day ${formatDate(c.lastWorkingDay)}`, dueDate: shift(c.lastWorkingDay, 7), submitted: false }
    }),
    ...employees.filter((e) => e.status === 'Active').filter((_, i) => i % 41 === 5).slice(0, 4).map((e, i) => ({ id: `F2-${e.id}`, form: 'Form 2' as const, purpose: 'Insurable wage change', name: e.name, subtitle: `${e.position} · new wage from Oct 2026`, dueDate: shift(DEMO_TODAY, [-3, 4, 12, 20][i]), submitted: i === 0 })),
  ].map((f) => ({ ...f, submitted: submitted[f.id] ?? f.submitted }))
  const formStatus = (f: InsuranceForm) => (f.submitted ? 'Submitted' : daysUntil(f.dueDate) < 0 ? 'Overdue' : 'Not submitted')

  const exportFile = () => {
    const csv = toCSV(
      filtered.map(({ entry, b }) => ({
        employee_id: entry.employeeId,
        name: entry.employeeName,
        department: entry.department,
        gross_wage: b.gross,
        insurable_wage: b.insurableWage,
        employee_share_11pct: b.employeeInsurance,
        employer_share_18_75pct: b.employerInsurance,
        salary_tax: b.monthlyTax,
      })),
    )
    downloadFile('social-insurance-october-2026.csv', csv, 'text/csv')
    toast.success('Contribution file exported', { description: `${filtered.length} employees · October 2026` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Social insurance & tax"
        description="Monthly social insurance contributions, salary tax and NOSI forms, calculated per the configured rules."
        actions={
          <Button variant="outline" onClick={exportFile}>
            <Download /> Export contribution file
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Insurable wages" value={formatCompactCurrency(totals.insurable)} icon={Users} tone="indigo" hint={`${rows.length} insured employees`} />
        <StatCard label="Employee share (11%)" value={formatCompactCurrency(totals.employee)} icon={ShieldCheck} tone="sky" hint="deducted from salaries" />
        <StatCard label="Company share (18.75%)" value={formatCompactCurrency(totals.employer)} icon={Building2} tone="violet" hint={`due ${formatDate(PAYMENT_DUE)}`} />
        <StatCard label="Salary tax" value={formatCompactCurrency(totals.tax)} icon={Landmark} tone="amber" hint="October withholding" />
      </div>

      <Card className="flex items-start gap-3 border-info/25 bg-info/5 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-info" />
        <div className="text-sm">
          <div className="font-medium">{`Rules in use: insurable wage EGP ${INSURANCE_RULES.minInsurableWage.toLocaleString('en-US')} – EGP ${INSURANCE_RULES.maxInsurableWage.toLocaleString('en-US')} · personal exemption EGP ${TAX_RULES.personalExemption.toLocaleString('en-US')} a year`}</div>
          <p className="mt-0.5 text-muted-foreground">Demo figures for illustration. Confirm the current limits and brackets with the company accountant before relying on them.</p>
        </div>
      </Card>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="contributions">
              <Users className="size-4" /> Monthly contributions
            </TabsTrigger>
            <TabsTrigger value="forms">
              <FileCheck2 className="size-4" /> {`Insurance forms (${forms.filter((f) => !f.submitted).length})`}
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Calculator className="size-4" /> Calculator
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {tab === 'contributions' && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput value={query} onChange={setQuery} placeholder="Search employee…" />
            <FilterSelect value={department} onChange={setDepartment} options={DEPARTMENT_LIST} label="Departments" />
          </div>
        )}
      </div>

      {tab === 'contributions' && (
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No employees match your filters" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden text-end md:table-cell">Gross wage</TableHead>
                  <TableHead className="text-end">Insurable wage</TableHead>
                  <TableHead className="hidden text-end sm:table-cell">Employee share</TableHead>
                  <TableHead className="hidden text-end lg:table-cell">Company share</TableHead>
                  <TableHead className="text-end">Salary tax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 60).map(({ entry, b }) => (
                  <TableRow key={entry.employeeId}>
                    <TableCell>
                      <PersonCell name={entry.employeeName} subtitle={`${entry.employeeId} · ${entry.department}`} />
                    </TableCell>
                    <TableCell className="hidden text-end tabular md:table-cell">{formatCurrency(b.gross)}</TableCell>
                    <TableCell className="text-end">
                      <div className="tabular">{formatCurrency(b.insurableWage)}</div>
                      {b.cap && <Badge variant={b.cap === 'max' ? 'neutral' : 'info'}>{b.cap === 'max' ? 'Capped at maximum' : 'Raised to minimum'}</Badge>}
                    </TableCell>
                    <TableCell className="hidden text-end tabular sm:table-cell">{formatCurrency(b.employeeInsurance)}</TableCell>
                    <TableCell className="hidden text-end tabular lg:table-cell">{formatCurrency(b.employerInsurance)}</TableCell>
                    <TableCell className="text-end tabular">{formatCurrency(b.monthlyTax)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {filtered.length > 60 && <p className="border-t px-5 py-3 text-xs text-muted-foreground">{`Showing 60 of ${filtered.length} employees — the exported file includes everyone.`}</p>}
        </Card>
      )}

      {tab === 'forms' && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...forms]
                .sort((a, b) => Number(a.submitted) - Number(b.submitted) || a.dueDate.localeCompare(b.dueDate))
                .map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="font-medium">{f.form}</div>
                      <div className="text-xs text-muted-foreground">{f.purpose}</div>
                    </TableCell>
                    <TableCell>
                      <PersonCell name={f.name} subtitle={f.subtitle} size="sm" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(f.dueDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={formStatus(f)} />
                    </TableCell>
                    <TableCell className="text-end">
                      {!f.submitted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSubmitted((prev) => ({ ...prev, [f.id]: true }))
                            toast.success(`${f.form} submitted`, { description: `${f.name} · ${f.purpose}` })
                          }}
                        >
                          <FileCheck2 /> Mark submitted
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {tab === 'calculator' && <SalaryCalculator />}

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarClock className="size-3.5" /> <span>October 2026 contributions are payable by</span> <span>{formatDate(PAYMENT_DUE)}</span>
      </p>
    </div>
  )
}

function SalaryCalculator() {
  const [gross, setGross] = useState('30000')
  const value = Math.max(0, Number(gross) || 0)
  const b = breakdown(value)
  const line = (label: string, amount: number, strong = false, negative = false) => (
    <div className={`flex items-center justify-between gap-4 border-b px-4 py-2.5 text-sm last:border-b-0 ${strong ? 'bg-muted font-semibold' : ''}`}>
      <span>{label}</span>
      <span className={`tabular ${negative ? 'text-destructive' : ''}`}>{negative ? `−${formatCurrency(amount)}` : formatCurrency(amount)}</span>
    </div>
  )
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>Salary calculator</CardTitle>
            <CardDescription>Enter a monthly gross wage to see insurance, tax and net pay.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Monthly gross wage (EGP)" htmlFor="calc-gross">
            <Input id="calc-gross" type="number" min="0" step="500" value={gross} onChange={(e) => setGross(e.target.value)} />
          </Field>
          <div className="rounded-lg border">
            {line('Gross wage', b.gross)}
            {line('Employee social insurance (11%)', b.employeeInsurance, false, true)}
            {line('Salary tax', b.monthlyTax, false, true)}
            {line('Net pay', b.net, true)}
          </div>
          <div className="rounded-lg border">
            {line('Insurable wage', b.insurableWage)}
            {line('Company social insurance (18.75%)', b.employerInsurance)}
            {line('Total cost to company', b.gross + b.employerInsurance, true)}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <div>
            <CardTitle>How the tax is calculated</CardTitle>
            <CardDescription>Annual taxable income is split across the progressive brackets.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ol className="space-y-2">
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">(Gross − employee insurance) × 12</span>
              <span className="tabular">{formatCurrency((b.gross - b.employeeInsurance) * 12)}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">Personal exemption</span>
              <span className="text-destructive tabular">{`−${formatCurrency(TAX_RULES.personalExemption)}`}</span>
            </li>
            <li className="flex justify-between gap-4 border-t pt-2 font-semibold">
              <span>Annual taxable income</span>
              <span className="tabular">{formatCurrency(b.annualTaxable)}</span>
            </li>
          </ol>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bracket</TableHead>
                <TableHead className="text-end">Rate</TableHead>
                <TableHead className="text-end">Tax</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {b.bracketTax.map((s) => (
                <TableRow key={s.from}>
                  <TableCell className="tabular">{`${formatCurrency(s.from)} – ${formatCurrency(s.to)}`}</TableCell>
                  <TableCell className="text-end tabular">{`${s.rate * 100}%`}</TableCell>
                  <TableCell className="text-end tabular">{formatCurrency(s.tax)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between gap-4 rounded-lg bg-muted px-4 py-3 font-semibold">
            <span>Monthly salary tax (annual ÷ 12)</span>
            <span className="tabular">{formatCurrency(b.monthlyTax)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
