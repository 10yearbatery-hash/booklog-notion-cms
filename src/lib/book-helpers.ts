import type { BookStatus } from '@/types/book'

export function getStatusLabel(status: BookStatus): string {
  const map: Record<BookStatus, string> = {
    reading: '읽는중',
    completed: '완독',
    planned: '읽을예정',
  }
  return map[status]
}

export function getStatusVariant(
  status: BookStatus
): 'default' | 'secondary' | 'outline' {
  const map: Record<BookStatus, 'default' | 'secondary' | 'outline'> = {
    reading: 'default',
    completed: 'secondary',
    planned: 'outline',
  }
  return map[status]
}

export function renderRating(rating: number): string {
  if (rating <= 0) return '미평가'
  return '⭐'.repeat(rating)
}
