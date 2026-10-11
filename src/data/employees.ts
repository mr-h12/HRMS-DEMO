import type { Department, Employee, EmployeeStatus, EmploymentType, Location } from '@/types'
import { COMPANY } from './company'
import { createRng } from '@/utils/random'

/* Key personas used across the demo */
export const EMPLOYEE_ID = 'EMP-1042' // Ahmed Hassan
export const MANAGER_ID = 'EMP-1008' // Mohamed Ali
export const HR_ADMIN_ID = 'EMP-1003' // Mariam Hassan

type Seed = Omit<Employee, 'email' | 'gender' | 'dateOfBirth' | 'nationality' | 'phone'> &
  Partial<Pick<Employee, 'gender' | 'dateOfBirth' | 'nationality' | 'phone'>>

const CEO = { managerId: 'EMP-1001', managerName: 'Hatem El-Sayed' }
const SALES_MANAGER = { managerId: 'EMP-1004', managerName: 'Sherif Lotfy' }

const leadership: Seed[] = [
  { id: 'EMP-1001', name: 'Hatem El-Sayed', position: 'Chief Executive Officer', department: 'Administration & IT', team: 'Executive Office', location: 'Cairo HQ', employmentType: 'Full-time', managerId: null, managerName: '—', joiningDate: '2012-01-10', status: 'Active', basicSalary: 185000, rating: 4.7, attendanceRate: 98, gender: 'Male' },
  { id: 'EMP-1002', name: 'Khaled Abdelaziz', position: 'Construction Manager', department: 'Construction', team: 'Leadership', location: 'Construction Sites', employmentType: 'Full-time', ...CEO, joiningDate: '2014-04-02', status: 'Active', basicSalary: 95000, rating: 4.6, attendanceRate: 97, gender: 'Male' },
  { id: 'EMP-1003', name: 'Mariam Hassan', position: 'HR Manager', department: 'Human Resources', team: 'People Operations', location: 'Cairo HQ', employmentType: 'Full-time', ...CEO, joiningDate: '2018-09-16', status: 'Active', basicSalary: 62000, rating: 4.5, attendanceRate: 99, gender: 'Female', dateOfBirth: '1987-05-21' },
  { id: 'EMP-1004', name: 'Sherif Lotfy', position: 'Sales Manager', department: 'Sales', team: 'Leadership', location: 'Cairo HQ', employmentType: 'Full-time', ...CEO, joiningDate: '2015-02-11', status: 'Active', basicSalary: 90000, rating: 4.3, attendanceRate: 95, gender: 'Male' },
  { id: 'EMP-1005', name: 'Amira Soliman', position: 'Procurement Manager', department: 'Procurement', team: 'Leadership', location: 'Cairo HQ', employmentType: 'Full-time', ...CEO, joiningDate: '2016-03-03', status: 'Active', basicSalary: 72000, rating: 4.4, attendanceRate: 97, gender: 'Female' },
  { id: 'EMP-1006', name: 'Hesham Barakat', position: 'Chief Accountant', department: 'Accounting', team: 'Leadership', location: 'Cairo HQ', employmentType: 'Full-time', ...CEO, joiningDate: '2014-11-19', status: 'Active', basicSalary: 75000, rating: 4.2, attendanceRate: 96, gender: 'Male' },
  { id: 'EMP-1007', name: 'Nadia Fouad', position: 'Outdoor Sales Supervisor', department: 'Sales', team: 'Outdoor Sales', location: 'Field', employmentType: 'Full-time', ...SALES_MANAGER, joiningDate: '2019-06-14', status: 'Active', basicSalary: 38000, rating: 4.1, attendanceRate: 94, gender: 'Female' },
  { id: 'EMP-1008', name: 'Mohamed Ali', position: 'Sales Team Leader', department: 'Sales', team: 'Indoor Sales', location: 'Cairo HQ', employmentType: 'Full-time', ...SALES_MANAGER, joiningDate: '2017-08-25', status: 'Active', basicSalary: 45000, rating: 4.5, attendanceRate: 97, gender: 'Male', dateOfBirth: '1986-12-03' },
  { id: 'EMP-1009', name: 'Ayman Zaki', position: 'Administration & IT Manager', department: 'Administration & IT', team: 'Leadership', location: 'Cairo HQ', employmentType: 'Full-time', ...CEO, joiningDate: '2016-01-20', status: 'Active', basicSalary: 55000, rating: 4.3, attendanceRate: 96, gender: 'Male' },
  { id: 'EMP-1010', name: 'Lina Haddad', position: 'Key Accounts Team Leader', department: 'Sales', team: 'Key Accounts', location: 'Cairo HQ', employmentType: 'Full-time', ...SALES_MANAGER, joiningDate: '2019-02-07', status: 'Active', basicSalary: 44000, rating: 4.4, attendanceRate: 98, gender: 'Female' },
  { id: 'EMP-1011', name: 'Rania Said', position: 'Solar Design Lead', department: 'Solar Energy', team: 'Solar Design', location: 'Cairo HQ', employmentType: 'Full-time', managerId: 'EMP-1014', managerName: 'Wael Ezzat', joiningDate: '2020-05-17', status: 'Active', basicSalary: 42000, rating: 4.4, attendanceRate: 96, gender: 'Female' },
  { id: 'EMP-1014', name: 'Wael Ezzat', position: 'Solar Projects Manager', department: 'Solar Energy', team: 'Leadership', location: 'Solar Sites', employmentType: 'Full-time', ...CEO, joiningDate: '2018-10-04', status: 'Active', basicSalary: 80000, rating: 4.2, attendanceRate: 95, gender: 'Male' },
]

