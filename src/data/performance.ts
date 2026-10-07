import type { FeedbackEntry, Goal, KPI } from '@/types'
import { employees, teamMembers } from './employees'

export const REVIEW_CYCLE = 'H2 2026 Review Cycle'

export const ahmedPerformance = {
  rating: 4.4,
  label: 'Exceeds Expectations',
  previousRating: 4.1,
  percentile: 82,
  nextReview: '2026-10-15',
  competencies: [
    { name: 'Technical Excellence', score: 4.7 },
    { name: 'Ownership', score: 4.5 },
    { name: 'Collaboration', score: 4.3 },
    { name: 'Communication', score: 4.0 },
    { name: 'Mentorship', score: 4.2 },
    { name: 'Delivery', score: 4.6 },
  ],
  history: [
    { cycle: 'H1 2024', rating: 3.8 },
    { cycle: 'H2 2024', rating: 3.9 },
    { cycle: 'H1 2025', rating: 4.0 },
    { cycle: 'H2 2025', rating: 4.1 },
    { cycle: 'H1 2026', rating: 4.3 },
    { cycle: 'H2 2026', rating: 4.4 },
  ],
}

export const ahmedKPIs: KPI[] = [
  { name: 'Sprint commitment delivered', target: 90, actual: 94, unit: '%', trend: 'up' },
  { name: 'Code review turnaround', target: 24, actual: 16, unit: 'hrs', trend: 'up' },
  { name: 'Production incidents caused', target: 2, actual: 1, unit: '', trend: 'flat' },
  { name: 'Test coverage (owned services)', target: 80, actual: 84, unit: '%', trend: 'up' },
  { name: 'Mentoring sessions / month', target: 4, actual: 3, unit: '', trend: 'down' },
]

export const ahmedGoals: Goal[] = [
  { id: 'G-1', title: 'Migrate payments service to event-driven architecture', description: 'Move settlement and refunds flows to Kafka with idempotent consumers and replay support.', progress: 75, dueDate: '2026-11-30', status: 'On Track', weight: 35 },
  { id: 'G-2', title: 'Reduce p95 API latency by 30%', description: 'Profile hot paths in the orders API, add caching and query optimization.', progress: 60, dueDate: '2026-12-15', status: 'On Track', weight: 25 },
  { id: 'G-3', title: 'Earn AWS Solutions Architect – Associate', description: 'Complete preparation course and pass the certification exam.', progress: 40, dueDate: '2026-11-15', status: 'At Risk', weight: 15 },
  { id: 'G-4', title: 'Mentor two junior engineers', description: 'Weekly 1:1s with Ali Hamdy and Reem Nabil; pair on at least one feature each.', progress: 85, dueDate: '2026-12-31', status: 'On Track', weight: 15 },
  { id: 'G-5', title: 'Publish internal API design guidelines', description: 'Document versioning, pagination and error conventions; present at engineering all-hands.', progress: 100, dueDate: '2026-09-30', status: 'Completed', weight: 10 },
]

export const ahmedFeedback: FeedbackEntry[] = [
  {
    id: 'FB-1', author: 'Mohamed Ali', authorTitle: 'Engineering Manager', date: '2026-09-30', rating: 4.5, cycle: 'Q3 2026 check-in',
    comment: 'Ahmed led the payments migration with excellent technical judgment and kept stakeholders informed throughout. His design docs are now the reference for the team. Next step: delegate more and grow Ali and Reem into owning components end-to-end.',
  },
  {
    id: 'FB-2', author: 'Hossam Fathy', authorTitle: 'Tech Lead', date: '2026-09-18', rating: 4.5, cycle: 'Peer feedback',
    comment: 'Always the first to jump on production issues, and his post-mortems are thorough and blameless. Would love to see him share more in architecture reviews.',
  },
  {
    id: 'FB-3', author: 'Mohamed Ali', authorTitle: 'Engineering Manager', date: '2026-06-28', rating: 4.3, cycle: 'H1 2026 review',
    comment: 'Strong half. Delivered the reconciliation engine two weeks ahead of schedule. Focus areas for H2: cross-team communication and certification goal.',
  },
]

/* ---------------- Team performance (manager) ---------------- */

export interface TeamPerformanceRow {
  employeeId: string
  goalAchievement: number
  productivity: number
  rating: number
  reviewStatus: 'Completed' | 'In Progress' | 'Not Started'
}

export const teamPerformance: TeamPerformanceRow[] = teamMembers.map((e, i) => ({
  employeeId: e.id,
  rating: e.rating,
  goalAchievement: Math.min(100, Math.round(e.rating * 19 + ((i * 7) % 9))),
  productivity: Math.min(100, Math.round(e.rating * 18 + 8 + ((i * 5) % 7))),
  reviewStatus: i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'In Progress' : 'Not Started',
}))

export const teamPerformanceTrend = [
  { month: 'May', goals: 72, performance: 78, productivity: 74 },
  { month: 'Jun', goals: 75, performance: 79, productivity: 77 },
  { month: 'Jul', goals: 74, performance: 80, productivity: 79 },
  { month: 'Aug', goals: 79, performance: 82, productivity: 81 },
  { month: 'Sep', goals: 83, performance: 84, productivity: 85 },
  { month: 'Oct', goals: 85, performance: 86, productivity: 87 },
]

export const teamKPIs = [
  { name: 'Sprint velocity', value: '64 pts', change: '+8%', positive: true },
  { name: 'Deployment frequency', value: '23 / week', change: '+15%', positive: true },
  { name: 'Change failure rate', value: '4.2%', change: '-1.1 pts', positive: true },
  { name: 'Mean time to recovery', value: '38 min', change: '+6 min', positive: false },
]

/* ---------------- Company performance (HR) ---------------- */

export const ratingBand = (r: number) => (r >= 4.5 ? 'Exceptional' : r >= 4 ? 'Exceeds' : r >= 3.4 ? 'Meets' : 'Developing')

export const ratingDistribution = (() => {
  const bands = { Exceptional: 0, Exceeds: 0, Meets: 0, Developing: 0 }
  for (const e of employees) bands[ratingBand(e.rating) as keyof typeof bands]++
  return Object.entries(bands).map(([band, count]) => ({ band, count }))
})()

export const departmentPerformance = (() => {
  const map = new Map<string, { sum: number; n: number }>()
  for (const e of employees) {
    const v = map.get(e.department) ?? { sum: 0, n: 0 }
    v.sum += e.rating
    v.n++
    map.set(e.department, v)
  }
  return [...map.entries()].map(([department, v]) => ({ department, rating: Math.round((v.sum / v.n) * 100) / 100 }))
})()

export const reviewCycleProgress = { selfReview: 88, managerReview: 64, calibration: 22, deadline: '2026-10-31' }
