import { Bell, ClipboardList, Star, Trophy, Users } from 'lucide-react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { PageHeader } from '@/components/common/PageHeader'
import { PersonCell } from '@/components/common/UserAvatar'
import { SimpleBar } from '@/components/reports/charts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { departmentPerformance, ratingDistribution, REVIEW_CYCLE, reviewCycleProgress } from '@/data/performance'
import { useAppStore } from '@/store/AppStore'
import { formatDate } from '@/utils/format'

export default function HRPerformancePage() {
  const { employees, openEmployee } = useAppStore()
  const avg = employees.reduce((s, e) => s + e.rating, 0) / employees.length
  const top = [...employees].sort((a, b) => b.rating - a.rating).slice(0, 8)
  const deptData = [...departmentPerformance].sort((a, b) => b.rating - a.rating).map((d) => ({ ...d, department: d.department.replace('Human Resources', 'HR').replace('Customer Success', 'Cust. Success') }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance"
        description={`${REVIEW_CYCLE} · closes ${formatDate(reviewCycleProgress.deadline)}`}
        actions={
          <Button onClick={() => toast.success('Reminders sent', { description: '188 managers with pending reviews were notified by email.' })}>
            <Bell /> Send reminders
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Average rating" value={avg.toFixed(2)} icon={Star} tone="amber" hint="company-wide, out of 5" />
        <StatCard label="Self-reviews" value={`${reviewCycleProgress.selfReview}%`} icon={ClipboardList} tone="indigo" hint="submitted" />
        <StatCard label="Manager reviews" value={`${reviewCycleProgress.managerReview}%`} icon={Users} tone="sky" hint="completed" />
        <StatCard label="Top performers" value={employees.filter((e) => e.rating >= 4.5).length} icon={Trophy} tone="emerald" hint="rated Exceptional" />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Review cycle progress</CardTitle>
            <CardDescription>All employees · {REVIEW_CYCLE}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Self-review', value: reviewCycleProgress.selfReview, due: 'Oct 12' },
            { label: 'Manager review', value: reviewCycleProgress.managerReview, due: 'Oct 24' },
            { label: 'Calibration', value: reviewCycleProgress.calibration, due: 'Oct 31' },
          ].map((p) => (
            <div key={p.label}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium">{p.label}</span>
                <span className="text-sm font-semibold tabular">{p.value}%</span>
              </div>
              <Progress value={p.value} />
              <div className="mt-1.5 text-xs text-muted-foreground">Due {p.due}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Rating distribution</CardTitle>
              <CardDescription>Number of employees per rating band</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBar data={ratingDistribution} x="band" series={[{ key: 'count', label: 'Employees', color: 'var(--chart-1)' }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Average rating by department</CardTitle>
              <CardDescription>Out of 5.0</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBar data={deptData} x="department" series={[{ key: 'rating', label: 'Avg. rating', color: 'var(--chart-1)' }]} />
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Top performers</CardTitle>
            <CardDescription>Highest-rated employees this cycle</CardDescription>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Manager</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top.map((e) => (
              <TableRow key={e.id} className="cursor-pointer" onClick={() => openEmployee(e.id)}>
                <TableCell>
                  <PersonCell name={e.name} subtitle={e.position} />
                </TableCell>
                <TableCell className="hidden md:table-cell">{e.department}</TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">{e.managerName}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 font-semibold tabular">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" /> {e.rating.toFixed(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
