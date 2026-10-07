import { Download, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { BrandMark } from '@/components/navbar/Navbar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { payslipTotals } from '@/data/payroll'
import type { Payslip } from '@/types'
import { downloadFile } from '@/utils/download'
import { formatCurrency, formatDate } from '@/utils/format'
import { payslipText } from '@/utils/payslip'

export function downloadPayslip(p: Payslip) {
  downloadFile(`Payslip-${p.month}-EMP-1042.txt`, payslipText(p))
  toast.success('Payslip downloaded', { description: `${p.period} · Payslip-${p.month}-EMP-1042.txt` })
}

export function PayslipModal({ payslip, onOpenChange }: { payslip: Payslip | null; onOpenChange: (o: boolean) => void }) {
  if (!payslip) return null
  const t = payslipTotals(payslip)
  return (
    <Dialog open={!!payslip} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payslip — {payslip.period}</DialogTitle>
          <DialogDescription>
            {payslip.status === 'Scheduled' ? `Preview · will be paid on ${formatDate(payslip.payDate)}` : `Paid on ${formatDate(payslip.payDate)}`}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="bg-muted/30">
          <div className="rounded-xl border bg-card p-5 shadow-xs sm:p-7">
            <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-start">
              <div className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <div className="font-semibold">Northwind Group</div>
                  <div className="text-xs text-muted-foreground">Tower B, Smart Village, Giza, Egypt</div>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs tracking-wide text-muted-foreground uppercase">Payslip</div>
                <div className="font-semibold">{payslip.period}</div>
                <StatusBadge status={payslip.status} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-b py-5 text-sm sm:grid-cols-3">
              {[
                ['Employee', 'Ahmed Hassan'],
                ['Employee ID', 'EMP-1042'],
                ['Department', 'Technology'],
                ['Position', 'Senior Software Engineer'],
                ['Pay date', formatDate(payslip.payDate)],
                ['Paid days', `${payslip.paidDays} / ${payslip.workingDays}`],
                ['Bank', 'CIB'],
                ['Account', 'EG38 •••• 8000 2'],
                ['Payment method', 'Bank transfer'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="font-medium">{v}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 py-5 sm:grid-cols-2">
              {[
                { title: 'Earnings', lines: payslip.earnings, total: t.gross, totalLabel: 'Gross salary' },
                { title: 'Deductions', lines: payslip.deductions, total: t.deductions, totalLabel: 'Total deductions' },
              ].map((s) => (
                <div key={s.title}>
                  <div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{s.title}</div>
                  <div className="space-y-2 text-sm">
                    {s.lines.map((l) => (
                      <div key={l.label} className="flex justify-between gap-3">
                        <span className="text-muted-foreground">{l.label}</span>
                        <span className="tabular">{formatCurrency(l.amount, true)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 border-t pt-2 font-semibold">
                      <span>{s.totalLabel}</span>
                      <span className="tabular">{formatCurrency(s.total, true)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start justify-between gap-2 rounded-xl bg-primary/8 px-5 py-4 sm:flex-row sm:items-center dark:bg-primary/15">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Net pay</div>
                <div className="text-2xl font-semibold text-primary tabular">{formatCurrency(t.net, true)}</div>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                Year-to-date net: {formatCurrency(t.net * 10 - 312, true)}
                <br />
                Social insurance no. 1094-221-8873
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => { window.print(); }}>
            <Printer /> Print
          </Button>
          <Button onClick={() => downloadPayslip(payslip)}>
            <Download /> Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
