# 개발 로드맵

> 기반 문서: [PRD.md](./PRD.md) (v2)
> 작성일: 2026-04-18
> 프로젝트: 북로그 (BookLog) — Notion CMS 기반 독서 기록 쇼케이스
> 버전: ROADMAP v2 (Phase 6 이후)

---

## 전체 일정 요약

| Phase | 단계명                                | 예상 소요 시간 | 상태 |
| :---: | :------------------------------------ | :------------: | :--: |
|   0   | 사전 준비                             |      완료      |  ✅  |
|   1   | 프로젝트 골격 (Notion 연동)           |      완료      |  ✅  |
|   2   | 공통 모듈 (데이터 레이어)             |      완료      |  ✅  |
|   3   | 핵심 기능 (책 카드/통계/필터)         |      완료      |  ✅  |
|   4   | 추가 기능 (상세/검색/무한스크롤/정렬) |      완료      |  ✅  |
|   5   | 최적화 및 배포                        |      완료      |  ✅  |
|   6   | v2 기반 확장 (타입/유틸 + 리스트 뷰)  |      완료      |  ✅  |
|   7   | v2 UX 강화 (통계 차트 + 랜덤 추천)    |      완료      |  ✅  |
|   8   | v2 검색 경험 (검색어 하이라이트)      |      완료      |  ✅  |
|   9   | v2 공유 기능 (Web Share + 클립보드)   |      완료      |  ✅  |
|  10   | v2 통합 QA 및 품질 게이트             |     0.5일      |  ⚪  |

**v2 추가 예상 소요 시간**: 약 3-4일

### 상태 범례

| 아이콘 | 의미      |
| :----: | :-------- |
|   ✅   | 완료      |
|   🟢   | 진행 중   |
|   🟡   | 부분 완료 |
|   ⚪   | 대기      |
|   🔴   | 블로킹    |

---

## v1 완료 요약 (Phase 0 ~ 5)

> v1 (2026-04-17 기준)은 이미 전량 완료되어 프로덕션 배포 상태입니다. 세부 기록은 Git 히스토리와 이전 ROADMAP 버전을 참고하세요.

| Phase | 핵심 산출물                                                          | 상태 |
| :---: | :------------------------------------------------------------------- | :--: |
|   0   | PRD v1, Next.js 15.5.3 스타터, Tailwind v4 + shadcn/ui 초기화        |  ✅  |
|   1   | Notion Integration, 환경변수, `notion.ts`, `types/book.ts`           |  ✅  |
|   2   | `getBooks()`, `calculateStats()`, `book-helpers.ts`, 이미지 도메인   |  ✅  |
|   3   | `BookCard`, `StatsBanner`, `FilterTabs`, Skeleton, `/books` 페이지   |  ✅  |
|   4   | `/books/[id]`, 검색(300ms 디바운스), 무한 스크롤, 정렬, ISR 60초     |  ✅  |
|   5   | 성능 최적화, `sitemap.ts`/`robots.ts`, 접근성, Vercel 배포, 모니터링 |  ✅  |

---

## Phase 6: v2 기반 확장 (타입/유틸 + 리스트 뷰)

### Phase 6 · 왜 이 순서인가?

v2 전체가 의존하는 **타입 확장(`BookStats.ratingDistribution`)** 과 **리스트 뷰 컴포넌트 골격**을 가장 먼저 구축합니다. F001(리스트 뷰)이 F004(하이라이트)의 선행 조건이므로, 리스트 아이템 컴포넌트가 존재해야 이후 Phase 8에서 `searchQuery` prop을 주입할 수 있습니다. 타입 변경은 컴파일 전파 범위가 넓어 가장 먼저 안정화해야 합니다.

> 도메인 타입 → 리스트 뷰 컴포넌트 → 뷰 모드 상태 관리 → URL 동기화 순서로 "내부에서 외부로" 확장합니다.

### Phase 6 · 세부 작업

