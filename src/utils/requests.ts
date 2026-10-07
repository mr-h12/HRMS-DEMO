import { isWeekend, PUBLIC_HOLIDAYS } from '@/data/attendance'
import { employeeById } from '@/data/employees'
import type { HRRequest } from '@/types'
import { formatCurrency, formatDateRange, parseDate, toISODate } from './format'

/** Working days between two ISO dates (Sun–Thu work week, excluding public holidays). */
export function workingDaysBetween(start: string, end: string) {
  if (!start || !end || end < start) return 0
  const cursor = parseDate(start)
  const last = parseDate(end)
  let days = 0
  while (cursor <= last) {
    if (!isWeekend(cursor) && !PUBLIC_HOLIDAYS[toISODate(cursor)]) days++
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

export function requestSummary(r: HRRequest) {
  switch (r.type) {
    case 'Leave':
      return `${formatDateRange(r.startDate!, r.endDate!)} · ${r.days} day${r.days === 1 ? '' : 's'}`
    case 'Overtime':
      return `${r.hours} hours · ${formatDateRange(r.date!, r.date!)}`
    case 'Expense':
      return `${formatCurrency(r.amount ?? 0)} · ${r.category}`
    case 'HR Letter':
      return 'HR letter'
  }
}

export function requestTitle(r: HRRequest) {
  return r.type === 'Leave' ? r.leaveType! : r.type === 'HR Letter' ? r.letterType! : r.type
}

let counter = 2049
export function newRequestBase(employeeId: string): Pick<HRRequest, 'id' | 'employeeId' | 'employeeName' | 'department' | 'managerId' | 'managerName' | 'submittedAt' | 'status'> {
  const emp = employeeById(employeeId)!
  return {
    id: `REQ-${counter++}`,
    employeeId,
    employeeName: emp.name,
    department: emp.department,
    managerId: emp.managerId,
    managerName: emp.managerName,
    submittedAt: new Date().toISOString(),
    status: 'Pending',
  }
}
