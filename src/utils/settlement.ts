import type { Employee, OffboardingCase } from '@/types'
import { parseDate } from './format'

export interface Settlement {
  serviceYears: number
  dailyRate: number
  salaryDays: number
  salaryDue: number
  leaveEncashment: number
  gratuity: number
  loanRecovery: number
  net: number
}

/**
 * Final settlement for a leaving employee (demo figures).
 * - Daily rate = basic salary / 30.
 * - End-of-service gratuity per company policy: half a month for each of the first five years, a full month for each year after.
 * - Outstanding loans and advances are recovered from the payout.
 */
export function calculateSettlement(emp: Employee, c: OffboardingCase, outstandingLoans: number): Settlement {
  const joined = parseDate(emp.joiningDate)
  const last = parseDate(c.lastWorkingDay)
  const serviceYears = Math.max(0, (last.getTime() - joined.getTime()) / (365.25 * 86_400_000))
  const dailyRate = emp.basicSalary / 30
  const salaryDays = last.getDate()
  const salaryDue = Math.round(dailyRate * salaryDays)
  const leaveEncashment = Math.round(dailyRate * c.unusedLeaveDays)
  const firstFive = Math.min(serviceYears, 5)
  const after = Math.max(serviceYears - 5, 0)
  // Terminations for cause forfeit the policy gratuity.
  const gratuity = c.type === 'Termination' ? 0 : Math.round(emp.basicSalary * (firstFive * 0.5 + after))
  const net = salaryDue + leaveEncashment + gratuity - outstandingLoans
  return { serviceYears, dailyRate, salaryDays, salaryDue, leaveEncashment, gratuity, loanRecovery: outstandingLoans, net }
}
