# 📖 PRD: 북로그 (BookLog)

> Notion을 CMS로 활용한 독서 기록 쇼케이스 웹 프로젝트

---

## 프로젝트 개요
    
- **프로젝트명**: 북로그 (BookLog)
- **목적**: 내가 읽은 책들을 Notion DB에서 관리하고, 웹에서 아름답게 시각화하는 독서 기록 쇼케이스
- **CMS 선택 이유**: Notion API를 활용하여 비개발자도 책 추가·수정·삭제 등 콘텐츠 관리 가능

---

## 주요 기능

1. **독서 목록 그리드** — 책 커버·제목·저자·별점·상태를 카드 레이아웃으로 시각화
2. **상태별 필터링** — 읽는중 / 완독 / 읽을예정 / 전체 탭 필터
3. **독서 통계 배너** — 완독 권수, 읽는중 권수, 평균 별점 요약 표시

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 15.5.3 (App Router), TypeScript |
| CMS | Notion API (`@notionhq/client`) |
| Styling | Tailwind CSS v4, shadcn/ui (new-york) |
| Icons | Lucide React |

---

## Notion 데이터베이스 구조

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `제목` | Title | 책 제목 (필수) |
| `저자` | Text | 저자명 |
| `별점` | Select | ⭐1 / ⭐2 / ⭐3 / ⭐4 / ⭐5 |
| `상태` | Select | 읽는중 / 완독 / 읽을예정 |
| `한줄요약` | Text | 핵심 인상 및 소감 |
| `커버` | Files & media | 책 표지 이미지 |

---

## 화면 구성

### 메인 페이지 `/books`
- **통계 배너**: 완독·읽는중·읽을예정 권수, 평균 별점
- **필터 탭**: 전체 / 읽는중 / 완독 / 읽을예정
- **책 카드 그리드**: 3열 반응형, 각 카드에 커버·제목·저자·별점·상태·한줄요약 표시
- **로딩 상태**: Skeleton 카드 UI

### 상세 페이지 `/books/[id]` _(MVP 이후 구현)_
- 커버 이미지, 제목, 저자, 별점, 한줄요약 상세 표시

---

## MVP 범위

### 포함
- Notion API 연동 및 책 목록 조회
- 책 카드 그리드 렌더링 (반응형)
- 상태별 필터 탭 (클라이언트 필터링)
- 통계 배너
- 로딩 Skeleton UI

### 제외 (MVP 이후)
- 상세 페이지 (`/books/[id]`)
- 검색 기능
- 페이지네이션
- 인증 / 관리자 기능

---

## 구현 단계

1. **PRD 작성** — `docs/PRD.md` ✅
2. **환경변수 설정** — `.env.local` + `src/lib/notion.ts` Notion 클라이언트
3. **타입 정의** — `src/types/book.ts`
4. **데이터 페칭** — `src/lib/books.ts` (Notion DB 조회 함수)
5. **책 카드 컴포넌트** — `src/components/books/book-card.tsx`
6. **통계 배너 컴포넌트** — `src/components/books/stats-banner.tsx`
7. **필터 탭 컴포넌트** — `src/components/books/filter-tabs.tsx`
8. **메인 페이지** — `src/app/books/page.tsx`

---

## 재사용할 기존 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| `src/components/ui/card.tsx` | 책 카드 기반 레이아웃 |
| `src/components/ui/badge.tsx` | 읽기 상태 뱃지 |
| `src/components/ui/skeleton.tsx` | 로딩 상태 UI |
| `src/components/ui/progress.tsx` | 통계 시각화 |
| `src/components/layout/header.tsx` | 공통 헤더 |
| `src/components/layout/container.tsx` | 페이지 레이아웃 컨테이너 |
