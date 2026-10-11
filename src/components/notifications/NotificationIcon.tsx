import { Bell, BriefcaseBusiness, CheckCircle2, Clock, FileText, Inbox, Target, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NotificationKind } from '@/types'

const MAP: Record<NotificationKind, { icon: typeof Bell; className: string }> = {
  request: { icon: Inbox, className: 'bg-primary/10 text-primary' },
  approval: { icon: CheckCircle2, className: 'bg-success/10 text-success' },
  payroll: { icon: Wallet, className: 'bg-info/10 text-info' },
  document: { icon: FileText, className: 'bg-warning/10 text-warning' },
  attendance: { icon: Clock, className: 'bg-destructive/10 text-destructive' },
  recruitment: { icon: BriefcaseBusiness, className: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300' },
  performance: { icon: Target, className: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300' },
  system: { icon: Bell, className: 'bg-muted text-muted-foreground' },
}

export function NotificationIcon({ kind, className }: { kind: NotificationKind; className?: string }) {
  const { icon: Icon, className: tone } = MAP[kind]
  return (
    <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full', tone, className)}>
      <Icon className="size-4" />
    </span>
  )
}
