import type { Candidate, CandidateStage, JobOpening } from '@/types'

export const STAGES: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']

export const jobOpenings: JobOpening[] = [
  { id: 'JOB-301', title: 'Senior Software Engineer', department: 'Technology', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 8, postedDate: '2026-09-22', hiringManager: 'Mohamed Ali', priority: 'High', salaryRange: '$2,200 – $2,800' },
  { id: 'JOB-302', title: 'Product Designer', department: 'Technology', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 24, postedDate: '2026-09-08', hiringManager: 'Rania Said', priority: 'Medium', salaryRange: '$1,400 – $1,900' },
  { id: 'JOB-303', title: 'HR Specialist', department: 'Human Resources', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 16, postedDate: '2026-09-15', hiringManager: 'Mariam Hassan', priority: 'Medium', salaryRange: '$700 – $950' },
  { id: 'JOB-304', title: 'DevOps Engineer', department: 'Technology', location: 'Remote', employmentType: 'Full-time', applicants: 14, postedDate: '2026-09-29', hiringManager: 'Mohamed Ali', priority: 'High', salaryRange: '$1,700 – $2,300' },
  { id: 'JOB-305', title: 'Account Executive — KSA', department: 'Sales', location: 'Riyadh', employmentType: 'Full-time', applicants: 38, postedDate: '2026-08-30', hiringManager: 'Sherif Lotfy', priority: 'High', salaryRange: '$1,100 – $1,500 + commission' },
  { id: 'JOB-306', title: 'Sales Development Representative', department: 'Sales', location: 'Dubai', employmentType: 'Full-time', applicants: 41, postedDate: '2026-09-01', hiringManager: 'Sherif Lotfy', priority: 'Medium', salaryRange: '$550 – $750 + commission' },
  { id: 'JOB-307', title: 'Financial Analyst', department: 'Finance', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 19, postedDate: '2026-09-10', hiringManager: 'Hesham Barakat', priority: 'Low', salaryRange: '$900 – $1,250' },
  { id: 'JOB-308', title: 'Customer Success Manager', department: 'Customer Success', location: 'Dubai', employmentType: 'Full-time', applicants: 22, postedDate: '2026-09-18', hiringManager: 'Lina Haddad', priority: 'Medium', salaryRange: '$900 – $1,200' },
  { id: 'JOB-309', title: 'Data Analyst', department: 'Technology', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 27, postedDate: '2026-09-05', hiringManager: 'Rania Said', priority: 'Low', salaryRange: '$1,050 – $1,500' },
  { id: 'JOB-310', title: 'Operations Coordinator', department: 'Operations', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 18, postedDate: '2026-09-24', hiringManager: 'Amira Soliman', priority: 'Low', salaryRange: '$450 – $650' },
  { id: 'JOB-311', title: 'Legal Counsel', department: 'Legal', location: 'Cairo HQ', employmentType: 'Full-time', applicants: 9, postedDate: '2026-09-27', hiringManager: 'Ayman Zaki', priority: 'Medium', salaryRange: '$1,300 – $1,800' },
  { id: 'JOB-312', title: 'Growth Marketing Manager', department: 'Marketing', location: 'Dubai', employmentType: 'Full-time', applicants: 12, postedDate: '2026-10-01', hiringManager: 'Nadia Fouad', priority: 'Medium', salaryRange: '$1,200 – $1,650' },
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
  // Senior Software Engineer
  { id: 'CAN-801', name: 'Mahmoud Fekry', jobId: 'JOB-301', stage: 'Interview', email: 'm.fekry@outlook.com', experience: '7 years', currentCompany: 'Instabug', rating: 4.6, appliedDate: '2026-09-23', source: 'LinkedIn' },
  { id: 'CAN-802', name: 'Nesma Abdallah', jobId: 'JOB-301', stage: 'Offer', email: 'nesma.abdallah@gmail.com', experience: '6 years', currentCompany: 'Paymob', rating: 4.8, appliedDate: '2026-09-22', source: 'Referral' },
  { id: 'CAN-803', name: 'Amr El-Gendy', jobId: 'JOB-301', stage: 'Screening', email: 'amr.elgendy@gmail.com', experience: '5 years', currentCompany: 'Fawry', rating: 4.1, appliedDate: '2026-09-26', source: 'Careers Page' },
  { id: 'CAN-804', name: 'Bassel Khoury', jobId: 'JOB-301', stage: 'Applied', email: 'bassel.khoury@proton.me', experience: '8 years', currentCompany: 'Careem', rating: 4.3, appliedDate: '2026-10-04', source: 'LinkedIn' },
  { id: 'CAN-805', name: 'Rowan Atef', jobId: 'JOB-301', stage: 'Applied', email: 'rowan.atef@gmail.com', experience: '5 years', currentCompany: 'Valeo Egypt', rating: 3.9, appliedDate: '2026-10-05', source: 'Wuzzuf' },
  // Product Designer
  { id: 'CAN-811', name: 'Farah Nasr', jobId: 'JOB-302', stage: 'Interview', email: 'farah.nasr@gmail.com', experience: '4 years', currentCompany: 'Swvl', rating: 4.5, appliedDate: '2026-09-10', source: 'LinkedIn' },
  { id: 'CAN-812', name: 'Ziad Hamdan', jobId: 'JOB-302', stage: 'Screening', email: 'ziad.hamdan@icloud.com', experience: '3 years', currentCompany: 'Talabat', rating: 4.0, appliedDate: '2026-09-14', source: 'Careers Page' },
  { id: 'CAN-813', name: 'Mira Youssef', jobId: 'JOB-302', stage: 'Hired', email: 'mira.youssef@gmail.com', experience: '5 years', currentCompany: 'Noon', rating: 4.7, appliedDate: '2026-09-09', source: 'Referral' },
  { id: 'CAN-814', name: 'Omar Shawky', jobId: 'JOB-302', stage: 'Applied', email: 'omar.shawky@gmail.com', experience: '2 years', currentCompany: 'Freelance', rating: 3.6, appliedDate: '2026-10-02', source: 'Bayt' },
  // HR Specialist
  { id: 'CAN-821', name: 'Hagar Mohsen', jobId: 'JOB-303', stage: 'Interview', email: 'hagar.mohsen@gmail.com', experience: '3 years', currentCompany: 'Raya Holding', rating: 4.2, appliedDate: '2026-09-17', source: 'Wuzzuf' },
  { id: 'CAN-822', name: 'Mennatallah Sami', jobId: 'JOB-303', stage: 'Screening', email: 'menna.sami@yahoo.com', experience: '2 years', currentCompany: 'Vodafone Egypt', rating: 3.9, appliedDate: '2026-09-20', source: 'LinkedIn' },
  { id: 'CAN-823', name: 'Tamer Wagdy', jobId: 'JOB-303', stage: 'Applied', email: 'tamer.wagdy@gmail.com', experience: '4 years', currentCompany: 'Orange Business', rating: 3.8, appliedDate: '2026-10-03', source: 'Careers Page' },
  // DevOps Engineer
  { id: 'CAN-831', name: 'Kareem Fahmy', jobId: 'JOB-304', stage: 'Screening', email: 'kareem.fahmy@gmail.com', experience: '5 years', currentCompany: 'IBM Egypt', rating: 4.3, appliedDate: '2026-09-30', source: 'LinkedIn' },
  { id: 'CAN-832', name: 'Salma Ghoneim', jobId: 'JOB-304', stage: 'Applied', email: 'salma.ghoneim@gmail.com', experience: '4 years', currentCompany: 'Etisalat by e&', rating: 4.0, appliedDate: '2026-10-01', source: 'Referral' },
  { id: 'CAN-833', name: 'Ibrahim Al-Harthy', jobId: 'JOB-304', stage: 'Interview', email: 'i.alharthy@outlook.com', experience: '6 years', currentCompany: 'STC', rating: 4.4, appliedDate: '2026-09-29', source: 'Agency' },
  // Account Executive KSA
  { id: 'CAN-841', name: 'Faisal Al-Otaibi', jobId: 'JOB-305', stage: 'Offer', email: 'faisal.otaibi@gmail.com', experience: '6 years', currentCompany: 'Salesforce', rating: 4.6, appliedDate: '2026-09-02', source: 'Agency' },
  { id: 'CAN-842', name: 'Rana Al-Zahrani', jobId: 'JOB-305', stage: 'Interview', email: 'rana.zahrani@gmail.com', experience: '4 years', currentCompany: 'Oracle KSA', rating: 4.2, appliedDate: '2026-09-05', source: 'LinkedIn' },
  { id: 'CAN-843', name: 'Hamza Qureshi', jobId: 'JOB-305', stage: 'Screening', email: 'hamza.q@gmail.com', experience: '5 years', currentCompany: 'Zoho', rating: 3.9, appliedDate: '2026-09-11', source: 'Bayt' },
  // SDR
  { id: 'CAN-851', name: 'Joanna Saliba', jobId: 'JOB-306', stage: 'Hired', email: 'joanna.saliba@gmail.com', experience: '2 years', currentCompany: 'HubSpot', rating: 4.3, appliedDate: '2026-09-03', source: 'LinkedIn' },
  { id: 'CAN-852', name: 'Adel Mansoor', jobId: 'JOB-306', stage: 'Applied', email: 'adel.mansoor@gmail.com', experience: '1 year', currentCompany: 'Majid Al Futtaim', rating: 3.7, appliedDate: '2026-10-04', source: 'Careers Page' },
  // Financial Analyst
  { id: 'CAN-861', name: 'Mariam Saber', jobId: 'JOB-307', stage: 'Interview', email: 'mariam.saber@gmail.com', experience: '3 years', currentCompany: 'PwC Egypt', rating: 4.4, appliedDate: '2026-09-12', source: 'LinkedIn' },
  { id: 'CAN-862', name: 'Sherif Nagy', jobId: 'JOB-307', stage: 'Screening', email: 'sherif.nagy@outlook.com', experience: '2 years', currentCompany: 'CIB', rating: 3.8, appliedDate: '2026-09-19', source: 'Wuzzuf' },
  // CSM
  { id: 'CAN-871', name: 'Leen Haddad', jobId: 'JOB-308', stage: 'Offer', email: 'leen.haddad@gmail.com', experience: '5 years', currentCompany: 'Zendesk', rating: 4.5, appliedDate: '2026-09-19', source: 'Referral' },
  { id: 'CAN-872', name: 'Waleed Saeed', jobId: 'JOB-308', stage: 'Applied', email: 'waleed.saeed@gmail.com', experience: '3 years', currentCompany: 'Emirates NBD', rating: 3.9, appliedDate: '2026-10-03', source: 'LinkedIn' },
  // Data Analyst
  { id: 'CAN-881', name: 'Yomna Ashraf', jobId: 'JOB-309', stage: 'Screening', email: 'yomna.ashraf@gmail.com', experience: '2 years', currentCompany: 'Valu', rating: 4.1, appliedDate: '2026-09-08', source: 'Careers Page' },
  { id: 'CAN-882', name: 'Mostafa Rizk', jobId: 'JOB-309', stage: 'Interview', email: 'mostafa.rizk@gmail.com', experience: '3 years', currentCompany: 'Breadfast', rating: 4.3, appliedDate: '2026-09-07', source: 'LinkedIn' },
  // Operations Coordinator
  { id: 'CAN-891', name: 'Engy Morcos', jobId: 'JOB-310', stage: 'Applied', email: 'engy.morcos@gmail.com', experience: '2 years', currentCompany: 'Aramex', rating: 3.8, appliedDate: '2026-10-01', source: 'Wuzzuf' },
  // Legal Counsel
  { id: 'CAN-901', name: 'Hussein Kandil', jobId: 'JOB-311', stage: 'Screening', email: 'h.kandil@gmail.com', experience: '8 years', currentCompany: 'Matouk Bassiouny', rating: 4.4, appliedDate: '2026-09-28', source: 'Agency' },
  // Growth Marketing
  { id: 'CAN-911', name: 'Dana Al-Hashimi', jobId: 'JOB-312', stage: 'Applied', email: 'dana.hashimi@gmail.com', experience: '6 years', currentCompany: 'Anghami', rating: 4.2, appliedDate: '2026-10-02', source: 'LinkedIn' },
]
