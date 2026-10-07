import { useLocation } from 'react-router-dom'
import { CURRENT_USERS, isRole } from '@/config/roles'
import type { Role } from '@/types'

/** The active demo role is derived from the first URL segment (/employee, /manager, /hr). */
export function useRole(): Role {
  const { pathname } = useLocation()
  const seg = pathname.split('/')[1]
  return isRole(seg) ? seg : 'employee'
}

export function useCurrentUser() {
  return CURRENT_USERS[useRole()]
}
