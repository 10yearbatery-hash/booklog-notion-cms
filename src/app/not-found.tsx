import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center py-16">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <BookOpen className="text-muted-foreground h-16 w-16" />
            <div>
              <h1 className="text-4xl font-bold">404</h1>
              <h2 className="mt-2 text-xl font-semibold">
                페이지를 찾을 수 없어요
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                요청하신 페이지가 존재하지 않거나 이동되었습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/">홈으로</Link>
              </Button>
              <Button asChild>
                <Link href="/books">독서 목록 보기</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
