import { CalendarCheck, CalendarDays, Clock, FileText, Inbox, LogIn, LogOut, Receipt, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatCard } from '@/components/cards/StatCard'
import { LeaveBalanceCard } from '@/components/dashboard/LeaveBalanceCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentRequestsCard } from '@/components/dashboard/RecentRequestsCard'
import { TodayAttendanceCard, useClockAction } from '@/components/dashboard/TodayAttendanceCard'
import { UpcomingEventsCard } from '@/components/dashboard/UpcomingEventsCard'
import { ExpenseModal } from '@/components/modals/ExpenseModal'
import { HrLetterModal } from '@/components/modals/HrLetterModal'
import { PayslipModal } from '@/components/modals/PayslipModal'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { RequestLeaveModal } from '@/components/modals/RequestLeaveModal'
import { ahmedAttendanceRate } from '@/data/attendance'
import { EMPLOYEE_ID } from '@/data/employees'
import { ahmedLeaveBalances } from '@/data/leaves'
import { NEXT_PAYROLL_DATE, payslips, payslipTotals } from '@/data/payroll'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest, Payslip } from '@/types'
import { formatCurrency, formatDate, greeting } from '@/utils/format'

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const { requests, clock, counts } = useAppStore()
  const loading = useSimulatedLoading()
  const onClock = useClockAction()
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [payslip, setPayslip] = useState<Payslip | null>(null)
  const [viewing, setViewing] = useState<HRRequest | null>(null)

  const myRequests = requests.filter((r) => r.employeeId === EMPLOYEE_ID)
  const annual = ahmedLeaveBalances[0]
  const nextPay = payslipTotals(payslips[0])
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-6 text-white shadow-lg shadow-indigo-500/20 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute right-40 -bottom-20 size-48 rounded-full bg-violet-300/20 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-indigo-100">{today}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">{greeting()}, Ahmed 👋</h1>
            <p className="mt-1 text-sm text-indigo-100">
              You have <span className="font-semibold text-white">{counts.myPending} pending requests</span> and your performance review is on Oct 15.
            </p>
          </div>
          <button
            type="button"
            onClick={onClock}
            className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg bg-white px-4 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 sm:self-auto"
          >
            {clock.clockedIn ? <LogOut className="size-4" /> : <LogIn className="size-4" />}
            {clock.clockedIn ? 'Clock out' : 'Clock in'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={loading} label="Attendance" value={`${ahmedAttendanceRate}%`} icon={CalendarCheck} tone="emerald" delta={{ value: '2.1%', positive: true }} hint="last 30 days" onClick={() => navigate('/employee/attendance')} />
        <StatCard loading={loading} label="Leave balance" value={`${annual.total - annual.used} days`} icon={CalendarDays} tone="indigo" hint={`of ${annual.total} annual leave days`} onClick={() => navigate('/employee/leave')} />
        <StatCard loading={loading} label="Next payroll" value={formatDate(NEXT_PAYROLL_DATE, { month: 'short', day: 'numeric' })} icon={Wallet} tone="sky" hint={`Est. net ${formatCurrency(nextPay.net)}`} onClick={() => navigate('/employee/payslips')} />
        <StatCard loading={loading} label="Pending requests" value={counts.myPending} icon={Inbox} tone="amber" hint="awaiting approval" onClick={() => navigate('/employee/requests')} />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Quick actions</h2>
        <QuickActions
          actions={[
            { label: clock.clockedIn ? 'Clock Out' : 'Clock In', description: clock.clockedIn ? `In since ${clock.clockInTime}` : 'Start your day', icon: Clock, onClick: onClock, tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300' },
            { label: 'Request Leave', description: `${annual.total - annual.used} annual days left`, icon: CalendarDays, onClick: () => setLeaveOpen(true), tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300' },
            { label: 'Request HR Letter', description: 'Salary, embassy & more', icon: FileText, onClick: () => setLetterOpen(true), tone: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300' },
            { label: 'Submit Expense', description: 'Reimbursement claim', icon: Receipt, onClick: () => setExpenseOpen(true), tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' },
            { label: 'View Payslip', description: payslips[1].period, icon: Wallet, onClick: () => setPayslip(payslips[1]), tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300' },
          ]}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayAttendanceCard />
        </div>
        <LeaveBalanceCard onRequest={() => setLeaveOpen(true)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentRequestsCard requests={myRequests.slice(0, 5)} onView={setViewing} />
        </div>
        <div className="lg:col-span-2">
          <UpcomingEventsCard />
        </div>
      </div>

      <RequestLeaveModal open={leaveOpen} onOpenChange={setLeaveOpen} />
      <HrLetterModal open={letterOpen} onOpenChange={setLetterOpen} />
      <ExpenseModal open={expenseOpen} onOpenChange={setExpenseOpen} />
      <PayslipModal payslip={payslip} onOpenChange={(o) => !o && setPayslip(null)} />
      <RequestDetailModal request={viewing} onOpenChange={(o) => !o && setViewing(null)} />
    </div>
  )
}
