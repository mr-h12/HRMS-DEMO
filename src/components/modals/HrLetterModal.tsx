import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EMPLOYEE_ID } from '@/data/employees'
import { HR_LETTER_TYPES } from '@/data/leaves'
import { useAppStore } from '@/store/AppStore'
import { newRequestBase } from '@/utils/requests'

export function HrLetterModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addRequest, pushNotification } = useAppStore()
  const [letterType, setLetterType] = useState(HR_LETTER_TYPES[0])
  const [addressedTo, setAddressedTo] = useState('')
  const [language, setLanguage] = useState('English')
  const [purpose, setPurpose] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = () => {
    if (purpose.trim().length < 5) return setError('Please describe the purpose of the letter')
    setSubmitting(true)
    setTimeout(() => {
      addRequest({ ...newRequestBase(EMPLOYEE_ID), type: 'HR Letter', letterType, reason: `${purpose.trim()}${addressedTo ? ` (Addressed to: ${addressedTo})` : ''} — ${language}` })
      pushNotification({ role: 'hr', kind: 'request', title: 'HR letter requested', message: `Ahmed requested a ${letterType}.`, link: '/hr/documents' })
      pushNotification({ role: 'manager', kind: 'request', title: 'HR letter request', message: `Ahmed requested a ${letterType}.`, link: '/manager/approvals' })
      toast.success('HR letter requested', { description: `${letterType} · typically issued within 2 business days` })
      setSubmitting(false)
      setPurpose('')
      setAddressedTo('')
      setError('')
      onOpenChange(false)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request HR letter</DialogTitle>
          <DialogDescription>Official letters are signed digitally by the HR department.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field label="Letter type" required>
            <Select value={letterType} onValueChange={setLetterType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HR_LETTER_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Addressed to" htmlFor="letter-to" hint="Optional">
              <Input id="letter-to" value={addressedTo} onChange={(e) => setAddressedTo(e.target.value)} placeholder="e.g. Embassy of Germany" />
            </Field>
            <Field label="Language">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="English & Arabic">English & Arabic</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Purpose" htmlFor="letter-purpose" error={error} required>
            <Textarea id="letter-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Bank account opening at QNB" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />} Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
