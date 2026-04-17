import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { StatsBanner } from '@/components/books/stats-banner'
import { BookList } from '@/components/books/book-list'
import { getBooks } from '@/lib/books'
import { calculateStats } from '@/lib/book-stats'

export const revalidate = 60

export const metadata: Metadata = {
  title: '독서 목록',
  description: 'Notion으로 관리하는 나의 독서 기록',
  openGraph: {
    title: '독서 목록 | 북로그',
    description: 'Notion으로 관리하는 나의 독서 기록',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '독서 목록 | 북로그',
    description: 'Notion으로 관리하는 나의 독서 기록',
  },
}

export default async function BooksPage() {
  const books = await getBooks()
  const stats = calculateStats(books)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">독서 목록</h1>
              <p className="text-muted-foreground mt-1">
                Notion DB에서 관리하는 나의 독서 기록
              </p>
            </div>
            <StatsBanner stats={stats} />
            <BookList books={books} />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
