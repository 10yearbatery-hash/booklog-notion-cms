import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <section className="container flex flex-col items-center gap-6 py-24 text-center">
          <div className="bg-primary/10 flex items-center justify-center rounded-full p-4">
            <BookOpen className="text-primary h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            북로그
          </h1>
          <p className="text-muted-foreground max-w-md text-lg">
            Notion으로 관리하는 나의 독서 기록 쇼케이스
          </p>
          <Button asChild size="lg">
            <Link href="/books">독서 목록 보기</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
