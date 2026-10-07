import { Briefcase, Building2, CalendarDays, Hash, Mail, MapPin, MessageSquare, Pencil, Phone, Star, UserRound, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Button } from '@/components/ui/button'
import { Progress, Separator } from '@/components/ui/misc'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { DEMO_TODAY, getDailyAttendance } from '@/data/attendance'
import { MANAGER_ID } from '@/data/employees'
import { teamPerformance } from '@/data/performance'
import { ratingBand } from '@/data/performance'
import { useRole } from '@/hooks/useRole'
import { useAppStore } from '@/store/AppStore'
import { formatCurrency, formatDate } from '@/utils/format'

function Row({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

function tenure(joining: string) {
  const [y, m] = joining.split('-').map(Number)
  const months = (2026 - y) * 12 + (10 - m)
  if (months < 1) return 'Joined this month'
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return `${years} yr${years > 1 ? 's' : ''}${rem ? ` ${rem} mo` : ''}`
}

export function EmployeeDrawer() {
  const { drawerEmployeeId, openEmployee, employees } = useAppStore()
  const role = useRole()
  const emp = employees.find((e) => e.id === drawerEmployeeId)
  const today = emp ? getDailyAttendance(DEMO_TODAY).find((r) => r.employeeId === emp.id) : undefined
  const perf = emp ? teamPerformance.find((p) => p.employeeId === emp.id) : undefined
  const canSeeComp = role === 'hr'
  const isMyReport = emp?.managerId === MANAGER_ID

  return (
    <Sheet open={!!emp} onOpenChange={(o) => !o && openEmployee(null)}>
      <SheetContent className="sm:max-w-[440px]">
        {emp && (
          <>
            <div className="relative overflow-hidden border-b">
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-sky-500/15" />
              <div className="relative px-6 pt-10 pb-5">
                <UserAvatar name={emp.name} size="xl" ring className="ring-4" />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <SheetTitle className="text-lg">{emp.name}</SheetTitle>
                  <StatusBadge status={emp.status} />
                </div>
                <SheetDescription className="mt-0.5">
                  {emp.position} · {emp.department}
                </SheetDescription>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Message sent to ${emp.name.split(' ')[0]}`, { description: 'Delivered via Northwind Chat (demo).' })}>
                    <MessageSquare /> Message
                  </Button>
                  {role === 'hr' && (
                    <Button size="sm" variant="outline" onClick={() => toast.info('Edit mode is not available in the demo', { description: 'Profile changes would be routed for approval.' })}>
                      <Pencil /> Edit
                    </Button>
                  )}
                  {role === 'manager' && isMyReport && (
                    <Button size="sm" onClick={() => toast.success('1:1 scheduled', { description: `Thursday, Oct 8 at 3:00 PM with ${emp.name}` })}>
                      <CalendarDays /> Schedule 1:1
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5 scrollbar-thin">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border p-3 text-center">
                  <div className="text-lg font-semibold tabular">{emp.attendanceRate}%</div>
                  <div className="text-[11px] text-muted-foreground">Attendance</div>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold tabular">
                    {emp.rating.toFixed(1)} <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{ratingBand(emp.rating)}</div>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <div className="text-lg font-semibold">{tenure(emp.joiningDate)}</div>
                  <div className="text-[11px] text-muted-foreground">Tenure</div>
                </div>
              </div>

              <section>
                <h4 className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Today</h4>
                <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                  <div className="text-sm">
                    {today?.checkIn ? (
                      <>
                        Checked in at <span className="font-medium">{today.checkIn}</span>
                      </>
                    ) : today?.status === 'On Leave' ? (
                      'On approved leave'
                    ) : (
                      'No check-in recorded'
                    )}
                  </div>
                  {today && <StatusBadge status={today.status} />}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Contact</h4>
                <Row icon={Mail} label="Work email" value={emp.email} />
                <Row icon={Phone} label="Phone" value={emp.phone} />
                <Row icon={MapPin} label="Location" value={emp.location} />
              </section>
              <Separator />
              <section>
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Employment</h4>
                <Row icon={Hash} label="Employee ID" value={emp.id} />
                <Row icon={Building2} label="Department · Team" value={`${emp.department} · ${emp.team}`} />
                <Row icon={UserRound} label="Reports to" value={emp.managerName} />
                <Row icon={Briefcase} label="Employment type" value={emp.employmentType} />
                <Row icon={CalendarDays} label="Joining date" value={formatDate(emp.joiningDate)} />
                {canSeeComp && <Row icon={Wallet} label="Basic salary (monthly)" value={formatCurrency(emp.basicSalary)} />}
              </section>
              {perf && (role === 'manager' || role === 'hr') && (
                <>
                  <Separator />
                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Performance — H2 2026</h4>
                    {[
                      { label: 'Goal achievement', value: perf.goalAchievement },
                      { label: 'Productivity', value: perf.productivity },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="mb-1.5 flex justify-between text-[13px]">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span className="font-medium tabular">{m.value}%</span>
                        </div>
                        <Progress value={m.value} />
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Review status</span>
                      <StatusBadge status={perf.reviewStatus} />
                    </div>
                  </section>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
