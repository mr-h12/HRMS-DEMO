import { Download, Lightbulb, Printer } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/misc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { downloadFile, toCSV } from '@/utils/download'

export interface ReportDefinition {
  id: string
  title: string
  description: string
  icon: LucideIcon
  tone: string
  updated: string
  headline: string
  kpis: { label: string; value: string; note?: string }[]
  chart: () => ReactNode
  chartTitle: string
  insight: string
  table: { columns: string[]; rows: (string | number)[][] }
}

export function ReportView({ report, onOpenChange }: { report: ReportDefinition | null; onOpenChange: (o: boolean) => void }) {
  const [period, setPeriod] = useState('ytd')
  const [loading, setLoading] = useState(false)
  if (!report) return null

  const changePeriod = (p: string) => {
    setPeriod(p)
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  const exportCsv = () => {
    const rows = report.table.rows.map((r) => Object.fromEntries(report.table.columns.map((c, i) => [c, r[i]])))
    const file = `${report.id}-report.csv`
    downloadFile(file, toCSV(rows), 'text/csv')
    toast.success('Report exported', { description: file })
  }

  return (
    <Dialog open={!!report} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader className="sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className={`flex size-10 items-center justify-center rounded-xl ${report.tone}`}>
              <report.icon className="size-5" />
            </span>
            <div>
              <DialogTitle>{report.title} report</DialogTitle>
              <DialogDescription>{report.description}</DialogDescription>
            </div>
          </div>
          <Select value={period} onValueChange={changePeriod}>
            <SelectTrigger className="mt-3 w-full sm:mt-0 sm:w-44" aria-label="Report period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="q3">Q3 2026</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </DialogHeader>
        <DialogBody className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {report.kpis.map((k) => (
              <div key={k.label} className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">{k.label}</div>
                {loading ? <Skeleton className="mt-2 h-7 w-20" /> : <div className="mt-1 text-xl font-semibold tracking-tight tabular">{k.value}</div>}
                {k.note && <div className="mt-1 text-[11px] text-muted-foreground">{k.note}</div>}
              </div>
            ))}
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-3 text-sm font-semibold">{report.chartTitle}</div>
            {loading ? <Skeleton className="h-64 w-full" /> : report.chart()}
          </div>
          <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <div className="font-semibold">Key insight</div>
              <p className="mt-0.5 text-muted-foreground">{report.insight}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  {report.table.columns.map((c) => (
                    <TableHead key={c}>{c}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.table.rows.map((r, i) => (
                  <TableRow key={i}>
                    {r.map((cell, j) => (
                      <TableCell key={j} className={j === 0 ? 'font-medium' : 'tabular'}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogBody>
        <DialogFooter>
          <span className="mr-auto hidden text-xs text-muted-foreground sm:block">Last updated {report.updated}</span>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer /> Print
          </Button>
          <Button onClick={exportCsv}>
            <Download /> Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ReportCard({ report, onOpen }: { report: ReportDefinition; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col rounded-xl border bg-card p-5 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between">
        <span className={`flex size-11 items-center justify-center rounded-xl ${report.tone}`}>
          <report.icon className="size-5" />
        </span>
        <span className="text-[11px] text-muted-foreground">Updated {report.updated}</span>
      </div>
      <div className="mt-4 text-[15px] font-semibold">{report.title}</div>
      <p className="mt-1 text-[13px] text-muted-foreground">{report.description}</p>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm font-semibold tabular">{report.headline}</span>
        <span className="text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">Open report →</span>
      </div>
    </button>
  )
}
