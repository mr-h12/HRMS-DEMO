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
    { name: 'Product & Technical Knowledge', score: 4.7 },
    { name: 'Ownership', score: 4.5 },
    { name: 'Collaboration', score: 4.3 },
    { name: 'Communication', score: 4.0 },
    { name: 'Customer Focus', score: 4.2 },
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
  { name: 'Quotations sent', target: 40, actual: 46, unit: '', trend: 'up' },
  { name: 'Quotation win rate', target: 30, actual: 34, unit: '%', trend: 'up' },
  { name: 'Average quotation turnaround', target: 48, actual: 30, unit: 'hrs', trend: 'up' },
  { name: 'Quotations returned by Team Leader', target: 3, actual: 2, unit: '', trend: 'flat' },
  { name: 'Customer visits / month', target: 8, actual: 6, unit: '', trend: 'down' },
]

export const ahmedGoals: Goal[] = [
  { id: 'G-1', title: 'Close EGP 12M in quotations won this half', description: 'Electrical supplies and solar packages across own customers; tracked from the CRM deal pipeline.', progress: 75, dueDate: '2026-12-31', status: 'On Track', weight: 35 },
  { id: 'G-2', title: 'Grow solar package sales to 5 new customers', description: 'Pair with the Solar Design team on PV sizing for factories and compounds.', progress: 60, dueDate: '2026-12-15', status: 'On Track', weight: 25 },
  { id: 'G-3', title: 'Complete Solar PV System Design certification', description: 'Finish the self-paced course and pass the internal assessment.', progress: 40, dueDate: '2026-11-15', status: 'At Risk', weight: 15 },
  { id: 'G-4', title: 'Coach two junior sales engineers', description: 'Weekly 1:1s with Ali Hamdy and Reem Nabil; review at least five of their quotations each before submission.', progress: 85, dueDate: '2026-12-31', status: 'On Track', weight: 15 },
  { id: 'G-5', title: 'Move all customer quotations into the CRM', description: 'Retire the spreadsheet price lists; every quotation goes through Team Leader approval in the CRM.', progress: 100, dueDate: '2026-09-30', status: 'Completed', weight: 10 },
]

export const ahmedFeedback: FeedbackEntry[] = [
  {
    id: 'FB-1', author: 'Mohamed Ali', authorTitle: 'Sales Team Leader', date: '2026-09-30', rating: 4.5, cycle: 'Q3 2026 check-in',
    comment: 'Ahmed closed the factory solar package with excellent judgment on margin and kept the customer informed throughout. His quotations are now the reference for the team. Next step: delegate more and grow Ali and Reem into owning accounts end-to-end.',
  },
  {
    id: 'FB-2', author: 'Hossam Fathy', authorTitle: 'Deputy Team Leader', date: '2026-09-18', rating: 4.5, cycle: 'Peer feedback',
    comment: 'Always the first to pick up an urgent customer request, and his handovers to Procurement are complete and clear. Would love to see him share more in the weekly pipeline review.',
  },
  {
    id: 'FB-3', author: 'Mohamed Ali', authorTitle: 'Sales Team Leader', date: '2026-06-28', rating: 4.3, cycle: 'H1 2026 review',
    comment: 'Strong half. Won the New Capital cabling tender two weeks ahead of the deadline. Focus areas for H2: more field visits with outdoor sales and the solar certification goal.',
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
  { name: 'Quotations sent', value: '312 / month', change: '+8%', positive: true },
  { name: 'Win rate', value: '31%', change: '+3 pts', positive: true },
  { name: 'Quotations returned', value: '4.2%', change: '-1.1 pts', positive: true },
  { name: 'Approval turnaround', value: '38 min', change: '+6 min', positive: false },
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
