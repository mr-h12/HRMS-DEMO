import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FileDrop, Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEMO_TODAY } from '@/data/attendance'
import type { EmployeeDocument } from '@/types'

const CATEGORIES: EmployeeDocument['category'][] = ['Identity', 'Certificate', 'Medical', 'Contract', 'Letter', 'Policy', 'Payroll']

export function UploadDocumentModal({ open, onOpenChange, onUpload }: { open: boolean; onOpenChange: (o: boolean) => void; onUpload: (d: EmployeeDocument) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<EmployeeDocument['category']>('Certificate')
  const [expires, setExpires] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const submit = () => {
    if (!file) return setError('Choose a file to upload')
    setUploading(true)
    setTimeout(() => {
      const ext = (file.name.split('.').pop() ?? 'pdf').toUpperCase()
      onUpload({
        id: `D-${Date.now()}`,
        name: name.trim() || file.name.replace(/\.[^.]+$/, ''),
        category,
        fileType: (['PDF', 'DOCX', 'JPG', 'PNG'].includes(ext) ? ext : 'PDF') as EmployeeDocument['fileType'],
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        uploadedAt: DEMO_TODAY,
        expiresAt: expires || undefined,
        status: expires ? 'Valid' : undefined,
      })
      toast.success('Document uploaded', { description: `${name || file.name} · sent to HR for verification` })
      setUploading(false)
      setFile(null)
      setName('')
      setExpires('')
      setError('')
      onOpenChange(false)
    }, 900)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>Uploaded documents are verified by HR within 2 business days.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field label="File" error={error} required>
            <FileDrop id="doc-file" file={file} onFile={(f) => { setFile(f); setError('') }} />
          </Field>
          <Field label="Document name" htmlFor="doc-name" hint="Defaults to the file name">
            <Input id="doc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AWS Certification" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Select value={category} onValueChange={(v) => setCategory(v as EmployeeDocument['category'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Expiry date" htmlFor="doc-exp" hint="Optional">
              <Input id="doc-exp" type="date" value={expires} onChange={(e) => setExpires(e.target.value)} />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={uploading}>
            {uploading && <Loader2 className="animate-spin" />} Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
