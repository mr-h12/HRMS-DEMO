import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuickAction {
  label: string
  description: string
  icon: LucideIcon
  onClick: () => void
  tone: string
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={a.onClick}
          className="group flex items-center gap-3 rounded-xl border bg-card p-3.5 text-start shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105', a.tone)}>
            <a.icon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] leading-tight font-semibold">{a.label}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{a.description}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
