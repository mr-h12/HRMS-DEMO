import { CalendarCheck, CalendarClock, CalendarX, Check, Eye, Inbox, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { StatCard } from '@/components/cards/StatCard'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { Pagination, paginate } from '@/components/tables/Pagination'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEPARTMENT_LIST } from '@/data/employees'
import { LEAVE_TYPES } from '@/data/leaves'
import { useRequestActions } from '@/hooks/useRequestActions'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest } from '@/types'
import { formatDate } from '@/utils/format'

const PAGE_SIZE = 10

export default function HRLeavePage() {
  const { requests } = useAppStore()
  const decide = useRequestActions()
  const [tab, setTab] = useState('Pending')
  const [query, setQuery] = useState('')
  const [type, setType] = useState(ALL)
  const [dept, setDept] = useState(ALL)
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<HRRequest | null>(null)
  const leaves = useMemo(() => requests.filter((r) => r.type === 'Leave'), [requests])
  const filtered = leaves.filter(
    (r) => (tab === 'All' || r.status === tab) && (type === ALL || r.leaveType === type) && (dept === ALL || r.department === dept) && (!query || r.employeeName.toLowerCase().includes(query.toLowerCase())),
  )
  useEffect(() => setPage(1), [tab, query, type, dept])
  const count = (s: string) => leaves.filter((r) => r.status === s).length

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Management" description="All leave requests across the company. HR can approve or reject on behalf of managers." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total requests" value={leaves.length} icon={Inbox} tone="indigo" hint="Sep – Nov 2026" onClick={() => setTab('All')} />
        <StatCard label="Pending" value={count('Pending')} icon={CalendarClock} tone="amber" hint="awaiting decision" onClick={() => setTab('Pending')} />
        <StatCard label="Approved" value={count('Approved')} icon={CalendarCheck} tone="emerald" hint={`${leaves.filter((r) => r.status === 'Approved').reduce((s, r) => s + (r.days ?? 0), 0)} days total`} onClick={() => setTab('Approved')} />
        <StatCard label="Rejected" value={count('Rejected')} icon={CalendarX} tone="rose" hint={`${Math.round((count('Rejected') / leaves.length) * 100)}% rejection rate`} onClick={() => setTab('Rejected')} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 xl:flex-row xl:items-center">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              {['Pending', 'Approved', 'Rejected', 'All'].map((t) => (
                <TabsTrigger key={t} value={t}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-col gap-3 sm:flex-row xl:ms-auto">
            <SearchInput value={query} onChange={setQuery} placeholder="Search employee…" className="sm:w-56" />
            <FilterSelect value={type} onChange={setType} options={LEAVE_TYPES} label="Leave types" />
            <FilterSelect value={dept} onChange={setDept} options={DEPARTMENT_LIST} label="Departments" />
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No leave requests" description="Nothing matches the current filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead className="hidden md:table-cell">Start</TableHead>
                <TableHead className="hidden md:table-cell">End</TableHead>
                <TableHead className="hidden sm:table-cell">Days</TableHead>
                <TableHead className="hidden lg:table-cell">Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginate(filtered, page, PAGE_SIZE).map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <PersonCell name={r.employeeName} subtitle={r.department} />
                  </TableCell>
                  <TableCell>{r.leaveType}</TableCell>
                  <TableCell className="hidden tabular md:table-cell">{formatDate(r.startDate!)}</TableCell>
                  <TableCell className="hidden tabular md:table-cell">{formatDate(r.endDate!)}</TableCell>
                  <TableCell className="hidden tabular sm:table-cell">{r.days}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{r.managerName}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <Tooltip content="View details">
                        <Button variant="ghost" size="icon-sm" onClick={() => setViewing(r)} aria-label="View">
                          <Eye />
                        </Button>
                      </Tooltip>
                      {r.status === 'Pending' && (
                        <>
                          <Tooltip content="Reject">
                            <Button variant="outline" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => decide(r, 'Rejected')} aria-label={`Reject ${r.employeeName}`}>
                              <X />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Approve">
                            <Button variant="success" size="icon-sm" onClick={() => decide(r, 'Approved')} aria-label={`Approve ${r.employeeName}`}>
                              <Check />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </Card>

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
