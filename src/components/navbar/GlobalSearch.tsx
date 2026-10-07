import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Building2, CornerDownLeft, FileText, Inbox, Search, SearchX, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { UserAvatar } from '@/components/common/UserAvatar'
import { companyDocuments, SEARCHABLE_DEPARTMENTS } from '@/data/company'
import { EMPLOYEE_ID, MANAGER_ID } from '@/data/employees'
import { useRole } from '@/hooks/useRole'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'

interface Result {
  id: string
  group: 'Employees' | 'Departments' | 'Requests' | 'Documents'
  title: string
  subtitle: string
  icon?: ReactNode
  onSelect: () => void
}

const GROUP_ICONS = { Employees: Users, Departments: Building2, Requests: Inbox, Documents: FileText }

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const role = useRole()
  const navigate = useNavigate()
  const { employees, requests, myDocuments, openEmployee } = useAppStore()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const close = () => {
      setOpen(false)
      setQuery('')
    }
    const people = (role === 'manager' ? employees.filter((e) => e.managerId === MANAGER_ID || e.id === MANAGER_ID) : employees)
      .filter((e) => [e.name, e.id, e.position, e.department].some((v) => v.toLowerCase().includes(q)))
      .slice(0, 6)
      .map<Result>((e) => ({
        id: e.id, group: 'Employees', title: e.name, subtitle: `${e.position} · ${e.department} · ${e.id}`,
        icon: <UserAvatar name={e.name} size="sm" />,
        onSelect: () => { close(); openEmployee(e.id) },
      }))
    const depts = SEARCHABLE_DEPARTMENTS.filter((d) => d.name.toLowerCase().includes(q)).map<Result>((d) => ({
      id: d.name, group: 'Departments', title: d.name, subtitle: `${d.headcount} employees · Head: ${d.head}`,
      onSelect: () => {
        close()
        if (role === 'hr') navigate(`/hr/employees?department=${encodeURIComponent(d.name)}`)
        else if (role === 'manager' && d.name === 'Technology') navigate('/manager/team')
        else toast.info(d.name, { description: `${d.headcount} employees · Department head: ${d.head}` })
      },
    }))
    const scopedRequests = requests.filter((r) =>
      role === 'employee' ? r.employeeId === EMPLOYEE_ID : role === 'manager' ? r.managerId === MANAGER_ID : true,
    )
    const reqs = scopedRequests
      .filter((r) => [r.id, r.type, r.employeeName, r.leaveType ?? '', r.letterType ?? '', r.category ?? ''].some((v) => v.toLowerCase().includes(q)))
      .slice(0, 5)
      .map<Result>((r) => ({
        id: r.id, group: 'Requests', title: `${r.leaveType ?? r.letterType ?? r.type} — ${r.employeeName}`, subtitle: `${r.id} · ${r.status}`,
        onSelect: () => {
          close()
          navigate(role === 'employee' ? '/employee/requests' : role === 'manager' ? '/manager/approvals' : r.type === 'Leave' ? '/hr/leave' : '/hr/employees')
        },
      }))
    const docs = (role === 'hr' ? companyDocuments : myDocuments)
      .filter((d) => [d.name, d.category].some((v) => v.toLowerCase().includes(q)))
      .slice(0, 5)
      .map<Result>((d) => ({
        id: d.id, group: 'Documents', title: d.name, subtitle: `${d.category} · ${d.fileType} · ${d.size}`,
        onSelect: () => {
          close()
          navigate(role === 'hr' ? '/hr/documents' : '/employee/documents')
        },
      }))
    return [...people, ...depts, ...reqs, ...(role === 'manager' ? [] : docs)]
  }, [query, role, employees, requests, myDocuments, navigate, openEmployee])

  useEffect(() => setActive(0), [query])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(results.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter' && results[active]) {
      results[active].onSelect()
    }
  }

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const groups = (['Employees', 'Departments', 'Requests', 'Documents'] as const).filter((g) => results.some((r) => r.group === g))
  const suggestions = role === 'hr' ? ['Ahmed', 'Technology', 'Annual Leave', 'Passport'] : role === 'manager' ? ['Sara', 'Overtime', 'Expense', 'Technology'] : ['Mohamed', 'Leave', 'Contract', 'Salary']

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery('') }}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="group flex h-9 items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground transition hover:bg-muted max-md:size-9 max-md:justify-center max-md:border-0 max-md:bg-transparent max-md:px-0 md:w-64 xl:w-80"
          aria-label="Search"
        >
          <Search className="size-4 shrink-0" />
          <span className="hidden flex-1 text-left md:inline">Search people, requests…</span>
          <kbd className="hidden rounded border bg-card px-1.5 py-0.5 font-sans text-[10px] font-medium md:inline">⌘K</kbd>
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className="fixed top-[10vh] left-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border bg-card shadow-2xl outline-none data-[state=open]:animate-fade-in"
          onKeyDown={onKeyDown}
        >
          <DialogPrimitive.Title className="sr-only">Global search</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Search employees, departments, requests and documents</DialogPrimitive.Description>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees, departments, requests, documents…"
              className="h-13 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
          </div>
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
            {!query.trim() ? (
              <div className="px-2 py-3">
                <div className="mb-2 text-xs font-medium text-muted-foreground">Try searching for</div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full border bg-muted/50 px-3 py-1 text-xs hover:bg-muted">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <EmptyState icon={SearchX} title={`No results for “${query}”`} description="Try a name, employee ID, department or request type." />
            ) : (
              groups.map((g) => {
                const GIcon = GROUP_ICONS[g]
                return (
                  <div key={g} className="mb-1">
                    <div className="px-2 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{g}</div>
                    {results.map((r, i) =>
                      r.group !== g ? null : (
                        <button
                          key={r.group + r.id}
                          data-index={i}
                          type="button"
                          onMouseEnter={() => setActive(i)}
                          onClick={r.onSelect}
                          className={cn('flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left', active === i && 'bg-muted')}
                        >
                          {r.icon ?? (
                            <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                              <GIcon className="size-4 text-muted-foreground" />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{r.title}</div>
                            <div className="truncate text-xs text-muted-foreground">{r.subtitle}</div>
                          </div>
                          {active === i && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
                        </button>
                      ),
                    )}
                  </div>
                )
              })
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
