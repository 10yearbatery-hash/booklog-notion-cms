# 🗺️ 개발 로드맵

> 📋 기반 문서: [PRD.md](./PRD.md)
> 📅 작성일: 2026-04-17
> 🏗️ 프로젝트: 북로그 (BookLog) — Notion CMS 기반 독서 기록 쇼케이스

---

## 📊 전체 일정 요약

| Phase | 단계명 | 예상 소요 시간 | 상태 |
| :---: | :--- | :---: | :---: |
| 0 | 사전 준비 | 완료 | ✅ |
| 1 | 프로젝트 골격 (구조, 환경 설정) | 0.5-1일 | 🟡 부분 완료 |
| 2 | 공통 모듈 (모든 기능에서 쓰는 것들) | 0.5-1일 | ⚪ 대기 |
| 3 | 핵심 기능 (가장 중요한 기능) | 2-3일 | ⚪ 대기 |
| 4 | 추가 기능 (부가적인 기능) | 2-4일 | ⚪ 대기 |
| 5 | 최적화 및 배포 | 1-2일 | ⚪ 대기 |

**총 예상 소요 시간**: 약 6-11일 (MVP까지는 3-5일)

### 상태 범례

| 아이콘 | 의미 |
| :---: | :--- |
| ✅ | 완료 |
| 🟢 | 진행 중 |
| 🟡 | 부분 완료 |
| ⚪ | 대기 |
| 🔴 | 블로킹 |

---

## ✅ Phase 0: 사전 준비 (완료)

| 작업 | 상태 | 비고 |
| :--- | :---: | :--- |
| PRD 작성 (`docs/PRD.md`) | ✅ | 북로그 프로젝트 요구사항 명세 완료 |
| Next.js 15.5.3 + React 19 스타터 구축 | ✅ | App Router, Turbopack 기본 설정 완료 |
| TailwindCSS v4 + shadcn/ui 초기화 | ✅ | new-york 스타일, 공통 UI 컴포넌트 구비 |
| ESLint / Prettier / Husky / lint-staged | ✅ | 커밋 훅 설정 완료 |
| 공통 레이아웃 및 네비게이션 컴포넌트 | ✅ | `src/components/layout/`, `navigation/` |
| 랜딩 / 로그인 / 회원가입 페이지 | ✅ | 기본 페이지 골격 구현 완료 |

---

## 🏗️ Phase 1: 프로젝트 골격 (구조, 환경 설정)

### Phase 1 · 왜 이 순서인가?

외부 시스템(Notion API)과의 연결이 가장 큰 불확실성입니다. 환경변수와 API 연동을 **가장 먼저** 검증해야 이후 모든 단계가 막힘 없이 진행됩니다. 타입 정의를 이 단계에서 확정하면, 상위 레이어(컴포넌트·페이지)는 계약(contract)에 따라 안전하게 병렬 개발할 수 있습니다.

> API Key 발급 → 클라이언트 초기화 → 타입 정의 순서로 "외부에서 내부로" 좁혀 들어갑니다.

### Phase 1 · 세부 작업

- [ ] **1-1. Notion Integration 생성 및 DB 연결** — 🕐 30분
  - Notion 워크스페이스에서 Integration 생성
  - 독서 기록 DB 생성 및 Integration에 공유 권한 부여
  - DB 속성 구성: `제목(Title)`, `저자(Text)`, `별점(Select)`, `상태(Select)`, `한줄요약(Text)`, `커버(Files & media)`
  - `NOTION_API_KEY`, `NOTION_DATABASE_ID` 발급

- [ ] **1-2. 환경변수 설정** — 🕐 20분
  - `.env.local` 생성 및 키 추가
  - `.env.example` 템플릿 파일 생성
  - `src/lib/env.ts`에 Zod 스키마 기반 환경변수 검증 추가

- [ ] **1-3. Notion 클라이언트 설치 및 초기화** — 🕐 30분
  - `npm install @notionhq/client` 패키지 설치
  - `src/lib/notion.ts` 생성 — 싱글톤 인스턴스 export
  - `import 'server-only'`로 서버 전용 모듈 지정

