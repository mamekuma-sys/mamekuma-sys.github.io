# Medical AI Index 사이트 설계

- 설계 승인일: 2026-07-30
- 대상 주소: `https://mamekuma-sys.github.io/`
- 대상 저장소: `mamekuma-sys/mamekuma-sys.github.io`
- 작성자: `mamekuma-sys`
- 콘텐츠 설계: `docs/superpowers/specs/2026-07-30-medical-ai-blog-series-design.md`

## 1. 목적

`Medical AI Index`는 의료 AI의 기반 모델, 최근 연구, 임상 근거, 규제와 미래 방향을 다루는 독립 기술 블로그다. 의료 AI를 처음 접하는 독자부터 의료인, 연구자·개발자, 산업 실무자와 의사결정자까지 각자 필요한 깊이로 읽을 수 있어야 한다.

사이트의 핵심 문장은 다음과 같다.

> 의료 AI를 근거부터 읽는 기술 블로그

사이트는 다음 가치를 우선한다.

1. 개발자 기술 블로그다운 명확한 정보 구조
2. 장문 의료 AI 콘텐츠의 가독성
3. 모델의 최신성과 임상적 중요도를 혼동하지 않는 표현
4. 기술 성능·임상 근거·현장 준비도의 분리
5. 빠른 정적 페이지와 검색 친화적인 마크업
6. 모바일·키보드·보조기술 사용자를 포함한 접근성

## 2. 브랜드

- 화면 로고: `<medical-ai/>`
- 정식 사이트명: `Medical AI Index`
- 작성자 표기: `by mamekuma-sys`
- 기본 언어: 한국어
- 용어 표기: 모델명, 논문명, 전문용어는 영문 병기
- 성격: 독립 전문 매체와 개인 연구 블로그의 혼합형

## 3. 참고 방향과 독창성 원칙

다음 공개 사이트에서 정보 구조와 분위기만 참고한다.

- `seoa.dev`: 모노스페이스 타이포그래피와 개인 개발자 작업공간의 인상
- `toss.tech`: 대표 글, 최신 글 목록, 인기 글의 읽기 흐름
- `tech.channel.io/kr`: 고정 카테고리 탐색과 주제별 아티클 묶음

로고, 이미지, 문구, 세부 레이아웃과 브랜드 표현은 복제하지 않는다. 의료 AI라는 주제에 맞는 파일 탐색기, 명령 프롬프트, 근거 상태와 모델 계보를 새로운 시각 언어로 사용한다.

## 4. 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- MDX
- 정적 내보내기: Next.js `output: "export"`
- GitHub Actions
- GitHub Pages
- Giscus

Next.js와 모든 주요 패키지는 구현 시점의 최신 안정 버전을 공식 문서에서 확인한 뒤 고정한다. 실험 기능은 필수 요구를 해결하지 않는 한 사용하지 않는다.

GitHub Pages는 정적 호스팅이므로 다음 기능은 사용하지 않는다.

- 서버 사이드 렌더링
- API Routes와 Route Handlers의 런타임 API
- Server Actions
- Incremental Static Regeneration
- 기본 서버 기반 이미지 최적화
- 런타임 데이터베이스 또는 인증 시스템

모든 글과 경로는 빌드 시점에 생성한다. 브라우저 상태가 필요한 검색, 필터, 테마 전환과 Giscus만 클라이언트에서 실행한다.

## 5. 프로젝트 구조

