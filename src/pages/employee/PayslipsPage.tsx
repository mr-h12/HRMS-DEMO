import { Download, Eye, FileSpreadsheet, Landmark, Receipt, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { downloadPayslip, PayslipModal } from '@/components/modals/PayslipModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { payslips, payslipTotals } from '@/data/payroll'
import type { Payslip } from '@/types'
import { downloadFile } from '@/utils/download'
import { formatCurrency, formatDate } from '@/utils/format'

export default function PayslipsPage() {
  const [viewing, setViewing] = useState<Payslip | null>(null)
  const latestPaid = payslips.find((p) => p.status === 'Paid')!
  const t = payslipTotals(latestPaid)

  return (
    <div className="space-y-6">
      <PageHeader title="My Payslips" description="Monthly salary statements, paid by bank transfer to your CIB account." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Last net pay" value={formatCurrency(t.net)} icon={Wallet} tone="indigo" hint={latestPaid.period} />
        <StatCard label="Gross salary" value={formatCurrency(t.gross)} icon={Receipt} tone="emerald" hint="Basic + allowances" />
        <StatCard label="Deductions" value={formatCurrency(t.deductions)} icon={Landmark} tone="rose" hint="Tax, social & medical insurance" />
        <StatCard label="Next pay date" value={formatDate(payslips[0].payDate, { month: 'short', day: 'numeric' })} icon={FileSpreadsheet} tone="sky" hint={`${payslips[0].period} payroll`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {payslips.map((p) => {
          const pt = payslipTotals(p)
          return (
            <Card key={p.id} className="flex flex-col p-5 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold">{p.period}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.status === 'Paid' ? 'Paid' : 'Pays'} on {formatDate(p.payDate)}
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="my-5 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross salary</span>
                  <span className="font-medium tabular">{formatCurrency(pt.gross, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deductions</span>
                  <span className="font-medium text-rose-600 tabular dark:text-rose-400">−{formatCurrency(pt.deductions, true)}</span>
                </div>
                <div className="flex justify-between border-t pt-2.5">
                  <span className="font-medium">Net salary</span>
                  <span className="text-lg font-semibold text-primary tabular">{formatCurrency(pt.net, true)}</span>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewing(p)}>
                  <Eye /> View
                </Button>
                <Button size="sm" onClick={() => downloadPayslip(p)}>
                  <Download /> Download
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Earnings breakdown</CardTitle>
              <CardDescription>Line items across the last three payslips</CardDescription>
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                {payslips.map((p) => (
                  <TableHead key={p.id} className="text-end">
                    {p.period.split(' ')[0].slice(0, 3)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {['Basic Salary', 'Housing Allowance', 'Transportation Allowance', 'Overtime', 'Income Tax', 'Social Insurance (Employee)', 'Medical Insurance'].map((label) => (
                <TableRow key={label}>
                  <TableCell className="font-medium">{label}</TableCell>
                  {payslips.map((p) => {
                    const line = [...p.earnings, ...p.deductions].find((l) => l.label.startsWith(label))
                    const isDeduction = p.deductions.some((l) => l.label.startsWith(label))
                    return (
                      <TableCell key={p.id} className={`text-end tabular ${isDeduction ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                        {line ? `${isDeduction ? '−' : ''}${formatCurrency(line.amount)}` : '—'}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Tax documents</CardTitle>
              <CardDescription>Annual statements</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Annual Tax Certificate 2025', 'Social Insurance Statement 2025', 'Salary Certificate — Sep 2026'].map((d) => (
              <div key={d} className="flex items-center gap-3 rounded-xl border p-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-[10px] font-bold text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">PDF</span>
                <span className="flex-1 truncate text-[13px] font-medium">{d}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Download ${d}`}
                  onClick={() => {
                    downloadFile(`${d.replace(/[^a-z0-9]+/gi, '-')}.txt`, `${d}\nEmployee: Ahmed Hassan (EMP-1042)\nIssued by Northwind Group HR — demo document.`)
                    toast.success('Download started', { description: d })
                  }}
                >
                  <Download />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <PayslipModal payslip={viewing} onOpenChange={(o) => !o && setViewing(null)} />
    </div>
  )
}