- [ ] **1-4. 도메인 타입 정의** — 🕐 30분
  - `src/types/book.ts` 생성
  - `Book` 인터페이스 (id, title, author, rating, status, summary, coverUrl)
  - `BookStatus` 유니언 타입: `'reading' | 'completed' | 'planned'`
  - Notion 원본 응답 → 앱 도메인 타입 매핑 인터페이스

### Phase 1 · 완료 기준

- [ ] `.env.local` 값으로 Notion DB에 실제 접근 가능함 (Route Handler 또는 스크립트로 검증)
- [ ] `npm run dev` 실행 시 에러 없이 구동됨
- [ ] `Book` 타입이 PRD의 모든 DB 속성을 완전하게 커버함
- [ ] `npm run check-all` 통과

---

## 🧩 Phase 2: 공통 모듈 (모든 기능에서 쓰는 것들)

### Phase 2 · 왜 이 순서인가?

데이터 페칭 함수와 유틸리티는 **모든 UI 컴포넌트가 공통으로 의존**합니다. 이 레이어를 먼저 완성하면 이후 컴포넌트 개발 시 중복 코드가 없고, 각 컴포넌트가 순수 표현(presentation) 로직에만 집중할 수 있습니다. Notion 이미지 도메인 설정을 여기서 처리하지 않으면 Phase 3에서 런타임 에러로 막힙니다.

> 데이터 레이어 → 계산 유틸리티 → UI 헬퍼 → 인프라 설정 순서로 "데이터 흐름 방향"을 따릅니다.

### Phase 2 · 세부 작업

- [ ] **2-1. 책 목록 조회 함수 구현** — 🕐 1-2시간
  - `src/lib/books.ts` 생성
  - `getBooks()`: Notion DB 쿼리 → `Book[]` 매핑
  - `getBookById(id: string)`: 단일 책 조회 (Phase 4 상세 페이지에서 활용)
  - `mapNotionPageToBook()` 헬퍼 함수
  - Notion API 실패 시 빈 배열 반환 (graceful degradation)

- [ ] **2-2. 통계 계산 유틸리티** — 🕐 30분
  - `src/lib/book-stats.ts`
  - `calculateStats(books: Book[]): BookStats`
  - `BookStats` 타입: 완독/읽는중/읽을예정 권수, 평균 별점

- [ ] **2-3. 상태 라벨 / 색상 매핑 헬퍼** — 🕐 20분
  - `src/lib/book-helpers.ts`
  - `getStatusLabel(status)`: 한글 라벨 반환
  - `getStatusVariant(status)`: shadcn Badge variant 매핑
  - `renderRating(rating)`: 별점 → 이모지/아이콘 변환

- [ ] **2-4. UI 컴포넌트 재확인 및 tabs 추가** — 🕐 20분
  - `card.tsx`, `badge.tsx`, `skeleton.tsx`, `progress.tsx` 작동 확인
  - `npx shadcn@latest add tabs` 로 Tabs 컴포넌트 추가 (필터 탭용)

- [ ] **2-5. Notion 이미지 도메인 설정** — 🕐 15분
  - `next.config.ts`의 `images.remotePatterns`에 Notion S3 도메인 추가
  - `prod-files-secure.s3.us-west-2.amazonaws.com`
  - `s3.us-west-2.amazonaws.com`

### Phase 2 · 완료 기준

- [ ] `getBooks()` 호출 시 실제 Notion DB 데이터가 `Book[]`로 반환됨
- [ ] `calculateStats()`가 PRD에 명시된 모든 통계 값을 정확히 계산함
- [ ] 표지 이미지 URL을 `next/image`로 렌더링 시 에러 없음
- [ ] `tabs` 컴포넌트가 `src/components/ui/tabs.tsx`에 존재함

---

## 🚀 Phase 3: 핵심 기능 (가장 중요한 기능)

### Phase 3 · 왜 이 순서인가?

