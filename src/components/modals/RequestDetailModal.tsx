import { Check, Paperclip, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { HRRequest } from '@/types'
import { formatCurrency, formatDate, formatDateTime, relativeTime } from '@/utils/format'
import { requestTitle } from '@/utils/requests'

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{children}</div>
    </div>
  )
}

export function RequestDetailModal({
  request, onOpenChange, onDecide,
}: { request: HRRequest | null; onOpenChange: (o: boolean) => void; onDecide?: (r: HRRequest, status: 'Approved' | 'Rejected') => void }) {
  if (!request) return null
  const r = request
  return (
    <Dialog open={!!request} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>{requestTitle(r)}</DialogTitle>
            <StatusBadge status={r.status} />
          </div>
          <DialogDescription>
            {r.id} · submitted {relativeTime(r.submittedAt)}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <UserAvatar name={r.employeeName} />
            <div>
              <div className="text-sm font-semibold">{r.employeeName}</div>
              <div className="text-xs text-muted-foreground">
                {r.department} · Reports to {r.managerName}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Item label="Request type">{r.type}</Item>
            {r.type === 'Leave' && (
              <>
                <Item label="Leave type">{r.leaveType}</Item>
                <Item label="Dates">
                  {formatDate(r.startDate!)} → {formatDate(r.endDate!)}
                </Item>
                <Item label="Working days">{r.days}</Item>
              </>
            )}
            {r.type === 'Overtime' && (
              <>
                <Item label="Date">{formatDate(r.date!)}</Item>
                <Item label="Hours">{r.hours} hours</Item>
              </>
            )}
            {r.type === 'Expense' && (
              <>
                <Item label="Amount">{formatCurrency(r.amount ?? 0, true)}</Item>
                <Item label="Category">{r.category}</Item>
              </>
            )}
            {r.type === 'HR Letter' && <Item label="Letter">{r.letterType}</Item>}
            <Item label="Submitted">{formatDateTime(r.submittedAt)}</Item>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Reason / notes</div>
            <p className="mt-1 rounded-lg bg-muted/50 px-3 py-2.5 text-sm">{r.reason}</p>
          </div>
          {r.attachment && (
            <div className="flex items-center gap-2 text-sm">
              <Paperclip className="size-4 text-muted-foreground" />
              <span className="font-medium">{r.attachment}</span>
            </div>
          )}
          {r.status !== 'Pending' && r.decidedBy && (
            <div className="rounded-lg border border-dashed px-3 py-2.5 text-[13px] text-muted-foreground">
              {r.status} by <span className="font-medium text-foreground">{r.decidedBy}</span>
              {r.decidedAt && <> · {formatDateTime(r.decidedAt)}</>}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          {onDecide && r.status === 'Pending' ? (
            <>
              <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => onDecide(r, 'Rejected')}>
                <X /> Reject
              </Button>
              <Button variant="success" onClick={() => onDecide(r, 'Approved')}>
                <Check /> Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
