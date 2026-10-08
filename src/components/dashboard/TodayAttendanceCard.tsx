import { Coffee, LogIn, LogOut, MapPin, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { todayAttendance } from '@/data/attendance'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'

const SHIFT_START = 8 * 60 + 57
const SHIFT_MINUTES = 8 * 60

/** Minutes worked today, using the real time-of-day clamped to the shift (break excluded). */
function workedMinutes(now: Date) {
  const mins = Math.min(17 * 60, Math.max(SHIFT_START, now.getHours() * 60 + now.getMinutes()))
  let worked = mins - SHIFT_START
  if (mins > 14 * 60) worked -= 60
  else if (mins > 13 * 60) worked -= mins - 13 * 60
  return Math.max(0, worked)
}

export function useClockTick() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function useClockAction() {
  const { toggleClock } = useAppStore()
  return () => {
    const next = toggleClock()
    if (next.clockedIn) toast.success(`Clocked in at ${next.clockInTime}`, { description: 'Location verified · Cairo HQ — Tower B' })
    else toast.success(`Clocked out at ${next.clockOutTime}`, { description: 'Have a great evening, Ahmed!' })
  }
}

export function TodayAttendanceCard() {
  const { clock } = useAppStore()
  const now = useClockTick()
  const onClock = useClockAction()
  const worked = workedMinutes(now)
  const pct = Math.round((worked / (SHIFT_MINUTES - 60)) * 100)
  const h = Math.floor(worked / 60)
  const m = worked % 60

  const timeline = [
    { label: 'Check-in', value: clock.clockInTime, icon: LogIn, tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300' },
    { label: 'Break', value: todayAttendance.breakStart, icon: Coffee, tone: 'text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300' },
    { label: clock.clockOutTime ? 'Checked out' : 'Expected checkout', value: clock.clockOutTime ?? todayAttendance.expectedCheckout, icon: LogOut, tone: 'text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-300' },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Today’s attendance</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="size-3" /> {todayAttendance.location} · Shift {todayAttendance.shift}
          </CardDescription>
        </div>
        <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap', clock.clockedIn ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-muted text-muted-foreground')}>
          <span className={cn('size-1.5 rounded-full', clock.clockedIn ? 'animate-pulse bg-emerald-500' : 'bg-slate-400')} />
          {clock.clockedIn ? 'Clocked in' : 'Clocked out'}
        </span>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {timeline.map((t) => (
            <div key={t.label} className="rounded-xl border p-3">
              <span className={cn('mb-2 flex size-7 items-center justify-center rounded-lg', t.tone)}>
                <t.icon className="size-3.5" />
              </span>
              <div className="text-sm font-semibold tabular">{t.value}</div>
              <div className="truncate text-[11px] text-muted-foreground">{t.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Timer className="size-3.5" /> Working hours
            </span>
            <span className="font-medium tabular">
              {`${h}h ${String(m).padStart(2, '0')}m`} <span className="text-muted-foreground">/ 7h 00m</span>
            </span>
          </div>
          <Progress value={pct} indicatorClassName="bg-gradient-to-r from-indigo-500 to-violet-500" />
          <div className="mt-1.5 text-end text-[11px] text-muted-foreground tabular">{Math.min(100, pct)}% of today’s shift</div>
        </div>
        <Button className="w-full" variant={clock.clockedIn ? 'outline' : 'default'} onClick={onClock}>
          {clock.clockedIn ? <LogOut /> : <LogIn />}
          {clock.clockedIn ? 'Clock out' : 'Clock in'}
        </Button>
      </CardContent>
    </Card>
  )
}