"아래에서 위(Bottom-Up)"로 구현합니다. 개별 컴포넌트를 먼저 완성해야 페이지 조립 시 검증된 블록을 배치만 하면 됩니다. 필터 탭은 클라이언트 상태가 필요하므로 서버 컴포넌트(페이지)와의 경계를 마지막에 설계합니다. 네비게이션 링크는 가장 영향 범위가 작아 맨 끝에 배치합니다.

> 책 카드 → 통계 배너 → 필터 탭 → Skeleton → 페이지 조립 → 네비게이션 연결

### Phase 3 · 세부 작업

- [ ] **3-1. 책 카드 컴포넌트** — 🕐 2-3시간
  - `src/components/books/book-card.tsx` 생성
  - Props: `book: Book`
  - 표지 이미지 (`next/image`, `object-cover`, 3:4 비율), 이미지 없을 시 placeholder
  - 제목, 저자, 별점 (Lucide `Star`), 상태 Badge, 한줄요약 (`line-clamp-2`)
  - 반응형 + 다크모드 대응

- [ ] **3-2. 통계 배너 컴포넌트** — 🕐 1-2시간
  - `src/components/books/stats-banner.tsx` 생성
  - Props: `stats: BookStats`
  - 완독/읽는중/읽을예정 권수, 평균 별점 표시
  - 완독률 `Progress` 바 시각화
  - Lucide 아이콘 활용: `BookOpen`, `BookCheck`, `Bookmark`, `Star`

- [ ] **3-3. 필터 탭 컴포넌트** — 🕐 2시간
  - `src/components/books/filter-tabs.tsx` 생성 (`'use client'`)
  - shadcn `Tabs` 기반: 전체 / 읽는중 / 완독 / 읽을예정
  - URL searchParams 동기화 (`?status=reading`)
  - 각 탭에 해당 권수 뱃지 표시

- [ ] **3-4. 로딩 Skeleton UI** — 🕐 30분
  - `src/components/books/book-card-skeleton.tsx`
  - 책 카드와 동일한 레이아웃의 Skeleton 버전 (9개 표시)

- [ ] **3-5. 메인 페이지 조립** — 🕐 2-3시간
  - `src/app/books/page.tsx` (서버 컴포넌트)
  - `getBooks()` 호출 → 통계 계산 → 통계 배너 렌더링
  - `<BookList />` (클라이언트 컴포넌트): 필터 탭 + 카드 그리드 주입
  - 반응형 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
  - `loading.tsx`로 Skeleton, `error.tsx`로 에러 처리
  - `metadata.title`, `description` 설정

- [ ] **3-6. 네비게이션에 `/books` 링크 추가** — 🕐 20분
  - `src/components/layout/header.tsx`에 북로그 메뉴 추가
  - 랜딩 페이지(`/`)에서 `/books`로 유도하는 CTA 추가 (선택)

### Phase 3 · 완료 기준

- [ ] `/books` 페이지에 Notion DB의 모든 책이 카드로 렌더링됨
- [ ] 필터 탭 클릭 시 즉시 해당 상태의 책만 표시되고 URL도 변경됨
- [ ] 통계 배너의 숫자가 실제 데이터와 일치함
- [ ] 모바일/태블릿/데스크탑에서 레이아웃이 깨지지 않음
- [ ] 네트워크 지연 시 Skeleton이 표시됨
- [ ] 다크모드에서도 가독성 확보
- [ ] `npm run build` 성공

---

## 🔧 Phase 4: 추가 기능 (부가적인 기능)

### Phase 4 · 왜 이 순서인가?

사용자 여정 "발견 → 탐색 → 대량 데이터 처리" 순서로 가치를 제공합니다. 상세 페이지는 1권 단위의 깊은 경험을 완성하고, 검색/페이지네이션은 데이터가 충분히 쌓여야 의미 있으므로 뒤에 배치합니다. ISR은 Notion CMS의 핵심 가치("비개발자가 즉시 반영")를 완성하는 마무리입니다.

