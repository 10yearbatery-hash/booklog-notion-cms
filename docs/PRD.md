# PRD: 북로그 (BookLog) v2

> Notion을 CMS로 활용한 독서 기록 쇼케이스 웹 프로젝트

---

## 프로젝트 개요

- **프로젝트명**: 북로그 (BookLog)
- **버전**: v2 (2026-04-18 업데이트)
- **목적**: 내가 읽은 책들을 Notion DB에서 관리하고, 웹에서 아름답게 시각화하는 독서 기록 쇼케이스
- **CMS 선택 이유**: Notion API를 활용하여 비개발자도 책 추가·수정·삭제 등 콘텐츠 관리 가능

---

## 기술 스택

| 구분     | 기술                                    |
| -------- | --------------------------------------- |
| Frontend | Next.js 15.5.3 (App Router), TypeScript |
| CMS      | Notion API (`@notionhq/client`)         |
| Styling  | Tailwind CSS v4, shadcn/ui (new-york)   |
| Icons    | Lucide React                            |

---

## Notion 데이터베이스 구조

> v2에서도 Notion DB 스키마 변경 없음. 기존 6개 필드 그대로 유지.

| 필드명     | 타입          | 설명                        |
| ---------- | ------------- | --------------------------- |
| `제목`     | Title         | 책 제목 (필수)              |
| `저자`     | Text          | 저자명                      |
| `별점`     | Select        | ⭐1 / ⭐2 / ⭐3 / ⭐4 / ⭐5 |
| `상태`     | Select        | 읽는중 / 완독 / 읽을예정    |
| `한줄요약` | Text          | 핵심 인상 및 소감           |
| `커버`     | Files & media | 책 표지 이미지              |

---

## Book 타입 정의

```typescript
interface Book {
  id: string
  title: string
  author: string
  rating: number // 1~5
  status: BookStatus // 'reading' | 'completed' | 'planned'
  summary: string
  coverUrl: string | null
}

type BookStatus = 'reading' | 'completed' | 'planned'
```

---

## 구현 완료 기능 (v1)

v1에서 구현 완료된 기능 목록입니다. 이 기능들은 현재 프로덕션에서 정상 동작 중입니다.

### 데이터 연동

- Notion API 연동 (`@notionhq/client`)
- ISR 60초 캐싱 (`revalidate: 60`)
- 전체 책 목록 조회 (`getBooks()`)
- 단일 책 조회 (`getBookById(id)`)
- Notion 응답 → `Book` 타입 매핑 (`mapNotionPageToBook()`)

### 메인 페이지 `/books`

- 독서 목록 그리드: 반응형 3열 카드 레이아웃 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- 상태별 필터 탭: 전체 / 읽는중 / 완독 / 읽을예정, URL `?status=` 동기화
- 제목·저자 검색: 디바운스 300ms, URL `?q=` 동기화
- 정렬: 별점순 / 최근 추가순 / 가나다순, URL `?sort=` 동기화
- 무한 스크롤: IntersectionObserver 기반, 12개씩 추가 로딩
- 통계 배너: 완독수·읽는중·읽을예정 권수, 평균 별점, 완독률 Progress 바
- 로딩 Skeleton UI (`book-card-skeleton.tsx`, 9개 표시)
- 에러 처리: `error.tsx`, `loading.tsx`

### 상세 페이지 `/books/[id]`

- 대형 커버 이미지, 제목, 저자, 별점, 한줄요약, 상태 Badge 표시
- 동적 OG 메타데이터 (`generateMetadata()`)
- `notFound()` 처리

### 인프라 및 SEO

- `sitemap.ts` 동적 생성 (책 상세 페이지 URL 포함)
- `robots.ts` 생성
- 전역 `not-found.tsx` 처리

---

## v2 추가 기능

> Notion DB 스키마 변경 없이 프론트엔드만으로 구현합니다.

### F001 — 뷰 모드 토글 (그리드 ↔ 리스트)

**목적**: 사용자가 책 목록을 그리드 카드 형태 또는 한 줄 리스트 형태로 전환하여 볼 수 있도록 합니다.

**구현 위치**: `src/components/books/book-list.tsx` (클라이언트 컴포넌트)

**상세 명세**:

- 그리드 / 리스트 전환 토글 버튼 (`LayoutGrid`, `List` Lucide 아이콘)
- URL `?view=grid|list` 동기화 (기본값: `grid`)
- 그리드 모드: 기존 3열 반응형 `BookCard` 컴포넌트 유지
- 리스트 모드: 신규 `BookListItem` 컴포넌트 — 가로 레이아웃 (썸네일 좌측, 텍스트 우측)
  - 표시 항목: 커버 썸네일 (소형), 제목, 저자, 별점, 상태 Badge, 한줄요약
  - 반응형: 모바일에서 그리드 고정 또는 축소 리스트 레이아웃
