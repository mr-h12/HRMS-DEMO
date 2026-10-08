import { CalendarDays, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FileDrop, Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEMO_TODAY } from '@/data/attendance'
import { EMPLOYEE_ID } from '@/data/employees'
import { ahmedLeaveBalances, LEAVE_TYPES } from '@/data/leaves'
import { useAppStore } from '@/store/AppStore'
import type { LeaveType } from '@/types'
import { formatDateRange } from '@/utils/format'
import { newRequestBase, workingDaysBetween } from '@/utils/requests'

export function RequestLeaveModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addRequest, pushNotification } = useAppStore()
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const days = workingDaysBetween(start, end)
  const balance = ahmedLeaveBalances.find((b) => b.type === leaveType)
  const remaining = balance ? balance.total - balance.used : undefined

  const reset = () => {
    setLeaveType('Annual Leave')
    setStart('')
    setEnd('')
    setReason('')
    setFile(null)
    setErrors({})
  }

  const submit = () => {
    const e: Record<string, string> = {}
    if (!start) e.start = 'Select a start date'
    if (!end) e.end = 'Select an end date'
    if (start && end && end < start) e.end = 'End date must be after the start date'
    if (start && end && end >= start && days === 0) e.end = 'Selected range has no working days'
    if (start && start < DEMO_TODAY && leaveType === 'Annual Leave') e.start = 'Annual leave must start today or later'
    if (remaining !== undefined && days > remaining) e.end = `Only ${remaining} days remaining for ${leaveType}`
    if (reason.trim().length < 5) e.reason = 'Please add a short reason'
    if (leaveType === 'Sick Leave' && days > 2 && !file) e.file = 'Medical certificate required for more than 2 days'
    setErrors(e)
    if (Object.keys(e).length) return

    setSubmitting(true)
    setTimeout(() => {
      const base = newRequestBase(EMPLOYEE_ID)
      addRequest({ ...base, type: 'Leave', leaveType, startDate: start, endDate: end, days, reason: reason.trim(), attachment: file?.name })
      const range = formatDateRange(start, end)
      pushNotification({ role: 'manager', kind: 'request', title: 'New leave request', message: `Ahmed submitted a leave request for ${range} (${days} day${days > 1 ? 's' : ''}).`, link: '/manager/approvals' })
      pushNotification({ role: 'hr', kind: 'request', title: 'Leave request submitted', message: `Ahmed submitted a leave request (${leaveType}, ${range}).`, link: '/hr/leave' })
      setSubmitting(false)
      onOpenChange(false)
      reset()
      toast.success('Leave request submitted', { description: `${leaveType} · ${range} · sent to Mohamed Ali for approval` })
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset() }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Request leave</DialogTitle>
          <DialogDescription>Your request will be sent to Mohamed Ali for approval.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field label="Leave type" required>
            <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((t) => {
                  const b = ahmedLeaveBalances.find((x) => x.type === t)
                  return (
                    <SelectItem key={t} value={t}>
                      {t}
                      {b ? ` — ${b.total - b.used} days left` : ''}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date" htmlFor="leave-start" error={errors.start} required>
              <Input id="leave-start" type="date" value={start} min="2026-01-01" onChange={(e) => { setStart(e.target.value); if (!end || e.target.value > end) setEnd(e.target.value) }} aria-invalid={!!errors.start} />
            </Field>
            <Field label="End date" htmlFor="leave-end" error={errors.end} required>
              <Input id="leave-end" type="date" value={end} min={start || '2026-01-01'} onChange={(e) => setEnd(e.target.value)} aria-invalid={!!errors.end} />
            </Field>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-muted-foreground">Working days requested:</span>
            <span className="font-semibold tabular">{days}</span>
            {remaining !== undefined && <span className="ms-auto text-xs text-muted-foreground">Balance after: {Math.max(0, remaining - days)} / {balance!.total}</span>}
          </div>
          <Field label="Reason" htmlFor="leave-reason" error={errors.reason} required>
            <Textarea id="leave-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Family trip — handover notes shared with the team" aria-invalid={!!errors.reason} />
          </Field>
          <Field label="Attachment" error={errors.file} hint="Optional — required for sick leave longer than 2 days.">
            <FileDrop id="leave-file" file={file} onFile={setFile} />
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
