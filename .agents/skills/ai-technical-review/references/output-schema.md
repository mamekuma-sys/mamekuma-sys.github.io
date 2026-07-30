# AI Technical output schema

Write one UTF-8 JSON object and no prose. Use `reviewer: "ai-technical"` and all six canonical dimensions exactly once.

## Field contract

```json
{
  "schemaVersion": 1,
  "reviewer": "ai-technical",
  "stageId": "lowercase-stage-slug",
  "attempt": 1,
  "reviewedCandidateCommit": "7-to-64-lowercase-hexadecimal-git-id",
  "dimensions": [
    {
      "id": "canonical-dimension-id",
      "weight": 20,
      "rawScore": 4.5,
      "notApplicable": false,
      "notApplicableReason": null,
      "evidence": [
        {
          "path": "repository-relative/path.mjs",
          "line": 1,
          "detail": "Fresh implementation or command evidence."
        }
      ],
      "findings": []
    }
  ],
  "criticalFindings": [],
  "summary": "Concise technical verdict."
}
```

`attempt` is 1 through 3. Applicable raw scores are finite numbers from 0 through 5. A non-applicable dimension uses `rawScore: null`, `notApplicable: true`, and a non-empty reason. Every dimension requires evidence. A critical finding requires a unique `id`, non-empty `evidence`, `impact`, and `requiredFix`.

## Passing example

```json
{
  "schemaVersion": 1,
  "reviewer": "ai-technical",
  "stageId": "review-system-bootstrap",
  "attempt": 1,
  "reviewedCandidateCommit": "89abcdef0123456789abcdef0123456789abcdef",
  "dimensions": [
    {"id":"spec-compliance","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":".agents/skills/stage-quality-gate/lib/review-contract.mjs","line":1,"detail":"Canonical interfaces and weights are implemented."}],"findings":[]},
    {"id":"correctness-traceability","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":".agents/skills/stage-quality-gate/tests/review-score.test.mjs","line":1,"detail":"Boundary behavior is deterministic and tested."}],"findings":[]},
    {"id":"security-safety","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":".agents/skills/stage-quality-gate/scripts/score-review.mjs","line":1,"detail":"Inputs are treated as data and paths remain repository-local."}],"findings":[]},
    {"id":"verification-evidence","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":".agents/skills/stage-quality-gate/tests/stage-report.test.mjs","line":1,"detail":"Node tests completed with exit code 0."}],"findings":[]},
    {"id":"maintainability","weight":10,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":".agents/skills/stage-quality-gate/lib/stage-report.mjs","line":1,"detail":"Validation, scoring, and rendering have separate responsibilities."}],"findings":[]},
    {"id":"static-ci","weight":10,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":".agents/skills/stage-quality-gate/scripts/validate-skills.mjs","line":1,"detail":"The gate is dependency-free and local."}],"findings":[]}
  ],
  "criticalFindings": [],
  "summary": "Technical review passes at 90 with current evidence."
}
```

## Blocked example

```json
{
  "schemaVersion": 1,
  "reviewer": "ai-technical",
  "stageId": "static-build",
  "attempt": 1,
  "reviewedCandidateCommit": "0123456789abcdef0123456789abcdef01234567",
  "dimensions": [
    {"id":"spec-compliance","weight":20,"rawScore":3,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"next.config.ts","line":1,"detail":"The requested export interface is incomplete."}],"findings":["Restore the approved static-export configuration."]},
    {"id":"correctness-traceability","weight":20,"rawScore":3,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"src/app/page.tsx","line":1,"detail":"The route depends on a runtime response."}],"findings":["Use build-time data."]},
    {"id":"security-safety","weight":20,"rawScore":4,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"src/app/page.tsx","line":5,"detail":"No secret or personal data is present."}],"findings":[]},
    {"id":"verification-evidence","weight":20,"rawScore":1,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/checks.md","line":4,"detail":"The failed build was recorded as passing."}],"findings":["Record the actual exit code and fix the build."]},
    {"id":"maintainability","weight":10,"rawScore":3,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"src/app/page.tsx","line":1,"detail":"Runtime and rendering responsibilities are coupled."}],"findings":[]},
    {"id":"static-ci","weight":10,"rawScore":1,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/checks.md","line":4,"detail":"The required static build exits 1."}],"findings":["Restore static export and rerun the build."]}
  ],
  "criticalFindings": [
    {
      "id": "BUILD-001",
      "evidence": [{"path":"docs/checks.md","line":4,"detail":"The required build exits 1 but is reported as passing."}],
      "impact": "A broken static export could be pushed as a passing Stage.",
      "requiredFix": "Fix the build and record the actual successful command result."
    }
  ],
  "summary": "Technical review is blocked by failed verification and static export."
}
```
