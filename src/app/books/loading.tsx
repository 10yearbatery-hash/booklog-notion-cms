import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { BookCardSkeleton } from '@/components/books/book-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function BooksLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-72" />
            </div>

            {/* 통계 배너 스켈레톤 */}
            <Skeleton className="h-36 w-full rounded-xl" />

            {/* 탭 스켈레톤 */}
            <Skeleton className="h-10 w-full" />

            {/* 카드 그리드 스켈레톤 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