- [x] **6-1. `BookStats` 타입에 `ratingDistribution` 필드 추가** — 🕐 20분
  - `src/types/book.ts` 또는 `src/lib/book-stats.ts`에서 `BookStats` 확장
  - `ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>` 필드 추가
  - 타입 변경으로 인한 빌드 오류 전수 확인

- [x] **6-2. `calculateStats()` 별점 집계 로직 추가** — 🕐 30분
  - `src/lib/book-stats.ts`에서 별점별 권수 집계 로직 구현
  - 별점이 `null` 또는 0인 경우 집계 제외 규칙 정의
  - 유닛 테스트 수준의 수동 검증 (콘솔 출력 혹은 dev 페이지 활용)

- [x] **6-3. `BookListItem` 컴포넌트 구현** — 🕐 2시간
  - `src/components/books/book-list-item.tsx` 신규 생성
  - Props: `book: Book` (F004에서 `searchQuery?: string` 추가 예정)
  - 가로 레이아웃: 좌측 소형 썸네일(`next/image`, 3:4 비율, 가로 96~120px), 우측 정보 영역
  - 표시 필드: 제목, 저자, 별점(Lucide `Star`), 상태 Badge, 한줄요약(`line-clamp-1~2`)
  - 모바일(< sm) 반응형: 그리드로 자동 폴백 또는 축소 리스트 레이아웃
  - 다크모드 대응 및 호버/포커스 스타일

- [x] **6-4. `BookListItemSkeleton` 구현** — 🕐 30분
  - `src/components/books/book-list-item-skeleton.tsx` 신규 생성
  - `BookListItem`과 동일한 레이아웃의 Skeleton (리스트 모드 로딩용, 기본 9개 표시)

- [x] **6-5. `BookList` 뷰 모드 토글 통합** — 🕐 2시간
  - `src/components/books/book-list.tsx` 수정
  - URL `?view=grid|list` 파싱 및 `useRouter` 기반 동기화 (기본값 `grid`)
  - 컨트롤 영역에 토글 버튼(`LayoutGrid`, `List` Lucide 아이콘) 배치
  - 뷰 모드에 따라 그리드(`BookCard`) ↔ 리스트(`BookListItem`) 렌더링 분기
  - 로딩 상태도 뷰 모드에 맞춰 `BookCardSkeleton` 또는 `BookListItemSkeleton` 표시
  - 무한 스크롤 로직이 두 모드에서 모두 정상 동작하는지 검증

- [x] **6-6. 키보드/접근성 검증** — 🕐 20분
  - 토글 버튼에 `aria-label`, `aria-pressed` 속성 부여
  - `Tab` 포커스 순서 및 Enter/Space 키 전환 동작 확인

### Phase 6 · 완료 기준

- [x] `BookStats.ratingDistribution`이 `1 ~ 5` 모든 키를 포함하고 실제 데이터로 정확히 집계됨
- [x] `/books?view=list` 진입 시 리스트 레이아웃으로 렌더링됨
- [x] `/books?view=grid` 또는 파라미터 없음 시 기존 그리드로 렌더링됨
- [x] 뷰 모드 전환 시 URL이 즉시 업데이트되고 새로고침해도 모드가 유지됨
- [x] 로딩 Skeleton이 현재 뷰 모드에 맞게 표시됨
- [x] `npm run check-all` 및 `npm run build` 통과

---

## Phase 7: v2 UX 강화 (통계 차트 + 랜덤 추천)

### Phase 7 · 왜 이 순서인가?

F002(별점 분포 차트)와 F003(랜덤 추천)은 **서로 독립적이며 Phase 6에서 확장한 타입과 리스트 컨테이너를 그대로 활용**합니다. 두 기능 모두 신규 파일 없이 기존 컴포넌트 확장만으로 완성되므로 하나의 Phase로 묶어 병렬 또는 연속 작업이 가능합니다. 데이터 시각화(F002)는 통계 배너의 시각적 완성도를 높이고, 랜덤 추천(F003)은 기존 필터 결과 배열을 재활용하므로 로직 리스크가 낮습니다.

