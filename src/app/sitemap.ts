import type { MetadataRoute } from 'next'
import { getBooks } from '@/lib/books'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getBooks()

  const bookEntries: MetadataRoute.Sitemap = books.map(book => ({
    url: `${BASE_URL}/books/${book.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...bookEntries,
  ]
}
