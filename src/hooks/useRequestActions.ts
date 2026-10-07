import { useCallback } from 'react'
import { toast } from 'sonner'
import { EMPLOYEE_ID } from '@/data/employees'
import { useAppStore } from '@/store/AppStore'
import type { HRRequest } from '@/types'
import { useCurrentUser } from './useRole'
import { requestTitle } from '@/utils/requests'

/** Approve / reject with consistent toasts and cross-role notifications. */
export function useRequestActions() {
  const { decideRequest, pushNotification } = useAppStore()
  const user = useCurrentUser()

  return useCallback(
    (r: HRRequest, status: 'Approved' | 'Rejected') => {
      decideRequest(r.id, status, user.name)
      const what = requestTitle(r)
      const first = r.employeeName.split(' ')[0]
      if (status === 'Approved') toast.success(`${what} approved`, { description: `${r.employeeName} will be notified.` })
      else toast.error(`${what} rejected`, { description: `${r.employeeName} will be notified.` })
      if (r.employeeId === EMPLOYEE_ID) {
        pushNotification({
          role: 'employee',
          kind: 'approval',
          title: `Request ${status.toLowerCase()}`,
          message: `${user.name} ${status.toLowerCase()} your ${what.toLowerCase()} request (${r.id}).`,
          link: '/employee/requests',
        })
      }
      if (user.role === 'manager' && r.type === 'Leave') {
        pushNotification({ role: 'hr', kind: 'approval', title: `Leave ${status.toLowerCase()}`, message: `${user.name} ${status.toLowerCase()} ${first}'s ${what.toLowerCase()}.`, link: '/hr/leave' })
      }
    },
    [decideRequest, pushNotification, user],
  )
}
