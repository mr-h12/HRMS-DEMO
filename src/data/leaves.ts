import type { HRRequest, LeaveBalance, LeaveType, RequestStatus } from '@/types'
import { createRng } from '@/utils/random'
import { employeeById, employees, MANAGER_ID } from './employees'

export const LEAVE_TYPES: LeaveType[] = ['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Unpaid Leave', 'Parental Leave']

/** Ahmed's entitlement for 2026. Remaining = total - used. */
export const ahmedLeaveBalances: LeaveBalance[] = [
  { type: 'Annual Leave', used: 7, total: 21, color: 'bg-primary' },
  { type: 'Sick Leave', used: 3, total: 10, color: 'bg-sky-500' },
  { type: 'Emergency Leave', used: 1, total: 3, color: 'bg-amber-500' },
]

export const LEAVE_POLICIES = [
  { type: 'Annual Leave', days: 21, carryOver: 5, description: 'Accrues 1.75 days per month. Up to 5 days carry over to Q1.' },
  { type: 'Sick Leave', days: 10, carryOver: 0, description: 'Medical certificate required for absences longer than 2 days.' },
  { type: 'Emergency Leave', days: 3, carryOver: 0, description: 'For urgent family matters. Manager approval within 24 hours.' },
  { type: 'Parental Leave', days: 90, carryOver: 0, description: 'Fully paid for primary caregivers; 10 days for secondary caregivers.' },
  { type: 'Unpaid Leave', days: 30, carryOver: 0, description: 'Requires HR and department head approval.' },
]

function req(partial: Omit<HRRequest, 'employeeName' | 'department' | 'managerId' | 'managerName'>): HRRequest {
  const emp = employeeById(partial.employeeId)!
  return {
    employeeName: emp.name,
    department: emp.department,
    managerId: emp.managerId,
    managerName: emp.managerName,
    ...partial,
  }
}

