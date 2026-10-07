import { AlarmClock, ArrowRight, BriefcaseBusiness, CalendarOff, CheckSquare, PartyPopper, Star, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StatCard } from '@/components/cards/StatCard'
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart'
import { TeamAttendanceChart } from '@/components/charts/TeamAttendanceChart'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { ApprovalRow } from '@/components/manager/ApprovalRow'
import { TeamLeaveList } from '@/components/manager/TeamLeaveList'
import { useTeamData } from '@/components/manager/useTeamData'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { teamAttendanceTrend } from '@/data/attendance'
import { teamPerformanceTrend } from '@/data/performance'
import { useRequestActions } from '@/hooks/useRequestActions'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest } from '@/types'
import { greeting } from '@/utils/format'

/** Highlight the headline examples (Ahmed's leave, Sara's overtime, Omar's expense) first. */
const FEATURED = ['REQ-2041', 'REQ-2045', 'REQ-2044']
const featured = (r: HRRequest) => (FEATURED.includes(r.id) ? 10 - FEATURED.indexOf(r.id) : 0)

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const { openEmployee } = useAppStore()
  const decide = useRequestActions()
  const loading = useSimulatedLoading()
  const data = useTeamData()
  const [viewing, setViewing] = useState<HRRequest | null>(null)
  const avgRating = (data.team.reduce((s, e) => s + e.rating, 0) / data.team.length).toFixed(1)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{greeting()}, Mohamed 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform Engineering · <span className="font-medium text-foreground">{data.pending.length} requests</span> need your attention today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/manager/team')}>
            <Users /> View team
          </Button>
          <Button onClick={() => navigate('/manager/approvals')}>
            <CheckSquare /> Review approvals
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard loading={loading} label="Team size" value={data.team.length} icon={Users} tone="indigo" hint="direct reports" onClick={() => navigate('/manager/team')} />
        <StatCard loading={loading} label="Present today" value={data.present} icon={UserCheck} tone="emerald" hint={`${Math.round((data.present / data.team.length) * 100)}% of team`} onClick={() => navigate('/manager/attendance')} />
        <StatCard loading={loading} label="On leave" value={data.onLeave} icon={CalendarOff} tone="sky" hint="approved leave" onClick={() => navigate('/manager/leave')} />
        <StatCard loading={loading} label="Late" value={data.late} icon={AlarmClock} tone="amber" hint="after 09:15 AM" onClick={() => navigate('/manager/attendance')} />
        <StatCard loading={loading} label="Pending approvals" value={data.pending.length} icon={CheckSquare} tone="rose" hint="awaiting decision" onClick={() => navigate('/manager/approvals')} />
        <StatCard loading={loading} label="Open positions" value={data.openPositions.length} icon={BriefcaseBusiness} tone="violet" hint={data.openPositions.map((j) => j.title.split(' ')[0]).join(', ')} />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Team attendance</CardTitle>
              <CardDescription>Previous 7 working days · 18 team members</CardDescription>
            </div>
            <Button variant="ghost" size="xs" asChild>
              <Link to="/manager/attendance">
                Details <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TeamAttendanceChart data={teamAttendanceTrend} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Pending approvals</CardTitle>
              <CardDescription>{data.pending.length} requests waiting</CardDescription>
            </div>
            <Button variant="ghost" size="xs" asChild>
              <Link to="/manager/approvals">
                View all <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {data.pending.length === 0 ? (
              <EmptyState icon={PartyPopper} title="All caught up!" description="There are no pending requests from your team." />
            ) : (
              [...data.pending].sort((a, b) => featured(b) - featured(a)).slice(0, 4).map((r) => <ApprovalRow key={r.id} request={r} onDecide={decide} onView={setViewing} compact />)
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Team overview</CardTitle>
            <CardDescription>Average rating {avgRating} · click a member for details</CardDescription>
          </div>
          <Button variant="ghost" size="xs" asChild>
            <Link to="/manager/team">
              Manage team <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="hidden sm:table-cell">Performance</TableHead>
              <TableHead className="hidden lg:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.team.slice(0, 8).map((e) => {
              const t = data.todayById.get(e.id)
              return (
                <TableRow key={e.id} className="cursor-pointer" onClick={() => openEmployee(e.id)}>
                  <TableCell>
                    <PersonCell name={e.name} subtitle={e.id} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{e.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {t && <StatusBadge status={t.status} />}
                      <span className="hidden text-xs text-muted-foreground xl:inline">{t?.checkIn ?? ''}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 font-medium tabular">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" /> {e.rating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <StatusBadge status={e.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="border-t px-5 py-3 text-center">
          <Button variant="link" size="sm" onClick={() => navigate('/manager/team')}>
            View all {data.team.length} team members
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Team performance</CardTitle>
              <CardDescription>Goal achievement, performance and productivity — last 6 months</CardDescription>
            </div>
            <Button variant="ghost" size="xs" asChild>
              <Link to="/manager/performance">
                Details <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <PerformanceTrendChart data={teamPerformanceTrend} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Team leave calendar</CardTitle>
              <CardDescription>Current and upcoming leave</CardDescription>
            </div>
            <Button variant="ghost" size="xs" asChild>
              <Link to="/manager/leave">
                Calendar <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TeamLeaveList entries={data.upcomingLeave.slice(0, 6)} onView={setViewing} />
          </CardContent>
        </Card>
      </div>

      <RequestDetailModal
        request={viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        onDecide={(r, s) => {
          decide(r, s)
          setViewing(null)
        }}
      />
    </div>
  )
}
