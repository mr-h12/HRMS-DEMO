import {
  BarChart3, BriefcaseBusiness, CalendarCheck2, CalendarDays, CheckSquare, Clock, FileClock, FileText, FolderOpen, GraduationCap,
  HandCoins, LayoutDashboard, Network, Package, Receipt, Settings, Target, User, UserMinus, Users, Wallet, type LucideIcon, Inbox,
} from 'lucide-react'
import { COMPANY } from '@/data/company'
import type { CurrentUser, Role } from '@/types'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  badgeKey?: 'pendingApprovals' | 'pendingLeave' | 'myPending' | 'pendingAdvances'
  /** Section heading in the sidebar; consecutive items with the same group share one heading. */
  group?: string
}

export const ROLE_LABELS: Record<Role, string> = {
  employee: 'Employee',
  manager: 'Manager',
  hr: 'HR Admin',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  employee: 'Ahmed Hassan · Self-service',
  manager: 'Mohamed Ali · Team of 18',
  hr: 'Mariam Hassan · Company-wide',
}

export const CURRENT_USERS: Record<Role, CurrentUser> = {
  employee: { role: 'employee', employeeId: 'EMP-1042', name: 'Ahmed Hassan', title: 'Senior Sales Engineer', department: 'Sales', email: `ahmed.hassan@${COMPANY.domain}` },
  manager: { role: 'manager', employeeId: 'EMP-1008', name: 'Mohamed Ali', title: 'Sales Team Leader', department: 'Sales', email: `mohamed.ali@${COMPANY.domain}` },
  hr: { role: 'hr', employeeId: 'EMP-1003', name: 'Mariam Hassan', title: 'HR Manager', department: 'Human Resources', email: `mariam.hassan@${COMPANY.domain}` },
}

export const NAVIGATION: Record<Role, NavItem[]> = {
  employee: [
    { label: 'Dashboard', path: '/employee', icon: LayoutDashboard },
    { label: 'My Profile', path: '/employee/profile', icon: User },
    { label: 'Attendance', path: '/employee/attendance', icon: Clock },
    { label: 'My Leave', path: '/employee/leave', icon: CalendarDays },
    { label: 'My Payslips', path: '/employee/payslips', icon: Receipt },
    { label: 'My Documents', path: '/employee/documents', icon: FolderOpen },
    { label: 'Performance', path: '/employee/performance', icon: Target },
    { label: 'Requests', path: '/employee/requests', icon: Inbox, badgeKey: 'myPending' },
  ],
  manager: [
    { label: 'Dashboard', path: '/manager', icon: LayoutDashboard },
    { label: 'My Team', path: '/manager/team', icon: Users },
    { label: 'Attendance', path: '/manager/attendance', icon: Clock },
    { label: 'Leave', path: '/manager/leave', icon: CalendarDays },
    { label: 'Approvals', path: '/manager/approvals', icon: CheckSquare, badgeKey: 'pendingApprovals' },
    { label: 'Performance', path: '/manager/performance', icon: Target },
    { label: 'Reports', path: '/manager/reports', icon: BarChart3 },
    { label: 'Org Chart', path: '/manager/org-chart', icon: Network },
  ],
  hr: [
    { label: 'Dashboard', path: '/hr', icon: LayoutDashboard },
    { label: 'Employees', path: '/hr/employees', icon: Users, group: 'People' },
    { label: 'Org Chart', path: '/hr/org-chart', icon: Network, group: 'People' },
    { label: 'Contracts & Expiries', path: '/hr/contracts', icon: FileClock, group: 'People' },
    { label: 'Offboarding', path: '/hr/offboarding', icon: UserMinus, group: 'People' },
    { label: 'Attendance', path: '/hr/attendance', icon: Clock, group: 'Time & Leave' },
    { label: 'Leave', path: '/hr/leave', icon: CalendarCheck2, badgeKey: 'pendingLeave', group: 'Time & Leave' },
    { label: 'Payroll', path: '/hr/payroll', icon: Wallet, group: 'Pay & Benefits' },
    { label: 'Advances & Loans', path: '/hr/loans', icon: HandCoins, badgeKey: 'pendingAdvances', group: 'Pay & Benefits' },
    { label: 'Recruitment', path: '/hr/recruitment', icon: BriefcaseBusiness, group: 'Talent' },
    { label: 'Performance', path: '/hr/performance', icon: Target, group: 'Talent' },
    { label: 'Training', path: '/hr/training', icon: GraduationCap, group: 'Talent' },
    { label: 'Assets & Custody', path: '/hr/assets', icon: Package, group: 'Administration' },
    { label: 'Documents', path: '/hr/documents', icon: FileText, group: 'Administration' },
    { label: 'Reports', path: '/hr/reports', icon: BarChart3, group: 'Administration' },
    { label: 'Settings', path: '/hr/settings', icon: Settings, group: 'Administration' },
  ],
}

export const isRole = (value: string | undefined): value is Role => value === 'employee' || value === 'manager' || value === 'hr'
