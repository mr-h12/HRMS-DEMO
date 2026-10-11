import type { ContractRecord, ExpiringDocument, ExpiryDocType } from '@/types'
import { createRng } from '@/utils/random'
import { toISODate, parseDate } from '@/utils/format'
import { DEMO_TODAY } from './attendance'
import { employees } from './employees'

const shift = (days: number) => {
  const d = parseDate(DEMO_TODAY)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

/** Days from the demo's "today" to an ISO date (negative when already past). */
export const daysUntil = (iso: string) => Math.round((parseDate(iso).getTime() - parseDate(DEMO_TODAY).getTime()) / 86_400_000)

export type ExpiryStatus = 'Expired' | 'Expiring Soon' | 'Due in 90 days' | 'Valid'
export const expiryStatus = (iso: string | null): ExpiryStatus => {
  if (!iso) return 'Valid'
  const d = daysUntil(iso)
  return d < 0 ? 'Expired' : d <= 30 ? 'Expiring Soon' : d <= 90 ? 'Due in 90 days' : 'Valid'
}

function buildContracts(): ContractRecord[] {
  // Contract staff (site crews, project hires) carry fixed-term contracts; probationers a probation contract.
  const fixed = employees.filter((e) => e.employmentType === 'Contract').slice(0, 14)
  const probation = employees.filter((e) => e.status === 'Probation')
  const indefinite = employees.filter((e) => e.employmentType === 'Full-time' && e.status === 'Active').slice(0, 6)
  const offsets = [-12, -3, 6, 11, 19, 24, 29, 38, 47, 63, 78, 120, 160, 240]
  return [
    ...fixed.map((e, i) => ({ id: `CT-${500 + i}`, employeeId: e.id, type: 'Fixed-term' as const, startDate: shift(offsets[i % offsets.length] - 365), endDate: shift(offsets[i % offsets.length]) })),
    ...probation.map((e, i) => {
      const end = parseDate(e.joiningDate)
      end.setMonth(end.getMonth() + 3)
      return { id: `CT-${600 + i}`, employeeId: e.id, type: 'Probation' as const, startDate: e.joiningDate, endDate: toISODate(end) }
    }),
    ...indefinite.map((e, i) => ({ id: `CT-${700 + i}`, employeeId: e.id, type: 'Indefinite' as const, startDate: e.joiningDate, endDate: null })),
  ]
}

const DOC_PLAN: { type: ExpiryDocType; prefix: string; who: (e: (typeof employees)[number]) => boolean; offsets: number[] }[] = [
  { type: 'HSE Certificate', prefix: 'HSE', who: (e) => e.location === 'Construction Sites' || e.location === 'Solar Sites', offsets: [-20, -5, 4, 9, 15, 26, 41, 70, 85, 130] },
  { type: 'Site Work Permit', prefix: 'SWP', who: (e) => e.location === 'Solar Sites', offsets: [-2, 13, 33, 58, 95] },
  { type: 'Driving License', prefix: 'DL', who: (e) => e.location === 'Field', offsets: [-30, 7, 22, 52, 88, 200] },
  { type: 'Medical Certificate', prefix: 'MED', who: (e) => e.department === 'Construction', offsets: [3, 17, 45, 66, 110] },
  { type: 'National ID', prefix: 'NID', who: (e) => e.location === 'Cairo HQ', offsets: [-8, 25, 61, 150] },
]

function buildDocuments(): ExpiringDocument[] {
  const rng = createRng(5511)
  const out: ExpiringDocument[] = []
  let n = 1
  for (const plan of DOC_PLAN) {
    const pool = employees.filter(plan.who)
    plan.offsets.forEach((offset, i) => {
      const e = pool[(i * 7 + 2) % pool.length]
      out.push({ id: `CD-${String(n++).padStart(3, '0')}`, employeeId: e.id, type: plan.type, number: `${plan.prefix}-${rng.int(100000, 999999)}`, expiryDate: shift(offset) })
    })
  }
  return out.sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))
}

export const contracts: ContractRecord[] = buildContracts()
export const expiringDocuments: ExpiringDocument[] = buildDocuments()

/** Everything that needs HR action within 30 days (or is already overdue). */
export const expiryAlerts = () => [
  ...contracts.filter((c) => c.endDate && daysUntil(c.endDate) <= 30).map((c) => ({ id: c.id, employeeId: c.employeeId, label: c.type === 'Probation' ? 'Probation ends' : 'Contract ends', date: c.endDate! })),
  ...expiringDocuments.filter((d) => daysUntil(d.expiryDate) <= 30).map((d) => ({ id: d.id, employeeId: d.employeeId, label: d.type, date: d.expiryDate })),
].sort((a, b) => a.date.localeCompare(b.date))
