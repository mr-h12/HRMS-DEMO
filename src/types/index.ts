export type Role = 'employee' | 'manager' | 'hr'

export type Department =
  | 'Technology'
  | 'Sales'
  | 'Operations'
  | 'Finance'
  | 'Human Resources'
  | 'Marketing'
  | 'Legal'
  | 'Customer Success'

export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Notice Period'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern'
export type Location = 'Cairo HQ' | 'Dubai' | 'Riyadh' | 'Remote'
export type PerformanceBand = 'Exceptional' | 'Exceeds' | 'Meets' | 'Developing'

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: Department
  /** Sub-unit inside a department, e.g. "Backend" inside Technology. */
  team: string
  location: Location
  employmentType: EmploymentType
  managerId: string | null
  managerName: string
  joiningDate: string
  status: EmployeeStatus
  /** Monthly basic salary in USD. */
  basicSalary: number
  /** Performance rating on a 1–5 scale. */
  rating: number
  /** Attendance rate over the trailing 30 days (%). */
  attendanceRate: number
  gender: 'Male' | 'Female'
  dateOfBirth: string
  nationality: string
}

export interface CurrentUser {
  role: Role
  employeeId: string
  name: string
  title: string
  department: Department
  email: string
}

/* ---------------- Attendance ---------------- */

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Overtime' | 'On Leave' | 'Weekend' | 'Holiday' | 'Missing Punch'

export interface AttendanceDay {
  date: string
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  hours: number
}

export interface DailyAttendanceRecord {
  employeeId: string
  date: string
  status: Exclude<AttendanceStatus, 'Weekend' | 'Holiday'>
  checkIn?: string
  checkOut?: string
  hours: number
}

export interface AttendanceTrendPoint {
  day: string
  present: number
  late: number
  absent: number
  onLeave: number
}

/* ---------------- Requests & Leave ---------------- */

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected'
export type RequestType = 'Leave' | 'Overtime' | 'Expense' | 'HR Letter'
export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Emergency Leave' | 'Unpaid Leave' | 'Parental Leave'

export interface HRRequest {
  id: string
  type: RequestType
  employeeId: string
  employeeName: string
  department: Department
  managerId: string | null
  managerName: string
  submittedAt: string
  status: RequestStatus
  reason: string
  // Leave
  leaveType?: LeaveType
  startDate?: string
  endDate?: string
  days?: number
  attachment?: string
  // Overtime
  hours?: number
  date?: string
  // Expense
  amount?: number
  category?: string
  // HR letter
  letterType?: string
  decidedAt?: string
  decidedBy?: string
}

export interface LeaveBalance {
  type: LeaveType
  used: number
  total: number
  /** Tailwind class for the progress indicator. */
  color: string
}

export interface TeamLeaveEntry {
  employeeId: string
  employeeName: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  status: RequestStatus
}

/* ---------------- Payroll ---------------- */

export interface PayslipLine {
  label: string
  amount: number
}

export interface Payslip {
  id: string
  period: string
  month: string
  payDate: string
  status: 'Paid' | 'Scheduled'
  earnings: PayslipLine[]
  deductions: PayslipLine[]
  workingDays: number
  paidDays: number
}

export type PayrollStatus = 'Processed' | 'Pending' | 'On Hold'

export interface PayrollEntry {
  employeeId: string
  employeeName: string
  department: Department
  position: string
  basic: number
  allowances: number
  overtime: number
  deductions: number
  net: number
  status: PayrollStatus
}

/* ---------------- Recruitment ---------------- */

export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired'

export interface JobOpening {
  id: string
  title: string
  department: Department
  location: Location
  employmentType: EmploymentType
  applicants: number
  postedDate: string
  hiringManager: string
  priority: 'High' | 'Medium' | 'Low'
  salaryRange: string
}

export interface Candidate {
  id: string
  name: string
  jobId: string
  stage: CandidateStage
  email: string
  experience: string
  currentCompany: string
  rating: number
  appliedDate: string
  source: 'LinkedIn' | 'Referral' | 'Careers Page' | 'Wuzzuf' | 'Bayt' | 'Agency'
}

/* ---------------- Performance ---------------- */

export interface KPI {
  name: string
  target: number
  actual: number
  unit: string
  trend: 'up' | 'down' | 'flat'
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  dueDate: string
  status: 'On Track' | 'At Risk' | 'Completed' | 'Behind'
  weight: number
}

export interface FeedbackEntry {
  id: string
  author: string
  authorTitle: string
  date: string
  rating: number
  comment: string
  cycle: string
}

/* ---------------- Notifications & activity ---------------- */

export type NotificationKind = 'request' | 'approval' | 'payroll' | 'document' | 'attendance' | 'recruitment' | 'system' | 'performance'

export interface AppNotification {
  id: string
  role: Role
  kind: NotificationKind
  title: string
  message: string
  createdAt: string
  read: boolean
  link?: string
}

export interface ActivityItem {
  id: string
  actor: string
  action: string
  target: string
  time: string
  kind: NotificationKind
}

/* ---------------- Documents ---------------- */

export interface EmployeeDocument {
  id: string
  name: string
  category: 'Contract' | 'Identity' | 'Certificate' | 'Payroll' | 'Policy' | 'Letter' | 'Medical'
  fileType: 'PDF' | 'DOCX' | 'JPG' | 'PNG'
  size: string
  uploadedAt: string
  expiresAt?: string
  owner?: string
  status?: 'Valid' | 'Expiring Soon' | 'Expired'
}

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  time?: string
  kind: 'review' | 'meeting' | 'holiday' | 'training' | 'birthday'
  description: string
}
