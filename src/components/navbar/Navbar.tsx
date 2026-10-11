import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import logoMark from '@/assets/logo-mark.png'
import { Button } from '@/components/ui/button'
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu'
import { useRole } from '@/hooks/useRole'
import { cn } from '@/lib/utils'
import { GlobalSearch } from './GlobalSearch'
import { LanguageToggle } from './LanguageToggle'
import { ProfileMenu } from './ProfileMenu'
import { RoleSwitcher } from './RoleSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-black/5', className)}>
      <img src={logoMark} alt="" className="size-full object-contain" />
    </span>
  )
}

/** "SMART technology" wordmark in the logo's colours, with the product name underneath. */
export function BrandName({ product = 'HRMS' }: { product?: string }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="text-[15px] font-extrabold tracking-tight" dir="ltr" data-no-translate>
        <span className="text-[#1b2a4a] dark:text-white">SMART</span> <span className="text-[#5b8bd0]">technology</span>
      </span>
      <span className="mt-0.5 text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">{product}</span>
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
      <Link to={`/${role}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap lg:w-[218px]" aria-label="Smart Technology HRMS home">
        <BrandMark />
        <span className="hidden sm:inline">
          <BrandName product="HRMS · Demo" />
        </span>
      </Link>
      <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {collapsed ? <PanelLeftOpen className="size-[18px] rtl:-scale-x-100" /> : <PanelLeftClose className="size-[18px] rtl:-scale-x-100" />}
      </Button>
      <RoleSwitcher />
      <div className="ms-auto flex items-center gap-0.5 sm:gap-1.5">
        <GlobalSearch />
        <LanguageToggle />
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
