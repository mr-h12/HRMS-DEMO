import type { AttendanceDay, AttendanceTrendPoint, DailyAttendanceRecord } from '@/types'
import { toISODate } from '@/utils/format'
import { createRng } from '@/utils/random'
import { employees, EMPLOYEE_ID, MANAGER_ID } from './employees'

/** The demo is anchored on Wednesday, October 7, 2026. */
export const DEMO_TODAY = '2026-10-07'

/** Company work week is Sunday–Thursday (Friday/Saturday weekend). */
export const isWeekend = (d: Date) => d.getDay() === 5 || d.getDay() === 6

export const PUBLIC_HOLIDAYS: Record<string, string> = {
  '2026-08-27': 'Prophet’s Birthday (observed)',
  '2026-10-06': 'Armed Forces Day',
  '2026-10-29': 'Northwind Founders’ Day',
}

/* ---------------- Employee (Ahmed) attendance ---------------- */

export const todayAttendance = {
  checkIn: '08:57 AM',
  breakStart: '01:00 PM',
  breakDuration: '60 min',
  expectedCheckout: '05:00 PM',
  shift: '09:00 AM – 05:00 PM',
  location: 'Cairo HQ — Tower B',
}

const AHMED_OVERRIDES: Record<string, Partial<AttendanceDay>> = {
  '2026-08-11': { status: 'Absent', hours: 0 },
  '2026-08-18': { status: 'Late', checkIn: '09:34 AM', checkOut: '05:40 PM', hours: 7.1 },
  '2026-08-24': { status: 'Overtime', checkIn: '08:52 AM', checkOut: '08:10 PM', hours: 10.3 },
  '2026-09-03': { status: 'Overtime', checkIn: '08:49 AM', checkOut: '07:45 PM', hours: 9.9 },
  '2026-09-08': { status: 'Late', checkIn: '09:21 AM', checkOut: '05:30 PM', hours: 7.2 },
  '2026-09-15': { status: 'On Leave', hours: 0 },
  '2026-09-16': { status: 'On Leave', hours: 0 },
  '2026-09-22': { status: 'Overtime', checkIn: '08:55 AM', checkOut: '07:20 PM', hours: 9.4 },
  '2026-09-29': { status: 'Late', checkIn: '09:18 AM', checkOut: '05:25 PM', hours: 7.1 },
  '2026-10-01': { status: 'Overtime', checkIn: '08:51 AM', checkOut: '07:05 PM', hours: 9.2 },
  '2026-10-04': { status: 'Late', checkIn: '09:16 AM', checkOut: '05:20 PM', hours: 7.1 },
}

function buildMonth(year: number, month: number): AttendanceDay[] {
  const days: AttendanceDay[] = []
  const rng = createRng(year * 100 + month)
  const last = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= last; d++) {
    const date = new Date(year, month, d)
    const iso = toISODate(date)
    if (iso > DEMO_TODAY) break
    if (isWeekend(date)) {
      days.push({ date: iso, status: 'Weekend', hours: 0 })
      continue
    }
    if (PUBLIC_HOLIDAYS[iso]) {
      days.push({ date: iso, status: 'Holiday', hours: 0 })
      continue
    }
    if (iso === DEMO_TODAY) {
      days.push({ date: iso, status: 'Present', checkIn: '08:57 AM', hours: 0 })
      continue
    }
    const inMin = rng.int(48, 59)
    const outMin = rng.int(2, 25)
    const base: AttendanceDay = {
      date: iso,
      status: 'Present',
      checkIn: `08:${inMin} AM`,
      checkOut: `05:${String(outMin).padStart(2, '0')} PM`,
      hours: Math.round((8 + (outMin + 60 - inMin) / 60 - 1) * 10) / 10,
    }
    days.push({ ...base, ...AHMED_OVERRIDES[iso] })
  }
  return days
}

