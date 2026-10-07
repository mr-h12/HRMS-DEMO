import { Bell, ChevronDown, LogOut, Settings2, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserAvatar } from '@/components/common/UserAvatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCurrentUser, useRole } from '@/hooks/useRole'

export function ProfileMenu() {
  const user = useCurrentUser()
  const role = useRole()
  const navigate = useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="flex items-center gap-2.5 rounded-lg p-1 transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none lg:pr-2" aria-label="Open profile menu">
          <UserAvatar name={user.name} size="sm" />
          <div className="hidden text-left leading-tight lg:block">
            <div className="text-[13px] font-semibold">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.title}</div>
          </div>
          <ChevronDown className="hidden size-3.5 text-muted-foreground lg:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center gap-3 px-2.5 py-2">
          <UserAvatar name={user.name} size="md" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate(`/${role}/profile`)}>
          <User /> My Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(`/${role}/preferences`)}>
          <Settings2 /> Preferences
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(`/${role}/notifications`)}>
          <Bell /> Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => navigate('/signed-out')}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
