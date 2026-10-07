import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/misc'
import { ahmedLeaveBalances } from '@/data/leaves'

export function LeaveBalanceCard({ onRequest }: { onRequest?: () => void }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Leave balance</CardTitle>
          <CardDescription>2026 entitlement · days remaining</CardDescription>
        </div>
        <Button variant="ghost" size="xs" asChild>
          <Link to="/employee/leave">
            Details <ArrowRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {ahmedLeaveBalances.map((b) => {
          const remaining = b.total - b.used
          return (
            <div key={b.type}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[13px] font-medium">{b.type}</span>
                <span className="text-sm tabular">
                  <span className="font-semibold">{remaining}</span>
                  <span className="text-muted-foreground"> / {b.total}</span>
                </span>
              </div>
              <Progress value={(remaining / b.total) * 100} indicatorClassName={b.color} />
              <div className="mt-1 text-[11px] text-muted-foreground">{b.used} used</div>
            </div>
          )
        })}
        {onRequest && (
          <Button variant="soft" className="w-full" onClick={onRequest}>
            Request leave
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
