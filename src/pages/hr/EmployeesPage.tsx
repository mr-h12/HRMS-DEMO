import { Download, Eye, FileText, MoreHorizontal, Pencil, Plus, UserX, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { MiniStat } from '@/components/cards/StatCard'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { TableSkeleton } from '@/components/layout/PageSkeleton'
import { AddEmployeeModal } from '@/components/modals/AddEmployeeModal'
import { Pagination, paginate } from '@/components/tables/Pagination'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEPARTMENT_LIST, EMPLOYMENT_TYPES, LOCATIONS, STATUSES } from '@/data/employees'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { useAppStore } from '@/store/AppStore'
import { downloadFile, toCSV } from '@/utils/download'
import { formatDate, formatNumber } from '@/utils/format'

const PAGE_SIZE = 12

export default function EmployeesPage() {
  const { employees, openEmployee } = useAppStore()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState(params.get('department') ?? ALL)
  const [status, setStatus] = useState(params.get('status') ?? ALL)
  const [location, setLocation] = useState(ALL)
  const [type, setType] = useState(ALL)
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(params.get('add') === '1')
  const loading = useSimulatedLoading(500)

  // Keep filters in sync when arriving from search / dashboard links.
  useEffect(() => {
    if (params.get('department')) setDept(params.get('department')!)
    if (params.get('status')) setStatus(params.get('status')!)
    if (params.get('add') === '1') setAddOpen(true)
  }, [params])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return employees.filter(
      (e) =>
        (dept === ALL || e.department === dept) &&
        (status === ALL || e.status === status) &&
        (location === ALL || e.location === location) &&
        (type === ALL || e.employmentType === type) &&
        (!q || [e.name, e.id, e.position, e.email, e.managerName].some((v) => v.toLowerCase().includes(q))),
    )
  }, [employees, query, dept, status, location, type])

  useEffect(() => setPage(1), [query, dept, status, location, type])
  const rows = paginate(filtered, page, PAGE_SIZE)
  const hasFilters = query || dept !== ALL || status !== ALL || location !== ALL || type !== ALL
  const reset = () => {
    setQuery('')
    setDept(ALL)
    setStatus(ALL)
    setLocation(ALL)
    setType(ALL)
    setParams({})
  }

  const exportCsv = () => {
    downloadFile(
      'northwind-employees.csv',
      toCSV(filtered.map((e) => ({ 'Employee ID': e.id, Name: e.name, Email: e.email, Department: e.department, Position: e.position, Manager: e.managerName, Location: e.location, Type: e.employmentType, 'Joining Date': e.joiningDate, Status: e.status }))),
      'text/csv',
    )
    toast.success('Employee list exported', { description: `${formatNumber(filtered.length)} records · northwind-employees.csv` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description={`${formatNumber(employees.length)} employees across ${DEPARTMENT_LIST.length} departments and ${LOCATIONS.length} locations`}
        actions={
          <>
            <Button variant="outline" onClick={exportCsv}>
              <Download /> Export
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus /> Add Employee
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATUSES.map((s) => (
          <button key={s} type="button" onClick={() => setStatus(status === s ? ALL : s)} className="text-left">
            <MiniStat label={s} value={employees.filter((e) => e.status === s).length} tone={s === 'Active' ? 'emerald' : s === 'On Leave' ? 'sky' : s === 'Probation' ? 'violet' : 'amber'} icon={UsersRound} />
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="space-y-3 border-b p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <SearchInput value={query} onChange={setQuery} placeholder="Search name, ID, email, manager…" className="xl:w-80" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:flex">
              <FilterSelect value={dept} onChange={setDept} options={DEPARTMENT_LIST} label="Departments" className="sm:w-full xl:w-44" />
              <FilterSelect value={status} onChange={setStatus} options={STATUSES} label="Statuses" className="sm:w-full xl:w-40" />
              <FilterSelect value={location} onChange={setLocation} options={LOCATIONS} label="Locations" className="sm:w-full xl:w-40" />
              <FilterSelect value={type} onChange={setType} options={EMPLOYMENT_TYPES} label="Types" className="sm:w-full xl:w-40" />
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={reset} className="xl:ml-auto">
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={8} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={UsersRound} title="No employees found" description="No employees match your search and filters." action={<Button variant="outline" onClick={reset}>Clear filters</Button>} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden lg:table-cell">Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden xl:table-cell">Position</TableHead>
                <TableHead className="hidden xl:table-cell">Manager</TableHead>
                <TableHead className="hidden lg:table-cell">Joining Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e.id} className="cursor-pointer" onClick={() => openEmployee(e.id)}>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground lg:table-cell">{e.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={e.name} />
                      <div className="min-w-0">
                        <div className="font-medium">{e.name}</div>
                        <div className="text-xs text-muted-foreground xl:hidden">{e.position}</div>
                        <div className="hidden text-xs text-muted-foreground xl:block">{e.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{e.department}</div>
                    <div className="text-xs text-muted-foreground">{e.location}</div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">{e.position}</TableCell>
                  <TableCell className="hidden text-muted-foreground xl:table-cell">{e.managerName}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{formatDate(e.joiningDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={e.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${e.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => openEmployee(e.id)}>
                          <Eye /> View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => toast.info('Edit mode is not available in the demo', { description: `${e.name} · ${e.id}` })}>
                          <Pencil /> Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => toast.success('Employment letter generated', { description: `Sent to ${e.email}` })}>
                          <FileText /> Generate letter
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => toast.warning('Offboarding requires approval', { description: `A request to offboard ${e.name} was sent to the department head.` })}>
                          <UserX /> Start offboarding
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </Card>

      <AddEmployeeModal
        open={addOpen}
        onOpenChange={(o) => {
          setAddOpen(o)
          if (!o && params.get('add')) setParams({})
        }}
      />
    </div>
  )
}
