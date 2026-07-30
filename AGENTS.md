# Medical AI Index 작업 지침

이 파일은 저장소 전체에 적용된다.

## 세션 시작 순서

1. `HANDOFF.md`를 읽는다.
2. 다음 설계 문서를 읽는다.
   - `docs/superpowers/specs/2026-07-30-medical-ai-site-design.md`
   - `docs/superpowers/specs/2026-07-30-medical-ai-blog-series-design.md`
3. 실행 중인 계획을 읽는다.
   - `docs/superpowers/plans/2026-07-30-medical-ai-site-scaffold.md`
4. `git status --short`와 최근 커밋을 확인한다.
5. 구현 전 관련 스킬을 먼저 읽고 따른다.

## 제품과 기술

- 제품명: `Medical AI Index`
- 화면 로고: `<medical-ai/>`
- 작성자: `mamekuma-sys`
- 대상 주소: `https://mamekuma-sys.github.io/`
- 기술: Next.js App Router, React, TypeScript, Tailwind CSS, MDX
- 배포: Next.js 정적 내보내기, GitHub Actions, GitHub Pages
- 기본 언어: 한국어, 모델명·논문명·전문용어는 영문 병기

## 디자인 기준

- 승인된 방향은 흰색 `Developer Workspace`다.
- 기본 화면은 흰색, 보조 화면은 옅은 회색, 본문은 짙은 네이비, 강조색은 청록을 사용한다.
- 제목·본문은 Pretendard, 코드·경로·메타데이터는 JetBrains Mono를 사용한다.
- 데스크톱에는 파일 탐색기형 주제 탐색을 제공하고 모바일에서는 접이식 탐색으로 전환한다.
- 흔한 대시보드 카드와 장식적인 그라디언트를 남용하지 않는다.
- `frontend-design` 스킬은 시각 구현과 폴리시 전에 사용한다.
- `vercel-react-best-practices` 스킬은 React·Next.js 구현과 성능 검토에 사용한다.

## 구현 규칙

- React Server Components를 기본으로 사용한다.
- 브라우저 상태가 필요한 검색, 필터, 테마와 댓글만 Client Component로 만든다.
- 하나의 파일은 하나의 명확한 책임을 갖게 한다.
- MDX 메타데이터가 카드, 검색, RSS와 Open Graph의 단일 원본이다.
- 서버 런타임이 필요한 기능을 추가하지 않는다.
- GitHub Pages 정적 내보내기를 항상 유지한다.
- 사실 확인이 끝나지 않은 의료 내용을 완성된 게시물처럼 배포하지 않는다.
- 스캐폴딩용 콘텐츠는 `draft: true`로 표시하고 프로덕션 결과에서 제외한다.

## 의료 콘텐츠 안전

- 높은 벤치마크 점수와 임상적 유용성을 같은 의미로 쓰지 않는다.
- 기술 성능, 임상 근거와 현장 준비도를 별도 축으로 표현한다.
- 사전논문, 동료평가 연구, 공식 문서와 기업 발표를 구분한다.
- 의료 조언이나 환자별 진단으로 오인할 문구를 추가하지 않는다.
- 실제 환자, 특정 의료기관 또는 진단 결과로 오인할 이미지를 사용하지 않는다.

## 이미지

- 최종 표지는 `imagegen`으로 과학·의학 에디토리얼 일러스트를 생성한다.
- 이미지 안에 제목, 모델명, 로고와 긴 문구를 생성하지 않는다.
- 프로젝트가 참조하는 최종 자산은 반드시 `public/images` 아래에 둔다.
- 표지에는 대체 텍스트와 크기 정보를 제공한다.
- 전체 이미지 8장 생성은 사이트 스캐폴딩과 별도의 후속 계획으로 실행한다.

## 검증

스캐폴딩 이후 최소 검증 명령은 다음과 같다.

```powershell
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

- 375px, 768px, 1440px에서 라이트·다크 화면을 확인한다.
- 키보드 탐색, 포커스 표시, 색상 대비와 대체 텍스트를 확인한다.
- UX 결과는 `docs/reviews/ux-validation.md`에 기록한다.
- 시각 검수 결과는 `docs/reviews/visual-qa.md`에 기록한다.
- 완료를 주장하기 전에 `superpowers:verification-before-completion`을 사용한다.

## Git과 원격 저장소 안전

- 기존 원격 저장소 `mamekuma-sys/mamekuma-sys.github.io`는 사용자의 명시적 승인으로 2026-07-30 삭제되었다.
- 삭제 후 GitHub API의 `404`와 Git의 `Repository not found` 응답으로 부재를 검증했다.
- 로컬 저장소에는 원격이 연결되어 있지 않으며 기본 작업 브랜치는 `main`이다.
- 동일 이름 원격 저장소 생성, 연결과 Pages 전환은 사이트 스캐폴딩과 별도의 후속 계획으로 실행한다.
- 새 원격을 만들기 직전에 계정·저장소 이름·공개 주소를 읽기 전용으로 다시 검증한다.
- `git reset --hard`, 강제 푸시와 광범위한 파일 삭제를 사용하지 않는다.

## 커밋

- 관련된 작은 단위로 커밋한다.
- 구현과 무관한 사용자 변경을 건드리지 않는다.
- 각 작업이 끝나면 테스트 결과와 남은 위험을 `HANDOFF.md`에 반영한다.
