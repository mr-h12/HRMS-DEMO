import type { Candidate, CandidateStage, JobOpening } from '@/types'

export const STAGES: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']

export const jobOpenings: JobOpening[] = [
  { id: 'JOB-301', title: 'Senior Sales Engineer', department: 'Sales', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 8, postedDate: '2026-09-22', hiringManager: 'Mohamed Ali', priority: 'High', salaryRange: 'EGP 22,000 – EGP 30,000 + commission' },
  { id: 'JOB-302', title: 'PV Design Engineer', department: 'Solar Energy', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 24, postedDate: '2026-09-08', hiringManager: 'Rania Said', priority: 'Medium', salaryRange: 'EGP 16,000 – EGP 25,000' },
  { id: 'JOB-303', title: 'HR Specialist', department: 'Human Resources', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 16, postedDate: '2026-09-15', hiringManager: 'Mariam Hassan', priority: 'Medium', salaryRange: 'EGP 11,000 – EGP 16,000' },
  { id: 'JOB-304', title: 'Outdoor Sales Representative', department: 'Sales', location: 'Field', employmentType: 'Full-time', applicants: 14, postedDate: '2026-09-29', hiringManager: 'Mohamed Ali', priority: 'High', salaryRange: 'EGP 11,000 – EGP 16,000 + commission' },
  { id: 'JOB-305', title: 'Site Engineer — New Capital', department: 'Construction', location: 'Construction Sites', employmentType: 'Full-time', applicants: 38, postedDate: '2026-08-30', hiringManager: 'Khaled Abdelaziz', priority: 'High', salaryRange: 'EGP 15,000 – EGP 24,000' },
  { id: 'JOB-306', title: 'Solar Installation Technician', department: 'Solar Energy', location: 'Solar Sites', employmentType: 'Contract', applicants: 41, postedDate: '2026-09-01', hiringManager: 'Wael Ezzat', priority: 'Medium', salaryRange: 'EGP 8,000 – EGP 12,000' },
  { id: 'JOB-307', title: 'Accountant', department: 'Accounting', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 19, postedDate: '2026-09-10', hiringManager: 'Hesham Barakat', priority: 'Low', salaryRange: 'EGP 11,000 – EGP 16,000' },
  { id: 'JOB-308', title: 'Key Account Manager', department: 'Sales', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 22, postedDate: '2026-09-18', hiringManager: 'Lina Haddad', priority: 'Medium', salaryRange: 'EGP 26,000 – EGP 36,000 + commission' },
  { id: 'JOB-309', title: 'Quantity Surveyor', department: 'Construction', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 27, postedDate: '2026-09-05', hiringManager: 'Khaled Abdelaziz', priority: 'Low', salaryRange: 'EGP 15,000 – EGP 22,000' },
  { id: 'JOB-310', title: 'Procurement Officer', department: 'Procurement', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 18, postedDate: '2026-09-24', hiringManager: 'Amira Soliman', priority: 'Low', salaryRange: 'EGP 12,000 – EGP 18,000' },
  { id: 'JOB-311', title: 'System Administrator', department: 'Administration & IT', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 9, postedDate: '2026-09-27', hiringManager: 'Ayman Zaki', priority: 'Medium', salaryRange: 'EGP 18,000 – EGP 26,000' },
  { id: 'JOB-312', title: 'HSE Officer', department: 'Construction', location: 'Construction Sites', employmentType: 'Full-time', applicants: 12, postedDate: '2026-10-01', hiringManager: 'Khaled Abdelaziz', priority: 'Medium', salaryRange: 'EGP 12,000 – EGP 17,000' },
]

/** Company-wide funnel for the current hiring cycle. */
export const recruitmentFunnel = [
  { stage: 'Applicants', value: 248 },
  { stage: 'Screening', value: 84 },
  { stage: 'Interview', value: 42 },
  { stage: 'Offer', value: 18 },
  { stage: 'Hired', value: 12 },
]

