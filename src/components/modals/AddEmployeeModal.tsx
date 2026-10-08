import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { FileDrop, Field } from '@/components/forms/Field'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTMENT_LIST, EMPLOYMENT_TYPES, LOCATIONS } from '@/data/employees'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import type { Department, Employee, EmploymentType, Location } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format'

const STEPS = ['Personal', 'Employment', 'Salary', 'Documents', 'Review'] as const

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'Male' | 'Female'
  nationality: string
  department: Department
  position: string
  managerId: string
  location: Location
  employmentType: EmploymentType
  joiningDate: string
  basicSalary: string
  housing: string
  transport: string
  bank: string
  iban: string
  docs: Record<string, File | null>
}

const INITIAL: FormState = {
  firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'Female', nationality: 'Egyptian',
  department: 'Technology', position: '', managerId: '', location: 'Cairo HQ', employmentType: 'Full-time', joiningDate: '2026-11-01',
  basicSalary: '', housing: '', transport: '150', bank: 'Commercial International Bank (CIB)', iban: '',
  docs: { 'National ID / Passport': null, 'Signed offer letter': null, 'Educational certificate': null },
}

function SelectField<T extends string>({ value, onChange, options, render }: { value: T; onChange: (v: T) => void; options: readonly T[]; render?: (v: T) => ReactNode }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger>
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {render ? render(o) : o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function AddEmployeeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { employees, addEmployee, pushNotification, openEmployee } = useAppStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))

  const managers = employees.filter((e) => e.department === form.department && /Manager|Director|Head|Chief|Counsel/.test(e.position))
  const manager = employees.find((e) => e.id === form.managerId)
  const gross = Number(form.basicSalary || 0) + Number(form.housing || 0) + Number(form.transport || 0)

  const validate = (s: number) => {
    const e: Record<string, string> = {}
    if (s === 0) {
      if (!form.firstName.trim()) e.firstName = 'Required'
      if (!form.lastName.trim()) e.lastName = 'Required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
      if (form.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number'
      if (!form.dateOfBirth) e.dateOfBirth = 'Required'
    }
    if (s === 1) {
      if (!form.position.trim()) e.position = 'Required'
      if (!form.managerId) e.managerId = 'Select a reporting manager'
      if (!form.joiningDate) e.joiningDate = 'Required'
    }
    if (s === 2) {
      const b = Number(form.basicSalary)
      if (!b || b < 300) e.basicSalary = 'Enter a monthly basic salary (min $300)'
      if (form.iban.replace(/\s/g, '').length < 15) e.iban = 'Enter a valid IBAN'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const close = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep(0)
      setForm(INITIAL)
      setErrors({})
    }, 200)
  }

  const next = () => validate(step) && setStep((s) => Math.min(STEPS.length - 1, s + 1))

  const submit = () => {
    setSaving(true)
    setTimeout(() => {
      const maxId = Math.max(...employees.map((e) => Number(e.id.slice(4))))
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`
      const emp: Employee = {
        id: `EMP-${maxId + 1}`, name, email: form.email, phone: form.phone, position: form.position.trim(), department: form.department,
        team: manager?.team ?? 'General', location: form.location, employmentType: form.employmentType, managerId: form.managerId,
        managerName: manager?.name ?? '—', joiningDate: form.joiningDate, status: 'Probation', basicSalary: Number(form.basicSalary),
        rating: 3.5, attendanceRate: 100, gender: form.gender, dateOfBirth: form.dateOfBirth, nationality: form.nationality,
      }
      addEmployee(emp)
      pushNotification({ role: 'hr', kind: 'system', title: 'Employee created', message: `${name} (${emp.id}) was added to ${emp.department}. Onboarding checklist started.`, link: '/hr/employees' })
      toast.success(`${name} added`, {
        description: `${emp.id} · ${emp.position} · starts ${formatDate(emp.joiningDate)}`,
        action: { label: 'View', onClick: () => openEmployee(emp.id) },
      })
      setSaving(false)
      close()
    }, 900)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add employee</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {STEPS.length} · {['Personal information', 'Employment information', 'Salary information', 'Documents', 'Review & confirm'][step]}
          </DialogDescription>
        </DialogHeader>
        <div className="border-b px-6 py-4">
          <ol className="flex items-center">
            {STEPS.map((s, i) => (
              <li key={s} className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')}>
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className="flex items-center gap-2"
                  aria-current={i === step ? 'step' : undefined}
                >
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition',
                      i < step && 'border-primary bg-primary text-primary-foreground',
                      i === step && 'border-primary text-primary ring-4 ring-primary/15',
                      i > step && 'text-muted-foreground',
                    )}
                  >
                    {i < step ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span className={cn('hidden text-xs font-medium md:inline', i === step ? 'text-foreground' : 'text-muted-foreground')}>{s}</span>
                </button>
                {i < STEPS.length - 1 && <span className={cn('mx-2 h-px flex-1', i < step ? 'bg-primary' : 'bg-border')} />}
              </li>
            ))}
          </ol>
        </div>
        <DialogBody className="min-h-[340px]">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" htmlFor="f-first" error={errors.firstName} required>
                <Input id="f-first" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="Nour" />
              </Field>
              <Field label="Last name" htmlFor="f-last" error={errors.lastName} required>
                <Input id="f-last" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Abdelrahman" />
              </Field>
              <Field label="Work email" htmlFor="f-email" error={errors.email} required>
                <Input
                  id="f-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder={form.firstName && form.lastName ? `${form.firstName}.${form.lastName}@northwind.co`.toLowerCase().replace(/\s/g, '') : 'name@northwind.co'}
                />
              </Field>
              <Field label="Phone" htmlFor="f-phone" error={errors.phone} required>
                <Input id="f-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+20 100 123 4567" />
              </Field>
              <Field label="Date of birth" htmlFor="f-dob" error={errors.dateOfBirth} required>
                <Input id="f-dob" type="date" value={form.dateOfBirth} max="2008-01-01" onChange={(e) => set('dateOfBirth', e.target.value)} />
              </Field>
              <Field label="Gender">
                <SelectField value={form.gender} onChange={(v) => set('gender', v)} options={['Female', 'Male'] as const} />
              </Field>
              <Field label="Nationality" className="sm:col-span-2">
                <SelectField value={form.nationality} onChange={(v) => set('nationality', v)} options={['Egyptian', 'Emirati', 'Saudi', 'Jordanian', 'Lebanese', 'Other'] as const} />
              </Field>
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Department" required>
                <SelectField value={form.department} onChange={(v) => setForm((f) => ({ ...f, department: v, managerId: '' }))} options={DEPARTMENT_LIST} />
              </Field>
              <Field label="Job title" htmlFor="f-pos" error={errors.position} required>
                <Input id="f-pos" value={form.position} onChange={(e) => set('position', e.target.value)} placeholder="e.g. Backend Engineer" />
              </Field>
              <Field label="Reporting manager" error={errors.managerId} required>
                <Select value={form.managerId} onValueChange={(v) => set('managerId', v)}>
                  <SelectTrigger aria-invalid={!!errors.managerId}>
                    <SelectValue placeholder="Select manager…" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} — {m.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Joining date" htmlFor="f-join" error={errors.joiningDate} required>
                <Input id="f-join" type="date" value={form.joiningDate} onChange={(e) => set('joiningDate', e.target.value)} />
              </Field>
              <Field label="Work location">
                <SelectField value={form.location} onChange={(v) => set('location', v)} options={LOCATIONS} />
              </Field>
              <Field label="Employment type">
                <SelectField value={form.employmentType} onChange={(v) => set('employmentType', v)} options={EMPLOYMENT_TYPES} />
              </Field>
              <div className="rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground sm:col-span-2">New employees start with a 3-month probation period and are enrolled in the onboarding program automatically.</div>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Basic salary (USD / month)" htmlFor="f-basic" error={errors.basicSalary} required>
                <Input id="f-basic" type="number" min="0" value={form.basicSalary} onChange={(e) => set('basicSalary', e.target.value)} placeholder="2,200" />
              </Field>
              <Field label="Housing allowance" htmlFor="f-housing" hint="Suggested: 20% of basic">
                <Input id="f-housing" type="number" min="0" value={form.housing} onChange={(e) => set('housing', e.target.value)} placeholder={form.basicSalary ? String(Math.round(Number(form.basicSalary) * 0.2)) : '440'} />
              </Field>
              <Field label="Transportation allowance" htmlFor="f-transport">
                <Input id="f-transport" type="number" min="0" value={form.transport} onChange={(e) => set('transport', e.target.value)} />
              </Field>
              <Field label="Bank" className="sm:col-span-1">
                <SelectField value={form.bank} onChange={(v) => set('bank', v)} options={['Commercial International Bank (CIB)', 'National Bank of Egypt', 'QNB Al Ahli', 'Emirates NBD', 'Al Rajhi Bank'] as const} />
              </Field>
              <Field label="IBAN" htmlFor="f-iban" error={errors.iban} required className="sm:col-span-2">
                <Input id="f-iban" dir="ltr" value={form.iban} onChange={(e) => set('iban', e.target.value.toUpperCase())} placeholder="EG38 0019 0005 0000 0000 2631 8000 2" />
              </Field>
              <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 sm:col-span-3">
                <span className="text-sm text-muted-foreground">Monthly gross salary</span>
                <span className="text-lg font-semibold text-primary tabular">{formatCurrency(gross)}</span>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              {Object.keys(form.docs).map((label, i) => (
                <Field key={label} label={label} hint={i === 0 ? 'Required before the first payroll run' : 'Optional — can be uploaded later'}>
                  <FileDrop id={`f-doc-${i}`} file={form.docs[label]} onFile={(f) => set('docs', { ...form.docs, [label]: f })} />
                </Field>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <UserAvatar name={`${form.firstName} ${form.lastName}`} size="lg" />
                <div>
                  <div className="text-base font-semibold">
                    {form.firstName} {form.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {form.position} · {form.department}
                  </div>
                </div>
              </div>
              {[
                { title: 'Personal', items: [['Email', form.email], ['Phone', form.phone], ['Date of birth', form.dateOfBirth ? formatDate(form.dateOfBirth) : '—'], ['Nationality', form.nationality]] },
                { title: 'Employment', items: [['Manager', manager?.name ?? '—'], ['Joining date', formatDate(form.joiningDate)], ['Location', form.location], ['Type', form.employmentType]] },
                { title: 'Salary', items: [['Basic', formatCurrency(Number(form.basicSalary || 0))], ['Allowances', formatCurrency(Number(form.housing || 0) + Number(form.transport || 0))], ['Gross', formatCurrency(gross)], ['Bank', form.bank.split(' (')[0]]] },
              ].map((sec, i) => (
                <div key={sec.title}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{sec.title}</span>
                    <Button variant="link" size="xs" onClick={() => setStep(i)}>
                      Edit
                    </Button>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 rounded-xl border p-4 text-sm sm:grid-cols-4">
                    {sec.items.map(([k, v]) => (
                      <div key={k} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{k}</dt>
                        <dd className="truncate font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
              <div className="text-xs text-muted-foreground">
                Documents attached: {Object.values(form.docs).filter(Boolean).length} of {Object.keys(form.docs).length}
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={step === 0 ? close : () => setStep((s) => s - 1)}>
            {step === 0 ? 'Cancel' : (
              <>
                <ChevronLeft className="rtl:-scale-x-100" /> Back
              </>
            )}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Continue <ChevronRight className="rtl:-scale-x-100" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Check />} Create employee
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
