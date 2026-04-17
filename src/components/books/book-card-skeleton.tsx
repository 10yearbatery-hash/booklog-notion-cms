import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BookCardSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>
    </Card>
  )
}
