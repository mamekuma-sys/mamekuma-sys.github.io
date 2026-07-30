# Medical AI Index 다음 세션 인계

## 현재 상태

- 의료 AI 콘텐츠 시리즈 설계 승인·커밋 완료
- 새 GitHub Pages 사이트 설계 승인·커밋 완료
- 승인된 시각 방향: 흰색 `Developer Workspace`
- 승인된 기술: Next.js App Router + React + TypeScript + Tailwind CSS + MDX
- 새 공개 저장소를 생성하고 로컬 `main`을 `origin/main`에 푸시함
- 사이트 코드는 아직 스캐폴딩하지 않음
- 기존 GitHub Pages 저장소는 사용자 승인 후 2026-07-30 삭제 완료
- 동일 이름의 새 저장소를 2026-07-30 다시 생성함
- GitHub Pages는 아직 설정·배포하지 않음

## 주요 커밋

- `9c98587` — 의료 AI 블로그 시리즈 설계
- `6272a8f` — 의료 AI 사이트 설계

인계 문서와 구현 계획은 설계 문서와 분리된 후속 커밋으로 관리한다.

## 반드시 읽을 문서

1. `AGENTS.md`
2. `docs/superpowers/specs/2026-07-30-medical-ai-site-design.md`
3. `docs/superpowers/specs/2026-07-30-medical-ai-blog-series-design.md`
4. `docs/superpowers/plans/2026-07-30-medical-ai-site-scaffold.md`

## 확정된 결정

- 브랜드
  - `<medical-ai/>`
  - `Medical AI Index`
  - `by mamekuma-sys`
  - “의료 AI를 근거부터 읽는 기술 블로그”
- 디자인
  - 흰색 기반
  - 왼쪽 파일 탐색기
  - 명령 프롬프트형 소개
  - 최신 글을 `Latest commits / articles`로 표현
  - Pretendard + JetBrains Mono
  - 청록 포인트
  - 선택형 다크 모드
- 기능
  - 검색과 주제·근거 필터
  - 목차와 읽기 진행률
  - 근거 배지
  - 시리즈 이동
  - RSS·사이트맵·Open Graph
  - Giscus 댓글
  - 접근성·모바일 대응
- 콘텐츠
  - 메인 종합 글 1편 + 심층 글 6편
  - 글로벌 동향 중심 + 한국 시사점
  - 의료영상, EHR·시계열, 의료 LLM, 멀티모달, 임상 도입, 미래 방향
  - 신약개발·오믹스·바이오인포매틱스 제외
- 이미지
  - Imagegen 과학·의학 에디토리얼 일러스트
  - 메인 1장 + 글 표지 7장 = 총 8장
  - 이미지 안에 제목·모델명·로고를 넣지 않음

## 다음 세션의 첫 작업

1. `git status --short`와 `git log -3 --oneline`을 확인한다.
2. `superpowers:using-git-worktrees`를 사용해 격리 작업공간을 만든다.
3. 사용자가 선택한 실행 방식에 따라 다음 중 하나를 사용한다.
   - `superpowers:subagent-driven-development`
   - `superpowers:executing-plans`
4. `docs/superpowers/plans/2026-07-30-medical-ai-site-scaffold.md`의 Task 1부터 실행한다.
5. 첫 화면 렌더링 후 `frontend-design`으로 승인된 디자인과 비교한다.
6. React 구현 후 `vercel-react-best-practices`로 검토한다.

## 이번 스캐폴딩 계획의 범위

- Next.js·TypeScript·Tailwind·MDX 프로젝트 기반
- 콘텐츠 스키마와 정적 글 로더
- 흰색 Developer Workspace 셸
- 메인·목록·글 상세·주제·시리즈·정보 페이지 골격
- 검색·필터·테마·Giscus 폴백
- 정적 이미지 파이프라인 골격
- 단위·브라우저·접근성 테스트
- CI와 Pages 정적 빌드
- UX·시각 검수 Markdown

## 다음 계획으로 분리된 범위

- 의료 AI 최신 연구와 모델의 본격 조사·집필
- Imagegen 최종 이미지 8장 생성
- GitHub Pages·Discussions·Giscus 실제 전환

## 중요한 안전 게이트

- 새 `mamekuma-sys/mamekuma-sys.github.io` 저장소가 존재하며 기본 브랜치는 `main`이다.
- 사이트 스캐폴딩은 별도 기능 브랜치와 worktree에서 진행한다.
- 새 사이트가 전체 검증을 통과하기 전에는 Pages를 활성화하거나 `main`에 배포하지 않는다.
- 스캐폴딩 완료 후 검토된 변경만 `main`에 병합한다.

## 2026-07-30 원격 삭제 기록

- 삭제 대상: `mamekuma-sys/mamekuma-sys.github.io`
- 사용자 최종 확인: `원격 저장소 전체 삭제`
- 추가 권한 확인: `delete_repo 권한 추가 승인`
- 삭제 결과: GitHub API `404`, Git 원격 `Repository not found`
- 삭제 후 `delete_repo` 권한 제거 확인
- 로컬 커밋 `8fbaaa4`와 전체 설계 문서는 유지
- 삭제된 원격을 가리키던 `origin` 제거
- 로컬 브랜치를 `master`에서 `main`으로 변경

## 2026-07-30 새 원격 생성 기록

- 생성 대상: `mamekuma-sys/mamekuma-sys.github.io`
- 공개 저장소로 생성
- 로컬 `main`을 새 원격의 `main`으로 최초 푸시
- 로컬 `main`이 `origin/main`을 추적하도록 설정
- 생성 목적: 다른 노트북에서도 설계·계획 문서를 이어서 작업
- Pages 설정과 사이트 배포는 아직 실행하지 않음

## 현재 환경

- 작업 폴더: `/Users/paran/mamekuma-sys.github.io`
- Git 작성자: `mamekuma-sys <kjun04080@gmail.com>`
- 현재 브랜치: `main`
- 대상 GitHub 계정: `mamekuma-sys`
- 향후 공개 주소: `https://mamekuma-sys.github.io/`
- 현재 원격 저장소: `https://github.com/mamekuma-sys/mamekuma-sys.github.io`
- 현재 원격 연결: `origin`

## 시각 참고

- `https://seoa.dev/`
- `https://toss.tech/`
- `https://tech.channel.io/kr`

시각 브레인스토밍 파일과 참고 캡처는 `.superpowers/` 아래에 있으며 Git에서 제외된다. 로컬 브라우저 비교 서버는 다음 세션에 살아 있다고 가정하지 않는다. 필요한 경우 설계 문서의 설명을 기준으로 새 목업을 만든다.

## 완료 보고 방식

다음 세션이 끝날 때 이 파일을 갱신해 다음을 남긴다.

- 완료한 계획 Task
- 새 커밋
- 실행한 검증 명령과 결과
- 스크린샷 또는 UX 문서 경로
- 다음 작업
- 남은 위험과 사용자 확인이 필요한 항목
