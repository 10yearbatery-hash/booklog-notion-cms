import type { Book, BookStats } from '@/types/book'

export function calculateStats(books: Book[]): BookStats {
  const completed = books.filter(b => b.status === 'completed').length
  const reading = books.filter(b => b.status === 'reading').length
  const planned = books.filter(b => b.status === 'planned').length

  const ratedBooks = books.filter(b => b.rating > 0)
  const averageRating =
    ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length
      : 0

  return {
    total: books.length,
    completed,
    reading,
    planned,
    averageRating: Math.round(averageRating * 10) / 10,
  }
}
