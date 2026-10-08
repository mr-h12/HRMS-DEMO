import { CalendarOff } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { DEMO_TODAY } from '@/data/attendance'
import type { HRRequest } from '@/types'
import { formatDateRange } from '@/utils/format'

export function TeamLeaveList({ entries, onView }: { entries: HRRequest[]; onView?: (r: HRRequest) => void }) {
  if (!entries.length) return <EmptyState icon={CalendarOff} title="No upcoming leave" description="Nobody on the team has leave planned." />
  return (
    <div className="space-y-1">
      {entries.map((r) => {
        const active = r.startDate! <= DEMO_TODAY && r.endDate! >= DEMO_TODAY
        return (
          <button key={r.id} type="button" onClick={() => onView?.(r)} className="flex w-full items-center gap-3 rounded-xl p-2 text-start transition hover:bg-muted/50">
            <UserAvatar name={r.employeeName} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">{r.employeeName}</div>
              <div className="truncate text-xs text-muted-foreground">
                {r.leaveType} · {formatDateRange(r.startDate!, r.endDate!)} · {r.days}d
              </div>
            </div>
            {active ? <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">Away now</span> : <StatusBadge status={r.status} />}
          </button>
        )
      })}
    </div>
  )
}
