import type { Candidate, Employee, OnboardingCase, OnboardingPhase, OnboardingTask } from '@/types'
import { parseDate, toISODate } from '@/utils/format'
import { DEMO_TODAY } from './attendance'
import { employees } from './employees'
import { jobOpenings } from './recruitment'

const TASKS: { phase: OnboardingPhase; label: string; sitesOnly?: boolean }[] = [
  { phase: 'Before joining', label: 'Employment contract signed' },
  { phase: 'Before joining', label: 'National ID, military status and criminal record collected' },
  { phase: 'Before joining', label: 'Pre-employment medical check' },
  { phase: 'Before joining', label: 'Social insurance Form 1 submitted' },
  { phase: 'Before joining', label: 'Payroll bank account opened' },
  { phase: 'First day', label: 'Laptop and custody handed over' },
  { phase: 'First day', label: 'Email and CRM accounts created' },
  { phase: 'First day', label: 'Site safety induction', sitesOnly: true },
  { phase: 'First day', label: 'Team introduction and buddy assigned' },
  { phase: 'First 90 days', label: 'Mandatory training completed' },
  { phase: 'First 90 days', label: '30-day check-in' },
  { phase: 'First 90 days', label: '60-day check-in' },
  { phase: 'First 90 days', label: 'Final probation review' },
]

export const PHASES: OnboardingPhase[] = ['Before joining', 'First day', 'First 90 days']

const onSite = (location: string) => location === 'Construction Sites' || location === 'Solar Sites'

/** The checklist for one hire; the first `done` tasks (in order) start ticked. */
export function newTasks(location: string, done = 0): OnboardingTask[] {
  return TASKS.filter((t) => !t.sitesOnly || onSite(location)).map((t, i) => ({ id: `OT-${i + 1}`, phase: t.phase, label: t.label, done: i < done }))
}

const addMonths = (iso: string, months: number) => {
  const d = parseDate(iso)
  d.setMonth(d.getMonth() + months)
  return toISODate(d)
}
const addDays = (iso: string, days: number) => {
  const d = parseDate(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}
const daysBetween = (a: string, b: string) => Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86_400_000)

/** A buddy from the same team who is not on probation themselves. */
function buddyFor(e: Pick<Employee, 'id' | 'team' | 'department'>) {
  const peer = employees.find((x) => x.id !== e.id && x.team === e.team && x.status === 'Active') ?? employees.find((x) => x.id !== e.id && x.department === e.department && x.status === 'Active')
  return peer?.name ?? '—'
}

/** Employees already working through probation; progress follows how long they have been in. */
export const probationCases: OnboardingCase[] = employees
  .filter((e) => e.status === 'Probation')
  .map((e, i) => {
    const days = daysBetween(e.joiningDate, DEMO_TODAY)
    const tasks = newTasks(e.location)
    const firstDayEnd = tasks.filter((t) => t.phase !== 'First 90 days').length
    // Everything before day one is done; then roughly one 90-day task per month in post.
    const done = firstDayEnd - (i % 3 === 0 ? 1 : 0) + Math.min(3, Math.floor(days / 30))
    return {
      id: `ONB-${200 + i}`,
      personId: e.id,
      name: e.name,
      position: e.position,
      department: e.department,
      location: e.location,
      startDate: e.joiningDate,
      probationEnd: addMonths(e.joiningDate, 3),
      buddy: buddyFor(e),
      tasks: tasks.map((t, n) => ({ ...t, done: n < done })),
    }
  })

/** A hired candidate who has not started yet. Start dates are spread over the next weeks. */
export function caseForCandidate(c: Candidate, index: number): OnboardingCase {
  const job = jobOpenings.find((j) => j.id === c.jobId)!
  const start = addDays(DEMO_TODAY, 11 + index * 7)
  const team = employees.find((e) => e.department === job.department && e.location === job.location)?.team ?? job.department
  return {
    id: `ONB-${c.id.slice(4)}`,
    personId: c.id,
    name: c.name,
    position: job.title.replace(/ — .*$/, ''),
    department: job.department,
    location: job.location,
    startDate: start,
    probationEnd: addMonths(start, 3),
    buddy: buddyFor({ id: c.id, team, department: job.department }),
    tasks: newTasks(job.location, index === 0 ? 2 : 1),
  }
}

export const isPreJoining = (c: OnboardingCase) => c.startDate > DEMO_TODAY
