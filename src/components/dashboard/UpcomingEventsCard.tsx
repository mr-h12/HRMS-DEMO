import { CalendarHeart, GraduationCap, PartyPopper, Star, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ahmedEvents } from '@/data/company'
import { cn } from '@/lib/utils'
import { dateLocale } from '@/i18n/lang'
import { parseDate } from '@/utils/format'

const KIND = {
  review: { icon: Star, tone: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300' },
  meeting: { icon: Users, tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300' },
  holiday: { icon: PartyPopper, tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300' },
  training: { icon: GraduationCap, tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' },
  birthday: { icon: CalendarHeart, tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300' },
}

export function UpcomingEventsCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Upcoming events</CardTitle>
          <CardDescription>Next 30 days</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {ahmedEvents.map((e) => {
          const d = parseDate(e.date)
          const K = KIND[e.kind]
          return (
            <div key={e.id} className="flex items-center gap-3.5 rounded-xl p-2 transition hover:bg-muted/50">
              <div className="flex w-11 shrink-0 flex-col items-center rounded-lg border bg-card py-1">
                <span className="text-[10px] font-semibold text-primary uppercase">{d.toLocaleDateString(dateLocale(), { month: 'short' })}</span>
                <span className="text-base leading-tight font-semibold tabular">{d.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold">{e.title}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {e.time ? `${e.time} · ` : ''}
                  {e.description}
                </div>
              </div>
              <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', K.tone)}>
                <K.icon className="size-4" />
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
