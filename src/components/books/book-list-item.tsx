import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/lib/book-helpers'
import { highlightText } from '@/lib/highlight'
import type { Book } from '@/types/book'

const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

interface BookListItemProps {
  book: Book
  priority?: boolean
  searchQuery?: string
}

export function BookListItem({
  book,
  priority = false,
  searchQuery = '',
}: BookListItemProps) {
  return (
    <Link href={`/books/${book.id}`} className="block">
      <div className="hover:border-foreground/20 flex gap-4 rounded-lg border p-3 transition-colors hover:shadow-sm">
        <div className="bg-muted relative aspect-[3/4] w-[72px] shrink-0 overflow-hidden rounded">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`${book.title} 표지`}
              fill
              className="object-cover"
              sizes="72px"
              priority={priority}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm leading-snug font-semibold">
              {highlightText(book.title || '제목 없음', searchQuery)}
            </h3>
            <Badge variant={getStatusVariant(book.status)} className="shrink-0">
              {getStatusLabel(book.status)}
            </Badge>
          </div>

          <p className="text-muted-foreground line-clamp-1 text-xs">
            {highlightText(book.author || '저자 미상', searchQuery)}
          </p>

          {book.rating > 0 && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={`h-3 w-3 ${
                    i < book.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-muted text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          )}

          {book.summary && (
            <p className="text-muted-foreground line-clamp-1 text-xs">
              {book.summary}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
