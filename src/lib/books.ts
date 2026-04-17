import 'server-only'

import { unstable_cache } from 'next/cache'
import { notion, DATABASE_ID } from '@/lib/notion'
import type { Book, BookStatus } from '@/types/book'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints/common'

function extractText(property: unknown): string {
  const prop = property as Record<string, unknown>
  if (!prop) return ''
  if (prop.type === 'title') {
    return (prop.title as Array<{ plain_text: string }>)
      .map(t => t.plain_text)
      .join('')
  }
  if (prop.type === 'rich_text') {
    return (prop.rich_text as Array<{ plain_text: string }>)
      .map(t => t.plain_text)
      .join('')
  }
  return ''
}

function extractRating(property: unknown): number {
  const prop = property as Record<string, unknown>
  if (!prop) return 0
  const select = prop.select as Record<string, string> | null
  if (!select?.name) return 0
  const match = select.name.match(/\d/)
  return match ? parseInt(match[0]) : 0
}

function extractStatus(property: unknown): BookStatus {
  const prop = property as Record<string, unknown>
  const select = prop?.select as Record<string, string> | null
  const name = select?.name ?? ''
  const map: Record<string, BookStatus> = {
    '읽는 중': 'reading',
    완독: 'completed',
    '읽을 예정': 'planned',
  }
  return map[name] ?? 'planned'
}

function extractCoverUrl(property: unknown): string | null {
  const prop = property as Record<string, unknown>
  const files = (prop?.files as Array<Record<string, unknown>>) ?? []
  if (files.length === 0) return null
  const file = files[0]
  if (file.type === 'external') {
    return (file.external as Record<string, string>).url
  }
  if (file.type === 'file') {
    return (file.file as Record<string, string>).url
  }
  return null
}

export function mapNotionPageToBook(page: PageObjectResponse): Book {
  const props = page.properties
  return {
    id: page.id,
    title: extractText(props['이름']),
    author: extractText(props['저자']),
    rating: extractRating(props['별점']),
    status: extractStatus(props['상태']),
    summary: extractText(props['한줄요약']),
    coverUrl: extractCoverUrl(props['커버']),
  }
}

export const getBooks = unstable_cache(
  async (): Promise<Book[]> => {
    try {
      const response = await notion.dataSources.query({
        data_source_id: DATABASE_ID,
        sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      })
      return (response.results as PageObjectResponse[]).map(mapNotionPageToBook)
    } catch (error) {
      console.error('[getBooks] Notion API 오류:', error)
      return []
    }
  },
  ['books-list'],
  { revalidate: 60, tags: ['books'] }
)

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    return mapNotionPageToBook(page as PageObjectResponse)
  } catch (error) {
    console.error('[getBookById] Notion API 오류:', error)
    return null
  }
}
