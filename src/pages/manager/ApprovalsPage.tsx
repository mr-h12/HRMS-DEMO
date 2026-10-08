import { CalendarDays, CheckCheck, Eye, FileText, Inbox, Receipt, Timer } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { useTeamData } from '@/components/manager/useTeamData'
import { RequestDetailModal } from '@/components/modals/RequestDetailModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRequestActions } from '@/hooks/useRequestActions'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest, RequestType } from '@/types'
import { relativeTime } from '@/utils/format'
import { requestSummary, requestTitle } from '@/utils/requests'

const TABS: { value: RequestType; label: string; icon: typeof Inbox }[] = [
  { value: 'Leave', label: 'Leave', icon: CalendarDays },
  { value: 'Overtime', label: 'Overtime', icon: Timer },
  { value: 'Expense', label: 'Expenses', icon: Receipt },
  { value: 'HR Letter', label: 'HR Requests', icon: FileText },
]

export default function ApprovalsPage() {
  const { teamRequests } = useTeamData()
  const { decideRequest, pushNotification } = useAppStore()
  const decide = useRequestActions()
  const [tab, setTab] = useState<RequestType>('Leave')
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Decided'>('Pending')
  const [viewing, setViewing] = useState<HRRequest | null>(null)

  const ofType = teamRequests.filter((r) => r.type === tab)
  const list = ofType.filter((r) => (statusFilter === 'Pending' ? r.status === 'Pending' : r.status !== 'Pending'))
  const pendingCount = (t: RequestType) => teamRequests.filter((r) => r.type === t && r.status === 'Pending').length

  const approveAll = () => {
    const pending = ofType.filter((r) => r.status === 'Pending')
    pending.forEach((r) => decideRequest(r.id, 'Approved', 'Mohamed Ali'))
    if (pending.some((r) => r.employeeId === 'EMP-1042')) {
      pushNotification({ role: 'employee', kind: 'approval', title: 'Request approved', message: `Mohamed Ali approved your ${tab.toLowerCase()} request.`, link: '/employee/requests' })
    }
    toast.success(`${pending.length} ${tab.toLowerCase()} requests approved`)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" description="Review and act on requests from your team." />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as RequestType)}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                <t.icon className="size-4" /> {t.label}
                {pendingCount(t.value) > 0 && <span className="rounded-full bg-primary/10 px-1.5 text-[11px] font-semibold text-primary">{pendingCount(t.value)}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'Pending' | 'Decided')}>
            <TabsList>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Decided">History</TabsTrigger>
            </TabsList>
          </Tabs>
          {statusFilter === 'Pending' && list.length > 1 && (
            <Button variant="outline" onClick={approveAll}>
              <CheckCheck /> Approve all
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={statusFilter === 'Pending' ? `No pending ${TABS.find((t) => t.value === tab)!.label.toLowerCase()} requests` : 'No decided requests yet'}
            description={statusFilter === 'Pending' ? 'You’re all caught up. New requests from your team will show up here.' : 'Approved and rejected requests will appear here.'}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Request</TableHead>
                <TableHead className="hidden lg:table-cell">Reason</TableHead>
                <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                <TableHead className="text-end">{statusFilter === 'Pending' ? 'Actions' : 'Status'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <PersonCell name={r.employeeName} subtitle={r.id} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{requestTitle(r)}</div>
                    <div className="text-xs text-muted-foreground">{requestSummary(r)}</div>
                  </TableCell>
                  <TableCell className="hidden max-w-72 truncate text-muted-foreground lg:table-cell">{r.reason}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{relativeTime(r.submittedAt)}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => setViewing(r)}>
                        <Eye /> <span className="hidden md:inline">View</span>
                      </Button>
                      {r.status === 'Pending' ? (
                        <>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => decide(r, 'Rejected')}>
                            Reject
                          </Button>
                          <Button variant="success" size="sm" onClick={() => decide(r, 'Approved')}>
                            Approve
                          </Button>
                        </>
                      ) : (
                        <StatusBadge status={r.status} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
