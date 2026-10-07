import { BookOpen, CheckCircle2, Clock, GraduationCap, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { ALL, FilterSelect } from '@/components/common/Filters'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { trainingCourses } from '@/data/company'
import { formatDate, formatNumber } from '@/utils/format'

export default function TrainingPage() {
  const [category, setCategory] = useState(ALL)
  const courses = trainingCourses.filter((c) => category === ALL || c.category === category)
  const enrolled = trainingCourses.reduce((s, c) => s + c.enrolled, 0)
  const completed = trainingCourses.reduce((s, c) => s + c.completed, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training"
        description="Learning programs, compliance courses and completion tracking."
        actions={
          <Button onClick={() => toast.success('Course builder opened', { description: 'Draft saved to Learning & Development.' })}>
            <Plus /> New course
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active courses" value={trainingCourses.length} icon={BookOpen} tone="indigo" hint="Q4 2026" />
        <StatCard label="Enrollments" value={formatNumber(enrolled)} icon={Users} tone="sky" />
        <StatCard label="Completion rate" value={`${Math.round((completed / enrolled) * 100)}%`} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Mandatory due" value={trainingCourses.filter((c) => c.mandatory).length} icon={Clock} tone="amber" hint="before Nov 15" />
      </div>
      <FilterSelect value={category} onChange={setCategory} options={[...new Set(trainingCourses.map((c) => c.category))]} label="Categories" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courses.map((c) => {
          const pct = Math.round((c.completed / c.enrolled) * 100)
          return (
            <Card key={c.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="size-5" />
                </span>
                {c.mandatory && <Badge variant="danger">Mandatory</Badge>}
              </div>
              <div className="mt-4 font-semibold">{c.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {c.category} · {c.format} · {c.duration}
              </div>
              <div className="mt-auto pt-5">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {c.completed} / {c.enrolled} completed
                  </span>
                  <span className="font-semibold tabular">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5" indicatorClassName={pct >= 80 ? 'bg-emerald-500' : pct < 50 ? 'bg-amber-500' : undefined} />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Due {formatDate(c.due, { month: 'short', day: 'numeric' })}</span>
                  <Button variant="ghost" size="xs" onClick={() => toast.success('Reminder sent', { description: `${c.enrolled - c.completed} employees have not completed “${c.title}”.` })}>
                    Remind
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
