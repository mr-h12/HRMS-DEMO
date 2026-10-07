import { ArrowRight, CalendarDays, FileText, Inbox, Receipt, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { HRRequest, RequestType } from '@/types'
import { submittedLabel } from '@/utils/format'
import { requestSummary, requestTitle } from '@/utils/requests'

export const REQUEST_ICONS: Record<RequestType, typeof Inbox> = { Leave: CalendarDays, Overtime: Timer, Expense: Receipt, 'HR Letter': FileText }

export function RecentRequestsCard({ requests, onView }: { requests: HRRequest[]; onView: (r: HRRequest) => void }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Recent requests</CardTitle>
          <CardDescription>Your latest submissions</CardDescription>
        </div>
        <Button variant="ghost" size="xs" asChild>
          <Link to="/employee/requests">
            View all <ArrowRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        {requests.length === 0 ? (
          <EmptyState icon={Inbox} title="No requests yet" description="Leave, expense and HR letter requests will appear here." />
        ) : (
          requests.map((r) => {
            const Icon = REQUEST_ICONS[r.type]
            return (
              <button key={r.id} type="button" onClick={() => onView(r)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-muted/60">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold">{requestTitle(r)}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {requestSummary(r)} · {submittedLabel(r.submittedAt)}
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </button>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
