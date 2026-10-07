import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const MAP: Record<string, BadgeVariant> = {
  Pending: 'warning', Approved: 'success', Rejected: 'danger',
  Active: 'success', 'On Leave': 'info', Probation: 'violet', 'Notice Period': 'warning',
  Present: 'success', Absent: 'danger', Late: 'warning', Overtime: 'violet', 'Missing Punch': 'danger', Weekend: 'neutral', Holiday: 'neutral',
  Paid: 'success', Scheduled: 'info', Processed: 'success', 'On Hold': 'danger', Draft: 'neutral', Generated: 'info',
  'On Track': 'success', 'At Risk': 'warning', Completed: 'success', Behind: 'danger', 'In Progress': 'info', 'Not Started': 'neutral',
  Valid: 'success', 'Expiring Soon': 'warning', Expired: 'danger',
  High: 'danger', Medium: 'warning', Low: 'neutral',
  Applied: 'neutral', Screening: 'info', Interview: 'violet', Offer: 'warning', Hired: 'success',
  Exceptional: 'violet', Exceeds: 'success', Meets: 'info', Developing: 'warning',
}

const DOT: Partial<Record<BadgeVariant, string>> = {
  success: 'bg-emerald-500', warning: 'bg-amber-500', danger: 'bg-rose-500', info: 'bg-sky-500', violet: 'bg-violet-500', neutral: 'bg-slate-400',
}

export function StatusBadge({ status, className, dot = true }: { status: string; className?: string; dot?: boolean }) {
  const variant = MAP[status] ?? 'neutral'
  return (
    <Badge variant={variant} className={className}>
      {dot && <span className={cn('size-1.5 rounded-full', DOT[variant])} />}
      {status}
    </Badge>
  )
}