- 리스트 모드 Skeleton: `BookListItemSkeleton` 컴포넌트 추가

**신규 파일**:

| 파일 경로                                          | 역할                         |
| -------------------------------------------------- | ---------------------------- |
| `src/components/books/book-list-item.tsx`          | 리스트 모드 단일 행 컴포넌트 |
| `src/components/books/book-list-item-skeleton.tsx` | 리스트 모드 Skeleton         |

---

### F002 — 별점 분포 차트 (통계 배너 확장)

**목적**: 통계 배너에 1~5점 별점 분포를 막대 그래프로 시각화하여 독서 취향을 한눈에 파악합니다.

**구현 위치**: `src/components/books/stats-banner.tsx`, `src/lib/book-stats.ts`

**상세 명세**:

- `book-stats.ts` 확장: `BookStats` 타입에 `ratingDistribution: Record<1|2|3|4|5, number>` 필드 추가
- `calculateStats()` 함수에서 별점별 권수 집계 로직 추가
- 통계 배너 하단에 별점 분포 영역 추가
  - 1점 ~ 5점 각 항목: 별 아이콘 + 권수 레이블 + 비율 Progress 바
  - shadcn `Progress` 컴포넌트 재사용 (신규 UI 컴포넌트 불필요)
  - 전체 권수 대비 비율(%)로 Progress 너비 계산

**타입 변경**:

```typescript
// src/types/book.ts 또는 src/lib/book-stats.ts
interface BookStats {
  completedCount: number
  readingCount: number
  plannedCount: number
  averageRating: number
  completionRate: number // 기존
  ratingDistribution: {
    // v2 추가
    [key in 1 | 2 | 3 | 4 | 5]: number
  }
}
```

---

### F003 — 랜덤 추천 버튼

**목적**: 현재 필터·검색 결과 중 랜덤으로 1권을 골라 해당 책 상세 페이지로 이동합니다. 읽을 책을 고르지 못할 때 유용합니다.

**구현 위치**: `src/components/books/book-list.tsx` (클라이언트 컴포넌트)

**상세 명세**:

- 필터 탭 영역 또는 검색 바 옆에 "랜덤 추천" 버튼 (`Shuffle` Lucide 아이콘) 배치
- 클릭 시: 현재 필터·검색·정렬이 적용된 표시 중인 책 배열에서 `Math.random()`으로 1권 선택
- 선택된 책의 상세 페이지(`/books/[id]`)로 `router.push()` 이동
- 현재 필터 결과가 0권이면 버튼 비활성화 (`disabled` 상태)
- 버튼 클릭 시 짧은 로딩 스피너 표시 후 이동 (UX)

---

### F004 — 검색어 하이라이트

**목적**: 검색어 입력 시 카드 및 리스트 아이템의 제목·저자 텍스트에서 일치하는 부분을 시각적으로 강조합니다.

**구현 위치**:

- `src/components/books/book-card.tsx`
- `src/components/books/book-list-item.tsx` (F001에서 신규 생성)
- `src/lib/highlight.ts` (헬퍼 함수 신규 생성)

**상세 명세**:

- `src/lib/highlight.ts`: `highlightText(text: string, query: string): React.ReactNode` 함수 구현
  - 검색어가 없거나 빈 문자열이면 원본 텍스트 반환
  - 대소문자 무시 (`toLowerCase()` 비교)
  - 일치 구간을 `<mark>` 또는 `<span>` 태그로 감싸서 반환
  - 하이라이트 스타일: `bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5`
- `BookCard`와 `BookListItem`에 `searchQuery?: string` prop 추가
- 제목(`title`), 저자(`author`) 필드에 `highlightText()` 적용
- 검색어가 없으면 기존 렌더링과 동일하게 동작 (하위 호환)

---

### F005 — 공유 버튼 (상세 페이지)

**목적**: 상세 페이지에서 책 정보를 외부에 쉽게 공유합니다. 모바일에서는 네이티브 공유 시트, PC에서는 클립보드 복사로 대응합니다.

**구현 위치**: `src/app/books/[id]/page.tsx` 또는 신규 `src/components/books/share-button.tsx`

**상세 명세**:

- `ShareButton` 클라이언트 컴포넌트 (`'use client'`) 신규 생성
  - Props: `title: string`, `url: string`
  - 공유 버튼 (`Share2` Lucide 아이콘) 상세 페이지 상단 또는 책 제목 옆 배치
- **모바일**: `navigator.share()` API 지원 여부 확인 후 네이티브 공유 시트 호출
  - 공유 데이터: `{ title: '북로그 - ${책 제목}', url: 현재 페이지 URL }`