```text
.
├─ .github/
│  └─ workflows/
│     ├─ ci.yml
│     └─ deploy-pages.yml
├─ docs/
│  ├─ reviews/
│  │  ├─ ux-validation.md
│  │  └─ visual-qa.md
│  └─ superpowers/
│     └─ specs/
├─ public/
│  ├─ images/
│  │  ├─ covers/
│  │  ├─ og/
│  │  └─ generated/
│  ├─ icons/
│  └─ search/
├─ scripts/
│  ├─ build-search-index.ts
│  ├─ optimize-images.ts
│  └─ validate-content.ts
├─ src/
│  ├─ app/
│  │  ├─ articles/
│  │  ├─ topics/
│  │  ├─ series/
│  │  ├─ timeline/
│  │  ├─ evidence/
│  │  ├─ about/
│  │  ├─ not-found.tsx
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  ├─ content/
│  │  └─ articles/
│  ├─ features/
│  │  ├─ comments/
│  │  ├─ search/
│  │  ├─ theme/
│  │  └─ topic-filter/
│  ├─ lib/
│  ├─ styles/
│  └─ types/
├─ mdx-components.tsx
├─ next.config.ts
├─ postcss.config.mjs
├─ package.json
└─ tsconfig.json
```

구현 과정에서 디렉터리 이름은 Next.js 공식 제약에 맞게 조정할 수 있지만, 책임 경계는 유지한다.

## 6. 라우트

### `/`

화이트 `Developer Workspace` 메인 페이지다. 사이트의 목적, 대표 글, 최근 글, 주요 카테고리와 검색 진입점을 제공한다.

### `/articles`

전체 글을 제목·요약·본문·모델명·태그로 검색하고 주제, 근거 상태와 시리즈로 필터링한다.

### `/topics/[topic]`

다음 주제별 글을 보여준다.

- 의료영상
- EHR·의료 시계열
- 임상 NLP·의료 LLM
- 멀티모달 의료 AI
- 임상 근거·현장 도입
- 미래 방향

### `/series/[slug]`

메인 종합 글과 심층 글 6편의 순서, 진행 상태와 이전·다음 이동을 제공한다.

### `/articles/[slug]`

MDX 글, 목차, 읽기 진행률, 근거 배지, 참고문헌, 관련 글, 시리즈 이동과 Giscus 댓글을 제공한다.

### `/timeline`

기반 모델, 전환기 모델과 최전선 모델의 기술 계보를 보여준다.

### `/evidence`

기술 성능, 임상 근거와 현장 준비도의 평가 기준과 용어를 설명한다.

### `/about`

사이트 목적, 작성자, 출처 정책, 업데이트 정책과 면책 문구를 제공한다.

### 향후 `/daily`

`/daily`는 평일 단위의 최신 연구·모델 분석을 위한 후속 콘텐츠 영역이다. 초기 스캐폴딩에서는 경로, 자동화와 게시물을 만들지 않으며 별도 설계·구현 계획에서 추가한다.

- Daily 글은 짧고 시의성 있는 분석이며, 장문 심층 글과 시리즈를 대체하지 않는다.
- 관련 심층 글과 근거 설명으로 연결하고, 중요한 변화가 확인되면 심층 글의 업데이트 후보를 제안한다.
- 심층 글과 같은 출처 상태, 기술 성능·임상 근거·현장 준비도 구분, 조사 기준일과 검토일 정책을 사용한다.
- Scheduled Automation이 만드는 결과는 항상 `draft: true`인 Draft PR이며, 독립적인 사실·편집 검토 전에는 공개 산출물에 포함하지 않는다.

### 자동 산출물

- RSS
- 사이트맵
- `robots.txt`
- 404 페이지
- 글별 Open Graph 메타데이터

## 7. 콘텐츠 모델

모든 MDX 글은 검증 가능한 메타데이터를 가진다.

```yaml
title: "U-Net은 왜 여전히 중요한가"
description: "의료영상 분할의 기반 구조에서 파운데이션 모델까지의 계보"
slug: "why-unet-still-matters"
publishedAt: "2026-08-01"
reviewedAt: "2026-08-01"
researchCutoff: "2026-07-30"
author: "mamekuma-sys"
topics:
  - "medical-imaging"
tags:
  - "U-Net"
  - "segmentation"
series: "medical-ai-2026"
seriesOrder: 1
modelStage:
  - "foundation"
evidence:
  technical: "established"
  clinical: "mixed"
  deployment: "selective"
sourceStates:
  - "peer-reviewed"
hasKoreaContext: true
coverImage: "/images/covers/why-unet-still-matters.webp"
coverAlt: "의료영상 단면과 분할 영역을 추상적으로 표현한 과학 일러스트"
featured: true
draft: true
```

