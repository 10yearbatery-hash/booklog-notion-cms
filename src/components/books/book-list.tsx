'use client'

import { useSearchParams } from 'next/navigation'
import { BookCard } from './book-card'
import { FilterTabs } from './filter-tabs'
import type { Book, BookStatus } from '@/types/book'

interface BookListProps {
  books: Book[]
}

export function BookList({ books }: BookListProps) {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') as BookStatus | null

  const filtered = status ? books.filter(b => b.status === status) : books

  return (
    <div className="space-y-6">
      <FilterTabs books={books} />

      {filtered.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center">
          <p className="text-lg">해당 상태의 책이 없습니다.</p>
          <p className="mt-1 text-sm">Notion DB에 책을 추가해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
