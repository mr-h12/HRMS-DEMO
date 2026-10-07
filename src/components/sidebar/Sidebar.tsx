import { LifeBuoy, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Tooltip } from '@/components/ui/misc'
import { NAVIGATION, ROLE_LABELS } from '@/config/roles'
import { useRole } from '@/hooks/useRole'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'

export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const role = useRole()
  const { counts } = useAppStore()
  const items = NAVIGATION[role]
  return (
    <nav className="flex flex-col gap-0.5" aria-label={`${ROLE_LABELS[role]} navigation`}>
      {!collapsed && <div className="px-3 pt-1 pb-2 text-[11px] font-medium tracking-wider text-muted-foreground/80 uppercase">{ROLE_LABELS[role]} workspace</div>}
      {items.map((item) => {
        const badge = item.badgeKey ? counts[item.badgeKey] : 0
        const link = (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length === 2}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex h-9 items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                isActive && 'bg-primary/8 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/15',
                collapsed && 'justify-center px-0',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-primary" />}
                <item.icon className="size-[18px] shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {badge > 0 &&
                  (collapsed ? (
                    <span className="absolute top-1 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-sidebar" />
                  ) : (
                    <span className="rounded-full bg-primary/10 px-1.5 py-px text-[11px] font-semibold text-primary tabular">{badge}</span>
                  ))}
              </>
            )}
          </NavLink>
        )
        return collapsed ? (
          <Tooltip key={item.path} content={item.label} side="right">
            {link}
          </Tooltip>
        ) : (
          link
        )
      })}
    </nav>
  )
}

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        'sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 md:flex',
        collapsed ? 'w-[68px] px-2.5' : 'w-64 px-3',
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <SidebarNav collapsed={collapsed} />
      </div>
      <SidebarFooter collapsed={collapsed} />
    </aside>
  )
}

export function SidebarFooter({ collapsed }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="flex justify-center border-t py-3">
        <Tooltip content="Demo environment" side="right">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
        </Tooltip>
      </div>
    )
  }
  return (
    <div className="border-t py-3">
      <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/8 to-violet-500/5 p-3.5">
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <Sparkles className="size-4 text-primary" /> Demo environment
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Data is simulated. Use the role switcher to explore each experience.</p>
      </div>
      <a href="#help" onClick={(e) => e.preventDefault()} className="mt-2 flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground">
        <LifeBuoy className="size-[18px]" /> Help & support
      </a>
    </div>
  )
}