const M = { managerId: MANAGER_ID, managerName: 'Mohamed Ali', department: 'Sales' as Department, employmentType: 'Full-time' as EmploymentType }

/** Mohamed Ali's direct reports — the 18-person sales team behind the CRM's deals and quotations. */
const salesTeam: Seed[] = [
  { ...M, id: 'EMP-1042', name: 'Ahmed Hassan', position: 'Senior Sales Engineer', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2023-03-12', status: 'Active', basicSalary: 24000, rating: 4.4, attendanceRate: 96, gender: 'Male', dateOfBirth: '1994-07-18', phone: '+20 100 482 7731' },
  { ...M, id: 'EMP-1057', name: 'Sara Mohamed', position: 'Sales Engineer', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2023-06-04', status: 'Active', basicSalary: 17000, rating: 4.2, attendanceRate: 95, gender: 'Female' },
  { ...M, id: 'EMP-1063', name: 'Omar Khaled', position: 'Outdoor Sales Representative', team: 'Outdoor Sales', location: 'Field', joiningDate: '2022-11-20', status: 'Active', basicSalary: 14000, rating: 3.9, attendanceRate: 92, gender: 'Male' },
  { ...M, id: 'EMP-1021', name: 'Hossam Fathy', position: 'Deputy Team Leader', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2020-02-09', status: 'Active', basicSalary: 30000, rating: 4.7, attendanceRate: 98, gender: 'Male' },
  { ...M, id: 'EMP-1024', name: 'Tarek Samir', position: 'Senior Solar Sales Engineer', team: 'Solar Sales', location: 'Cairo HQ', joiningDate: '2019-11-03', status: 'Active', basicSalary: 28000, rating: 4.8, attendanceRate: 97, gender: 'Male' },
  { ...M, id: 'EMP-1033', name: 'Nour El-Din Mahmoud', position: 'Senior Sales Engineer', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2021-07-18', status: 'Active', basicSalary: 23000, rating: 4.3, attendanceRate: 94, gender: 'Male' },
  { ...M, id: 'EMP-1036', name: 'Dina Abdelrahman', position: 'Sales Coordinator', team: 'Sales Support', location: 'Cairo HQ', joiningDate: '2021-01-24', status: 'Active', basicSalary: 15000, rating: 4.1, attendanceRate: 97, gender: 'Female' },
  { ...M, id: 'EMP-1048', name: 'Youssef Ibrahim', position: 'Sales Engineer', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2023-01-15', status: 'Active', basicSalary: 16500, rating: 3.8, attendanceRate: 91, gender: 'Male' },
  { ...M, id: 'EMP-1051', name: 'Laila Farouk', position: 'Quotation Specialist', team: 'Sales Support', location: 'Cairo HQ', joiningDate: '2023-04-02', status: 'Active', basicSalary: 13500, rating: 4.0, attendanceRate: 96, gender: 'Female' },
  { ...M, id: 'EMP-1054', name: 'Karim Adel', position: 'Outdoor Sales Representative', team: 'Outdoor Sales', location: 'Field', joiningDate: '2022-08-28', status: 'On Leave', basicSalary: 13000, rating: 3.7, attendanceRate: 89, gender: 'Male' },
  { ...M, id: 'EMP-1059', name: 'Hana Mostafa', position: 'Solar Sales Engineer', team: 'Solar Sales', location: 'Cairo HQ', joiningDate: '2023-09-10', status: 'Active', basicSalary: 17500, rating: 4.1, attendanceRate: 95, gender: 'Female' },
  { ...M, id: 'EMP-1066', name: 'Mostafa Gamal', position: 'Outdoor Sales Representative', team: 'Outdoor Sales', location: 'Field', joiningDate: '2022-03-06', status: 'Active', basicSalary: 14500, rating: 4.0, attendanceRate: 93, gender: 'Male' },
  { ...M, id: 'EMP-1070', name: 'Reem Nabil', position: 'Sales Engineer', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2024-02-11', status: 'Active', basicSalary: 15500, rating: 3.9, attendanceRate: 94, gender: 'Female' },
  { ...M, id: 'EMP-1074', name: 'Salma Yasser', position: 'Sales Analyst', team: 'Sales Support', location: 'Cairo HQ', joiningDate: '2024-05-19', status: 'Active', basicSalary: 18000, rating: 4.2, attendanceRate: 96, gender: 'Female' },
  { ...M, id: 'EMP-1078', name: 'Khaled Mansour', position: 'Outdoor Sales Representative', team: 'Outdoor Sales', location: 'Field', joiningDate: '2024-08-04', status: 'Active', basicSalary: 12500, rating: 3.6, attendanceRate: 88, gender: 'Male' },
  { ...M, id: 'EMP-1081', name: 'Mariam Tawfik', position: 'Solar Sales Engineer', team: 'Solar Sales', location: 'Cairo HQ', joiningDate: '2025-01-12', status: 'Active', basicSalary: 16000, rating: 4.0, attendanceRate: 95, gender: 'Female' },
  { ...M, id: 'EMP-1085', name: 'Yara Sherif', position: 'Sales Engineer', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2024-10-20', status: 'On Leave', basicSalary: 15000, rating: 3.9, attendanceRate: 90, gender: 'Female' },
  { ...M, id: 'EMP-1092', name: 'Ali Hamdy', position: 'Junior Sales Engineer', team: 'Indoor Sales', location: 'Cairo HQ', joiningDate: '2026-08-02', status: 'Probation', basicSalary: 10000, rating: 3.5, attendanceRate: 97, gender: 'Male' },
]

/* ---------------- Generated workforce ---------------- */

const MALE = ['Ahmed', 'Mohamed', 'Mahmoud', 'Mostafa', 'Omar', 'Youssef', 'Karim', 'Amr', 'Hassan', 'Ibrahim', 'Tamer', 'Sherif', 'Hany', 'Islam', 'Ziad', 'Adham', 'Seif', 'Fady', 'Bassem', 'Waleed', 'Ramy', 'Hazem', 'Ehab', 'Ashraf', 'Nader', 'Samy', 'Marwan', 'Yassin', 'Abdullah', 'George', 'Michael', 'Peter', 'Hamza', 'Hussein', 'Saeed', 'Nabil'] as const
const FEMALE = ['Fatma', 'Nourhan', 'Aya', 'Esraa', 'Menna', 'Habiba', 'Rana', 'Heba', 'Mai', 'Noha', 'Dalia', 'Shaimaa', 'Yasmin', 'Farida', 'Malak', 'Jana', 'Nada', 'Sondos', 'Rahma', 'Asmaa', 'Hala', 'Reem', 'Noura', 'Aisha', 'Huda', 'Carol', 'Sarah', 'Nesma', 'Ghada'] as const
const LAST = ['Abdelaziz', 'Hamed', 'Saleh', 'Mansour', 'El-Sharkawy', 'Fawzy', 'Nasser', 'Ragab', 'Shalaby', 'Hegazy', 'Kamal', 'Saad', 'Ismail', 'Fouad', 'Gaber', 'Zaki', 'El-Masry', 'Ezzat', 'Helmy', 'Anwar', 'Lotfy', 'Badawy', 'Rizk', 'Soliman', 'Darwish', 'Wahba', 'Tadros', 'Girgis', 'Aziz', 'Morsy', 'Sabry', 'Fekry', 'Hosny', 'Abdallah', 'Othman', 'Yehia', 'Sobhy', 'Atef', 'Galal'] as const

interface TeamSpec {
  name: string
  manager: { id: string; name: string }
  locations: Location[]
  /** Monthly basic salary bands in EGP. */
  roles: { title: string; min: number; max: number }[]
  /** Share of field crews employed on project contracts rather than full-time. */
  contractShare?: number
}

interface DeptSpec {
  department: Department
  total: number
  teams: TeamSpec[]
}

const SHERIF = { id: 'EMP-1004', name: 'Sherif Lotfy' }
const KHALED = { id: 'EMP-1002', name: 'Khaled Abdelaziz' }
const WAEL = { id: 'EMP-1014', name: 'Wael Ezzat' }

const DEPARTMENTS: DeptSpec[] = [
  {
    department: 'Sales', total: 64,
    teams: [
      { name: 'Indoor Sales', manager: SHERIF, locations: ['Cairo HQ'], roles: [{ title: 'Sales Engineer', min: 14000, max: 22000 }, { title: 'Senior Sales Engineer', min: 22000, max: 30000 }] },
      { name: 'Outdoor Sales', manager: { id: 'EMP-1007', name: 'Nadia Fouad' }, locations: ['Field'], roles: [{ title: 'Outdoor Sales Representative', min: 11000, max: 16000 }, { title: 'Senior Outdoor Sales Representative', min: 16000, max: 21000 }] },
      { name: 'Key Accounts', manager: { id: 'EMP-1010', name: 'Lina Haddad' }, locations: ['Cairo HQ'], roles: [{ title: 'Key Account Manager', min: 26000, max: 36000 }, { title: 'Key Account Engineer', min: 18000, max: 26000 }] },
      { name: 'Solar Sales', manager: SHERIF, locations: ['Cairo HQ'], roles: [{ title: 'Solar Sales Engineer', min: 15000, max: 24000 }] },
      { name: 'Sales Support', manager: SHERIF, locations: ['Cairo HQ'], roles: [{ title: 'Sales Coordinator', min: 10000, max: 14000 }, { title: 'Quotation Specialist', min: 12000, max: 16000 }] },
    ],
  },
  {
    department: 'Procurement', total: 22,
    teams: [
      { name: 'Purchasing', manager: { id: 'EMP-1005', name: 'Amira Soliman' }, locations: ['Cairo HQ'], roles: [{ title: 'Procurement Officer', min: 12000, max: 18000 }, { title: 'Senior Buyer', min: 18000, max: 26000 }] },
      { name: 'Supplier Relations', manager: { id: 'EMP-1005', name: 'Amira Soliman' }, locations: ['Cairo HQ'], roles: [{ title: 'Supplier Relations Specialist', min: 13000, max: 19000 }] },
      { name: 'Warehouse & Logistics', manager: { id: 'EMP-1005', name: 'Amira Soliman' }, locations: ['Warehouse'], roles: [{ title: 'Storekeeper', min: 8000, max: 11000 }, { title: 'Warehouse Supervisor', min: 13000, max: 18000 }, { title: 'Logistics Coordinator', min: 11000, max: 15000 }, { title: 'Delivery Driver', min: 7000, max: 9500 }] },
    ],
  },
  {
    department: 'Accounting', total: 18,
    teams: [
      { name: 'General Accounting', manager: { id: 'EMP-1006', name: 'Hesham Barakat' }, locations: ['Cairo HQ'], roles: [{ title: 'Accountant', min: 11000, max: 16000 }, { title: 'Senior Accountant', min: 16000, max: 24000 }] },
      { name: 'Accounts Receivable', manager: { id: 'EMP-1006', name: 'Hesham Barakat' }, locations: ['Cairo HQ'], roles: [{ title: 'Receivables Accountant', min: 11000, max: 16000 }, { title: 'Collections Officer', min: 10000, max: 14000 }] },
      { name: 'Payroll & Tax', manager: { id: 'EMP-1006', name: 'Hesham Barakat' }, locations: ['Cairo HQ'], roles: [{ title: 'Payroll Accountant', min: 13000, max: 18000 }, { title: 'Tax Accountant', min: 15000, max: 22000 }] },
    ],
  },
  {
    department: 'Construction', total: 70,
    teams: [
      { name: 'Site Engineering', manager: KHALED, locations: ['Construction Sites'], roles: [{ title: 'Site Engineer', min: 15000, max: 24000 }, { title: 'Senior Site Engineer', min: 24000, max: 34000 }, { title: 'Project Engineer', min: 18000, max: 28000 }] },
      { name: 'Technical Office', manager: KHALED, locations: ['Cairo HQ'], roles: [{ title: 'Technical Office Engineer', min: 15000, max: 22000 }, { title: 'Quantity Surveyor', min: 15000, max: 22000 }, { title: 'Planning Engineer', min: 17000, max: 25000 }] },
      { name: 'MEP', manager: KHALED, locations: ['Construction Sites'], roles: [{ title: 'Electrical Engineer', min: 16000, max: 25000 }, { title: 'Mechanical Engineer', min: 16000, max: 25000 }] },
      { name: 'Site Crews', manager: KHALED, locations: ['Construction Sites'], contractShare: 0.45, roles: [{ title: 'Foreman', min: 12000, max: 16000 }, { title: 'Electrician', min: 8000, max: 12000 }, { title: 'Steel Fixer', min: 7000, max: 10000 }, { title: 'Mason', min: 7000, max: 10000 }] },
      { name: 'HSE', manager: KHALED, locations: ['Construction Sites'], roles: [{ title: 'HSE Officer', min: 12000, max: 17000 }] },
    ],
  },
  {
    department: 'Solar Energy', total: 44,
    teams: [
      { name: 'Solar Design', manager: { id: 'EMP-1011', name: 'Rania Said' }, locations: ['Cairo HQ'], roles: [{ title: 'PV Design Engineer', min: 16000, max: 25000 }] },
      { name: 'Installation', manager: WAEL, locations: ['Solar Sites'], contractShare: 0.35, roles: [{ title: 'Solar Installation Technician', min: 8000, max: 12000 }, { title: 'Installation Supervisor', min: 13000, max: 18000 }, { title: 'Electrical Technician', min: 9000, max: 13000 }] },
      { name: 'Operations & Maintenance', manager: WAEL, locations: ['Solar Sites'], roles: [{ title: 'O&M Engineer', min: 14000, max: 20000 }, { title: 'O&M Technician', min: 8000, max: 11000 }] },
    ],
  },
  {
    department: 'Human Resources', total: 10,
    teams: [
      { name: 'People Operations', manager: { id: 'EMP-1003', name: 'Mariam Hassan' }, locations: ['Cairo HQ'], roles: [{ title: 'HR Specialist', min: 11000, max: 16000 }, { title: 'Personnel Officer', min: 9000, max: 13000 }] },
      { name: 'Recruitment', manager: { id: 'EMP-1003', name: 'Mariam Hassan' }, locations: ['Cairo HQ'], roles: [{ title: 'Recruiter', min: 11000, max: 16000 }] },
      { name: 'Training', manager: { id: 'EMP-1003', name: 'Mariam Hassan' }, locations: ['Cairo HQ'], roles: [{ title: 'Training Specialist', min: 12000, max: 17000 }] },
    ],
  },
  {
    department: 'Administration & IT', total: 20,
    teams: [
      { name: 'IT Support', manager: { id: 'EMP-1009', name: 'Ayman Zaki' }, locations: ['Cairo HQ'], roles: [{ title: 'IT Support Engineer', min: 12000, max: 18000 }, { title: 'System Administrator', min: 18000, max: 26000 }, { title: 'ERP / CRM Developer', min: 22000, max: 35000 }] },
      { name: 'Administration', manager: { id: 'EMP-1009', name: 'Ayman Zaki' }, locations: ['Cairo HQ'], roles: [{ title: 'Office Administrator', min: 8000, max: 11000 }, { title: 'Receptionist', min: 7000, max: 9000 }, { title: 'Government Relations Officer', min: 9000, max: 13000 }] },
      { name: 'Fleet', manager: { id: 'EMP-1009', name: 'Ayman Zaki' }, locations: ['Field'], roles: [{ title: 'Driver', min: 7000, max: 9000 }, { title: 'Fleet Coordinator', min: 10000, max: 13000 }] },
    ],
  },
]

const TARGET_STATUS: Record<Exclude<EmployeeStatus, 'Active'>, number> = {
  'On Leave': 13,
  Probation: 9,
  'Notice Period': 5,
}

function slugEmail(name: string) {
  return name.toLowerCase().replace(/[^a-z\s-]/g, '').replace(/[\s]+/g, '.').replace(/-/g, '') + `@${COMPANY.domain}`
}

function buildEmployees(): Employee[] {
  const rng = createRng(20261007)
  const seeds: Seed[] = [...leadership, ...salesTeam]
  const usedIds = new Set(seeds.map((s) => s.id))
  const usedNames = new Set(seeds.map((s) => s.name))
  let nextId = 1100

  for (const spec of DEPARTMENTS) {
    const existing = seeds.filter((s) => s.department === spec.department).length
    for (let i = existing; i < spec.total; i++) {
      while (usedIds.has(`EMP-${nextId}`)) nextId++
      const id = `EMP-${nextId++}`
      usedIds.add(id)
      const team = rng.pick(spec.teams)
      const female = team.locations[0] === 'Cairo HQ' ? rng.chance(0.4) : rng.chance(0.08)
      let name = ''
      do {
        name = `${rng.pick(female ? FEMALE : MALE)} ${rng.pick(LAST)}`
      } while (usedNames.has(name))
      usedNames.add(name)
      const role = rng.pick(team.roles)
      const year = rng.int(2015, 2025)
      const employmentType: EmploymentType = team.contractShare && rng.chance(team.contractShare) ? 'Contract' : rng.chance(0.94) ? 'Full-time' : rng.pick(['Part-time', 'Intern'] as const)
      seeds.push({
        id,
        name,
        position: role.title,
        department: spec.department,
        team: team.name,
        location: rng.pick(team.locations),
        employmentType,
        managerId: team.manager.id,
        managerName: team.manager.name,
        joiningDate: `${year}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')}`,
        status: 'Active',
        basicSalary: Math.round(rng.int(role.min, role.max) / 250) * 250,
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
    const birthYear = 2026 - 24 - r.int(0, 20)
    return {
      ...s,
      email: slugEmail(s.name),
      phone: s.phone ?? `+20 1${r.pick(['0', '1', '2', '5'])}${r.int(0, 9)} ${r.int(100, 999)} ${r.int(1000, 9999)}`,
      gender: s.gender ?? 'Male',
      dateOfBirth: s.dateOfBirth ?? `${birthYear}-${String(r.int(1, 12)).padStart(2, '0')}-${String(r.int(1, 28)).padStart(2, '0')}`,
      nationality: 'Egyptian',
    }
  })
}

export const employees: Employee[] = buildEmployees()

export const employeeById = (id: string) => employees.find((e) => e.id === id)

export const teamMembers = employees.filter((e) => e.managerId === MANAGER_ID)

export const DEPARTMENT_LIST: Department[] = DEPARTMENTS.map((d) => d.department)
export const LOCATIONS: Location[] = ['Cairo HQ', 'Warehouse', 'Construction Sites', 'Solar Sites', 'Field']
export const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Intern']
export const STATUSES: EmployeeStatus[] = ['Active', 'On Leave', 'Probation', 'Notice Period']

/** Extended profile details for Ahmed Hassan (employee persona). */
export const ahmedProfile = {
  address: '14 El-Nozha Street, Heliopolis, Cairo',
  maritalStatus: 'Married',
  nationalId: '29407180101234',
  bloodType: 'O+',
  workEmail: `ahmed.hassan@${COMPANY.domain}`,
  personalEmail: 'ahmed.hassan94@gmail.com',
  workSchedule: 'Sun–Thu, 09:00 – 17:00',
  grade: 'L4 — Senior',
  costCenter: 'SAL-IND-110',
  probationEnd: '2023-06-12',
  contractType: 'Permanent',
  bank: 'Commercial International Bank (CIB)',
  iban: 'EG38 0019 0005 0000 0000 2631 8000 2',
  emergencyContacts: [
    { name: 'Nada Hassan', relation: 'Spouse', phone: '+20 101 556 2290', email: 'nada.hassan@gmail.com' },
    { name: 'Hassan Abdelmoneim', relation: 'Father', phone: '+20 122 310 4478', email: '—' },
  ],
  skills: ['B2B Quotations', 'Solar PV Sizing', 'Supplier Negotiation', 'Electrical Panels & Cables', 'Smart Technology CRM', 'Key Account Handling', 'Arabic & English Proposals'],
}