> 통계 시각화(표시) → 랜덤 추천(인터랙션) 순서. 둘 다 독립이므로 편한 순서로 진행 가능합니다.

### Phase 7 · 세부 작업

- [x] **7-1. 별점 분포 차트 UI 구현 (F002)** — 🕐 1.5시간
  - `src/components/books/stats-banner.tsx` 수정
  - 배너 하단에 1점 ~ 5점 영역 추가 (5행 레이아웃 혹은 역순 5~1)
  - 각 행 구성: 별 아이콘 + 별점 숫자 + 권수 레이블 + 비율 `Progress` 바
  - 전체 평점 보유 권수 대비 비율(%)로 Progress 너비 계산 (0권이면 0% 표시)
  - shadcn `Progress` 재사용, 다크모드 색상 대응
  - 평점 데이터가 전혀 없을 때의 빈 상태 처리 (예: "별점이 등록된 책이 없습니다")

- [x] **7-2. `StatsBanner` 접근성 보강** — 🕐 15분
  - Progress 바에 `aria-label` 부여 (예: "별점 4점 차지 비율 30%")
  - 스크린리더를 위한 `role="img"` 또는 대체 텍스트 구조

- [x] **7-3. 랜덤 추천 버튼 구현 (F003)** — 🕐 1-1.5시간
  - `src/components/books/book-list.tsx`에 버튼 배치
  - `Shuffle` Lucide 아이콘 + "랜덤 추천" 라벨
  - 클릭 핸들러: 현재 필터·검색·정렬이 적용된 `filteredBooks` 배열에서 `Math.floor(Math.random() * length)` 선택
  - `next/navigation`의 `useRouter`로 `/books/${book.id}` 이동
  - 결과 0권이면 `disabled` 상태로 전환
  - 이동 중 짧은 로딩 스피너 표시 (`Loader2` 회전, 약 200~400ms)

- [x] **7-4. 버튼 배치/반응형 조정** — 🕐 20분
  - 컨트롤 영역: 검색 + 정렬 + 뷰 토글 + 랜덤 추천이 한 줄에서 깔끔하게 정렬되도록 `flex-wrap` 및 간격 조정
  - 모바일에서 겹침 없이 줄 바꿈되도록 검증

### Phase 7 · 완료 기준

- [x] 통계 배너에 1~5점 별점 분포가 실제 데이터와 일치하게 시각화됨
- [x] 평점이 있는 책이 0권일 때 빈 상태가 자연스럽게 표시됨
- [x] 랜덤 추천 버튼 클릭 시 현재 필터 결과 중 1권의 상세 페이지로 이동함
- [x] 필터 결과가 0권이면 버튼이 비활성화되고 클릭 불가
- [x] 반복 클릭 시 동일 책이 연속 선택될 수 있음을 사용자가 인지 가능 (결정적이지 않음을 UX로 수용)
- [x] 다크모드/모바일에서 레이아웃 깨짐 없음
- [x] `npm run check-all` 및 `npm run build` 통과

---

## Phase 8: v2 검색 경험 (검색어 하이라이트)

### Phase 8 · 왜 이 순서인가?

F004(검색어 하이라이트)는 **F001(리스트 뷰 컴포넌트)이 존재해야 적용할 수 있습니다**. Phase 6에서 `BookListItem`이 완성되었으므로 이제 그리드/리스트 두 컴포넌트 모두에 동일한 하이라이트 로직을 일관되게 주입할 수 있습니다. 헬퍼 함수를 먼저 구현한 뒤 두 컴포넌트에 동일한 방식으로 적용하여 중복을 방지합니다.

> `highlight.ts` 헬퍼 → `BookCard` 적용 → `BookListItem` 적용 → 검색 바에서 `searchQuery` 전달까지 데이터 흐름 순서를 따릅니다.

