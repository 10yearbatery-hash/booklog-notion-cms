import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/lib/book-helpers'
import { highlightText } from '@/lib/highlight'
import type { Book } from '@/types/book'

const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

interface BookCardProps {
  book: Book
  priority?: boolean
  searchQuery?: string
}

export function BookCard({
  book,
  priority = false,
  searchQuery = '',
}: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`} className="block">
      <Card className="gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md">
        <div className="bg-muted relative aspect-[3/4] w-full">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`${book.title} 표지`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-5xl">📚</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={getStatusVariant(book.status)}>
              {getStatusLabel(book.status)}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-1 p-4">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
            {highlightText(book.title || '제목 없음', searchQuery)}
          </h3>
          <p className="text-muted-foreground text-xs">
            {highlightText(book.author || '저자 미상', searchQuery)}
          </p>

          {book.rating > 0 && (
            <div className="flex items-center gap-0.5 pt-0.5">
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
            <p className="text-muted-foreground line-clamp-2 pt-0.5 text-xs">
              {book.summary}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
