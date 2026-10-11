import type { Asset, AssetCategory, Department, Location } from '@/types'
import { createRng } from '@/utils/random'
import { DEMO_TODAY } from './attendance'
import { EMPLOYEE_ID, employees, MANAGER_ID } from './employees'

/** What each category is called in the register, its value range (EGP) and who typically holds it. */
const CATALOG: Record<AssetCategory, { names: string[]; prefix: string; value: [number, number]; holders: (Department | Location)[] }> = {
  Laptop: { names: ['Dell Latitude 5440', 'Lenovo ThinkPad E14', 'HP ProBook 450 G10'], prefix: 'LT', value: [38000, 62000], holders: ['Cairo HQ'] },
  'Mobile Phone': { names: ['Samsung Galaxy A55', 'iPhone 13', 'Xiaomi Redmi Note 13'], prefix: 'MP', value: [12000, 32000], holders: ['Sales', 'Field'] },
  Vehicle: { names: ['Toyota Hilux pickup', 'Nissan Sunny', 'Hyundai H-1 van'], prefix: 'VH', value: [850000, 1650000], holders: ['Field', 'Construction Sites', 'Solar Sites'] },
  'Power Tools': { names: ['Bosch hammer drill', 'Makita angle grinder', 'DeWalt impact driver kit'], prefix: 'PT', value: [4500, 14000], holders: ['Construction Sites'] },
  'Safety Gear': { names: ['Full-body safety harness', 'Arc-flash PPE kit', 'Insulated glove set'], prefix: 'SG', value: [1800, 6500], holders: ['Construction Sites', 'Solar Sites'] },
  'Solar Test Equipment': { names: ['Fluke solar PV analyzer', 'I-V curve tracer', 'Thermal imaging camera'], prefix: 'ST', value: [45000, 180000], holders: ['Solar Sites'] },
  'Survey Equipment': { names: ['Leica laser distance meter', 'Total station', 'Digital level'], prefix: 'SV', value: [9000, 260000], holders: ['Construction Sites'] },
}

export const ASSET_CATEGORIES = Object.keys(CATALOG) as AssetCategory[]

function holdersFor(category: AssetCategory) {
  const wanted = CATALOG[category].holders
  return employees.filter((e) => e.status !== 'Notice Period' && (wanted.includes(e.department) || wanted.includes(e.location)))
}

function build(): Asset[] {
  const rng = createRng(4207)
  const out: Asset[] = []
  let n = 1
  const add = (category: AssetCategory, a: Partial<Asset>) => {
    const spec = CATALOG[category]
    out.push({
      id: `AST-${String(n++).padStart(4, '0')}`,
      name: rng.pick(spec.names),
      category,
      serial: `${spec.prefix}-${rng.int(10000, 99999)}`,
      value: Math.round(rng.int(spec.value[0], spec.value[1]) / 500) * 500,
      status: 'Assigned',
      employeeId: null,
      assignedOn: null,
      ...a,
    })
  }
  // The personas' own custody, so it shows up on their profiles.
  add('Laptop', { employeeId: EMPLOYEE_ID, assignedOn: '2023-03-12', name: 'Dell Latitude 5440' })
  add('Mobile Phone', { employeeId: EMPLOYEE_ID, assignedOn: '2024-01-08', name: 'Samsung Galaxy A55' })
  add('Laptop', { employeeId: MANAGER_ID, assignedOn: '2022-06-01', name: 'Lenovo ThinkPad E14' })
  add('Vehicle', { employeeId: MANAGER_ID, assignedOn: '2023-09-15', name: 'Nissan Sunny' })

  // Employees leaving the company still hold custody that must be returned.
  for (const e of employees.filter((x) => x.status === 'Notice Period')) {
    add(e.location === 'Cairo HQ' ? 'Laptop' : 'Power Tools', { employeeId: e.id, assignedOn: e.joiningDate })
    if (e.location !== 'Cairo HQ') add('Safety Gear', { employeeId: e.id, assignedOn: e.joiningDate })
  }

  const plan: [AssetCategory, number][] = [['Laptop', 6], ['Mobile Phone', 5], ['Vehicle', 4], ['Power Tools', 5], ['Safety Gear', 6], ['Solar Test Equipment', 4], ['Survey Equipment', 3]]
  for (const [category, count] of plan) {
    const pool = holdersFor(category)
    for (let i = 0; i < count; i++) {
      const roll = rng.next()
      if (roll < 0.12) add(category, { status: 'In Stock' })
      else if (roll < 0.2) add(category, { status: 'In Repair' })
      else if (roll < 0.23) {
        const e = rng.pick(pool)
        add(category, { status: 'Lost', employeeId: e.id, assignedOn: `2025-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')}` })
      } else {
        const e = rng.pick(pool)
        const year = Math.max(Number(e.joiningDate.slice(0, 4)), 2022)
        const date = `${year}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')}`
        add(category, { employeeId: e.id, assignedOn: date > DEMO_TODAY ? e.joiningDate : date })
      }
    }
  }
  return out
}

export const initialAssets: Asset[] = build()

export const assetsHeldBy = (employeeId: string, assets: Asset[] = initialAssets) =>
  assets.filter((a) => a.employeeId === employeeId && (a.status === 'Assigned' || a.status === 'Lost'))
