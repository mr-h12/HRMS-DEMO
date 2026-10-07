import { BarChart3, BriefcaseBusiness, CalendarDays, Clock, Target, Timer, TrendingDown, Users, Wallet } from 'lucide-react'
import { companyAttendanceByMonth, teamAttendanceTrend } from '@/data/attendance'
import { headcountTrend, turnoverTrend } from '@/data/company'
import { employees, teamMembers } from '@/data/employees'
import { initialRequests } from '@/data/leaves'
import { PAYROLL_TOTALS, payrollByDepartment, payrollHistory } from '@/data/payroll'
import { departmentPerformance, ratingDistribution, teamPerformance, teamPerformanceTrend } from '@/data/performance'
import { jobOpenings, recruitmentFunnel } from '@/data/recruitment'
import { formatCurrency, formatNumber } from '@/utils/format'
import { SimpleArea, SimpleBar, SimpleLine } from './charts'
import type { ReportDefinition } from './ReportView'

const C = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)']
const TONE = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
}

const deptCounts = (() => {
  const m = new Map<string, number>()
  for (const e of employees) m.set(e.department, (m.get(e.department) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
})()

const leaveByType = (() => {
  const m = new Map<string, { days: number; requests: number }>()
  for (const r of initialRequests.filter((x) => x.type === 'Leave' && x.status === 'Approved')) {
    const v = m.get(r.leaveType!) ?? { days: 0, requests: 0 }
    v.days += r.days ?? 0
    v.requests++
    m.set(r.leaveType!, v)
  }
  return [...m.entries()].map(([type, v]) => ({ type, ...v })).sort((a, b) => b.days - a.days)
})()

const payrollDept = payrollByDepartment()

export const HR_REPORTS: ReportDefinition[] = [
  {
    id: 'headcount', title: 'Headcount', description: 'Workforce size, hires and exits by month and department.', icon: Users, tone: TONE.indigo, updated: 'today',
    headline: `${formatNumber(employees.length)} employees`,
    kpis: [
      { label: 'Total headcount', value: formatNumber(employees.length), note: '+56 vs Nov 2025' },
      { label: 'Hires (12 mo)', value: '108' },
      { label: 'Exits (12 mo)', value: '47' },
      { label: 'Net growth', value: '+12.0%' },
    ],
    chartTitle: 'Headcount — last 12 months',
    chart: () => <SimpleArea data={headcountTrend} x="month" dataKey="headcount" label="Headcount" domain={[440, 540]} />,
    insight: 'Headcount grew steadily (+4.7 net hires/month), driven by Technology and Sales expansion in the Riyadh and Dubai offices.',
    table: { columns: ['Department', 'Employees', 'Share'], rows: deptCounts.map(([d, n]) => [d, n, `${((n / employees.length) * 100).toFixed(1)}%`]) },
  },
  {
    id: 'attendance', title: 'Attendance', description: 'Attendance and punctuality rates across the company.', icon: Clock, tone: TONE.emerald, updated: 'today',
    headline: '95.2% this month',
    kpis: [
      { label: 'Attendance rate', value: '95.2%', note: 'October MTD' },
      { label: 'Late arrivals', value: '4.0%' },
      { label: 'Avg. hours / day', value: '7.6h' },
      { label: 'Missing punches', value: '10', note: 'today' },
    ],
    chartTitle: 'Attendance rate vs late arrivals (%)',
    chart: () => <SimpleLine data={companyAttendanceByMonth} x="month" unit="%" series={[{ key: 'rate', label: 'Attendance rate', color: C[0] }, { key: 'late', label: 'Late arrival rate', color: C[1] }]} />,
    insight: 'Attendance is at a 12-month high after flexible start times were introduced in September; late arrivals dropped by 1 point.',
    table: { columns: ['Month', 'Attendance rate', 'Late arrivals'], rows: companyAttendanceByMonth.map((m) => [m.month, `${m.rate}%`, `${m.late}%`]) },
  },
  {
    id: 'leave', title: 'Leave', description: 'Leave utilization by type and outstanding balances.', icon: CalendarDays, tone: TONE.sky, updated: 'today',
    headline: `${leaveByType.reduce((s, l) => s + l.days, 0)} days approved`,
    kpis: [
      { label: 'Approved days', value: String(leaveByType.reduce((s, l) => s + l.days, 0)), note: 'Sep–Nov 2026' },
      { label: 'On leave today', value: '27' },
      { label: 'Avg. annual balance', value: '11.4 days' },
      { label: 'Approval time', value: '6.2 hrs' },
    ],
    chartTitle: 'Approved leave days by type',
    chart: () => <SimpleBar data={leaveByType} x="type" series={[{ key: 'days', label: 'Days', color: C[0] }]} />,
    insight: 'Annual leave dominates Q4 usage; 38% of employees still hold more than 10 days and may need encouragement before the carry-over cap.',
    table: { columns: ['Leave type', 'Requests', 'Days'], rows: leaveByType.map((l) => [l.type, l.requests, l.days]) },
  },
  {
    id: 'payroll', title: 'Payroll', description: 'Payroll cost trends and departmental distribution.', icon: Wallet, tone: TONE.violet, updated: 'Oct 7',
    headline: `${formatCurrency(PAYROLL_TOTALS.gross)} / month`,
    kpis: [
      { label: 'Gross payroll', value: formatCurrency(PAYROLL_TOTALS.gross), note: 'October 2026' },
      { label: 'Net payroll', value: formatCurrency(PAYROLL_TOTALS.net) },
      { label: 'Deductions', value: formatCurrency(PAYROLL_TOTALS.deductions) },
      { label: 'Avg. cost / employee', value: formatCurrency(Math.round(PAYROLL_TOTALS.gross / PAYROLL_TOTALS.employees)) },
    ],
    chartTitle: 'Gross vs net payroll — last 6 months',
    chart: () => <SimpleBar data={payrollHistory} x="month" unit="$" series={[{ key: 'gross', label: 'Gross', color: C[0] }, { key: 'net', label: 'Net', color: C[2] }]} />,
    insight: 'Payroll cost rose 5.1% over six months, in line with headcount growth; overtime spend is concentrated in Technology and Operations.',
    table: { columns: ['Department', 'Monthly gross', 'Share'], rows: payrollDept.map((d) => [d.department, formatCurrency(d.total), `${((d.total / PAYROLL_TOTALS.gross) * 100).toFixed(1)}%`]) },
  },
  {
    id: 'recruitment', title: 'Recruitment', description: 'Pipeline conversion, open roles and time to hire.', icon: BriefcaseBusiness, tone: TONE.amber, updated: 'today',
    headline: `${jobOpenings.length} open positions`,
    kpis: [
      { label: 'Applicants', value: '248' },
      { label: 'Offer acceptance', value: '86%' },
      { label: 'Time to hire', value: '31 days' },
      { label: 'Cost per hire', value: '$1,240' },
    ],
    chartTitle: 'Recruitment funnel',
    chart: () => <SimpleBar data={recruitmentFunnel} x="stage" series={[{ key: 'value', label: 'Candidates', color: C[0] }]} />,
    insight: 'Screening-to-interview conversion (50%) is healthy; the biggest drop-off is at application screening, where 66% of applicants exit.',
    table: { columns: ['Position', 'Department', 'Applicants', 'Hiring manager'], rows: jobOpenings.map((j) => [j.title, j.department, j.applicants, j.hiringManager]) },
  },
  {
    id: 'turnover', title: 'Turnover', description: 'Attrition rates, voluntary exits and retention.', icon: TrendingDown, tone: TONE.rose, updated: 'Oct 1',
    headline: '8.2% annualized',
    kpis: [
      { label: 'Turnover rate', value: '8.2%', note: 'annualized, Q3' },
      { label: 'Voluntary', value: '6.0%' },
      { label: 'Regretted exits', value: '9' },
      { label: '1-year retention', value: '91%' },
    ],
    chartTitle: 'Quarterly turnover rate (%)',
    chart: () => <SimpleLine data={turnoverTrend} x="quarter" unit="%" domain={[4, 11]} series={[{ key: 'rate', label: 'Total turnover', color: C[0] }, { key: 'voluntary', label: 'Voluntary', color: C[1] }]} />,
    insight: 'Turnover has fallen for four consecutive quarters, from 9.6% to 8.2%, following the 2026 compensation review.',
    table: { columns: ['Quarter', 'Total turnover', 'Voluntary'], rows: turnoverTrend.map((t) => [t.quarter, `${t.rate}%`, `${t.voluntary}%`]) },
  },
  {
    id: 'performance', title: 'Performance', description: 'Rating distribution and departmental performance.', icon: Target, tone: TONE.teal, updated: 'Oct 6',
    headline: `${(employees.reduce((s, e) => s + e.rating, 0) / employees.length).toFixed(2)} avg. rating`,
    kpis: [
      { label: 'Average rating', value: (employees.reduce((s, e) => s + e.rating, 0) / employees.length).toFixed(2) },
      { label: 'Self-reviews done', value: '88%' },
      { label: 'Manager reviews', value: '64%' },
      { label: 'Calibration', value: '22%' },
    ],
    chartTitle: 'Rating distribution (employees)',
    chart: () => <SimpleBar data={ratingDistribution} x="band" series={[{ key: 'count', label: 'Employees', color: C[0] }]} />,
    insight: 'Ratings skew toward “Exceeds”; calibration sessions should confirm consistency between Technology and Sales managers.',
    table: { columns: ['Department', 'Average rating'], rows: [...departmentPerformance].sort((a, b) => b.rating - a.rating).map((d) => [d.department, d.rating.toFixed(2)]) },
  },
]

const teamLeave = initialRequests.filter((r) => r.managerId === 'EMP-1008' && r.type === 'Leave')
const teamOvertime = [
  { month: 'May', hours: 38 },
  { month: 'Jun', hours: 44 },
  { month: 'Jul', hours: 31 },
  { month: 'Aug', hours: 52 },
  { month: 'Sep', hours: 47 },
  { month: 'Oct', hours: 13 },
]

export const MANAGER_REPORTS: ReportDefinition[] = [
  {
    id: 'team-attendance', title: 'Team Attendance', description: 'Daily presence, punctuality and absences for your team.', icon: Clock, tone: TONE.emerald, updated: 'today',
    headline: '96.1% attendance',
    kpis: [
      { label: 'Attendance rate', value: '96.1%' },
      { label: 'Late arrivals (7d)', value: String(teamAttendanceTrend.reduce((s, d) => s + d.late, 0)) },
      { label: 'Absences (7d)', value: String(teamAttendanceTrend.reduce((s, d) => s + d.absent, 0)) },
      { label: 'Team size', value: String(teamMembers.length) },
    ],
    chartTitle: 'Previous 7 working days',
    chart: () => <SimpleBar data={teamAttendanceTrend} x="day" stacked series={[{ key: 'present', label: 'Present', color: C[0] }, { key: 'late', label: 'Late', color: C[3] }, { key: 'onLeave', label: 'On leave', color: C[2] }, { key: 'absent', label: 'Absent', color: C[1] }]} />,
    insight: 'Late arrivals cluster on Sundays; consider moving the weekly planning meeting to 10:00 AM.',
    table: { columns: ['Day', 'Present', 'Late', 'On leave', 'Absent'], rows: teamAttendanceTrend.map((d) => [d.day, d.present, d.late, d.onLeave, d.absent]) },
  },
  {
    id: 'team-leave', title: 'Leave Utilization', description: 'Approved and pending team leave by type.', icon: CalendarDays, tone: TONE.sky, updated: 'today',
    headline: `${teamLeave.filter((r) => r.status === 'Approved').reduce((s, r) => s + (r.days ?? 0), 0)} days approved`,
    kpis: [
      { label: 'Approved days', value: String(teamLeave.filter((r) => r.status === 'Approved').reduce((s, r) => s + (r.days ?? 0), 0)) },
      { label: 'Pending requests', value: String(teamLeave.filter((r) => r.status === 'Pending').length) },
      { label: 'Away today', value: '2' },
      { label: 'Avg. balance', value: '13.2 days' },
    ],
    chartTitle: 'Leave days by team member',
    chart: () => (
      <SimpleBar
        data={Object.entries(teamLeave.reduce<Record<string, number>>((m, r) => ({ ...m, [r.employeeName.split(' ')[0]]: (m[r.employeeName.split(' ')[0]] ?? 0) + (r.days ?? 0) }), {})).map(([name, days]) => ({ name, days }))}
        x="name"
        series={[{ key: 'days', label: 'Days', color: C[0] }]}
      />
    ),
    insight: 'Three members have upcoming leave in late October — plan sprint capacity accordingly.',
    table: { columns: ['Employee', 'Type', 'Start', 'End', 'Days', 'Status'], rows: teamLeave.map((r) => [r.employeeName, r.leaveType!, r.startDate!, r.endDate!, r.days!, r.status]) },
  },
  {
    id: 'team-performance', title: 'Team Performance', description: 'Goal achievement, ratings and productivity trends.', icon: BarChart3, tone: TONE.indigo, updated: 'Oct 6',
    headline: `${(teamMembers.reduce((s, e) => s + e.rating, 0) / teamMembers.length).toFixed(2)} avg. rating`,
    kpis: [
      { label: 'Average rating', value: (teamMembers.reduce((s, e) => s + e.rating, 0) / teamMembers.length).toFixed(2) },
      { label: 'Goal achievement', value: '85%' },
      { label: 'Productivity', value: '87%' },
      { label: 'Reviews completed', value: `${teamPerformance.filter((p) => p.reviewStatus === 'Completed').length} / ${teamPerformance.length}` },
    ],
    chartTitle: 'Team trend — last 6 months (%)',
    chart: () => <SimpleLine data={teamPerformanceTrend} x="month" unit="%" domain={[60, 100]} series={[{ key: 'goals', label: 'Goal achievement', color: C[0] }, { key: 'performance', label: 'Performance', color: C[1] }, { key: 'productivity', label: 'Productivity', color: C[2] }]} />,
    insight: 'Productivity rose 13 points since May after the CI/CD migration; mentoring goals are the main area at risk.',
    table: { columns: ['Employee', 'Rating', 'Goals', 'Productivity', 'Review'], rows: teamPerformance.map((p) => [teamMembers.find((e) => e.id === p.employeeId)!.name, p.rating.toFixed(1), `${p.goalAchievement}%`, `${p.productivity}%`, p.reviewStatus]) },
  },
  {
    id: 'team-overtime', title: 'Overtime', description: 'Overtime hours logged and approved by month.', icon: Timer, tone: TONE.amber, updated: 'today',
    headline: '225 hours YTD (6 mo)',
    kpis: [
      { label: 'Hours (6 mo)', value: String(teamOvertime.reduce((s, m) => s + m.hours, 0)) },
      { label: 'Avg. / member', value: `${(teamOvertime.reduce((s, m) => s + m.hours, 0) / 18).toFixed(1)}h` },
      { label: 'Pending claims', value: '3' },
      { label: 'Est. cost', value: '$3,380' },
    ],
    chartTitle: 'Overtime hours by month',
    chart: () => <SimpleBar data={teamOvertime} x="month" series={[{ key: 'hours', label: 'Hours', color: C[0] }]} />,
    insight: 'August spiked with the payments migration; overtime has normalized since release automation went live.',
    table: { columns: ['Month', 'Overtime hours'], rows: teamOvertime.map((m) => [m.month, m.hours]) },
  },
]
