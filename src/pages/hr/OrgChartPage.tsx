import { ChevronDown, Network, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { StatCard } from '@/components/cards/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { SearchInput } from '@/components/common/Filters'
import { PageHeader } from '@/components/common/PageHeader'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import type { Employee } from '@/types'

/** Big teams list their first members and expand on request. */
const PREVIEW = 12

export default function OrgChartPage() {
  const { employees, openEmployee } = useAppStore()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [showAll, setShowAll] = useState<Set<string>>(() => new Set())
  const [highlight, setHighlight] = useState<string | null>(null)

  const { roots, children, byId } = useMemo(() => {
    const byId = new Map(employees.map((e) => [e.id, e]))
    const children = new Map<string, Employee[]>()
    for (const e of employees) {
      if (!e.managerId) continue
      const list = children.get(e.managerId) ?? []
      list.push(e)
      children.set(e.managerId, list)
    }
    // Managers first, then by name, so the structure reads top-down.
    for (const list of children.values()) list.sort((a, b) => (children.has(b.id) ? 1 : 0) - (children.has(a.id) ? 1 : 0) || a.name.localeCompare(b.name))
    return { roots: employees.filter((e) => !e.managerId), children, byId }
  }, [employees])

  // CEO and the leadership team start open.
  useEffect(() => setExpanded(new Set(roots.map((r) => r.id))), [roots])

  const managers = [...children.keys()]
  const spans = managers.map((m) => children.get(m)!.length)
  const depth = (id: string): number => {
    const kids = children.get(id)
    return kids ? 1 + Math.max(...kids.map((k) => depth(k.id))) : 1
  }

  const matches = query.trim().length >= 2 ? employees.filter((e) => `${e.name} ${e.position} ${e.id}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6) : []

  const reveal = (id: string) => {
    const next = new Set(expanded)
    const all = new Set(showAll)
    let cursor = byId.get(id)
    while (cursor?.managerId) {
      next.add(cursor.managerId)
      all.add(cursor.managerId)
      cursor = byId.get(cursor.managerId)
    }
    setExpanded(next)
    setShowAll(all)
    setHighlight(id)
    setQuery('')
    requestAnimationFrame(() => document.getElementById(`org-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const renderNode = (e: Employee, level: number) => {
    const kids = children.get(e.id) ?? []
    const isOpen = expanded.has(e.id)
    const visible = showAll.has(e.id) ? kids : kids.slice(0, PREVIEW)
    return (
      <li key={e.id} className="space-y-3">
        <div
          id={`org-${e.id}`}
          className={cn(
            'flex items-center gap-3 rounded-lg border bg-card p-3 shadow-1 transition-colors',
            level === 0 && 'border-primary/40',
            highlight === e.id && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          )}
        >
          <button type="button" onClick={() => openEmployee(e.id)} className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <UserAvatar name={e.name} size={level === 0 ? 'md' : 'sm'} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{e.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{level === 0 ? e.position : `${e.position} · ${e.team}`}</span>
            </span>
          </button>
          {kids.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => toggle(e.id)} aria-expanded={isOpen} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${e.name}'s team`} className="shrink-0 gap-1 px-2">
              <Users className="size-3.5" />
              <span className="tabular">{kids.length}</span>
              <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
            </Button>
          )}
        </div>
        {isOpen && kids.length > 0 && (
          <div className="ms-4 border-s-2 border-border ps-4 sm:ms-6 sm:ps-6">
            <ul className={cn('grid gap-3', kids.some((k) => children.has(k.id)) ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3')}>{visible.map((k) => renderNode(k, level + 1))}</ul>
            {kids.length > PREVIEW && !showAll.has(e.id) && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowAll((prev) => new Set(prev).add(e.id))}>
                {`Show all ${kids.length} members`}
              </Button>
            )}
          </div>
        )}
      </li>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Org chart" description="Reporting lines across Smart Technology. Select a person to open their profile." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Employees" value={employees.length} icon={Users} tone="indigo" />
        <StatCard label="People managers" value={managers.length} icon={Network} tone="sky" />
        <StatCard label="Average span of control" value={(spans.reduce((s, n) => s + n, 0) / spans.length).toFixed(1)} icon={Users} tone="emerald" hint="direct reports per manager" />
        <StatCard label="Reporting levels" value={roots.length ? depth(roots[0].id) : 0} icon={Network} tone="amber" hint="CEO to front line" />
      </div>

      <Card className="p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="relative w-full sm:w-80">
            <SearchInput value={query} onChange={setQuery} placeholder="Find a person…" className="sm:w-80" />
            {matches.length > 0 && (
              <ul className="absolute inset-x-0 top-11 z-20 overflow-hidden rounded-lg border bg-popover p-1 shadow-2">
                {matches.map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => reveal(m.id)} className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-start hover:bg-muted">
                      <UserAvatar name={m.name} size="xs" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{m.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{m.position}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setExpanded(new Set(managers))}>
              Expand all
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExpanded(new Set(roots.map((r) => r.id)))}>
              Collapse
            </Button>
          </div>
        </div>
        {roots.length === 0 ? <EmptyState icon={Network} title="No reporting lines yet" /> : <ul className="space-y-3">{roots.map((r) => renderNode(r, 0))}</ul>}
      </Card>
    </div>
  )
}
