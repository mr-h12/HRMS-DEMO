import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function Field({ label, htmlFor, error, hint, children, className, required }: { label: string; htmlFor?: string; error?: string; hint?: string; children: ReactNode; className?: string; required?: boolean }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function FileDrop({ id, file, onFile, accept = '.pdf,.jpg,.jpeg,.png,.docx', label = 'Upload a file' }: { id: string; file: File | null; onFile: (f: File | null) => void; accept?: string; label?: string }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-3 text-sm transition hover:border-primary/50 hover:bg-primary/5"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-card shadow-xs">
        <svg viewBox="0 0 24 24" className="size-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{file ? file.name : label}</span>
        <span className="block text-xs text-muted-foreground">{file ? `${Math.max(1, Math.round(file.size / 1024))} KB · click to replace` : 'PDF, JPG, PNG or DOCX up to 10 MB'}</span>
      </span>
      <input id={id} type="file" accept={accept} className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
    </label>
  )
}
