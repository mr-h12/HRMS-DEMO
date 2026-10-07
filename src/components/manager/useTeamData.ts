import { useMemo } from 'react'
import { DEMO_TODAY, getDailyAttendance } from '@/data/attendance'
import { MANAGER_ID } from '@/data/employees'
import { jobOpenings } from '@/data/recruitment'
import { useAppStore } from '@/store/AppStore'

/** Everything the manager views need, scoped to Mohamed Ali's direct reports. */
export function useTeamData() {
  const { employees, requests } = useAppStore()
  return useMemo(() => {
    const team = employees.filter((e) => e.managerId === MANAGER_ID)
    const ids = new Set(team.map((e) => e.id))
    const today = getDailyAttendance(DEMO_TODAY).filter((r) => ids.has(r.employeeId))
    const teamRequests = requests.filter((r) => r.managerId === MANAGER_ID)
    const pending = teamRequests.filter((r) => r.status === 'Pending')
    const upcomingLeave = teamRequests
      .filter((r) => r.type === 'Leave' && r.status !== 'Rejected' && r.endDate! >= DEMO_TODAY)
      .sort((a, b) => a.startDate!.localeCompare(b.startDate!))
    return {
      team,
      today,
      todayById: new Map(today.map((r) => [r.employeeId, r])),
      teamRequests,
      pending,
      upcomingLeave,
      present: today.filter((r) => r.status === 'Present' || r.status === 'Late').length,
      late: today.filter((r) => r.status === 'Late').length,
      onLeave: today.filter((r) => r.status === 'On Leave').length,
      absent: today.filter((r) => r.status === 'Absent').length,
      openPositions: jobOpenings.filter((j) => j.hiringManager === 'Mohamed Ali'),
    }
  }, [employees, requests])
}
