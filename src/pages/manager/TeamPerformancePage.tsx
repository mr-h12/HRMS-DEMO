import { ArrowDownRight, ArrowUpRight, ClipboardCheck, Star } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { axisProps, ChartTooltip, gridProps } from '@/components/charts/ChartTooltip'
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { employeeById } from '@/data/employees'
import { ratingBand, REVIEW_CYCLE, teamKPIs, teamPerformance, teamPerformanceTrend, type TeamPerformanceRow } from '@/data/performance'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'

export default function TeamPerformancePage() {
  const { openEmployee } = useAppStore()
  const [rows, setRows] = useState<TeamPerformanceRow[]>(teamPerformance)
  const completed = rows.filter((r) => r.reviewStatus === 'Completed').length
  const goalData = [...rows]
    .sort((a, b) => b.goalAchievement - a.goalAchievement)
    .map((r) => ({ name: employeeById(r.employeeId)!.name.split(' ')[0], value: r.goalAchievement }))

  const advanceReview = (r: TeamPerformanceRow) => {
    const next = r.reviewStatus === 'Not Started' ? 'In Progress' : 'Completed'
    setRows((prev) => prev.map((x) => (x.employeeId === r.employeeId ? { ...x, reviewStatus: next } : x)))
    const name = employeeById(r.employeeId)!.name
    toast.success(next === 'Completed' ? `Review submitted for ${name}` : `Review started for ${name}`, { description: REVIEW_CYCLE })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Team Performance" description={`${REVIEW_CYCLE} · manager reviews due Oct 31`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teamKPIs.map((k) => (
          <Card key={k.name} className="p-5">
            <p className="text-[13px] font-medium text-muted-foreground">{k.name}</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular">{k.value}</p>
            <p className={cn('mt-2 inline-flex items-center gap-0.5 text-xs font-medium', k.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
              {k.positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {k.change} <span className="ml-1 font-normal text-muted-foreground">vs last quarter</span>
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Performance trend</CardTitle>
              <CardDescription>Team averages, last 6 months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceTrendChart data={teamPerformanceTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Goal achievement by employee</CardTitle>
              <CardDescription>H2 2026 weighted goal completion</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[296px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="name" {...axisProps} interval={0} angle={-40} textAnchor="end" height={50} tick={{ ...axisProps.tick, fontSize: 11 }} />
                  <YAxis {...axisProps} domain={[0, 100]} unit="%" />
                  <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.6 }} content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                  <Bar dataKey="value" name="Goal achievement" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Employee performance</CardTitle>
            <CardDescription>
              {completed} of {rows.length} reviews completed
            </CardDescription>
          </div>
          <div className="hidden w-48 sm:block">
            <Progress value={(completed / rows.length) * 100} />
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="hidden md:table-cell">Goals</TableHead>
              <TableHead className="hidden lg:table-cell">Productivity</TableHead>
              <TableHead className="hidden sm:table-cell">Review</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const e = employeeById(r.employeeId)!
              return (
                <TableRow key={r.employeeId}>
                  <TableCell>
                    <PersonCell name={e.name} subtitle={e.position} onClick={() => openEmployee(e.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-medium tabular">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" /> {r.rating.toFixed(1)}
                      </span>
                      <StatusBadge status={ratingBand(r.rating)} dot={false} className="hidden xl:inline-flex" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex w-32 items-center gap-2">
                      <Progress value={r.goalAchievement} className="h-1.5" />
                      <span className="text-xs tabular">{r.goalAchievement}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex w-32 items-center gap-2">
                      <Progress value={r.productivity} className="h-1.5" indicatorClassName="bg-emerald-500" />
                      <span className="text-xs tabular">{r.productivity}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <StatusBadge status={r.reviewStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    {r.reviewStatus === 'Completed' ? (
                      <Button variant="ghost" size="sm" onClick={() => openEmployee(e.id)}>
                        View
                      </Button>
                    ) : (
                      <Button variant={r.reviewStatus === 'In Progress' ? 'default' : 'outline'} size="sm" onClick={() => advanceReview(r)}>
                        <ClipboardCheck /> {r.reviewStatus === 'In Progress' ? 'Submit' : 'Start'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
