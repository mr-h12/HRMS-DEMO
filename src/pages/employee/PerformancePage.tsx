import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarClock, MessageSquareQuote, PenLine, Star, Target, Trophy } from 'lucide-react'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { axisProps, ChartTooltip, gridProps } from '@/components/charts/ChartTooltip'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/input'
import { Progress } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ahmedFeedback, ahmedGoals, ahmedKPIs, ahmedPerformance, REVIEW_CYCLE } from '@/data/performance'
import { cn } from '@/lib/utils'
import type { Goal } from '@/types'
import { formatDate } from '@/utils/format'

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn('size-4', value >= i - 0.25 ? 'fill-amber-400 text-amber-400' : value >= i - 0.75 ? 'fill-amber-400/50 text-amber-400' : 'text-muted-foreground/30')} />
      ))}
    </span>
  )
}

export default function PerformancePage() {
  const [goals, setGoals] = useState<Goal[]>(ahmedGoals)
  const [editing, setEditing] = useState<Goal | null>(null)
  const [progress, setProgress] = useState(0)
  const [note, setNote] = useState('')
  const weighted = Math.round(goals.reduce((s, g) => s + g.progress * g.weight, 0) / goals.reduce((s, g) => s + g.weight, 0))

  const saveGoal = () => {
    if (!editing) return
    setGoals((prev) => prev.map((g) => (g.id === editing.id ? { ...g, progress, status: progress >= 100 ? 'Completed' : g.status === 'Completed' ? 'On Track' : g.status } : g)))
    toast.success('Goal progress updated', { description: `${editing.title} — ${progress}%` })
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance"
        description={`${REVIEW_CYCLE} · self-review due Oct 12, review meeting Oct 15`}
        actions={
          <Button onClick={() => toast.success('Self-review draft opened', { description: 'Your progress is saved automatically.' })}>
            <PenLine /> Start self-review
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="relative overflow-hidden p-6">
          <div className="absolute -top-10 -end-10 size-36 rounded-full bg-amber-400/10" />
          <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <Trophy className="size-4 text-amber-500" /> Current rating
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight tabular">{ahmedPerformance.rating}</span>
            <span className="mb-1.5 text-muted-foreground">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={ahmedPerformance.rating} />
            <StatusBadge status="Exceeds" dot={false} />
          </div>
          <p className="mt-1 text-sm font-medium">{ahmedPerformance.label}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Previous cycle</div>
              <div className="flex items-center gap-1 font-semibold">
                {ahmedPerformance.previousRating} <ArrowUpRight className="size-3.5 text-emerald-500 rtl:-scale-x-100" />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Company percentile</div>
              <div className="font-semibold">Top {100 - ahmedPerformance.percentile}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Goals completion</div>
              <div className="font-semibold">{weighted}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Next review</div>
              <div className="flex items-center gap-1 font-semibold">
                <CalendarClock className="size-3.5 text-primary" /> {formatDate(ahmedPerformance.nextReview, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Competencies</CardTitle>
              <CardDescription>Manager assessment, H2 2026</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {ahmedPerformance.competencies.map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex justify-between text-[13px]">
                  <span>{c.name}</span>
                  <span className="font-medium tabular">{c.score.toFixed(1)}</span>
                </div>
                <Progress value={(c.score / 5) * 100} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Rating history</CardTitle>
              <CardDescription>Last six review cycles</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ahmedPerformance.history} margin={{ top: 10, right: 20, left: -28, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="cycle" {...axisProps} interval={0} tick={{ ...axisProps.tick, fontSize: 10 }} />
                  <YAxis {...axisProps} domain={[3, 5]} ticks={[3, 3.5, 4, 4.5, 5]} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)' }} />
                  <Line type="monotone" dataKey="rating" name="Rating" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 4, fill: 'var(--chart-1)', stroke: 'var(--card)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Key performance indicators</CardTitle>
            <CardDescription>Q4 2026 targets for Platform Engineering — Backend</CardDescription>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>KPI</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead className="hidden sm:table-cell">Trend</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ahmedKPIs.map((k) => {
              const lowerIsBetter = k.name.includes('turnaround') || k.name.includes('incidents')
              const met = lowerIsBetter ? k.actual <= k.target : k.actual >= k.target
              return (
                <TableRow key={k.name}>
                  <TableCell className="font-medium">{k.name}</TableCell>
                  <TableCell className="tabular text-muted-foreground">
                    {lowerIsBetter ? '≤ ' : '≥ '}
                    {k.target}
                    {k.unit && ` ${k.unit}`}
                  </TableCell>
                  <TableCell className="font-semibold tabular">
                    {k.actual}
                    {k.unit && ` ${k.unit}`}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {k.trend === 'up' ? <ArrowUpRight className="size-4 text-emerald-500 rtl:-scale-x-100" /> : k.trend === 'down' ? <ArrowDownRight className="size-4 text-rose-500 rtl:-scale-x-100" /> : <ArrowRight className="size-4 text-muted-foreground rtl:-scale-x-100" />}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={met ? 'On Track' : 'At Risk'} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Goals</CardTitle>
              <CardDescription>Weighted completion {weighted}%</CardDescription>
            </div>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.map((g) => (
              <div key={g.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{g.title}</div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{g.description}</p>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={g.progress} className="h-1.5 flex-1" indicatorClassName={g.status === 'At Risk' ? 'bg-amber-500' : g.status === 'Completed' ? 'bg-emerald-500' : undefined} />
                  <span className="w-10 text-end text-xs font-semibold tabular">{g.progress}%</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Due {formatDate(g.dueDate)} · Weight {g.weight}%
                  </span>
                  {g.status !== 'Completed' && (
                    <Button variant="ghost" size="xs" onClick={() => { setEditing(g); setProgress(g.progress); setNote('') }}>
                      Update
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Manager feedback</CardTitle>
              <CardDescription>Recent feedback and check-ins</CardDescription>
            </div>
            <MessageSquareQuote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-5">
            {ahmedFeedback.map((f) => (
              <div key={f.id} className="relative ps-12">
                <UserAvatar name={f.author} size="md" className="absolute top-0 start-0" />
                <div className="flex flex-wrap items-center gap-x-2">
                  <span className="text-sm font-semibold">{f.author}</span>
                  <span className="text-xs text-muted-foreground">{f.authorTitle}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  {f.cycle} · {formatDate(f.date)}
                </div>
                <p className="mt-2 rounded-xl rounded-ss-sm bg-muted/60 px-3.5 py-3 text-[13px] leading-relaxed">{f.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update goal progress</DialogTitle>
            <DialogDescription>{editing?.title}</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-5">
            <Field label={`Progress — ${progress}%`} htmlFor="goal-progress">
              <input id="goal-progress" type="range" min={0} max={100} step={5} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </Field>
            <Field label="Update note" htmlFor="goal-note" hint="Visible to your manager">
              <Textarea id="goal-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What changed since the last update?" />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveGoal}>Save progress</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
