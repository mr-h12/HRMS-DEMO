import { Bell, BriefcaseBusiness, CheckCircle2, Clock, FileText, Inbox, Target, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NotificationKind } from '@/types'

const MAP: Record<NotificationKind, { icon: typeof Bell; className: string }> = {
  request: { icon: Inbox, className: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300' },
  approval: { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300' },
  payroll: { icon: Wallet, className: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300' },
  document: { icon: FileText, className: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' },
  attendance: { icon: Clock, className: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300' },
  recruitment: { icon: BriefcaseBusiness, className: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300' },
  performance: { icon: Target, className: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300' },
  system: { icon: Bell, className: 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300' },
}

export function NotificationIcon({ kind, className }: { kind: NotificationKind; className?: string }) {
  const { icon: Icon, className: tone } = MAP[kind]
  return (
    <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full', tone, className)}>
      <Icon className="size-4" />
    </span>
  )
}