실제 게시 전 날짜와 평가 값은 조사 결과로 대체한다. 위 예시는 스키마 형태를 설명하기 위한 것이며 사실 주장으로 사용하지 않는다. 스캐폴딩과 사실 확인 전 콘텐츠는 반드시 `draft: true`이며, 조사·편집 검토가 끝난 게시물만 `draft: false`로 전환한다.

메타데이터는 TypeScript 스키마로 검증한다. 다음 문제가 있으면 빌드를 실패시킨다.

- 필수 값 누락
- 허용되지 않은 주제·근거 상태
- 허용되지 않은 출처 상태: `peer-reviewed`, `preprint`, `official`, `company`, `independent-unverified`만 허용
- 잘못된 날짜 순서
- 중복 slug
- 존재하지 않는 이미지
- 이미지 대체 텍스트 누락
- 존재하지 않는 시리즈 또는 잘못된 순서

읽기 시간과 목차는 본문에서 자동 생성한다.

## 8. 데이터 흐름

```text
MDX 원본
  → 메타데이터·내용 검증
  → 글별 정적 경로 생성
  → 검색 인덱스 생성
  → 메인·주제·시리즈·관련 글 구성
  → RSS·사이트맵·Open Graph 정보 생성
  → Next.js 정적 내보내기
  → GitHub Pages 배포
```

하나의 메타데이터 원본을 카드, 검색 결과, 관련 글, RSS와 Open Graph 정보에 공통으로 사용한다. 같은 정보를 여러 파일에 중복 작성하지 않는다.

검색은 외부 서비스 없이 빌드 시점에 정적 JSON 인덱스를 만든다. 검색 UI가 필요한 인덱스 조각만 브라우저에 불러온다. 검색 결과가 없으면 추천 주제와 전체 글 이동을 제공한다.

## 9. 디자인 시스템

### 기본 시각 방향

- 이름: `White Developer Workspace`
- 기본 배경: 흰색
- 보조 배경: 옅은 회색
- 주요 글자색: 높은 대비의 짙은 네이비
- 강조색: 청록
- 의미 색상: 경고·사전논문·근거 부족 상태에 제한적으로 사용
- 제목·본문: Pretendard
- 코드·경로·메타데이터: JetBrains Mono

색상은 의미를 전달하는 유일한 수단으로 사용하지 않는다. 모든 상태는 텍스트와 형태로도 구분한다.

### 메인 페이지

- 상단에 `<medical-ai/>`, 주요 이동, GitHub 링크
- 데스크톱 왼쪽에 파일 탐색기형 주제 탐색
- 모바일에서는 파일 탐색기를 접이식 메뉴로 전환
- 명령 프롬프트형 한 줄로 사이트 목적을 소개
- 큰 핵심 문장과 짧은 설명
- 평가 스키마를 보여주는 코드 패널
- 최신 글을 `Latest commits / articles`로 표현
- 대표 글과 카테고리는 콘텐츠 우선순위에 따라 배치

### 글 상세 페이지

- 본문 폭을 제한해 장문 가독성 확보
- 데스크톱 보조 영역에 목차와 근거 상태
- 모바일 목차는 접이식
- 제목 아래 조사 기준일, 마지막 검토일과 읽기 시간
- 근거 배지는 본문보다 눈에 띄지 않되 쉽게 찾을 수 있는 위치
- 참고문헌은 문장 가까운 인용과 글 끝의 전체 목록을 함께 제공

### 테마

- 저장된 사용자 선택이 있으면 그 값을 가장 먼저 적용
- 저장된 선택이 없으면 첫 방문에 시스템 설정을 반영
- 시스템 설정을 확인할 수 없으면 라이트를 기본값으로 적용
- 공식 스크린샷과 기본 디자인 검수는 라이트 테마를 기준으로 수행
- 수동 라이트·다크 전환 제공
- 사용자의 선택을 브라우저에 저장
- 테마 변경 전 초기 깜빡임을 방지

