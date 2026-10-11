import { Menu } from 'lucide-react'
import logoMark from '@/assets/logo-mark.png'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu'
import { NAVIGATION, ROLE_LABELS } from '@/config/roles'
import { useRole } from '@/hooks/useRole'
import { cn } from '@/lib/utils'
import { GlobalSearch } from './GlobalSearch'
import { LanguageToggle } from './LanguageToggle'
import { ProfileMenu } from './ProfileMenu'
import { RoleSwitcher } from './RoleSwitcher'
import { ThemeToggle } from './ThemeToggle'

/** The Smart Technology mark. On dark surfaces it sits on a light tile so its charcoal blocks stay visible. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md dark:bg-white dark:p-0.5', className)}>
      <img src={logoMark} alt="" className="size-full object-contain" draggable={false} />
    </span>
  )
}

/** The page the context bar names: the longest navigation path that prefixes the current one. */
function usePageLabel() {
  const role = useRole()
  const { pathname } = useLocation()
  const match = NAVIGATION[role]
    .filter((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]
  return match?.label
}

/** The CRM's top context bar: menu (below lg), breadcrumb, then role, search and preferences. */
export function Navbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const role = useRole()
  const page = usePageLabel()
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-2 border-b bg-card px-3 py-2 sm:gap-3 sm:px-4">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobile} aria-label="Open menu">
        <Menu className="size-5" />
      </Button>
      <nav aria-label="Breadcrumb" className="me-auto hidden min-w-0 items-center gap-2 text-table text-muted-foreground md:flex">
        <span className="truncate">{ROLE_LABELS[role]}</span>
        {page && (
          <>
            <span aria-hidden>/</span>
            <span className="truncate text-section-title text-foreground">{page}</span>
          </>
        )}
      </nav>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2 md:flex-none">
        <RoleSwitcher />
        <GlobalSearch />
        <div className="hidden sm:block">
          <LanguageToggle />
        </div>
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  )
}
