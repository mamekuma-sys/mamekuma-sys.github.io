# Medical AI Index Site Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-shaped, statically exported Next.js scaffold for Medical AI Index with the approved white Developer Workspace UI, validated MDX content, discovery features, accessibility checks, and GitHub Pages-ready CI.

**Architecture:** Next.js App Router renders local MDX into static HTML. Server Components own content loading and page composition; Client Components are limited to search, topic filtering, theme state, reading progress, code copying, and Giscus. Build scripts validate frontmatter, create a browser search index, and prepare image derivatives before `next build` emits `out/`.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, MDX, Zod, Vitest, Testing Library, Playwright, axe-core, Sharp, GitHub Actions, GitHub Pages.

## Global Constraints

- Public site URL is `https://mamekuma-sys.github.io/`.
- The repository name at cutover will be `mamekuma-sys/mamekuma-sys.github.io`.
- Use Next.js App Router with `output: "export"` and `trailingSlash: true`.
- Use React, TypeScript, Tailwind CSS, and local MDX.
- Default visual direction is the approved white `Developer Workspace`.
- Use Pretendard for Korean body copy and JetBrains Mono for code, paths, labels, and metadata.
- Use white and pale gray surfaces, dark navy copy, and restrained teal accents.
- Korean is primary; English model, paper, and technical terms are shown alongside Korean.
- Server Components are the default. Only browser-state features may use `"use client"`.
- Unverified medical claims must not appear as published content.
- Scaffold articles must have `draft: true` and must not appear in production static output.
- Final editorial images will be generated in a separate image-production plan; do not replace them with CSS-generated artwork.
- The previous remote GitHub Pages repository was deleted on 2026-07-30 after explicit user confirmation.
- A replacement public repository was created outside this plan and the planning baseline was pushed to `origin/main`.
- Do not configure Pages or deploy from this scaffold plan.
- Pin the latest stable packages selected at execution time in `package-lock.json`.
- Do not use experimental Next.js or Tailwind features unless a stable feature cannot satisfy an approved requirement.
- Every task ends with its focused tests, a production-relevant check, and a commit.

---

## Scope Boundary

This plan delivers the site scaffold and its verification system. It does not deliver:

- researched medical AI articles;
- the eight final Imagegen assets;
- live GitHub Pages, Discussions, or Giscus identifiers.

Those are separate, testable projects and receive separate plans after this scaffold passes review.

## File Responsibility Map

### Application shell and design

- `src/app/layout.tsx` — root HTML, fonts, metadata, theme bootstrap.
- `src/app/globals.css` — Tailwind import, tokens, base typography, reduced motion.
- `src/components/site/site-shell.tsx` — desktop and mobile application frame.
- `src/components/site/explorer-navigation.tsx` — topic tree and mobile drawer content.
- `src/components/site/site-header.tsx` — logo, primary navigation, search and theme actions.
- `src/features/theme/theme-toggle.tsx` — persisted light/dark user choice.
- `src/features/theme/theme.ts` — pure theme precedence logic.

### Content domain

- `src/lib/content/article-schema.ts` — Zod schema and canonical metadata types.
- `src/lib/content/articles.ts` — filesystem article queries and production draft exclusion.
- `src/lib/content/toc.ts` — headings-to-table-of-contents transformation.
- `src/lib/content/related.ts` — deterministic related-article selection.
- `src/content/articles/*.mdx` — article sources.
- `scripts/validate-content.ts` — build-blocking content validation.

### Routes

- `src/app/page.tsx` — Developer Workspace home.
- `src/app/articles/page.tsx` — searchable article index shell.
- `src/app/articles/[slug]/page.tsx` — static MDX article route.
- `src/app/topics/[topic]/page.tsx` — topic route.
- `src/app/series/[slug]/page.tsx` — ordered series route.
- `src/app/timeline/page.tsx` — model genealogy explainer shell.
- `src/app/evidence/page.tsx` — evidence-axis explainer.
- `src/app/about/page.tsx` — editorial policy and author.
- `src/app/not-found.tsx` — useful static 404.
- `src/app/sitemap.ts` — static sitemap.
- `src/app/robots.ts` — crawler policy.
- `src/app/rss.xml/route.ts` — build-time RSS response.

### Discovery and interaction

- `scripts/build-search-index.ts` — creates `public/search/articles.json`.
- `src/features/search/search-index.ts` — pure ranking and filtering.
- `src/features/search/search-dialog.tsx` — lazy-loaded client search.
- `src/features/topic-filter/topic-filter.tsx` — URL-reflected topic/evidence filtering.
- `src/features/reading/reading-progress.tsx` — passive progress indicator.
- `src/features/comments/giscus-comments.tsx` — Giscus integration with fallback.

### Media

- `scripts/optimize-images.ts` — deterministic WebP, AVIF, thumbnail, and OG derivatives.
- `src/components/media/cover-image.tsx` — dimensions, alt text, responsive sources, safe fallback.
- `public/images/generated/` — future Imagegen originals.
- `public/images/covers/` — optimized cover images.
- `public/images/og/` — 1200×630 social images.

### Verification

- `vitest.config.ts` and `vitest.setup.ts` — unit/component test runtime.
- `playwright.config.ts` — desktop, tablet, and mobile browser projects.
- `tests/e2e/*.spec.ts` — user journeys and accessibility assertions.
- `.github/workflows/ci.yml` — pull-request and branch validation.
- `.github/workflows/deploy-pages.yml` — static Pages artifact workflow, disabled until cutover.
- `docs/reviews/ux-validation.md` — scenario evidence and results.
- `docs/reviews/visual-qa.md` — screenshot matrix and visual findings.

---

## Stage Quality Gate