> 상세 페이지 → 검색 → 페이지네이션 → 정렬 → 실시간 반영(ISR)

### Phase 4 · 세부 작업

- [ ] **4-1. 책 상세 페이지** — 🕐 3-4시간
  - `src/app/books/[id]/page.tsx` (서버 컴포넌트)
  - `getBookById()` 활용, `notFound()` 처리
  - 대형 커버 이미지, 제목, 저자, 별점, 한줄요약, 상태 Badge
  - `generateMetadata()`로 동적 OG 메타데이터
  - 책 카드에서 상세 페이지로 링크 연결

- [ ] **4-2. 검색 기능** — 🕐 2-3시간
  - 상단 검색 바 (클라이언트 컴포넌트, shadcn `Input`)
  - 제목/저자 클라이언트 사이드 필터링 (Fuse.js 또는 `includes`)
  - 디바운스 처리 (300ms)
  - URL 동기화 (`?q=...`)

- [ ] **4-3. 페이지네이션 / 무한 스크롤** — 🕐 3-4시간
  - Notion API `page_size`, `start_cursor` 활용
  - "더 보기" 버튼 또는 IntersectionObserver 기반 무한 스크롤
  - Route Handler(`/api/books`)로 추가 페이지 요청

- [ ] **4-4. 정렬 옵션** — 🕐 1-2시간
  - 별점순 / 최근 추가순 / 제목 가나다순
  - shadcn `Select` 컴포넌트 활용, URL 동기화

- [ ] **4-5. Notion Webhook 기반 ISR** — 🕐 2시간 (선택)
  - `revalidatePath('/books')` 호출 Route Handler 구현
  - 또는 `revalidate: 60` 설정으로 최대 60초 내 반영 보장

### Phase 4 · 완료 기준

- [ ] 카드 클릭 시 상세 페이지로 이동, 뒤로가기 시 스크롤 위치 유지
- [ ] 검색어 입력 시 즉시 필터링되며 URL도 업데이트됨
- [ ] 50권 이상 데이터에서도 초기 로드 3초 이내
- [ ] Notion에서 책 추가 후 최대 60초 이내 웹에 반영됨

---

## 🚢 Phase 5: 최적화 및 배포

### Phase 5 · 왜 이 순서인가?

"기능 완성 → 찾기 쉽게 → 모두가 쓸 수 있게 → 세상에 내놓기" 순서입니다. 성능 최적화를 먼저 해야 이후 Lighthouse 측정 결과가 명확하고, SEO/접근성 수정이 빌드에 영향을 주지 않음을 확인한 뒤 배포합니다. 모니터링은 실제 트래픽이 있어야 의미 있으므로 배포 직후에 붙입니다.

> 성능 최적화 → SEO → 접근성 → 에러 처리 → 배포 → 모니터링 → 최종 QA

### Phase 5 · 세부 작업

- [ ] **5-1. 성능 최적화** — 🕐 3-4시간
  - `next/image` 최적화 (`sizes`, `priority`, `placeholder="blur"`)
  - `@next/bundle-analyzer`로 번들 분석
  - 동적 임포트로 상호작용 컴포넌트 지연 로딩
  - `unstable_cache` / `revalidate`로 Notion API 응답 캐싱
  - Lighthouse Performance 90+ 목표

- [ ] **5-2. SEO 최적화** — 🕐 1-2시간
  - `app/sitemap.ts` 동적 생성 (책 상세 페이지 URL 포함)
  - `app/robots.ts` 생성
  - OpenGraph / Twitter Card 메타데이터 설정
  - `metadata.title.template` 구성

- [ ] **5-3. 접근성 검토** — 🕐 1-2시간
  - 키보드 네비게이션 (Tab / Enter) 검증
  - 색 대비 WCAG AA 검증 (다크/라이트 모드 모두)
  - `alt` 속성 전수 점검
  - Lighthouse Accessibility 95+ 목표

