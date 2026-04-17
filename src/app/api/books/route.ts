import { NextRequest, NextResponse } from 'next/server'
import { notion, DATABASE_ID } from '@/lib/notion'
import { mapNotionPageToBook } from '@/lib/books'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints/common'

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor') ?? undefined

  try {
    const response = await notion.dataSources.query({
      data_source_id: DATABASE_ID,
      page_size: PAGE_SIZE,
      start_cursor: cursor,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    })

    const books = (response.results as PageObjectResponse[]).map(
      mapNotionPageToBook
    )

    return NextResponse.json({
      books,
      nextCursor: response.has_more ? response.next_cursor : null,
    })
  } catch (error) {
    console.error('[GET /api/books] Notion API 오류:', error)
    return NextResponse.json({ books: [], nextCursor: null }, { status: 500 })
  }
}
