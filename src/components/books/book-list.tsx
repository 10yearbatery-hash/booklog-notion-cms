'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { LayoutGrid, List, Loader2, Search, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookCard } from './book-card'
import { BookCardSkeleton } from './book-card-skeleton'
import { BookListItem } from './book-list-item'
import { BookListItemSkeleton } from './book-list-item-skeleton'
import { FilterTabs } from './filter-tabs'
import type { Book, BookStatus } from '@/types/book'

type SortKey = 'latest' | 'rating-high' | 'rating-low' | 'title-asc'
type ViewMode = 'grid' | 'list'

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
  const viewParam = searchParams.get('view')
  const view: ViewMode = viewParam === 'list' ? 'list' : 'grid'

  const [searchInput, setSearchInput] = useState(q)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isPicking, setIsPicking] = useState(false)
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
  }, [status, q, sort, view])

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

  function buildHref(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString())
    mutate(params)
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      router.push(
        buildHref(params => {
          if (value) {
            params.set('q', value)
          } else {
            params.delete('q')
          }
        })
      )
    }, 300)
  }

  function handleSortChange(value: string) {
    router.push(
      buildHref(params => {
        if (value === 'latest') {
          params.delete('sort')
        } else {
          params.set('sort', value)
        }
      })
    )
  }

  function handleViewChange(next: ViewMode) {
    if (next === view) return
    router.push(
      buildHref(params => {
        if (next === 'grid') {
          params.delete('view')
        } else {
          params.set('view', next)
        }
      })
    )
  }

  function handleRandomPick() {
    if (filtered.length === 0 || isPicking) return
    setIsPicking(true)
    const pick = filtered[Math.floor(Math.random() * filtered.length)]
    router.push(`/books/${pick.id}`)
    setTimeout(() => setIsPicking(false), 500)
  }

  const isEmpty = filtered.length === 0
  const skeletonCount = view === 'grid' ? 9 : 6

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative min-w-[200px] flex-1">
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
        <div
          className="bg-muted flex items-center rounded-md p-0.5"
          role="group"
          aria-label="뷰 모드 선택"
        >
          <Button
            type="button"
            size="sm"
            variant={view === 'grid' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            aria-label="그리드 뷰"
            aria-pressed={view === 'grid'}
            onClick={() => handleViewChange('grid')}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === 'list' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            aria-label="리스트 뷰"
            aria-pressed={view === 'list'}
            onClick={() => handleViewChange('list')}
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handleRandomPick}
          disabled={isEmpty || isPicking}
          aria-label="랜덤 추천"
        >
          {isPicking ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Shuffle className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">랜덤 추천</span>
        </Button>
      </div>

      <FilterTabs books={books} />

      {isEmpty ? (
        <div className="text-muted-foreground py-20 text-center">
          <p className="text-lg">검색 결과가 없습니다.</p>
          <p className="mt-1 text-sm">다른 검색어나 필터를 시도해보세요.</p>
        </div>
      ) : isPicking ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <BookListItemSkeleton key={i} />
            ))}
          </div>
        )
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((book, idx) => (
                <BookCard
                  key={book.id}
                  book={book}
                  priority={idx < 3}
                  searchQuery={q}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visible.map((book, idx) => (
                <BookListItem
                  key={book.id}
                  book={book}
                  priority={idx < 3}
                  searchQuery={q}
                />
              ))}
            </div>
          )}

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
