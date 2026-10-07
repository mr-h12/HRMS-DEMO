import type { Department, Employee, EmployeeStatus, EmploymentType, Location } from '@/types'
import { createRng } from '@/utils/random'

/* Key personas used across the demo */
export const EMPLOYEE_ID = 'EMP-1042' // Ahmed Hassan
export const MANAGER_ID = 'EMP-1008' // Mohamed Ali
export const HR_ADMIN_ID = 'EMP-1003' // Mariam Hassan

type Seed = Omit<Employee, 'email' | 'gender' | 'dateOfBirth' | 'nationality' | 'phone'> &
  Partial<Pick<Employee, 'gender' | 'dateOfBirth' | 'nationality' | 'phone'>>

const leadership: Seed[] = [
  { id: 'EMP-1001', name: 'Hatem El-Sayed', position: 'Chief Executive Officer', department: 'Operations', team: 'Executive Office', location: 'Cairo HQ', employmentType: 'Full-time', managerId: null, managerName: '—', joiningDate: '2016-01-10', status: 'Active', basicSalary: 18500, rating: 4.7, attendanceRate: 98, gender: 'Male' },
  { id: 'EMP-1002', name: 'Khaled Abdelaziz', position: 'Chief Technology Officer', department: 'Technology', team: 'Leadership', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2017-04-02', status: 'Active', basicSalary: 14200, rating: 4.6, attendanceRate: 97, gender: 'Male' },
  { id: 'EMP-1003', name: 'Mariam Hassan', position: 'HR Manager', department: 'Human Resources', team: 'People Operations', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2018-09-16', status: 'Active', basicSalary: 7400, rating: 4.5, attendanceRate: 99, gender: 'Female', dateOfBirth: '1987-05-21' },
  { id: 'EMP-1004', name: 'Sherif Lotfy', position: 'Sales Director', department: 'Sales', team: 'Leadership', location: 'Dubai', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2018-02-11', status: 'Active', basicSalary: 11800, rating: 4.3, attendanceRate: 95, gender: 'Male' },
  { id: 'EMP-1005', name: 'Amira Soliman', position: 'Operations Director', department: 'Operations', team: 'Leadership', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2019-03-03', status: 'Active', basicSalary: 10600, rating: 4.4, attendanceRate: 97, gender: 'Female' },
  { id: 'EMP-1006', name: 'Hesham Barakat', position: 'Finance Director', department: 'Finance', team: 'Leadership', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2017-11-19', status: 'Active', basicSalary: 11200, rating: 4.2, attendanceRate: 96, gender: 'Male' },
  { id: 'EMP-1007', name: 'Nadia Fouad', position: 'Marketing Director', department: 'Marketing', team: 'Leadership', location: 'Dubai', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2020-06-14', status: 'Active', basicSalary: 9800, rating: 4.1, attendanceRate: 94, gender: 'Female' },
  { id: 'EMP-1008', name: 'Mohamed Ali', position: 'Engineering Manager', department: 'Technology', team: 'Platform Engineering', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1002', managerName: 'Khaled Abdelaziz', joiningDate: '2019-08-25', status: 'Active', basicSalary: 8600, rating: 4.5, attendanceRate: 97, gender: 'Male', dateOfBirth: '1986-12-03' },
  { id: 'EMP-1009', name: 'Ayman Zaki', position: 'General Counsel', department: 'Legal', team: 'Legal Affairs', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2019-01-20', status: 'Active', basicSalary: 9400, rating: 4.3, attendanceRate: 96, gender: 'Male' },
  { id: 'EMP-1010', name: 'Lina Haddad', position: 'Head of Customer Success', department: 'Customer Success', team: 'Leadership', location: 'Dubai', employmentType: 'Full-time', managerId: 'EMP-1001', managerName: 'Hatem El-Sayed', joiningDate: '2021-02-07', status: 'Active', basicSalary: 8200, rating: 4.4, attendanceRate: 98, gender: 'Female' },
  { id: 'EMP-1011', name: 'Rania Said', position: 'Product Engineering Manager', department: 'Technology', team: 'Product Engineering', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1002', managerName: 'Khaled Abdelaziz', joiningDate: '2020-05-17', status: 'Active', basicSalary: 8400, rating: 4.4, attendanceRate: 96, gender: 'Female' },
  { id: 'EMP-1014', name: 'Wael Ezzat', position: 'Infrastructure Manager', department: 'Technology', team: 'Infrastructure', location: 'Riyadh', employmentType: 'Full-time', managerId: 'EMP-1002', managerName: 'Khaled Abdelaziz', joiningDate: '2020-10-04', status: 'Active', basicSalary: 8300, rating: 4.2, attendanceRate: 95, gender: 'Male' },
]

const M = { managerId: MANAGER_ID, managerName: 'Mohamed Ali', department: 'Technology' as Department }

/** Mohamed Ali's direct reports — 18 engineers. */
const engineeringTeam: Seed[] = [
  { ...M, id: 'EMP-1042', name: 'Ahmed Hassan', position: 'Senior Software Engineer', team: 'Backend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2023-03-12', status: 'Active', basicSalary: 2400, rating: 4.4, attendanceRate: 96, gender: 'Male', dateOfBirth: '1994-07-18', phone: '+20 100 482 7731' },
  { ...M, id: 'EMP-1057', name: 'Sara Mohamed', position: 'Software Engineer', team: 'Frontend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2023-06-04', status: 'Active', basicSalary: 2900, rating: 4.2, attendanceRate: 95, gender: 'Female' },
  { ...M, id: 'EMP-1063', name: 'Omar Khaled', position: 'DevOps Engineer', team: 'DevOps', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2022-11-20', status: 'Active', basicSalary: 3300, rating: 3.9, attendanceRate: 92, gender: 'Male' },
  { ...M, id: 'EMP-1021', name: 'Hossam Fathy', position: 'Tech Lead', team: 'Backend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2020-02-09', status: 'Active', basicSalary: 5200, rating: 4.7, attendanceRate: 98, gender: 'Male' },
  { ...M, id: 'EMP-1024', name: 'Tarek Samir', position: 'Staff Engineer', team: 'Backend', location: 'Remote', employmentType: 'Full-time', joiningDate: '2019-11-03', status: 'Active', basicSalary: 5600, rating: 4.8, attendanceRate: 97, gender: 'Male' },
  { ...M, id: 'EMP-1033', name: 'Nour El-Din Mahmoud', position: 'Senior Frontend Engineer', team: 'Frontend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2021-07-18', status: 'Active', basicSalary: 3900, rating: 4.3, attendanceRate: 94, gender: 'Male' },
  { ...M, id: 'EMP-1036', name: 'Dina Abdelrahman', position: 'QA Lead', team: 'Quality Assurance', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2021-01-24', status: 'Active', basicSalary: 3600, rating: 4.1, attendanceRate: 97, gender: 'Female' },
  { ...M, id: 'EMP-1048', name: 'Youssef Ibrahim', position: 'Backend Engineer', team: 'Backend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2023-01-15', status: 'Active', basicSalary: 2950, rating: 3.8, attendanceRate: 91, gender: 'Male' },
  { ...M, id: 'EMP-1051', name: 'Laila Farouk', position: 'QA Engineer', team: 'Quality Assurance', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2023-04-02', status: 'Active', basicSalary: 2500, rating: 4.0, attendanceRate: 96, gender: 'Female' },
  { ...M, id: 'EMP-1054', name: 'Karim Adel', position: 'Mobile Engineer', team: 'Mobile', location: 'Remote', employmentType: 'Full-time', joiningDate: '2022-08-28', status: 'On Leave', basicSalary: 3100, rating: 3.7, attendanceRate: 89, gender: 'Male' },
  { ...M, id: 'EMP-1059', name: 'Hana Mostafa', position: 'UI Engineer', team: 'Frontend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2023-09-10', status: 'Active', basicSalary: 2750, rating: 4.1, attendanceRate: 95, gender: 'Female' },
  { ...M, id: 'EMP-1066', name: 'Mostafa Gamal', position: 'Site Reliability Engineer', team: 'DevOps', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2022-03-06', status: 'Active', basicSalary: 3450, rating: 4.0, attendanceRate: 93, gender: 'Male' },
  { ...M, id: 'EMP-1070', name: 'Reem Nabil', position: 'Software Engineer', team: 'Backend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2024-02-11', status: 'Active', basicSalary: 2700, rating: 3.9, attendanceRate: 94, gender: 'Female' },
  { ...M, id: 'EMP-1074', name: 'Salma Yasser', position: 'Data Engineer', team: 'Data', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2024-05-19', status: 'Active', basicSalary: 3200, rating: 4.2, attendanceRate: 96, gender: 'Female' },
  { ...M, id: 'EMP-1078', name: 'Khaled Mansour', position: 'Mobile Engineer', team: 'Mobile', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2024-08-04', status: 'Active', basicSalary: 2850, rating: 3.6, attendanceRate: 88, gender: 'Male' },
  { ...M, id: 'EMP-1081', name: 'Mariam Tawfik', position: 'Software Engineer II', team: 'Data', location: 'Remote', employmentType: 'Full-time', joiningDate: '2025-01-12', status: 'Active', basicSalary: 2800, rating: 4.0, attendanceRate: 95, gender: 'Female' },
  { ...M, id: 'EMP-1085', name: 'Yara Sherif', position: 'Frontend Engineer', team: 'Frontend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2024-10-20', status: 'On Leave', basicSalary: 2650, rating: 3.9, attendanceRate: 90, gender: 'Female' },
  { ...M, id: 'EMP-1092', name: 'Ali Hamdy', position: 'Junior Software Engineer', team: 'Backend', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2026-08-02', status: 'Probation', basicSalary: 1750, rating: 3.5, attendanceRate: 97, gender: 'Male' },
]

/* ---------------- Generated workforce ---------------- */

const MALE = ['Ahmed', 'Mohamed', 'Mahmoud', 'Mostafa', 'Omar', 'Youssef', 'Karim', 'Amr', 'Hassan', 'Ibrahim', 'Tamer', 'Sherif', 'Hany', 'Islam', 'Ziad', 'Adham', 'Seif', 'Fady', 'Bassem', 'Waleed', 'Ramy', 'Hazem', 'Ehab', 'Ashraf', 'Nader', 'Samy', 'Marwan', 'Yassin', 'Faris', 'Rashid', 'Saeed', 'Fahad', 'Abdullah', 'Majed', 'Sultan', 'George', 'Daniel', 'Michael', 'Rami', 'Peter'] as const
const FEMALE = ['Fatma', 'Nourhan', 'Aya', 'Esraa', 'Menna', 'Habiba', 'Rana', 'Heba', 'Mai', 'Noha', 'Dalia', 'Shaimaa', 'Yasmin', 'Farida', 'Malak', 'Jana', 'Nada', 'Sondos', 'Rahma', 'Asmaa', 'Hala', 'Reem', 'Lama', 'Noura', 'Aisha', 'Huda', 'Layla', 'Maya', 'Carol', 'Sarah', 'Nesma', 'Ghada'] as const
const LAST = ['Abdelaziz', 'Hamed', 'Saleh', 'Mansour', 'El-Sharkawy', 'Fawzy', 'Nasser', 'Ragab', 'Shalaby', 'Hegazy', 'Kamal', 'Saad', 'Ismail', 'Fouad', 'Gaber', 'Zaki', 'El-Masry', 'Ezzat', 'Helmy', 'Anwar', 'Lotfy', 'Badawy', 'Rizk', 'Soliman', 'Darwish', 'Al-Qahtani', 'Al-Harbi', 'Al-Mansoori', 'Al-Shamsi', 'Khoury', 'Haddad', 'Wahba', 'Tadros', 'Girgis', 'Aziz', 'Morsy', 'Sabry', 'Fekry', 'Hosny', 'Abdallah', 'Othman', 'Yehia', 'Sobhy', 'Atef', 'Galal'] as const

interface DeptSpec {
  department: Department
  total: number
  teams: string[]
  roles: { title: string; min: number; max: number }[]
  managers: { id: string; name: string }[]
}

const DEPARTMENTS: DeptSpec[] = [
  {
    department: 'Technology', total: 168,
    teams: ['Product Engineering', 'Infrastructure', 'Data', 'Security', 'Product Design'],
    roles: [
      { title: 'Software Engineer', min: 2200, max: 3400 }, { title: 'Senior Software Engineer', min: 3400, max: 4600 },
      { title: 'Frontend Engineer', min: 2200, max: 3300 }, { title: 'Backend Engineer', min: 2300, max: 3500 },
      { title: 'QA Engineer', min: 1800, max: 2700 }, { title: 'DevOps Engineer', min: 2800, max: 4000 },
      { title: 'Data Analyst', min: 1900, max: 2900 }, { title: 'Product Designer', min: 2300, max: 3500 },
      { title: 'Security Engineer', min: 3000, max: 4300 }, { title: 'Product Manager', min: 3500, max: 5000 },
    ],
    managers: [{ id: 'EMP-1011', name: 'Rania Said' }, { id: 'EMP-1014', name: 'Wael Ezzat' }, { id: 'EMP-1002', name: 'Khaled Abdelaziz' }],
  },
  {
    department: 'Sales', total: 126,
    teams: ['Enterprise Sales', 'SMB Sales', 'Sales Development', 'Partnerships'],
    roles: [
      { title: 'Account Executive', min: 1600, max: 2600 }, { title: 'Senior Account Executive', min: 2500, max: 3400 },
      { title: 'Sales Development Representative', min: 900, max: 1400 }, { title: 'Key Account Manager', min: 2400, max: 3300 },
      { title: 'Sales Operations Analyst', min: 1300, max: 1900 }, { title: 'Partnerships Manager', min: 2600, max: 3500 },
    ],
    managers: [{ id: 'EMP-1004', name: 'Sherif Lotfy' }],
  },
  {
    department: 'Operations', total: 94,
    teams: ['Facilities', 'Procurement', 'Logistics', 'Business Operations', 'IT Support'],
    roles: [
      { title: 'Operations Specialist', min: 900, max: 1400 }, { title: 'Operations Coordinator', min: 800, max: 1200 },
      { title: 'Procurement Officer', min: 1100, max: 1600 }, { title: 'Facilities Supervisor', min: 1000, max: 1500 },
      { title: 'IT Support Specialist', min: 900, max: 1350 }, { title: 'Business Operations Analyst', min: 1500, max: 2200 },
      { title: 'Office Administrator', min: 700, max: 1000 },
    ],
    managers: [{ id: 'EMP-1005', name: 'Amira Soliman' }],
  },
  {
    department: 'Finance', total: 52,
    teams: ['Accounting', 'FP&A', 'Treasury', 'Payroll'],
    roles: [
      { title: 'Accountant', min: 1100, max: 1700 }, { title: 'Senior Accountant', min: 1700, max: 2400 },
      { title: 'Financial Analyst', min: 1600, max: 2400 }, { title: 'Payroll Specialist', min: 1200, max: 1800 },
      { title: 'Accounts Payable Officer', min: 900, max: 1300 },
    ],
    managers: [{ id: 'EMP-1006', name: 'Hesham Barakat' }],
  },
  {
    department: 'Human Resources', total: 31,
    teams: ['Talent Acquisition', 'People Operations', 'Learning & Development', 'Compensation & Benefits'],
    roles: [
      { title: 'HR Specialist', min: 1100, max: 1600 }, { title: 'Talent Acquisition Partner', min: 1300, max: 1900 },
      { title: 'HR Business Partner', min: 1900, max: 2700 }, { title: 'L&D Specialist', min: 1200, max: 1700 },
      { title: 'Compensation Analyst', min: 1500, max: 2100 },
    ],
    managers: [{ id: 'EMP-1003', name: 'Mariam Hassan' }],
  },
  {
    department: 'Marketing', total: 22,
    teams: ['Brand', 'Growth', 'Content'],
    roles: [
      { title: 'Marketing Specialist', min: 1200, max: 1800 }, { title: 'Content Strategist', min: 1300, max: 1900 },
      { title: 'Growth Marketing Manager', min: 2200, max: 3100 }, { title: 'Brand Designer', min: 1400, max: 2000 },
    ],
    managers: [{ id: 'EMP-1007', name: 'Nadia Fouad' }],
  },
  {
    department: 'Legal', total: 12,
    teams: ['Legal Affairs', 'Compliance'],
    roles: [
      { title: 'Legal Counsel', min: 2400, max: 3400 }, { title: 'Compliance Officer', min: 1800, max: 2600 },
      { title: 'Paralegal', min: 1000, max: 1400 },
    ],
    managers: [{ id: 'EMP-1009', name: 'Ayman Zaki' }],
  },
  {
    department: 'Customer Success', total: 19,
    teams: ['Onboarding', 'Support', 'Account Management'],
    roles: [
      { title: 'Customer Success Manager', min: 1500, max: 2300 }, { title: 'Support Specialist', min: 800, max: 1200 },
      { title: 'Implementation Consultant', min: 1600, max: 2400 },
    ],
    managers: [{ id: 'EMP-1010', name: 'Lina Haddad' }],
  },
]

const SALARY_SCALE = 0.54

const TARGET_STATUS: Record<Exclude<EmployeeStatus, 'Active'>, number> = {
  'On Leave': 27,
  Probation: 18,
  'Notice Period': 9,
}

function slugEmail(name: string) {
  return name.toLowerCase().replace(/[^a-z\s-]/g, '').replace(/[\s]+/g, '.').replace(/-/g, '') + '@northwind.co'
}

function buildEmployees(): Employee[] {
  const rng = createRng(20261007)
  const seeds: Seed[] = [...leadership, ...engineeringTeam]
  const usedIds = new Set(seeds.map((s) => s.id))
  const usedNames = new Set(seeds.map((s) => s.name))
  let nextId = 1100

  for (const spec of DEPARTMENTS) {
    const existing = seeds.filter((s) => s.department === spec.department).length
    for (let i = existing; i < spec.total; i++) {
      while (usedIds.has(`EMP-${nextId}`)) nextId++
      const id = `EMP-${nextId++}`
      usedIds.add(id)
      const female = rng.chance(0.42)
      let name = ''
      do {
        name = `${rng.pick(female ? FEMALE : MALE)} ${rng.pick(LAST)}`
      } while (usedNames.has(name))
      usedNames.add(name)
      const role = rng.pick(spec.roles)
      const manager = rng.pick(spec.managers)
      const year = rng.int(2017, 2025)
      const location: Location =
        spec.department === 'Sales' || spec.department === 'Customer Success'
          ? rng.pick(['Dubai', 'Dubai', 'Riyadh', 'Cairo HQ'] as const)
          : rng.pick(['Cairo HQ', 'Cairo HQ', 'Cairo HQ', 'Dubai', 'Riyadh', 'Remote'] as const)
      const employmentType: EmploymentType = rng.chance(0.86) ? 'Full-time' : rng.pick(['Contract', 'Part-time', 'Intern'] as const)
      seeds.push({
        id,
        name,
        position: role.title,
        department: spec.department,
        team: rng.pick(spec.teams),
        location,
        employmentType,
        managerId: manager.id,
        managerName: manager.name,
        joiningDate: `${year}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')}`,
        status: 'Active',
        basicSalary: Math.round(rng.int(role.min, role.max) / 50) * 50,
        rating: Math.round((3 + rng.next() * 1.9) * 10) / 10,
        attendanceRate: rng.int(86, 100),
        gender: female ? 'Female' : 'Male',
      })
    }
  }

  // Distribute statuses deterministically across generated employees.
  const generated = seeds.filter((s) => Number(s.id.slice(4)) >= 1100)
  const counts = { 'On Leave': 2, Probation: 1, 'Notice Period': 0 } // Yara & Karim (On Leave) and Ali (Probation) are curated
  let cursor = 7
  for (const status of ['On Leave', 'Probation', 'Notice Period'] as const) {
    while (counts[status] < TARGET_STATUS[status]) {
      cursor = (cursor + 37) % generated.length
      const emp = generated[cursor]
      if (emp.status !== 'Active') continue
      emp.status = status
      if (status === 'Probation') {
        const month = rng.int(7, 10)
        emp.joiningDate = `2026-${String(month).padStart(2, '0')}-${String(month === 10 ? rng.int(1, 5) : rng.int(1, 28)).padStart(2, '0')}`
      }
      counts[status]++
    }
  }

  return seeds.map((s, i) => {
    const r = createRng(i + 77)
    // Salary bands above are expressed in a common scale; convert to regional USD monthly pay.
    const basicSalary = s.id === EMPLOYEE_ID ? s.basicSalary : Math.round((s.basicSalary * SALARY_SCALE) / 10) * 10
    const birthYear = 2026 - 24 - r.int(0, 20)
    return {
      ...s,
      basicSalary,
      email: s.id === EMPLOYEE_ID ? 'ahmed.hassan@northwind.co' : slugEmail(s.name),
      phone: s.phone ?? `+${s.location === 'Dubai' ? '971 5' : s.location === 'Riyadh' ? '966 5' : '20 1'}${r.int(0, 2)} ${r.int(100, 999)} ${r.int(1000, 9999)}`,
      gender: s.gender ?? 'Male',
      dateOfBirth: s.dateOfBirth ?? `${birthYear}-${String(r.int(1, 12)).padStart(2, '0')}-${String(r.int(1, 28)).padStart(2, '0')}`,
      nationality: s.location === 'Dubai' && r.chance(0.4) ? 'Emirati' : s.location === 'Riyadh' && r.chance(0.5) ? 'Saudi' : 'Egyptian',
    }
  })
}

export const employees: Employee[] = buildEmployees()

export const employeeById = (id: string) => employees.find((e) => e.id === id)

export const teamMembers = employees.filter((e) => e.managerId === MANAGER_ID)

export const DEPARTMENT_LIST: Department[] = DEPARTMENTS.map((d) => d.department)
export const LOCATIONS: Location[] = ['Cairo HQ', 'Dubai', 'Riyadh', 'Remote']
export const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Intern']
export const STATUSES: EmployeeStatus[] = ['Active', 'On Leave', 'Probation', 'Notice Period']

/** Extended profile details for Ahmed Hassan (employee persona). */
export const ahmedProfile = {
  address: '14 El-Nozha Street, Heliopolis, Cairo',
  maritalStatus: 'Married',
  nationalId: '29407180101234',
  bloodType: 'O+',
  workEmail: 'ahmed.hassan@northwind.co',
  personalEmail: 'ahmed.hassan94@gmail.com',
  workSchedule: 'Sun–Thu, 09:00 – 17:00',
  grade: 'L4 — Senior',
  costCenter: 'TECH-ENG-210',
  probationEnd: '2023-06-12',
  contractType: 'Permanent',
  bank: 'Commercial International Bank (CIB)',
  iban: 'EG38 0019 0005 0000 0000 2631 8000 2',
  emergencyContacts: [
    { name: 'Nada Hassan', relation: 'Spouse', phone: '+20 101 556 2290', email: 'nada.hassan@gmail.com' },
    { name: 'Hassan Abdelmoneim', relation: 'Father', phone: '+20 122 310 4478', email: '—' },
  ],
  skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Kafka', 'System Design', 'Go'],
}
