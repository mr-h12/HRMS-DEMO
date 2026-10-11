import { LifeBuoy, PanelLeft, Sparkles } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { BrandMark, BrandName } from '@/components/navbar/Navbar'
import { Tooltip } from '@/components/ui/misc'
import { NAVIGATION, ROLE_LABELS } from '@/config/roles'
import { useRole } from '@/hooks/useRole'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const role = useRole()
  const { counts } = useAppStore()
  const items = NAVIGATION[role]
  return (
    <nav className="flex flex-col" aria-label={`${ROLE_LABELS[role]} navigation`}>
      {!collapsed && <p className="px-3 pb-2 text-start text-table tracking-[0.08em] text-muted-foreground uppercase">{`${ROLE_LABELS[role]} workspace`}</p>}
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const badge = item.badgeKey ? counts[item.badgeKey] : 0
          const link = (
            <NavLink
              to={item.path}
              end={item.path.split('/').length === 2}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-foreground transition-colors hover:bg-muted',
                  FOCUS,
                  isActive && 'bg-muted font-medium',
                  collapsed && 'justify-center px-0',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-y-2 start-0 w-[3px] origin-center rounded-e-full bg-primary transition-[transform,opacity] duration-200',
                      isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0',
                    )}
                  />
                  <item.icon className={cn('size-5 shrink-0 transition-colors group-hover:text-primary', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                  {badge > 0 &&
                    (collapsed ? (
                      <span className="absolute top-1.5 end-2 size-2 rounded-full bg-primary ring-2 ring-sidebar" />
                    ) : (
                      <span className="ms-auto rounded-full bg-primary/14 px-2 py-0.5 text-table text-primary tabular-nums">{badge}</span>
                    ))}
                </>
              )}
            </NavLink>
          )
          return (
            <li key={item.path}>
              {collapsed ? (
                <Tooltip content={item.label} side="right">
                  {link}
                </Tooltip>
              ) : (
                link
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Sidebar header: the CRM puts the collapse control here, beside the product name. */
export function SidebarHeader({ collapsed = false, onToggleCollapse }: { collapsed?: boolean; onToggleCollapse?: () => void }) {
  const role = useRole()
  return (
    <div className={cn('flex min-h-16 items-center gap-3 border-b py-3', collapsed ? 'justify-center px-0' : 'px-4')}>
      {onToggleCollapse ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn('grid size-9 shrink-0 place-items-center rounded-lg border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', FOCUS)}
        >
          <PanelLeft className="size-5 rtl:-scale-x-100" />
        </button>
      ) : (
        <BrandMark />
      )}
      {!collapsed && (
        <Link to={`/${role}`} className={cn('flex min-w-0 items-center gap-2 rounded-md', FOCUS)} aria-label="Smart Technology HRMS home">
          {onToggleCollapse && <BrandMark className="size-7" />}
          <BrandName product="HRMS · Demo" />
        </Link>
      )}
    </div>
  )
}

export function Sidebar({ collapsed, onToggleCollapse }: { collapsed: boolean; onToggleCollapse: () => void }) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col border-e bg-sidebar transition-[width] duration-200 ease-out lg:flex',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3 scrollbar-thin">
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
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-primary">
            <Sparkles className="size-4" />
          </span>
        </Tooltip>
      </div>
    )
  }
  return (
    <div className="border-t px-2 py-3">
      <div className="rounded-lg border bg-muted p-3">
        <div className="flex items-center gap-2 text-table font-semibold">
          <Sparkles className="size-4 text-primary" /> Demo environment
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Data is simulated. Use the role switcher to explore each experience.</p>
      </div>
      <a
        href="#help"
        onClick={(e) => e.preventDefault()}
        className={cn('mt-2 flex min-h-11 items-center gap-3 rounded-lg px-3 text-muted-foreground hover:bg-muted hover:text-foreground', FOCUS)}
      >
        <LifeBuoy className="size-5" /> Help & support
      </a>
    </div>
  )
}
