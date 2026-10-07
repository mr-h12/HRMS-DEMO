import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { EmployeeDrawer } from '@/components/drawers/EmployeeDrawer'
import { Navbar, BrandMark } from '@/components/navbar/Navbar'
import { Sidebar, SidebarFooter, SidebarNav } from '@/components/sidebar/Sidebar'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function AppLayout() {
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)')
  const [collapsed, setCollapsed] = useState(isTablet)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  // Tablet widths default to the icon rail; desktop to the full sidebar.
  useEffect(() => setCollapsed(isTablet), [isTablet])
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-dvh bg-background">
      <Navbar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} onOpenMobile={() => setMobileOpen(true)} />
      <div className="flex">
        <Sidebar collapsed={collapsed} />
        <main className="min-w-0 flex-1">
          <div key={pathname} className="mx-auto w-full max-w-[1440px] animate-fade-in px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="px-3">
          <div className="flex h-16 items-center gap-2.5 border-b px-2">
            <BrandMark />
            <div>
              <SheetTitle className="text-[15px] font-bold tracking-tight">
                HRMS <span className="text-primary">DEMO</span>
              </SheetTitle>
              <SheetDescription className="text-[11px]">Northwind Group</SheetDescription>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
          <SidebarFooter />
        </SheetContent>
      </Sheet>

      <EmployeeDrawer />
    </div>
  )
}
