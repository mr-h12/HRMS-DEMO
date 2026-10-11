import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { EmployeeDrawer } from '@/components/drawers/EmployeeDrawer'
import { Navbar } from '@/components/navbar/Navbar'
import { Sidebar, SidebarFooter, SidebarHeader, SidebarNav } from '@/components/sidebar/Sidebar'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { COMPANY } from '@/data/company'

/**
 * The CRM application shell:
 *   LTR: [Sidebar] [Top context bar / Page content]
 *   RTL: mirrored by `dir` — the sidebar is the inline-start child of one flex row.
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <a
        href="#page-content"
        className="sr-only rounded-lg border border-input bg-card px-3 py-2 shadow-2 focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to content
      </a>

      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenMobile={() => setMobileOpen(true)} />
        <main id="page-content" className="mx-auto w-full max-w-[1600px] flex-1 scroll-mt-20 p-4 sm:p-6">
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">{COMPANY.name}</SheetDescription>
          <SidebarHeader />
          <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
          <SidebarFooter />
        </SheetContent>
      </Sheet>

      <EmployeeDrawer />
    </div>
  )
}