Every implementation-plan Task is a Stage. Its existing commit step creates a local candidate commit, not a pushable final result. After each candidate commit:

1. Run `human-editorial-review` and `ai-technical-review` independently.
2. Apply and review up to three correction attempts.
3. Add `docs/reviews/stages/scaffold-task-<two-digit-task>.md`.
4. Amend the candidate commit with the report.
5. Rerun the Task's focused checks.
6. Push the current feature branch only after `stage-quality-gate` reports PASS.

The candidate must not be pushed before PASS. A passing Stage requires both review scores to be at least 90, zero critical findings, and all required checks to pass. Never force-push.

---

### Task 1: Create the static Next.js foundation and test harness

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/page.test.tsx`
- Create: `src/app/globals.css`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npm run build`, and static `out/`.
- Produces: root `RootLayout({ children }: { children: React.ReactNode })`.
- Consumes: approved site metadata and static-export constraints from the site design spec.

- [ ] **Step 1: Confirm the isolated execution workspace**

Run:

```powershell
git status --short
git branch --show-current
git log -3 --oneline
```

Expected: only implementation-session changes are present, and the branch is the worktree branch created through `superpowers:using-git-worktrees`.

- [ ] **Step 2: Generate a current stable Next.js scaffold in a staging directory**

Run:

```powershell
npx.cmd create-next-app@latest .next-scaffold --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*" --yes
```

Expected: `.next-scaffold` contains an App Router project and `package-lock.json`.

- [ ] **Step 3: Copy only the generated foundation into the repository root**

Run in PowerShell from the repository root:

```powershell
$scaffoldRoot = Resolve-Path -LiteralPath '.next-scaffold'
$repoRoot = Resolve-Path -LiteralPath '.'
if (-not $scaffoldRoot.Path.StartsWith($repoRoot.Path, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'Scaffold directory escaped the repository'
}
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\package.json" -Destination '.\package.json'
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\package-lock.json" -Destination '.\package-lock.json'
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\next.config.ts" -Destination '.\next.config.ts'
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\postcss.config.mjs" -Destination '.\postcss.config.mjs'
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\eslint.config.mjs" -Destination '.\eslint.config.mjs'
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\tsconfig.json" -Destination '.\tsconfig.json'
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\src" -Destination '.\src' -Recurse
Copy-Item -LiteralPath "$($scaffoldRoot.Path)\public" -Destination '.\public' -Recurse
```

Expected: repository docs remain untouched and the root gains only the whitelisted scaffold files.

- [ ] **Step 4: Install the scaffold test and content dependencies**

Run:

```powershell
npm install zod gray-matter next-mdx-remote remark-gfm rehype-slug github-slugger reading-time remove-markdown
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react vite-tsconfig-paths @playwright/test @axe-core/playwright sharp tsx
```

Expected: dependencies are recorded in `package.json` and locked in `package-lock.json`.

- [ ] **Step 5: Configure static export**

Set `next.config.ts` to:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

Update `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "build": "next build",
    "validate": "npm run typecheck && npm run lint && npm run test && npm run build"
  }
}
```

Preserve the existing `.superpowers/` rule and append these generated/runtime paths to `.gitignore`:

```gitignore
node_modules/
.next/
out/
.next-scaffold/
playwright-report/
test-results/
.env*
!.env.example
```

- [ ] **Step 6: Add the Vitest runtime**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 7: Write a failing root-page test**

Create `src/app/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("identifies the site as Medical AI Index", () => {
    render(<HomePage />);
    expect(screen.getByText("<medical-ai/>")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "의료 AI를 근거부터 읽습니다." }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run the test to verify the branding test fails**

Run:

```powershell
npm run test -- src/app/page.test.tsx
```

Expected: FAIL because the generated page does not contain the approved brand and heading.

- [ ] **Step 9: Replace the generated page with the minimal approved copy**

Create `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <p aria-label="Medical AI Index logo">{"<medical-ai/>"}</p>
      <h1>의료 AI를 근거부터 읽습니다.</h1>
    </main>
  );
}
```

- [ ] **Step 10: Verify foundation tests and static export**

Run:

```powershell
npm run test -- src/app/page.test.tsx
npm run typecheck
npm run lint
npm run build
Test-Path -LiteralPath '.\out\index.html'
```

Expected: tests, types, lint, and build pass; the final command prints `True`.

- [ ] **Step 11: Remove the staging scaffold safely**

Resolve and verify the exact target before removal:

```powershell
$repoRoot = (Resolve-Path -LiteralPath '.').Path
$stagingPath = (Resolve-Path -LiteralPath '.next-scaffold').Path
if ($stagingPath -ne (Join-Path $repoRoot '.next-scaffold')) {
  throw "Unexpected scaffold path: $stagingPath"
}
Remove-Item -LiteralPath $stagingPath -Recurse -Force
```

Expected: only `.next-scaffold` is removed.

- [ ] **Step 12: Commit the foundation**

```powershell
git add package.json package-lock.json next.config.ts postcss.config.mjs eslint.config.mjs tsconfig.json vitest.config.ts vitest.setup.ts src/app public .gitignore
git commit -m "build: scaffold static Next.js site"
```

---

### Task 2: Implement the validated MDX content domain

**Files:**
- Create: `src/lib/content/article-schema.ts`
- Create: `src/lib/content/articles.ts`
- Create: `src/lib/content/articles.test.ts`
- Create: `src/lib/content/__fixtures__/valid-article.mdx`
- Create: `src/lib/content/__fixtures__/invalid/invalid-article.mdx`
- Create: `src/content/articles/site-introduction.mdx`
- Create: `scripts/validate-content.ts`

**Interfaces:**
- Produces: `ArticleMeta`, `ArticleDocument`, `Topic`, `EvidenceState`.
- Produces: `getAllArticles(options?: { includeDrafts?: boolean; contentDir?: string }): ArticleDocument[]`.
- Produces: `getArticleBySlug(slug: string, options?: { includeDrafts?: boolean; contentDir?: string }): ArticleDocument | null`.
- Consumes: local `.mdx` files with YAML frontmatter.

- [ ] **Step 1: Write schema and loader tests**

Create `src/lib/content/articles.test.ts`:

```ts
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllArticles } from "./articles";