### Phase 8 · 세부 작업

- [x] **8-1. `highlightText` 헬퍼 함수 구현** — 🕐 1시간
  - `src/lib/highlight.ts` 신규 생성
  - 시그니처: `highlightText(text: string, query: string): React.ReactNode`
  - `query`가 빈 문자열/공백/undefined이면 원본 문자열 그대로 반환
  - 대소문자 무시 매칭 (`toLowerCase()` 비교)
  - 특수문자 escape 처리 (정규식 사용 시 `$&` 치환 등)
  - 일치 구간을 `<mark>` 태그 또는 `<span>`으로 감싸 반환
  - Tailwind 스타일: `bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5`

- [x] **8-2. `BookCard`에 `searchQuery` prop 추가 및 적용** — 🕐 30분
  - `src/components/books/book-card.tsx` 수정
  - Props에 `searchQuery?: string` 선택적 필드 추가
  - 제목과 저자 렌더링 시 `highlightText(title, searchQuery)` 적용
  - `searchQuery` 미지정 시 기존 렌더링 유지 (하위 호환 검증)

- [x] **8-3. `BookListItem`에 `searchQuery` prop 추가 및 적용** — 🕐 20분
  - `src/components/books/book-list-item.tsx` 수정
  - `BookCard`와 동일한 시그니처/동작으로 일관성 유지

- [x] **8-4. `BookList`에서 현재 검색어 전파** — 🕐 30분
  - `src/components/books/book-list.tsx`에서 URL `?q=` 값을 읽어 각 카드/아이템에 `searchQuery` prop으로 주입
  - 검색어 지우기(`clear`) 시 하이라이트도 즉시 제거되는지 확인

- [x] **8-5. XSS/이스케이프 검증** — 🕐 20분
  - `<script>`, `<img>` 등 HTML 특수문자가 검색어에 입력되어도 React가 자동 이스케이프하는지 확인 (`dangerouslySetInnerHTML` 절대 사용 금지)
  - 정규식 메타 문자(`.`, `*`, `+`, `?` 등) 입력 시에도 안전하게 동작

### Phase 8 · 완료 기준

- [x] 검색어 입력 시 그리드/리스트 두 모드 모두에서 제목·저자 내 일치 구간이 하이라이트됨
- [x] 검색어가 없을 때는 기존과 동일한 렌더링 유지
- [x] 특수문자(`.`, `(`, `[` 등) 검색 시 정규식 오류 없음
- [x] XSS 취약점이 없고 React의 기본 이스케이프가 유지됨
- [x] 다크모드에서 하이라이트 색상 가독성 확보
- [x] `npm run check-all` 및 `npm run build` 통과

---

## Phase 9: v2 공유 기능 (Web Share + 클립보드)

### Phase 9 · 왜 이 순서인가?

F005(공유 버튼)는 **상세 페이지 전용 기능으로 메인 목록의 기능 확장과 완전히 독립적**입니다. 메인 목록(Phase 6~8)이 안정화된 후에 착수하면 테스트 범위가 깔끔하게 분리됩니다. Web Share API는 브라우저 지원이 갈리므로 기능 감지(feature detection) 기반의 폴백 설계가 핵심이며, 이 단계에서 집중해서 검증합니다.

> 버튼 컴포넌트 → 상세 페이지 통합 → 피드백(토스트/아이콘 변경) → 브라우저별 폴백 순서로 안전하게 확장합니다.

### Phase 9 · 세부 작업

- [x] **9-1. `ShareButton` 컴포넌트 구현** — 🕐 1.5시간
  - `src/components/books/share-button.tsx` 신규 생성 (`'use client'`)
  - Props: `title: string`, `url: string`
  - `Share2` Lucide 아이콘 버튼
  - `navigator.share` 존재 여부 감지 (`typeof navigator !== 'undefined' && 'share' in navigator`)
  - 지원 시: `navigator.share({ title: '북로그 - ${title}', url })` 호출
  - 미지원 시: `navigator.clipboard.writeText(url)`로 폴백
  - 복사 성공 시 2초 동안 `Check` 아이콘으로 전환 후 원복

