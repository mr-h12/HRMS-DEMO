import type { PayrollEntry, PayrollStatus, Payslip } from '@/types'
import { createRng } from '@/utils/random'
import { employees, EMPLOYEE_ID } from './employees'

/* ---------------- Ahmed's payslips ---------------- */

export const payslips: Payslip[] = [
  {
    id: 'PS-2026-10',
    period: 'October 2026',
    month: '2026-10',
    payDate: '2026-10-28',
    status: 'Scheduled',
    workingDays: 21,
    paidDays: 21,
    earnings: [
      { label: 'Basic Salary', amount: 2400 },
      { label: 'Housing Allowance', amount: 480 },
      { label: 'Transportation Allowance', amount: 150 },
      { label: 'Overtime (3 hrs)', amount: 45 },
    ],
    deductions: [
      { label: 'Income Tax', amount: 248 },
      { label: 'Social Insurance (Employee)', amount: 176 },
      { label: 'Medical Insurance', amount: 32 },
    ],
  },
  {
    id: 'PS-2026-09',
    period: 'September 2026',
    month: '2026-09',
    payDate: '2026-09-28',
    status: 'Paid',
    workingDays: 22,
    paidDays: 22,
    earnings: [
      { label: 'Basic Salary', amount: 2400 },
      { label: 'Housing Allowance', amount: 480 },
      { label: 'Transportation Allowance', amount: 150 },
    ],
    deductions: [
      { label: 'Income Tax', amount: 242 },
      { label: 'Social Insurance (Employee)', amount: 176 },
      { label: 'Medical Insurance', amount: 32 },
    ],
  },
  {
    id: 'PS-2026-08',
    period: 'August 2026',
    month: '2026-08',
    payDate: '2026-08-27',
    status: 'Paid',
    workingDays: 21,
    paidDays: 20,
    earnings: [
      { label: 'Basic Salary', amount: 2400 },
      { label: 'Housing Allowance', amount: 480 },
      { label: 'Transportation Allowance', amount: 150 },
      { label: 'Overtime (4 hrs)', amount: 62 },
    ],
    deductions: [
      { label: 'Income Tax', amount: 250 },
      { label: 'Social Insurance (Employee)', amount: 176 },
      { label: 'Medical Insurance', amount: 32 },
      { label: 'Unpaid Absence (1 day)', amount: 109 },
    ],
  },
]

export const payslipTotals = (p: Payslip) => {
  const gross = p.earnings.reduce((s, l) => s + l.amount, 0)
  const deductions = p.deductions.reduce((s, l) => s + l.amount, 0)
  return { gross, deductions, net: gross - deductions }
}

/* ---------------- Company payroll — October 2026 ---------------- */

export const PAYROLL_PERIOD = 'October 2026'
export const PAYROLL_TOTALS = { gross: 842_430, deductions: 112_400, net: 730_030, employees: 524 }

function buildPayroll(): PayrollEntry[] {
  const rng = createRng(1028)
  const ahmed = payslipTotals(payslips[0])
  const entries: PayrollEntry[] = employees.map((e) => {
    if (e.id === EMPLOYEE_ID) {
      return {
        employeeId: e.id, employeeName: e.name, department: e.department, position: e.position,
        basic: 2400, allowances: 630, overtime: 45, deductions: ahmed.deductions, net: ahmed.net, status: 'Pending',
      }
    }
    const allowances = Math.round((e.basicSalary * (0.18 + rng.next() * 0.08)) / 5) * 5
    const overtime = rng.chance(0.22) ? Math.round(rng.int(20, 180) / 5) * 5 : 0
    const status: PayrollStatus = e.status === 'Notice Period' && rng.chance(0.5) ? 'On Hold' : 'Pending'
    return { employeeId: e.id, employeeName: e.name, department: e.department, position: e.position, basic: e.basicSalary, allowances, overtime, deductions: 0, net: 0, status }
  })

  // Reconcile allowances so the gross payroll equals the published October total.
  const gross = (p: PayrollEntry) => p.basic + p.allowances + p.overtime
  const others = entries.filter((p) => p.employeeId !== EMPLOYEE_ID)
  const naturalGross = entries.reduce((s, p) => s + gross(p), 0)
  const allowanceSum = others.reduce((s, p) => s + p.allowances, 0)
  const factor = 1 + (PAYROLL_TOTALS.gross - naturalGross) / allowanceSum
  others.forEach((p) => (p.allowances = Math.round(p.allowances * factor)))
  const grossDiff = PAYROLL_TOTALS.gross - entries.reduce((s, p) => s + gross(p), 0)
  others[others.length - 1].allowances += grossDiff

  // Deductions (tax + social + medical) reconciled to the published total.
  const othersGross = others.reduce((s, p) => s + gross(p), 0)
  const rate = (PAYROLL_TOTALS.deductions - ahmed.deductions) / othersGross
  others.forEach((p) => (p.deductions = Math.round(gross(p) * rate)))
  const dedDiff = PAYROLL_TOTALS.deductions - entries.reduce((s, p) => s + p.deductions, 0)
  others[others.length - 1].deductions += dedDiff
  others.forEach((p) => (p.net = gross(p) - p.deductions))
  return entries
}

export const payrollEntries: PayrollEntry[] = buildPayroll()

export const payrollHistory = [
  { month: 'May', gross: 801_200, net: 694_300 },
  { month: 'Jun', gross: 808_950, net: 700_850 },
  { month: 'Jul', gross: 815_400, net: 706_200 },
  { month: 'Aug', gross: 823_760, net: 713_480 },
  { month: 'Sep', gross: 834_110, net: 722_640 },
  { month: 'Oct', gross: 842_430, net: 730_030 },
]

export const payrollByDepartment = () => {
  const map = new Map<string, number>()
  for (const p of payrollEntries) map.set(p.department, (map.get(p.department) ?? 0) + p.basic + p.allowances + p.overtime)
  return [...map.entries()].map(([department, total]) => ({ department, total })).sort((a, b) => b.total - a.total)
}

export const NEXT_PAYROLL_DATE = '2026-10-28'
