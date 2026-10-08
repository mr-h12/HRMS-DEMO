import { Check, X } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { REQUEST_ICONS } from '@/components/dashboard/RecentRequestsCard'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/misc'
import { cn } from '@/lib/utils'
import type { HRRequest } from '@/types'
import { relativeTime } from '@/utils/format'
import { requestSummary, requestTitle } from '@/utils/requests'

export function ApprovalRow({ request: r, onDecide, onView, compact }: { request: HRRequest; onDecide: (r: HRRequest, s: 'Approved' | 'Rejected') => void; onView: (r: HRRequest) => void; compact?: boolean }) {
  const Icon = REQUEST_ICONS[r.type]
  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border p-3.5 transition hover:border-primary/25 hover:bg-muted/30', !compact && 'sm:flex-row sm:items-center')}>
      <button type="button" onClick={() => onView(r)} className="flex min-w-0 flex-1 items-center gap-3 text-start">
        <div className="relative">
          <UserAvatar name={r.employeeName} />
          <span className="absolute -end-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-muted">
            <Icon className="size-2.5 text-muted-foreground" />
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-[13px] font-semibold">{requestTitle(r)}</span>
            <span className="text-xs text-muted-foreground">· {r.employeeName}</span>
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {requestSummary(r)} · {relativeTime(r.submittedAt)}
          </div>
        </div>
      </button>
      {r.status === 'Pending' ? (
        <div className={cn('flex gap-2', compact ? 'ps-12' : 'sm:shrink-0')}>
          <Tooltip content="Reject">
            <Button variant="outline" size="sm" className={cn('flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive', !compact && 'sm:flex-none')} onClick={() => onDecide(r, 'Rejected')} aria-label={`Reject ${r.employeeName}'s request`}>
              <X /> <span className={compact ? '' : 'sm:hidden lg:inline'}>Reject</span>
            </Button>
          </Tooltip>
          <Tooltip content="Approve">
            <Button variant="success" size="sm" className={cn('flex-1', !compact && 'sm:flex-none')} onClick={() => onDecide(r, 'Approved')} aria-label={`Approve ${r.employeeName}'s request`}>
              <Check /> <span className={compact ? '' : 'sm:hidden lg:inline'}>Approve</span>
            </Button>
          </Tooltip>
        </div>
      ) : (
        <StatusBadge status={r.status} />
      )}
    </div>
  )
}