- [ ] **5-4. 에러 처리 및 로깅** — 🕐 1시간
  - 전역 `error.tsx`, `not-found.tsx` 검토
  - Notion API 실패 시 사용자 친화적 메시지 확인
  - Sentry 또는 Vercel Analytics 도입 (선택)

- [ ] **5-5. 배포 파이프라인** — 🕐 1-2시간
  - Vercel 프로젝트 연결 (GitHub 연동)
  - 환경변수 프로덕션 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
  - 프리뷰 배포 확인 → 프로덕션 배포
  - 커스텀 도메인 연결 (선택)

- [ ] **5-6. 모니터링 및 분석** — 🕐 30분
  - Vercel Analytics 또는 Plausible 활성화
  - Web Vitals 대시보드 확인

- [ ] **5-7. 최종 QA** — 🕐 1-2시간
  - Chrome / Safari / Firefox 브라우저 테스트
  - 모바일 실기기 테스트
  - `npm run check-all` + `npm run build` 최종 통과
  - README 업데이트 (프로젝트 소개, 실행 방법, 배포 URL)

### Phase 5 · 완료 기준

- [ ] Lighthouse (Performance / Accessibility / Best Practices / SEO) 모두 90+
- [ ] 프로덕션 URL로 `/books`, `/books/[id]` 접근 가능
- [ ] 모바일에서 CLS < 0.1, LCP < 2.5s
- [ ] README에 배포 URL 포함

---

## 📐 최종 목표 아키텍처

```text
src/
├── app/
│   ├── books/
│   │   ├── page.tsx              # 메인 페이지 (서버 컴포넌트)
│   │   ├── loading.tsx           # Skeleton 로딩
│   │   ├── error.tsx             # 에러 바운더리
│   │   └── [id]/
│   │       └── page.tsx          # 상세 페이지 (Phase 4)
│   ├── sitemap.ts                # Phase 5
│   └── robots.ts                 # Phase 5
├── components/
│   ├── books/
│   │   ├── book-card.tsx
│   │   ├── book-card-skeleton.tsx
│   │   ├── book-list.tsx         # 필터 + 그리드 클라이언트 컨테이너
│   │   ├── filter-tabs.tsx
│   │   └── stats-banner.tsx
│   ├── layout/                   # (기존)
│   ├── navigation/               # (기존)
│   └── ui/                       # shadcn/ui (기존)
├── lib/
│   ├── book-helpers.ts           # 라벨/색상 매핑
│   ├── book-stats.ts             # 통계 계산
│   ├── books.ts                  # 데이터 페칭
│   ├── env.ts                    # 환경변수 검증 (기존)
│   └── notion.ts                 # Notion 클라이언트
└── types/
    └── book.ts                   # 도메인 타입
```

---

## 🎯 마일스톤

| 마일스톤 | 도달 조건 | 예상 시점 |
| :--- | :--- | :---: |
| **M1: 기반 구축 완료** | Phase 1-2 완료, Notion 데이터가 코드로 흐름 | D+1 |
| **M2: MVP 런칭** | Phase 3 완료, `/books` 페이지 공개 가능 | D+4 |
| **M3: 풀 기능 완성** | Phase 4 완료, 상세/검색/페이지네이션 가용 | D+8 |
| **M4: 프로덕션 런칭** | Phase 5 완료, 커스텀 도메인 배포 | D+11 |

---

## 🧪 품질 게이트

모든 Phase 종료 시 반드시 통과해야 합니다.

```bash
npm run check-all   # Lint + Type check + Format 검증
npm run build       # 프로덕션 빌드 성공
```

- [ ] TypeScript `strict` 모드 에러 0건
- [ ] ESLint warning/error 0건
- [ ] Prettier 포맷 일치
- [ ] 빌드 산출물 크기 급증 없음 (기준치 대비 +20% 이내)

---

> 💡 **Tip**: 각 Phase 완료 후 체크박스를 업데이트하고 `git commit -m "docs: Phase N 완료"` 형태로 커밋하세요. `/docs:update-roadmap` 스킬로 자동화할 수 있습니다.
