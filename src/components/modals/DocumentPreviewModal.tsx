import { Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EmployeeDocument } from '@/types'
import { downloadFile } from '@/utils/download'
import { formatDate } from '@/utils/format'

export function downloadDocument(d: EmployeeDocument, owner = 'Ahmed Hassan (EMP-1042)') {
  downloadFile(
    `${d.name.replace(/[^a-z0-9]+/gi, '-')}.txt`,
    [`${d.name}`, `Category: ${d.category}`, `Owner: ${d.owner ?? owner}`, `Uploaded: ${formatDate(d.uploadedAt)}`, d.expiresAt ? `Expires: ${formatDate(d.expiresAt)}` : '', '', 'Northwind Group HRMS — demo export. The original file is stored in the document vault.'].filter(Boolean).join('\n'),
  )
  toast.success('Download started', { description: d.name })
}

export function DocumentPreviewModal({ doc, onOpenChange }: { doc: EmployeeDocument | null; onOpenChange: (o: boolean) => void }) {
  if (!doc) return null
  return (
    <Dialog open={!!doc} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{doc.name}</DialogTitle>
          <DialogDescription>
            {doc.category} · {doc.fileType} · {doc.size} · uploaded {formatDate(doc.uploadedAt)}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="bg-muted/40">
          <div className="mx-auto flex aspect-[1/1.2] max-h-[52vh] w-full max-w-sm flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b pb-3">
              <FileText className="size-4 text-primary" />
              <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">Northwind Group</span>
            </div>
            <div className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">{doc.name}</div>
            <div className="mt-4 space-y-2">
              {[92, 100, 84, 96, 70, 100, 88, 60].map((w, i) => (
                <div key={i} className="h-2 rounded bg-slate-100 dark:bg-slate-800" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-auto flex items-end justify-between pt-6">
              <div className="space-y-1.5">
                <div className="h-2 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-2 w-16 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-indigo-300 text-[9px] font-bold text-indigo-400">VERIFIED</div>
            </div>
          </div>
          {doc.expiresAt && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Expires {formatDate(doc.expiresAt)}</span>
              {doc.status && <StatusBadge status={doc.status} />}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => downloadDocument(doc)}>
            <Download /> Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
