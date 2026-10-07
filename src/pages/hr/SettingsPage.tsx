import { Building2, CalendarDays, Clock, ShieldCheck, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/misc'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LEAVE_POLICIES } from '@/data/leaves'

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({ geo: true, overtime: true, selfService: true, twoFactor: true, sso: false, payslipEmail: true })
  const save = (section: string) => toast.success(`${section} settings saved`, { description: 'Changes apply to all employees immediately.' })
  const toggle = (k: string, label: string, hint: string) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <Label htmlFor={k}>{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={k} checked={toggles[k]} onCheckedChange={(v) => setToggles((t) => ({ ...t, [k]: v }))} />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Company configuration, policies and security." />
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">
            <Building2 className="size-4" /> Company
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Clock className="size-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="leave">
            <CalendarDays className="size-4" /> Leave policies
          </TabsTrigger>
          <TabsTrigger value="payroll">
            <Wallet className="size-4" /> Payroll
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="size-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Company profile</CardTitle>
                <CardDescription>Shown on payslips, letters and the careers page.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Legal name">
                <Input defaultValue="Northwind Group S.A.E." />
              </Field>
              <Field label="Commercial registration">
                <Input defaultValue="CR 184-552 Giza" />
              </Field>
              <Field label="Headquarters">
                <Input defaultValue="Tower B, Smart Village, Giza, Egypt" />
              </Field>
              <Field label="HR contact email">
                <Input defaultValue="people@northwind.co" />
              </Field>
              <Field label="Default currency">
                <Select defaultValue="USD">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                    <SelectItem value="EGP">EGP — Egyptian Pound</SelectItem>
                    <SelectItem value="AED">AED — UAE Dirham</SelectItem>
                    <SelectItem value="SAR">SAR — Saudi Riyal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Fiscal year start">
                <Select defaultValue="jan">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jan">January</SelectItem>
                    <SelectItem value="jul">July</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex justify-end sm:col-span-2">
                <Button onClick={() => save('Company')}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Working hours & attendance</CardTitle>
                <CardDescription>Default schedule for Cairo HQ, Dubai and Riyadh.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Work week">
                  <Input defaultValue="Sunday – Thursday" />
                </Field>
                <Field label="Shift start">
                  <Input type="time" defaultValue="09:00" />
                </Field>
                <Field label="Shift end">
                  <Input type="time" defaultValue="17:00" />
                </Field>
                <Field label="Late grace period (minutes)">
                  <Input type="number" defaultValue={15} />
                </Field>
                <Field label="Break duration (minutes)">
                  <Input type="number" defaultValue={60} />
                </Field>
                <Field label="Overtime multiplier">
                  <Input defaultValue="1.35×" />
                </Field>
              </div>
              <div className="mt-4 divide-y border-t">
                {toggle('geo', 'Geo-fenced clock-in', 'Employees can only clock in within 200 m of an office.')}
                {toggle('overtime', 'Require overtime pre-approval', 'Overtime is paid only when approved by the line manager.')}
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => save('Attendance')}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card className="overflow-hidden">
            <CardHeader>
              <div>
                <CardTitle>Leave policies</CardTitle>
                <CardDescription>Annual entitlements per leave type.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Policy editor opened', { description: 'New leave types require legal review.' })}>
                Add leave type
              </Button>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave type</TableHead>
                  <TableHead>Days / year</TableHead>
                  <TableHead className="hidden sm:table-cell">Carry over</TableHead>
                  <TableHead className="hidden md:table-cell">Rules</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEAVE_POLICIES.map((p) => (
                  <TableRow key={p.type}>
                    <TableCell className="font-medium">{p.type}</TableCell>
                    <TableCell className="tabular">{p.days}</TableCell>
                    <TableCell className="hidden tabular sm:table-cell">{p.carryOver ? `${p.carryOver} days` : '—'}</TableCell>
                    <TableCell className="hidden max-w-md text-wrap text-muted-foreground md:table-cell">{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Payroll configuration</CardTitle>
                <CardDescription>Monthly cycle and payment settings.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Pay day">
                  <Input defaultValue="28th of each month" />
                </Field>
                <Field label="Attendance cut-off">
                  <Input defaultValue="25th of each month" />
                </Field>
                <Field label="Payment bank">
                  <Input defaultValue="CIB — Corporate account" />
                </Field>
              </div>
              <div className="mt-4 divide-y border-t">{toggle('payslipEmail', 'Email payslips to employees', 'Password-protected PDF sent on pay day.')}</div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => save('Payroll')}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Security & access</CardTitle>
                <CardDescription>Authentication and self-service permissions.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="divide-y">
              {toggle('twoFactor', 'Require two-factor authentication', 'Applies to HR admins and managers.')}
              {toggle('sso', 'Single sign-on (Microsoft Entra ID)', 'Let employees sign in with their Microsoft 365 account.')}
              {toggle('selfService', 'Employee self-service profile edits', 'Changes are routed to HR for approval.')}
              <div className="flex justify-end pt-3">
                <Button onClick={() => save('Security')}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
