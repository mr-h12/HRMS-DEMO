import { Briefcase, ChevronDown, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/config/roles'
import { useRole } from '@/hooks/useRole'
import type { Role } from '@/types'

const ICONS = { employee: UserRound, manager: Briefcase, hr: ShieldCheck }

export function RoleSwitcher() {
  const role = useRole()
  const navigate = useNavigate()

  const change = (next: string) => {
    if (next === role) return
    const r = next as Role
    try {
      localStorage.setItem('hrms-role', r)
    } catch {
      /* ignore */
    }
    navigate(`/${r}`)
    toast.success(`Now viewing as ${ROLE_LABELS[r]}`, { description: ROLE_DESCRIPTIONS[r] })
  }

  const Icon = ICONS[role]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 min-w-0 shrink-0 items-center whitespace-nowrap gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2 text-[13px] transition sm:gap-2 sm:px-2.5 sm:text-sm hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          aria-label={`Viewing as ${ROLE_LABELS[role]}. Change demo role`}
        >
          <Icon className="hidden size-4 text-primary min-[400px]:block" />
          <span className="hidden text-muted-foreground lg:inline">Viewing as:</span>
          <span className="max-w-[92px] truncate font-semibold text-primary sm:max-w-none">{ROLE_LABELS[role]}</span>
          <ChevronDown className="size-3.5 text-primary/70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={role} onValueChange={change}>
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => {
            const RIcon = ICONS[r]
            return (
              <DropdownMenuRadioItem key={r} value={r} className="items-start py-2.5">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <RIcon className="size-4 text-foreground" />
                </div>
                <div>
                  <div className="font-medium">{ROLE_LABELS[r]}</div>
                  <div className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</div>
                </div>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
        <div className="mx-1 mt-1.5 rounded-lg bg-muted/60 px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
          Demo mode — no authentication. Switching roles changes navigation, data, permissions and notifications.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
