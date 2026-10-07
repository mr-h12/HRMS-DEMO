import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu'
import { useRole } from '@/hooks/useRole'
import { GlobalSearch } from './GlobalSearch'
import { ProfileMenu } from './ProfileMenu'
import { RoleSwitcher } from './RoleSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function BrandMark() {
  return (
    <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30">
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M5 19V5h3v5.6h8V5h3v14h-3v-5.4H8V19z" />
      </svg>
    </span>
  )
}

export function Navbar({ collapsed, onToggleCollapse, onOpenMobile }: { collapsed: boolean; onToggleCollapse: () => void; onOpenMobile: () => void }) {
  const role = useRole()
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-1.5 border-b bg-card/85 px-2 backdrop-blur-md sm:gap-3 sm:px-4">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobile} aria-label="Open menu">
        <Menu className="size-5" />
      </Button>
      <Link to={`/${role}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap lg:w-[218px]" aria-label="HRMS DEMO home">
        <BrandMark />
        <span className="hidden text-[15px] font-bold tracking-tight sm:inline">
          HRMS <span className="text-primary">DEMO</span>
        </span>
      </Link>
      <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
      </Button>
      <RoleSwitcher />
      <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
        <GlobalSearch />
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <NotificationsMenu />
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <ProfileMenu />
      </div>
    </header>
  )
}
