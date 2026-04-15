import { generatedPosts } from "./generated-posts";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  tags?: string[];
  content?: string;
}

export const manualPosts: Post[] = [
  {
    id: "1",
    title: "AI MVP를 하루 만에 만들며 배운 것들",
    excerpt: "Fridge Chef AI부터 Career Compass까지, LLM API를 연동해 빠르게 프로토타입을 만드는 과정에서 정말 중요한 것들.",
    category: "AI",
    date: "2026-04-10",
    readTime: "6 min",
    slug: "ai-mvp-one-weekend",
    tags: ["LLM", "Prototype", "MVP"],
    content: `## 왜 하루 만에 만들어야 했나

AI 프로토타이핑에서 가장 중요한 것은 속도가 아니라 **무엇을 검증할 것인가**를 명확히 하는 것이다. Fridge Chef AI를 만들면서 느낀 첫 번째 교훈이다.

### LLM API 연동의 현실

OpenAI API를 처음 연동할 때 기대했던 것과 실제 경험은 달랐다. 프롬프트 엔지니어링에 시간의 60%를 쓰게 될 줄은 몰랐다.

\`\`\`python
# 초기 프롬프트 - 너무 범용적
prompt = "요리 레시피를 추천해줘"

# 개선된 프롬프트 - 구체적인 컨텍스트 제공
prompt = f"""
당신은 한국 가정식 전문 셰프입니다.
냉장고에 있는 재료: {ingredients}
조건: 30분 이내, 1인분
JSON 형식으로 응답하세요.
"""
\`\`\`

### 배운 것들

1. **프롬프트는 코드다** — 버전 관리하고, 테스트하고, 반복해야 한다
2. **에러 핸들링이 UX다** — API 실패 시 사용자에게 무엇을 보여줄 것인가
3. **비용 관리** — 토큰 사용량을 모니터링하지 않으면 예산이 빠르게 소진된다

### Career Compass로의 확장

같은 패턴을 Career Compass AI에 적용했다. 사용자의 관심사와 역량을 입력받아 맞춤형 진로를 추천하는 도구다. 핵심은 동일했다: **좋은 프롬프트 + 견고한 에러 핸들링 + 빠른 피드백 루프**.

MVP는 완벽할 필요가 없다. 핵심 가설을 검증할 수 있으면 충분하다.`,
  },
  {
    id: "2",
    title: "빠른 프로토타이핑에서도 보안이 중요한 이유",
    excerpt: "Secure Launchpad를 만들며 느낀 것. 속도와 보안은 트레이드오프가 아니라 습관의 문제다.",
    category: "Security",
    date: "2026-04-05",
    readTime: "4 min",
    slug: "security-fast-prototyping",
    tags: ["Security", "DevOps", "Best Practices"],
    content: `## 속도 vs 보안? 잘못된 이분법

"MVP니까 보안은 나중에" — 이 말을 얼마나 많이 들었는가. Secure Launchpad를 만들면서 이 가정이 얼마나 위험한지 직접 경험했다.

### 프로토타입에서 발견한 취약점들

빠르게 만들다 보면 자연스럽게 발생하는 보안 이슈들:

- **하드코딩된 API 키** — .env 파일 없이 직접 코드에 삽입
- **인증 없는 엔드포인트** — "어차피 나만 쓰니까"
- **SQL 인젝션 가능성** — ORM 없이 직접 쿼리 작성

### 보안을 습관으로 만드는 법

보안은 추가 작업이 아니라 개발 습관의 일부여야 한다:

1. **환경 변수 사용을 기본으로** — 첫 번째 커밋부터
2. **인증 미들웨어 템플릿 준비** — 매번 새로 만들지 않기
3. **의존성 스캔 자동화** — GitHub Actions으로 CI에 포함

속도와 보안은 트레이드오프가 아니다. 좋은 습관이 두 가지 모두를 가능하게 한다.`,
  },
  {
    id: "3",
    title: "우주 보안과 미래 사이버 위협에 대한 생각",
    excerpt: "위성, 지상국, 그리고 확장되는 우주 인프라의 공격 표면. 컴퓨터공학도가 주목해야 할 영역.",
    category: "Space Tech",
    date: "2026-03-28",
    readTime: "8 min",
    slug: "space-security-cyber-risks",
    tags: ["Space", "Cybersecurity", "Infrastructure"],
    content: `## 우주가 새로운 공격 표면이 되고 있다

SpaceX Starlink만 해도 수천 개의 위성이 궤도를 돌고 있다. 이 모든 위성은 소프트웨어로 운영된다. 소프트웨어가 있는 곳에 취약점이 있다.

### 주요 위협 벡터

1. **위성 통신 가로채기** — 암호화되지 않은 다운링크 신호
2. **지상국 침투** — 위성을 직접 공격하기보다 지상 인프라를 노리는 것이 더 쉬움
3. **공급망 공격** — 위성 부품의 펌웨어 조작
4. **재밍과 스푸핑** — GPS 신호 교란은 이미 현실

### 왜 컴퓨터공학도가 관심을 가져야 하는가

우주 산업이 성장할수록 사이버보안 전문가의 수요도 함께 증가한다. 특히:

- 실시간 시스템의 보안 아키텍처 설계
- 제한된 리소스 환경에서의 암호화 구현
- 수백 km 상공의 시스템을 원격으로 패치하는 방법

이 분야는 아직 초기 단계다. 지금 공부를 시작하면 선점할 수 있는 영역이 많다.`,
  },
  {
    id: "4",
    title: "Dev Log: O!Share 중고거래 앱 만들기",
    excerpt: "기획서 작성부터 Supabase 연동, 실시간 거래 기능까지. 스타트업처럼 사이드 프로젝트를 운영한 기록.",
    category: "Dev Log",
    date: "2026-03-20",
    readTime: "5 min",
    slug: "devlog-oshare",
    tags: ["Supabase", "Full-Stack", "Startup"],
    content: `## 사이드 프로젝트를 스타트업처럼 운영하기

O!Share는 내부 커뮤니티를 위한 중고거래 플랫폼이다. "그냥 만들자"가 아니라 실제 스타트업 프로세스를 따라가 보기로 했다.

### 기획 단계

1. 사용자 인터뷰 (5명)
2. 핵심 기능 정의: 상품 등록, 검색, 실시간 채팅
3. 와이어프레임 작성
4. 기술 스택 결정: React + Supabase

### Supabase가 MVP에 적합한 이유

- **인증**: 소셜 로그인 10분 만에 구현
- **실시간 DB**: 상품 등록 시 즉시 목록 업데이트
- **스토리지**: 상품 이미지 업로드
- **RLS**: 행 수준 보안으로 데이터 격리

### 결과와 교훈

2주 만에 MVP를 출시하고 30명의 초기 사용자를 확보했다. 가장 큰 교훈: **완벽한 기능보다 빠른 피드백이 중요하다**.`,
  },
  {
    id: "5",
    title: "항공편 지연 예측 모델 구축기",
    excerpt: "Flight Delay Prediction 프로젝트. 데이터 수집부터 모델 학습, 성능 평가까지의 ML 파이프라인 노트.",
    category: "Study Notes",
    date: "2026-03-15",
    readTime: "7 min",
    slug: "flight-delay-prediction",
    tags: ["ML", "Python", "Data Science"],
    content: `## 프로젝트 개요

항공편 지연은 승객과 항공사 모두에게 큰 비용을 발생시킨다. 머신러닝으로 지연을 예측할 수 있다면 사전 대응이 가능해진다.

### 데이터 파이프라인

1. **데이터 수집**: 미국 교통부 BTS 데이터셋 (200만+ 레코드)
2. **전처리**: 결측치 처리, 범주형 변수 인코딩, 시간 특성 추출
3. **특성 엔지니어링**: 출발 시간대, 요일, 계절, 항공사별 평균 지연

### 모델 비교

| 모델 | 정확도 | F1 Score |
|------|--------|----------|
| Logistic Regression | 72.3% | 0.68 |
| Random Forest | 81.5% | 0.79 |
| XGBoost | 83.2% | 0.81 |
| LightGBM | 84.1% | 0.82 |

LightGBM이 가장 좋은 성능을 보였다. 특히 출발 시간과 항공사가 가장 중요한 특성이었다.

### 배운 점

- 데이터 전처리가 모델 성능의 80%를 결정한다
- 도메인 지식이 좋은 특성을 만든다
- 모델 선택보다 데이터 품질이 더 중요하다`,
  },
  {
    id: "6",
    title: "첫 스타트업 실험: 아이디어에서 출시까지",
    excerpt: "사이드 프로젝트를 스타트업처럼 다루면 어떤 일이 벌어지는가. 검증, 스코프, 멈출 타이밍에 대한 교훈.",
    category: "Startup",
    date: "2026-03-08",
    readTime: "6 min",
    slug: "first-startup-experiment",
    tags: ["Startup", "Product", "Lessons"],
    content: `## 스타트업 마인드셋으로 사이드 프로젝트 하기

대학생이 스타트업을 경험하는 가장 좋은 방법은 사이드 프로젝트를 스타트업처럼 운영하는 것이다.

### 아이디어 검증

아이디어가 좋다고 느끼는 것과 사용자가 원하는 것은 다르다. 세 가지 검증 방법을 사용했다:

1. **문제 인터뷰**: "이 문제를 겪고 있나요?"
2. **솔루션 인터뷰**: "이런 해결책이 있다면 쓰겠나요?"
3. **랜딩 페이지 테스트**: 실제 관심도 측정

### 스코프 관리

MVP의 가장 큰 적은 기능 추가 욕구다. 핵심 가설 하나만 검증할 수 있는 최소한의 기능으로 출시하는 것이 핵심.

### 멈출 타이밍

모든 프로젝트가 성공하지는 않는다. 중요한 것은:
- 3주 안에 핵심 지표가 개선되지 않으면 피봇 또는 중단
- 감정적 애착보다 데이터 기반 의사결정
- 실패에서 배운 것을 다음 프로젝트에 적용

실패는 끝이 아니라 다음 실험의 시작이다.`,
  },
];

export const posts: Post[] = [...generatedPosts, ...manualPosts];

export const categories = [
  "All",
  ...Array.from(new Set(posts.map((post) => post.category))).sort((left, right) => left.localeCompare(right)),
];
