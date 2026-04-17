'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookCard } from './book-card'
import { FilterTabs } from './filter-tabs'
import type { Book, BookStatus } from '@/types/book'

type SortKey = 'latest' | 'rating-high' | 'rating-low' | 'title-asc'

const PAGE_SIZE = 12

interface BookListProps {
  books: Book[]
}

export function BookList({ books }: BookListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get('status') as BookStatus | null
  const q = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') ?? 'latest') as SortKey

  const [searchInput, setSearchInput] = useState(q)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtered = books
    .filter(b => !status || b.status === status)
    .filter(b => {
      if (!q) return true
      const lower = q.toLowerCase()
      return (
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower)
      )
    })
    .sort((a, b) => {
      if (sort === 'rating-high') return b.rating - a.rating
      if (sort === 'rating-low') return a.rating - b.rating
      if (sort === 'title-asc') return a.title.localeCompare(b.title, 'ko')
      return 0
    })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [status, q, sort])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(prev => prev + PAGE_SIZE)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, visibleCount])

  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    }, 300)
  }

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'latest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            placeholder="제목 또는 저자 검색..."
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-9"
            aria-label="책 검색"
          />
        </div>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-36" aria-label="정렬 기준 선택">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최근 추가순</SelectItem>
            <SelectItem value="rating-high">별점 높은순</SelectItem>
            <SelectItem value="rating-low">별점 낮은순</SelectItem>
            <SelectItem value="title-asc">가나다순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FilterTabs books={books} />

      {filtered.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center">
          <p className="text-lg">검색 결과가 없습니다.</p>
          <p className="mt-1 text-sm">다른 검색어나 필터를 시도해보세요.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((book, idx) => (
              <BookCard key={book.id} book={book} priority={idx < 3} />
            ))}
          </div>

          <div ref={sentinelRef} className="flex justify-center py-6">
            {hasMore && (
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            )}
          </div>
        </>
      )}
    </div>
  )
}
