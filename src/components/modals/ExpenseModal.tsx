import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FileDrop, Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEMO_TODAY } from '@/data/attendance'
import { EMPLOYEE_ID } from '@/data/employees'
import { EXPENSE_CATEGORIES } from '@/data/leaves'
import { useAppStore } from '@/store/AppStore'
import { formatCurrency } from '@/utils/format'
import { newRequestBase } from '@/utils/requests'

export function ExpenseModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addRequest, pushNotification } = useAppStore()
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(DEMO_TODAY)
  const [description, setDescription] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const submit = () => {
    const e: Record<string, string> = {}
    const value = Number(amount)
    if (!amount || Number.isNaN(value) || value <= 0) e.amount = 'Enter a valid amount'
    else if (value > 5000) e.amount = 'Claims above $5,000 require a purchase order'
    if (description.trim().length < 5) e.description = 'Describe the expense'
    if (!receipt) e.receipt = 'Attach a receipt'
    setErrors(e)
    if (Object.keys(e).length) return
    setSubmitting(true)
    setTimeout(() => {
      addRequest({ ...newRequestBase(EMPLOYEE_ID), type: 'Expense', amount: value, category, date, reason: description.trim(), attachment: receipt?.name })
      pushNotification({ role: 'manager', kind: 'request', title: 'Expense claim', message: `Ahmed submitted an expense claim of ${formatCurrency(value)} (${category}).`, link: '/manager/approvals' })
      toast.success('Expense submitted', { description: `${formatCurrency(value)} · ${category} · reimbursed with next payroll once approved` })
      setSubmitting(false)
      setAmount('')
      setDescription('')
      setReceipt(null)
      onOpenChange(false)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit expense</DialogTitle>
          <DialogDescription>Approved expenses are reimbursed with the next payroll run.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Amount (USD)" htmlFor="exp-amount" error={errors.amount} required>
              <Input id="exp-amount" type="number" min="0" step="0.01" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" aria-invalid={!!errors.amount} />
            </Field>
          </div>
          <Field label="Expense date" htmlFor="exp-date" required>
            <Input id="exp-date" type="date" value={date} max={DEMO_TODAY} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Description" htmlFor="exp-desc" error={errors.description} required>
            <Textarea id="exp-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Taxi to client office — Smart Village" />
          </Field>
          <Field label="Receipt" error={errors.receipt} required>
            <FileDrop id="exp-receipt" file={receipt} onFile={setReceipt} label="Upload receipt" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />} Submit expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