## 10. 주요 컴포넌트

- `SiteShell`
- `ExplorerNavigation`
- `CommandHero`
- `FeaturedArticle`
- `ArticleCard`
- `SearchDialog`
- `TopicFilter`
- `EvidenceBadge`
- `ModelGenealogyTimeline`
- `ComparisonTable`
- `ArticleTableOfContents`
- `ReadingProgress`
- `CitationList`
- `SeriesNavigation`
- `ThemeToggle`
- `GiscusComments`

각 컴포넌트는 하나의 명확한 역할을 갖는다. 브라우저 상태가 필요하지 않은 컴포넌트는 Client Component로 만들지 않는다.

## 11. 기능 범위

초기 버전에 다음 기능을 포함한다.

- 제목·본문·모델명·태그 전체 검색
- 주제·태그·근거 상태 필터
- 글 목차와 읽기 진행률
- 코드 블록 복사
- 근거 수준 배지
- 관련 글
- 시리즈 이전·다음 이동
- RSS와 사이트맵
- Open Graph 메타데이터
- 라이트·다크 테마
- Giscus 댓글
- 모바일 반응형
- 키보드 탐색과 접근성

초기 버전에서는 다음을 포함하지 않는다.

- 자체 회원가입·로그인
- 데이터베이스
- 웹 기반 CMS
- 뉴스레터 발송 시스템
- 서버 기반 검색
- 실시간 알림

글은 저장소의 MDX로 작성한다. 향후 필요하면 콘텐츠 모델을 유지한 채 CMS를 연결할 수 있으나 초기 구조에는 CMS 종속성을 추가하지 않는다.

## 12. 생성 이미지

`imagegen`으로 과학·의학 에디토리얼 일러스트를 제작한다.

### 초기 자산

- 메인 페이지 대표 이미지 1장
- 메인 종합 글 표지 1장
- 심층 글 6편 표지 6장
- 합계 8장

### 이미지 원칙

- 16:9 가로 원본
- 흰색·옅은 회색 기반
- 청록·블루 포인트
- 의료영상 단면, 분할 마스크, 생체신호와 AI 연결망을 추상적으로 표현
- 이미지 안에 제목, 모델명, 로고와 긴 문구를 생성하지 않음
- 실제 환자 또는 특정 의료기관으로 오인할 수 있는 요소를 사용하지 않음
- 진단 결과처럼 보이는 허위 수치나 임상 주장을 포함하지 않음
- 썸네일과 Open Graph 크롭을 고려한 안전 영역 확보

선정된 이미지는 프로젝트의 `public/images`에 저장한다. 프로젝트가 참조하는 자산을 사용자 전역 생성 폴더에만 두지 않는다. Open Graph 이미지는 원본에서 1200×630 비율로 파생하고, 썸네일은 목록 레이아웃에 맞게 파생한다.

## 13. 오류와 실패 처리

### 빌드 시점

- 잘못된 MDX와 메타데이터는 배포 전에 실패
- 누락된 이미지와 대체 텍스트는 실패
- 중복 slug와 깨진 내부 링크는 실패
- 정적 내보내기를 막는 서버 전용 API 사용은 실패

### 사용자 화면

- 검색 결과 없음: 추천 검색어, 주제 목록과 전체 글 링크 제공
- 잘못된 URL: 검색과 주요 글을 포함한 404 페이지
- 이미지 로드 실패: 레이아웃을 유지하고 설명 가능한 대체 콘텐츠 제공
- Giscus 로드 실패: GitHub Discussions로 이동하는 링크 제공
- JavaScript 비활성화: 글, 탐색과 기본 콘텐츠는 계속 읽을 수 있어야 함
- 다크 모드 저장 실패: 시스템 설정 또는 라이트 기본값으로 안전하게 복귀

## 14. UX 검증

실제 사람을 모집한 사용성 테스트로 표현하지 않고, 독자 유형별 시나리오 워크스루와 자동 검증으로 기록한다.