const fixtureDir = path.join(
  process.cwd(),
  "src/lib/content/__fixtures__",
);

describe("getAllArticles", () => {
  it("loads valid frontmatter into a canonical document", () => {
    const articles = getAllArticles({
      contentDir: fixtureDir,
      includeDrafts: true,
    });

    expect(articles).toHaveLength(1);
    expect(articles[0].meta.slug).toBe("valid-article");
    expect(articles[0].meta.evidence.technical).toBe("established");
  });

  it("excludes draft articles from production queries", () => {
    const articles = getAllArticles({
      contentDir: fixtureDir,
      includeDrafts: false,
    });

    expect(articles).toEqual([]);
  });

  it("rejects invalid evidence metadata", () => {
    expect(() =>
      getAllArticles({
        contentDir: path.join(fixtureDir, "invalid"),
        includeDrafts: true,
      }),
    ).toThrow(/unsupported-value/);
  });
});
```

Create `valid-article.mdx` with `draft: true` and all required metadata. Create `invalid-article.mdx` with `evidence.technical: unsupported-value`; place the invalid fixture in `src/lib/content/__fixtures__/invalid/` so the valid-directory test remains deterministic.

- [ ] **Step 2: Run the tests to verify missing loaders fail**

Run:

```powershell
npm run test -- src/lib/content/articles.test.ts
```

Expected: FAIL because `./articles` does not exist.

- [ ] **Step 3: Define the canonical schema**

Create `src/lib/content/article-schema.ts` with these exact enums and exported types:

```ts
import { z } from "zod";

export const topics = [
  "medical-imaging",
  "ehr-timeseries",
  "clinical-llm",
  "multimodal",
  "clinical-evidence",
  "future",
] as const;

export const articleMetaSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    publishedAt: z.string().date(),
    reviewedAt: z.string().date(),
    researchCutoff: z.string().date(),
    author: z.literal("mamekuma-sys"),
    topics: z.array(z.enum(topics)).min(1),
    tags: z.array(z.string().min(1)),
    series: z.string().nullable(),
    seriesOrder: z.number().int().positive().nullable(),
    modelStage: z.array(
      z.enum(["foundation", "transition", "frontier"]),
    ),
    evidence: z.object({
      technical: z.enum(["emerging", "mixed", "established"]),
      clinical: z.enum(["insufficient", "retrospective", "prospective", "outcomes"]),
      deployment: z.enum(["research", "pilot", "selective", "operational"]),
    }),
    sourceStates: z.array(
      z.enum(["peer-reviewed", "preprint", "official", "company"]),
    ),
    hasKoreaContext: z.boolean(),
    coverImage: z.string().startsWith("/images/"),
    coverAlt: z.string().min(10),
    featured: z.boolean(),
    draft: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.series === null && value.seriesOrder !== null) {
      context.addIssue({
        code: "custom",
        path: ["seriesOrder"],
        message: "seriesOrder requires series",
      });
    }
    if (value.reviewedAt < value.publishedAt) {
      context.addIssue({
        code: "custom",
        path: ["reviewedAt"],
        message: "reviewedAt cannot precede publishedAt",
      });
    }
  });

export type ArticleMeta = z.infer<typeof articleMetaSchema>;

export type ArticleDocument = {
  meta: ArticleMeta;
  body: string;
  absolutePath: string;
};
```

- [ ] **Step 4: Implement deterministic filesystem loading**

Create `src/lib/content/articles.ts` so that it:

1. reads only top-level `.mdx` files;
2. parses frontmatter with `gray-matter`;
3. validates with `articleMetaSchema`;
4. rejects duplicate slugs;
5. excludes drafts unless `includeDrafts` is true;
6. sorts by `publishedAt` descending, then slug ascending.

The public signatures must match:

```ts
export function getAllArticles(options?: {
  includeDrafts?: boolean;
  contentDir?: string;
}): ArticleDocument[];

export function getArticleBySlug(
  slug: string,
  options?: {
    includeDrafts?: boolean;
    contentDir?: string;
  },
): ArticleDocument | null;
```

- [ ] **Step 5: Add a clearly marked scaffold article**

Create `src/content/articles/site-introduction.mdx` with:

```mdx
---
title: "Medical AI Index 사이트 준비 안내"
description: "사이트 구조와 콘텐츠 원칙을 검증하기 위한 비공개 스캐폴딩 문서"
slug: "site-introduction"
publishedAt: "2026-07-30"
reviewedAt: "2026-07-30"
researchCutoff: "2026-07-30"
author: "mamekuma-sys"
topics:
  - "clinical-evidence"
tags:
  - "site"
series: null
seriesOrder: null
modelStage: []
evidence:
  technical: "emerging"
  clinical: "insufficient"
  deployment: "research"
sourceStates:
  - "official"
hasKoreaContext: false
coverImage: "/images/covers/site-introduction.webp"
coverAlt: "Medical AI Index 스캐폴딩 문서용 빈 표지"
featured: false
draft: true
---

# 사이트 준비 안내

