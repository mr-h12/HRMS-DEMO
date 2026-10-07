import { cn } from '@/lib/utils'
import { avatarColor } from '@/utils/colors'
import { initials } from '@/utils/format'

const SIZES = { xs: 'size-6 text-[10px]', sm: 'size-8 text-xs', md: 'size-9 text-[13px]', lg: 'size-12 text-base', xl: 'size-20 text-2xl' }

export function UserAvatar({ name, size = 'md', className, ring }: { name: string; size?: keyof typeof SIZES; className?: string; ring?: boolean }) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none', SIZES[size], avatarColor(name), ring && 'ring-2 ring-card', className)}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}

export function PersonCell({ name, subtitle, size = 'md', onClick }: { name: string; subtitle?: string; size?: keyof typeof SIZES; onClick?: () => void }) {
  const content = (
    <>
      <UserAvatar name={name} size={size} />
      <div className="min-w-0 text-left">
        <div className={cn('truncate text-sm font-medium', onClick && 'group-hover:text-primary')}>{name}</div>
        {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </>
  )
  return onClick ? (
    <button type="button" onClick={onClick} className="group flex min-w-0 items-center gap-3 outline-none">
      {content}
    </button>
  ) : (
    <div className="flex min-w-0 items-center gap-3">{content}</div>
  )
}