### 독자 시나리오

1. 비전공자가 첫 화면에서 사이트 목적과 대표 글을 이해한다.
2. 연구자가 `U-Net`을 검색해 글과 모델 계보를 찾는다.
3. 의료인이 임상 근거와 규제 상태를 구분한다.
4. 모바일 사용자가 목차·검색·카테고리·참고문헌을 이용한다.
5. 키보드 사용자가 검색, 메뉴, 글과 댓글 영역을 이동한다.

### 시각 검증

- 375px 모바일
- 768px 태블릿
- 1440px 데스크톱
- 라이트·다크 테마
- 긴 한국어 제목
- 긴 영문 모델명
- 이미지 있음·없음
- 검색 결과 있음·없음

스크린샷을 비교해 다음을 확인한다.

- 정보 위계
- 여백과 정렬
- 한영 혼용 줄바꿈
- 본문과 코드 가독성
- 고정 요소의 겹침
- 가로 스크롤과 레이아웃 이동

### 자동 검증

- TypeScript
- ESLint
- 단위 테스트
- 핵심 사용자 흐름 브라우저 테스트
- 자동 접근성 검사
- 내부·외부 링크 검사
- 프로덕션 빌드
- GitHub Pages 경로 검증
- Lighthouse 성능·접근성·SEO 90점 이상 목표

### 결과 문서

- `docs/reviews/ux-validation.md`
- `docs/reviews/visual-qa.md`

각 문서에는 실행일, 환경, 검사 항목, 결과, 증거와 남은 문제를 기록한다.

## 15. 접근성

- 시맨틱 HTML
- 건너뛰기 링크
- 키보드만으로 모든 핵심 기능 사용 가능
- 명확한 포커스 표시
- 색상 대비 검증
- 이미지 대체 텍스트
- 표의 제목과 헤더 연결
- 코드 블록의 접근 가능한 복사 버튼
- `prefers-reduced-motion` 존중
- 상태를 색상만으로 전달하지 않음
- 모바일 터치 영역 확보

## 16. 성능

- 정적 페이지를 기본으로 사용
- Client Component 범위 최소화
- 검색 인덱스 지연 로드
- 생성 이미지 WebP·AVIF 사전 변환
- 반응형 이미지 크기 제공
- 화면 밖 이미지 지연 로드
- 폰트 서브셋과 필요한 굵기만 사용
- 불필요한 UI 라이브러리와 애니메이션 라이브러리 제외
- 긴 글과 카드 목록의 레이아웃 이동 방지

## 17. 댓글과 외부 서비스

댓글은 Giscus와 GitHub Discussions를 사용한다.

- 전체 scaffold 검증 뒤 별도 cutover 계획에서 대체 공개 저장소의 Discussions 활성화
- Giscus 앱과 카테고리 설정
- 페이지 경로와 Discussion 매핑
- 댓글 스크립트 실패 시 Discussions 직접 링크 제공
- 테마 변경 시 Giscus 테마 동기화

별도 회원 정보와 댓글 데이터를 사이트에서 저장하지 않는다.

## 18. CI와 배포

### Pull Request 또는 로컬 검증

1. 의존성 설치
2. 콘텐츠 검증
3. 타입 검사
4. 린트
5. 단위·브라우저 테스트
6. 정적 내보내기
7. 링크 검사

### 배포

1. `main` 브랜치 반영
2. GitHub Actions가 검증과 빌드 수행
3. 정적 산출물을 GitHub Pages에 배포
4. 공개 주소 스모크 테스트

## 19. 기존 저장소 삭제와 전환

기존 원격 저장소 `mamekuma-sys/mamekuma-sys.github.io`는 사용자 승인 후 2026-07-30 삭제되었고, GitHub API `404`와 Git의 `Repository not found` 응답으로 부재를 확인했다. 같은 날 동일 이름의 새 공개 저장소를 만들고 설계·계획 baseline을 푸시했으며, 로컬 `main`은 `origin/main`을 추적한다.

