import { AlarmClock, BellRing, CalendarClock, FileClock, FileX2, RefreshCw, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { PageHeader } from '@/components/common/PageHeader'
import { PersonCell } from '@/components/common/UserAvatar'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEMO_TODAY } from '@/data/attendance'
import { contracts, daysUntil, expiringDocuments, expiryStatus, type ExpiryStatus } from '@/data/contracts'
import { employeeById } from '@/data/employees'
import { useAppStore } from '@/store/AppStore'
import type { ContractRecord, ExpiringDocument } from '@/types'
import { formatDate, parseDate, toISODate } from '@/utils/format'

const WINDOWS = ['Expired', 'Within 30 days', 'Within 90 days'] as const
const VARIANT: Record<ExpiryStatus, BadgeVariant> = { Expired: 'danger', 'Expiring Soon': 'warning', 'Due in 90 days': 'info', Valid: 'success' }
const ICON: Record<ExpiryStatus, typeof AlarmClock> = { Expired: FileX2, 'Expiring Soon': AlarmClock, 'Due in 90 days': CalendarClock, Valid: CalendarClock }

function inWindow(iso: string | null, w: string) {
  if (w === ALL) return true
  if (!iso) return false
  const d = daysUntil(iso)
  return w === 'Expired' ? d < 0 : w === 'Within 30 days' ? d >= 0 && d <= 30 : d >= 0 && d <= 90
}

/** "12 days left" / "Expired 5 days ago" — always with an icon, never colour alone. */
function ExpiryBadge({ iso }: { iso: string | null }) {
  if (!iso) return <Badge variant="neutral">No end date</Badge>
  const status = expiryStatus(iso)
  const d = daysUntil(iso)
  const Icon = ICON[status]
  const text = d < 0 ? (d === -1 ? 'Expired yesterday' : `Expired ${-d} days ago`) : d === 0 ? 'Expires today' : d === 1 ? '1 day left' : `${d} days left`
  return (
    <Badge variant={VARIANT[status]}>
      <Icon /> {text}
    </Badge>
  )
}

const addYear = (iso: string) => {
  const d = parseDate(iso)
  d.setFullYear(d.getFullYear() + 1)
  return toISODate(d)
}

