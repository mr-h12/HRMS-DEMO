import { ArrowLeft, ArrowRight, Briefcase, CalendarPlus, Mail, MapPin, Plus, Star, UserSearch, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { MiniStat } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Field } from '@/components/forms/Field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEPARTMENT_LIST } from '@/data/employees'
import { jobOpenings, recruitmentFunnel, STAGES } from '@/data/recruitment'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import type { Candidate, CandidateStage } from '@/types'
import { formatDate } from '@/utils/format'

const STAGE_TONE: Record<CandidateStage, string> = {
  Applied: 'bg-slate-400',
  Screening: 'bg-sky-500',
  Interview: 'bg-violet-500',
  Offer: 'bg-amber-500',
  Hired: 'bg-emerald-500',
}

export default function RecruitmentPage() {
  const { candidates, moveCandidate, pushNotification } = useAppStore()
  const [tab, setTab] = useState('pipeline')
  const [jobFilter, setJobFilter] = useState('all')
  const [viewing, setViewing] = useState<Candidate | null>(null)
  const [postOpen, setPostOpen] = useState(false)
  const [newJob, setNewJob] = useState({ title: '', department: 'Technology' })
  const visible = candidates.filter((c) => jobFilter === 'all' || c.jobId === jobFilter)
  const jobTitle = (id: string) => jobOpenings.find((j) => j.id === id)?.title ?? ''

  const move = (c: Candidate, dir: 1 | -1) => {
    const next = STAGES[STAGES.indexOf(c.stage) + dir]
    if (!next) return
    moveCandidate(c.id, next)
    if (viewing?.id === c.id) setViewing({ ...c, stage: next })
    toast.success(`${c.name} moved to ${next}`, { description: jobTitle(c.jobId) })
    if (next === 'Hired') pushNotification({ role: 'hr', kind: 'recruitment', title: 'Candidate hired', message: `${c.name} was hired as ${jobTitle(c.jobId)}. Start onboarding.`, link: '/hr/recruitment' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment"
        description={`${jobOpenings.length} open positions · ${jobOpenings.reduce((s, j) => s + j.applicants, 0)} applicants this cycle`}
        actions={
          <Button onClick={() => setPostOpen(true)}>
            <Plus /> Post job
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {recruitmentFunnel.map((s, i) => (
          <MiniStat key={s.stage} label={s.stage} value={s.value} icon={i === 0 ? Users : i === 4 ? Star : UserSearch} tone={(['slate', 'sky', 'violet', 'amber', 'emerald'] as const)[i]} />
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="positions">Open positions ({jobOpenings.length})</TabsTrigger>
          </TabsList>
          {tab === 'pipeline' && (
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full sm:w-72" aria-label="Filter by position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {jobOpenings.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="pipeline">
          <p className="mb-3 text-xs text-muted-foreground">Showing shortlisted candidates tracked in the ATS ({visible.length}). Move candidates between stages with the arrow buttons.</p>
          <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-thin sm:mx-0 sm:px-0">
            <div className="grid min-w-[1100px] grid-cols-5 gap-4">
              {STAGES.map((stage) => {
                const list = visible.filter((c) => c.stage === stage)
                return (
                  <div key={stage} className="flex flex-col rounded-xl border bg-muted/40 p-3">
                    <div className="mb-3 flex items-center justify-between px-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className={cn('size-2 rounded-full', STAGE_TONE[stage])} /> {stage}
                      </div>
                      <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-xs">{list.length}</span>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      {list.length === 0 && <div className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">No candidates</div>}
                      {list.map((c) => (
                        <div key={c.id} className="group rounded-lg border bg-card p-3 shadow-xs transition hover:shadow-md">
                          <button type="button" onClick={() => setViewing(c)} className="flex w-full items-start gap-2.5 text-start">
                            <UserAvatar name={c.name} size="sm" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[13px] font-semibold group-hover:text-primary">{c.name}</div>
                              <div className="truncate text-[11px] text-muted-foreground">{jobTitle(c.jobId)}</div>
                            </div>
                          </button>
                          <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="truncate">
                              {c.currentCompany} · {c.experience}
                            </span>
                            <span className="inline-flex shrink-0 items-center gap-0.5 font-medium text-foreground">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {c.rating}
                            </span>
                          </div>
                          <div className="mt-2.5 flex gap-1.5 border-t pt-2.5">
                            <Button variant="ghost" size="xs" className="flex-1" disabled={stage === 'Applied'} onClick={() => move(c, -1)} aria-label={`Move ${c.name} back`}>
                              <ArrowLeft className="rtl:-scale-x-100" />
                            </Button>
                            <Button variant="soft" size="xs" className="flex-[3]" disabled={stage === 'Hired'} onClick={() => move(c, 1)}>
                              {stage === 'Hired' ? 'Hired' : `To ${STAGES[STAGES.indexOf(stage) + 1]}`} {stage !== 'Hired' && <ArrowRight className="rtl:-scale-x-100" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {visible.length === 0 && <EmptyState icon={UserSearch} title="No candidates yet" description="Candidates for this position will appear here." />}
        </TabsContent>

        <TabsContent value="positions">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobOpenings.map((j) => {
              const pipeline = candidates.filter((c) => c.jobId === j.id)
              return (
                <Card key={j.id} className="flex flex-col p-5 transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{j.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {j.id} · posted {formatDate(j.postedDate, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <StatusBadge status={j.priority} dot={false} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge variant="secondary">
                      <Briefcase /> {j.department}
                    </Badge>
                    <Badge variant="secondary">
                      <MapPin /> {j.location}
                    </Badge>
                    <Badge variant="secondary">{j.employmentType}</Badge>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-semibold tabular">{j.applicants}</div>
                      <div className="text-xs text-muted-foreground">Applicants</div>
                    </div>
                    <div className="text-end text-xs text-muted-foreground">
                      <div>{j.salaryRange}</div>
                      <div>Hiring manager: {j.hiringManager}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-muted">
                    {STAGES.map((s) => {
                      const n = pipeline.filter((c) => c.stage === s).length
                      return n ? <div key={s} className={STAGE_TONE[s]} style={{ width: `${(n / Math.max(pipeline.length, 1)) * 100}%` }} title={`${s}: ${n}`} /> : null
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setJobFilter(j.id)
                      setTab('pipeline')
                    }}
                  >
                    View pipeline <ArrowRight className="rtl:-scale-x-100" />
                  </Button>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <UserAvatar name={viewing.name} size="lg" />
                  <div>
                    <DialogTitle>{viewing.name}</DialogTitle>
                    <DialogDescription>
                      {jobTitle(viewing.jobId)} · <StatusBadge status={viewing.stage} className="ms-1 align-middle" />
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <DialogBody className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Email', viewing.email],
                  ['Current company', viewing.currentCompany],
                  ['Experience', viewing.experience],
                  ['Source', viewing.source],
                  ['Applied', formatDate(viewing.appliedDate)],
                  ['Screening score', `${viewing.rating} / 5`],
                ].map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <div className="text-xs text-muted-foreground">{k}</div>
                    <div className="truncate font-medium">{v}</div>
                  </div>
                ))}
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast.success('Email drafted', { description: `To ${viewing.email}` })}>
                  <Mail /> Email
                </Button>
                <Button variant="outline" onClick={() => toast.success('Interview scheduled', { description: `${viewing.name} · Sunday, Oct 11 at 11:00 AM with ${jobOpenings.find((j) => j.id === viewing.jobId)?.hiringManager}` })}>
                  <CalendarPlus /> Schedule interview
                </Button>
                <Button disabled={viewing.stage === 'Hired'} onClick={() => move(viewing, 1)}>
                  Advance <ArrowRight className="rtl:-scale-x-100" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post a new job</DialogTitle>
            <DialogDescription>The job will be published to the careers page and LinkedIn.</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <Field label="Job title" htmlFor="job-title" required>
              <Input id="job-title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} placeholder="e.g. QA Automation Engineer" />
            </Field>
            <Field label="Department">
              <Select value={newJob.department} onValueChange={(v) => setNewJob({ ...newJob, department: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_LIST.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newJob.title.trim()}
              onClick={() => {
                toast.success('Job submitted for approval', { description: `${newJob.title} · ${newJob.department} — pending budget approval` })
                setPostOpen(false)
                setNewJob({ title: '', department: 'Technology' })
              }}
            >
              Submit for approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
