import { BookCheck, BookOpen, Bookmark, Star } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { BookStats } from '@/types/book'

interface StatsBannerProps {
  stats: BookStats
}

export function StatsBanner({ stats }: StatsBannerProps) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <BookCheck className="h-6 w-6 text-green-500" />
          <span className="text-2xl font-bold">{stats.completed}</span>
          <span className="text-muted-foreground text-xs">완독</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <BookOpen className="h-6 w-6 text-blue-500" />
          <span className="text-2xl font-bold">{stats.reading}</span>
          <span className="text-muted-foreground text-xs">읽는중</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Bookmark className="h-6 w-6 text-orange-400" />
          <span className="text-2xl font-bold">{stats.planned}</span>
          <span className="text-muted-foreground text-xs">읽을예정</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-bold">{stats.averageRating}</span>
          <span className="text-muted-foreground text-xs">평균 별점</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-muted-foreground mb-1.5 flex justify-between text-xs">
          <span>완독률</span>
          <span>{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-2" />
      </div>
    </div>
  )
}
