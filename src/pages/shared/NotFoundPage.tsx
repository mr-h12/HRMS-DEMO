import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROLE_LABELS } from '@/config/roles'
import { useRole } from '@/hooks/useRole'

export default function NotFoundPage() {
  const role = useRole()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-8 ring-primary/5">
        <Compass className="size-6 text-primary" />
      </div>
      <p className="text-sm font-medium text-primary">404 · Page not available</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">This page isn’t part of the {ROLE_LABELS[role]} workspace</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">It may belong to a different role, or the link is outdated. Use the role switcher to explore other experiences.</p>
      <Button asChild className="mt-6">
        <Link to={`/${role}`}>Back to dashboard</Link>
      </Button>
    </div>
  )
}