이 문서는 레이아웃과 MDX 컴포넌트를 검증하기 위한 비공개 초안입니다.
의료 AI에 대한 사실 주장이나 게시용 콘텐츠를 포함하지 않습니다.
```

- [ ] **Step 6: Add the build-blocking validation command**

Create `scripts/validate-content.ts`:

```ts
import { existsSync } from "node:fs";
import path from "node:path";
import { getAllArticles } from "../src/lib/content/articles";

const articles = getAllArticles({ includeDrafts: true });
const failures: string[] = [];

for (const article of articles) {
  const imagePath = path.join(
    process.cwd(),
    "public",
    article.meta.coverImage.replace(/^\//, ""),
  );
  if (!existsSync(imagePath) && !article.meta.draft) {
    failures.push(`${article.meta.slug}: missing cover image`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${articles.length} article(s).`);
```

Drafts may use a missing future cover during scaffolding; published content may not.

Add the command to `package.json`:

```json
{
  "scripts": {
    "content:validate": "tsx scripts/validate-content.ts"
  }
}
```

- [ ] **Step 7: Verify valid, draft, and invalid behavior**

Run:

```powershell
npm run test -- src/lib/content/articles.test.ts
npm run content:validate
```

Expected: tests pass, including the invalid-fixture assertion; validation reports the draft article without failing.

- [ ] **Step 8: Commit the content domain**

```powershell
git add src/lib/content src/content/articles scripts/validate-content.ts package.json package-lock.json
git commit -m "feat: add validated MDX content domain"
```

---

### Task 3: Build the design tokens, shell, navigation, and theme

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/site/site-shell.tsx`
- Create: `src/components/site/site-header.tsx`
- Create: `src/components/site/explorer-navigation.tsx`
- Create: `src/components/site/site-shell.test.tsx`
- Create: `src/features/theme/theme.ts`
- Create: `src/features/theme/theme.test.ts`
- Create: `src/features/theme/theme-toggle.tsx`

**Interfaces:**
- Produces: `SiteShell({ children }: { children: React.ReactNode })`.
- Produces: `ExplorerNavigation({ currentPath }: { currentPath: string })`.
- Produces: `resolveTheme(input: ThemeInput): "light" | "dark"`.
- Consumes: approved brand, topics, typography, and white Developer Workspace direction.

- [ ] **Step 1: Write the theme precedence test**

Create `src/features/theme/theme.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveTheme } from "./theme";

describe("resolveTheme", () => {
  it("prefers an explicit stored choice", () => {
    expect(
      resolveTheme({ stored: "light", systemPrefersDark: true }),
    ).toBe("light");
  });

  it("uses system preference when no stored choice exists", () => {
    expect(
      resolveTheme({ stored: null, systemPrefersDark: true }),
    ).toBe("dark");
  });

  it("falls back to light", () => {
    expect(
      resolveTheme({ stored: null, systemPrefersDark: null }),
    ).toBe("light");
  });
});
```

- [ ] **Step 2: Run the theme test to verify failure**

Run:

```powershell
npm run test -- src/features/theme/theme.test.ts
```

Expected: FAIL because `theme.ts` does not exist.

- [ ] **Step 3: Implement the pure theme resolver**

Create `src/features/theme/theme.ts`:

```ts
export type Theme = "light" | "dark";

export type ThemeInput = {
  stored: Theme | null;
  systemPrefersDark: boolean | null;
};

export function resolveTheme({
  stored,
  systemPrefersDark,
}: ThemeInput): Theme {
  if (stored) return stored;
  if (systemPrefersDark === true) return "dark";
  return "light";
}
```

- [ ] **Step 4: Define stable Tailwind tokens**

In `src/app/globals.css`, use Tailwind's stable import syntax and define semantic CSS variables:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  --surface: #ffffff;
  --surface-subtle: #f6f8f9;
  --surface-code: #fbfcfd;
  --border: #dfe6e9;
  --text: #15232b;
  --text-muted: #68777f;
  --accent: #007f7a;
  --accent-soft: #e3f5f2;
  --focus: #0b6cff;
}

[data-theme="dark"] {
  color-scheme: dark;
  --surface: #0b1217;
  --surface-subtle: #111b21;
  --surface-code: #0f191f;
  --border: #263740;
  --text: #e3edf0;
  --text-muted: #95a8b0;
  --accent: #68d8cf;
  --accent-soft: #123a38;
  --focus: #75a7ff;
}

html {
  background: var(--surface);
  color: var(--text);
}

*:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Write the shell accessibility test**

Create `src/components/site/site-shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { SiteShell } from "./site-shell";

describe("SiteShell", () => {
  it("provides skip navigation and named site navigation", () => {
    render(
      <SiteShell>
        <p>본문</p>
      </SiteShell>,
    );

    expect(screen.getByRole("link", { name: "본문으로 건너뛰기" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByRole("navigation", { name: "주제 탐색" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Implement the shell components**

Implement:

```tsx
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text)]">
      <a className="sr-only focus:not-sr-only" href="#main-content">
        본문으로 건너뛰기
      </a>
      <SiteHeader />
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-[15rem_minmax(0,1fr)]">
        <ExplorerNavigation currentPath="/" />
        <main id="main-content" className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
```

`ExplorerNavigation` must render the six canonical topics and hide the desktop rail below the `md` breakpoint while exposing the same links through the header's mobile menu.

- [ ] **Step 7: Implement no-flash theme bootstrap and toggle**

In `src/app/layout.tsx`, add an inline pre-hydration script that applies:

```js
const stored = localStorage.getItem("medical-ai-theme");
const theme =
  stored === "light" || stored === "dark"
    ? stored
    : matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
document.documentElement.dataset.theme = theme;
```

`ThemeToggle` must update `document.documentElement.dataset.theme`, persist `medical-ai-theme`, expose an accessible pressed state, and avoid rendering the wrong icon before hydration.

- [ ] **Step 8: Verify shell, theme, types, and lint**

Run:

```powershell
npm run test -- src/features/theme/theme.test.ts src/components/site/site-shell.test.tsx
npm run typecheck
npm run lint
```

Expected: all checks pass.

- [ ] **Step 9: Commit the design foundation**

```powershell
git add src/app src/components/site src/features/theme
git commit -m "feat: add developer workspace shell and theme"
```

---

### Task 4: Implement the approved home experience

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`
- Create: `src/components/home/command-hero.tsx`
- Create: `src/components/home/article-card.tsx`
- Create: `src/components/home/latest-articles.tsx`
- Create: `src/components/content/evidence-badge.tsx`

**Interfaces:**
- Produces: `CommandHero()`.
- Produces: `ArticleCard({ article }: { article: ArticleMeta })`.
- Produces: `LatestArticles({ articles }: { articles: ArticleMeta[] })`.
- Consumes: `getAllArticles`, `SiteShell`, canonical evidence values.

- [ ] **Step 1: Invoke the frontend design guidance**

Read `frontend-design/SKILL.md` completely. Compare implementation decisions against the approved white Developer Workspace design in the site spec. Do not introduce a different art direction.

- [ ] **Step 2: Expand the failing home-page test**

The test must assert:

```tsx
expect(screen.getByText("~/medical-ai")).toBeInTheDocument();
expect(screen.getByText("Latest commits / articles")).toBeInTheDocument();
expect(screen.getByText("Patient-facing AI")).toBeInTheDocument();
expect(screen.getByRole("link", { name: "전체 글 보기" })).toHaveAttribute(
  "href",
  "/articles/",
);
```

Also assert that no `draft: true` article appears when the page uses production article data.

- [ ] **Step 3: Run the test to verify the richer home contract fails**

Run:

```powershell
npm run test -- src/app/page.test.tsx
```

Expected: FAIL because the minimal page lacks the workspace hero and latest section.

- [ ] **Step 4: Implement the home component contracts**

`CommandHero` must render:

- prompt: `~/medical-ai $ open overview --evidence=clinical`;
- heading: `의료 AI를 근거부터 읽습니다.`;
- one-sentence product description;
- three metadata cells: focus, region, source policy;
- a text code panel showing the three evidence axes.

`ArticleCard` must render semantic `<article>`, linked title, description, topics, review date, reading time, and text evidence states. It must not synthesize a CSS illustration where a future generated cover belongs.

- [ ] **Step 5: Implement production-safe article selection**

In the home page:

```ts
const articles = getAllArticles({
  includeDrafts: process.env.NODE_ENV === "development",
});
const featured = articles.filter((article) => article.meta.featured);
const latest = articles.slice(0, 4);
```

When no published article exists, render an honest empty state:

```tsx
<p>검증된 첫 아티클을 준비하고 있습니다.</p>
```

Development may show draft cards with a visible `DRAFT` label. Static production output may not.

- [ ] **Step 6: Verify home behavior and responsive markup**

Run:

```powershell
npm run test -- src/app/page.test.tsx
npm run typecheck
npm run lint
npm run build
```

Expected: all checks pass and no draft article text exists under `out/`.

- [ ] **Step 7: Commit the home experience**

```powershell
git add src/app/page.tsx src/app/page.test.tsx src/components/home src/components/content
git commit -m "feat: build Medical AI Index home"
```

---

### Task 5: Render static MDX articles and reading tools

**Files:**
- Create: `src/app/articles/[slug]/page.tsx`
- Create: `src/app/articles/[slug]/page.test.tsx`
- Create: `src/components/article/article-header.tsx`
- Create: `src/components/article/article-layout.tsx`
- Create: `src/components/article/article-table-of-contents.tsx`
- Create: `src/components/article/citation-list.tsx`
- Create: `src/components/article/series-navigation.tsx`
- Create: `src/features/reading/reading-progress.tsx`
- Create: `src/lib/content/toc.ts`
- Create: `src/lib/content/toc.test.ts`
- Create: `src/lib/content/related.ts`
- Create: `src/lib/content/related.test.ts`
- Create: `src/mdx/components.tsx`

**Interfaces:**
- Produces: `buildTableOfContents(markdown: string): TocItem[]`.
- Produces: `findRelatedArticles(article: ArticleMeta, candidates: ArticleMeta[], limit?: number): ArticleMeta[]`.
- Produces: `generateStaticParams(): { slug: string }[]`.
- Consumes: `getArticleBySlug`, `getAllArticles`, `MDXRemote`, canonical MDX components.

- [ ] **Step 1: Write table-of-contents and related-article tests**

Use these contracts:

```ts
expect(buildTableOfContents("## 첫 절\n### 세부 절")).toEqual([
  { depth: 2, text: "첫 절", id: "첫-절" },
  { depth: 3, text: "세부 절", id: "세부-절" },
]);
```

Related articles must rank shared topic count first, shared tag count second, and slug alphabetically as the final deterministic tie-breaker.

- [ ] **Step 2: Run the tests to verify utilities are missing**

Run:

```powershell
npm run test -- src/lib/content/toc.test.ts src/lib/content/related.test.ts
```

Expected: FAIL because the utilities do not exist.

- [ ] **Step 3: Implement pure TOC and related-content utilities**

Use `github-slugger` for heading IDs. Ignore headings inside fenced code blocks. Only include `h2` and `h3`. Return empty arrays for empty content.

- [ ] **Step 4: Write the static-route test**

Mock `getAllArticles` with one published and one draft document. Assert `generateStaticParams()` returns only the published slug for production.

- [ ] **Step 5: Implement the static article route**

The route must:

```tsx
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.meta.slug,
  }));
}
```

Load the article, call `notFound()` when absent, render `MDXRemote` with `remark-gfm` and `rehype-slug`, and pass canonical components from `src/mdx/components.tsx`.

- [ ] **Step 6: Implement the reading layout**

The article layout must include:

- title, description, author, research cutoff, reviewed date, and reading time;
- evidence badges with text labels;
- desktop sticky TOC and mobile disclosure TOC;
- reading progress marked `aria-hidden="true"`;
- citation section;
- related articles;
- series previous and next links;
- comments slot.

- [ ] **Step 7: Verify article tests and static route output**

Run:

```powershell
npm run test -- src/lib/content/toc.test.ts src/lib/content/related.test.ts src/app/articles/[slug]/page.test.tsx
npm run typecheck
npm run lint
npm run build
```

Expected: checks pass; draft routes do not exist in `out/articles`.

- [ ] **Step 8: Commit article rendering**

```powershell
git add src/app/articles src/components/article src/features/reading src/lib/content src/mdx
git commit -m "feat: render static MDX articles"
```

---

### Task 6: Add search, filters, topic routes, series, and editorial pages

**Files:**
- Create: `scripts/build-search-index.ts`
- Create: `src/features/search/search-index.ts`
- Create: `src/features/search/search-index.test.ts`
- Create: `src/features/search/search-dialog.tsx`
- Create: `src/features/topic-filter/topic-filter.tsx`
- Create: `src/app/articles/page.tsx`
- Create: `src/app/topics/[topic]/page.tsx`
- Create: `src/app/series/[slug]/page.tsx`
- Create: `src/app/timeline/page.tsx`
- Create: `src/app/evidence/page.tsx`
- Create: `src/app/about/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/rss.xml/route.ts`

**Interfaces:**
- Produces: `SearchRecord`.
- Produces: `searchArticles(records: SearchRecord[], query: string, filters: SearchFilters): SearchRecord[]`.
- Produces: `public/search/articles.json`.
- Consumes: published article metadata and stripped article body.

- [ ] **Step 1: Write search ranking and filtering tests**

Use this type:

```ts
export type SearchRecord = {
  slug: string;
  title: string;
  description: string;
  body: string;
  topics: string[];
  tags: string[];
  evidence: {
    technical: string;
    clinical: string;
    deployment: string;
  };
};
```

Tests must prove:

- exact title matches rank before body-only matches;
- `U-Net` and `u-net` match case-insensitively;
- topic and evidence filters intersect;
- empty query with no filters returns all records;
- no match returns an empty array.

- [ ] **Step 2: Run search tests to verify failure**

Run:

```powershell
npm run test -- src/features/search/search-index.test.ts
```

Expected: FAIL because the search implementation does not exist.

- [ ] **Step 3: Implement pure search without a hosted service**

Normalize with `String.prototype.normalize("NFKC")` and lowercase. Apply weights:

- exact normalized title: 100;
- title contains query: 50;
- tag exact match: 35;
- description contains query: 20;
- body contains query: 5.

Sort by score descending, then title ascending.

- [ ] **Step 4: Generate the static search index**

`build-search-index.ts` must:

- load only published articles;
- remove Markdown/MDX syntax with `remove-markdown`;
- exclude import/export blocks;
- write deterministic UTF-8 JSON to `public/search/articles.json`;
- create the directory if missing;
- print record count.

Add the command to `package.json`:

```json
{
  "scripts": {
    "search:build": "tsx scripts/build-search-index.ts"
  }
}
```

- [ ] **Step 5: Implement the client search and URL filters**

`SearchDialog` must fetch `/search/articles.json` only when first opened. It must provide:

- keyboard shortcut `/` when focus is not in an input;
- labelled input;
- escape-to-close;
- result count;
- useful empty state;
- focus return to the opener.

`TopicFilter` must reflect selected topic and evidence values in query parameters so filtered lists are shareable and browser Back works.

- [ ] **Step 6: Implement the static discovery routes**

Each route must use published metadata only:

- `/articles/`: all records with search/filter controls;
- `/topics/[topic]/`: one of the six canonical topics;
- `/series/[slug]/`: ordered `seriesOrder`, rejecting duplicates;
- `/timeline/`: explanatory scaffold with no unverified model claims;
- `/evidence/`: the three-axis evaluation definitions from the approved content spec;
- `/about/`: editorial policy, author, sources policy, update policy, and non-medical-advice notice;
- 404: search entry, article index link, and home link.

- [ ] **Step 7: Implement static crawler artifacts**

Use one exported constant:

```ts
export const SITE_URL = "https://mamekuma-sys.github.io";
```

`sitemap.ts` must return a `MetadataRoute.Sitemap` containing the static routes plus one URL per published article. `robots.ts` must return a `MetadataRoute.Robots` that allows `/` and points to `${SITE_URL}/sitemap.xml`.

The RSS route must be statically generated:

```ts
export const dynamic = "force-static";

export function GET() {
  const articles = getAllArticles();
  const xml = buildRssXml({ siteUrl: SITE_URL, articles });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
```

Escape XML special characters in every interpolated title, description, and URL. Use RFC 822 dates. Drafts must never appear in sitemap or RSS.

- [ ] **Step 8: Verify discovery features**

Run:

```powershell
npm run search:build
npm run test -- src/features/search/search-index.test.ts
npm run typecheck
npm run lint
npm run build
Test-Path -LiteralPath '.\out\rss.xml'
Test-Path -LiteralPath '.\out\sitemap.xml'
```

Expected: `public/search/articles.json` exists, checks pass, static discovery routes exist in `out/`, and both final commands print `True`.

- [ ] **Step 9: Commit discovery**

```powershell
git add scripts/build-search-index.ts public/search src/features/search src/features/topic-filter src/app
git commit -m "feat: add static discovery and editorial routes"
```

---

### Task 7: Add media derivatives, Giscus fallback, and resilient UI states

**Files:**
- Create: `scripts/optimize-images.ts`
- Create: `scripts/optimize-images.test.ts`
- Create: `src/components/media/cover-image.tsx`
- Create: `src/components/media/cover-image.test.tsx`
- Create: `src/features/comments/giscus-config.ts`
- Create: `src/features/comments/giscus-comments.tsx`
- Create: `src/features/comments/giscus-comments.test.tsx`
- Create: `public/images/generated/.gitkeep`
- Create: `public/images/covers/.gitkeep`
- Create: `public/images/og/.gitkeep`

**Interfaces:**
- Produces: `deriveImagePaths(slug: string): { coverWebp: string; coverAvif: string; thumbnailWebp: string; ogWebp: string }`.
- Produces: `readGiscusConfig(): GiscusConfig | null`.
- Consumes: future 16:9 Imagegen originals and build-time environment variables.

- [ ] **Step 1: Write image-path tests**

Assert:

```ts
expect(deriveImagePaths("why-unet-still-matters")).toEqual({
  coverWebp: "public/images/covers/why-unet-still-matters.webp",
  coverAvif: "public/images/covers/why-unet-still-matters.avif",
  thumbnailWebp: "public/images/covers/why-unet-still-matters-thumb.webp",
  ogWebp: "public/images/og/why-unet-still-matters.webp",
});
```

- [ ] **Step 2: Implement deterministic Sharp derivatives**

For every PNG or JPEG under `public/images/generated`:

- preserve the stem as slug;
- create a 1600×900 cover with crop-safe `fit: "cover"`;
- create a 720×405 thumbnail;
- create a 1200×630 Open Graph image;
- emit WebP quality 82 and AVIF quality 50 where specified;
- keep source files unchanged;
- succeed with `Processed 0 image(s).` when the source directory is empty.

Add the image command and the now-complete build pipeline to `package.json`:

```json
{
  "scripts": {
    "images:optimize": "tsx scripts/optimize-images.ts",
    "prebuild": "npm run content:validate && npm run search:build && npm run images:optimize"
  }
}
```

- [ ] **Step 3: Write the cover component test**

Assert that a valid cover renders width, height, `loading="lazy"` outside the hero, and required alt text. Assert that an absent optional draft cover renders a text fallback without a broken `<img>`.

- [ ] **Step 4: Implement `CoverImage`**

The component interface is:

```ts
type CoverImageProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};
```

Published articles must never pass `src: null`; validation enforces this. Draft previews may render a plain bordered fallback labelled `표지 제작 전`, without code-generated artwork.

- [ ] **Step 5: Write Giscus configuration and fallback tests**

Use these environment variables:

```text
NEXT_PUBLIC_GISCUS_REPO
NEXT_PUBLIC_GISCUS_REPO_ID
NEXT_PUBLIC_GISCUS_CATEGORY
NEXT_PUBLIC_GISCUS_CATEGORY_ID
```

Assert that incomplete configuration returns `null`. When config is null, render a link to:

```text
https://github.com/mamekuma-sys/mamekuma-sys.github.io/discussions
```

with copy explaining that comments become available after Discussions setup.

- [ ] **Step 6: Implement Giscus with theme synchronization**

Load the official Giscus client only when complete configuration exists. Map discussion by pathname. When the site's theme changes, send the documented Giscus theme message. If the script errors, keep the Discussions fallback visible.

- [ ] **Step 7: Verify resilient media and comments**

Run:

```powershell
npm run test -- scripts/optimize-images.test.ts src/components/media/cover-image.test.tsx src/features/comments/giscus-comments.test.tsx
npm run images:optimize
npm run typecheck
npm run lint
npm run build
```

Expected: all checks pass and the empty image source directory does not fail scaffolding.

- [ ] **Step 8: Commit media and comments**

```powershell
git add scripts/optimize-images.ts scripts/optimize-images.test.ts public/images src/components/media src/features/comments
git commit -m "feat: add media pipeline and comment fallback"
```

---

### Task 8: Add browser journeys, accessibility tests, CI, and Pages artifact build

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/navigation.spec.ts`
- Create: `tests/e2e/theme.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `docs/reviews/ux-validation.md`
- Create: `docs/reviews/visual-qa.md`

**Interfaces:**
- Produces: browser projects named `desktop-light`, `tablet-light`, `mobile-light`, and `desktop-dark`.
- Produces: CI artifact `out/`.
- Consumes: stable `data-testid` only where role/text locators cannot express intent.

- [ ] **Step 1: Configure Playwright**

Use:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-light",
      use: { viewport: { width: 1440, height: 1000 }, colorScheme: "light" },
    },
    {
      name: "tablet-light",
      use: { viewport: { width: 768, height: 1024 }, colorScheme: "light" },
    },
    {
      name: "mobile-light",
      use: { ...devices["iPhone 13"], colorScheme: "light" },
    },
    {
      name: "desktop-dark",
      use: { viewport: { width: 1440, height: 1000 }, colorScheme: "dark" },
    },
  ],
});
```

- [ ] **Step 2: Write the initial failing user journeys**

Cover:

1. home communicates purpose and opens all articles;
2. explorer links reach each canonical topic;
3. `/` opens search, an empty result explains recovery, and Escape restores focus;
4. theme toggle persists across reload;
5. mobile navigation opens, moves focus, and closes;
6. 404 links to search and home;
7. no page has horizontal overflow at 375, 768, or 1440 widths.

- [ ] **Step 3: Add automated accessibility assertions**

For home, articles, evidence, and about:

```ts
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
  .analyze();

expect(results.violations).toEqual([]);
```

Also tab through the header, search, explorer, main content, and footer to verify visible focus.

- [ ] **Step 4: Run journeys and fix only observed failures**

Run:

```powershell
npx.cmd playwright install chromium
npm run test:e2e
```

Expected: initial tests expose missing labels, focus management, routes, or overflow; implement the smallest correction for each observed failure and rerun until green.

- [ ] **Step 5: Add CI**

`ci.yml` must run on pull requests and pushes:

```text
npm ci
npx playwright install --with-deps chromium
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

Upload Playwright traces on failure and `out/` on success.

- [ ] **Step 6: Add a cutover-safe Pages workflow**

`deploy-pages.yml` must:

- be `workflow_dispatch` only during scaffolding;
- build with `npm ci && npm run build`;
- upload `out/` with the official Pages artifact action;
- contain a comment explaining that automatic `main` deployment is enabled only in the separate cutover plan.

It must not delete or create repositories and must not mutate Pages settings in this plan.

- [ ] **Step 7: Create populated review documents**

`docs/reviews/ux-validation.md` must list the five approved personas, each journey, command evidence, pass/fail status, and concrete follow-up.
`docs/reviews/visual-qa.md` must list the four Playwright projects, screenshot path, viewport, theme, observed issue, and resolution.

Use `Not executed in this run` only for a command that genuinely could not run, and explain the blocking condition. Do not mark unrun checks as passed.

- [ ] **Step 8: Verify full CI-equivalent checks**

Run:

```powershell
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

Expected: every command exits 0 and `out/index.html` exists.

- [ ] **Step 9: Commit verification and CI**

```powershell
git add playwright.config.ts tests/e2e .github/workflows docs/reviews
git commit -m "test: add UX validation and static CI"
```

---

### Task 9: Perform design, React, and completion reviews

**Files:**
- Modify: files identified by review findings only
- Modify: `docs/reviews/ux-validation.md`
- Modify: `docs/reviews/visual-qa.md`
- Modify: `HANDOFF.md`

**Interfaces:**
- Consumes: completed scaffold and all prior task verification commands.
- Produces: evidence-backed scaffold handoff with no unresolved critical findings.

- [ ] **Step 1: Capture the visual matrix**

Capture full-page home and article screenshots for:

- 375×812 light;
- 768×1024 light;
- 1440×1000 light;
- 1440×1000 dark.

Store review screenshots under `.superpowers/qa/` so they remain local and ignored. Record their paths and findings in `docs/reviews/visual-qa.md`.

- [ ] **Step 2: Apply the frontend-design review**

Read the installed `frontend-design` skill completely and evaluate:

- whether the hero communicates one clear thesis;
- whether the file explorer encodes real navigation rather than decoration;
- whether typography feels intentional;
- whether spacing remains precise in the minimal white design;
- whether motion is useful and restrained;
- whether the result resembles the approved design instead of a generic dashboard.

Fix observed discrepancies and record each change.

- [ ] **Step 3: Apply the React performance review**

Read `vercel-react-best-practices` completely, then inspect only applicable rules. Confirm:

- Client Component boundaries are minimal;
- search data loads on demand;
- global listeners are deduplicated and cleaned up;
- static JSX and metadata remain server-rendered;
- no barrel import inflates the client bundle;
- list rendering uses stable keys;
- theme bootstrap avoids hydration flicker.

Fix concrete findings and record them in `docs/reviews/ux-validation.md`.

- [ ] **Step 4: Run the formal code review requested by the user**

Use the repository `code-review` skill against the scaffold plan and site spec. Resolve all high-severity Standards or Spec findings. Record any intentionally deferred non-critical finding with its reason.

- [ ] **Step 5: Run verification-before-completion**

Use `superpowers:verification-before-completion`, then run:

```powershell
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
git status --short
```

Expected: all commands pass. The worktree contains only intended review-document or handoff changes before the final commit.

- [ ] **Step 6: Update the next-session handoff**

Update `HANDOFF.md` with:

- tasks completed;
- commit hashes;
- exact verification results;
- UX and visual review document paths;
- next plan required: content, images, or remote cutover;
- unresolved risks;
- explicit statement that the existing remote repository remains untouched.

- [ ] **Step 7: Commit the reviewed scaffold**

```powershell
git add src scripts tests .github docs/reviews HANDOFF.md package.json package-lock.json
git commit -m "chore: complete reviewed site scaffold"
```

---

## Scaffold Completion Gate

The scaffold is complete only when:

- every Task 1–9 checkbox is complete;
- the approved white Developer Workspace is visible at all target widths;
- static export generates `out/`;
- production output excludes draft articles;
- search, filters, theme, navigation, 404, RSS, sitemap, and Giscus fallback work;
- unit, browser, accessibility, type, lint, and build checks pass;
- UX and visual QA Markdown files contain actual results;
- code review has no unresolved high-severity finding;
- `HANDOFF.md` reflects the real end state;
- the replacement repository's Pages settings have not been configured or deployed by this plan.

## Follow-up Plans

After scaffold approval, create separate plans in this order:

1. `medical-ai-content-production` — primary-source research and seven publication-ready articles.
2. `medical-ai-image-production` — Imagegen prompts, eight final assets, alt text, and derivatives.
3. `medical-ai-pages-cutover` — final remote identity check, reviewed scaffold merge to `main`, Pages, Discussions, Giscus, and production smoke tests.