export default function ContractsPage() {
  const { pushNotification } = useAppStore()
  const [tab, setTab] = useState<'contracts' | 'documents'>('contracts')
  const [rowsC, setRowsC] = useState<ContractRecord[]>(() => [...contracts].sort((a, b) => (a.endDate ?? '9999').localeCompare(b.endDate ?? '9999')))
  const [rowsD, setRowsD] = useState<ExpiringDocument[]>(expiringDocuments)
  const [dateWindow, setDateWindow] = useState(ALL)
  const [type, setType] = useState(ALL)
  const [query, setQuery] = useState('')

  const dated = [...rowsC.map((c) => c.endDate).filter((d): d is string => !!d), ...rowsD.map((d) => d.expiryDate)]
  const expired = dated.filter((d) => daysUntil(d) < 0).length
  const soon = dated.filter((d) => daysUntil(d) >= 0 && daysUntil(d) <= 30).length
  const quarter = dated.filter((d) => daysUntil(d) > 30 && daysUntil(d) <= 90).length
  const probation = rowsC.filter((c) => c.type === 'Probation' && c.endDate && daysUntil(c.endDate) <= 30).length

  const byName = (employeeId: string) => {
    const e = employeeById(employeeId)
    return !query || (e && `${e.name} ${e.id}`.toLowerCase().includes(query.toLowerCase()))
  }
  const contractRows = rowsC.filter((c) => (type === ALL || c.type === type) && inWindow(c.endDate, dateWindow) && byName(c.employeeId))
  const docRows = rowsD.filter((d) => (type === ALL || d.type === type) && inWindow(d.expiryDate, dateWindow) && byName(d.employeeId))

  const remind = (employeeId: string, what: string) => {
    const e = employeeById(employeeId)
    toast.success('Reminder sent', { description: `${e?.name} · ${what}` })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Contracts & expiries" description="Contract end dates, probation reviews and employee documents that need renewal." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Expired" value={expired} icon={FileX2} tone="rose" hint="needs action now" onClick={() => setDateWindow('Expired')} />
        <StatCard label="Expiring in 30 days" value={soon} icon={AlarmClock} tone="amber" hint="contracts and documents" onClick={() => setDateWindow('Within 30 days')} />
        <StatCard label="Due in 31–90 days" value={quarter} icon={CalendarClock} tone="sky" hint="plan renewals" onClick={() => setDateWindow('Within 90 days')} />
        <StatCard label="Probation reviews" value={probation} icon={ShieldAlert} tone="violet" hint="ending within 30 days" />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as typeof tab)
            setType(ALL)
          }}
        >
          <TabsList>
            <TabsTrigger value="contracts">
              <FileClock className="size-4" /> {`Contracts (${rowsC.length})`}
            </TabsTrigger>
            <TabsTrigger value="documents">
              <ShieldAlert className="size-4" /> {`Documents (${rowsD.length})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchInput value={query} onChange={setQuery} placeholder="Search employee…" />
          <FilterSelect value={dateWindow} onChange={setDateWindow} options={WINDOWS} label="Dates" />
          <FilterSelect
            value={type}
            onChange={setType}
            options={tab === 'contracts' ? ['Fixed-term', 'Probation', 'Indefinite'] : ['HSE Certificate', 'Site Work Permit', 'Driving License', 'Medical Certificate', 'National ID']}
            label="Types"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {(tab === 'contracts' ? contractRows : docRows).length === 0 ? (
          <EmptyState icon={FileClock} title="Nothing matches these filters" description="Try another date window or type." />
        ) : tab === 'contracts' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead className="hidden md:table-cell">Start</TableHead>
                <TableHead className="hidden sm:table-cell">End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractRows.map((c) => {
                const e = employeeById(c.employeeId)!
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <PersonCell name={e.name} subtitle={`${e.position} · ${e.department}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{c.type}</div>
                      <div className="font-mono text-xs text-muted-foreground" data-no-translate>
                        {c.id}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{formatDate(c.startDate)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{c.endDate ? formatDate(c.endDate) : '—'}</TableCell>
                    <TableCell>
                      <ExpiryBadge iso={c.endDate} />
                    </TableCell>
                    <TableCell className="text-end">
                      {c.endDate && daysUntil(c.endDate) <= 90 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRowsC((prev) => prev.map((x) => (x.id === c.id ? (c.type === 'Probation' ? { ...x, type: 'Indefinite', endDate: null } : { ...x, endDate: addYear(x.endDate!) }) : x)))
                            toast.success(c.type === 'Probation' ? 'Employment confirmed' : 'Contract renewed', {
                              description: c.type === 'Probation' ? `${e.name} moves to an indefinite contract.` : `${e.name} · ${formatDate(addYear(c.endDate!))}`,
                            })
                            pushNotification({ role: 'hr', kind: 'document', title: c.type === 'Probation' ? 'Probation confirmed' : 'Contract renewed', message: `${e.name} — ${c.id}`, link: '/hr/contracts' })
                          }}
                        >
                          <RefreshCw /> {c.type === 'Probation' ? 'Confirm' : 'Renew'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Document</TableHead>
                <TableHead className="hidden sm:table-cell">Expiry date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docRows.map((d) => {
                const e = employeeById(d.employeeId)!
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <PersonCell name={e.name} subtitle={`${e.location} · ${e.department}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{d.type}</div>
                      <div className="font-mono text-xs text-muted-foreground" data-no-translate>
                        {d.number}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(d.expiryDate)}</TableCell>
                    <TableCell>
                      <ExpiryBadge iso={d.expiryDate} />
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => remind(d.employeeId, d.type)}>
                          <BellRing /> <span className="hidden md:inline">Remind</span>
                        </Button>
                        {daysUntil(d.expiryDate) <= 90 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRowsD((prev) => prev.map((x) => (x.id === d.id ? { ...x, expiryDate: addYear(x.expiryDate < DEMO_TODAY ? DEMO_TODAY : x.expiryDate) } : x)))
                              toast.success('Renewal recorded', { description: `${e.name} · ${d.type}` })
                            }}
                          >
                            <RefreshCw /> Renewed
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
