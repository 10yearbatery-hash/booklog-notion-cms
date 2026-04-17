# Development Guidelines

## 프로젝트 개요

- **프로젝트**: 북로그(BookLog) — Notion API를 CMS로 활용한 독서 기록 쇼케이스
- **스택**: Next.js 15.5.3 App Router, React 19, TypeScript 5, TailwindCSS v4, shadcn/ui (new-york)
- **CMS**: Notion API (`@notionhq/client`) — 서버 전용 모듈
- **목표 페이지**: `/books` (목록), `/books/[id]` (상세, Phase 4)

---

## 디렉토리 구조 및 파일 배치 규칙

### 신규 파일 생성 위치

| 파일 종류         | 위치                          |
| ----------------- | ----------------------------- |
| 도메인 타입       | `src/types/book.ts`           |
| Notion 클라이언트 | `src/lib/notion.ts`           |
| 데이터 페칭 함수  | `src/lib/books.ts`            |
| 통계 계산 유틸    | `src/lib/book-stats.ts`       |
| 라벨/색상 헬퍼    | `src/lib/book-helpers.ts`     |
| 책 관련 컴포넌트  | `src/components/books/`       |
| 책 목록 페이지    | `src/app/books/page.tsx`      |
| 책 상세 페이지    | `src/app/books/[id]/page.tsx` |
| 로딩 UI           | `src/app/books/loading.tsx`   |
| 에러 UI           | `src/app/books/error.tsx`     |

### 파일 명명 규칙

- 컴포넌트 파일: `kebab-case.tsx`
- 유틸/라이브러리: `kebab-case.ts`
- 타입 파일: `kebab-case.ts`
- 페이지/레이아웃: Next.js 컨벤션 (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)

---

## 컴포넌트 작성 규칙

### 서버/클라이언트 컴포넌트 경계

- **서버 컴포넌트 (기본)**: `src/app/books/page.tsx`, `src/components/books/stats-banner.tsx`, `src/components/books/book-card.tsx`
- **클라이언트 컴포넌트 (`'use client'` 필수)**: `src/components/books/filter-tabs.tsx`, `src/components/books/book-list.tsx`
- `useState`, `useEffect`, `useSearchParams` 사용 시 반드시 파일 최상단에 `'use client'` 선언
- Notion API 호출 함수는 절대 클라이언트 컴포넌트에서 직접 호출 금지

### 서버 전용 모듈 격리

- `src/lib/notion.ts`에는 반드시 `import 'server-only'` 추가
- `src/lib/books.ts`에는 반드시 `import 'server-only'` 추가
- Route Handler(`src/app/api/`)에서만 서버 전용 모듈 호출 허용

### 컴포넌트 Props 타입

- 모든 컴포넌트 Props는 인터페이스로 정의 (`interface BookCardProps { book: Book }`)
- `src/types/book.ts`에서 정의한 타입만 사용, 인라인 타입 정의 금지

---

## 환경변수 관리 규칙

### **환경변수 추가 시 3개 파일 동시 수정 필수**

1. `.env.local` — 실제 값 추가
2. `.env.example` — 템플릿(빈 값) 추가
3. `src/lib/env.ts` — Zod 스키마에 필드 추가

### env.ts 수정 패턴

```typescript
// 추가 예시
const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_DATABASE_ID: z.string().min(1),
  // 기존 필드 유지
})
```

- `env.ts`를 수정하지 않고 `process.env.X` 직접 접근 금지
- 환경변수는 반드시 `env.NOTION_API_KEY` 형태로만 참조

---

## Notion API 사용 규칙

### 클라이언트 초기화 (`src/lib/notion.ts`)

```typescript
import 'server-only'
import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

export const notion = new Client({ auth: env.NOTION_API_KEY })
```

- 싱글톤 패턴 유지 — 여러 파일에서 `new Client()` 중복 생성 금지
- 항상 `src/lib/notion.ts`에서 import하여 사용

### 데이터 페칭 (`src/lib/books.ts`)

