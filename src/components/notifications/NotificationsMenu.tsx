import { Bell, BellOff, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EmptyState } from '@/components/common/EmptyState'
import { useRole } from '@/hooks/useRole'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import { relativeTime } from '@/utils/format'
import { NotificationIcon } from './NotificationIcon'

export function NotificationsMenu() {
  const role = useRole()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore()
  const mine = notifications.filter((n) => n.role === role)
  const unread = mine.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unread} unread)`}>
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-card">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-1.5rem)] p-0 sm:w-96">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Notifications</div>
            <div className="text-xs text-muted-foreground">{unread ? `${unread} unread` : 'You’re all caught up'}</div>
          </div>
          <Button variant="ghost" size="xs" disabled={!unread} onClick={() => markAllNotificationsRead(role)}>
            <CheckCheck /> Mark all read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {mine.length === 0 ? (
            <EmptyState icon={BellOff} title="No notifications" description="New activity for this role will show up here." />
          ) : (
            mine.slice(0, 8).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  markNotificationRead(n.id)
                  if (n.link) navigate(n.link)
                  setOpen(false)
                }}
                className={cn('flex w-full gap-3 border-b px-4 py-3 text-left transition last:border-0 hover:bg-muted/60', !n.read && 'bg-primary/[0.03]')}
              >
                <NotificationIcon kind={n.kind} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-medium">{n.title}</span>
                    {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{relativeTime(n.createdAt)}</p>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              navigate(`/${role}/notifications`)
              setOpen(false)
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
