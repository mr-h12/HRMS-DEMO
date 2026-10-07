import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { employees as seedEmployees, EMPLOYEE_ID, MANAGER_ID } from '@/data/employees'
import { initialRequests } from '@/data/leaves'
import { initialNotifications } from '@/data/notifications'
import { initialCandidates } from '@/data/recruitment'
import { ahmedDocuments } from '@/data/company'
import type { AppNotification, Candidate, CandidateStage, Employee, EmployeeDocument, HRRequest, RequestStatus, Role } from '@/types'

export type PayrollRunStatus = 'Draft' | 'Generated' | 'Approved'

interface ClockState {
  clockedIn: boolean
  clockInTime: string
  clockOutTime: string | null
}

interface AppStore {
  employees: Employee[]
  addEmployee: (employee: Employee) => void

  requests: HRRequest[]
  addRequest: (request: HRRequest) => void
  decideRequest: (id: string, status: Exclude<RequestStatus, 'Pending'>, decidedBy: string) => void

  notifications: AppNotification[]
  pushNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (role: Role) => void

  candidates: Candidate[]
  moveCandidate: (id: string, stage: CandidateStage) => void

  clock: ClockState
  toggleClock: () => ClockState

  payrollStatus: PayrollRunStatus
  setPayrollStatus: (s: PayrollRunStatus) => void

  myDocuments: EmployeeDocument[]
  addDocument: (doc: EmployeeDocument) => void

  /** Global employee detail drawer. */
  drawerEmployeeId: string | null
  openEmployee: (id: string | null) => void

  counts: { pendingApprovals: number; pendingLeave: number; myPending: number }
}

const StoreContext = createContext<AppStore | null>(null)

const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees)
  const [requests, setRequests] = useState<HRRequest[]>(initialRequests)
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications)
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [clock, setClock] = useState<ClockState>({ clockedIn: true, clockInTime: '08:57 AM', clockOutTime: null })
  const [payrollStatus, setPayrollStatus] = useState<PayrollRunStatus>('Draft')
  const [myDocuments, setMyDocuments] = useState<EmployeeDocument[]>(ahmedDocuments)
  const [drawerEmployeeId, setDrawerEmployeeId] = useState<string | null>(null)

  const addEmployee = useCallback((e: Employee) => setEmployees((prev) => [e, ...prev]), [])

  const pushNotification = useCallback((n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => [{ ...n, id: `N-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString(), read: false }, ...prev])
  }, [])

  const addRequest = useCallback((r: HRRequest) => setRequests((prev) => [r, ...prev]), [])

  const decideRequest = useCallback((id: string, status: Exclude<RequestStatus, 'Pending'>, decidedBy: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, decidedBy, decidedAt: new Date().toISOString() } : r)))
  }, [])

  const markNotificationRead = useCallback((id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))), [])
  const markAllNotificationsRead = useCallback((role: Role) => setNotifications((prev) => prev.map((n) => (n.role === role ? { ...n, read: true } : n))), [])

  const moveCandidate = useCallback((id: string, stage: CandidateStage) => setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c))), [])

  const toggleClock = useCallback(() => {
    const next: ClockState = clock.clockedIn
      ? { ...clock, clockedIn: false, clockOutTime: nowTime() }
      : { clockedIn: true, clockInTime: nowTime(), clockOutTime: null }
    setClock(next)
    return next
  }, [clock])

  const addDocument = useCallback((d: EmployeeDocument) => setMyDocuments((prev) => [d, ...prev]), [])

  const counts = useMemo(
    () => ({
      pendingApprovals: requests.filter((r) => r.managerId === MANAGER_ID && r.status === 'Pending').length,
      pendingLeave: requests.filter((r) => r.type === 'Leave' && r.status === 'Pending').length,
      myPending: requests.filter((r) => r.employeeId === EMPLOYEE_ID && r.status === 'Pending').length,
    }),
    [requests],
  )

  const value = useMemo<AppStore>(
    () => ({
      employees, addEmployee, requests, addRequest, decideRequest, notifications, pushNotification, markNotificationRead,
      markAllNotificationsRead, candidates, moveCandidate, clock, toggleClock, payrollStatus, setPayrollStatus, myDocuments,
      addDocument, drawerEmployeeId, openEmployee: setDrawerEmployeeId, counts,
    }),
    [employees, addEmployee, requests, addRequest, decideRequest, notifications, pushNotification, markNotificationRead, markAllNotificationsRead, candidates, moveCandidate, clock, toggleClock, payrollStatus, myDocuments, addDocument, drawerEmployeeId, counts],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useAppStore must be used inside AppStoreProvider')
  return ctx
}
