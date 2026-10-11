import { CalendarCheck2, Check, ClipboardList, Hourglass, Star, UserCheck, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Field } from '@/components/forms/Field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/input'
import { Progress } from '@/components/ui/misc'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEMO_TODAY } from '@/data/attendance'
import { daysUntil } from '@/data/contracts'
import { caseForCandidate, isPreJoining, PHASES, probationCases } from '@/data/onboarding'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import type { OnboardingCase, OnboardingTask, ProbationDecision } from '@/types'
import { formatDate } from '@/utils/format'

const progressOf = (tasks: OnboardingTask[]) => Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
const DECISIONS: { value: ProbationDecision; label: string }[] = [
  { value: 'Confirmed', label: 'Confirm employment' },
  { value: 'Extended', label: 'Extend probation' },
  { value: 'Not confirmed', label: 'End employment' },
]

export default function OnboardingPage() {
  const { candidates, pushNotification } = useAppStore()
  const [tasks, setTasks] = useState<Record<string, OnboardingTask[]>>({})
  const [decisions, setDecisions] = useState<Record<string, ProbationDecision>>({})
  const [tab, setTab] = useState<'pre' | 'probation'>('pre')
  const [openId, setOpenId] = useState<string | null>(null)

  // Hired candidates join the pre-boarding list automatically, so moving someone to "Hired" in Recruitment shows up here.
  const hired = candidates.filter((c) => c.stage === 'Hired').map((c, i) => caseForCandidate(c, i))
  const cases: OnboardingCase[] = [...hired, ...probationCases].map((c) => ({ ...c, tasks: tasks[c.id] ?? c.tasks, decision: decisions[c.id] }))
  const pre = cases.filter(isPreJoining)
  const probation = cases.filter((c) => !isPreJoining(c))
  const open = cases.find((c) => c.id === openId) ?? null
  const list = tab === 'pre' ? pre : probation

  const toggle = (c: OnboardingCase, taskId: string) => setTasks((prev) => ({ ...prev, [c.id]: c.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }))

  const decide = (c: OnboardingCase, decision: ProbationDecision) => {
    setDecisions((prev) => ({ ...prev, [c.id]: decision }))
    const text = decision === 'Confirmed' ? 'moves to an indefinite contract' : decision === 'Extended' ? 'has probation extended by 3 months' : 'will not be confirmed'
    toast.success(`Probation decision recorded`, { description: `${c.name} ${text}.` })
    pushNotification({ role: 'hr', kind: 'performance', title: 'Probation decision', message: `${c.name} — ${decision}`, link: '/hr/onboarding' })
  }

  const joiningThisMonth = cases.filter((c) => c.startDate.slice(0, 7) === DEMO_TODAY.slice(0, 7) || (c.startDate > DEMO_TODAY && daysUntil(c.startDate) <= 31)).length
  const reviewsDue = probation.filter((c) => !c.decision && daysUntil(c.probationEnd) <= 30).length

  return (
    <div className="space-y-6">
      <PageHeader title="Onboarding" description="New hires from signed offer to the end of probation." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Joining soon" value={pre.length} icon={UserPlus} tone="indigo" hint="hired, not started yet" onClick={() => setTab('pre')} />
        <StatCard label="Starting within 31 days" value={joiningThisMonth} icon={CalendarCheck2} tone="sky" />
        <StatCard label="In probation" value={probation.length} icon={Hourglass} tone="violet" hint="first 3 months" onClick={() => setTab('probation')} />
        <StatCard label="Probation reviews due" value={reviewsDue} icon={UserCheck} tone="amber" hint="within 30 days" onClick={() => setTab('probation')} />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="pre">
            <UserPlus className="size-4" /> {`Before joining (${pre.length})`}
          </TabsTrigger>
          <TabsTrigger value="probation">
            <Hourglass className="size-4" /> {`In probation (${probation.length})`}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {list.length === 0 ? (
        <Card>
          <EmptyState icon={UserPlus} title="No new hires here" description="Move a candidate to Hired in Recruitment to start their onboarding." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => {
            const pct = progressOf(c.tasks)
            const next = c.tasks.find((t) => !t.done)
            const startIn = daysUntil(c.startDate)
            const endIn = daysUntil(c.probationEnd)
            return (
              <Card key={c.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar name={c.name} />
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{c.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{`${c.position} · ${c.department}`}</div>
                    </div>
                  </div>
                  {c.decision ? <StatusBadge status={c.decision} /> : isPreJoining(c) ? <Badge variant="info">{startIn === 1 ? 'Starts tomorrow' : `Starts in ${startIn} days`}</Badge> : <Badge variant={endIn <= 30 ? 'warning' : 'violet'}>{endIn < 0 ? 'Review overdue' : `${endIn} days left`}</Badge>}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">{isPreJoining(c) ? 'Start date' : 'Joined'}</div>
                    <div className="mt-0.5 font-medium">{formatDate(c.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Probation ends</div>
                    <div className="mt-0.5 font-medium">{formatDate(c.probationEnd)}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">Checklist</span>
                    <span className="font-semibold tabular">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" indicatorClassName={pct === 100 ? 'bg-success' : undefined} />
                  <p className="mt-2 truncate text-xs text-muted-foreground">
                    {next ? (
                      <>
                        <span>Next:</span> <span>{next.label}</span>
                      </>
                    ) : (
                      'Checklist complete'
                    )}
                  </p>
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setOpenId(c.id)}>
                  Open onboarding
                </Button>
              </Card>
            )
          })}
        </div>
      )}

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="sm:max-w-xl">{open && <OnboardingDetail c={open} onToggle={(id) => toggle(open, id)} onDecide={(d) => decide(open, d)} />}</SheetContent>
      </Sheet>
    </div>
  )
}

function OnboardingDetail({ c, onToggle, onDecide }: { c: OnboardingCase; onToggle: (taskId: string) => void; onDecide: (d: ProbationDecision) => void }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const pct = progressOf(c.tasks)
  const reviewReady = c.tasks.filter((t) => t.phase === 'First 90 days' && t.label !== 'Final probation review').every((t) => t.done)

  return (
    <>
      <div className="border-b px-6 pt-5 pb-4 pe-12">
        <div className="flex items-center gap-3">
          <UserAvatar name={c.name} size="lg" />
          <div className="min-w-0">
            <SheetTitle className="truncate">{c.name}</SheetTitle>
            <SheetDescription>{`${c.position} · ${c.department} · ${c.location}`}</SheetDescription>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 rounded-lg bg-muted px-3 py-2.5 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Start date</div>
            <div className="font-medium">{formatDate(c.startDate)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Probation ends</div>
            <div className="font-medium">{formatDate(c.probationEnd)}</div>
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Buddy</div>
            <div className="truncate font-medium">{c.buddy}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5 scrollbar-thin">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-card-title">Onboarding checklist</h3>
            <span className="text-xs font-semibold text-muted-foreground tabular">{pct}%</span>
          </div>
          <div className="space-y-4">
            {PHASES.map((phase) => (
              <div key={phase}>
                <div className="mb-1.5 text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">{phase}</div>
                <ul className="space-y-1">
                  {c.tasks
                    .filter((t) => t.phase === phase)
                    .map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => onToggle(t.id)}
                          aria-pressed={t.done}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-start text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <span className={cn('flex size-5 shrink-0 items-center justify-center rounded border border-input', t.done && 'border-success bg-success text-background')}>{t.done && <Check className="size-3.5" />}</span>
                          <span className={cn(t.done && 'text-muted-foreground line-through')}>{t.label}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {!isPreJoining(c) && (
          <section>
            <h3 className="mb-1 text-card-title">Probation review</h3>
            {c.decision ? (
              <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                <ClipboardList className="size-4 text-muted-foreground" /> Decision recorded: <StatusBadge status={c.decision} />
              </div>
            ) : !reviewReady ? (
              <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Complete the training and the 30- and 60-day check-ins to unlock the final review.</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Rate the first three months and record the decision.</p>
                <div className="flex gap-1" role="radiogroup" aria-label="Overall rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} of 5`} onClick={() => setRating(n)} className="rounded p-1 focus-visible:outline-2 focus-visible:outline-ring">
                      <Star className={cn('size-6', n <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40')} />
                    </button>
                  ))}
                </div>
                <Field label="Manager comments" htmlFor="prob-comment">
                  <Textarea id="prob-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Strengths, areas to improve, readiness for the role" />
                </Field>
                <div className="flex flex-wrap gap-2">
                  {DECISIONS.map((d) => (
                    <Button
                      key={d.value}
                      variant={d.value === 'Confirmed' ? 'default' : 'outline'}
                      className={d.value === 'Not confirmed' ? 'text-destructive hover:text-destructive' : undefined}
                      disabled={rating === 0}
                      onClick={() => onDecide(d.value)}
                    >
                      {d.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  )
}
