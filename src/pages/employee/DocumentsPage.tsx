import { Download, Eye, FileImage, FileText, FolderSearch, LayoutGrid, List, Upload } from 'lucide-react'
import { useState } from 'react'
import { ALL, FilterSelect, SearchInput } from '@/components/common/Filters'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DocumentPreviewModal, downloadDocument } from '@/components/modals/DocumentPreviewModal'
import { UploadDocumentModal } from '@/components/modals/UploadDocumentModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import type { EmployeeDocument } from '@/types'
import { formatDate } from '@/utils/format'

const FILE_TONE: Record<EmployeeDocument['fileType'], string> = {
  PDF: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  DOCX: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
  JPG: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  PNG: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
}

export function FileIcon({ type }: { type: EmployeeDocument['fileType'] }) {
  const Icon = type === 'JPG' || type === 'PNG' ? FileImage : FileText
  return (
    <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', FILE_TONE[type])}>
      <Icon className="size-5" />
    </span>
  )
}

export default function DocumentsPage() {
  const { myDocuments, addDocument } = useAppStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [previewing, setPreviewing] = useState<EmployeeDocument | null>(null)
  const categories = [...new Set(myDocuments.map((d) => d.category))]
  const filtered = myDocuments.filter((d) => (category === ALL || d.category === category) && d.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Documents"
        description="Contracts, identity documents, certificates and HR letters."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload /> Upload document
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={query} onChange={setQuery} placeholder="Search documents…" />
        <FilterSelect value={category} onChange={setCategory} options={categories} label="Categories" />
        <div className="flex rounded-lg border bg-card p-0.5 sm:ms-auto">
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn('flex size-8 items-center justify-center rounded-md text-muted-foreground transition', view === v && 'bg-muted text-foreground')}
              aria-label={`${v} view`}
              aria-pressed={view === v}
            >
              {v === 'grid' ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderSearch}
            title="No documents found"
            description="Try a different search or category, or upload a new document."
            action={
              <Button variant="outline" onClick={() => setUploadOpen(true)}>
                <Upload /> Upload document
              </Button>
            }
          />
        </Card>
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((d) => (
            <Card key={d.id} className="group flex flex-col p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <FileIcon type={d.fileType} />
                {d.status && <StatusBadge status={d.status} />}
              </div>
              <div className="mt-4 line-clamp-2 min-h-10 text-sm font-semibold">{d.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {d.category} · {d.fileType} · {d.size}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{d.expiresAt ? `Expires ${formatDate(d.expiresAt)}` : `Uploaded ${formatDate(d.uploadedAt)}`}</div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-3">
                <Button variant="ghost" size="sm" onClick={() => setPreviewing(d)}>
                  <Eye /> View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => downloadDocument(d)}>
                  <Download /> Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                <TableHead className="hidden lg:table-cell">Expiry</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileIcon type={d.fileType} />
                      <div className="min-w-0">
                        <div className="max-w-64 truncate font-medium">{d.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.fileType} · {d.size}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{d.category}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{formatDate(d.uploadedAt)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{d.expiresAt ? <span className="flex items-center gap-2">{formatDate(d.expiresAt)} {d.status && <StatusBadge status={d.status} />}</span> : '—'}</TableCell>
                  <TableCell className="text-end">
                    <Button variant="ghost" size="icon-sm" onClick={() => setPreviewing(d)} aria-label={`View ${d.name}`}>
                      <Eye />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => downloadDocument(d)} aria-label={`Download ${d.name}`}>
                      <Download />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <UploadDocumentModal open={uploadOpen} onOpenChange={setUploadOpen} onUpload={addDocument} />
      <DocumentPreviewModal doc={previewing} onOpenChange={(o) => !o && setPreviewing(null)} />
    </div>
  )
}
