import { Award, CalendarX2, Check, CheckCircle2, ClipboardCheck, FileSignature, Plus, UserMinus, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ASSET_ICONS } from '@/components/assets/assetIcons'
import { StatCard } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Field } from '@/components/forms/Field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Progress } from '@/components/ui/misc'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { assetsHeldBy } from '@/data/assets'
import { DEMO_TODAY } from '@/data/attendance'
import { daysUntil } from '@/data/contracts'
import { employeeById } from '@/data/employees'
import { outstandingFor } from '@/data/loans'
import { initialOffboarding, newChecklist, SEPARATION_TYPES } from '@/data/offboarding'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import type { ClearanceItem, OffboardingCase, SeparationType } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format'
import { calculateSettlement } from '@/utils/settlement'

const TYPE_VARIANT: Record<SeparationType, 'info' | 'warning' | 'danger' | 'violet'> = {
  Resignation: 'info',
  'End of Contract': 'warning',
  Termination: 'danger',
  Retirement: 'violet',
}
const OWNERS: ClearanceItem['owner'][] = ['Line Manager', 'IT', 'Custody', 'Finance', 'HR']

const progressOf = (c: OffboardingCase) => Math.round((c.checklist.filter((i) => i.done).length / c.checklist.length) * 100)

export default function OffboardingPage() {
  const [cases, setCases] = useState<OffboardingCase[]>(initialOffboarding)
  const [openId, setOpenId] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)
  const open = cases.find((c) => c.id === openId) ?? null

  const toggle = (caseId: string, itemId: string) =>
    setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, checklist: c.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) } : c)))

  const thisMonth = cases.filter((c) => c.lastWorkingDay.slice(0, 7) === DEMO_TODAY.slice(0, 7))
  const cleared = cases.filter((c) => progressOf(c) === 100)
  const payout = cases.reduce((s, c) => {
    const e = employeeById(c.employeeId)
    return e ? s + Math.max(0, calculateSettlement(e, c, outstandingFor(c.employeeId)).net) : s
  }, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offboarding"
        description="Exit clearance and final settlements for employees leaving Smart Technology."
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus /> Start offboarding
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open cases" value={cases.length} icon={UserMinus} tone="indigo" hint="employees on notice" />
        <StatCard label="Leaving this month" value={thisMonth.length} icon={CalendarX2} tone="amber" hint="last working day in October" />
        <StatCard label="Fully cleared" value={cleared.length} icon={ClipboardCheck} tone="emerald" hint="ready for final payment" />
        <StatCard label="Settlements due" value={formatCurrency(payout)} icon={Wallet} tone="sky" hint="net of loan recovery" />
      </div>

      {cases.length === 0 ? (
        <Card>
          <EmptyState icon={UserMinus} title="No open offboarding cases" />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((c) => {
            const e = employeeById(c.employeeId)
            if (!e) return null
            const pct = progressOf(c)
            const left = daysUntil(c.lastWorkingDay)
            const next = c.checklist.find((i) => !i.done)
            return (
              <Card key={c.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar name={e.name} />
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{e.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{`${e.position} · ${e.department}`}</div>
                    </div>
                  </div>
                  <Badge variant={TYPE_VARIANT[c.type]}>{c.type}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Last working day</div>
                    <div className="mt-0.5 font-medium">{formatDate(c.lastWorkingDay)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Time left</div>
                    <div className={cn('mt-0.5 font-medium', left <= 7 && 'text-warning')}>{left < 0 ? 'Past due' : left === 0 ? 'Today' : `${left} days`}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">Clearance</span>
                    <span className="font-semibold tabular">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" indicatorClassName={pct === 100 ? 'bg-success' : undefined} />
                  <p className="mt-2 truncate text-xs text-muted-foreground">
                    {next ? (
                      <>
                        <span>Next:</span> <span>{next.label}</span>
                      </>
                    ) : (
                      'All clearance steps complete'
                    )}
                  </p>
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setOpenId(c.id)}>
                  Open case
                </Button>
              </Card>
            )
          })}
        </div>
      )}

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="sm:max-w-xl">{open && <CaseDetail c={open} onToggle={(itemId) => toggle(open.id, itemId)} />}</SheetContent>
      </Sheet>

      <NewCaseDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        exclude={cases.map((c) => c.employeeId)}
        onCreate={(c) => {
          setCases((prev) => [c, ...prev])
          setOpenId(c.id)
        }}
      />
    </div>
  )
}