/** Requests from Mohamed Ali's team (incl. Ahmed's own history). */
const teamRequests: HRRequest[] = [
  // Ahmed Hassan
  req({ id: 'REQ-2041', type: 'Leave', employeeId: 'EMP-1042', leaveType: 'Annual Leave', startDate: '2026-10-12', endDate: '2026-10-14', days: 3, submittedAt: '2026-10-05T10:24:00', status: 'Pending', reason: 'Family trip to Alexandria — handover notes shared with Hossam.' }),
  req({ id: 'REQ-2038', type: 'Expense', employeeId: 'EMP-1042', amount: 300, category: 'Training & Certification', submittedAt: '2026-10-03T15:12:00', status: 'Pending', reason: 'AWS Solutions Architect – Associate exam fee.' }),
  req({ id: 'REQ-2032', type: 'HR Letter', employeeId: 'EMP-1042', letterType: 'Salary Certificate', submittedAt: '2026-09-28T09:05:00', status: 'Approved', decidedAt: '2026-09-30T11:40:00', decidedBy: 'Mariam Hassan', reason: 'Required by CIB for a personal loan application.' }),
  req({ id: 'REQ-2019', type: 'Overtime', employeeId: 'EMP-1042', hours: 3, date: '2026-09-22', submittedAt: '2026-09-23T08:40:00', status: 'Approved', decidedAt: '2026-09-23T13:02:00', decidedBy: 'Mohamed Ali', reason: 'Payments service migration cut-over.' }),
  req({ id: 'REQ-2011', type: 'Leave', employeeId: 'EMP-1042', leaveType: 'Sick Leave', startDate: '2026-09-15', endDate: '2026-09-16', days: 2, submittedAt: '2026-09-15T07:55:00', status: 'Approved', decidedAt: '2026-09-15T09:30:00', decidedBy: 'Mohamed Ali', reason: 'Seasonal flu — medical certificate attached.', attachment: 'medical-certificate.pdf' }),
  req({ id: 'REQ-1987', type: 'Expense', employeeId: 'EMP-1042', amount: 64, category: 'Transportation', submittedAt: '2026-08-26T18:20:00', status: 'Rejected', decidedAt: '2026-08-27T10:10:00', decidedBy: 'Mohamed Ali', reason: 'Ride-hailing to client office — receipt missing.' }),
  req({ id: 'REQ-1940', type: 'Leave', employeeId: 'EMP-1042', leaveType: 'Annual Leave', startDate: '2026-07-20', endDate: '2026-07-23', days: 4, submittedAt: '2026-07-01T12:00:00', status: 'Approved', decidedAt: '2026-07-01T16:45:00', decidedBy: 'Mohamed Ali', reason: 'Summer vacation.' }),
  req({ id: 'REQ-1851', type: 'Leave', employeeId: 'EMP-1042', leaveType: 'Emergency Leave', startDate: '2026-05-26', endDate: '2026-05-26', days: 1, submittedAt: '2026-05-26T07:10:00', status: 'Approved', decidedAt: '2026-05-26T08:00:00', decidedBy: 'Mohamed Ali', reason: 'Family emergency.' }),
  req({ id: 'REQ-1702', type: 'Leave', employeeId: 'EMP-1042', leaveType: 'Annual Leave', startDate: '2026-02-15', endDate: '2026-02-17', days: 3, submittedAt: '2026-02-02T10:00:00', status: 'Approved', decidedAt: '2026-02-02T14:20:00', decidedBy: 'Mohamed Ali', reason: 'Personal matters.' }),
  req({ id: 'REQ-1688', type: 'Leave', employeeId: 'EMP-1042', leaveType: 'Sick Leave', startDate: '2026-04-08', endDate: '2026-04-08', days: 1, submittedAt: '2026-04-08T07:30:00', status: 'Approved', decidedAt: '2026-04-08T09:00:00', decidedBy: 'Mohamed Ali', reason: 'Dental procedure.' }),

  // Team — pending approvals for Mohamed Ali
  req({ id: 'REQ-2045', type: 'Overtime', employeeId: 'EMP-1057', hours: 4, date: '2026-10-05', submittedAt: '2026-10-06T09:15:00', status: 'Pending', reason: 'Checkout redesign release — QA fixes after hours.' }),
  req({ id: 'REQ-2044', type: 'Expense', employeeId: 'EMP-1063', amount: 120, category: 'Meals', submittedAt: '2026-10-06T11:30:00', status: 'Pending', reason: 'Team dinner during the Oct 3 production incident response.' }),
  req({ id: 'REQ-2046', type: 'Leave', employeeId: 'EMP-1059', leaveType: 'Annual Leave', startDate: '2026-10-19', endDate: '2026-10-22', days: 4, submittedAt: '2026-10-06T14:02:00', status: 'Pending', reason: 'Visiting family in Aswan.' }),
  req({ id: 'REQ-2047', type: 'Leave', employeeId: 'EMP-1066', leaveType: 'Emergency Leave', startDate: '2026-10-11', endDate: '2026-10-11', days: 1, submittedAt: '2026-10-07T07:48:00', status: 'Pending', reason: 'Need to accompany my mother to a hospital appointment.' }),
  req({ id: 'REQ-2043', type: 'Overtime', employeeId: 'EMP-1063', hours: 6, date: '2026-10-03', submittedAt: '2026-10-04T08:20:00', status: 'Pending', reason: 'Weekend Kubernetes cluster upgrade (Saturday).' }),
  req({ id: 'REQ-2042', type: 'Expense', employeeId: 'EMP-1024', amount: 450, category: 'Conferences', submittedAt: '2026-10-05T16:40:00', status: 'Pending', reason: 'GITEX Global 2026 conference pass.' }),
  req({ id: 'REQ-2040', type: 'HR Letter', employeeId: 'EMP-1051', letterType: 'Salary Certificate', submittedAt: '2026-10-05T09:30:00', status: 'Pending', reason: 'Apartment rental contract.' }),
  req({ id: 'REQ-2039', type: 'HR Letter', employeeId: 'EMP-1033', letterType: 'Embassy Letter', submittedAt: '2026-10-04T13:10:00', status: 'Pending', reason: 'Schengen visa application — Germany, Nov 2026.' }),
  req({ id: 'REQ-2048', type: 'Expense', employeeId: 'EMP-1074', amount: 89, category: 'Books & Learning', submittedAt: '2026-10-07T08:55:00', status: 'Pending', reason: '“Designing Data-Intensive Applications” + online course.' }),
  req({ id: 'REQ-2036', type: 'Overtime', employeeId: 'EMP-1021', hours: 3, date: '2026-10-01', submittedAt: '2026-10-02T09:00:00', status: 'Pending', reason: 'Incident post-mortem and hotfix deployment.' }),

  // Team — decided / upcoming
  req({ id: 'REQ-2020', type: 'Leave', employeeId: 'EMP-1085', leaveType: 'Annual Leave', startDate: '2026-10-01', endDate: '2026-10-15', days: 10, submittedAt: '2026-09-10T10:00:00', status: 'Approved', decidedAt: '2026-09-10T15:00:00', decidedBy: 'Mohamed Ali', reason: 'Wedding and honeymoon.' }),
  req({ id: 'REQ-2035', type: 'Leave', employeeId: 'EMP-1054', leaveType: 'Sick Leave', startDate: '2026-10-05', endDate: '2026-10-08', days: 4, submittedAt: '2026-10-05T07:20:00', status: 'Approved', decidedAt: '2026-10-05T08:10:00', decidedBy: 'Mohamed Ali', reason: 'Recovering from minor surgery.', attachment: 'hospital-report.pdf' }),
  req({ id: 'REQ-2030', type: 'Leave', employeeId: 'EMP-1036', leaveType: 'Annual Leave', startDate: '2026-10-25', endDate: '2026-10-28', days: 4, submittedAt: '2026-09-27T11:00:00', status: 'Approved', decidedAt: '2026-09-28T09:00:00', decidedBy: 'Mohamed Ali', reason: 'Annual vacation.' }),
  req({ id: 'REQ-2031', type: 'Leave', employeeId: 'EMP-1024', leaveType: 'Annual Leave', startDate: '2026-11-01', endDate: '2026-11-05', days: 5, submittedAt: '2026-09-28T10:30:00', status: 'Approved', decidedAt: '2026-09-29T09:00:00', decidedBy: 'Mohamed Ali', reason: 'Travel.' }),
  req({ id: 'REQ-2025', type: 'Expense', employeeId: 'EMP-1057', amount: 35, category: 'Software', submittedAt: '2026-09-25T10:00:00', status: 'Approved', decidedAt: '2026-09-25T15:00:00', decidedBy: 'Mohamed Ali', reason: 'Figma plugin license.' }),
  req({ id: 'REQ-2022', type: 'Overtime', employeeId: 'EMP-1048', hours: 5, date: '2026-09-24', submittedAt: '2026-09-25T09:00:00', status: 'Rejected', decidedAt: '2026-09-25T12:00:00', decidedBy: 'Mohamed Ali', reason: 'Refactoring work — not pre-approved.' }),
]

