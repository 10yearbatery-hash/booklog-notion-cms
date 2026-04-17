'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BooksError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[BooksPage] 에러:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center py-8">
        <Container>
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="text-destructive h-12 w-12" />
            <div>
              <h2 className="text-xl font-semibold">
                독서 목록을 불러올 수 없어요
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Notion API 연결에 문제가 발생했습니다. 잠시 후 다시
                시도해주세요.
              </p>
            </div>
            <Button onClick={reset} variant="outline">
              다시 시도
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
