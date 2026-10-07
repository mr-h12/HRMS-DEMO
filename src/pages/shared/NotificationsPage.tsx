import { BellOff, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { NotificationIcon } from '@/components/notifications/NotificationIcon'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRole } from '@/hooks/useRole'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import { relativeTime } from '@/utils/format'

export default function NotificationsPage() {
  const role = useRole()
  const navigate = useNavigate()
  const { notifications, markAllNotificationsRead, markNotificationRead } = useAppStore()
  const [tab, setTab] = useState('all')
  const mine = notifications.filter((n) => n.role === role)
  const list = tab === 'unread' ? mine.filter((n) => !n.read) : mine
  const unread = mine.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Updates relevant to your role."
        actions={
          <Button variant="outline" disabled={!unread} onClick={() => markAllNotificationsRead(role)}>
            <CheckCheck /> Mark all as read
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({mine.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread})</TabsTrigger>
        </TabsList>
      </Tabs>
      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <EmptyState icon={BellOff} title="You’re all caught up" description="There are no unread notifications right now." />
        ) : (
          list.map((n) => (
            <div key={n.id} className={cn('flex items-start gap-4 border-b px-5 py-4 last:border-0', !n.read && 'bg-primary/[0.03]')}>
              <NotificationIcon kind={n.kind} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{n.title}</span>
                  {!n.read && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground/80">{relativeTime(n.createdAt)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                {n.link && (
                  <Button variant="ghost" size="sm" onClick={() => { markNotificationRead(n.id); navigate(n.link!) }}>
                    Open
                  </Button>
                )}
                {!n.read && (
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => markNotificationRead(n.id)}>
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
