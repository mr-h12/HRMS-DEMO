import { Briefcase, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/navbar/Navbar'
import { Card } from '@/components/ui/card'
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/config/roles'
import type { Role } from '@/types'

const ICONS = { employee: UserRound, manager: Briefcase, hr: ShieldCheck }

export default function SignedOutPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-indigo-50 via-background to-violet-50 px-4 py-10 dark:from-indigo-950/30 dark:to-violet-950/20">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-[15px] font-bold tracking-tight">
            HRMS <span className="text-primary">DEMO</span>
          </span>
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">You’ve been signed out</h1>
        <p className="mt-1 text-sm text-muted-foreground">This is a demo environment — pick a role to jump back in. No credentials required.</p>
        <div className="mt-6 space-y-2">
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => {
            const Icon = ICONS[r]
            return (
              <Link key={r} to={`/${r}`} className="flex items-center gap-3 rounded-xl border p-3.5 transition hover:border-primary/40 hover:bg-primary/5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Continue as {ROLE_LABELS[r]}</div>
                  <div className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
