/**
 * Egyptian social insurance and salary tax — demo rules.
 *
 * Social insurance (Law 148/2019): contributions are charged on the insurable wage, which is the monthly
 * wage clamped between a minimum and maximum that rise each January.
 * Salary tax (Law 91/2005 as amended by Law 7/2024): progressive annual brackets after the personal exemption.
 *
 * The figures below are configuration, not legal advice — confirm the current limits with the company accountant.
 * The high-income rule that withdraws the lower brackets is not modelled.
 */
export const INSURANCE_RULES = {
  year: 2025,
  minInsurableWage: 2300,
  maxInsurableWage: 14500,
  employeeRate: 0.11,
  employerRate: 0.1875,
}

export const TAX_RULES = {
  personalExemption: 20000,
  /** [upper bound of the annual bracket, rate] */
  brackets: [
    [40000, 0],
    [55000, 0.1],
    [70000, 0.15],
    [200000, 0.2],
    [400000, 0.225],
    [1200000, 0.25],
    [Infinity, 0.275],
  ] as [number, number][],
}

export type InsuranceCap = 'min' | 'max' | null

export interface SalaryBreakdown {
  gross: number
  insurableWage: number
  cap: InsuranceCap
  employeeInsurance: number
  employerInsurance: number
  annualTaxable: number
  monthlyTax: number
  net: number
  /** Annual tax per bracket, for the calculator's step-by-step view. */
  bracketTax: { from: number; to: number; rate: number; tax: number }[]
}

export function annualSalaryTax(taxable: number) {
  let lower = 0
  const steps: SalaryBreakdown['bracketTax'] = []
  for (const [upper, rate] of TAX_RULES.brackets) {
    if (taxable <= lower) break
    const slice = Math.min(taxable, upper) - lower
    steps.push({ from: lower, to: Math.min(taxable, upper), rate, tax: slice * rate })
    lower = upper
  }
  return { total: steps.reduce((s, b) => s + b.tax, 0), steps }
}

export function breakdown(gross: number): SalaryBreakdown {
  const { minInsurableWage: min, maxInsurableWage: max, employeeRate, employerRate } = INSURANCE_RULES
  const insurableWage = Math.min(Math.max(gross, min), max)
  const cap: InsuranceCap = gross > max ? 'max' : gross < min ? 'min' : null
  const employeeInsurance = Math.round(insurableWage * employeeRate)
  const employerInsurance = Math.round(insurableWage * employerRate)
  const annualTaxable = Math.max(0, (gross - employeeInsurance) * 12 - TAX_RULES.personalExemption)
  const { total, steps } = annualSalaryTax(annualTaxable)
  const monthlyTax = Math.round(total / 12)
  return { gross, insurableWage, cap, employeeInsurance, employerInsurance, annualTaxable, monthlyTax, net: gross - employeeInsurance - monthlyTax, bracketTax: steps }
}