export const initialCandidates: Candidate[] = [
  // Senior Sales Engineer
  { id: 'CAN-801', name: 'Mahmoud Fekry', jobId: 'JOB-301', stage: 'Interview', email: 'm.fekry@outlook.com', experience: '7 years', currentCompany: 'Schneider Electric Egypt', rating: 4.6, appliedDate: '2026-09-23', source: 'LinkedIn' },
  { id: 'CAN-802', name: 'Nesma Abdallah', jobId: 'JOB-301', stage: 'Offer', email: 'nesma.abdallah@gmail.com', experience: '6 years', currentCompany: 'Elsewedy Electric', rating: 4.8, appliedDate: '2026-09-22', source: 'Referral' },
  { id: 'CAN-803', name: 'Amr El-Gendy', jobId: 'JOB-301', stage: 'Screening', email: 'amr.elgendy@gmail.com', experience: '5 years', currentCompany: 'ABB Egypt', rating: 4.1, appliedDate: '2026-09-26', source: 'Careers Page' },
  { id: 'CAN-804', name: 'Bassel Khoury', jobId: 'JOB-301', stage: 'Applied', email: 'bassel.khoury@proton.me', experience: '8 years', currentCompany: 'Siemens Egypt', rating: 4.3, appliedDate: '2026-10-04', source: 'LinkedIn' },
  { id: 'CAN-805', name: 'Rowan Atef', jobId: 'JOB-301', stage: 'Applied', email: 'rowan.atef@gmail.com', experience: '5 years', currentCompany: 'Elsewedy Electric', rating: 3.9, appliedDate: '2026-10-05', source: 'Wuzzuf' },
  // PV Design Engineer
  { id: 'CAN-811', name: 'Farah Nasr', jobId: 'JOB-302', stage: 'Interview', email: 'farah.nasr@gmail.com', experience: '4 years', currentCompany: 'KarmSolar', rating: 4.5, appliedDate: '2026-09-10', source: 'LinkedIn' },
  { id: 'CAN-812', name: 'Ziad Hamdan', jobId: 'JOB-302', stage: 'Screening', email: 'ziad.hamdan@icloud.com', experience: '3 years', currentCompany: 'Infinity Power', rating: 4.0, appliedDate: '2026-09-14', source: 'Careers Page' },
  { id: 'CAN-813', name: 'Mira Youssef', jobId: 'JOB-302', stage: 'Hired', email: 'mira.youssef@gmail.com', experience: '5 years', currentCompany: 'KarmSolar', rating: 4.7, appliedDate: '2026-09-09', source: 'Referral' },
  { id: 'CAN-814', name: 'Omar Shawky', jobId: 'JOB-302', stage: 'Applied', email: 'omar.shawky@gmail.com', experience: '2 years', currentCompany: 'Freelance', rating: 3.6, appliedDate: '2026-10-02', source: 'Bayt' },
  // HR Specialist
  { id: 'CAN-821', name: 'Hagar Mohsen', jobId: 'JOB-303', stage: 'Interview', email: 'hagar.mohsen@gmail.com', experience: '3 years', currentCompany: 'Raya Holding', rating: 4.2, appliedDate: '2026-09-17', source: 'Wuzzuf' },
  { id: 'CAN-822', name: 'Mennatallah Sami', jobId: 'JOB-303', stage: 'Screening', email: 'menna.sami@yahoo.com', experience: '2 years', currentCompany: 'Vodafone Egypt', rating: 3.9, appliedDate: '2026-09-20', source: 'LinkedIn' },
  { id: 'CAN-823', name: 'Tamer Wagdy', jobId: 'JOB-303', stage: 'Applied', email: 'tamer.wagdy@gmail.com', experience: '4 years', currentCompany: 'Orange Business', rating: 3.8, appliedDate: '2026-10-03', source: 'Careers Page' },
  // Outdoor Sales Representative
  { id: 'CAN-831', name: 'Kareem Fahmy', jobId: 'JOB-304', stage: 'Screening', email: 'kareem.fahmy@gmail.com', experience: '5 years', currentCompany: 'Schneider Electric Egypt', rating: 4.3, appliedDate: '2026-09-30', source: 'LinkedIn' },
  { id: 'CAN-832', name: 'Salma Ghoneim', jobId: 'JOB-304', stage: 'Applied', email: 'salma.ghoneim@gmail.com', experience: '4 years', currentCompany: 'Elsewedy Electric', rating: 4.0, appliedDate: '2026-10-01', source: 'Referral' },
  { id: 'CAN-833', name: 'Ibrahim Al-Harthy', jobId: 'JOB-304', stage: 'Interview', email: 'i.alharthy@outlook.com', experience: '6 years', currentCompany: 'Raya Holding', rating: 4.4, appliedDate: '2026-09-29', source: 'Agency' },
  // Site Engineer — New Capital
  { id: 'CAN-841', name: 'Faisal Al-Otaibi', jobId: 'JOB-305', stage: 'Offer', email: 'faisal.otaibi@gmail.com', experience: '6 years', currentCompany: 'Orascom Construction', rating: 4.6, appliedDate: '2026-09-02', source: 'Agency' },
  { id: 'CAN-842', name: 'Rana Al-Zahrani', jobId: 'JOB-305', stage: 'Interview', email: 'rana.zahrani@gmail.com', experience: '4 years', currentCompany: 'Hassan Allam', rating: 4.2, appliedDate: '2026-09-05', source: 'LinkedIn' },
  { id: 'CAN-843', name: 'Hamza Qureshi', jobId: 'JOB-305', stage: 'Screening', email: 'hamza.q@gmail.com', experience: '5 years', currentCompany: 'Arab Contractors', rating: 3.9, appliedDate: '2026-09-11', source: 'Bayt' },
  // Solar Installation Technician
  { id: 'CAN-851', name: 'Joanna Saliba', jobId: 'JOB-306', stage: 'Hired', email: 'joanna.saliba@gmail.com', experience: '2 years', currentCompany: 'Infinity Power', rating: 4.3, appliedDate: '2026-09-03', source: 'LinkedIn' },
  { id: 'CAN-852', name: 'Adel Mansoor', jobId: 'JOB-306', stage: 'Applied', email: 'adel.mansoor@gmail.com', experience: '1 year', currentCompany: 'Freelance', rating: 3.7, appliedDate: '2026-10-04', source: 'Careers Page' },
  // Accountant
  { id: 'CAN-861', name: 'Mariam Saber', jobId: 'JOB-307', stage: 'Interview', email: 'mariam.saber@gmail.com', experience: '3 years', currentCompany: 'PwC Egypt', rating: 4.4, appliedDate: '2026-09-12', source: 'LinkedIn' },
  { id: 'CAN-862', name: 'Sherif Nagy', jobId: 'JOB-307', stage: 'Screening', email: 'sherif.nagy@outlook.com', experience: '2 years', currentCompany: 'CIB', rating: 3.8, appliedDate: '2026-09-19', source: 'Wuzzuf' },
  // Key Account Manager
  { id: 'CAN-871', name: 'Leen Haddad', jobId: 'JOB-308', stage: 'Offer', email: 'leen.haddad@gmail.com', experience: '5 years', currentCompany: 'Schneider Electric Egypt', rating: 4.5, appliedDate: '2026-09-19', source: 'Referral' },
  { id: 'CAN-872', name: 'Waleed Saeed', jobId: 'JOB-308', stage: 'Applied', email: 'waleed.saeed@gmail.com', experience: '3 years', currentCompany: 'ABB Egypt', rating: 3.9, appliedDate: '2026-10-03', source: 'LinkedIn' },
  // Quantity Surveyor
  { id: 'CAN-881', name: 'Yomna Ashraf', jobId: 'JOB-309', stage: 'Screening', email: 'yomna.ashraf@gmail.com', experience: '2 years', currentCompany: 'Hassan Allam', rating: 4.1, appliedDate: '2026-09-08', source: 'Careers Page' },
  { id: 'CAN-882', name: 'Mostafa Rizk', jobId: 'JOB-309', stage: 'Interview', email: 'mostafa.rizk@gmail.com', experience: '3 years', currentCompany: 'Orascom Construction', rating: 4.3, appliedDate: '2026-09-07', source: 'LinkedIn' },
  // Procurement Officer
  { id: 'CAN-891', name: 'Engy Morcos', jobId: 'JOB-310', stage: 'Applied', email: 'engy.morcos@gmail.com', experience: '2 years', currentCompany: 'Aramex', rating: 3.8, appliedDate: '2026-10-01', source: 'Wuzzuf' },
  // System Administrator
  { id: 'CAN-901', name: 'Hussein Kandil', jobId: 'JOB-311', stage: 'Screening', email: 'h.kandil@gmail.com', experience: '8 years', currentCompany: 'Vodafone Egypt', rating: 4.4, appliedDate: '2026-09-28', source: 'Agency' },
  // HSE Officer
  { id: 'CAN-911', name: 'Dana Al-Hashimi', jobId: 'JOB-312', stage: 'Applied', email: 'dana.hashimi@gmail.com', experience: '6 years', currentCompany: 'Arab Contractors', rating: 4.2, appliedDate: '2026-10-02', source: 'LinkedIn' },
]
