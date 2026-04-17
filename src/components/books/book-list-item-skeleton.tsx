import { Skeleton } from '@/components/ui/skeleton'

export function BookListItemSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border p-3">
      <Skeleton className="aspect-[3/4] w-[72px] shrink-0 rounded" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-14 shrink-0" />
        </div>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  )
}
