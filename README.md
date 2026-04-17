# 북로그 (BookLog)

> Notion을 CMS로 활용한 독서 기록 쇼케이스

Notion 데이터베이스에 책을 등록하면 웹에서 자동으로 시각화되는 독서 기록 앱입니다. 비개발자도 Notion에서 책을 추가·수정·삭제할 수 있습니다.

## 주요 기능

- **독서 목록 그리드** — 책 표지·제목·저자·별점·상태를 카드 레이아웃으로 표시
- **상태별 필터** — 읽는중 / 완독 / 읽을예정 / 전체 탭 필터
- **검색 및 정렬** — 제목·저자 검색, 별점순·가나다순 정렬
- **독서 통계** — 완독 권수, 읽는중, 평균 별점 요약
- **책 상세 페이지** — 커버·정보·한줄요약 상세 표시
- **다크모드** — 시스템 테마 자동 감지

## 기술 스택

| 구분      | 기술                            |
| --------- | ------------------------------- |
| Framework | Next.js 15.5.3 (App Router)     |
| Runtime   | React 19, TypeScript 5          |
| CMS       | Notion API (`@notionhq/client`) |
| Styling   | Tailwind CSS v4, shadcn/ui      |
| 배포      | Vercel                          |

## 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd CMS-WEB
npm install
```

### 2. Notion 설정

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 새 Integration 생성
2. Notion에서 독서 기록 데이터베이스 생성 후 Integration 연결
3. 데이터베이스 속성 구성:

| 속성명     | 타입          | 설명                     |
| ---------- | ------------- | ------------------------ |
| `제목`     | Title         | 책 제목 (필수)           |
| `저자`     | Text          | 저자명                   |
| `별점`     | Select        | ⭐1 ~ ⭐5                |
| `상태`     | Select        | 읽는중 / 완독 / 읽을예정 |
| `한줄요약` | Text          | 핵심 소감                |
| `커버`     | Files & media | 책 표지 이미지           |

### 3. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 발급받은 키 입력:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

## 스크립트

```bash
npm run dev        # 개발 서버 (Turbopack)
npm run build      # 프로덕션 빌드
npm run check-all  # Lint + 타입 체크 + 포맷 검증
```

## 배포

Vercel에 배포 시 환경변수 `NOTION_API_KEY`, `NOTION_DATABASE_ID`를 프로젝트 설정에서 추가하세요.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
