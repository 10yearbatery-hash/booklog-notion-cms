export const revalidate = 60

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star } from 'lucide-react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { getBookById } from '@/lib/books'
import { getStatusLabel, getStatusVariant } from '@/lib/book-helpers'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const book = await getBookById(id)
  if (!book) return { title: '책을 찾을 수 없습니다' }
  return {
    title: book.title,
    description: book.summary || `${book.author}의 책`,
    openGraph: {
      title: book.title,
      description: book.summary || `${book.author}의 책`,
      type: 'article',
      ...(book.coverUrl && { images: [{ url: book.coverUrl }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.summary || `${book.author}의 책`,
      ...(book.coverUrl && { images: [book.coverUrl] }),
    },
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params
  const book = await getBookById(id)
  if (!book) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <Link
            href="/books"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            북로그로 돌아가기
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
            <div className="bg-muted relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={`${book.title} 표지`}
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-7xl">📚</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Badge variant={getStatusVariant(book.status)}>
                {getStatusLabel(book.status)}
              </Badge>

              <h1 className="text-3xl leading-tight font-bold">{book.title}</h1>
              <p className="text-muted-foreground text-lg">
                {book.author || '저자 미상'}
              </p>

              {book.rating > 0 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < book.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="text-muted-foreground ml-2 text-sm">
                    {book.rating} / 5
                  </span>
                </div>
              )}

              {book.summary && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm leading-relaxed">{book.summary}</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