- [x] **9-2. 상세 페이지에 버튼 통합** — 🕐 30분
  - `src/app/books/[id]/page.tsx`에서 상단(제목 옆 또는 메타 영역)에 `<ShareButton>` 배치
  - 절대 URL 계산: `process.env.NEXT_PUBLIC_SITE_URL` 또는 `headers()` 기반 (정책에 맞게 선택)
  - 서버 컴포넌트에서 클라이언트 컴포넌트로 안전하게 props 전달

- [x] **9-3. 오류 처리 및 사용자 피드백** — 🕐 30분
  - `navigator.share` 거부(사용자 취소, `AbortError`)는 silent 처리
  - 클립보드 권한 거부 혹은 실패 시 토스트/얼럿으로 알림
  - shadcn `sonner` 또는 기존 토스트 시스템 활용 (없으면 간단한 inline alert로 대체)

- [ ] **9-4. 크로스 브라우저/디바이스 수동 테스트** — 🕐 20분
  - iOS Safari, Android Chrome: 네이티브 공유 시트 동작 확인
  - 데스크톱 Chrome/Firefox/Safari: 클립보드 폴백 및 피드백 확인
  - HTTPS 환경에서만 클립보드 API가 동작하는 점 확인 (개발 시 `localhost`는 예외)

### Phase 9 · 완료 기준

- [x] 모바일에서 상세 페이지 공유 버튼 클릭 시 네이티브 공유 시트가 뜸
- [x] 데스크톱에서 클릭 시 URL이 클립보드에 복사되고 2초간 `Check` 아이콘으로 피드백
- [x] 공유 취소(모바일) 시 에러 메시지 없이 조용히 종료
- [x] 복사 실패 시 사용자에게 명확한 알림이 표시됨
- [x] 서버 컴포넌트 → 클라이언트 컴포넌트 경계가 깔끔하게 유지됨
- [x] `npm run check-all` 및 `npm run build` 통과

---

## Phase 10: v2 통합 QA 및 품질 게이트

### Phase 10 · 왜 이 순서인가?

모든 신규 기능(Phase 6~9)을 **통합 시점에서 회귀 테스트**합니다. 개별 Phase는 기능 완성을 증명했지만, 기능 간 상호작용(예: 리스트 뷰 + 검색어 하이라이트 + 랜덤 추천)을 전체 시나리오로 검증해야 프로덕션 배포 신뢰도가 확보됩니다. 접근성/성능 리그레션도 이 단계에서 확인해 v1의 품질 수준이 유지됨을 보장합니다.

### Phase 10 · 세부 작업

- [ ] **10-1. 통합 시나리오 QA** — 🕐 1-1.5시간
  - 그리드 + 검색 + 하이라이트 동작 검증
  - 리스트 + 검색 + 하이라이트 동작 검증
  - 필터 + 정렬 + 랜덤 추천 연계 시 올바른 범위에서 책 선택되는지 검증
  - 뷰 모드 전환 중 스크롤 위치/무한 스크롤 상태 재검토

- [ ] **10-2. URL 파라미터 조합 시나리오** — 🕐 30분
  - `?status=reading&q=코드&sort=rating&view=list` 조합 시 정상 렌더링
  - 새로고침 후에도 모든 상태가 복원되는지 확인
  - 브라우저 뒤로가기/앞으로가기 동작 검증

- [ ] **10-3. 접근성 리그레션 검사** — 🕐 30분
  - 신규 버튼(뷰 토글, 랜덤 추천, 공유)의 `aria-*` 속성 점검
  - 키보드만으로 전체 플로우 조작 가능 여부 확인
  - Lighthouse Accessibility 95+ 유지 확인

