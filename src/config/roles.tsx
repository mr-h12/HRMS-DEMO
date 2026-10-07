import {
  BarChart3, BriefcaseBusiness, CalendarCheck2, CalendarDays, CheckSquare, Clock, FileText, FolderOpen, GraduationCap,
  LayoutDashboard, Receipt, Settings, Target, User, Users, Wallet, type LucideIcon, Inbox,
} from 'lucide-react'
import type { CurrentUser, Role } from '@/types'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  badgeKey?: 'pendingApprovals' | 'pendingLeave' | 'myPending'
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
  employee: { role: 'employee', employeeId: 'EMP-1042', name: 'Ahmed Hassan', title: 'Senior Software Engineer', department: 'Technology', email: 'ahmed.hassan@northwind.co' },
  manager: { role: 'manager', employeeId: 'EMP-1008', name: 'Mohamed Ali', title: 'Engineering Manager', department: 'Technology', email: 'mohamed.ali@northwind.co' },
  hr: { role: 'hr', employeeId: 'EMP-1003', name: 'Mariam Hassan', title: 'HR Manager', department: 'Human Resources', email: 'mariam.hassan@northwind.co' },
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
  ],
  hr: [
    { label: 'Dashboard', path: '/hr', icon: LayoutDashboard },
    { label: 'Employees', path: '/hr/employees', icon: Users },
    { label: 'Attendance', path: '/hr/attendance', icon: Clock },
    { label: 'Leave', path: '/hr/leave', icon: CalendarCheck2, badgeKey: 'pendingLeave' },
    { label: 'Payroll', path: '/hr/payroll', icon: Wallet },
    { label: 'Recruitment', path: '/hr/recruitment', icon: BriefcaseBusiness },
    { label: 'Performance', path: '/hr/performance', icon: Target },
    { label: 'Training', path: '/hr/training', icon: GraduationCap },
    { label: 'Documents', path: '/hr/documents', icon: FileText },
    { label: 'Reports', path: '/hr/reports', icon: BarChart3 },
    { label: 'Settings', path: '/hr/settings', icon: Settings },
  ],
}

export const isRole = (value: string | undefined): value is Role => value === 'employee' || value === 'manager' || value === 'hr'
