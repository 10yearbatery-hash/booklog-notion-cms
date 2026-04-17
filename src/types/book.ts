export type BookStatus = 'reading' | 'completed' | 'planned'

export interface Book {
  id: string
  title: string
  author: string
  rating: number
  status: BookStatus
  summary: string
  coverUrl: string | null
}

export interface BookStats {
  total: number
  completed: number
  reading: number
  planned: number
  averageRating: number
}
