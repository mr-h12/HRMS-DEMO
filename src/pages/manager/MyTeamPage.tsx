import { Download, Star, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { useTeamData } from '@/components/manager/useTeamData'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ratingBand } from '@/data/performance'
import { useAppStore } from '@/store/AppStore'
import { downloadFile, toCSV } from '@/utils/download'
import { formatDate } from '@/utils/format'

const BANDS = ['Exceptional', 'Exceeds', 'Meets', 'Developing']

export default function MyTeamPage() {
  const { openEmployee } = useAppStore()
  const { team, todayById } = useTeamData()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [perf, setPerf] = useState(ALL)
  const teams = [...new Set(team.map((e) => e.team))].sort()

  const filtered = useMemo(
    () =>
      team.filter(
        (e) =>
          (dept === ALL || e.team === dept) &&
          (status === ALL || e.status === status) &&
          (perf === ALL || ratingBand(e.rating) === perf) &&
          [e.name, e.position, e.id, e.email].some((v) => v.toLowerCase().includes(query.toLowerCase())),
      ),
    [team, dept, status, perf, query],
  )

  const reset = () => {
    setQuery('')
    setDept(ALL)
    setStatus(ALL)
    setPerf(ALL)
  }
  const hasFilters = query || dept !== ALL || status !== ALL || perf !== ALL

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Team"
        description={`${team.length} direct reports in Platform Engineering`}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              downloadFile('platform-engineering-team.csv', toCSV(filtered.map((e) => ({ ID: e.id, Name: e.name, Position: e.position, Team: e.team, Status: e.status, Rating: e.rating, 'Attendance %': e.attendanceRate }))), 'text/csv')
              toast.success('Team exported', { description: `${filtered.length} members · platform-engineering-team.csv` })
            }}
          >
            <Download /> Export
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name, role or ID…" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
            <FilterSelect value={dept} onChange={setDept} options={teams} label="Departments" />
            <FilterSelect value={status} onChange={setStatus} options={['Active', 'On Leave', 'Probation', 'Notice Period']} label="Statuses" />
            <FilterSelect value={perf} onChange={setPerf} options={BANDS} label="Performance" />
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={reset} className="lg:ml-auto">
              Clear filters
            </Button>
          )}
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={UsersRound} title="No team members match" description="Try adjusting the search or filters." action={<Button variant="outline" onClick={reset}>Clear filters</Button>} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="hidden sm:table-cell">Attendance</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="hidden xl:table-cell">Today</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => {
                const t = todayById.get(e.id)
                return (
                  <TableRow key={e.id} className="cursor-pointer" onClick={() => openEmployee(e.id)}>
                    <TableCell>
                      <PersonCell name={e.name} subtitle={e.position} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>{e.team}</div>
                      <div className="text-xs text-muted-foreground">{e.department}</div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">{formatDate(e.joiningDate)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex w-28 items-center gap-2">
                        <Progress value={e.attendanceRate} className="h-1.5" indicatorClassName={e.attendanceRate < 90 ? 'bg-amber-500' : 'bg-emerald-500'} />
                        <span className="text-xs tabular">{e.attendanceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-medium tabular">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" /> {e.rating.toFixed(1)}
                        </span>
                        <span className="hidden text-xs text-muted-foreground sm:inline">{ratingBand(e.rating)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{t && <StatusBadge status={t.status} />}</TableCell>
                    <TableCell>
                      <StatusBadge status={e.status} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
        <div className="border-t px-5 py-3 text-[13px] text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filtered.length}</span> of {team.length} team members
        </div>
      </Card>
    </div>
  )
}