- `getBooks()`: Notion DB 전체 조회 → `Book[]` 반환
- `getBookById(id: string)`: 단일 조회 → `Book | null` 반환
- Notion API 실패 시 에러를 throw하지 않고 빈 배열/null 반환 (graceful degradation)
- 반드시 `mapNotionPageToBook()` 헬퍼로 Notion 응답을 도메인 타입으로 변환

### Notion 이미지 도메인 (`next.config.ts`)

- 커버 이미지 사용 시 `next.config.ts`의 `images.remotePatterns`에 추가 필수:
  - `prod-files-secure.s3.us-west-2.amazonaws.com`
  - `s3.us-west-2.amazonaws.com`

---

## 타입 정의 규칙 (`src/types/book.ts`)

```typescript
export type BookStatus = 'reading' | 'completed' | 'planned'

export interface Book {
  id: string
  title: string
  author: string
  rating: number // 1-5
  status: BookStatus
  summary: string
  coverUrl: string | null
}

export interface BookStats {
  total: number
  completed: number
  reading: number
  planned: number
  averageRating: number
}
```

- Notion 원본 응답 타입(`PageObjectResponse`)을 앱 코드에서 직접 사용 금지
- 반드시 `Book` 타입으로 변환 후 사용

---

## 스타일링 규칙

### TailwindCSS v4

- CSS 변수 기반 테마 (`src/app/globals.css`) — 색상은 `bg-background`, `text-foreground` 등 시맨틱 클래스 사용
- 직접 색상 하드코딩 금지 (`bg-white` 대신 `bg-background`)

### 다크모드

- 모든 컴포넌트에 다크모드 대응 필수
- shadcn/ui 컴포넌트는 자동 지원, 커스텀 컴포넌트는 `dark:` 접두사 클래스 추가

### 반응형 그리드

- 책 카드 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- 모바일 우선(mobile-first) 작성

### 이미지 (`next/image`)

- 책 표지: 3:4 비율 (`aspect-[3/4]`), `object-cover`
- `sizes` 속성 반드시 지정
- 이미지 없을 시 placeholder UI 제공

---

## shadcn/ui 컴포넌트 규칙

- 새 컴포넌트 추가 시 반드시 CLI 사용: `npx shadcn@latest add [name]`
- `src/components/ui/` 파일 직접 생성 금지
- 현재 설치된 컴포넌트: `alert`, `avatar`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `navigation-menu`, `progress`, `select`, `separator`, `sheet`, `skeleton`, `sonner`
- 필터 탭 구현 시: `npx shadcn@latest add tabs` 먼저 실행

---

## 네비게이션 수정 규칙

### **네비게이션 수정 시 2개 파일 동시 수정 필수**

1. `src/components/navigation/main-nav.tsx` — 데스크탑 네비게이션
2. `src/components/navigation/mobile-nav.tsx` — 모바일 네비게이션

- `/books` 링크 추가 시 두 파일 모두 업데이트

---

## URL searchParams 동기화 규칙

- 필터 탭 상태: `?status=reading | completed | planned`
- 검색어: `?q=...`
- `useSearchParams()` + `useRouter()` 사용 (클라이언트 컴포넌트)
- SSR을 위해 서버 컴포넌트에서 `searchParams` prop으로 초기값 전달

---

## 품질 게이트

- 모든 작업 완료 후 반드시 실행: `npm run check-all`
- 배포 전 반드시 실행: `npm run build`
- TypeScript `strict` 모드 에러 0건 유지
- ESLint 경고/에러 0건 유지

---

## 금지 사항

- `process.env.X` 직접 접근 금지 → 반드시 `src/lib/env.ts`의 `env` 객체 사용
- 클라이언트 컴포넌트에서 Notion API 직접 호출 금지
- `src/components/ui/` 파일 수동 생성/편집 금지 → shadcn CLI 사용
- Notion 원본 응답 타입을 컴포넌트 Props로 직접 전달 금지
- `any` 타입 사용 금지
- 인라인 스타일(`style={{}}`) 사용 금지 → Tailwind 클래스 사용
- 색상 하드코딩 금지 (`bg-white`, `text-black` 등) → 시맨틱 클래스 사용
- `src/lib/notion.ts` 외 다른 곳에서 `new Client()` 인스턴스 생성 금지