- [ ] **10-4. 성능 리그레션 검사** — 🕐 20분
  - `@next/bundle-analyzer`로 번들 크기 비교 (v1 대비 +20% 이내)
  - Lighthouse Performance 90+ 유지 확인
  - LCP/CLS 수치가 v1 대비 악화되지 않았는지 확인

- [ ] **10-5. 프로덕션 배포 및 스모크 테스트** — 🕐 30분
  - Vercel 프리뷰 배포 → 주요 경로 스모크 테스트
  - 프로덕션 승격 후 실제 Notion 데이터로 전체 기능 확인
  - README/CHANGELOG에 v2 기능 요약 업데이트

### Phase 10 · 완료 기준

- [ ] 모든 v2 기능이 통합 환경에서 의도대로 동작
- [ ] Lighthouse Performance/Accessibility/Best Practices/SEO 모두 90+ 유지
- [ ] 번들 크기 증가율이 기준(+20%) 이내
- [ ] 프로덕션 URL에서 모든 신규 기능 동작 확인
- [ ] `npm run check-all` 및 `npm run build` 최종 통과

---

## v2 최종 목표 아키텍처

```text
src/
├── app/
│   ├── books/
│   │   ├── page.tsx                     # 메인 페이지 (서버)
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [id]/
│   │       └── page.tsx                 # 상세 페이지 (v2: ShareButton 통합)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── books/
│   │   ├── book-card.tsx                # v2: searchQuery prop
│   │   ├── book-card-skeleton.tsx
│   │   ├── book-list-item.tsx           # v2 신규 (F001)
│   │   ├── book-list-item-skeleton.tsx  # v2 신규 (F001)
│   │   ├── book-list.tsx                # v2: 뷰 토글 + 랜덤 추천 + 검색어 전파
│   │   ├── filter-tabs.tsx
│   │   ├── share-button.tsx             # v2 신규 (F005)
│   │   └── stats-banner.tsx             # v2: 별점 분포 차트
│   ├── layout/
│   ├── navigation/
│   └── ui/
├── lib/
│   ├── book-helpers.ts
│   ├── book-stats.ts                    # v2: ratingDistribution
│   ├── books.ts
│   ├── env.ts
│   ├── highlight.ts                     # v2 신규 (F004)
│   └── notion.ts
└── types/
    └── book.ts                          # v2: BookStats 확장
```

---

## 마일스톤

| 마일스톤                  | 도달 조건                                 | 예상 시점 |
| :------------------------ | :---------------------------------------- | :-------: |
| **M5: v2 기반 완성**      | Phase 6 완료, 타입 확장 + 리스트 뷰 가용  |    D+1    |
| **M6: v2 UX 강화 완료**   | Phase 7~8 완료, 통계/랜덤/하이라이트 동작 |    D+2    |
| **M7: v2 공유 기능 완성** | Phase 9 완료, 상세 페이지 공유 정상 동작  |    D+3    |
| **M8: v2 프로덕션 런칭**  | Phase 10 완료, 프로덕션 배포 및 QA 완료   |    D+4    |

---

## 품질 게이트

모든 Phase 종료 시 반드시 통과해야 합니다.

```bash
npm run check-all   # Lint + Type check + Format 검증
npm run build       # 프로덕션 빌드 성공
```

- [ ] TypeScript `strict` 모드 에러 0건
- [ ] ESLint warning/error 0건
- [ ] Prettier 포맷 일치
- [ ] 빌드 산출물 크기 급증 없음 (v1 대비 +20% 이내)
- [ ] Lighthouse 4개 항목 모두 90+ 유지

---

> Tip: 각 Phase 완료 후 체크박스를 업데이트하고 `git commit -m "docs: Phase N 완료"` 형태로 커밋하세요. `/docs:update-roadmap` 스킬로 자동화할 수 있습니다.
