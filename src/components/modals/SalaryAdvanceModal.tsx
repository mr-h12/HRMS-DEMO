import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EMPLOYEE_ID, employeeById } from '@/data/employees'
import { useAppStore } from '@/store/AppStore'
import { formatCurrency } from '@/utils/format'
import { newRequestBase } from '@/utils/requests'

const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 6, 9, 12]

/** Ahmed requests a salary advance, repaid through payroll in equal monthly installments. */
export function SalaryAdvanceModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addRequest, pushNotification } = useAppStore()
  const limit = employeeById(EMPLOYEE_ID)!.basicSalary * 2
  const [amount, setAmount] = useState('')
  const [installments, setInstallments] = useState('3')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const value = Number(amount)
  const count = Number(installments)
  const monthly = value > 0 ? Math.round(value / count) : 0

  const submit = () => {
    const e: Record<string, string> = {}
    if (!amount || Number.isNaN(value) || value <= 0) e.amount = 'Enter a valid amount'
    else if (value > limit) e.amount = `Advances are capped at two months’ basic salary (${formatCurrency(limit)})`
    if (reason.trim().length < 5) e.reason = 'Tell your manager what the advance is for'
    setErrors(e)
    if (Object.keys(e).length) return
    setSubmitting(true)
    setTimeout(() => {
      addRequest({ ...newRequestBase(EMPLOYEE_ID), type: 'Salary Advance', amount: value, installments: count, reason: reason.trim() })
      pushNotification({ role: 'manager', kind: 'request', title: 'Salary advance request', message: `Ahmed requested a salary advance of ${formatCurrency(value)} over ${count} months.`, link: '/manager/approvals' })
      toast.success('Advance requested', { description: `${formatCurrency(value)} · ${count} × ${formatCurrency(monthly)} deducted from payroll once approved` })
      setSubmitting(false)
      setAmount('')
      setReason('')
      onOpenChange(false)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request salary advance</DialogTitle>
          <DialogDescription>Approved advances are paid with the next payroll and repaid in monthly installments.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount (EGP)" htmlFor="adv-amount" error={errors.amount} required>
              <Input id="adv-amount" type="number" min="0" step="500" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" aria-invalid={!!errors.amount} />
            </Field>
            <Field label="Repay over" required>
              <Select value={installments} onValueChange={setInstallments}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSTALLMENT_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n === 1 ? '1 month' : `${n} months`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted p-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Monthly deduction</div>
              <div className="mt-0.5 font-semibold tabular">{formatCurrency(monthly)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Your limit</div>
              <div className="mt-0.5 font-semibold tabular">{formatCurrency(limit)}</div>
            </div>
          </div>
          <Field label="Reason" htmlFor="adv-reason" error={errors.reason} required>
            <Textarea id="adv-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Children’s school fees" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />} Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
