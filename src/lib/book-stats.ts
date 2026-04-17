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

  const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }
  for (const book of ratedBooks) {
    const r = book.rating
    if (r === 1 || r === 2 || r === 3 || r === 4 || r === 5) {
      ratingDistribution[r]++
    }
  }

  return {
    total: books.length,
    completed,
    reading,
    planned,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
  }
}
