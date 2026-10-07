import type { ActivityItem, EmployeeDocument, UpcomingEvent } from '@/types'

export const COMPANY = { name: 'Northwind Group', product: 'HRMS DEMO', domain: 'northwind.co' }

/** 12-month headcount trend ending at the current 524 employees. */
export const headcountTrend = [
  { month: 'Nov 25', headcount: 468, hires: 9, exits: 4 },
  { month: 'Dec 25', headcount: 471, hires: 6, exits: 3 },
  { month: 'Jan 26', headcount: 479, hires: 12, exits: 4 },
  { month: 'Feb 26', headcount: 485, hires: 10, exits: 4 },
  { month: 'Mar 26', headcount: 490, hires: 9, exits: 4 },
  { month: 'Apr 26', headcount: 494, hires: 8, exits: 4 },
  { month: 'May 26', headcount: 499, hires: 9, exits: 4 },
  { month: 'Jun 26', headcount: 503, hires: 8, exits: 4 },
  { month: 'Jul 26', headcount: 508, hires: 10, exits: 5 },
  { month: 'Aug 26', headcount: 513, hires: 9, exits: 4 },
  { month: 'Sep 26', headcount: 519, hires: 10, exits: 4 },
  { month: 'Oct 26', headcount: 524, hires: 8, exits: 3 },
]

/** Department distribution as reported to leadership (Engineering = Technology department). */
export const departmentDistribution = [
  { name: 'Engineering', value: 32, department: 'Technology' },
  { name: 'Sales', value: 24, department: 'Sales' },
  { name: 'Operations', value: 18, department: 'Operations' },
  { name: 'Finance', value: 10, department: 'Finance' },
  { name: 'HR', value: 6, department: 'Human Resources' },
  { name: 'Other', value: 10, department: 'Marketing, Legal, Customer Success' },
]

export const turnoverTrend = [
  { quarter: 'Q4 25', rate: 9.6, voluntary: 7.1 },
  { quarter: 'Q1 26', rate: 9.1, voluntary: 6.8 },
  { quarter: 'Q2 26', rate: 8.7, voluntary: 6.4 },
  { quarter: 'Q3 26', rate: 8.2, voluntary: 6.0 },
]

export const recentActivity: ActivityItem[] = [
  { id: 'A1', actor: 'Mariam Hassan', action: 'initiated payroll run for', target: 'October 2026', time: '2026-10-07T08:30:00', kind: 'payroll' },
  { id: 'A2', actor: 'Mohamed Ali', action: 'approved annual leave for', target: 'Dina Abdelrahman', time: '2026-10-06T15:10:00', kind: 'approval' },
  { id: 'A3', actor: 'Mira Youssef', action: 'accepted the offer for', target: 'Product Designer', time: '2026-10-06T13:20:00', kind: 'recruitment' },
  { id: 'A4', actor: 'Ali Hamdy', action: 'completed onboarding checklist —', target: 'Technology', time: '2026-10-05T17:45:00', kind: 'system' },
  { id: 'A5', actor: 'Ahmed Hassan', action: 'submitted a leave request for', target: 'Oct 12–14', time: '2026-10-05T10:24:00', kind: 'request' },
  { id: 'A6', actor: 'Sherif Lotfy', action: 'opened a new position:', target: 'Account Executive — KSA', time: '2026-10-04T12:00:00', kind: 'recruitment' },
  { id: 'A7', actor: 'Hesham Barakat', action: 'updated the expense policy —', target: 'Travel per diem', time: '2026-10-03T10:15:00', kind: 'document' },
]

export const ahmedEvents: UpcomingEvent[] = [
  { id: 'EV1', title: 'Team Meeting', date: '2026-10-08', time: '10:00 AM', kind: 'meeting', description: 'Sprint 42 planning — Platform Engineering' },
  { id: 'EV2', title: 'Performance Review', date: '2026-10-15', time: '11:00 AM', kind: 'review', description: 'H2 2026 review with Mohamed Ali' },
  { id: 'EV3', title: 'Secure Coding Workshop', date: '2026-10-20', time: '02:00 PM', kind: 'training', description: 'Mandatory — OWASP Top 10 refresher' },
  { id: 'EV4', title: 'Company Holiday', date: '2026-10-29', kind: 'holiday', description: 'Northwind Founders’ Day — offices closed' },
]

export const ahmedDocuments: EmployeeDocument[] = [
  { id: 'D1', name: 'Employment Contract', category: 'Contract', fileType: 'PDF', size: '412 KB', uploadedAt: '2023-03-12' },
  { id: 'D2', name: 'National ID (front & back)', category: 'Identity', fileType: 'PDF', size: '1.2 MB', uploadedAt: '2023-03-12', expiresAt: '2029-07-18', status: 'Valid' },
  { id: 'D3', name: 'Passport', category: 'Identity', fileType: 'PDF', size: '860 KB', uploadedAt: '2024-01-09', expiresAt: '2026-11-02', status: 'Expiring Soon' },
  { id: 'D4', name: 'BSc Computer Engineering — Cairo University', category: 'Certificate', fileType: 'PDF', size: '2.4 MB', uploadedAt: '2023-03-14' },
  { id: 'D5', name: 'Salary Certificate — Sep 2026', category: 'Letter', fileType: 'PDF', size: '96 KB', uploadedAt: '2026-09-30' },
  { id: 'D6', name: 'Medical Insurance Card — AXA', category: 'Medical', fileType: 'PNG', size: '340 KB', uploadedAt: '2026-01-05', expiresAt: '2026-12-31', status: 'Valid' },
  { id: 'D7', name: 'Remote Work Policy v3.2', category: 'Policy', fileType: 'PDF', size: '220 KB', uploadedAt: '2026-10-04' },
  { id: 'D8', name: 'Code of Conduct Acknowledgement', category: 'Policy', fileType: 'PDF', size: '128 KB', uploadedAt: '2026-01-15' },
]

