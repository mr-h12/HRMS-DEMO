import { CalendarDays, ChevronDown, FileText, Inbox, Plus, Receipt } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { REQUEST_ICONS } from '@/components/dashboard/RecentRequestsCard'
import { ExpenseModal } from '@/components/modals/ExpenseModal'
import { HrLetterModal } from '@/components/modals/HrLetterModal'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { RequestLeaveModal } from '@/components/modals/RequestLeaveModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EMPLOYEE_ID } from '@/data/employees'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest } from '@/types'
import { formatDate } from '@/utils/format'
import { requestSummary, requestTitle } from '@/utils/requests'

export default function RequestsPage() {
  const { requests } = useAppStore()
  const [tab, setTab] = useState('all')
  const [modal, setModal] = useState<'leave' | 'letter' | 'expense' | null>(null)
  const [viewing, setViewing] = useState<HRRequest | null>(null)
  const mine = requests.filter((r) => r.employeeId === EMPLOYEE_ID)
  const filtered = tab === 'all' ? mine : mine.filter((r) => r.status.toLowerCase() === tab)
  const count = (s: string) => mine.filter((r) => r.status === s).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests"
        description="Track every request you’ve submitted and its approval status."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus /> New request <ChevronDown className="opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setModal('leave')}>
                <CalendarDays /> Leave request
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setModal('letter')}>
                <FileText /> HR letter
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setModal('expense')}>
                <Receipt /> Expense claim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({mine.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({count('Pending')})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({count('Approved')})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({count('Rejected')})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No requests here" description="Requests matching this status will appear here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead className="hidden md:table-cell">Details</TableHead>
                <TableHead className="hidden lg:table-cell">Approver</TableHead>
                <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const Icon = REQUEST_ICONS[r.type]
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </span>
                        <div>
                          <div className="font-medium">{requestTitle(r)}</div>
                          <div className="text-xs text-muted-foreground">{r.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{requestSummary(r)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{r.decidedBy ?? (r.type === 'HR Letter' ? 'HR Department' : r.managerName)}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{formatDate(r.submittedAt.slice(0, 10))}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setViewing(r)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <RequestLeaveModal open={modal === 'leave'} onOpenChange={(o) => setModal(o ? 'leave' : null)} />
      <HrLetterModal open={modal === 'letter'} onOpenChange={(o) => setModal(o ? 'letter' : null)} />
      <ExpenseModal open={modal === 'expense'} onOpenChange={(o) => setModal(o ? 'expense' : null)} />
      <RequestDetailModal request={viewing} onOpenChange={(o) => !o && setViewing(null)} />
    </div>
  )
}