/** Months available in the attendance calendar (Aug–Oct 2026). */
export const ahmedAttendance: Record<string, AttendanceDay[]> = {
  '2026-08': buildMonth(2026, 7),
  '2026-09': buildMonth(2026, 8),
  '2026-10': buildMonth(2026, 9),
}

export function summarizeMonth(days: AttendanceDay[]) {
  const workdays = days.filter((d) => !['Weekend', 'Holiday'].includes(d.status))
  const present = workdays.filter((d) => ['Present', 'Late', 'Overtime'].includes(d.status)).length
  const overtimeHours = days.reduce((sum, d) => sum + (d.status === 'Overtime' ? Math.max(0, d.hours - 8) : 0), 0)
  return {
    workdays: workdays.length,
    present,
    absent: workdays.filter((d) => d.status === 'Absent').length,
    late: workdays.filter((d) => d.status === 'Late').length,
    overtime: workdays.filter((d) => d.status === 'Overtime').length,
    overtimeHours: Math.round(overtimeHours * 10) / 10,
    onLeave: workdays.filter((d) => d.status === 'On Leave').length,
    hours: Math.round(days.reduce((sum, d) => sum + d.hours, 0) * 10) / 10,
    rate: workdays.length ? Math.round((present / workdays.filter((d) => d.status !== 'On Leave').length) * 100) : 0,
  }
}

/** Trailing 30-day attendance shown on Ahmed's dashboard KPI. */
export const ahmedAttendanceRate = 96

/* ---------------- Company / team daily attendance ---------------- */

/** Curated statuses for Mohamed Ali's team today. */
const TEAM_TODAY: Record<string, Partial<DailyAttendanceRecord>> = {
  'EMP-1042': { status: 'Present', checkIn: '08:57 AM' },
  'EMP-1048': { status: 'Late', checkIn: '09:24 AM' },
  'EMP-1078': { status: 'Late', checkIn: '09:41 AM' },
  'EMP-1085': { status: 'On Leave' },
  'EMP-1054': { status: 'On Leave' },
}

