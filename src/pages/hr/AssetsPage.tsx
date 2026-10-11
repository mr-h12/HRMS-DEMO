import { ArrowDownToLine, MoreHorizontal, Package, PackageCheck, Plus, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ASSET_ICONS } from '@/components/assets/assetIcons'
import { StatCard } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PersonCell } from '@/components/common/UserAvatar'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEMO_TODAY } from '@/data/attendance'
import { ASSET_CATEGORIES, initialAssets } from '@/data/assets'
import { DEPARTMENT_LIST, employeeById } from '@/data/employees'
import { useAppStore } from '@/store/AppStore'
import type { Asset, AssetStatus } from '@/types'
import { formatCompactCurrency, formatCurrency, formatDate } from '@/utils/format'


const STATUSES: AssetStatus[] = ['Assigned', 'In Stock', 'In Repair', 'Lost']

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [department, setDepartment] = useState(ALL)
  const [assigning, setAssigning] = useState<Asset | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const update = (id: string, patch: Partial<Asset>) => setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))

  const rows = assets.filter((a) => {
    const holder = a.employeeId ? employeeById(a.employeeId) : null
    if (category !== ALL && a.category !== category) return false
    if (status !== ALL && a.status !== status) return false
    if (department !== ALL && holder?.department !== department) return false
    if (query) {
      const hay = `${a.name} ${a.serial} ${a.id} ${holder?.name ?? ''}`.toLowerCase()
      if (!hay.includes(query.toLowerCase())) return false
    }
    return true
  })

  const assigned = assets.filter((a) => a.status === 'Assigned')
  const stock = assets.filter((a) => a.status === 'In Stock')

  const receive = (a: Asset) => {
    const holder = employeeById(a.employeeId!)
    update(a.id, { status: 'In Stock', employeeId: null, assignedOn: null })
    toast.success('Custody returned', { description: `Received from ${holder?.name} and moved to stock.` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets & custody"
        description="Company equipment, vehicles and site tools held by employees."
        actions={
          <Button onClick={() => setPickerOpen(true)} disabled={stock.length === 0}>
            <Plus /> Assign custody
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total assets" value={assets.length} icon={Package} tone="indigo" hint={`${ASSET_CATEGORIES.length} categories`} />
        <StatCard label="With employees" value={assigned.length} icon={PackageCheck} tone="emerald" hint={`${new Set(assigned.map((a) => a.employeeId)).size} custodians`} />
        <StatCard label="Asset value" value={formatCompactCurrency(assets.filter((a) => a.status !== 'Lost').reduce((s, a) => s + a.value, 0))} icon={ArrowDownToLine} tone="sky" hint="at purchase cost" />
        <StatCard label="Needs attention" value={assets.filter((a) => a.status === 'In Repair' || a.status === 'Lost').length} icon={Wrench} tone="amber" hint="in repair or lost" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b p-4 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search asset, serial or employee…" className="lg:w-80" />
          <div className="grid gap-2 sm:flex">
            <FilterSelect value={category} onChange={setCategory} options={ASSET_CATEGORIES} label="Asset types" />
            <FilterSelect value={status} onChange={setStatus} options={STATUSES} label="Statuses" />
            <FilterSelect value={department} onChange={setDepartment} options={DEPARTMENT_LIST} label="Departments" />
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState icon={Package} title="No assets match your filters" description="Try another type or status, or clear the search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Custodian</TableHead>
                <TableHead className="hidden md:table-cell">Since</TableHead>
                <TableHead className="hidden text-end lg:table-cell">Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => {
                const Icon = ASSET_ICONS[a.category]
                const holder = a.employeeId ? employeeById(a.employeeId) : null
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{a.name}</div>
                          <div className="font-mono text-xs text-muted-foreground" data-no-translate>{`${a.id} · ${a.serial}`}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{holder ? <PersonCell name={holder.name} subtitle={holder.department} size="sm" /> : <span className="text-muted-foreground">Warehouse</span>}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{a.assignedOn ? formatDate(a.assignedOn) : '—'}</TableCell>
                    <TableCell className="hidden text-end tabular lg:table-cell">{formatCurrency(a.value)}</TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${a.name}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {a.status === 'In Stock' && (
                            <DropdownMenuItem onSelect={() => setAssigning(a)}>
                              <PackageCheck /> Assign to employee
                            </DropdownMenuItem>
                          )}
                          {(a.status === 'Assigned' || a.status === 'Lost') && (
                            <DropdownMenuItem onSelect={() => receive(a)}>
                              <ArrowDownToLine /> Receive back
                            </DropdownMenuItem>
                          )}
                          {a.status !== 'In Repair' && a.status !== 'Lost' && (
                            <DropdownMenuItem
                              onSelect={() => {
                                update(a.id, { status: 'In Repair', employeeId: null, assignedOn: null })
                                toast.success('Sent for repair', { description: a.serial })
                              }}
                            >
                              <Wrench /> Send for repair
                            </DropdownMenuItem>
                          )}
                          {a.status === 'In Repair' && (
                            <DropdownMenuItem
                              onSelect={() => {
                                update(a.id, { status: 'In Stock' })
                                toast.success('Back in stock', { description: a.serial })
                              }}
                            >
                              <Package /> Mark as repaired
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <AssignDialog
        asset={assigning}
        stock={stock}
        open={!!assigning || pickerOpen}
        onOpenChange={(o) => {
          if (!o) {
            setAssigning(null)
            setPickerOpen(false)
          }
        }}
        onAssign={(assetId, employeeId) => {
          update(assetId, { status: 'Assigned', employeeId, assignedOn: DEMO_TODAY })
          toast.success('Custody assigned', { description: `Handed to ${employeeById(employeeId)?.name}. A custody receipt was generated for signature.` })
        }}
      />
    </div>
  )
}

function AssignDialog({
  asset, stock, open, onOpenChange, onAssign,
}: { asset: Asset | null; stock: Asset[]; open: boolean; onOpenChange: (o: boolean) => void; onAssign: (assetId: string, employeeId: string) => void }) {
  const { employees } = useAppStore()
  const people = useMemo(() => employees.filter((e) => e.status !== 'Notice Period').sort((a, b) => a.name.localeCompare(b.name)), [employees])
  const [assetId, setAssetId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const chosen = asset?.id ?? assetId

  const save = () => {
    if (!chosen || !employeeId) return
    onAssign(chosen, employeeId)
    setAssetId('')
    setEmployeeId('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign custody</DialogTitle>
          <DialogDescription>The employee signs a custody receipt and is responsible for the item until it is returned.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field label="Asset" required>
            <Select value={chosen} onValueChange={setAssetId} disabled={!!asset}>
              <SelectTrigger>
                <SelectValue placeholder="Select an item in stock" />
              </SelectTrigger>
              <SelectContent>
                {(asset ? [asset] : stock).map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {`${a.name} · ${a.serial}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Employee" required>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {people.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {`${e.name} · ${e.department}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!chosen || !employeeId}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