- **PC (Web Share API 미지원)**: 클립보드 복사 (`navigator.clipboard.writeText()`)
  - 복사 성공 시 버튼 텍스트/아이콘 변경으로 피드백 (`Check` 아이콘, 2초 후 원복)
- 오류 처리: `navigator.share()` 실패 또는 클립보드 권한 거부 시 토스트 메시지 표시

**신규 파일**:

| 파일 경로                               | 역할                          |
| --------------------------------------- | ----------------------------- |
| `src/components/books/share-button.tsx` | 공유 버튼 클라이언트 컴포넌트 |

---

## 화면 구성 (v2 반영)

### 메인 페이지 `/books`

- **통계 배너**: 완독·읽는중·읽을예정 권수, 평균 별점, 완독률 Progress 바
  - (v2) 별점 분포 차트: 1~5점 막대 그래프 (F002)
- **컨트롤 영역**: 검색 바 + 정렬 선택 + 뷰 모드 토글 버튼 + 랜덤 추천 버튼 (F001, F003)
- **필터 탭**: 전체 / 읽는중 / 완독 / 읽을예정
- **책 목록**:
  - 그리드 모드(기본): 3열 반응형 카드, 검색어 하이라이트 적용 (F004)
  - 리스트 모드(v2): 1열 가로 레이아웃 아이템, 검색어 하이라이트 적용 (F001, F004)
- **무한 스크롤**: 12개씩 추가 로딩
- **로딩 상태**: 뷰 모드에 맞는 Skeleton UI

### 상세 페이지 `/books/[id]`

- 대형 커버 이미지, 제목, 저자, 별점, 한줄요약, 상태 Badge
- (v2) 공유 버튼: Web Share API + 클립보드 복사 (F005)
- 동적 OG 메타데이터

---

## 컴포넌트 구조 (v2 기준)

```
src/
├── app/
│   ├── books/
│   │   ├── page.tsx                    # 메인 페이지 (서버 컴포넌트)
│   │   ├── loading.tsx                 # Skeleton 로딩
│   │   ├── error.tsx                   # 에러 바운더리
│   │   └── [id]/
│   │       └── page.tsx                # 상세 페이지
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── books/
│   │   ├── book-card.tsx               # 그리드 카드 (v2: searchQuery prop 추가)
│   │   ├── book-card-skeleton.tsx      # 그리드 Skeleton
│   │   ├── book-list-item.tsx          # (v2 신규) 리스트 모드 아이템
│   │   ├── book-list-item-skeleton.tsx # (v2 신규) 리스트 모드 Skeleton
│   │   ├── book-list.tsx               # 필터 + 그리드/리스트 컨테이너 (v2: 뷰 토글, 랜덤 추천)
│   │   ├── filter-tabs.tsx
│   │   ├── share-button.tsx            # (v2 신규) 공유 버튼
│   │   └── stats-banner.tsx            # (v2: 별점 분포 차트 추가)
│   ├── layout/
│   ├── navigation/
│   └── ui/
├── lib/
│   ├── book-helpers.ts
│   ├── book-stats.ts                   # (v2: ratingDistribution 추가)
│   ├── books.ts
│   ├── env.ts
│   ├── highlight.ts                    # (v2 신규) 검색어 하이라이트 헬퍼
│   └── notion.ts
└── types/
    └── book.ts                         # (v2: BookStats 타입 확장)
```

---

## 재사용 컴포넌트

| 컴포넌트                              | 용도                               |
| ------------------------------------- | ---------------------------------- |
| `src/components/ui/card.tsx`          | 책 카드 기반 레이아웃              |
| `src/components/ui/badge.tsx`         | 읽기 상태 뱃지                     |
| `src/components/ui/skeleton.tsx`      | 로딩 상태 UI                       |
| `src/components/ui/progress.tsx`      | 통계 시각화, 별점 분포 차트 (F002) |
| `src/components/ui/button.tsx`        | 뷰 토글, 랜덤 추천, 공유 버튼      |
| `src/components/layout/header.tsx`    | 공통 헤더                          |
| `src/components/layout/container.tsx` | 페이지 레이아웃 컨테이너           |

---

## URL 파라미터 규격 (전체)

| 파라미터   | 값 예시                           | 기능                   |
| ---------- | --------------------------------- | ---------------------- |
| `?status=` | `reading`, `completed`, `planned` | 상태별 필터            |
| `?q=`      | `클린 코드`                       | 제목·저자 검색         |
| `?sort=`   | `rating`, `latest`, `title`       | 정렬 기준              |
| `?view=`   | `grid`, `list`                    | 뷰 모드 토글 (v2 추가) |