function minutesToTime(m: number) {
  const h = Math.floor(m / 60)
  const min = m % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h > 12 ? h - 12 : h
  return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${suffix}`
}

/** Team members whose current leave started recently (matches their approved leave requests). */
const LEAVE_START: Record<string, string> = { 'EMP-1085': '2026-10-01', 'EMP-1054': '2026-10-05' }

const cache = new Map<string, DailyAttendanceRecord[]>()

/** Deterministic attendance for every employee on a given working day. */
export function getDailyAttendance(date: string): DailyAttendanceRecord[] {
  const cached = cache.get(date)
  if (cached) return cached
  const seed = Number(date.replace(/-/g, ''))
  const rng = createRng(seed)
  const isToday = date === DEMO_TODAY
  const records = employees.map<DailyAttendanceRecord>((e) => {
    if (e.id === EMPLOYEE_ID) {
      const own = ahmedAttendance[date.slice(0, 7)]?.find((d) => d.date === date)
      if (own && own.status !== 'Weekend' && own.status !== 'Holiday') {
        rng.next()
        return { employeeId: e.id, date, status: own.status, checkIn: own.checkIn, checkOut: own.checkOut, hours: own.hours }
      }
    }
    if (e.status === 'On Leave' && date >= (LEAVE_START[e.id] ?? '0000')) return { employeeId: e.id, date, status: 'On Leave', hours: 0 }
    const roll = rng.next()
    const inMin = 8 * 60 + 40 + rng.int(0, 19)
    if (roll < 0.022) return { employeeId: e.id, date, status: 'Absent', hours: 0 }
    if (roll < 0.075) {
      const lateIn = 9 * 60 + 10 + rng.int(0, 50)
      return {
        employeeId: e.id,
        date,
        status: 'Late',
        checkIn: minutesToTime(lateIn),
        checkOut: isToday ? undefined : minutesToTime(17 * 60 + rng.int(0, 40)),
        hours: isToday ? 0 : Math.round(((17 * 60 + 20 - lateIn) / 60 - 1) * 10) / 10,
      }
    }
    if (roll < 0.09) return { employeeId: e.id, date, status: 'Missing Punch', checkIn: minutesToTime(inMin), hours: 0 }
    if (roll < 0.15) {
      const out = 18 * 60 + 30 + rng.int(0, 120)
      // Today: pre-approved overtime shift still in progress.
      if (isToday) return { employeeId: e.id, date, status: 'Overtime', checkIn: minutesToTime(inMin), hours: 0 }
      return { employeeId: e.id, date, status: 'Overtime', checkIn: minutesToTime(inMin), checkOut: minutesToTime(out), hours: Math.round(((out - inMin) / 60 - 1) * 10) / 10 }
    }
    const out = 17 * 60 + rng.int(0, 30)
    return {
      employeeId: e.id,
      date,
      status: 'Present',
      checkIn: minutesToTime(inMin),
      checkOut: isToday ? undefined : minutesToTime(out),
      hours: isToday ? 0 : Math.round(((out - inMin) / 60 - 1) * 10) / 10,
    }
  })
  if (isToday) {
    for (const r of records) {
      const emp = employees.find((e) => e.id === r.employeeId)
      if (emp?.managerId !== MANAGER_ID) continue
      const override = TEAM_TODAY[r.employeeId]
      if (override) Object.assign(r, { checkIn: undefined }, override, { hours: 0 })
      else if (r.status !== 'Present') Object.assign(r, { status: 'Present', checkIn: minutesToTime(8 * 60 + 45 + (Number(r.employeeId.slice(-2)) % 14)), checkOut: undefined, hours: 0 })
    }
  }
  cache.set(date, records)
  return records
}

/** Last N working days ending at (and including) the demo day. */
export function lastWorkingDays(count: number, end = DEMO_TODAY): string[] {
  const result: string[] = []
  const [y, m, d] = end.split('-').map(Number)
  const cursor = new Date(y, m - 1, d)
  while (result.length < count) {
    const iso = toISODate(cursor)
    if (!isWeekend(cursor) && !PUBLIC_HOLIDAYS[iso]) result.unshift(iso)
    cursor.setDate(cursor.getDate() - 1)
  }
  return result
}

/** Team attendance (Mohamed Ali's 18 reports) over the previous 7 working days, derived from daily records. */
export const teamAttendanceTrend: AttendanceTrendPoint[] = lastWorkingDays(7).map((date) => {
  const ids = new Set(employees.filter((e) => e.managerId === MANAGER_ID).map((e) => e.id))
  const recs = getDailyAttendance(date).filter((r) => ids.has(r.employeeId))
  const count = (...st: string[]) => recs.filter((r) => st.includes(r.status)).length
  return {
    day: new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    present: count('Present', 'Overtime', 'Missing Punch'),
    late: count('Late'),
    absent: count('Absent'),
    onLeave: count('On Leave'),
  }
})

/** Company-wide attendance rate by month for HR dashboards & reports. */
export const companyAttendanceByMonth = [
  { month: 'Nov', rate: 94.1, late: 4.8 },
  { month: 'Dec', rate: 92.6, late: 5.4 },
  { month: 'Jan', rate: 93.8, late: 5.1 },
  { month: 'Feb', rate: 94.6, late: 4.6 },
  { month: 'Mar', rate: 91.9, late: 6.2 },
  { month: 'Apr', rate: 93.2, late: 5.0 },
  { month: 'May', rate: 94.4, late: 4.4 },
  { month: 'Jun', rate: 93.7, late: 4.9 },
  { month: 'Jul', rate: 92.8, late: 5.3 },
  { month: 'Aug', rate: 93.5, late: 5.0 },
  { month: 'Sep', rate: 94.9, late: 4.2 },
  { month: 'Oct', rate: 95.2, late: 4.0 },
]
