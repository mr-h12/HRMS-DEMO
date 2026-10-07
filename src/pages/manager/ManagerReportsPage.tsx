import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { MANAGER_REPORTS } from '@/components/reports/definitions'
import { ReportCard, ReportView, type ReportDefinition } from '@/components/reports/ReportView'

export default function ManagerReportsPage() {
  const [open, setOpen] = useState<ReportDefinition | null>(null)
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Team-level analytics for Platform Engineering. Data is limited to your direct reports." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MANAGER_REPORTS.map((r) => (
          <ReportCard key={r.id} report={r} onOpen={() => setOpen(r)} />
        ))}
      </div>
      <ReportView report={open} onOpenChange={(o) => !o && setOpen(null)} />
    </div>
  )
}
