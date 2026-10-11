import type { Loan } from '@/types'
import { EMPLOYEE_ID, employees } from './employees'

/** Seeded advances and loans; approved "Salary Advance" requests are added on top in the Loans page. */
const pick = (i: number) => employees.filter((e) => e.status === 'Active' && e.id !== EMPLOYEE_ID)[i * 17 + 3]
const leaving = employees.filter((e) => e.status === 'Notice Period')

const SEED: Omit<Loan, 'id'>[] = [
  { employeeId: pick(0).id, type: 'Personal Loan', amount: 60000, installments: 12, paidInstallments: 7, startMonth: '2026-03', reason: 'Home renovation.', status: 'Active' },
  { employeeId: pick(1).id, type: 'Salary Advance', amount: 15000, installments: 3, paidInstallments: 1, startMonth: '2026-09', reason: 'Children’s school fees.', status: 'Active' },
  { employeeId: pick(2).id, type: 'Salary Advance', amount: 8000, installments: 2, paidInstallments: 1, startMonth: '2026-09', reason: 'Medical expenses.', status: 'Active' },
  { employeeId: pick(3).id, type: 'Personal Loan', amount: 40000, installments: 10, paidInstallments: 2, startMonth: '2026-08', reason: 'Wedding expenses.', status: 'Active' },
  { employeeId: pick(4).id, type: 'Salary Advance', amount: 12000, installments: 4, paidInstallments: 3, startMonth: '2026-06', reason: 'Car repair.', status: 'Active' },
  { employeeId: pick(5).id, type: 'Salary Advance', amount: 6000, installments: 2, paidInstallments: 0, startMonth: '2026-10', reason: 'Family emergency.', status: 'Active' },
  { employeeId: pick(6).id, type: 'Personal Loan', amount: 30000, installments: 6, paidInstallments: 6, startMonth: '2026-03', reason: 'Moving to a new apartment.', status: 'Settled' },
  { employeeId: pick(7).id, type: 'Salary Advance', amount: 10000, installments: 5, paidInstallments: 5, startMonth: '2026-04', reason: 'Medical expenses.', status: 'Settled' },
  // Employees on notice still owe money, which the final settlement recovers.
  { employeeId: leaving[0].id, type: 'Personal Loan', amount: 36000, installments: 12, paidInstallments: 8, startMonth: '2026-01', reason: 'Home renovation.', status: 'Active' },
  { employeeId: leaving[2].id, type: 'Salary Advance', amount: 9000, installments: 3, paidInstallments: 1, startMonth: '2026-08', reason: 'Children’s school fees.', status: 'Active' },
]

export const initialLoans: Loan[] = SEED.map((l, i) => ({ ...l, id: `LN-${String(301 + i)}` }))

export const installmentAmount = (l: Pick<Loan, 'amount' | 'installments'>) => Math.round(l.amount / l.installments)
export const outstanding = (l: Loan) => (l.status === 'Settled' ? 0 : l.amount - installmentAmount(l) * l.paidInstallments)

/** Outstanding balance across all active loans of one employee. */
export const outstandingFor = (employeeId: string, loans: Loan[] = initialLoans) =>
  loans.filter((l) => l.employeeId === employeeId && l.status === 'Active').reduce((s, l) => s + outstanding(l), 0)
