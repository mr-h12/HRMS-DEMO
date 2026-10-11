import type { ClearanceItem, OffboardingCase, SeparationType } from '@/types'
import { employees } from './employees'

const CHECKLIST: Omit<ClearanceItem, 'id' | 'done'>[] = [
  { owner: 'Line Manager', label: 'Handover of open deals and quotations' },
  { owner: 'Line Manager', label: 'Exit interview completed' },
  { owner: 'IT', label: 'Email, CRM and VPN access revoked' },
  { owner: 'IT', label: 'Company accounts transferred' },
  { owner: 'Custody', label: 'All custody items returned' },
  { owner: 'Finance', label: 'Outstanding loans and advances recovered' },
  { owner: 'Finance', label: 'Expense claims closed' },
  { owner: 'HR', label: 'Social insurance Form 6 submitted' },
  { owner: 'HR', label: 'Experience certificate issued' },
]

export const newChecklist = (done: number[] = []): ClearanceItem[] => CHECKLIST.map((c, i) => ({ ...c, id: `CL-${i + 1}`, done: done.includes(i + 1) }))

const leaving = employees.filter((e) => e.status === 'Notice Period')

// Item numbers follow CHECKLIST. Custody (5) stays open because every seeded leaver still holds equipment,
// and loan recovery (6) stays open where a balance is outstanding (the first and third cases).
const SEED: { type: SeparationType; notice: string; last: string; reason: string; leave: number; done: number[] }[] = [
  { type: 'Resignation', notice: '2026-09-15', last: '2026-10-15', reason: 'Accepted an offer abroad.', leave: 9, done: [1, 2, 3, 4, 7] },
  { type: 'End of Contract', notice: '2026-09-20', last: '2026-10-20', reason: 'Fixed-term project contract ends with the site handover.', leave: 4, done: [1, 2, 6] },
  { type: 'Resignation', notice: '2026-09-28', last: '2026-10-28', reason: 'Relocating to Alexandria for family reasons.', leave: 12, done: [1] },
  { type: 'Retirement', notice: '2026-08-31', last: '2026-10-31', reason: 'Reaching retirement age (60).', leave: 18, done: [1, 2, 3, 4, 6, 7] },
  { type: 'Termination', notice: '2026-10-04', last: '2026-11-04', reason: 'Repeated violations of site safety rules after written warnings.', leave: 2, done: [] },
]

export const initialOffboarding: OffboardingCase[] = leaving.slice(0, SEED.length).map((e, i) => ({
  id: `OFF-${String(41 + i)}`,
  employeeId: e.id,
  type: SEED[i].type,
  noticeDate: SEED[i].notice,
  lastWorkingDay: SEED[i].last,
  reason: SEED[i].reason,
  unusedLeaveDays: SEED[i].leave,
  checklist: newChecklist(SEED[i].done),
}))

export const SEPARATION_TYPES: SeparationType[] = ['Resignation', 'End of Contract', 'Termination', 'Retirement']
