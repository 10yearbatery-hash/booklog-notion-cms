'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { Book, BookStatus } from '@/types/book'

interface FilterTabsProps {
  books: Book[]
}

const TABS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'reading', label: '읽는중' },
  { value: 'completed', label: '완독' },
  { value: 'planned', label: '읽을예정' },
]

export function FilterTabs({ books }: FilterTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') ?? 'all'

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  function getCount(value: string): number {
    if (value === 'all') return books.length
    return books.filter(b => b.status === (value as BookStatus)).length
  }

  return (
    <Tabs value={currentStatus} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        {TABS.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-1.5"
          >
            <span>{tab.label}</span>
            <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
              {getCount(tab.value)}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
