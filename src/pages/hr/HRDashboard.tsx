import { ArrowRight, BriefcaseBusiness, CalendarOff, CheckCircle2, Clock, FileText, Inbox, Percent, Plus, Target, UserPlus, Users, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { StatCard } from '@/components/cards/StatCard'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { NotificationIcon } from '@/components/notifications/NotificationIcon'
import { SimpleArea } from '@/components/reports/charts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { departmentDistribution, headcountTrend, recentActivity } from '@/data/company'
import { PAYROLL_TOTALS } from '@/data/payroll'
import { jobOpenings, recruitmentFunnel } from '@/data/recruitment'
import { STATUSES } from '@/data/employees'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { useAppStore } from '@/store/AppStore'
import { CHART_COLORS } from '@/utils/colors'
import { formatCompactCurrency, formatNumber, greeting, relativeTime, todayLabel } from '@/utils/format'

const STATUS_COLORS: Record<string, string> = { Active: 'var(--chart-3)', 'On Leave': 'var(--chart-1)', Probation: 'var(--chart-5)', 'Notice Period': 'var(--chart-4)' }

export default function HRDashboard() {
  const navigate = useNavigate()
  const { employees, counts, payrollStatus } = useAppStore()
  const loading = useSimulatedLoading()
  const statusCounts = STATUSES.map((s) => ({ status: s, count: employees.filter((e) => e.status === s).length }))
  const newHires = employees.filter((e) => e.status === 'Probation').length
  const onLeave = statusCounts.find((s) => s.status === 'On Leave')!.count
  const today = todayLabel()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{greeting()}, Mariam 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here’s what’s happening across Northwind Group today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/hr/reports')}>
            View reports
          </Button>
          <Button onClick={() => navigate('/hr/employees?add=1')}>
            <Plus /> Add employee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard loading={loading} label="Total employees" value={formatNumber(employees.length)} icon={Users} tone="indigo" delta={{ value: '12.0%', positive: true }} hint="YoY" onClick={() => navigate('/hr/employees')} />
        <StatCard loading={loading} label="New hires" value={newHires} icon={UserPlus} tone="emerald" hint="in probation (last 90 days)" onClick={() => navigate('/hr/employees?status=Probation')} />
        <StatCard loading={loading} label="Open positions" value={jobOpenings.length} icon={BriefcaseBusiness} tone="violet" hint="248 applicants" onClick={() => navigate('/hr/recruitment')} />
        <StatCard loading={loading} label="On leave today" value={onLeave} icon={CalendarOff} tone="sky" hint={`${((onLeave / employees.length) * 100).toFixed(1)}% of workforce`} onClick={() => navigate('/hr/attendance')} />
        <StatCard loading={loading} label="Turnover rate" value="8.2%" icon={Percent} tone="amber" delta={{ value: '0.5 pts', positive: true }} hint="vs last quarter" onClick={() => navigate('/hr/reports')} />
        <StatCard loading={loading} label="Payroll cost" value={formatCompactCurrency(PAYROLL_TOTALS.gross)} icon={Wallet} tone="rose" hint="October 2026" onClick={() => navigate('/hr/payroll')} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Headcount</CardTitle>
              <CardDescription>Total employees, last 12 months</CardDescription>
            </div>
            <div className="text-end">
              <div className="text-xl font-semibold tabular">{formatNumber(employees.length)}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">+56 since Nov 2025</div>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleArea data={headcountTrend} x="month" dataKey="headcount" label="Headcount" domain={[440, 540]} height={280} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Department distribution</CardTitle>
              <CardDescription>Share of total headcount</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentDistribution} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="100%" stroke="var(--card)" strokeWidth={2} startAngle={90} endAngle={-270}>
                    {departmentDistribution.map((d, i) => (
                      <Cell key={d.name} fill={CHART_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tabular">{formatNumber(employees.length)}</span>
                <span className="text-xs text-muted-foreground">employees</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {departmentDistribution.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-[13px]" title={d.department}>
                  <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: CHART_COLORS[i] }} />
                  <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
                  <span className="font-semibold tabular">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recruitment funnel</CardTitle>
              <CardDescription>Current hiring cycle · {jobOpenings.length} open roles</CardDescription>
            </div>
            <Button variant="ghost" size="xs" asChild>
              <Link to="/hr/recruitment">
                Pipeline <ArrowRight className="rtl:-scale-x-100" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recruitmentFunnel.map((s, i) => {
              const pct = (s.value / recruitmentFunnel[0].value) * 100
              const conv = i > 0 ? Math.round((s.value / recruitmentFunnel[i - 1].value) * 100) : null
              return (
                <div key={s.stage}>
                  <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                    <span className="font-medium">{s.stage}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-semibold tabular">{s.value}</span>
                      {conv !== null && <span className="text-xs text-muted-foreground">{`${conv}% conv.`}</span>}
                    </span>
                  </div>
                  <div className="h-7 overflow-hidden rounded-md bg-muted">
                    <div className="h-full rounded-md bg-[var(--chart-1)] transition-all duration-700" style={{ width: `${Math.max(pct, 4)}%`, opacity: 1 - i * 0.14 }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Employee status</CardTitle>
              <CardDescription>Workforce by employment status</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
              {statusCounts.map((s) => (
                <div key={s.status} style={{ width: `${(s.count / employees.length) * 100}%`, background: STATUS_COLORS[s.status] }} title={`${s.status}: ${s.count}`} />
              ))}
            </div>
            <div className="mt-5 space-y-1">
              {statusCounts.map((s) => (
                <button
                  key={s.status}
                  type="button"
                  onClick={() => navigate(`/hr/employees?status=${encodeURIComponent(s.status)}`)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-start transition hover:bg-muted/60"
                >
                  <span className="size-2.5 rounded-[3px]" style={{ background: STATUS_COLORS[s.status] }} />
                  <span className="flex-1 text-[13px]">{s.status}</span>
                  <span className="text-sm font-semibold tabular">{s.count}</span>
                  <span className="w-12 text-end text-xs text-muted-foreground tabular">{((s.count / employees.length) * 100).toFixed(1)}%</span>
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4">
              {[
                { label: 'Leave requests', value: counts.pendingLeave, icon: Inbox, to: '/hr/leave' },
                { label: 'Docs expiring', value: 3, icon: FileText, to: '/hr/documents' },
                { label: 'Payroll', value: payrollStatus === 'Draft' ? 'Ready' : payrollStatus, icon: payrollStatus === 'Draft' ? Clock : CheckCircle2, to: '/hr/payroll' },
              ].map((x) => (
                <Link key={x.label} to={x.to} className="rounded-lg border p-2.5 transition hover:border-primary/30 hover:bg-muted/40">
                  <x.icon className="size-4 text-muted-foreground" />
                  <div className="mt-1.5 text-sm font-semibold">{x.value}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{x.label}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Recent HR activity</CardTitle>
              <CardDescription>Across all departments</CardDescription>
            </div>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:start-[17px] before:w-px before:bg-border">
              {recentActivity.map((a) => (
                <li key={a.id} className="relative flex gap-3">
                  <NotificationIcon kind={a.kind} className="relative ring-4 ring-card" />
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[13px] leading-snug">
                      <span className="font-semibold">{a.actor}</span> <span className="text-muted-foreground">{a.action}</span> <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{relativeTime(a.time)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
