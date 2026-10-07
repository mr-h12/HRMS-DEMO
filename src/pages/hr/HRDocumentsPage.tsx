import { AlertTriangle, Download, Eye, FileCheck2, FolderOpen, Send, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { StatCard } from '@/components/cards/StatCard'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DocumentPreviewModal, downloadDocument } from '@/components/modals/DocumentPreviewModal'
import { UploadDocumentModal } from '@/components/modals/UploadDocumentModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { companyDocuments } from '@/data/company'
import { FileIcon } from '@/pages/employee/DocumentsPage'
import type { EmployeeDocument } from '@/types'
import { formatDate } from '@/utils/format'

export default function HRDocumentsPage() {
  const [docs, setDocs] = useState<EmployeeDocument[]>(companyDocuments)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [previewing, setPreviewing] = useState<EmployeeDocument | null>(null)
  const expiring = docs.filter((d) => d.status === 'Expiring Soon' || d.status === 'Expired')
  const filtered = docs.filter((d) => (category === ALL || d.category === category) && d.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Company policies, contracts and employee document compliance."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload /> Upload
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Documents" value={docs.length} icon={FolderOpen} tone="indigo" hint="in the company vault" />
        <StatCard label="Expiring within 30 days" value={docs.filter((d) => d.status === 'Expiring Soon').length} icon={AlertTriangle} tone="amber" hint="action required" />
        <StatCard label="Expired" value={docs.filter((d) => d.status === 'Expired').length} icon={FileCheck2} tone="rose" hint="renewal overdue" />
      </div>

      {expiring.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 p-4 dark:border-amber-500/30 dark:bg-amber-500/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AlertTriangle className="size-5 shrink-0 text-amber-600" />
            <div className="flex-1 text-sm">
              <span className="font-semibold">{expiring.length} employee documents need attention.</span>{' '}
              <span className="text-muted-foreground">{expiring.map((d) => d.owner).join(', ')}.</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success('Renewal requests sent', { description: `${expiring.length} employees were asked to upload updated documents.` })}>
              <Send /> Request renewals
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <SearchInput value={query} onChange={setQuery} placeholder="Search documents…" />
          <FilterSelect value={category} onChange={setCategory} options={[...new Set(docs.map((d) => d.category))]} label="Categories" />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={FolderOpen} title="No documents found" description="Try another search term or category." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead className="hidden md:table-cell">Owner</TableHead>
                <TableHead className="hidden lg:table-cell">Uploaded</TableHead>
                <TableHead className="hidden sm:table-cell">Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileIcon type={d.fileType} />
                      <div className="min-w-0">
                        <div className="max-w-72 truncate font-medium">{d.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.category} · {d.size}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{d.owner ?? 'Company-wide'}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{formatDate(d.uploadedAt)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {d.expiresAt ? (
                      <div className="flex items-center gap-2">
                        <span className="tabular">{formatDate(d.expiresAt)}</span>
                        {d.status && <StatusBadge status={d.status} />}
                      </div>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => setPreviewing(d)} aria-label={`View ${d.name}`}>
                      <Eye />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => downloadDocument(d, 'Northwind Group')} aria-label={`Download ${d.name}`}>
                      <Download />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <UploadDocumentModal open={uploadOpen} onOpenChange={setUploadOpen} onUpload={(d) => setDocs((prev) => [d, ...prev])} />
      <DocumentPreviewModal doc={previewing} onOpenChange={(o) => !o && setPreviewing(null)} />
    </div>
  )
}
