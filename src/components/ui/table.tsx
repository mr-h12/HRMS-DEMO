import * as React from 'react'
import { cn } from '@/lib/utils'

export function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="relative w-full overflow-x-auto scrollbar-thin">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}
export const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
  <thead className={cn('bg-muted/50 [&_tr]:border-b', className)} {...props} />
)
export const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
export const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
  <tr className={cn('border-b transition-colors hover:bg-muted/40', className)} {...props} />
)
export const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
  <th
    className={cn('h-10 px-4 text-left align-middle text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase first:pl-5 last:pr-5', className)}
    {...props}
  />
)
export const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
  <td className={cn('px-4 py-3 align-middle whitespace-nowrap first:pl-5 last:pr-5', className)} {...props} />
)