export const companyDocuments: EmployeeDocument[] = [
  { id: 'CD1', name: 'UAE Work Permit — Sherif Lotfy', owner: 'Sherif Lotfy', category: 'Identity', fileType: 'PDF', size: '540 KB', uploadedAt: '2024-10-20', expiresAt: '2026-10-19', status: 'Expiring Soon' },
  { id: 'CD2', name: 'Residence Visa — Lina Haddad', owner: 'Lina Haddad', category: 'Identity', fileType: 'PDF', size: '610 KB', uploadedAt: '2024-11-02', expiresAt: '2026-10-28', status: 'Expiring Soon' },
  { id: 'CD3', name: 'Passport — Ahmed Hassan', owner: 'Ahmed Hassan', category: 'Identity', fileType: 'PDF', size: '860 KB', uploadedAt: '2024-01-09', expiresAt: '2026-11-02', status: 'Expiring Soon' },
  { id: 'CD4', name: 'Medical Fitness Certificate — Omar Khaled', owner: 'Omar Khaled', category: 'Medical', fileType: 'PDF', size: '220 KB', uploadedAt: '2025-09-15', expiresAt: '2026-09-15', status: 'Expired' },
  { id: 'CD5', name: 'Employee Handbook 2026', category: 'Policy', fileType: 'PDF', size: '3.8 MB', uploadedAt: '2026-01-02' },
  { id: 'CD6', name: 'Remote Work Policy v3.2', category: 'Policy', fileType: 'PDF', size: '220 KB', uploadedAt: '2026-10-04' },
  { id: 'CD7', name: 'Leave & Attendance Policy', category: 'Policy', fileType: 'PDF', size: '310 KB', uploadedAt: '2026-02-11' },
  { id: 'CD8', name: 'Employment Contract Template — Full-time', category: 'Contract', fileType: 'DOCX', size: '88 KB', uploadedAt: '2026-03-01' },
  { id: 'CD9', name: 'Offer Letter — Mira Youssef', owner: 'Mira Youssef', category: 'Letter', fileType: 'PDF', size: '104 KB', uploadedAt: '2026-10-05' },
  { id: 'CD10', name: 'Anti-Harassment Policy', category: 'Policy', fileType: 'PDF', size: '190 KB', uploadedAt: '2025-11-20' },
  { id: 'CD11', name: 'Payroll Register — September 2026', category: 'Payroll', fileType: 'PDF', size: '1.6 MB', uploadedAt: '2026-09-28' },
  { id: 'CD12', name: 'Trade License — Dubai Branch', category: 'Certificate', fileType: 'PDF', size: '760 KB', uploadedAt: '2025-12-12', expiresAt: '2026-12-11', status: 'Valid' },
]

export const trainingCourses = [
  { id: 'TR1', title: 'Secure Coding Fundamentals', category: 'Compliance', format: 'Workshop', enrolled: 142, completed: 96, due: '2026-10-31', mandatory: true, duration: '4 hrs' },
  { id: 'TR2', title: 'Anti-Harassment & Respectful Workplace', category: 'Compliance', format: 'E-learning', enrolled: 524, completed: 471, due: '2026-11-15', mandatory: true, duration: '45 min' },
  { id: 'TR3', title: 'Leadership Essentials for New Managers', category: 'Leadership', format: 'Cohort', enrolled: 24, completed: 9, due: '2026-12-10', mandatory: false, duration: '6 weeks' },
  { id: 'TR4', title: 'Consultative Selling', category: 'Sales', format: 'Workshop', enrolled: 58, completed: 41, due: '2026-10-25', mandatory: false, duration: '2 days' },
  { id: 'TR5', title: 'Data Privacy & PDPL Awareness', category: 'Compliance', format: 'E-learning', enrolled: 524, completed: 402, due: '2026-10-30', mandatory: true, duration: '30 min' },
  { id: 'TR6', title: 'AWS Cloud Practitioner Prep', category: 'Technical', format: 'Self-paced', enrolled: 46, completed: 18, due: '2026-12-31', mandatory: false, duration: '20 hrs' },
  { id: 'TR7', title: 'Effective Feedback Conversations', category: 'Leadership', format: 'Workshop', enrolled: 61, completed: 52, due: '2026-10-20', mandatory: false, duration: '3 hrs' },
  { id: 'TR8', title: 'First Aid & Workplace Safety', category: 'Health & Safety', format: 'In-person', enrolled: 38, completed: 30, due: '2026-11-05', mandatory: false, duration: '1 day' },
]

export const SEARCHABLE_DEPARTMENTS = [
  { name: 'Technology', head: 'Khaled Abdelaziz', headcount: 168 },
  { name: 'Sales', head: 'Sherif Lotfy', headcount: 126 },
  { name: 'Operations', head: 'Amira Soliman', headcount: 94 },
  { name: 'Finance', head: 'Hesham Barakat', headcount: 52 },
  { name: 'Human Resources', head: 'Mariam Hassan', headcount: 31 },
  { name: 'Marketing', head: 'Nadia Fouad', headcount: 22 },
  { name: 'Customer Success', head: 'Lina Haddad', headcount: 19 },
  { name: 'Legal', head: 'Ayman Zaki', headcount: 12 },
]
