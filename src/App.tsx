import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageSkeleton } from '@/components/layout/PageSkeleton'
import { TooltipProvider } from '@/components/ui/misc'
import { isRole } from '@/config/roles'
import { LanguageProvider } from '@/hooks/useLanguage'
import { ThemeProvider, useTheme } from '@/hooks/useTheme'
import { AppStoreProvider } from '@/store/AppStore'

// Employee
const EmployeeDashboard = lazy(() => import('@/pages/employee/EmployeeDashboard'))
const AttendancePage = lazy(() => import('@/pages/employee/AttendancePage'))
const LeavePage = lazy(() => import('@/pages/employee/LeavePage'))
const PayslipsPage = lazy(() => import('@/pages/employee/PayslipsPage'))
const DocumentsPage = lazy(() => import('@/pages/employee/DocumentsPage'))
const PerformancePage = lazy(() => import('@/pages/employee/PerformancePage'))
const RequestsPage = lazy(() => import('@/pages/employee/RequestsPage'))
// Manager
const ManagerDashboard = lazy(() => import('@/pages/manager/ManagerDashboard'))
const MyTeamPage = lazy(() => import('@/pages/manager/MyTeamPage'))
const TeamAttendancePage = lazy(() => import('@/pages/manager/TeamAttendancePage'))
const TeamLeavePage = lazy(() => import('@/pages/manager/TeamLeavePage'))
const ApprovalsPage = lazy(() => import('@/pages/manager/ApprovalsPage'))
const TeamPerformancePage = lazy(() => import('@/pages/manager/TeamPerformancePage'))
const ManagerReportsPage = lazy(() => import('@/pages/manager/ManagerReportsPage'))
// HR
const HRDashboard = lazy(() => import('@/pages/hr/HRDashboard'))
const EmployeesPage = lazy(() => import('@/pages/hr/EmployeesPage'))
const HRAttendancePage = lazy(() => import('@/pages/hr/HRAttendancePage'))
const HRLeavePage = lazy(() => import('@/pages/hr/HRLeavePage'))
const PayrollPage = lazy(() => import('@/pages/hr/PayrollPage'))
const RecruitmentPage = lazy(() => import('@/pages/hr/RecruitmentPage'))
const HRPerformancePage = lazy(() => import('@/pages/hr/HRPerformancePage'))
const TrainingPage = lazy(() => import('@/pages/hr/TrainingPage'))
const HRDocumentsPage = lazy(() => import('@/pages/hr/HRDocumentsPage'))
const ReportsPage = lazy(() => import('@/pages/hr/ReportsPage'))
const SettingsPage = lazy(() => import('@/pages/hr/SettingsPage'))
// Shared
const ProfilePage = lazy(() => import('@/pages/shared/ProfilePage'))
const NotificationsPage = lazy(() => import('@/pages/shared/NotificationsPage'))
const PreferencesPage = lazy(() => import('@/pages/shared/PreferencesPage'))
const NotFoundPage = lazy(() => import('@/pages/shared/NotFoundPage'))
const SignedOutPage = lazy(() => import('@/pages/shared/SignedOutPage'))

const page = (el: ReactNode) => <Suspense fallback={<PageSkeleton />}>{el}</Suspense>

const shared = [
  <Route key="profile" path="profile" element={page(<ProfilePage />)} />,
  <Route key="notifications" path="notifications" element={page(<NotificationsPage />)} />,
  <Route key="preferences" path="preferences" element={page(<PreferencesPage />)} />,
  <Route key="404" path="*" element={page(<NotFoundPage />)} />,
]

function RootRedirect() {
  let stored: string | null = null
  try {
    stored = localStorage.getItem('hrms-role')
  } catch {
    /* ignore */
  }
  return <Navigate to={`/${isRole(stored ?? undefined) ? stored : 'employee'}`} replace />
}

function ThemedToaster({ rtl }: { rtl: boolean }) {
  const { theme } = useTheme()
  return <Toaster theme={theme} dir={rtl ? 'rtl' : 'ltr'} position={rtl ? 'top-left' : 'top-right'} richColors closeButton toastOptions={{ className: 'font-sans' }} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AppStoreProvider>
        <LanguageProvider>
          {(lang) => (
            <TooltipProvider key={lang}>
              <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Routes>
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/signed-out" element={page(<SignedOutPage />)} />
                  <Route path="/employee" element={<AppLayout />}>
                    <Route index element={page(<EmployeeDashboard />)} />
                    <Route path="attendance" element={page(<AttendancePage />)} />
                    <Route path="leave" element={page(<LeavePage />)} />
                    <Route path="payslips" element={page(<PayslipsPage />)} />
                    <Route path="documents" element={page(<DocumentsPage />)} />
                    <Route path="performance" element={page(<PerformancePage />)} />
                    <Route path="requests" element={page(<RequestsPage />)} />
                    {shared}
                  </Route>
                  <Route path="/manager" element={<AppLayout />}>
                    <Route index element={page(<ManagerDashboard />)} />
                    <Route path="team" element={page(<MyTeamPage />)} />
                    <Route path="attendance" element={page(<TeamAttendancePage />)} />
                    <Route path="leave" element={page(<TeamLeavePage />)} />
                    <Route path="approvals" element={page(<ApprovalsPage />)} />
                    <Route path="performance" element={page(<TeamPerformancePage />)} />
                    <Route path="reports" element={page(<ManagerReportsPage />)} />
                    {shared}
                  </Route>
                  <Route path="/hr" element={<AppLayout />}>
                    <Route index element={page(<HRDashboard />)} />
                    <Route path="employees" element={page(<EmployeesPage />)} />
                    <Route path="attendance" element={page(<HRAttendancePage />)} />
                    <Route path="leave" element={page(<HRLeavePage />)} />
                    <Route path="payroll" element={page(<PayrollPage />)} />
                    <Route path="recruitment" element={page(<RecruitmentPage />)} />
                    <Route path="performance" element={page(<HRPerformancePage />)} />
                    <Route path="training" element={page(<TrainingPage />)} />
                    <Route path="documents" element={page(<HRDocumentsPage />)} />
                    <Route path="reports" element={page(<ReportsPage />)} />
                    <Route path="settings" element={page(<SettingsPage />)} />
                    {shared}
                  </Route>
                  <Route path="*" element={<RootRedirect />} />
                </Routes>
              </BrowserRouter>
              <ThemedToaster rtl={lang === 'ar'} />
            </TooltipProvider>
          )}
        </LanguageProvider>
      </AppStoreProvider>
    </ThemeProvider>
  )
}
