import { Bell, Globe, Moon, Palette, Sun } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/misc'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/hooks/useLanguage'
import { useRole } from '@/hooks/useRole'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

const NOTIFICATION_PREFS = {
  employee: ['Request status updates', 'Payslip published', 'Policy acknowledgements', 'Company announcements'],
  manager: ['New approval requests', 'Team attendance alerts', 'Review reminders', 'Recruitment updates'],
  hr: ['Payroll readiness', 'Document expiry alerts', 'Leave requests', 'Recruitment pipeline changes', 'Probation milestones'],
}

export default function PreferencesPage() {
  const role = useRole()
  const { theme, setTheme } = useTheme()
  const [prefs, setPrefs] = useState<Record<string, boolean>>({})
  const { lang, setLang } = useLanguage()
  const [tz, setTz] = useState('Africa/Cairo')

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Preferences" description="Personalize how the HRMS looks and notifies you." />
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-4" /> Appearance
            </CardTitle>
            <CardDescription>Choose a theme for this browser.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn('rounded-xl border-2 p-3 text-start transition', theme === t ? 'border-primary' : 'border-border hover:border-primary/40')}
              aria-pressed={theme === t}
            >
              <div className={cn('mb-3 h-20 rounded-lg border p-2', t === 'dark' ? 'bg-slate-900' : 'bg-slate-50')}>
                <div className={cn('h-2 w-1/2 rounded', t === 'dark' ? 'bg-slate-700' : 'bg-slate-200')} />
                <div className={cn('mt-2 h-8 rounded', t === 'dark' ? 'bg-slate-800' : 'bg-white')} />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium capitalize">
                {t === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />} {t}
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-4" /> Region & language
            </CardTitle>
            <CardDescription>Used for dates, numbers and email notifications.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Language</Label>
            <Select value={lang} onValueChange={(v) => setLang(v as 'en' | 'ar')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en" data-no-translate>English</SelectItem>
                <SelectItem value="ar">العربية (Arabic)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Time zone</Label>
            <Select value={tz} onValueChange={setTz}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Cairo">Cairo (GMT+3)</SelectItem>
                <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                <SelectItem value="Asia/Riyadh">Riyadh (GMT+3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4" /> Email notifications
            </CardTitle>
            <CardDescription>In-app notifications are always on.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="divide-y">
          {NOTIFICATION_PREFS[role].map((p) => (
            <div key={p} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <Label htmlFor={p} className="font-normal">
                {p}
              </Label>
              <Switch id={p} checked={prefs[p] ?? true} onCheckedChange={(v) => setPrefs((s) => ({ ...s, [p]: v }))} />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => toast.success('Preferences saved')}>Save preferences</Button>
      </div>
    </div>
  )
}
