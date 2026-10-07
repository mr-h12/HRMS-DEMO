import { Briefcase, Building2, CalendarDays, Download, Eye, Hash, Mail, MapPin, Pencil, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { DocumentPreviewModal, downloadDocument } from '@/components/modals/DocumentPreviewModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ahmedProfile, employeeById } from '@/data/employees'
import { FileIcon } from '@/pages/employee/DocumentsPage'
import { useCurrentUser, useRole } from '@/hooks/useRole'
import { useAppStore } from '@/store/AppStore'
import type { EmployeeDocument } from '@/types'
import { formatDate } from '@/utils/format'

function InfoGrid({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs font-medium text-muted-foreground">{k}</dt>
          <dd className="mt-1 text-sm font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function ProfilePage() {
  const user = useCurrentUser()
  const role = useRole()
  const navigate = useNavigate()
  const { myDocuments } = useAppStore()
  const [previewing, setPreviewing] = useState<EmployeeDocument | null>(null)
  const emp = employeeById(user.employeeId)!
  const isAhmed = role === 'employee'
  const first = emp.name.split(' ')[0].toLowerCase()
  const profile = isAhmed
    ? ahmedProfile
    : {
        ...ahmedProfile,
        address: role === 'manager' ? '7 Mostafa El-Nahas St, Nasr City, Cairo' : '22 Road 9, Maadi, Cairo',
        maritalStatus: role === 'manager' ? 'Married' : 'Single',
        nationalId: role === 'manager' ? '28612030104411' : '28705210109872',
        bloodType: role === 'manager' ? 'A+' : 'B+',
        workEmail: user.email,
        personalEmail: `${first}.${emp.name.split(' ')[1].toLowerCase()}@gmail.com`,
        grade: role === 'manager' ? 'M2 — Manager' : 'M2 — Manager',
        costCenter: role === 'manager' ? 'TECH-ENG-200' : 'HR-OPS-100',
        probationEnd: '—',
        emergencyContacts: [{ name: role === 'manager' ? 'Heba Ali' : 'Samia Hassan', relation: role === 'manager' ? 'Spouse' : 'Mother', phone: '+20 100 220 9812', email: '—' }],
        skills: role === 'manager' ? ['Engineering Leadership', 'Hiring', 'System Design', 'Agile Delivery', 'Java', 'Stakeholder Management'] : ['Talent Management', 'Labor Law (Egypt & UAE)', 'Compensation', 'HR Analytics', 'Employee Relations'],
      }

  const docs = isAhmed ? myDocuments.slice(0, 6) : myDocuments.filter((d) => d.category === 'Policy')
  const requestChange = () => toast.success('Change request submitted', { description: 'HR will review and update your profile within 2 business days.' })

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 sm:h-32" />
        <div className="px-5 pb-5 sm:px-8">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
              <UserAvatar name={emp.name} size="xl" className="size-20 text-2xl ring-4 ring-card sm:size-24 sm:text-3xl" />
              <div className="sm:mt-14">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{emp.name}</h1>
                  <StatusBadge status={emp.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {emp.position} · {emp.department}
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:mt-14">
              <Button variant="outline" onClick={() => navigate(`/${role}/preferences`)}>
                Preferences
              </Button>
              <Button onClick={requestChange}>
                <Pencil /> Request change
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 border-t pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Hash, label: 'Employee ID', value: emp.id },
              { icon: Mail, label: 'Email', value: emp.email },
              { icon: Phone, label: 'Phone', value: emp.phone },
              { icon: MapPin, label: 'Location', value: emp.location },
            ].map((i) => (
              <div key={i.label} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <i.icon className="size-4 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{i.label}</div>
                  <div className="truncate font-medium">{i.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">
            <UserRound className="size-4" /> Personal
          </TabsTrigger>
          <TabsTrigger value="employment">
            <Briefcase className="size-4" /> Employment
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <ShieldCheck className="size-4" /> Emergency contact
          </TabsTrigger>
          <TabsTrigger value="documents">
            <Building2 className="size-4" /> Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Personal information</CardTitle>
                <CardDescription>Visible to you and HR only</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <InfoGrid
                items={[
                  ['Full name', emp.name],
                  ['Date of birth', formatDate(emp.dateOfBirth, { month: 'long', day: 'numeric', year: 'numeric' })],
                  ['Gender', emp.gender],
                  ['Nationality', emp.nationality],
                  ['Marital status', profile.maritalStatus],
                  ['Blood type', profile.bloodType],
                  ['National ID', `${profile.nationalId.slice(0, 4)} •••• •••• ${profile.nationalId.slice(-2)}`],
                  ['Personal email', profile.personalEmail],
                  ['Home address', profile.address],
                ]}
              />
              <div className="mt-6 border-t pt-5">
                <div className="mb-2 text-xs font-medium text-muted-foreground">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="px-2.5 py-1">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Employment information</CardTitle>
                <CardDescription>Managed by Human Resources</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <InfoGrid
                items={[
                  ['Job title', emp.position],
                  ['Department', emp.department],
                  ['Team', emp.team],
                  ['Reporting manager', emp.managerName],
                  ['Joining date', <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-muted-foreground" />{formatDate(emp.joiningDate, { month: 'long', day: 'numeric', year: 'numeric' })}</span>],
                  ['Employment type', emp.employmentType],
                  ['Contract', profile.contractType],
                  ['Grade', profile.grade],
                  ['Work schedule', profile.workSchedule],
                  ['Work location', emp.location],
                  ['Cost center', profile.costCenter],
                  ['Probation ended', profile.probationEnd === '—' ? '—' : formatDate(profile.probationEnd)],
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <div className="grid gap-4 md:grid-cols-2">
            {profile.emergencyContacts.map((c, i) => (
              <Card key={c.name} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={c.name} />
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.relation}</div>
                    </div>
                  </div>
                  {i === 0 && <Badge>Primary</Badge>}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" /> {c.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" /> {c.email}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={requestChange}>
                  <Pencil /> Edit contact
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>{isAhmed ? 'Your most recent documents' : 'Company policies assigned to you'}</CardDescription>
              </div>
              {isAhmed && (
                <Button variant="outline" size="sm" onClick={() => navigate('/employee/documents')}>
                  View all
                </Button>
              )}
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <FileIcon type={d.fileType} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.category} · {d.size}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => setPreviewing(d)} aria-label={`View ${d.name}`}>
                    <Eye />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => downloadDocument(d, `${emp.name} (${emp.id})`)} aria-label={`Download ${d.name}`}>
                    <Download />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DocumentPreviewModal doc={previewing} onOpenChange={(o) => !o && setPreviewing(null)} />
    </div>
  )
}
