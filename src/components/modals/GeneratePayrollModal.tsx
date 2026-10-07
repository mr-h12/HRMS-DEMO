import { Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/misc'
import { PAYROLL_PERIOD, PAYROLL_TOTALS } from '@/data/payroll'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

const STEPS = [
  'Validating attendance & approved overtime',
  'Applying leave and unpaid absence deductions',
  'Calculating income tax & social insurance',
  'Reconciling allowances and expense reimbursements',
  'Generating 524 payslips',
]

export function GeneratePayrollModal({ open, onOpenChange, onComplete }: { open: boolean; onOpenChange: (o: boolean) => void; onComplete: () => void }) {
  const [current, setCurrent] = useState(-1)
  const done = current >= STEPS.length

  useEffect(() => {
    if (!open) {
      setCurrent(-1)
      return
    }
    if (current < 0 || done) return
    const t = setTimeout(() => setCurrent((c) => c + 1), 650)
    return () => clearTimeout(t)
  }, [open, current, done])

  useEffect(() => {
    if (done) onComplete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return (
    <Dialog open={open} onOpenChange={(o) => (current >= 0 && !done ? null : onOpenChange(o))}>
      <DialogContent hideClose={current >= 0 && !done}>
        <DialogHeader>
          <DialogTitle>Generate payroll — {PAYROLL_PERIOD}</DialogTitle>
          <DialogDescription>This is a UI simulation. No real payments are made.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ['Employees', String(PAYROLL_TOTALS.employees)],
              ['Gross', formatCurrency(PAYROLL_TOTALS.gross)],
              ['Net', formatCurrency(PAYROLL_TOTALS.net)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="mt-0.5 font-semibold tabular">{v}</div>
              </div>
            ))}
          </div>
          {current >= 0 && <Progress value={(Math.min(current, STEPS.length) / STEPS.length) * 100} />}
          <ol className="space-y-2.5">
            {STEPS.map((s, i) => (
              <li key={s} className={cn('flex items-center gap-3 text-sm', i > current && 'text-muted-foreground')}>
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
                    i < current && 'border-emerald-500 bg-emerald-500 text-white',
                    i === current && 'border-primary text-primary',
                  )}
                >
                  {i < current ? <Check className="size-3.5" /> : i === current ? <Loader2 className="size-3.5 animate-spin" /> : i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          {done && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              Payroll generated successfully. Review the register, then approve to release payments on Oct 28.
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          {current < 0 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setCurrent(0)}>Start payroll run</Button>
            </>
          ) : (
            <Button disabled={!done} onClick={() => onOpenChange(false)}>
              {done ? 'Done' : 'Processing…'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
