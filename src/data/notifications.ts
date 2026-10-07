import type { AppNotification } from '@/types'

export const initialNotifications: AppNotification[] = [
  // Employee — Ahmed Hassan
  { id: 'N-E1', role: 'employee', kind: 'approval', title: 'HR letter ready', message: 'Your Salary Certificate has been approved and is ready to download.', createdAt: '2026-09-30T11:40:00', read: false, link: '/employee/requests' },
  { id: 'N-E2', role: 'employee', kind: 'performance', title: 'Performance review scheduled', message: 'Mohamed Ali scheduled your H2 2026 review for Oct 15 at 11:00 AM.', createdAt: '2026-10-06T16:10:00', read: false, link: '/employee/performance' },
  { id: 'N-E3', role: 'employee', kind: 'payroll', title: 'September payslip available', message: 'Your payslip for September 2026 has been published.', createdAt: '2026-09-28T09:00:00', read: true, link: '/employee/payslips' },
  { id: 'N-E4', role: 'employee', kind: 'document', title: 'Policy acknowledgement', message: 'Please review and acknowledge the updated Remote Work Policy (v3.2).', createdAt: '2026-10-04T10:30:00', read: false, link: '/employee/documents' },
  { id: 'N-E5', role: 'employee', kind: 'system', title: 'Company holiday', message: 'Northwind Founders’ Day on Thursday, Oct 29 — offices closed.', createdAt: '2026-10-01T08:00:00', read: true },

  // Manager — Mohamed Ali
  { id: 'N-M1', role: 'manager', kind: 'request', title: 'New leave request', message: 'Ahmed submitted a leave request for Oct 12–14 (3 days).', createdAt: '2026-10-05T10:24:00', read: false, link: '/manager/approvals' },
  { id: 'N-M2', role: 'manager', kind: 'request', title: 'Emergency leave', message: 'Mostafa Gamal requested emergency leave for Oct 11.', createdAt: '2026-10-07T07:48:00', read: false, link: '/manager/approvals' },
  { id: 'N-M3', role: 'manager', kind: 'attendance', title: 'Late arrivals today', message: '2 team members checked in after 09:15 AM today.', createdAt: '2026-10-07T09:45:00', read: false, link: '/manager/attendance' },
  { id: 'N-M4', role: 'manager', kind: 'request', title: 'Expense claim', message: 'Omar Khaled submitted an expense claim of $120 (Meals).', createdAt: '2026-10-06T11:30:00', read: true, link: '/manager/approvals' },
  { id: 'N-M5', role: 'manager', kind: 'performance', title: 'Reviews due', message: '12 of 18 H2 manager reviews are still pending — due Oct 31.', createdAt: '2026-10-03T09:00:00', read: true, link: '/manager/performance' },
  { id: 'N-M6', role: 'manager', kind: 'recruitment', title: 'Offer accepted pending', message: 'Nesma Abdallah reached the Offer stage for Senior Software Engineer.', createdAt: '2026-10-02T14:15:00', read: true },

  // HR Admin — Mariam Hassan
  { id: 'N-H1', role: 'hr', kind: 'payroll', title: 'Payroll processing is ready', message: 'October 2026 payroll for 524 employees is ready for review.', createdAt: '2026-10-07T08:30:00', read: false, link: '/hr/payroll' },
  { id: 'N-H2', role: 'hr', kind: 'document', title: 'Documents expiring', message: '3 employee documents are expiring within 30 days.', createdAt: '2026-10-07T07:00:00', read: false, link: '/hr/documents' },
  { id: 'N-H3', role: 'hr', kind: 'request', title: 'Leave request submitted', message: 'Ahmed submitted a leave request (Annual Leave, Oct 12–14).', createdAt: '2026-10-05T10:24:00', read: false, link: '/hr/leave' },
  { id: 'N-H4', role: 'hr', kind: 'recruitment', title: 'Offer accepted', message: 'Mira Youssef accepted the Product Designer offer — starts Nov 1.', createdAt: '2026-10-06T13:20:00', read: false, link: '/hr/recruitment' },
  { id: 'N-H5', role: 'hr', kind: 'system', title: 'Probation reviews', message: '4 employees complete probation this month.', createdAt: '2026-10-02T09:00:00', read: true, link: '/hr/employees' },
  { id: 'N-H6', role: 'hr', kind: 'attendance', title: 'Missing punches', message: 'Missing punch records need correction for yesterday’s shift.', createdAt: '2026-10-05T10:00:00', read: true, link: '/hr/attendance' },
]