현재 남은 전환 절차는 다음과 같다.

1. 별도 기능 브랜치와 격리 worktree에서 로컬 스캐폴딩과 구현
2. 각 Task의 Stage Quality Gate와 전체 UX·시각·접근성·정적 export 검증
3. 별도 계획에서 콘텐츠·이미지 연결
4. Pages 전환 직전에 계정, 저장소 이름, 공개 주소와 검증 결과를 읽기 전용으로 재확인
5. 검토된 변경만 `main`에 병합
6. 별도 cutover 계획과 사용자 확인 뒤 Actions, Pages, Discussions와 Giscus 설정
7. 실제 공개 주소 최종 스모크 테스트

GitHub Pages는 아직 활성화되지 않았고 배포도 발생하지 않았다. 스캐폴딩 계획은 저장소 삭제·재생성, Pages 설정, 배포 또는 `main` 직접 푸시를 수행하지 않는다.

## 20. 스캐폴딩 범위

설계 문서 검토가 끝난 뒤 다음을 스캐폴딩한다.

- Next.js App Router + React + TypeScript
- Tailwind CSS
- MDX
- 기본 디렉터리와 경로
- 콘텐츠 스키마
- 라이트·다크 테마 토큰
- 화이트 `Developer Workspace` 메인 화면 골격
- 글 목록·상세 페이지 골격
- 검색 인덱스 생성 골격
- 테스트와 검증 명령
- GitHub Actions 골격

사실 확인이 끝나지 않은 의료 AI 내용을 완성된 글처럼 게시하지 않는다. 스캐폴딩용 예시 콘텐츠는 명확하게 샘플로 표시하고, 배포 대상에서는 제외하거나 실제 조사 결과로 교체한다.

## 21. 구현 시 적용할 스킬과 검토

- `frontend-design`: 승인된 시각 방향을 실제 화면으로 정교하게 구현
- `vercel-react-best-practices`: React·Next.js 컴포넌트 구조와 성능 검토
- `imagegen`: 대표 이미지 8장 생성과 검수
- `superpowers:test-driven-development`: 기능 구현 전 테스트 작성
- `superpowers:verification-before-completion`: 완료 주장 전 전체 검증
- `superpowers:requesting-code-review`: 주요 구현 완료 후 코드 검토

구현 스킬은 이 설계 문서가 승인된 뒤 작성되는 구현 계획에 따라 사용한다.

## 22. 완료 기준

- 승인된 화이트 `Developer Workspace` 디자인이 데스크톱과 모바일에서 유지된다.
- Next.js 정적 내보내기가 성공한다.
- 모든 공개 경로가 GitHub Pages에서 직접 열리고 새로고침된다.
- 콘텐츠 스키마가 잘못된 글의 배포를 막는다.
- 검색·필터·목차·시리즈·테마·댓글이 정의된 방식으로 동작한다.
- 키보드 탐색과 접근성 검사가 통과한다.
- 생성 이미지 8장이 일관된 과학·의학 에디토리얼 스타일을 가진다.
- 중요한 이미지에 대체 텍스트가 있다.
- UX와 시각 검증 결과가 Markdown으로 기록된다.
- Lighthouse 성능·접근성·SEO 90점 이상을 목표로 하고, 미달 항목은 원인과 조치를 기록한다.
- 기존 원격 저장소 삭제와 대체 공개 저장소 생성은 완료됐으며, Pages 활성화와 배포는 별도 cutover 계획의 검증과 사용자 확인 전에는 실행되지 않는다.
- 공개 주소 `https://mamekuma-sys.github.io/`에서 최종 스모크 테스트를 통과한다.

## 23. 공식 기술 참고

- Next.js App Router: <https://nextjs.org/docs/app>
- Next.js 정적 내보내기: <https://nextjs.org/docs/pages/guides/static-exports>
- Next.js MDX: <https://nextjs.org/docs/app/guides/mdx>
- Tailwind CSS의 Next.js 설치: <https://tailwindcss.com/docs/installation/framework-guides/nextjs>