const OTHER_REASONS: Record<LeaveType, string[]> = {
  'Annual Leave': ['Family vacation.', 'Travel abroad.', 'Personal time off.', 'Attending a family wedding.', 'Moving to a new apartment.'],
  'Sick Leave': ['Flu symptoms.', 'Medical appointment.', 'Recovering from food poisoning.', 'Back pain — doctor’s advice.'],
  'Emergency Leave': ['Family emergency.', 'Urgent home repair.', 'Family member hospitalized.'],
  'Unpaid Leave': ['Extended personal travel.', 'Completing master’s thesis.'],
  'Parental Leave': ['Birth of my child.', 'Newborn care.'],
}

/** Company-wide leave requests for HR (other departments). */
function buildCompanyLeaves(): HRRequest[] {
  const rng = createRng(4242)
  const pool = employees.filter((e) => e.managerId !== MANAGER_ID && e.id !== 'EMP-1001')
  const result: HRRequest[] = []
  const starts = ['2026-09-21', '2026-09-28', '2026-10-01', '2026-10-04', '2026-10-07', '2026-10-08', '2026-10-11', '2026-10-13', '2026-10-15', '2026-10-18', '2026-10-20', '2026-10-25', '2026-11-01', '2026-11-08']
  for (let i = 0; i < 38; i++) {
    const emp = pool[rng.int(0, pool.length - 1)]
    const type: LeaveType = rng.pick(['Annual Leave', 'Annual Leave', 'Annual Leave', 'Sick Leave', 'Sick Leave', 'Emergency Leave', 'Unpaid Leave', 'Parental Leave'] as const)
    const start = rng.pick(starts)
    const days = type === 'Parental Leave' ? 10 : type === 'Annual Leave' ? rng.int(1, 6) : rng.int(1, 3)
    const [y, m, d] = start.split('-').map(Number)
    const end = new Date(y, m - 1, d + days - 1 + Math.floor(days / 5) * 2)
    const status: RequestStatus = start >= '2026-10-08' ? (rng.chance(0.55) ? 'Pending' : rng.chance(0.85) ? 'Approved' : 'Rejected') : rng.chance(0.82) ? 'Approved' : 'Rejected'
    const submitted = new Date(y, m - 1, d - rng.int(2, 12), rng.int(8, 17), rng.int(0, 59))
    result.push(
      req({
        id: `REQ-${1501 + i * 3}`,
        type: 'Leave',
        employeeId: emp.id,
        leaveType: type,
        startDate: start,
        endDate: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`,
        days,
        submittedAt: submitted.toISOString(),
        status,
        reason: rng.pick(OTHER_REASONS[type]),
        decidedAt: status === 'Pending' ? undefined : new Date(submitted.getTime() + 86400000).toISOString(),
        decidedBy: status === 'Pending' ? undefined : emp.managerName,
      }),
    )
  }
  return result
}

export const initialRequests: HRRequest[] = [...teamRequests, ...buildCompanyLeaves()].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))

export const HR_LETTER_TYPES = ['Salary Certificate', 'Employment Verification', 'Experience Letter', 'Embassy Letter', 'No Objection Certificate']
export const EXPENSE_CATEGORIES = ['Travel', 'Transportation', 'Meals', 'Training & Certification', 'Conferences', 'Software', 'Books & Learning', 'Office Supplies']
