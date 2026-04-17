import { BookCheck, BookOpen, Bookmark, Star } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { BookStats } from '@/types/book'

interface StatsBannerProps {
  stats: BookStats
}

const RATING_LEVELS = [5, 4, 3, 2, 1] as const

export function StatsBanner({ stats }: StatsBannerProps) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const ratingValues = Object.values(stats.ratingDistribution)
  const totalRated = ratingValues.reduce((sum, n) => sum + n, 0)
  const maxCount = Math.max(...ratingValues, 1)

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

      <div className="mt-5 border-t pt-4">
        <p className="text-muted-foreground mb-2 text-xs">별점 분포</p>
        {totalRated === 0 ? (
          <p className="text-muted-foreground py-2 text-xs">
            별점이 등록된 책이 없습니다.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {RATING_LEVELS.map(level => {
              const count = stats.ratingDistribution[level]
              const percent = (count / maxCount) * 100
              return (
                <li key={level} className="flex items-center gap-2 text-xs">
                  <span
                    className="flex w-9 shrink-0 items-center gap-1 font-medium"
                    aria-hidden="true"
                  >
                    {level}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </span>
                  <Progress
                    value={percent}
                    className="h-1.5 flex-1"
                    aria-label={`별점 ${level}점 ${count}권`}
                  />
                  <span className="text-muted-foreground w-6 text-right tabular-nums">
                    {count}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