function CaseDetail({ c, onToggle }: { c: OffboardingCase; onToggle: (itemId: string) => void }) {
  const e = employeeById(c.employeeId)!
  const custody = assetsHeldBy(c.employeeId)
  const loans = outstandingFor(c.employeeId)
  const s = calculateSettlement(e, c, loans)
  const pct = progressOf(c)

  return (
    <>
      <div className="border-b px-6 pt-5 pb-4 pe-12">
        <div className="flex items-center gap-3">
          <UserAvatar name={e.name} size="lg" />
          <div className="min-w-0">
            <SheetTitle className="truncate">{e.name}</SheetTitle>
            <SheetDescription>{`${c.type} · ${e.id} · ${e.department}`}</SheetDescription>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">{c.reason}</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5 scrollbar-thin">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-card-title">Clearance checklist</h3>
            <span className="text-xs font-semibold text-muted-foreground tabular">{pct}%</span>
          </div>
          <div className="space-y-4">
            {OWNERS.map((owner) => (
              <div key={owner}>
                <div className="mb-1.5 text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">{owner}</div>
                <ul className="space-y-1">
                  {c.checklist
                    .filter((i) => i.owner === owner)
                    .map((i) => (
                      <li key={i.id}>
                        <button
                          type="button"
                          onClick={() => onToggle(i.id)}
                          aria-pressed={i.done}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-start text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <span className={cn('flex size-5 shrink-0 items-center justify-center rounded border border-input', i.done && 'border-success bg-success text-background')}>
                            {i.done && <Check className="size-3.5" />}
                          </span>
                          <span className={cn(i.done && 'text-muted-foreground line-through')}>{i.label}</span>
                        </button>
                      </li>
                    ))}
                </ul>
                {owner === 'Custody' && (
                  <div className="ms-10 mt-1 space-y-1">
                    {custody.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No custody items on record.</p>
                    ) : (
                      custody.map((a) => {
                        const Icon = ASSET_ICONS[a.category]
                        return (
                          <div key={a.id} className={cn('flex items-center gap-2 text-xs text-muted-foreground', c.checklist.find((i) => i.owner === 'Custody')?.done && 'line-through')}>
                            <Icon className="size-3.5" />
                            <span>{a.name}</span>
                            <span className="font-mono" data-no-translate>
                              {a.serial}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
                {owner === 'Finance' && loans > 0 && !c.checklist.find((i) => i.id === 'CL-6')?.done && <p className="ms-10 mt-1 text-xs text-warning">{`Outstanding loans: ${formatCurrency(loans)}`}</p>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-card-title">Final settlement</h3>
          <div className="rounded-lg border">
            <SettlementRow label={`Salary for ${s.salaryDays} days`} value={s.salaryDue} />
            <SettlementRow label={`Unused leave (${c.unusedLeaveDays} days)`} value={s.leaveEncashment} />
            <SettlementRow label={`End-of-service gratuity (${s.serviceYears.toFixed(1)} years)`} value={s.gratuity} note={c.type === 'Termination' ? 'Forfeited — termination for cause' : 'Per company policy'} />
            <SettlementRow label="Loan & advance recovery" value={s.loanRecovery ? -s.loanRecovery : 0} />
            <div className="flex items-center justify-between border-t bg-muted px-4 py-3">
              <span className="font-semibold">Net settlement</span>
              <span className="text-lg font-bold tabular">{formatCurrency(s.net)}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{`Daily rate ${formatCurrency(s.dailyRate)} (basic salary ÷ 30).`}</p>
        </section>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t px-6 py-3.5 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => toast.success('Experience certificate issued', { description: `Sent to ${e.name} and added to their documents.` })}>
          <Award /> Experience certificate
        </Button>
        <Button
          disabled={pct < 100}
          onClick={() => toast.success('Settlement approved', { description: `${formatCurrency(s.net)} will be paid to ${e.name} with the next payroll.` })}
        >
          <FileSignature /> Approve settlement
        </Button>
      </div>
    </>
  )
}

function SettlementRow({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b px-4 py-2.5 text-sm last:border-b-0">
      <div>
        <div>{label}</div>
        {note && <div className="text-xs text-muted-foreground">{note}</div>}
      </div>
      <span className={cn('tabular', value < 0 && 'text-destructive')}>{value < 0 ? `−${formatCurrency(-value)}` : formatCurrency(value)}</span>
    </div>
  )
}

let caseCounter = 60

function NewCaseDialog({
  open, onOpenChange, exclude, onCreate,
}: { open: boolean; onOpenChange: (o: boolean) => void; exclude: string[]; onCreate: (c: OffboardingCase) => void }) {
  const { employees } = useAppStore()
  const people = useMemo(() => employees.filter((e) => !exclude.includes(e.id) && e.managerId).sort((a, b) => a.name.localeCompare(b.name)), [employees, exclude])
  const [employeeId, setEmployeeId] = useState('')
  const [type, setType] = useState<SeparationType>('Resignation')
  const [lastDay, setLastDay] = useState('2026-11-07')
  const [reason, setReason] = useState('')

  const save = () => {
    if (!employeeId) return
    const e = employeeById(employeeId)!
    onCreate({ id: `OFF-${caseCounter++}`, employeeId, type, noticeDate: DEMO_TODAY, lastWorkingDay: lastDay, reason: reason.trim() || '—', unusedLeaveDays: 8, checklist: newChecklist() })
    toast.success('Offboarding started', { description: `${e.name}'s manager, IT and Finance have been notified.` })
    setEmployeeId('')
    setReason('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start offboarding</DialogTitle>
          <DialogDescription>Creates the clearance checklist and notifies the manager, IT and Finance.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field label="Employee" required>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {people.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {`${e.name} · ${e.department}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Separation type" required>
              <Select value={type} onValueChange={(v) => setType(v as SeparationType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEPARATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Last working day" htmlFor="off-last" required>
              <Input id="off-last" type="date" min={DEMO_TODAY} value={lastDay} onChange={(ev) => setLastDay(ev.target.value)} />
            </Field>
          </div>
          <Field label="Reason" htmlFor="off-reason">
            <Textarea id="off-reason" value={reason} onChange={(ev) => setReason(ev.target.value)} placeholder="e.g. Accepted an offer abroad" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!employeeId}>
            <CheckCircle2 /> Start offboarding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
